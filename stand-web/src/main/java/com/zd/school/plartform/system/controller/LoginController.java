package com.zd.school.plartform.system.controller;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.codec.Base64;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.DateUtil;
import com.zd.core.util.ModelUtil;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.model.SysUserLoginLog;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserLoginLogService;
import com.zd.school.plartform.system.service.SysUserService;

@Controller
@RequestMapping("/login")
public class LoginController extends FrameWorkController<SysUser> implements Constant {

	private static final Logger logger = LoggerFactory.getLogger(SysUser.class);
	@Resource
	private SysUserService sysUserService;

	@Resource
	private SysRoleService roleService; // 角色数据服务接口

	@Resource
	private SysUserLoginLogService sysUserLoginLogService;

	@Resource
	private SessionDAO sessionDAO;

	@Resource
	private RedisTemplate<String, Object> redisTemplate;


	@Value("${virtualFileUrl}")
	private String virtualFileUrl;

	// 测试jedis
	// @Resource
	// private RedisTemplate<String, Object> redisTemplate;
	// @Resource
	// private StringRedisTemplate stringRedisTemplate;

	@RequestMapping("/login")
	public void login(SysUser sysUserModel, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		SysUser sysUser = sysUserService.getByProerties("userName", sysUserModel.getUserName());
		// if (sysUser == null || "1".equals(sysUser.getState())) { //
		// 用户名有误或已被禁用
		if (sysUser == null) { // 用户名有误,根据编号进行查询
			sysUser = sysUserService.getByProerties("userNumb", sysUserModel.getUserName());
			if (sysUser == null || "1".equals(sysUser.getState())) {// 根据编号也未查询到
				result.put("result", -1);
				writeJSON(response, jsonBuilder.toJson(result));
				return;
			}
		}else if("1".equals(sysUser.getState())){
			result.put("result", -1);
			writeJSON(response, jsonBuilder.toJson(result));
			return;
		}

		String pwd = Base64.decodeToString(sysUserModel.getUserPwd());

		if (!sysUser.getUserPwd().equals(new Sha256Hash(pwd).toHex())) { // 密码错误
			result.put("result", -2);
			writeJSON(response, jsonBuilder.toJson(result));
			return;
		}
		sysUser.setLoginTime(new Date());
		sysUserService.merge(sysUser);
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		// SecurityUtils.getSubject().getSession().setTimeout(-1000l); //永不过期
		session.setTimeout(1000 * 60 * 30 * 2); // 超时时间为1小时
		// login失败，要捕获相应异常
		try {
			// 执行login之后，会立即执行Realm的getAuthenticationInfo方法，用来判断token信息是否正确。
			subject.login(new UsernamePasswordToken(sysUser.getUserName(), pwd, sysUserModel.isRememberMe()));

			// 判断 用户ID和会话ID是否已经存在数据库中
			String userId = sysUser.getUuid();
			String sessionId = (String) session.getId();

			// 先判断此sessionID是否已经存在，若存在且userid不等于当前的，且没有登记退出时间，则设置为退出
			String updateTime = DateUtil.formatDateTime(new Date());
			String updateHql = "update SysUserLoginLog o set o.offlineDate=CONVERT(datetime,'" + updateTime
					+ "'),o.offlineIntro='切换账户退出' where o.offlineDate is null and o.isDelete=0 and o.sessionId='"
					+ sessionId + "' and o.userId!='" + userId + "'";
			sysUserLoginLogService.doExecuteCountByHql(updateHql);

			if (!sysUserLoginLogService.IsFieldExist("userId", userId, "-1", " o.sessionId='" + sessionId + "'")) {
				SysUserLoginLog loginLog = new SysUserLoginLog();
				loginLog.setUserId(userId);
				loginLog.setSessionId(sessionId);
				loginLog.setUserName(sysUser.getUserName());
				loginLog.setIpHost(session.getHost());
				loginLog.setLoginDate(session.getLastAccessTime());
				loginLog.setLastAccessDate(session.getLastAccessTime());
				sysUserLoginLogService.merge(loginLog);
			}
			/*
			 * 不处理重复登录 else{ String hql=
			 * "from SysUserLoginLog o where o.userId=? and o.sessionId=? and o.isDelete=0 order by createTime desc"
			 * ; SysUserLoginLog loginLog =
			 * sysUserLoginLogService.getEntityByHql(hql, userId,sessionId); }
			 */

		} catch (AuthenticationException e) { // 这里只捕获了AuthenticationException这个超类，其他更详细的异常子类，暂时不处理
			result.put("result", -2);
			writeJSON(response, jsonBuilder.toJson(result));
			return;
		}
		
		Calendar a = Calendar.getInstance();
		Integer justYear = a.get(Calendar.YEAR); // 当前年份
		Integer studyYear = a.get(Calendar.YEAR); // 当前年份
		Integer studyMonth = a.get(Calendar.MONTH) + 1; // 当前月份
		Integer i = justYear + 1;
		String studyYearName = justYear.toString() + "-" + i.toString() + "学年";
		String semester = "";
		if (studyMonth >= 8) {
			// 如果是8月份以后为当年-次年学年的上学期
			semester = "2";
		} else if (studyMonth >= 2) {
			// 如果是2月份 及以上，为去年-当年的下学期
			semester = "1";
			studyYear = justYear - 1;
			studyYearName = studyYear.toString() + "-" + justYear.toString() + "学年";
		} else {
			// 如果是1月份，为去年-当年的上学期
			semester = "2";
			studyYear = justYear - 1;
			studyYearName = studyYear.toString() + "-" + justYear.toString() + "学年";
		}

		sysUser.setStudyYear(studyYear);
		sysUser.setSemester(semester);
		sysUser.setStudyYearname(studyYearName);
		

		session.setAttribute(SESSION_SYS_USER, sysUser);

		String roleKeys = sysUser.getSysRoles().stream().filter(x -> x.getIsDelete() == 0).map(x -> x.getRoleCode())
				.collect(Collectors.joining(","));
		session.setAttribute(SESSION_ROLE_KEY, roleKeys);

		// 如果此用户是超级管理员，就不用获取功能权限列表,在过滤器和前端中直接跳过鉴权
		// SysRole adminRole=roleService.get(AdminType.ADMIN_ROLE_ID);
		if (roleKeys.indexOf(AdminType.ADMIN_ROLE_NAME) != -1) {
			session.setAttribute(SESSION_SYS_ISADMIN, 1);	
		} else {
			// 将权限数据保存到session中
			HashMap<String, Set<String>> userRMP_Map = sysUserService.getUserRoleMenuPermission(sysUser, session);
			if (userRMP_Map != null) {
				session.setAttribute(SESSION_SYS_AUTH, userRMP_Map.get("auth"));
				session.setAttribute(SESSION_SYS_BTN, userRMP_Map.get("btn"));
			}
			
			session.setAttribute(SESSION_SYS_ISADMIN, 0);
			
			//学校管理员，理应可以查看所有数据
			if(roleKeys.indexOf(AdminType.SCHOOLADMIN_ROLE_NAME) != -1)
				session.setAttribute(SESSION_SYS_ISSCHOOLADMIN, 1);
			else
				session.setAttribute(SESSION_SYS_ISSCHOOLADMIN, 0);
		}
		
		//图片的虚拟目录
		session.setAttribute("SESSION_SYS_VFU",virtualFileUrl);

		result.put("result", 1);
		writeJSON(response, jsonBuilder.toJson(result));
	}

	@RequestMapping("/getCurrentUser")
	public void getCurrentUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
		SysUser sysUser = getCurrentSysUser();
		if (sysUser != null) {
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(sysUser)));
		} else
			writeJSON(response, jsonBuilder.returnFailureJson("'没有得到登录用户'"));
	}

	@RequestMapping("/desktop")
	public ModelAndView desktop(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		if (session.getAttribute(SESSION_SYS_USER) == null) {
			return new ModelAndView();
		} else {
			SysUser sysUser = (SysUser) session.getAttribute(SESSION_SYS_USER);
			try {
				// List<Authority> allMenuList =
				// authorityService.queryAllMenuList(globalRoleKey);
				return new ModelAndView("redirect:/index.jsp", "authorityList", null);
			} catch (Exception e) {
				logger.error(e.toString());
				return new ModelAndView();
			}
		}
	}

	@RequestMapping("/changepwd")
	public void changePwd(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String userName = request.getParameter("userName");
		String userPwd = request.getParameter("oldPwd");
		String newUserPwd = request.getParameter("newPwd");
		String[] propName = { "userName", "userPwd" };
		String[] propValue = { userName, new Sha256Hash(userPwd).toHex() };
		if (userPwd.equals(newUserPwd)) {
			writeJSON(response, jsonBuilder.returnFailureJson("0"));
			return;
		}
		SysUser sysUser = sysUserService.getByProerties(propName, propValue);
		if (ModelUtil.isNotNull(sysUser)) {
			// 更新到数据库
			sysUserService.updateByProperties(propName, propValue, "userPwd", new Sha256Hash(newUserPwd).toHex());
			// 返回处理结果
			writeJSON(response, jsonBuilder.returnSuccessJson("1"));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("-1"));
		}
	}
	/*
	 * @RequestMapping("/loginout") public void logout(HttpServletRequest
	 * request, HttpServletResponse response) throws IOException { //因为配置拦截中加入了
	 * /login/logout = logout ；所以不需要手动去执行logout
	 * //SecurityUtils.getSubject().logout();
	 * response.sendRedirect("login.jsp"); }
	 */

	@RequestMapping("/getOnlineCount")
	public void getOnlineCount(HttpServletRequest request, HttpServletResponse response) throws IOException {
		int count = sessionDAO.getActiveSessions().size();
		/*
		 * 测试使用redis后，执行存储过程是否变缓慢 StringBuffer sql = new StringBuffer(
		 * "EXEC [dbo].[test_sql] "); List<Map<String, Object>>
		 * lists=sysUserService.queryMapBySql(sql.toString());
		 * System.out.println(lists);
		 */
		/*
		 * redis测试操作，string类型 在配置文件中设定了ValueSerializer的默认序列化方式为
		 * JdkSerializationRedisSerializer
		 */
		// 存入
		// redisTemplate.setValueSerializer(new
		// JdkSerializationRedisSerializer());
		// ValueOperations<String, SysUser> stringOper=
		// redisTemplate.opsForValue();
		// stringOper.set("zzk", new SysUser());
		// //取出
		// SysUser ss=stringOper.get("zzk");
		// System.out.println(ss);
		//
		// /*
		// * redis测试操作，存入json数据格式(推荐)
		// * */
		// //设置value的序列化方式为json
		// redisTemplate.setValueSerializer(new
		// Jackson2JsonRedisSerializer(SysUser.class));
		// //存入类对象
		// ValueOperations<String, SysUser> stringOper2=
		// redisTemplate.opsForValue();
		// stringOper2.set("zzkjson", new SysUser());
		// //取出json字符串
		// String json=stringRedisTemplate.opsForValue().get("zzkjson");
		// System.out.println(json);
		//
		// //测试list类型,若要使用实体的方式取出，必须把value序列化方式设置回jdk序列化，并且key里面的值必须序列化格式一致
		// redisTemplate.setValueSerializer(new
		// JdkSerializationRedisSerializer());
		// ListOperations<String, SysUser> listOper =
		// redisTemplate.opsForList();
		// listOper.leftPush("czc", new SysUser());
		// listOper.leftPush("czc", new SysUser());
		// System.out.println(listOper.range("czc", 0, -1));
		//
		// //测试set类型
		// SetOperations<String, SysUser> setOper = redisTemplate.opsForSet();
		// setOper.add("zzk2", new SysUser());
		// setOper.add("zzk2", new SysUser());
		// System.out.println(setOper.members("zzk2"));
		//
		//
		// //测试hash类型
		// HashOperations<String, String, SysUser> hashOper =
		// redisTemplate.opsForHash();
		// hashOper.put("zzk3", "o1", new SysUser());
		// hashOper.put("zzk3", "o2", new SysUser());
		// hashOper.put("zzk3", "o3", new SysUser());
		// hashOper.put("zzk3", "o4", new SysUser());
		// System.out.println(hashOper.values("zzk3"));
		//
		//
		// //测试zset类型
		// ZSetOperations<String, SysUser> zsetOper =
		// redisTemplate.opsForZSet();
		// zsetOper.add("zzk4", new SysUser(), 1);
		// zsetOper.add("zzk4", new SysUser(), 2);
		// zsetOper.add("zzk4", new SysUser(), 10);
		// zsetOper.add("zzk4", new SysUser(), 2);
		// zsetOper.add("zzk4", new SysUser(), 3);
		// zsetOper.add("zzk4", new SysUser(), 3);
		// System.out.println(zsetOper.rangeByScoreWithScores("zzk4", 0, 1000));
		//
		// //简单的字符串数据操作
		// ValueOperations<String,String> stringOper3 =
		// stringRedisTemplate.opsForValue();
		// stringOper3.set("zzz1", "1");
		// stringOper3.set("zzz2", "asd");
		// System.out.println(stringOper3.get("zzz1"));
		// System.out.println(stringOper3.get("zzz2"));

		writeJSON(response, jsonBuilder.returnSuccessJson(String.valueOf(count)));
	}

	/**
	 * 清除数据字典缓存
	 *
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/clearCache")
	public void clearCache(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// DictionaryItemCache.clearAll();
		SysUser sysUser = getCurrentSysUser();
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		hashOper.delete("userMenuTree", sysUser.getUuid());
		hashOper.delete("userAuth", sysUser.getUuid());
		hashOper.delete("userBtn", sysUser.getUuid());

		/**
		 * 删除部门权限树的缓存数据 在什么情况下执行？ 1.在给用户添加、删除部门岗位时(SysUserdeptjobServiceImpl)
		 * 2.在给用户设置部门权限的时候(SysDeptRightServiceImpl)
		 * 3.设置上级部门主管岗位的时候(SysDeptjobServiceImpl)
		 * 4.部门岗位信息，当存在用户的时候，就不能被删除，故删除部门岗位时不执行
		 * 5.在进行增加、删除、编辑部门的时候，就删除当前所有用户的缓存，以免产生误会(SysOrgServiceImpl)
		 * 6.在进行添加、删除教师任课时，也会删除用户的缓存（JwCourseteacherServiceImpl）
		 * 7.在进行添加、删除班主任时，也会删除用户的缓存（JwClassteacherServiceImpl）
		 */
		hashOper.delete("userRightDeptTree", sysUser.getUuid());
		hashOper.delete("userRightDeptClassTree", sysUser.getUuid());
		hashOper.delete("userRightDeptDisciplineTree", sysUser.getUuid());
		
		writeJSON(response, jsonBuilder.returnSuccessJson("\"缓存清除成功\""));
	}

}

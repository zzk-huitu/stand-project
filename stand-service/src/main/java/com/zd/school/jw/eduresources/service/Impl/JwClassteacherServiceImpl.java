package com.zd.school.jw.eduresources.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.jw.eduresources.dao.JwClassteacherDao;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.plartform.baseset.model.BaseDeptjob;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.baseset.model.BaseUserdeptjob;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysDeptjobService;
import com.zd.school.plartform.system.service.SysJobService;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.plartform.system.service.SysUserdeptjobService;
import com.zd.school.redis.service.DeptRedisService;
import com.zd.school.redis.service.UserRedisService;

/**
 * 
 * ClassName: JwClassteacherServiceImpl Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: 班主任信息实体Service接口实现类. date: 2016-08-22
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class JwClassteacherServiceImpl extends BaseServiceImpl<JwClassteacher> implements JwClassteacherService {

    @Resource
    public void setJwClassteacherDao(JwClassteacherDao dao) {
        this.dao = dao;
    }

    @Resource
    private SysOrgService orgService;

    @Resource
    private SysJobService jobService;

    @Resource
    private SysUserService userService;

    @Resource
    private SysRoleService roleService;

    @Resource
	private SysDeptjobService deptJobService;

	@Resource
	private SysUserdeptjobService userDeptJobService;
	
	@Resource
	private DeptRedisService deptRedisService;
	
    /**
	 * 
	 * getClassLeader:获取指定学生的所在班级的班主任
	 *
	 * @author luoyibo
	 * @param userId
	 * @return String
	 * @throws @since
	 *             JDK 1.8
	 */
	@Override
	public String getClassLeader(String userId) {
		String classLeader = "";
		String sql = "EXECUTE JW_P_GETCLASSTEACHER '" + userId + "'";

		List lists = this.queryEntityBySql(sql, null);
		classLeader = lists.get(0).toString();

		return classLeader;
	}

	@Override
	public String getClassLeaderList(String userId) {
		String classLeader = "";
		String sql = "EXECUTE JW_P_GETCLASSTEACHER '" + userId + "'";

		try {
			List lists = this.dao.queryEntityBySql(sql);
			Set set = new HashSet<>(lists);
			lists = new ArrayList<>(set);
			for (Object object : lists) {
				classLeader += object + ",";
			}
			classLeader = classLeader.substring(0, classLeader.length() - 1);
		} catch (Exception e) {
			e.printStackTrace();
			classLeader = "-1";
		}

		return classLeader;
	}

	@Override
	public JwClassteacher doAddClassTeacher(JwClassteacher entity, SysUser currentUser)
			throws IllegalAccessException, InvocationTargetException {

		JwClassteacher perEntity = new JwClassteacher();
		BeanUtils.copyPropertiesExceptNull(entity, perEntity);
		// 生成默认的orderindex
		Integer orderIndex = this.getDefaultOrderIndex(entity);
		entity.setOrderIndex(orderIndex);// 排序
		// 增加时要设置创建人
		entity.setCreateUser(currentUser.getXm()); // 创建人
		// 持久化到数据库
		entity = this.merge(entity);

		/*暂不处理年级组长问题
		JwGradeclassteacher gcTeacher = new JwGradeclassteacher(entity.getUuid());
		BeanUtils.copyPropertiesExceptNull(gcTeacher, entity);

		gcTeacher.setTeaType("1");
		gcTeacher.setCategory(entity.getCategory() + 2);
		gcTeacher.setGraiId(entity.getClaiId());
		gcTeacher.setStudyYear(entity.getStudyYear());
		gcTeacherService.persist(gcTeacher);
		 */
		
		// 增加后要同步此人的岗位数据
		String teacherId = entity.getTteacId(); // 教师ID
		String deptId = entity.getClaiId(); // 班级ID,对应部门ID

		SysUser user = userService.get(teacherId);
		// 设置增加默认的班主任角色
		Set<SysRole> theUserRole = user.getSysRoles();
		SysRole role = roleService.getByProerties(new String[]{"roleCode","isDelete"},new Object[]{ "CLASSLEADER",0});
		if (role!=null) {
			theUserRole.add(role);
			user.setSysRoles(theUserRole);
		}

		//设置部门岗位
		String[] propName = new String[] { "jobName", "isDelete" };
		Object[] propValue = new Object[] { "班主任", 0 };
		BaseJob job = jobService.getByProerties(propName, propValue);
		if(job!=null){
			propName = new String[] { "jobId", "deptId", "isDelete" };
			propValue = new Object[] { job.getUuid(), deptId, 0 };
			BaseDeptjob deptjob = deptJobService.getByProerties(propName, propValue);
			
			if(deptjob!=null){
				propName = new String[] { "userId", "deptjobId", "isDelete" };
				propValue = new Object[] { user.getUuid(), deptjob.getUuid(), 0 };
				BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
				if(userdeptjob==null){
					userdeptjob = new BaseUserdeptjob();
					userdeptjob.setCreateUser(currentUser.getXm());
					userdeptjob.setCreateTime(new Date());
					userdeptjob.setUserId(user.getUuid());
					userdeptjob.setDeptId(deptId);
					userdeptjob.setJobId(job.getUuid());
					userdeptjob.setDeptjobId(deptjob.getUuid());
					userdeptjob.setMasterDept(0);
					userDeptJobService.merge(userdeptjob);
					
				}				
			}
			
		}
		
		user.setUpdateTime(new Date());
		user.setUpdateUser(currentUser.getXm());
		userService.merge(user);
		
		//清除这个用户的部门树缓存，以至于下次读取时更新缓存
		deptRedisService.deleteDeptTreeByUsers(user.getUuid());
		
		return entity;
	}

	/**
	 * 逻辑删除班主任信息
	 */
	@Override
	public Boolean doDelete(String delIds, SysUser currentUser) {
		Boolean result = false;
		String[] dels = delIds.split(",");
		List<JwClassteacher> list = this.queryByProerties("uuid", dels);
		for (JwClassteacher gt : list) {
			gt.setEndTime(new Date());
			gt.setIsDelete(1);
			gt.setUpdateTime(new Date());
			gt.setUpdateUser(currentUser.getXm());
			this.merge(gt);
			
			String[] propName = new String[] { "jobName", "isDelete" };
			Object[] propValue = new Object[] { "班主任", 0 };
			BaseJob job = jobService.getByProerties(propName, propValue);
			if(job!=null){
				propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
				propValue = new Object[] { gt.getTteacId(), gt.getClaiId(), job.getUuid(), 0 };
				BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
				if(userdeptjob!=null){
					userdeptjob.setIsDelete(1);
					userdeptjob.setUpdateTime(new Date());
					userdeptjob.setUpdateUser(currentUser.getXm());
					userDeptJobService.merge(userdeptjob);
				}			
			}
			
			
			String teacherId = gt.getTteacId(); // 教师ID
			// 根据老师是否还担任其它班级的班主任确定是否取消其班主任岗位、角色
			String where = " o.isDelete=0 ";
			Boolean isExit = this.IsFieldExist("tteacId", teacherId, "-1", where);
			if (!isExit) {
				// 移除班主任角色
				SysUser user = userService.get(teacherId);
				Set<SysRole> theUserRole = user.getSysRoles();
				SysRole role = roleService.getByProerties(new String[]{"roleCode","isDelete"},new Object[]{ "CLASSLEADER",0});
				if (role!=null) {
					theUserRole.remove(role);
					user.setSysRoles(theUserRole);
				}

				user.setUpdateTime(new Date());
				user.setUpdateUser(currentUser.getXm());
				userService.merge(user);
			}		
			
			//清除这个用户的部门树缓存，以至于下次读取时更新缓存
			deptRedisService.deleteDeptTreeByUsers(gt.getTteacId());
			
		}
		
		
		result = true;
		return result;
	}

	/**
	 * 物理删除班主任信息
	 */
	@Override
	public boolean doDeleteByPK(String delIds) {
		Boolean result = false;
		String[] dels = delIds.split(",");
		List<JwClassteacher> list = this.queryByProerties("uuid", dels);
		for (JwClassteacher gt : list) {
			this.delete(gt);
			
			String[] propName = new String[] { "jobName", "isDelete" };
			Object[] propValue = new Object[] { "班主任", 0 };
			BaseJob job = jobService.getByProerties(propName, propValue);
			if(job!=null){
				propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
				propValue = new Object[] { gt.getTteacId(), gt.getClaiId(), job.getUuid(), 0 };
				BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
				if(userdeptjob!=null)
					userDeptJobService.delete(userdeptjob);
			}
			
			String teacherId = gt.getTteacId(); // 教师ID
			// 根据老师是否还担任其它班级的班主任确定是否取消其班主任岗位、角色
			String where = " o.isDelete=0 ";
			Boolean isExit = this.IsFieldExist("tteacId", teacherId, "-1", where);
			if (!isExit) {
				// 移除班主任角色
				SysUser user = userService.get(teacherId);
				Set<SysRole> theUserRole = user.getSysRoles();
				SysRole role = roleService.getByProerties(new String[]{"roleCode","isDelete"},new Object[]{ "CLASSLEADER",0});
				if (role!=null) {
					theUserRole.remove(role);
					user.setSysRoles(theUserRole);
				}
				
				userService.merge(user);
			}

			//清除这个用户的部门树缓存，以至于下次读取时更新缓存
			deptRedisService.deleteDeptTreeByUsers(gt.getTteacId());
			
		}
		result = true;
		return result;
	}	


}
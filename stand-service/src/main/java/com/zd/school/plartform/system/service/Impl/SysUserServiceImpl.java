package com.zd.school.plartform.system.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.apache.shiro.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.model.ImportNotInfo;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.DateUtil;
import com.zd.core.util.SortListUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseDicitem;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.service.BaseDicitemService;
import com.zd.school.plartform.system.dao.SysUserDao;
import com.zd.school.plartform.system.model.CardUserInfoToUP;
import com.zd.school.plartform.system.model.SysMenuPermission;
import com.zd.school.plartform.system.model.SysPermission;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.model.SysUserToUP;
import com.zd.school.plartform.system.service.SysMenuPermissionService;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.plartform.system.service.SysUserdeptjobService;
import com.zd.school.redis.service.UserRedisService;
import com.zd.school.student.studentinfo.model.StuBaseinfo;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

/**
 * 
 * ClassName: BaseTUserServiceImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 用户管理实体Service接口实现类. date: 2016-07-17
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class SysUserServiceImpl extends BaseServiceImpl<SysUser> implements SysUserService {

	private static Logger logger = Logger.getLogger(SysUserServiceImpl.class);

	@Resource
	public void setBaseTUserDao(SysUserDao dao) {
		this.dao = dao;
	}

	@Resource
	private SysRoleService roleService; // 角色数据服务接口

	@Resource
	private SysOrgService orgService; // 部门数据服务接口

	@Resource
	private TeaTeacherbaseService teacherService;

	@Resource
	private SysMenuPermissionService menuPermissionService;

	@Resource
	private UserRedisService userRedisService;

	@Resource
	private BaseDicitemService dicitemService;
	
	@Resource
	private SysUserdeptjobService userDeptJobService;

	
	@Override
	public SysUser doAddUser(SysUser entity, SysUser currentUser/*, String deptJobId*/) throws Exception, InvocationTargetException {

		String userPwd = entity.getUserPwd();
		userPwd = new Sha256Hash(userPwd).toHex();

		// 根据身份来做不同的处理
		SysUser saveEntity = null;
		String category = entity.getCategory();
		if (category.equals("1")) { // 老师
			TeaTeacherbase t = new TeaTeacherbase();
			saveEntity = t;
			//增加角色
			Set<SysRole>  theUserRoler = saveEntity.getSysRoles();
			SysRole role = roleService.getByProerties(new String[]{"roleCode","isDelete"}, new Object[]{"TEACHER",0});
			
			if(role!=null){
				theUserRoler.add(role);
				saveEntity.setSysRoles(theUserRoler);
			}

		} else if (category.equals("2")) { // 学生
			StuBaseinfo t = new StuBaseinfo();
			// t.setSchoolId("2851655E-3390-4B80-B00C-52C7CA62CB39");
			// t.setClassId(entity.getDeptId());

			saveEntity = t;
			//增加角色
			Set<SysRole>  theUserRoler = saveEntity.getSysRoles();
			SysRole role = roleService.getByProerties(new String[]{"roleCode","isDelete"}, new Object[]{"STUDENT",0});
			
			if(role!=null){
				theUserRoler.add(role);
				saveEntity.setSysRoles(theUserRoler);
			}

		} else {
			saveEntity = new SysUser();
		}

		entity.setUuid(null);
		BeanUtils.copyPropertiesExceptNull(saveEntity, entity);

		// 处理用户所属的角色
		/*
		 * if (roleId.length() > 0) { String[] roleList = roleId.split(",");
		 * Set<SysRole> isUserRoles = entity.getSysRoles(); for (String ids :
		 * roleList) { SysRole role = roleService.get(ids);
		 * isUserRoles.add(role); }
		 * 
		 * entity.setSysRoles(isUserRoles); }
		 */
		saveEntity.setSchoolId(AdminType.ADMIN_ORG_ID);
		saveEntity.setUserPwd(userPwd);
		saveEntity.setIssystem(1);
		saveEntity.setIsHidden("0");
		saveEntity.setCreateUser(currentUser.getXm()); // 创建人
		saveEntity.setRightType(2);
		entity = this.merge(saveEntity);
		
		String userIds = entity.getUuid();
		String deptJobId = entity.getDeptId();
		userDeptJobService.doAddUserToDeptJob( deptJobId, userIds, currentUser);

		return entity;
	}

	@Override
	public SysUser doUpdateUser(SysUser entity, SysUser currentUser) throws Exception, InvocationTargetException {

		// 先拿到已持久化的实体
		SysUser perEntity = this.get(entity.getUuid());

		Set<SysRole> isUserRoles = perEntity.getSysRoles();
		/* Set<BaseOrg> userDept = perEntity.getUserDepts(); */

		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);

		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
		perEntity.setSysRoles(isUserRoles);
		/* perEntity.setUserDepts(userDept); */
		// entity = thisService.merge(perEntity);// 执行修改方法

		// 处理用户所属的角色
		/*
		 * if (roleId.length() > 0) { String[] roleList = roleId.split(",");
		 * Set<SysRole> isUserRoles = entity.getSysRoles(); //先清除所有的角色
		 * isUserRoles.removeAll(isUserRoles); for (String ids : roleList) {
		 * SysRole role = roleService.get(ids); isUserRoles.add(role); }
		 * 
		 * perEntity.setSysRoles(isUserRoles); }
		 */
		// 持久化到数据库
		entity = this.merge(perEntity);

		// //切换数据源
		// DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Up6);
		//
		// String sqlInsert = "insert into
		// Tc_Employee(UserId,DepartmentID,EmployeeName,EmployeeStrID,SID,EmployeePWD,SexID,identifier,cardid,CardTypeID,EmployeeStatusID,PositionId)
		// "
		// + "values('" + entity.getUuid() + "','1','"
		// + currentUser.getXm() + "'," + "'" + currentUser.getJobId() +
		// "','','','"
		// + currentUser.getXbm() + "','" + currentUser.getSfzjh() +
		// "',0,1,24,19)";
		//
		// int row=this.doExecuteCountBySql(sqlInsert.toString());
		//
		// DBContextHolder.clearDBType();

		return entity;
	}

	@Override
	public Boolean doDeleteUserRole(String userId, String delRoleIds, SysUser currentUser) {
		Boolean delReurn = false;
		// 获取当前用户的信息
		SysUser theUser = this.get(userId);
		Set<SysRole> theUserRole = theUser.getSysRoles();

		String[] delId = delRoleIds.split(",");
		List<SysRole> delRoles = roleService.queryByProerties("uuid", delId);

		theUserRole.removeAll(delRoles);

		theUser.setSysRoles(theUserRole);

		this.merge(theUser);

		delReurn = true;
		// TODO Auto-generated method stub
		return delReurn;
	}

	@Override
	public Boolean doAddUserRole(String userId, String addRoleIds, SysUser currentUser) {

		Boolean addResult = false;
		// 获取当前用户的信息
		SysUser theUser = this.get(userId);
		Set<SysRole> theUserRole = theUser.getSysRoles();

		String[] addId = addRoleIds.split(",");
		List<SysRole> addRoles = roleService.queryByProerties("uuid", addId);

		theUserRole.addAll(addRoles);

		theUser.setSysRoles(theUserRole);

		this.merge(theUser);

		addResult = true;

		return addResult;
	}

	@SuppressWarnings("unchecked")
	@Override
	public QueryResult<SysUser> getDeptUser(Integer start, Integer limit, String sort, String filter, Boolean isDelete,
			String userIds, SysUser currentUser) {

		String sortSql = StringUtils.convertSortToSql(sort);
		String userId = userIds;
		StringBuffer hql = new StringBuffer();
		String countHql = "";
		String filterSql = "";
		if (StringUtils.isEmpty(userIds)) {
			return null;
		} else {
			if (!StringUtils.isEmpty(filter)) {
				filterSql = StringUtils.convertFilterToSql(filter);
			}
			/*
			 * BaseOrg org = orgService.get(deptId); deptIds = org.getTreeIds();
			 * hql.append(
			 * " from SysUser as o inner join fetch o.userDepts as r where r.treeIds like '"
			 * + deptIds + "%' and r.isDelete=0 "); if (isDelete) hql.append(
			 * " and o.isDelete=0 "); hql.append(filterSql); hql.append(
			 * " order by  o.jobCode "); QueryResult<SysUser> qr =
			 * this.queryPageResult(hql.toString(), start, limit);
			 */
			hql.append(" from SysUser o  where o.uuid in(" + userId + ")");
			if (isDelete)
				hql.append(" and o.isDelete=0 ");
			hql.append(filterSql);
			
			if(StringUtils.isNotEmpty(sortSql))
				hql.append(" order by "+sortSql);
			QueryResult<SysUser> qr = this.queryResult(hql.toString(), start, limit);

			return qr;
		}
	}

	/**
	 * 
	 * batchSetDept:批量设置用户的所属部门.
	 *
	 * @author luoyibo
	 * @param deptId
	 * @param userIds
	 * @param cuurentUser
	 * @return Boolean
	 * @throws @since
	 *             JDK 1.8
	 */
	// @Override
	// public Boolean batchSetDept(String deptId, String userIds, SysUser
	// cuurentUser) {
	// Boolean reResult = false;
	// String[] delId = userIds.split(",");
	// List<SysUser> listUser = this.queryByProerties("uuid", delId);
	// for (SysUser sysUser : listUser) {
	// Set<BaseOrg> userDept = sysUser.getUserDepts();
	// BaseOrg org = orgService.get(deptId);
	// BaseOrg tempOrg = orgService.get("058b21fe-b37f-41c9-ad71-091f97201ff8");
	// userDept.remove(tempOrg);
	// userDept.add(org);
	//
	// sysUser.setUserDepts(userDept);
	// sysUser.setUpdateTime(new Date());
	// sysUser.setUpdateUser(cuurentUser.getXm());
	//
	// this.merge(sysUser);
	// reResult = true;
	// }
	// return reResult;
	// }

	@Override
	public List<SysUser> getUserByRoleName(String roleName) {
		/*
		 * String sql =
		 * "SELECT USER_ID FROM SYS_T_USER WHERE USER_ID IN(SELECT USER_ID FROM SYS_T_ROLEUSER WHERE ROLE_ID IN(SELECT ROLE_ID FROM SYS_T_ROLE WHERE ROLE_NAME='"
		 * + roleName + "'))"; List<Object[]> list = this.queryObjectBySql(sql);
		 * List<SysUser> users = new ArrayList<SysUser>(); for (int i = 0; i <
		 * list.size(); i++) { String userid = list.get(i) + "";
		 * users.add(this.get(userid)); }
		 */
		String hql = "from SysUser as u inner join fetch u.sysRoles as r where r.roleName='" + roleName
				+ "' and r.isDelete=0 and u.isDelete=0";
		return this.queryByHql(hql);
	}

	@Override
	public Boolean doDeleteUser(String delIds, String orgId, SysUser currentUser) {
		String[] ids = delIds.split(",");
		boolean flag = false;
		/*
		 * for (String id : ids) { SysUser user = this.get(id); BaseOrg org =
		 * orgService.get(orgId); Set<BaseOrg> userDept = user.getUserDepts();
		 * userDept.remove(org);
		 * 
		 * user.setUpdateTime(new Date());
		 * user.setUpdateUser(currentUser.getXm()); user.setUserDepts(userDept);
		 * 
		 * this.merge(user);
		 * 
		 * flag = true; }
		 */
		// TODO Auto-generated method stub
		return flag;
	}

	@Override
	public QueryResult<SysUser> getUserByRoleId(String roleId) {
		QueryResult<SysUser> qr = new QueryResult<SysUser>();
		String hql = "from SysUser as u inner join fetch u.sysRoles as r where r.uuid='" + roleId
				+ "' and r.isDelete=0 and u.isDelete=0 ";
		List<SysUser> list = this.queryByHql(hql);

		SortListUtil<SysUser> sortJob = new SortListUtil<SysUser>();
		sortJob.Sort(list, "jobCode", "String");
		qr.setResultList(list);
		qr.setTotalCount((long) list.size());

		return qr;
		// List<SysUser> newList = new ArrayList<SysUser>();
		// if (list.size() > 0) {
		// StringBuffer sbJobName = new StringBuffer();
		// for (SysUser user : list) {
		// TeaTeacherbase teacherbase = teacherService.get(user.getUuid());
		// String jobInfo = teacherService.getTeacherJobs(teacherbase);
		// String[] strings = jobInfo.split(",");
		// user.setJobId(strings[0]);
		// user.setJobName(strings[1]);
		//
		// String deptInfo = teacherService.getTeacherDepts(teacherbase);
		// strings = deptInfo.split(",");
		// user.setDeptName(strings[1]);
		// newList.add(user);
		// }
		// qr.setResultList(newList);
		// qr.setTotalCount((long) list.size());
		// return qr;
		// } else
		// return null;
	}

	@Override
	public int syncUserInfoToUP(SysUserToUP sysUserInfo, String userId) {
		int row = 0;
		try {
			// 1.查询该数据源中的此用户的信息
			String sql = "select top 1 UserId as userId,convert(varchar,EmployeeID) as employeeId,DepartmentID as departmentId,"
					+ " convert(varchar(36),EmployeeName) as employeeName,"
					+ " employeeStrId,sid,convert(varchar(1),sexId) sexId,identifier " + " from Tc_Employee "
					+ " where UserId='" + userId + "'";

			List<SysUserToUP> upUserInfos = this.queryEntityBySql(sql, SysUserToUP.class);

			// 2.判断用户信息该作哪种处理
			if (upUserInfos.isEmpty()) { // 若UP没有此数据，则增加
				if (sysUserInfo != null) {
					String sqlInsert = "insert into Tc_Employee(UserId,DepartmentID,EmployeeName,EmployeeStrID,SID,EmployeePWD,SexID,identifier,cardid,CardTypeID,EmployeeStatusID) "
							+ "values('" + sysUserInfo.getUserId() + "','" + sysUserInfo.getDepartmentId() + "','"
							+ sysUserInfo.getEmployeeName() + "'," + "'" + sysUserInfo.getEmployeeStrId() + "','"
							+ sysUserInfo.getSid() + "','" + sysUserInfo.getEmployeePwd() + "','"
							+ sysUserInfo.getSexId() + "','" + sysUserInfo.getIdentifier() + "',0,1,24)";

					row = this.doExecuteCountBySql(sqlInsert);
				}
			} else { // 若存在，则判断是修改还是删除
				SysUserToUP upUserInfo = upUserInfos.get(0);

				if (sysUserInfo == null) { // 没有此人数据，则删除
					String sqlDelete = "update Tc_Employee set EmployeeStatusID='26' where UserId='" + userId + "'";// 逻辑删除
					row = this.doExecuteCountBySql(sqlDelete);

				} else { // 若数据都存在，则判断是否有修改
					/*
					 * web平台中不维护卡片信息，故注释掉 if
					 * (!sysUserInfo.getCardState().equals("0")) { //
					 * 预设：CardState!=0;卡片状态，在web系统中强行设置为退卡状态 String sqlDelete =
					 * " delete from TC_Card_Bags where EMPLOYEEID='" +
					 * upUserInfo.getEmployeeId() + "'"; // 物理删除 //
					 * this.getExecuteCountBySql(sqlDelete);
					 * 
					 * sqlDelete += " delete from TC_Card where EMPLOYEEID='" +
					 * upUserInfo.getEmployeeId() + "'"; // 物理删除 //
					 * this.getExecuteCountBySql(sqlDelete);
					 * 
					 * sqlDelete +=
					 * " delete from Tc_Employee where EMPLOYEEID='" +
					 * upUserInfo.getEmployeeId() + "'"; // 物理删除
					 * 
					 * row = this.getExecuteCountBySql(sqlDelete);
					 * 
					 * } else
					 */
					if (!sysUserInfo.equals(upUserInfo)) { // 对比部分数据是否一致
						String sqlUpdate = " update Tc_Employee set DepartmentID='" + sysUserInfo.getDepartmentId()
								+ "'," + "EmployeeName='" + sysUserInfo.getEmployeeName() + "',EmployeeStrID='"
								+ sysUserInfo.getEmployeeStrId() + "'," + "SexID='" + sysUserInfo.getSexId()
								+ "',identifier='" + sysUserInfo.getIdentifier() + "' where UserId='" + userId + "'";

						row = this.doExecuteCountBySql(sqlUpdate);
					}
				}
			}

		} catch (Exception e) {
			row = -1;
		}

		return row;
	}

	@Override
	public int syncUserInfoToAllUP(List<SysUserToUP> userInfos, String departmentId) {
		int row = 0;
		try {
			// 1.查询该数据源中的此用户的信息
			String sql = "select UserId as userId,convert(varchar,EmployeeID) as employeeId,DepartmentID as departmentId,"
					+ " convert(varchar(36),EmployeeName) as employeeName,"
					+ " employeeStrId,sid,convert(varchar(1),sexId) sexId,identifier, convert(varchar(36),employeeTel) as employeeTel "
					+ " from Tc_Employee ";
			// + " where DepartmentID='"+departmentId+"'"
			// + " order by userId asc";

			if (departmentId != null) // 当此值为具体的值的时候，表明同步的是某个班级、部门的人员
				sql += " where DepartmentID='" + departmentId + "'";

			sql += " order by userId asc";

			List<SysUserToUP> upUserInfos = this.queryEntityBySql(sql, SysUserToUP.class);

			// 循环对比
			SysUserToUP currentUser = null;
			SysUserToUP upUser = null;
			boolean isExist = false;
			StringBuffer sqlSb = new StringBuffer();
			for (int i = 0; i < userInfos.size(); i++) {
				currentUser = userInfos.get(i);
				isExist = false;

				for (int j = 0; j < upUserInfos.size(); j++) {
					upUser = upUserInfos.get(j);
					if (currentUser.getUserId().equals(upUser.getUserId())) {
						// 执行代码
						isExist = true;
						if (currentUser.getIsDelete() == 1) {
							// sqlDelete = "delete from Tc_Employee where
							// UserId='" + UserId + "'"; 物理删除
							// 现在每次同步都会更新这个值，理应判断之后就不同步的，但是影响不大。
							sqlSb.append(" update Tc_Employee set EmployeeStatusID='26' where UserId='"
									+ currentUser.getUserId() + "';");// 逻辑删除

							// 更改此人的卡片状态为2
							sqlSb.append(" update TC_Card set CardStatusIDXF='2' where EmployeeID='"
									+ upUser.getEmployeeId() + "';");// 逻辑删除

						}
						/*
						 * web平台中不维护卡片信息，故注释掉 else if
						 * (!currentUser.getCardState().equals("0")) {//
						 * 预设：CardState!=0;卡片状态，在web系统中强行设置为退卡状态
						 * 
						 * // String sqlDelete =
						 * "delete from TC_Card_Bags where EMPLOYEEID='" +
						 * upUser.getEmployeeId() // + "'"; // 物理删除 // //
						 * sqlDelete +=
						 * " delete from TC_Card where EMPLOYEEID='" +
						 * upUser.getEmployeeId() + "'"; // 物理删除 // // sqlDelete
						 * += " delete from Tc_Employee where EMPLOYEEID='" +
						 * upUser.getEmployeeId() + "'"; // 物理删除 // //
						 * this.executeSql(sqlDelete);
						 * 
						 * sqlSb.append(
						 * " delete from TC_Card_Bags where EMPLOYEEID='" +
						 * upUser.getEmployeeId()+ "'"); sqlSb.append(
						 * " delete from TC_Card where EMPLOYEEID='" +
						 * upUser.getEmployeeId() + "'"); sqlSb.append(
						 * " delete from Tc_Employee where EMPLOYEEID='" +
						 * upUser.getEmployeeId() + "'");
						 * 
						 * }
						 */
						else if (!currentUser.equals(upUser)) { // 对比数据（一部分需要判断的数据）是否一致
							// 更新卡片状态； 2017-11-3现在不更新卡类了（胡洋确定及肯定）
							// int cardTypeId=1;
							// if(currentUser.getJobName()!=null){
							// if(currentUser.getJobName().contains("合同工"))
							// cardTypeId=2;
							// else if(currentUser.getJobName().equals("学员"))
							// cardTypeId=3;
							// }

							String sqlUpdate = " update Tc_Employee set DepartmentID='" + currentUser.getDepartmentId()
									+ "'," + "EmployeeName='" + currentUser.getEmployeeName() + "'";

							// update时不更新人员编号字段了，因为教职工发卡之后，会把印刷卡号绑定到EmployeeStrID字段。
							// ,EmployeeStrID='" +
							// currentUser.getEmployeeStrId() + "'";

							if (currentUser.getSexId() == null)
								sqlUpdate += ",SexID=NULL";
							else
								sqlUpdate += ",SexID='" + currentUser.getSexId() + "'";

							if (currentUser.getIdentifier() == null)
								sqlUpdate += ",identifier=NULL";
							else
								sqlUpdate += ",identifier='" + currentUser.getIdentifier() + "'";

							if (currentUser.getEmployeeTel() == null)
								sqlUpdate += ",employeeTel=NULL";
							else
								sqlUpdate += ",employeeTel='" + currentUser.getEmployeeTel() + "'";

							sqlUpdate += ",EmployeeStatusID='24' " // ,CardTypeID="+cardTypeId+"现在不更新卡类了（胡洋确定及肯定）
									+ " where UserId='" + currentUser.getUserId() + "';";
				

							sqlSb.append(sqlUpdate);
						}

						upUserInfos.remove(j);
						break; // 跳出

					}
				}

				// 若上面的循环无法找到对应的人员，表明UP中不存在此用户
				if (!isExist && currentUser.getIsDelete() != 1) {
					int cardTypeId = 1;
					// if (currentUser.getJobName() != null) {
					// if (currentUser.getJobName().contains("合同工"))
					// cardTypeId = 2;
					// else if (currentUser.getJobName().equals("学员"))
					// cardTypeId = 3;
					// }

					String sqlInsert = "insert into Tc_Employee(UserId,DepartmentID,EmployeeName,EmployeeStrID,SID,EmployeePWD,SexID,identifier,employeeTel,cardid,CardTypeID,EmployeeStatusID,PositionId) "
							+ "values('" + currentUser.getUserId() + "','" + currentUser.getDepartmentId() + "','"
							+ currentUser.getEmployeeName() + "'," + "'" + currentUser.getEmployeeStrId() + "','"
							+ currentUser.getSid() + "','" + currentUser.getEmployeePwd() + "'";

					if (currentUser.getSexId() == null)
						sqlInsert += ",NULL";
					else
						sqlInsert += ",'" + currentUser.getSexId() + "'";

					if (currentUser.getIdentifier() == null)
						sqlInsert += ",NULL";
					else
						sqlInsert += ",'" + currentUser.getIdentifier() + "'";

					if (currentUser.getEmployeeTel() == null)
						sqlInsert += ",NULL";
					else
						sqlInsert += ",'" + currentUser.getEmployeeTel() + "'";

					sqlInsert += ",0," + cardTypeId + ",24,19);";

					sqlSb.append(sqlInsert);	
				}

				// 若积累的语句长度大于2000（大约50条语句左右），则执行
				if (sqlSb.length() > 2000) {
					row += this.doExecuteCountBySql(sqlSb.toString());
					sqlSb.setLength(0); // 清空
				}
			}

			// 最后执行一次
			if (sqlSb.length() > 0)
				row += this.doExecuteCountBySql(sqlSb.toString());

			// 剩下的，表明不存在平台的库中，进行删除
			String sqlDelete = "";
			for (int k = 0; k < upUserInfos.size(); k++) {
				upUser = upUserInfos.get(k);
				if(StringUtils.isNotEmpty(upUser.getEmployeeId())){
					sqlDelete = "delete from TC_Card_Bags where EMPLOYEEID=" + upUser.getEmployeeId() + ";"; // 物理删除
					sqlDelete += "delete from TC_Card where EMPLOYEEID=" + upUser.getEmployeeId() + ";"; // 物理删除
					sqlDelete += "delete from Tc_Employee where EMPLOYEEID=" + upUser.getEmployeeId() + ";"; // 物理删除
	
					this.doExecuteCountBySql(sqlDelete);
				}
			}

		} catch (Exception e) {
			// 捕获了异常后，要手动进行回滚； 还需要进行验证测试是否完全正确。
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

			row = -1;

			logger.error(e.getMessage());
			logger.error("同步人员数据到UP失败！错误信息：->" + Arrays.toString(e.getStackTrace()));
		}

		return row;
	}

	@Override
	public int syncAllCardInfoFromUp(List<CardUserInfoToUP> upCardUserInfos) {
		int row = 0;
		try {
			// 1.查询web平台的发卡信息
			String sql = "select CARD_ID as uuid,convert(varchar,FACT_NUMB) as factNumb,USE_STATE as useState,"
					+ " USER_ID as userId,convert(varchar,UP_CARD_ID) as upCardId "
					+ " from CARD_T_USEINFO where ISDELETE=0" + " order by upCardId asc";

			List<CardUserInfoToUP> webCardUserInfos = this.queryEntityBySql(sql, CardUserInfoToUP.class);

			String updateTime = null;

			// 循环对比
			CardUserInfoToUP webCardUser = null;
			CardUserInfoToUP upCardUser = null;
			boolean isExist = false;
			StringBuffer sqlSb = new StringBuffer();
			String sqlStr = "";
			// 当参数为null或内容为空，则直接删除发卡信息
			if (upCardUserInfos == null || upCardUserInfos.size() == 0) {
				sqlStr = "	delete from CARD_T_USEINFO ";
				this.doExecuteCountBySql(sqlSb.toString());
			} else {
				for (int i = 0; i < upCardUserInfos.size(); i++) {
					upCardUser = upCardUserInfos.get(i);
					sqlStr = "";
					isExist = false;

					for (int j = 0; j < webCardUserInfos.size(); j++) {
						webCardUser = webCardUserInfos.get(j);
						// 若web库中存在此发卡信息
						if (upCardUser.getUserId().equals(webCardUser.getUserId())) {
							// 执行代码
							isExist = true;
							if (!upCardUser.equals(webCardUser)) { // 对比数据（一部分需要判断的数据）是否一致
								// 若发卡ID为null，表明没有发卡，所以物理删除卡片信息
								if (upCardUser.getUpCardId() == null) {
									sqlStr = "delete from CARD_T_USEINFO where USER_ID='" + upCardUser.getUserId()
											+ "';";
									sqlSb.append(sqlStr + "  ");
								} else { // 否则更新数据
									updateTime = DateUtil.formatDateTime(new Date());

									sqlStr = "update CARD_T_USEINFO set " + "	FACT_NUMB='" + upCardUser.getFactNumb()
											+ "',USE_STATE='" + upCardUser.getUseState() + "'," + "	UP_CARD_ID='"
											+ upCardUser.getUpCardId() + "',UPDATE_TIME=CONVERT(datetime,'" + updateTime
											+ "')" + " where USER_ID='" + upCardUser.getUserId() + "'";

									sqlSb.append(sqlStr + "  ");
								}
							}

							webCardUserInfos.remove(j);
							break; // 跳出
						}
					}

					// 若上面的循环无法找到对应的卡片信息，表明UP中不存在此卡片信息
					if (!isExist && upCardUser.getUpCardId() != null) {
						updateTime = DateUtil.formatDateTime(new Date());

						sqlStr = "insert into CARD_T_USEINFO(CARD_ID,CREATE_TIME,CREATE_USER,"
								+ "ISDELETE,FACT_NUMB,USE_STATE,USER_ID,UP_CARD_ID)" + " values ('"
								+ UUID.randomUUID().toString() + "',CONVERT(datetime,'" + updateTime + "'),'超级管理员',"
								+ "0,'" + upCardUser.getFactNumb() + "'," + upCardUser.getUseState() + "," + "'"
								+ upCardUser.getUserId() + "','" + upCardUser.getUpCardId() + "')";

						sqlSb.append(sqlStr + "  ");

					}

					// 若积累的语句长度大于3000（大约50条语句左右），则执行
					if (sqlSb.length() > 3000) {
						row += this.doExecuteCountBySql(sqlSb.toString());
						sqlSb.setLength(0); // 清空
					}
				}

				// 最后执行一次
				if (sqlSb.length() > 0)
					row += this.doExecuteCountBySql(sqlSb.toString());

				// 如果还有没执行到的发卡数据，则进行循环删除
				if (webCardUserInfos.size() > 0) {
					sqlSb.setLength(0); // 清空
					for (int k = 0; k < webCardUserInfos.size(); k++) {
						webCardUser = webCardUserInfos.get(k);
						sqlStr = "delete from CARD_T_USEINFO where CARD_ID='" + webCardUser.getUuid() + "';";
						sqlSb.append(sqlStr + "  ");
					}
					this.doExecuteCountBySql(sqlSb.toString());
					// 若web库中存在此发卡信息
				}
			}

		} catch (Exception e) {
			// 捕获了异常后，要手动进行回滚；
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

			row = -1;

			logger.error(e.getMessage());
			logger.error("同步UP发卡数据到Q1失败！错误信息：->" + Arrays.toString(e.getStackTrace()));
		}

		return row;
	}

	@Override
	public HashMap<String, Set<String>> getUserRoleMenuPermission(SysUser sysUser, Session session) {
		// TODO Auto-generated method stub
		HashMap<String, Set<String>> map = new HashMap<>();

		// 若redis中不存在此人员的数据，就去查库（redis的相关数据，在用户被修改角色的时候，会删除）		
		Object userAuth = userRedisService.getAuthByUser(sysUser.getUuid());
		Object userBtn = userRedisService.getBtnByUser(sysUser.getUuid());
				
		if (userAuth != null && userBtn != null) { // 若存在，表明，没有更新更新redis，则不需要设置
			// 如果session为空，表明是初次登录进来，所以设置
			if (session.getAttribute(Constant.SESSION_SYS_AUTH) == null
					|| session.getAttribute(Constant.SESSION_SYS_BTN) == null) {
				session.setAttribute(Constant.SESSION_SYS_AUTH, userAuth);
				session.setAttribute(Constant.SESSION_SYS_BTN, userBtn);
			}
			return null; // 返回空，不在调用处处理
		}

		Set<String> userRMP_AUTH = new HashSet<>(); // 接口
		Set<String> userRMP_BTN = new HashSet<>(); // 按钮

		Set<SysRole> sysRoleSet = sysUser.getSysRoles();
		Iterator<SysRole> iterator = sysRoleSet.iterator();
		while (iterator.hasNext()) {
			SysRole sysRole = iterator.next();
			if (sysRole.getIsDelete() == 0) { // 只加入正常状态的角色数据
				List<SysMenuPermission> menuPerLists = menuPermissionService.getRoleMenuPerlist(sysRole.getUuid(),
						null);

				for (int i = 0; i < menuPerLists.size(); i++) {
					SysMenuPermission smp = menuPerLists.get(i);
					userRMP_AUTH.add(smp.getPerAuthCode() + "_" + smp.getPerAuth()); // 前缀+后缀
					userRMP_BTN.add(smp.getMenuCode() + "_" + smp.getPerBtnName()); // 菜单编码+按钮ref名称
				}
			}
		}
		map.put("auth", userRMP_AUTH);
		map.put("btn", userRMP_BTN);

		// 设置登录用户的功能权限（使用redis hash类型存储）
		if(userRMP_AUTH.size()==0)
			userRedisService.setAuthByUser(sysUser.getUuid(), null);
		else
			userRedisService.setAuthByUser(sysUser.getUuid(), userRMP_AUTH);
		
		if(userRMP_BTN.size()==0)
			userRedisService.setBtnByUser(sysUser.getUuid(), null);
		else
			userRedisService.setBtnByUser(sysUser.getUuid(), userRMP_BTN);

		return map;

	}

	/***
	 * 通过SysPermission权限菜单，这个参数，来获取相关的角色的用户ID，然后清除redis
	 */
	@Override
	public void deleteUserMenuTreeRedis(SysPermission sysPermission) {
		// TODO Auto-generated method stub
		Set<SysRole> sysRoleSet = sysPermission.getSysRoles();
		Set<String> setUserId = new HashSet<>();
		for (SysRole sysRole : sysRoleSet) {
			List<SysUser> listUser = this.getUserByRoleId(sysRole.getUuid()).getResultList();
			for (int j = 0; j < listUser.size(); j++) {
				setUserId.add(listUser.get(j).getUuid());
			}
		}

		if (setUserId.size() > 0) {
			/* 删除用户的菜单redis数据，以至于下次刷新或请求时，可以加载最新数据 */
			userRedisService.deleteMenuTreeByUser(setUserId.toArray());			
		}
	}

	@Override
	public void deleteUserMenuTreeRedis(String[] roleIds) {
		// TODO Auto-generated method stub
		Set<String> setUserId = new HashSet<>();
		for (int i = 0; i < roleIds.length; i++) {
			List<SysUser> listUser = this.getUserByRoleId(roleIds[i]).getResultList();
			for (int j = 0; j < listUser.size(); j++) {
				setUserId.add(listUser.get(j).getUuid());
			}
		}

		if (setUserId.size() > 0) {
			/* 删除用户的菜单redis数据，以至于下次刷新或请求时，可以加载最新数据 */
			userRedisService.deleteMenuTreeByUser(setUserId.toArray());
		}
	}

	@Override
	public void deleteUserRoleRedis(String ... userId) {
		// TODO Auto-generated method stub/*
		userRedisService.deleteAuthByUser(userId);
		userRedisService.deleteBtnByUser(userId);
		userRedisService.deleteMenuTreeByUser(userId);
	}

	@Override
	public QueryResult<SysUser> getUserNotInRoleId(String roleId, int start, int limit, String sort, String filter) {
		String hql = "from SysUser as o where o.isDelete=0  and state='0' "; // 只列出状态正常的用户
		if (StringUtils.isNotEmpty(roleId)) {
			String hql1 = " from SysUser as u inner join fetch u.sysRoles as k where k.uuid='" + roleId
					+ "' and k.isDelete=0 and u.isDelete=0 ";
			List<SysUser> tempList = this.queryByHql(hql1);
			if (tempList.size() > 0) {
				StringBuilder sb = new StringBuilder();
				for (SysUser sysUser : tempList) {
					sb.append(sysUser.getUuid());
					sb.append(",");
				}
				sb = sb.deleteCharAt(sb.length() - 1);
				String str = sb.toString().replace(",", "','");
				hql += " and o.uuid not in ('" + str + "')";
			}
		}
		if (StringUtils.isNotEmpty(filter)) {
			hql += filter;
		}
		if (StringUtils.isNotEmpty(sort)) {
			hql += " order by ";
			hql += sort;
		}
		QueryResult<SysUser> qr = this.queryResult(hql, start, limit);
		return qr;
	}

	/**
	 * 根据部门ID获取部门下的人员
	 * 
	 * @param deptId
	 *            部门ID
	 * @return
	 */
	@Override
	public List<SysUser> getUserByDeptId(String deptId) {
		String hql = "select u.uuid from SysUser as u,BaseUserdeptjob as r where u.uuid=r.userId and r.deptId='"
				+ deptId + "' and r.isDelete=0 and u.isDelete=0";
		return this.queryByHql(hql);
	}
	
	/**
	 * 根据用户ID获取人员的部门
	 * 
	 * @param deptId
	 *            部门ID
	 * @return
	 */
	@Override
	public Set<BaseOrg> getDeptByUserId(String userId) {
		String hql = "select u.uuid from SysUser as u,BaseUserdeptjob as r,BaseOrg o where u.uuid=r.userId and r.uuid='"
				+ userId + "' and r.deptId=o.uuid and r.isDelete=0 and u.isDelete=0 and o.isDelete=0";
		List<BaseOrg>  orgs= orgService.queryByHql(hql);
		
		Set<BaseOrg> set=new HashSet<>(orgs);      
	
		return set;
	}
	
	@Override
	public List<ImportNotInfo> doImportUser(List<List<Object>> listObject, SysUser currentUser) {
		// TODO Auto-generated method stub
		
		List<ImportNotInfo> listNotExit = new ArrayList<>();
		SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM-dd");
		ImportNotInfo notExits = null;
		Integer notCount = 1;

		
		Map<String, String> mapZzmmm = new HashMap<>();
		Map<String, String> mapXbm = new HashMap<>();
		Map<String, String> mapCategory = new HashMap<>();
		String hql1 = " from BaseDicitem where dicCode in ('ZZMMM','XBM','CATEGORY')";
		List<BaseDicitem> listBaseDicItems1 = dicitemService.queryByHql(hql1);
		for (BaseDicitem baseDicitem : listBaseDicItems1) {
			if (baseDicitem.getDicCode().equals("XBM"))
				mapXbm.put(baseDicitem.getItemName(), baseDicitem.getItemCode());
			else if (baseDicitem.getDicCode().equals("ZZMMM"))
				mapZzmmm.put(baseDicitem.getItemName(), baseDicitem.getItemCode());
			else
				mapCategory.put(baseDicitem.getItemName(), baseDicitem.getItemCode());
		}

		

		/**
		 * 用户名    姓名	性别	 身份	  学号/工号	   身份证件号	移动电话	出生日期	电子邮件	政治面貌	
		 * 
		 */
		String doResult = "";
		String title = "";
		String errorLevel = "";
		SysUser user = null;
		for (int i = 0; i < listObject.size(); i++) {
			try {

				List<Object> lo = listObject.get(i);

				// 导入的表格会错误的读取空行的内容，所以，当判断第一列为空，就跳过此行。
				if (!StringUtils.isNotEmpty((String) lo.get(0))) {
					continue;
				}

				title = String.valueOf(lo.get(0));
				doResult = "导入成功"; // 默认是成功
	
				// 查询库中是否存在此用户
				user = this.getByProerties(new String[]{"userName","isDelete"}, new Object[]{lo.get(0),0});
				
				//如果存在，就返回错误信息，不允许导入此条数据
				if(user!=null){
					
					errorLevel = "重复导入";
					doResult = "导入失败；异常信息：已存在此用户名的帐号信息";
					
				}else{
					user = new SysUser();
					user.setUserName(String.valueOf(lo.get(0)));
					user.setXm(String.valueOf(lo.get(1)));
					user.setXbm(mapXbm.get(lo.get(2)));
					user.setCategory(mapCategory.get(lo.get(3)));
					user.setUserNumb(String.valueOf(lo.get(4)));
					user.setSfzjh(String.valueOf(lo.get(5)));
					user.setMobile(String.valueOf(lo.get(6)));
					user.setCsrq(dateSdf.parse(String.valueOf(lo.get(7))));
					user.setDzxx(String.valueOf(lo.get(8)));
					user.setZzmmm(mapZzmmm.get(lo.get(9)));
					user.setUserPwd("123456");
					this.doAddUser(user,currentUser);
				}				

			} catch (Exception e) {
				// return null;
				errorLevel = "错误";
				doResult = "导入失败；异常信息：" + e.getMessage();
			}

			if (!"导入成功".equals(doResult)) {
				// List<Map<String, Object>>
				notExits = new ImportNotInfo();
				notExits.setOrderIndex(notCount);
				notExits.setTitle(title);
				notExits.setErrorLevel(errorLevel);
				notExits.setErrorInfo(doResult);

				listNotExit.add(notExits);
				notCount++;
			}
		}

		return listNotExit;
		
	}
	@Override
	public String getUserOwnDeptids(SysUser currentUser) {
		List<BaseOrg> rightOrg = orgService.getUserRightDeptList(currentUser);
		StringBuffer orgids = new StringBuffer();
		if (rightOrg.size() > 0) {
			for (BaseOrg baseOrg : rightOrg) {
				orgids.append("'" + baseOrg.getUuid() + "',");
			}
		}
		if (orgids.length() > 0) {
			orgids = new StringBuffer(StringUtils.trimLast(orgids.toString()));
			return orgids.toString();
		} else
			return "";
	}
}
package com.zd.school.plartform.system.service.Impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseDeptjob;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseUserdeptjob;
import com.zd.school.plartform.system.dao.SysUserdeptjobDao;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysDeptjobService;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.plartform.system.service.SysUserdeptjobService;
import com.zd.school.redis.service.DeptRedisService;
import com.zd.school.student.studentclass.model.JwClassstudent;
import com.zd.school.student.studentclass.service.JwClassstudentService;

/**
 * 
 * ClassName: BaseUserdeptjobServiceImpl Function: ADD FUNCTION. Reason: ADD
 * REASON(可选). Description: 用户部门岗位(BASE_T_USERDEPTJOB)实体Service接口实现类. date:
 * 2017-03-27
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class SysUserdeptjobServiceImpl extends BaseServiceImpl<BaseUserdeptjob> implements SysUserdeptjobService {

	@Resource
	public void setBaseUserdeptjobDao(SysUserdeptjobDao dao) {
		this.dao = dao;
	}

	@Resource
	private DeptRedisService deptRedisService;

	@Resource
	private SysUserService userService;

	@Resource
	private SysDeptjobService baseDeptjobService;
	
	@Resource
	private SysOrgService orgService;
	
	@Resource
	private JwClassstudentService classstudentService;
	
	private static Logger logger = Logger.getLogger(SysUserdeptjobServiceImpl.class);

	@Override
	public List<BaseUserdeptjob> getUserDeptJobList(SysUser currentUser) {
		Map<String, String> sortedCondition = new HashMap<>();
		sortedCondition.put("masterDept", "desc");
		sortedCondition.put("jobLevel", "asc");
		String[] propName = { "userId", "isDelete" };
		Object[] propValue = { currentUser.getUuid(), 0 };

		List<BaseUserdeptjob> list = this.queryByProerties(propName, propValue, sortedCondition);

		return list;
	}

	@Override
	public Map<String, BaseUserdeptjob> getUserDeptJobMaps(SysUser currentUser) {
		Map<String, BaseUserdeptjob> maps = new HashMap<>();
		List<BaseUserdeptjob> list = this.getUserDeptJobList(currentUser);
		for (BaseUserdeptjob job : list) {
			maps.put(job.getDeptjobId(), job);
		}
		return maps;
	}

	@Override
	public BaseUserdeptjob getUserMasterDeptJob(SysUser currentUser) {
		String[] propName = { "userId", "masterDept", "isDelete" };
		Object[] propValue = { currentUser.getUuid(), 1, 0 };

		BaseUserdeptjob isMasterDeptJob = this.getByProerties(propName, propValue);
		return isMasterDeptJob;

	}

	// @Override
	// public QueryResult<BaseUserdeptjob> list(Integer start, Integer limit,
	// String sort, String filter, Boolean isDelete) {
	// QueryResult<BaseUserdeptjob> qResult = this.queryPageResult(start,
	// limit, sort, filter, isDelete);
	// return qResult;
	// }
	/**
	 * 根据主键逻辑删除数据
	 * 
	 * @param ids
	 *            要删除数据的主键
	 * @param currentUser
	 *            当前操作的用户
	 * @return 操作成功返回true，否则返回false
	 */
	@Override
	public Boolean doLogicDeleteByIds(String ids, SysUser currentUser) {
		Boolean delResult = false;
		try {
			Object[] conditionValue = ids.split(",");
			String[] propertyName = { "isDelete", "updateUser", "updateTime" };
			Object[] propertyValue = { 1, currentUser.getUuid(), new Date() };
			this.updateByProperties("uuid", conditionValue, propertyName, propertyValue);
			delResult = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
			delResult = false;
		}
		return delResult;
	}

	@Override
	public boolean doAddUserToDeptJob(String deptJobId, String userId, SysUser currentUser) {
		Boolean reResult = false;
		String[] userIds = userId.split(",");

		// 所有要设置的用户
		List<SysUser> users = userService.queryByProerties("uuid", userIds);

		String hql = " select a from BaseDeptjob a  where a.uuid in ('" + deptJobId.replace(",", "','")
				+ "') order by a.jobLevel asc ";
		List<BaseDeptjob> deptjobs = baseDeptjobService.queryByHql(hql);

		for (SysUser user : users) {
			// 查询当前用户已有的部门岗位
			Map<String, BaseUserdeptjob> userHasJobMap = this.getUserDeptJobMaps(user);
			BaseUserdeptjob isMasterDeptJob = this.getUserMasterDeptJob(user);
			for (int i = 0; i < deptjobs.size(); i++) {
				BaseDeptjob deptjob=deptjobs.get(i);
				String uuid = deptjob.getUuid(); // 选择的部门岗位Id
				if (userHasJobMap.get(uuid) == null) {
					// 如果当用户还没有设置的此部门岗位
					BaseUserdeptjob userDeptJob = new BaseUserdeptjob();
					userDeptJob.setDeptId(deptjob.getDeptId());
					userDeptJob.setJobId(deptjob.getJobId());
					userDeptJob.setDeptjobId(uuid);
					userDeptJob.setUserId(user.getUuid());
					userDeptJob.setCreateTime(new Date());
					userDeptJob.setCreateUser(currentUser.getUuid());
					// 当前人没有主工作部门时将一个岗位设置为主部门
					if (!ModelUtil.isNotNull(isMasterDeptJob) && i == 0) {
						userDeptJob.setMasterDept(1);
											
						//--------判断是否要更新班级学生表(2018-3-15加入)-----------						
						//是否为学生
						if(user.getCategory().equals("2")){							
							BaseOrg dept=orgService.get(deptjob.getDeptId());	
							//是否为班级部门、学生岗位
							if(dept.getDeptType().equals("05")&&deptjob.getJobName().equals("学生")){
								
								JwClassstudent classStudent=classstudentService.getByProerties(
										new String[]{"studentId","isDelete"}, 		//新版本暂不根据学年学期来查
										new Object[]{user.getUuid(),0});
								if(classStudent==null){
									classStudent=new JwClassstudent();
									classStudent.setClaiId(deptjob.getDeptId());
									classStudent.setStudentId(user.getUuid());
									classStudent.setCreateUser(currentUser.getXm());
									classStudent.setSemester(currentUser.getSemester());
									classStudent.setStudyYeah(String.valueOf(currentUser.getStudyYear()));
								}else{
									classStudent.setSemester(currentUser.getSemester());
									classStudent.setStudyYeah(String.valueOf(currentUser.getStudyYear()));
									classStudent.setClaiId(deptjob.getDeptId());
									classStudent.setUpdateUser(currentUser.getXm());
									classStudent.setUpdateTime(new Date());
								}
								classstudentService.merge(classStudent);			
							}
						}
						//-----------------结束--------------------
						
						
					} else
						userDeptJob.setMasterDept(0);

					this.merge(userDeptJob);
				}
			}
			// 将老师从临时部门删除
			user.setDeptId("");
			user.setUpdateTime(new Date());
			user.setUpdateUser(currentUser.getUuid());
			userService.merge(user);
		}

		// 清除这个用户的部门树缓存，以至于下次读取时更新缓存
		deptRedisService.deleteDeptTreeByUsers(userIds);
		
		return true;

	}

	@Override
	public boolean doRemoveUserFromDeptJob(String delIds, SysUser currentUser) {
		String[] uuids = delIds.split(",");
		
		// 所有要设置的用户	
		List<BaseUserdeptjob> baseUserdeptjobs = this.queryByProerties("uuid", uuids);	
		List<String> userIds = baseUserdeptjobs.stream().map((x)->x.getUserId()).distinct().collect(Collectors.toList());		
		// 清除这个用户的部门树缓存，以至于下次读取时更新缓存
		if(userIds.size()>0)
			deptRedisService.deleteDeptTreeByUsers(userIds);
		
		
		/*---------判断是否要更新班级学生表(2018-3-15加入)-----------*/
		for(int i=0;i<baseUserdeptjobs.size();i++){
			BaseUserdeptjob userdeptjob=baseUserdeptjobs.get(i);
			//若为主部门、班级部门、学生岗位，就执行更新操作
			if(userdeptjob.getMasterDept()==1&&userdeptjob.getDeptType().equals("05")
					&&userdeptjob.getJobName().equals("学生")){
				
				SysUser user=userService.get(userdeptjob.getUserId());
				//是否为学生
				if(user!=null&&user.getCategory().equals("2")){
					//将JwClassstudent设置为isDelete
					String hql="update JwClassstudent set isDelete=1 where isDelete=0 "
							+ "	and studentId='"+user.getUuid()+"' and claiId='"+userdeptjob.getDeptId()+"'";
					classstudentService.doExecuteCountByHql(hql);
				}
			}
		}
		/*-------------------结束--------------------*/
		
		
		return this.doLogicDeleteByIds(delIds, currentUser);
	}


	@Override
	public boolean doSetMasterDeptJob(String delIds, String userId, SysUser currentUser) {

		// 先将原来的主部门岗位设置成非主部门岗位
		SysUser user = userService.get(userId);
		BaseUserdeptjob oldMaster = this.getUserMasterDeptJob(user);
		if (ModelUtil.isNotNull(oldMaster)) {
			oldMaster.setMasterDept(0);
			oldMaster.setUpdateTime(new Date());
			oldMaster.setUpdateUser(currentUser.getUuid());
			this.merge(oldMaster);
		}
		
		// 将新的部门岗位设置为主部门岗位
		String[] propertyName = { "masterDept", "updateTime", "updateUser" };
		Object[] propertyValue = { 1, new Date(), currentUser.getUuid() };
		this.updateByProperties("uuid", delIds, propertyName, propertyValue);
		
		
		//--------判断是否要更新班级学生表(2018-3-15加入)-----------
		//是否为学生
		if(user.getCategory().equals("2")){
			//是否为学生的班级学生岗位
			if(oldMaster.getDeptType().equals("05")&&oldMaster.getJobName().equals("学生")){
				//将JwClassstudent设置为isDelete
				String hql="update JwClassstudent set isDelete=1 where isDelete=0 "
						+ "	and studentId='"+userId+"' and claiId='"+oldMaster.getDeptId()+"'";
				classstudentService.doExecuteCountByHql(hql);
			}
			
			//判断新的部门岗位是否为班级学生岗位
			BaseUserdeptjob	newMaster=this.get(delIds);
			if(newMaster.getDeptType().equals("05")&&newMaster.getJobName().equals("学生")){
				JwClassstudent classStudent=classstudentService.getByProerties(
						new String[]{"studentId","isDelete"}, 		//新版本暂不根据学年学期来查
						new Object[]{userId,0});
				if(classStudent==null){
					classStudent=new JwClassstudent();
					classStudent.setClaiId(newMaster.getDeptId());
					classStudent.setStudentId(userId);
					classStudent.setCreateUser(currentUser.getXm());
					classStudent.setSemester(currentUser.getSemester());
					classStudent.setStudyYeah(String.valueOf(currentUser.getStudyYear()));
				}else{
					classStudent.setSemester(currentUser.getSemester());
					classStudent.setStudyYeah(String.valueOf(currentUser.getStudyYear()));
					classStudent.setClaiId(newMaster.getDeptId());
					classStudent.setUpdateUser(currentUser.getXm());
					classStudent.setUpdateTime(new Date());
				}
				classstudentService.merge(classStudent);			
			}
		}
		//-----------------结束--------------------
		
		return true;
	}

	/**
	 * 获取部门岗位的用户信息 zzk
	 */
	@Override
	public QueryResult<BaseUserdeptjob> getUserByDeptJobId(String deptJobId, Integer start, Integer limit,
			String sort) {
		// TODO Auto-generated method stub

		String hql = "from BaseUserdeptjob o where o.deptjobId='" + deptJobId + "' and o.isDelete=0 ";

		if (StringUtils.isNotEmpty(sort)) {
			hql += " order by ";
			hql += sort;
		}

		QueryResult<BaseUserdeptjob> qr = this.queryResult(hql, start, limit);

		return qr;

	}

	@Override
	public boolean doSetMasterDeptJobFromUser(String userIds, String deptJobId, SysUser currentUser) {

		// 先将原来的主部门岗位设置成非主部门岗位
		Object[] userArray = userIds.split(",");
		String[] conditionName = { "masterDept", "userId" };
		Object[] conditionValue = { 1, userArray };
		String[] propertyName = { "masterDept", "updateTime", "updateUser" };
		Object[] propertyValue = { 0, new Date(), currentUser.getUuid() };
		this.updateByProperties(conditionName, conditionValue, propertyName, propertyValue);

		// 将新的部门岗位设置为主部门岗位
		String[] conditionName2 = { "deptjobId", "userId" };
		Object[] conditionValue2 = { deptJobId, userArray };
		String[] propertyName2 = { "masterDept", "updateTime", "updateUser" };
		Object[] propertyValue2 = { 1, new Date(), currentUser.getUuid() };
		this.updateByProperties(conditionName2, conditionValue2, propertyName2, propertyValue2);
		return true;
	}

	

}
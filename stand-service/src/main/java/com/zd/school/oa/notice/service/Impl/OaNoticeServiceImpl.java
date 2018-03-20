package com.zd.school.oa.notice.service.Impl;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.StringVeriable;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.DateUtil;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.model.JwGradeteacher;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.jw.eduresources.service.JwGradeteacherService;
import com.zd.school.jw.push.service.PushInfoService;
import com.zd.school.oa.notice.dao.OaNoticeDao;
import com.zd.school.oa.notice.model.OaNotice;
import com.zd.school.oa.notice.model.OaNoticeOther;
import com.zd.school.oa.notice.model.OaNoticeauditor;
import com.zd.school.oa.notice.service.OaNoticeService;
import com.zd.school.oa.notice.service.OaNoticeauditorService;
import com.zd.school.oa.notice.service.OaNoticerightService;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 
 * ClassName: OaNoticeServiceImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 公告信息表(OA_T_NOTICE)实体Service接口实现类. date: 2016-12-21
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class OaNoticeServiceImpl extends BaseServiceImpl<OaNotice> implements OaNoticeService {

	@Resource
	public void setOaNoticeDao(OaNoticeDao dao) {
		this.dao = dao;
	}

	private static Logger logger = Logger.getLogger(OaNoticeServiceImpl.class);

	@Resource
	private SysOrgService orgService;

	@Resource
	private SysUserService userService;

	@Resource
	private SysRoleService roleService;

	@Resource
	private OaNoticerightService rightService;

	@Resource
	private OaNoticeauditorService auditorService;

	@Resource
	private PushInfoService pushService;

	@Resource
	private BaseInfotermService oaInfotermService;

	@Resource
	private JwGradeteacherService gTeacherService;

	@Resource
	private JwClassteacherService cTeacherService;


	@Override
	public QueryResult<OaNotice> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete) {
		QueryResult<OaNotice> qResult = this.queryPageResult(start, limit, sort, filter, isDelete);
		return qResult;
	}

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
			Object[] propertyValue = { 1, currentUser.getXm(), new Date() };
			this.updateByProperties("uuid", conditionValue, propertyName, propertyValue);
			delResult = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
			delResult = false;
		}
		return delResult;
	}

	/**
	 * 根据传入的实体对象更新数据库中相应的数据
	 * 
	 * @param entity
	 *            传入的要更新的实体对象
	 * @param currentUser
	 *            当前操作用户
	 * @return
	 */
	@Override
	public OaNotice doUpdateEntity(OaNotice entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		OaNotice saveEntity = this.get(entity.getUuid());
		try {
			BeanUtils.copyProperties(saveEntity, entity);
			saveEntity.setUpdateTime(new Date()); // 设置修改时间
			saveEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(saveEntity);// 执行修改方法

			return entity;
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		}
	}

	/**
	 * 根据传入的实体对象更新数据库中相应的数据
	 * 
	 * @param entity
	 *            传入的要更新的实体对象
	 * @param currentUser
	 *            当前操作用户
	 * @param deptIds
	 *            公告通知的部门
	 * @param roleIds
	 *            公告通知的角色
	 * @param userIds
	 *            公告通知的用户
	 * @return
	 */
	@Override
	public OaNotice doUpdateEntity(OaNotice entity, SysUser currentUser, String deptIds, String roleIds, String userIds,
			String terminalIds, String stuIds, String isNoticeParent) {
		Object[] propValue = {};
		// 先拿到已持久化的实体
		OaNotice saveEntity = this.get(entity.getUuid());
		try {			
			//根据传入的部门、人员与角色的id处理
			OaNoticeOther otherInfo = this.getNoticeOther(entity.getUuid());
			
			//当不为不通知的时候，则更新
			if (!"3".equals(entity.getDeptRadio())) {
				
				if (!deptIds.equals(otherInfo.getDeptIds())) {
					propValue = deptIds.split(",");
					Set<BaseOrg> orgs = saveEntity.getNoticeDepts();
					List<BaseOrg> setOrgs = null;
					
					if(deptIds.trim().equals(AdminType.ADMIN_ORG_ID)){
						setOrgs = orgService.getOrgList(" and isLeaf=true ", " order by orderIndex asc ", currentUser);							
					}else{
						setOrgs = orgService.queryByProerties("uuid", propValue);					
					}				
										
					orgs.addAll(setOrgs);
					saveEntity.setNoticeDepts(orgs);
				}
				
			}else { //当为3时，就处理为空
				saveEntity.setNoticeDepts(new HashSet<BaseOrg>());
			}
			
			
			if (!roleIds.equals(otherInfo.getRoleIds())) {
				propValue = roleIds.split(",");
				Set<SysRole> roles = saveEntity.getNoticeRoles();
				List<SysRole> setRoles = roleService.queryByProerties("uuid", propValue);
				roles.addAll(setRoles);
				saveEntity.setNoticeRoles(roles);
			}
			
			if (!userIds.equals(otherInfo.getUserIds())) {
				propValue = userIds.split(",");
				Set<SysUser> users = saveEntity.getNoticeUsers();
				List<SysUser> setUsers = userService.queryByProerties("uuid", propValue);
				users.addAll(setUsers);
				saveEntity.setNoticeUsers(users);
			}

			
			//当不为不通知的时候，则更新
			if (!"3".equals(entity.getTerminalRadio())) {
				if (!terminalIds.equals(otherInfo.getTermIds())) {
					// 现在前台修改时，传来的是房间id，所以，要用房间roomId去查询设备。
					Set<OaInfoterm> oaInfoTrems = saveEntity.getNoticeTerms();
					List<OaInfoterm> oaInfotermsSet = new ArrayList<>();
					List<Object> roomInfo=null;
					
					if (terminalIds.trim().equals(AdminType.ADMIN_ORG_ID)) {
						String roomInfoHql = "select uuid from BuildRoominfo where isDelete=0";
						roomInfo = this.queryEntityByHql(roomInfoHql);
						
					} else {
						propValue = terminalIds.split(",");
						roomInfo = Arrays.asList(propValue);
					}
					
					//分批次执行				
					int propLen=roomInfo.size();
					int increment=100;
					for(int i=0;i<propLen;i+=increment){
						if(propLen<=i+increment){			
							List<Object> proplist=roomInfo.subList(i, propLen);
							oaInfotermsSet.addAll(oaInfotermService.queryByProerties("roomId",proplist.toArray()));
							break;
						}		
						List<Object> proplist=roomInfo.subList(i,i+increment);
						oaInfotermsSet.addAll(oaInfotermService.queryByProerties("roomId", proplist.toArray()));										
					}
					
					oaInfoTrems.addAll(oaInfotermsSet);
					saveEntity.setNoticeTerms(oaInfoTrems);														
					
				}
			}else { //当为3时，就处理为空
				saveEntity.setNoticeTerms(new HashSet<OaInfoterm>());
			}
				
			//当不为不通知的时候，则更新
			if (!"3".equals(entity.getStuRadio())) {
				if (!stuIds.equals(otherInfo.getStuIds())) {
					Set<SysUser> stus = saveEntity.getNoticeStus();
					List<SysUser> setStus = new ArrayList<>();
					if (stuIds.trim().equals(AdminType.ADMIN_ORG_ID)) {						
						String hql1=" from SysUser where isDelete=0 and category=2 ";
						setStus=userService.queryByHql(hql1);
					} else {						
						propValue = stuIds.split(",");
						//分批次执行
						List<Object> propValueList = Arrays.asList(propValue);					
						int propLen=propValueList.size();
						int increment=100;
						for(int i=0;i<propLen;i+=increment){
							if(propLen<=i+increment){			
								List<Object> proplist=propValueList.subList(i, propLen);
								setStus.addAll(userService.queryByProerties("uuid",proplist.toArray()));
								break;
							}		
							List<Object> proplist=propValueList.subList(i,i+increment);
							setStus.addAll(userService.queryByProerties("uuid", proplist.toArray()));										
						}
					}
					stus.addAll(setStus);
					saveEntity.setNoticeStus(stus);					
				}
			}else { //当为3时，就处理为空
				saveEntity.setNoticeStus(new HashSet<SysUser>());
			}
				
				
			List<String> excludedProp = new ArrayList<>();
			excludedProp.add("noticeTerms");
			excludedProp.add("noticeDepts");
			excludedProp.add("noticeStus");
			excludedProp.add("noticeRoles");
			excludedProp.add("noticeUsers");

			BeanUtils.copyProperties(saveEntity, entity, excludedProp);
			saveEntity.setUpdateTime(new Date()); // 设置修改时间
			saveEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
			
			entity = this.merge(saveEntity);// 执行修改方法

			return entity;
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		}
	}

	/**
	 * 将传入的实体对象持久化到数据
	 * 
	 * @param entity
	 *            传入的要更新的实体对象
	 * @param currentUser
	 *            当前操作用户
	 * @return
	 */
	@Override
	public OaNotice doAddEntity(OaNotice entity, SysUser currentUser) {
		OaNotice saveEntity = new OaNotice();
		try {
			List<String> excludedProp = new ArrayList<>();
			excludedProp.add("uuid");
			BeanUtils.copyProperties(saveEntity, entity, excludedProp);
			saveEntity.setCreateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(saveEntity);// 执行修改方法

			return entity;
		} catch (Exception e) {
			logger.error(e.toString());
			return null;
		}
	}

	/**
	 * 将传入的实体对象持久化到数据
	 * 
	 * @param entity
	 *            传入的要更新的实体对象
	 * @param currentUser
	 *            当前操作用户
	 * @param deptIds
	 *            公告通知的部门
	 * @param roleIds
	 *            公告通知的角色
	 * @param userIds
	 *            公告通知的用户
	 * @return
	 */
	@Override
	public OaNotice doAddEntity(OaNotice entity, SysUser currentUser, String deptIds, String roleIds, String userIds,
			String terminalIds, String stuIds, String isNoticeParent) {
		OaNotice saveEntity = new OaNotice();
		try {
			List<SysUser> userList = new ArrayList<SysUser>();
			List<SysUser> stuList = new ArrayList<SysUser>();

			String ids;
			String hql;
			List<String> excludedProp = new ArrayList<>();
			excludedProp.add("uuid");
			String[] propValue = {};
			BeanUtils.copyProperties(saveEntity, entity, excludedProp);
			saveEntity.setCreateUser(currentUser.getXm()); // 设置修改人的中文名
			
					
			// 如果通知部门不为空时处理
			if (StringUtils.isNotEmpty(deptIds)) {
				propValue = deptIds.split(",");
				Set<BaseOrg> orgs = saveEntity.getNoticeDepts();
				List<BaseOrg> setOrgs=null;
				ids = "";
				
				if(deptIds.trim().equals(AdminType.ADMIN_ORG_ID)){
					setOrgs = orgService.getOrgList(" and isLeaf=true ", " order by orderIndex asc ", currentUser);						
					ids=setOrgs.stream().map((x)->x.getUuid()).collect(Collectors.joining("','","'","'"));
					
				}else{
					setOrgs = orgService.queryByProerties("uuid", propValue);
					ids=setOrgs.stream().map(BaseOrg::getUuid).collect(Collectors.joining("','","'","'"));				
				}				
				
				orgs.addAll(setOrgs);
				saveEntity.setNoticeDepts(orgs);
										
				//注：只通知主部门的人员（2017-12-28 zzk）		
				hql = "from SysUser as o where o.deptId in(" + ids
						+ ") and o.isDelete=0 and o.category=1 ";
				userList.addAll(userService.queryByHql(hql));
			}
			// 如果通知人员不为空时处理
			if (StringUtils.isNotEmpty(userIds)) {
				propValue = userIds.split(",");
				Set<SysUser> users = saveEntity.getNoticeUsers();
				List<SysUser> setUsers = userService.queryByProerties(new String[]{"uuid","isDelete","category"}, new Object[]{propValue,0,"1"});
				users.addAll(setUsers);
				userList.addAll(setUsers);
				saveEntity.setNoticeUsers(users);
			}
			// 如果通知角色不为空时处理
			if (StringUtils.isNotEmpty(roleIds)) {
				propValue = roleIds.split(",");
				Set<SysRole> roles = saveEntity.getNoticeRoles();
				List<SysRole> setRoles = roleService.queryByProerties("uuid", propValue);
				roles.addAll(setRoles);
				saveEntity.setNoticeRoles(roles);
				
				ids = "";
				for (String str : propValue) {
					ids += "'" + str + "',";
				}
				ids = StringUtils.trimLast(ids);
				
				hql = "from SysUser as o inner join fetch o.sysRoles as d where d.uuid in(" + ids
						+ ") and o.isDelete=0 and  o.category=1 ";
				userList.addAll(userService.queryByHql(hql));
			}

			// 如果终端不为空时的处理
			if (StringUtils.isNotEmpty(terminalIds)) {
				Set<OaInfoterm> setOaInfoterm = saveEntity.getNoticeTerms();
				List<OaInfoterm> oaInfoterms = new ArrayList<>();
				List<String> roomInfo=null;
				
				if (terminalIds.trim().equals(AdminType.ADMIN_ORG_ID)) {
					String roomInfoHql = "select uuid from BuildRoominfo where isDelete=0";
					roomInfo = this.queryEntityByHql(roomInfoHql);				
				} else {
					propValue = terminalIds.split(",");
					roomInfo = Arrays.asList(propValue);
					//oaInfoterms = oaInfotermService.queryByProerties("roomId", propValue);
				}
				
				//分批次执行				
				int propLen=roomInfo.size();
				int increment=100;
				for(int i=0;i<propLen;i+=increment){
					if(propLen<=i+increment){			
						List<String> proplist=roomInfo.subList(i, propLen);
						oaInfoterms.addAll(oaInfotermService.queryByProerties("roomId",proplist.toArray()));
						break;
					}		
					List<String> proplist=roomInfo.subList(i,i+increment);
					oaInfoterms.addAll(oaInfotermService.queryByProerties("roomId", proplist.toArray()));										
				}
										
				setOaInfoterm.addAll(oaInfoterms);
				saveEntity.setNoticeTerms(setOaInfoterm);
			}
			
			// 如果通知学生不为空时处理
			if (StringUtils.isNotEmpty(stuIds)) {
				Set<SysUser> stus = saveEntity.getNoticeStus();
				List<SysUser> setStus = new ArrayList<>();
				if (stuIds.trim().equals(AdminType.ADMIN_ORG_ID)) {
					
					String hql1=" from SysUser where isDelete=0 and category=2 ";
					
					//是否为学校管理员
					/*
					Boolean isSchoolAdminRole = false;
					List<SysUser> roleUsers = userService.getUserByRoleId(AdminType.SCHOOLADMIN_ROLE_ID).getResultList();
					for (SysUser su : roleUsers) {
						if (su.getUuid().equals(currentUser.getUuid())) {
							isSchoolAdminRole = true;
							break;
						}
					}*/
					
					/**暂无年级组长和班主任设置
					 * 
					 * 
					if (!isSchoolAdminRole) {
						
						// 不是学校管理员判断是否是年级组长
						String ghql = "from JwGradeteacher where isDelete=0 and tteacId='" + currentUser.getUuid() + "'";
						List<JwGradeteacher> gradeclassteachers = gTeacherService.queryByHql(ghql);
						if (gradeclassteachers != null && gradeclassteachers.size() > 0) {
							JwGradeteacher gTeacher = gradeclassteachers.get(0);
							hql1 += " and uuid in(select studentId from JwClassstudent where isDelete=0 and claiId in(";
							hql1 += " select uuid from JwTGradeclass where graiId='"+gTeacher.getGraiId()+"'";
							hql1 += "))";
						} else {
							// 判断是否是班主任
							ghql = "from JwClassteacher where isDelete=0 and tteacId='" + currentUser.getUuid() + "'";
							List<JwClassteacher> classteachers = cTeacherService.queryByHql(ghql);
							if (classteachers != null && classteachers.size() > 0) {
								JwClassteacher cTeacher = classteachers.get(0);
								hql1 += " and uuid in(select studentId from JwClassstudent where isDelete=0 and claiId='"+cTeacher.getClaiId()+"') ";
							}
						}
					}*/
					
					setStus=userService.queryByHql(hql1);
				} else {
					propValue = stuIds.split(",");
					//分批次执行
					List<String> propValueList = Arrays.asList(propValue);					
					int propLen=propValueList.size();
					int increment=100;
					for(int i=0;i<propLen;i+=increment){
						if(propLen<=i+increment){			
							List<String> proplist=propValueList.subList(i, propLen);
							setStus.addAll(userService.queryByProerties("uuid",proplist.toArray()));
							break;
						}		
						List<String> proplist=propValueList.subList(i,i+increment);
						setStus.addAll(userService.queryByProerties("uuid", proplist.toArray()));										
					}
				}
				stus.addAll(setStus);
				stuList.addAll(setStus);
				saveEntity.setNoticeStus(stus);
			}
			
			//通知家长
			if (isNoticeParent.equals("1")) {
				Set<SysUser> filterStu = new HashSet<SysUser>(stuList);
				stuList = new ArrayList<SysUser>(filterStu);
				for (SysUser sysUser : filterStu) {
					String regStatus = "您好," + sysUser.getXm() + "同学的家长,有通知公告需要您查看!";
					pushService.pushInfo(sysUser.getXm(), sysUser.getUserNumb(), "通知公告查看", regStatus,
							StringVeriable.WEB_URL + "static/core/coreApp/oa/notice/phonequery/list.jsp?userId="
									+ sysUser.getUuid(),currentUser);
				}
			}
			
			//通知老师
			Set<SysUser> filterUser = new HashSet<SysUser>(userList);
			userList = new ArrayList<SysUser>(filterUser);
			for (SysUser sysUser : filterUser) {
				String regStatus = "您好," + sysUser.getXm() + "老师,有通知公告需要您查看!";
				pushService.pushInfo(sysUser.getXm(), sysUser.getUserNumb(), "通知公告查看", regStatus, StringVeriable.WEB_URL
						+ "static/core/coreApp/oa/notice/phonequery/list.jsp?userId=" + sysUser.getUuid(),currentUser);
			}
			
			//通知公告审批的权限人员
			SysUser approveUser = rightService.getApproveUser(currentUser);
			if (approveUser != null) {
				saveEntity.setIsCheck("1");
				OaNoticeauditor auditor = new OaNoticeauditor();
				auditor.setXm(approveUser.getXm());
				auditor.setUserId(approveUser.getUuid());
				auditor.setAuditState(0);
				auditor.setOaNotice(saveEntity);
				auditorService.merge(auditor);
				String regStatus = "您好," + approveUser.getXm() + "老师,有通知公告需要您尽快处理!";
				pushService.pushInfo(approveUser.getXm(), approveUser.getUserNumb(), "通知公告审批", regStatus,currentUser);			
			}
			
			entity = this.merge(saveEntity);// 执行修改方法
			return entity;
		} catch (Exception e) {
			//回滚
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			logger.error("错误原因：【"+e.getMessage()+"】 出错堆栈跟踪："+ Arrays.toString( e.getStackTrace()));
			return null;
		}
	}

	/**
	 * 获取指定公告的通知部门、角色、人员的信息
	 * 
	 * @param id
	 *            指定的公告id
	 * @return
	 */
	@Override
	public OaNoticeOther getNoticeOther(String id) {

		OaNoticeOther otherEntity = new OaNoticeOther();
		OaNoticeOther otherDept = this.getNoticeDeptInfo(id);
		OaNoticeOther otherRole = this.getNoticeRoleInfo(id);
		OaNoticeOther otherUser = this.getNoticeUserInfo(id);
		OaNoticeOther otherTerm = this.getNoticeTermsInfo(id);
		OaNoticeOther otherStu = this.getNoticeStuInfo(id);

		otherEntity.setNoticeId(id);
		otherEntity.setDeptNames(otherDept.getDeptNames());
		otherEntity.setDeptIds(otherDept.getDeptIds());
		otherEntity.setRoleIds(otherRole.getRoleIds());
		otherEntity.setRoleNames(otherRole.getRoleNames());
		otherEntity.setUserIds(otherUser.getUserIds());
		otherEntity.setUserNames(otherUser.getUserNames());

		otherEntity.setStuIds(otherStu.getStuIds());
		otherEntity.setStuNames(otherStu.getStuNames());
		otherEntity.setTermIds(otherTerm.getTermIds());
		otherEntity.setTermNames(otherTerm.getTermNames());

		return otherEntity;
	}
	
	//获取部门信息
	public OaNoticeOther getNoticeDeptInfo(String id) {
			
		OaNoticeOther otherEntity = new OaNoticeOther();		
		OaNotice getEntity = this.get(id);
		
		//当为指定部门时，才去查询，否则不查询
		if("2".equals(getEntity.getDeptRadio())){
				
			// 通知部门信息
			Set<BaseOrg> orgs = getEntity.getNoticeDepts();
			String sbIds=orgs.stream().map((x)->x.getUuid()).collect(Collectors.joining(","));
			String sbNames=orgs.stream().map(BaseOrg::getNodeText).collect(Collectors.joining(","));
					
			otherEntity.setDeptIds(sbIds);
			otherEntity.setDeptNames(sbNames);
			otherEntity.setNoticeId(id);
		}

		return otherEntity;
	}

	/**
	 * 根据公告的ID获取公告通知到的的角色数据
	 * 
	 * @param id
	 * @return
	 */
	public OaNoticeOther getNoticeRoleInfo(String id) {
		
		OaNoticeOther otherEntity = new OaNoticeOther();		
		OaNotice getEntity = this.get(id);
		
		Set<SysRole> roles = getEntity.getNoticeRoles();
		String sbIds=roles.stream().map((x)->x.getUuid()).collect(Collectors.joining(","));
		String sbNames=roles.stream().map(SysRole::getRoleName).collect(Collectors.joining(","));
				
		otherEntity.setRoleIds(sbIds);
		otherEntity.setRoleNames(sbNames);
		otherEntity.setNoticeId(id);
			
		return otherEntity;
	}

	public OaNoticeOther getNoticeUserInfo(String id) {
		
		OaNoticeOther otherEntity = new OaNoticeOther();		
		OaNotice getEntity = this.get(id);
		
		Set<SysUser> users = getEntity.getNoticeUsers();
		String sbIds=users.stream().map((x)->x.getUuid()).collect(Collectors.joining(","));
		String sbNames=users.stream().map(SysUser::getXm).collect(Collectors.joining(","));
				
		otherEntity.setUserIds(sbIds);
		otherEntity.setUserNames(sbNames);
		otherEntity.setNoticeId(id);
		
		return otherEntity;
	}

	public OaNoticeOther getNoticeTermsInfo(String id) {
		OaNoticeOther otherEntity = new OaNoticeOther();
		OaNotice getEntity = this.get(id);
			
		//当为指定终端时，才去查询，否则不查询(注：set集合里面的是设备数据，而显示的应该是房间的数据，所以直接去实体类的数据，做特殊冗余)
		if("2".equals(getEntity.getTerminalRadio())){
			/*
			Set<OaInfoterm> infos = getEntity.getNoticeTerms();
			String sbIds=infos.stream().map((x)->x.getUuid()).collect(Collectors.joining(","));
			String sbNames=infos.stream().map(OaInfoterm::getRoomName).collect(Collectors.joining(","));
			*/		
			otherEntity.setTermIds(getEntity.getTermIds());
			otherEntity.setTermNames(getEntity.getTermNames());
			otherEntity.setNoticeId(id);
		}
		
		return otherEntity;
	}

	public OaNoticeOther getNoticeStuInfo(String id) {
		
		OaNoticeOther otherEntity = new OaNoticeOther();
		OaNotice getEntity = this.get(id);
		
		//当为指定学生时，才去查询，否则不查询
		if("2".equals(getEntity.getStuRadio())){
			
			Set<SysUser> stus = getEntity.getNoticeStus();
			String sbIds=stus.stream().map((x)->x.getUuid()).collect(Collectors.joining(","));
			String sbNames=stus.stream().map(SysUser::getXm).collect(Collectors.joining(","));
					
			otherEntity.setStuIds(sbIds);
			otherEntity.setStuNames(sbNames);
			otherEntity.setNoticeId(id);
		}	
	
		return otherEntity;
	}

	@Override
	public List<OaNotice> getUserOaNotice(SysUser currentUser) {
		String today = DateUtil.formatDate(new Date());
		StringBuffer hql = new StringBuffer("select distinct o from OaNotice as o ");
		hql.append(" left join fetch o.noticeUsers as u ");
		hql.append(" left join fetch o.noticeRoles as r ");
		hql.append(" left join fetch o.noticeDepts as d ");
		hql.append(" left join fetch o.noticeStus as s ");
		hql.append(" where o.isDelete=0 ");
		hql.append(" and o.beginDate<='" + today + "' ");
		hql.append(" and o.endDate>='" + today + "' ");
		hql.append(" order by o.createTime desc ");
		List<OaNotice> list = this.queryByHql(hql.toString());
		String userId = currentUser.getUuid();
		StringBuffer hql2 = new StringBuffer("from SysUser as u ");
		hql2.append(" left join fetch u.sysRoles as r ");
		hql2.append(" left join fetch u.userDepts as d ");
		hql2.append(" where u.uuid='" + userId + "' ");
		currentUser = userService.queryByHql(hql2.toString()).get(0);
		Set<SysRole> userRoles = currentUser.getSysRoles();
		//Set<BaseOrg> userDepts = currentUser.getUserDepts();	--换成下面的方式
		Set<BaseOrg> userDepts  = userService.getDeptByUserId(currentUser.getUuid());
		
		List<OaNotice> list2 = new ArrayList<OaNotice>();
		NEXT: for (OaNotice oaNotice : list) {
			Set<SysUser> noticeUsers = oaNotice.getNoticeUsers();
			for (SysUser sysUser : noticeUsers) {
				if (sysUser.getUuid().equals(userId)) {
					list2.add(oaNotice);
					continue NEXT;
				}
			}
			Set<SysUser> noticeStus = oaNotice.getNoticeStus();
			for (SysUser sysUser : noticeStus) {
				if (sysUser.getUuid().equals(userId)) {
					list2.add(oaNotice);
					continue NEXT;
				}
			}
			Set<SysRole> noticeRoles = oaNotice.getNoticeRoles();
			for (SysRole sysRole : noticeRoles) {
				for (SysRole userRole : userRoles) {
					if (sysRole.getUuid().equals(userRole.getUuid())) {
						list2.add(oaNotice);
						continue NEXT;
					}
				}
			}
			Set<BaseOrg> noticeDepts = oaNotice.getNoticeDepts();
			for (BaseOrg baseOrg : noticeDepts) {
				for (BaseOrg userOrg : userDepts) {
					if (baseOrg.getUuid().equals(userOrg.getUuid())) {
						list2.add(oaNotice);
						continue NEXT;
					}
				}
			}
		}
		return list2;
	}

	/**
	 * 获取发送到指定终端的通知公告数据列表
	 * 
	 * @param start
	 *            查询的起始记录数
	 * @param limit
	 *            每页的记录数
	 * @param sort
	 *            排序参数
	 * @param filter
	 *            查询过滤参数
	 * @param termCode
	 *            指定的终端号
	 * @return
	 */
	@Override
	public QueryResult<OaNotice> list(Integer start, Integer limit, String sort, String filter,String termCode) {
		try {
			OaInfoterm term = oaInfotermService.getByProerties("termCode", termCode);
			// 如果存在此终端
			if (ModelUtil.isNotNull(term)) {
				String termId = term.getUuid();
				String justDateStr = DateUtil.formatDate(new Date());
				StringBuffer hql = new StringBuffer(" from OaNotice o ");
				hql.append(" inner join  fetch o.noticeTerms g ");
				hql.append(MessageFormat.format(" where o.isDelete=0 and g.uuid=''{0}''", termId));
				hql.append(MessageFormat.format(" and o.beginDate<=''{0}'' and o.endDate>=''{1}'' ", justDateStr,
						justDateStr));
				hql.append("order by o.createTime desc");
				QueryResult<OaNotice> qr = this.queryResult(hql.toString(), start, limit);
				if (qr.getTotalCount() > 0)
					return qr;
				else
					return null;
			} else {
				return null;
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		}
	}
}
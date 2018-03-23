package com.zd.school.plartform.system.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.sql.PreparedStatement;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.zd.core.constant.Constant;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.eduresources.model.JwTBasecourse;
import com.zd.school.jw.eduresources.model.JwTGrade;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTBasecourseService;
import com.zd.school.jw.eduresources.service.JwTGradeService;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.plartform.baseset.model.BaseDeptjob;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseOrgChkTree;
import com.zd.school.plartform.baseset.model.BaseOrgToUP;
import com.zd.school.plartform.baseset.model.BaseOrgTree;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.system.dao.SysOrgDao;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.model.SysUserToUP;
import com.zd.school.plartform.system.service.SysDatapermissionService;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.redis.service.DeptRedisService;

/**
 * 
 * ClassName: BaseOrgServiceImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: BASE_T_ORG实体Service接口实现类. date: 2016-07-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class SysOrgServiceImpl extends BaseServiceImpl<BaseOrg> implements SysOrgService {

	@Resource
	public void setBaseOrgDao(SysOrgDao dao) {
		this.dao = dao;
	}
	
	@Autowired
	private  HttpServletRequest request;
	
	@Resource
	private DeptRedisService deptRedisService;
	
	@Resource
	private JwTGradeService gradeService; // 年级的service

	@Resource
	private JwTGradeclassService classService; // 班级的service

	@Resource
	private SysDatapermissionService dataPeimissService; // 数据权限service

	@Resource
	private JwTBasecourseService courseService; // 基础学科service
	
	@Resource
	private SysUserService sysUserService; // 人员service

	@Override
	public List<BaseOrgTree> getOrgTreeList(String whereSql, String orderSql, SysUser currentUser) {

		// //当前登录人的部门信息
		// String deptId = currentUser.getDeptId();
		// String treeIds = "";
		// if (!deptId.equals("ROOT")) {
		// BaseOrg selfDept = this.get(deptId);
		// treeIds = selfDept.getTreeIds(); //当前部门的树形结点ID
		// }
		//
		// //获取当前登录用户的部门范围权限
		// String rightType = "2";
		// String[] propName = { "userId", "entityName", "displayMode" };
		// String[] propValue = { currentUser.getUuid(), "BaseOrg", "1" };
		// SysDatapermission datapermission =
		// dataPeimissService.getByProerties(propName, propValue);
		// if (ModelUtil.isNotNull(datapermission)) {
		// rightType = datapermission.getRightType();
		// }
		// //List<Object[]> addList = new ArrayList<>();
		// //需要添加的权限过滤条件
		// List<Object> filterList = new ArrayList<Object>();
		// //最后要组装的查询语句
		// StringBuffer hql = new StringBuffer(" from BaseOrg where isDelete=0
		// ");
		// switch (rightType) {
		// case "0":
		// //全部数据
		// break;
		// case "1":
		// //本单元数据,因为是树形数据，因此城需要将父节点构建出来
		// String sql = "select DEPT_ID from BASE_T_ORG WHERE ISDELETE=0 AND
		// DEPT_ID in ('"
		// + treeIds.replace(",", "','") + "')";
		// List<Object[]> addList = this.queryObjectBySql(sql);
		// filterList.addAll(addList);
		// break;
		// case "2":
		// //本单元及子单元数据
		// String sql1 = "select DEPT_ID from BASE_T_ORG WHERE ISDELETE=0 AND
		// DEPT_ID in ('"
		// + treeIds.replace(",", "','") + "')";
		// List<Object[]> addList1 = this.queryObjectBySql(sql1);
		// filterList.addAll(addList1);
		//
		// String sql2 = "select DEPT_ID from BASE_T_ORG WHERE ISDELETE=0 AND
		// TREE_IDS like '" + treeIds + "%'";
		// List<Object[]> addList2 = this.queryObjectBySql(sql2);
		// filterList.addAll(addList2);
		// break;
		// case "3":
		// //指定的数据
		// break;
		// default:
		// break;
		// }
		// List<BaseOrg> lists = new ArrayList<BaseOrg>();
		// if (filterList.size() > 0) {
		// hql.append(" and uuid in(:depts)");
		// if (StringUtils.isNotEmpty(whereSql)) {
		// hql.append(whereSql);
		// }
		// if (StringUtils.isNotEmpty(orderSql)) {
		// hql.append(orderSql);
		// }
		// lists = this.queryByHql(hql.toString(), "depts", filterList.toArray());
		// } else {
		// if (StringUtils.isNotEmpty(whereSql)) {
		// hql.append(whereSql);
		// }
		// if (StringUtils.isNotEmpty(orderSql)) {
		// hql.append(orderSql);
		// }
		// lists = this.queryByHql(hql.toString());// 执行查询方法
		// }
		String hql = " from BaseOrg where isDelete = 0 order by parentNode,orderIndex";
		List<BaseOrgTree> result = new ArrayList<BaseOrgTree>();
		List<BaseOrg> lists = this.queryByHql(hql);
		Map<String, BaseOrg> maps = new HashMap<String, BaseOrg>();
		// for (BaseOrg baseOrg : rightDept) {
		// maps.put(baseOrg.getUuid(), baseOrg);
		// }
		// 构建Tree数据
		createChild(new BaseOrgTree(TreeVeriable.ROOT, new ArrayList<BaseOrgTree>()), result, lists, maps);

		return result;
	}

	private void createChild(BaseOrgTree parentNode, List<BaseOrgTree> result, List<BaseOrg> list,
			Map<String, BaseOrg> maps) {
		List<BaseOrg> childs = new ArrayList<BaseOrg>();
		String isRight = "1";
		for (BaseOrg org : list) {
			if (org.getParentNode().equals(parentNode.getId())) {
				childs.add(org);
			}
		}
		// public BaseOrgTree(String id, String text, String iconCls, Boolean
		// leaf, Integer level, String treeid,
		// List<BaseOrgTree> children, String mainLeader, String viceLeader,
		// String outPhone, String inPhone,
		// String fax, Integer isSystem, String remark, String code, String
		// parent, Integer orderIndex,
		// String deptType, String deptTypeName, String mainLeaderName, String
		// viceLeaderName)
		for (BaseOrg org : childs) {
			// if (maps.get(org.getUuid()) == null) {
			// isRight = "1";
			// } else {
			isRight = "0";
			// }
			BaseOrgTree child = new BaseOrgTree(org.getUuid(), org.getNodeText(), "", org.getLeaf(), org.getNodeLevel(),
					org.getTreeIds(),org.getParentNode(),org.getOrderIndex(), new ArrayList<BaseOrgTree>(),
					org.getOutPhone(), org.getInPhone(), org.getFax(), org.getIssystem(), org.getRemark(),
					org.getNodeCode(), org.getDeptType(), org.getParentType(),
					org.getMainLeaderName(), org.getSuperJob(),org.getSuperjobName(), isRight);

			if (org.getParentNode().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<BaseOrgTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createChild(child, result, list, maps);
		}
	}

	@Override
	public String delOrg(String delIds, SysUser currentUser) {
		// 删除班级
		//boolean flag = gradeService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
		// 删除年级
		//flag = classService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
		// 删除部门
		//flag = this.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());

		// 检查删除的部门的上级部门是否还有子部门
		// 如果没有子部门了要设置上级部门为叶节点
	
		String[] delUuid = delIds.split(",");
		for (String id : delUuid) {
			BaseOrg org = this.get(id);
			String hql = "select count(*) from BaseOrg where parentNode='" + org.getParentNode() + "' and isDelete=0";
			Integer count = this.getQueryCountByHql(hql);
			if (count.equals(0)) {
				BaseOrg parentOrg = this.get(org.getParentNode());
				parentOrg.setLeaf(true);
				parentOrg.setUpdateUser(currentUser.getUuid());
				parentOrg.setUpdateTime(new Date());
				this.merge(parentOrg);
			}
			String deptType = org.getDeptType();
			List<SysUser> deptUser = sysUserService.getUserByDeptId(id);
			if (deptUser != null && deptUser.size() > 0) {
				TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
				return org.getNodeText() + "部门下存在人员,请删除后重试";
			}
			switch (deptType) {
			case "04": // 年级
				JwTGrade grade = gradeService.get(id);
				hql = "from JwTGradeclass where graiId='" + id + "'";
				List<JwTGradeclass> gradeclasses = classService.queryByHql(hql);
				// 检查年级下的班级是否存在人员
				for (JwTGradeclass jwTGradeclass : gradeclasses) {
					hql = "select count(*) from JwClassstudent where isDelete=0 and claiId='" + jwTGradeclass.getUuid()
							+ "'";
					count = this.getQueryCountByHql(hql);
					if (count > 0) {
						TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
						return jwTGradeclass.getClassName() + "班级下存在人员,请删除后重试";
					}

					hql = "select count(*) from JwClassRoomAllot where isDelete=0 and claiId='"
							+ jwTGradeclass.getUuid() + "'";
					count = this.getQueryCountByHql(hql);
					if (count > 0) {
						TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
						return jwTGradeclass.getClassName() + "班级下存在教室,请删除后重试";
					}

					hql = "select count(*) from JwClassDormAllot where isDelete=0 and claiId='"
							+ jwTGradeclass.getUuid() + "'";
					count = this.getQueryCountByHql(hql);
					if (count > 0) {
						TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
						return jwTGradeclass.getClassName() + "班级下存在宿舍,请删除后重试";
					}
					hql = "select count(*) from PtTerm where isDelete=0 and roomId in("
							+ "select roomId from JwClassRoomAllot where isDelete=0 and claiId='"
							+ jwTGradeclass.getUuid() + "')";
					count = this.getQueryCountByHql(hql);
					if (count > 0) {
						TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
						return jwTGradeclass.getClassName() + "班级下存在设备,请删除后重试";
					}
					hql = "select count(*) from PtTerm where isDelete=0 and roomId in("
							+ "select dormId from JwClassDormAllot where isDelete=0 and claiId='"
							+ jwTGradeclass.getUuid() + "')";
					count = this.getQueryCountByHql(hql);
					if (count > 0) {
						TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
						return jwTGradeclass.getClassName() + "班级下存在设备,请删除后重试";
					}
				}
				for (JwTGradeclass jwTGradeclass : gradeclasses) {
					jwTGradeclass.setIsDelete(1);
					classService.merge(jwTGradeclass);
				}
				grade.setIsDelete(1);
				gradeService.merge(grade);
				break;
			case "05": // 班级
				JwTGradeclass jwTGradeclass = classService.get(id);
				hql = "select count(*) from JwClassstudent where isDelete=0 and claiId='" + jwTGradeclass.getUuid()
						+ "'";
				count = this.getQueryCountByHql(hql);
				if (count > 0) {
					TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
					return jwTGradeclass.getClassName() + "班级下存在人员,请删除后重试";
				}
				hql = "select count(*) from JwClassRoomAllot where isDelete=0 and claiId='" + jwTGradeclass.getUuid()
						+ "'";
				count = this.getQueryCountByHql(hql);
				if (count > 0) {
					TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
					return jwTGradeclass.getClassName() + "班级下存在教室,请删除后重试";
				}
				hql = "select count(*) from JwClassDormAllot where isDelete=0 and claiId='" + jwTGradeclass.getUuid()
						+ "'";
				count = this.getQueryCountByHql(hql);
				if (count > 0) {
					TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
					return jwTGradeclass.getClassName() + "班级下存在宿舍,请删除后重试";
				}

				hql = "select count(*) from PtTerm where isDelete=0 and roomId in("
						+ "select roomId from JwClassRoomAllot where isDelete=0 and claiId='" + jwTGradeclass.getUuid()
						+ "')";
				count = this.getQueryCountByHql(hql);
				if (count > 0) {
					TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
					return jwTGradeclass.getClassName() + "班级下存在设备,请删除后重试";
				}
				hql = "select count(*) from PtTerm where isDelete=0 and roomId in("
						+ "select dormId from JwClassDormAllot where isDelete=0 and claiId='" + jwTGradeclass.getUuid()
						+ "')";
				count = this.getQueryCountByHql(hql);
				if (count > 0) {
					TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
					return jwTGradeclass.getClassName() + "班级下存在设备,请删除后重试";
				}
				jwTGradeclass.setIsDelete(1);
				classService.merge(jwTGradeclass);
				break;
			default:
				break;
			}
			org.setIsDelete(1);
			this.merge(org);
		}
		
		//删除所有redis部门缓存数据，以免产生误会
		deptRedisService.deleteDeptTreeAll();
				
		return "1";
	}

	/**
	 * 
	 * TODO 增加新部门,当增加的部门是年级或班级时，需要将数据同步至年级信息表和班级信息表.
	 * 关于添加学科：预先添加好课程信息，然后再添加学科时，才能把课程绑定到学科中。
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 * 
	 * @see com.zd.school.plartform.system.service.SysOrgService#addOrg(com.zd.school.plartform.baseset.model.BaseOrg,
	 *      com.zd.school.plartform.system.model.SysUser)
	 */
	@Override
	public BaseOrg addOrg(BaseOrg entity, SysUser currentUser)
			throws IllegalAccessException, InvocationTargetException {
		String parentNode = entity.getParentNode();
		String parentName = entity.getParentName();
		String nodeText = entity.getNodeText();
		Integer orderIndex = entity.getOrderIndex();
		String deptType = entity.getDeptType();
		String parentType = entity.getParentType();

		// 插入部门数据
		// BaseOrg saveEntity = null;
		String courseId = null;
		if (deptType.equals("06")) {
			JwTBasecourse course = courseService.getByProerties("courseName", nodeText);
			courseId = course.getUuid();
		}

		BaseOrg saveEntity = new BaseOrg();
		List<String> excludedProp = new ArrayList<>();
		excludedProp.add("uuid");
		BeanUtils.copyProperties(saveEntity, entity,excludedProp);	
		
		saveEntity.setCreateUser(currentUser.getUuid()); // 创建人
		saveEntity.setLeaf(true);
		saveEntity.setIssystem(0);
		saveEntity.setExtField01(courseId); // 对于部门是学科时，绑定已有学科对应的ID
				
		if (!parentNode.equals(TreeVeriable.ROOT)) {
			BaseOrg parEntity = this.get(parentNode);
			parEntity.setLeaf(false);
			this.merge(parEntity);
			saveEntity.BuildNode(parEntity);		
			saveEntity.setAllDeptName(parEntity.getAllDeptName() + "/" + nodeText);			
		} else
			saveEntity.BuildNode(null);
		
		
		//添加副ID
		//查询当前部门下最大的副ID,以及父Id
		//暂时不编写了，因为比较麻烦，还是让用户手动点击同步比较可靠
//		BaseOrg fuIds=this.getCurrentFuId(parentNode);
//		saveEntity.setExtField04(fuIds.getExtField04());
//		saveEntity.setExtField05(fuIds.getExtField05());
		
		// 持久化到数据库
		entity = this.merge(saveEntity);
		
		
		// 插入年级数据或班级数据
		String orgId = entity.getUuid();
		switch (deptType) {
		case "04": // 年级
			JwTGrade grade = new JwTGrade(orgId);
			grade.setGradeName(entity.getNodeText());
			grade.setCreateUser(currentUser.getUuid());
			grade.setOrderIndex(entity.getOrderIndex());
			grade.setIsDelete(0);
			grade.setSchoolId(currentUser.getSchoolId());
			grade.setNj(entity.getNj());
			grade.setSectionCode(entity.getSectionCode());
			grade.setGradeCode(entity.getSectionCode() + entity.getNj());
			gradeService.merge(grade);
			break;
		case "05": // 班级
			JwTGrade gradea=gradeService.get(parentNode);
			JwTGradeclass gradeclass = new JwTGradeclass(orgId);
			gradeclass.setClassName(entity.getNodeText());
			gradeclass.setOrderIndex(entity.getOrderIndex());
			gradeclass.setIsDelete(0);
			gradeclass.setGraiId(parentNode);
			gradeclass.setCreateUser(currentUser.getUuid());
			gradeclass.setNj(gradea.getGradeCode());
			classService.merge(gradeclass);
			break;
		default:
			break;
		}
		
		//删除所有redis部门缓存数据，以免产生误会
		deptRedisService.deleteDeptTreeAll();
		return entity;
	}

	@Override
	public List<BaseOrg> getOrgList(String whereSql, String orderSql, SysUser currentUser) {

		StringBuffer hql = new StringBuffer(" from BaseOrg where 1=1 and isDelete=0 ");
		hql.append(whereSql);
		hql.append(orderSql);
		List<BaseOrg> lists = this.queryByHql(hql.toString());// 执行查询方法

		// 当前登录人的部门信息
		// String deptId = currentUser.getDeptId();
		// String treeIds = "";
		// if (!deptId.equals("ROOT")) {
		// BaseOrg selfDept = this.get(deptId);
		// treeIds = selfDept.getTreeIds(); //当前部门的树形结点ID
		// }
		// //获取当前登录用户的部门范围权限
		// String rightType = "2";
		// String[] propName = { "userId", "entityName", "displayMode" };
		// String[] propValue = { currentUser.getUuid(), "BaseOrg", "0" };
		// SysDatapermission datapermission =
		// dataPeimissService.getByProerties(propName, propValue);
		// if (ModelUtil.isNotNull(datapermission)) {
		// rightType = datapermission.getRightType();
		// }
		//
		// String sql = "";
		// List<Object[]> addList = new ArrayList<>();
		// //需要添加的权限过滤条件
		// List<Object> filterList = new ArrayList<Object>();
		// //最后要组装的查询语句
		// StringBuffer hql = new StringBuffer(" from BaseOrg where 1=1 ");
		// switch (rightType) {
		// case "0":
		// //全部数据
		// break;
		// case "1":
		// //本单元数据
		// filterList.add(deptId);
		// break;
		// case "2":
		// //本单元及子单元数据
		// sql = "select DEPT_ID from BASE_T_ORG WHERE ISDELETE=0 AND TREE_IDS
		// like '" + treeIds + "%'";
		// addList = this.queryObjectBySql(sql);
		// filterList.addAll(addList);
		// break;
		// case "3":
		// //指定的数据
		// break;
		// default:
		// break;
		// }
		// List<BaseOrg> lists = new ArrayList<BaseOrg>();
		// if (filterList.size() > 0) {
		// if (StringUtils.isNotEmpty(whereSql)) {
		// hql.append(whereSql);
		// }
		// hql.append(" and uuid in(:depts)");
		// if (StringUtils.isNotEmpty(orderSql)) {
		// hql.append(orderSql);
		// }
		// lists = this.queryByHql(hql.toString(), "depts", filterList.toArray());
		// } else {
		// if (StringUtils.isNotEmpty(whereSql)) {
		// hql.append(whereSql);
		// }
		// if (StringUtils.isNotEmpty(orderSql)) {
		// hql.append(orderSql);
		// }
		// lists = this.queryByHql(hql.toString());// 执行查询方法
		// }

		return lists;
	}

	@Override
	public List<BaseOrg> getOrgAndChildList(String deptId, String orderSql, SysUser currentUser, Boolean isRight) {

		String treeIds = "";
		String sql = "";
		StringBuffer rightDeptIds = new StringBuffer();
		BaseOrg selfDept = this.get(deptId);
		List<BaseOrg> rightList = new ArrayList<BaseOrg>();
		List<BaseOrg> reList = new ArrayList<BaseOrg>();
		if (ModelUtil.isNotNull(selfDept)) {
			treeIds = selfDept.getTreeIds();
			sql = " from BaseOrg WHERE isDelete=0 AND treeIds like '" + treeIds + "%'";
		} else {
			sql = " from BaseOrg WHERE isDelete=0 ";
		}
		if (isRight) {
			rightList = this.getOrgList("", "", currentUser);
			List<Object> filterList = new ArrayList<Object>();
			if (rightList.size() > 0) {
				for (BaseOrg bg : rightList) {
					filterList.add(bg.getUuid());
				}
				sql += " and uuid in (:depts)";
				reList = this.queryByHql(sql, "depts", filterList.toArray());
			}
		} else {
			reList = this.queryByHql(sql);
		}
		// List<BaseOrg> reList = this.queryEntityBySql(sql);
		return reList;
	}

	@Override
	public Integer getChildCount(String deptId) {
		String hql = " select count(*) from BaseOrg where isDelete=0 and parentNode='" + deptId + "'";
		Integer childCount = this.getQueryCountByHql(hql);
		// TODO Auto-generated method stub
		return childCount;
	}

	@Override
	public List<BaseOrgChkTree> getOrgChkTreeList(String whereSql, String orderSql, String deptId, SysUser currentUser) {

		// 先查询出当前用户有权限的部门数据
		List<BaseOrg> listOrg = this.getOrgList(whereSql, orderSql, currentUser);
		// 根据部门数据生成带checkbox的树

		List<BaseOrgChkTree> result = new ArrayList<BaseOrgChkTree>();
		if (deptId.equals(TreeVeriable.ROOT)) {
			createChildChkTree(new BaseOrgChkTree(TreeVeriable.ROOT, new ArrayList<BaseOrgChkTree>()), result, listOrg);
		}else{//当传进来的根节点不是root时 ，是部门id时
			createDeptChildChkTree(new BaseOrgChkTree(deptId, new ArrayList<BaseOrgChkTree>()), result, listOrg,deptId);
		}
	
		
		return result;
	}

	private void createChildChkTree(BaseOrgChkTree parentNode, List<BaseOrgChkTree> result, List<BaseOrg> list) {
		List<BaseOrg> childs = new ArrayList<BaseOrg>();
		for (BaseOrg org : list) {
			if (org.getParentNode().equals(parentNode.getId())) {
				childs.add(org);
			}
		}
		// BaseOrgChkTree(String id, String text, String iconCls, Boolean leaf,
		// Integer level, String treeid,
		// List<BaseOrgChkTree> children, String mainLeader, String viceLeader,
		// String outPhone, String inPhone,
		// String fax, Integer isSystem, String remark, String code, String
		// parent, Integer orderIndex,
		// String deptType, String parentType, String mainLeaderName, String
		// viceLeaderName, String isRight,
		// Boolean checked)
		for (BaseOrg org : childs) {
			BaseOrgChkTree child = new BaseOrgChkTree(org.getUuid(), org.getNodeText(), "", org.getLeaf(),
					org.getNodeLevel(), org.getTreeIds(), new ArrayList<BaseOrgChkTree>(), org.getOutPhone(), org.getInPhone(), org.getFax(), org.getIssystem(),
					org.getRemark(), org.getNodeCode(), org.getParentNode(), org.getOrderIndex(), org.getDeptType(),
					org.getParentType(), org.getMainLeaderName(), org.getSuperJob(),org.getSuperjobName(), "0",org.getNj(),org.getSectionCode(),false);

			if (org.getParentNode().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<BaseOrgChkTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createChildChkTree(child, result, list);
		}
	}
	private void createDeptChildChkTree(BaseOrgChkTree parentNode, List<BaseOrgChkTree> result, List<BaseOrg> list,String deptId) {
		List<BaseOrg> childs = new ArrayList<BaseOrg>();
		for (BaseOrg org : list) {
			if (org.getUuid().equals(deptId)) {
				childs.add(org);
				continue;
			}else{
				if (org.getParentNode().equals(parentNode.getId())) {
					childs.add(org);
				}
			}
		}
/*		for (BaseOrg org : list) {
			if (org.getParentNode().equals(parentNode.getId())) {
				childs.add(org);
			}
		}*/
		for (BaseOrg org : childs) {
			BaseOrgChkTree child = new BaseOrgChkTree(org.getUuid(), org.getNodeText(), "", org.getLeaf(),
					org.getNodeLevel(), org.getTreeIds(), new ArrayList<BaseOrgChkTree>(), org.getOutPhone(), org.getInPhone(), org.getFax(), org.getIssystem(),
					org.getRemark(), org.getNodeCode(), org.getParentNode(), org.getOrderIndex(), org.getDeptType(),
					org.getParentType(), org.getMainLeaderName(), org.getSuperJob(),org.getSuperjobName(), "0",org.getNj(),org.getSectionCode(),false);

			if (org.getUuid().equals(deptId)) {
				result.add(child);
			} else {
				List<BaseOrgChkTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createDeptChildChkTree(child, result, list,"");
		}
	}
	@Override
	public String getOrgChildIds(String orgId, boolean isSelf) {
		String treeIds = "";
		String hql = "";
		StringBuffer sbOrgIds = new StringBuffer();
		BaseOrg selfDept = this.get(orgId);

		if (ModelUtil.isNotNull(selfDept)) {
			treeIds = selfDept.getTreeIds();
			hql = " from BaseOrg WHERE isDelete=0 AND treeIds like '" + treeIds + "%'";
		} else {
			hql = " from BaseOrg WHERE isDelete=0 ";
		}
		List<BaseOrg> reList = this.queryByHql(hql);
		if (!isSelf) {
			reList.remove(selfDept);
		}
		for (BaseOrg baseOrg : reList) {
			sbOrgIds.append(baseOrg.getUuid() + ",");
		}

		if (sbOrgIds.length() > 0)
			treeIds = StringUtils.trimLast(sbOrgIds.toString());
		else
			treeIds = "";
		// TODO Auto-generated method stub
		return treeIds;
	}

	@Override
	public Map<String, BaseOrg> getOrgChildMaps(String orgId, boolean isSelf) {
		String treeIds = "";
		String hql = "";
		StringBuffer sbOrgIds = new StringBuffer();
		BaseOrg selfDept = this.get(orgId);
		Map<String, BaseOrg> maps = new HashMap<String, BaseOrg>();
		if (ModelUtil.isNotNull(selfDept)) {
			treeIds = selfDept.getTreeIds();
			hql = " from BaseOrg WHERE isDelete=0 AND treeIds like '" + treeIds + "%'";
		} else {
			hql = " from BaseOrg WHERE isDelete=0 ";
		}
		List<BaseOrg> reList = this.queryByHql(hql);
		if (!isSelf) {
			reList.remove(selfDept);
		}
		for (BaseOrg baseOrg : reList) {
			maps.put(baseOrg.getUuid(), baseOrg);
		}
		// TODO Auto-generated method stub
		return maps;
	}

	@Override
	public int syncDeptInfoToUP(BaseOrgToUP baseOrgToUP, String smallDeptId) {
		// TODO Auto-generated method stub
		int row = 0;
		try {
			// 1.查询该数据源中的此部门的信息
			String sql = "SELECT departmentId,parentDepartmentId,convert(varchar(1),DepartmentStatus) departmentStatus,"
					+ " convert(varchar(36),departmentName) as departmentName,"
					+ " convert(varchar,layer) as layer,convert(varchar,layerorder) as layerorder "
					+ " FROM TC_Department " + " where DepartmentID = '" + smallDeptId + "'"
					+ " order by DepartmentID asc";

			List<BaseOrgToUP> upDeptInfos = this.queryEntityBySql(sql, BaseOrgToUP.class);

			// 2.判断用户信息该作哪种处理
			if (upDeptInfos.isEmpty()) { // 若UP没有此数据，则增加
				if (baseOrgToUP != null) {
					String sqlInsert = "insert into TC_Department(DepartmentID,ParentDepartmentID,DepartmentName,DepartmentStatus,layer,layerorder) "
							+ " values('" + baseOrgToUP.getDepartmentId() + "','" + baseOrgToUP.getParentDepartmentId()
							+ "'," + "'" + baseOrgToUP.getDepartmentName() + "',1,'" + baseOrgToUP.getLayer() + "','"
							+ baseOrgToUP.getLayerorder() + "')";

					row = this.doExecuteCountBySql(sqlInsert);
				}
			} else { // 若存在，则判断是修改还是删除
				BaseOrgToUP upDeptInfo = upDeptInfos.get(0);

				if (baseOrgToUP == null) { // 没有此部门数据，则删除
					String sqlDelete = "update TC_Department set DepartmentStatus='0' where DepartmentID='"
							+ smallDeptId + "'";// 逻辑删除
					row = this.doExecuteCountBySql(sqlDelete);

				} else { // 若数据都存在，则判断是否有修改
					if (!baseOrgToUP.equals(upDeptInfo)) { // 对比部分数据是否一致
						String sqlUpdate = "update TC_Department set ParentDepartmentID='"
								+ baseOrgToUP.getParentDepartmentId() + "',DepartmentStatus='1'," + " DepartmentName='"
								+ baseOrgToUP.getDepartmentName() + "',layer='" + baseOrgToUP.getLayer() + "',"
								+ "layerorder='" + baseOrgToUP.getLayerorder() + "'" + " where DepartmentID='"
								+ smallDeptId + "'";

						row = this.doExecuteCountBySql(sqlUpdate);
						
					} else if (upDeptInfo.getDepartmentStatus().equals("0")) { // 若状态为0，则置为1
						String sqlUpdate = "update TC_Department set DepartmentStatus='1'" 
								+ " where DepartmentID='" + smallDeptId + "'";

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
	public BaseOrg doUpdate(BaseOrg entity, String userId) {
		String parentNode = entity.getParentNode();	
		String nodeText = entity.getNodeText();
		String uuid = entity.getUuid();
		String deptType = entity.getDeptType();
		
		// 先拿到已持久化的实体
		BaseOrg perEntity = this.get(uuid);
		Boolean isLeaf = perEntity.getLeaf();
		String oldDeptName = perEntity.getNodeText();
		//String OldParentNode=perEntity.getParentNode();
		
		// 将entity中不为空的字段动态加入到perEntity中去。
		try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(userId); // 设置修改人的id
		perEntity.setLeaf(isLeaf);


		// 更新父节点的是否叶节点的标记
		BaseOrg parentOrg = this.get(parentNode);
		if(parentOrg!=null){
			parentOrg.setUpdateTime(new Date()); // 设置修改时间
			parentOrg.setUpdateUser(userId); // 设置修改人的中文名
			parentOrg.setLeaf(false);
			this.merge(parentOrg);// 执行修改方法
			
			perEntity.BuildNode(parentOrg);
			perEntity.setAllDeptName(parentOrg.getAllDeptName()+"/"+nodeText);
		}
		
		//当父部门发生变化时,就更新副ID
		//查询当前部门下最大的副ID,以及父Id
		//暂时不编写了，因为比较麻烦，还是让用户手动点击同步比较可靠
//		if(!OldParentNode.equals(parentNode)){
//			BaseOrg fuIds=this.getCurrentFuId(parentNode);
//			perEntity.setExtField04(fuIds.getExtField04());
//			perEntity.setExtField05(fuIds.getExtField05());
//		}				
		entity = this.merge(perEntity);// 执行修改方法
		
		if (deptType.equals("04")) { // 年级
			JwTGrade grade = gradeService.get(uuid);
			grade.setGradeName(nodeText);
			grade.setUpdateUser(userId);
			grade.setOrderIndex(entity.getOrderIndex());
			grade.setIsDelete(0);
			grade.setNj(entity.getNj());
			grade.setSectionCode(entity.getSectionCode());
			grade.setGradeCode(entity.getSectionCode()+entity.getNj());
			gradeService.merge(grade);
		} else if (deptType.equals("05")) { // 班级
			JwTGradeclass gradeclass = classService.get(uuid);
			gradeclass.setClassName(nodeText);
			gradeclass.setUpdateUser(userId);
			gradeclass.setOrderIndex(entity.getOrderIndex());
			gradeclass.setIsDelete(0);
			gradeclass.setGraiId(parentNode);
			classService.merge(gradeclass);
		}
		
		if(!oldDeptName.equals(nodeText)){
			//再更新其他地方的名称		
			this.setDeptName(nodeText,uuid);
			if(parentOrg!=null&&!parentNode.equals("ROOT"))
				this.setChildAllDeptName(entity,parentOrg.getAllDeptName());
			else
				this.setChildAllDeptName(entity,"ROOT");
		}
		
		//删除所有redis部门缓存数据，以免产生误会
		deptRedisService.deleteDeptTreeAll();
				
		return entity;
	}

	@Override
	public Integer getDeptJobCount(String uuid) {
		String hql = " select count(*) from BaseDeptjob where isDelete=0 and (deptId='" + uuid + "' or parentdeptId='"+uuid+"')";
		Integer childCount = this.getQueryCountByHql(hql);
		// TODO Auto-generated method stub
		return childCount;
	}
	
	@Override
	public void setDeptName(String deptName,String uuid){	
		String updateHql1="update BaseOrg a set a.superdeptName='"+deptName+"' where a.superDept='"+uuid+"'";
		String updateHql2="update BaseDeptjob a set a.deptName='"+deptName+"' where a.deptId='"+uuid+"'";
		String updateHql3="update BaseDeptjob a set a.parentdeptName='"+deptName +"' where a.parentdeptId='"+uuid+"'";
		this.doExecuteCountByHql(updateHql1);
		this.doExecuteCountByHql(updateHql2);
		this.doExecuteCountByHql(updateHql3);	
	}
	@Override
	public void setChildAllDeptName(BaseOrg dept,String parentAllDeptName){	
		//1.设置当前类的全部门名
		String currentAllName="";
		if(!"ROOT".equals(parentAllDeptName))
			currentAllName=parentAllDeptName+"/"+dept.getNodeText();
		else
			currentAllName=dept.getNodeText();
		
		dept.setAllDeptName(currentAllName);	
		this.merge(dept);
		
		//2.设置相应的部门岗位的部门全名
		String updateHql="update BaseDeptjob a set a.allDeptName='"+currentAllName +"' where a.deptId='"+dept.getUuid()+"'";
		this.doExecuteCountByHql(updateHql);	
		
		//3.递归遍历设置子部门的全部门名
		List<BaseOrg> childDepts = this.queryByProerties(new String[]{"isDelete","parentNode"}, new Object[]{0,dept.getUuid()});
		for(int i=0;i<childDepts.size();i++){
			this.setChildAllDeptName(childDepts.get(i),currentAllName);
		}
		
	}

	@Override
	public int syncAllDeptInfoToUP(List<BaseOrgToUP> deptInfos) {
		// TODO Auto-generated method stub
		int row = 0;
		try {
			// 1.查询该数据源中的此部门的信息(排除班级部门Train)
			String sql = "SELECT departmentId,parentDepartmentId,convert(varchar(1),DepartmentStatus) departmentStatus,"
					+ " convert(varchar(36),departmentName) as departmentName,"
					+ " convert(varchar,layer) as layer,convert(varchar,layerorder) as layerorder "
					+ " FROM TC_Department " + " where DepartmentID not like 'Train%'"	
					+ " order by DepartmentID asc";

			List<BaseOrgToUP> upDeptInfos = this.queryEntityBySql(sql, BaseOrgToUP.class);
			
			// 循环对比
			BaseOrgToUP currentDept = null;
			BaseOrgToUP upDept = null;
			boolean isExist = false;
			StringBuffer sqlSb = new StringBuffer();
			for(int i=0;i<deptInfos.size();i++){			
				currentDept = deptInfos.get(i);
				isExist = false;
				
				if(currentDept.getDepartmentId()==null)	//若此部门没有这个id，则不处理他
					continue;
				
				for (int j = 0; j < upDeptInfos.size(); j++) {
					upDept = upDeptInfos.get(j);
					
					if(currentDept.getDepartmentId().equals(upDept.getDepartmentId())){
						isExist = true;
						
						if (!currentDept.equals(upDept)) { // 对比部分数据是否一致
							sqlSb.append(" update TC_Department set ParentDepartmentID='"
									+ currentDept.getParentDepartmentId() + "',DepartmentStatus='1'," + " DepartmentName='"
									+ currentDept.getDepartmentName() + "',layer=" + currentDept.getLayer() + ","
									+ "layerorder='" + currentDept.getLayerorder() + "'" + " where DepartmentID='"
									+ currentDept.getDepartmentId() + "'");
						
						} else if (upDept.getDepartmentStatus().equals("0")) { // 若状态为0，则置为1
							sqlSb.append(" update TC_Department set DepartmentStatus='1'" 
									+ " where DepartmentID='" + currentDept.getDepartmentId() + "'");
				
						}		
						upDeptInfos.remove(j);
						break; // 跳出
					}
								
				}
							
				if (!isExist) {
					sqlSb.append(" insert into TC_Department(DepartmentID,ParentDepartmentID,DepartmentName,DepartmentStatus,layer,layerorder) "
							+ " values('" + currentDept.getDepartmentId() + "','" + currentDept.getParentDepartmentId()
							+ "'," + "'" + currentDept.getDepartmentName() + "',1," + currentDept.getLayer() + ",'"
							+ currentDept.getLayerorder() + "')");
				
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
			
		} catch (Exception e) {
			// 捕获了异常后，要手动进行回滚； 还需要进行验证测试是否完全正确。
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			row = -1;
		}

		return row;
		
	}

	
	
	/*临时弃用
	//获取当前的副Id
	private BaseOrg getCurrentFuId(String parentNode){
		BaseOrg result=new BaseOrg();
		
		//1.先查询此同级部门下是否存在部门
		String hql="from BaseOrg where parentNode='"+parentNode+"' and isDelete=0 order by EXT_FIELD04 desc";
		List<BaseOrg> baseOrgs=this.queryByHql(hql, 0, 1);
		
		//2.若不存在，则直接查询副部门，
		if(baseOrgs.size()==0){
			BaseOrg baseOrg=this.get(parentNode);	
			result.setExtField05(baseOrg.getExtField04());
			result.setExtField04(baseOrg.getExtField04()+"001");
		}else{
			result.setExtField05(baseOrgs.get(0).getExtField05());
			Long temp=Long.parseLong(baseOrgs.get(0).getExtField04())+1;
			result.setExtField04(temp.toString());
		}
		
		return result;
	}
	*/
	
	@Override
	public void doCreateFuId() {
		// TODO Auto-generated method stub
		//1.查询第一层的部门
		String hql="from BaseOrg where nodeLevel=1 and isDelete=0 order by orderIndex asc,nodeText asc";
		List<BaseOrg>  lists = this.queryByHql(hql);
		BaseOrg temp=null;
		long initValue=100;
		for(int i=0;i<lists.size();i++){
			temp=lists.get(i);
			temp.setExtField05("001");
			
			long fuId=initValue+i+1;
			temp.setExtField04(String.valueOf(fuId));
			this.merge(temp);
			
			//递归查询子部门
			this.createChildFuId(temp.getUuid(), fuId*1000, String.valueOf(fuId));
			
		}
		
	}
	
	private void createChildFuId(String parentNodeId,long initValue,String parentFuId){
		String hql="from BaseOrg where parentNode='"+parentNodeId+"' and isDelete=0 order by orderIndex asc,nodeText asc";
		List<BaseOrg>  lists = this.queryByHql(hql);
		BaseOrg temp=null;
		for(int i=0;i<lists.size();i++){
			temp=lists.get(i);
			temp.setExtField05(parentFuId);
			
			long fuId=initValue+i+1;
			temp.setExtField04(String.valueOf(fuId));
			this.merge(temp);
			
			//递归查询子部门
			this.createChildFuId(temp.getUuid(), fuId*1000, String.valueOf(fuId));		
		}
	}
	
	//只用于更新当前UP库中用户的部门ID
	@Override
	public void syncAllUserDeptInfoToUP(List<SysUserToUP> userInfos) {
		// TODO Auto-generated method stub
		this.getSession().doWork((x)->{
			SysUserToUP sut=null;
			String sqlUpdate = " update Tc_Employee set DepartmentID=? where UserId=?";
			PreparedStatement ps=x.prepareStatement(sqlUpdate);
			for(int i=0;i<userInfos.size();i++){
				sut=userInfos.get(i);
				ps.setString(1, sut.getEmployeeId());
				ps.setString(2, sut.getUserId());
				
				ps.addBatch();
				
				if((i+1)%30==0){
					ps.executeBatch();
				}
			}
			ps.executeBatch();
		});
	}
	@Override
	public List<BaseOrg> getUserRightDeptList(SysUser currentUser) {
		String userId = currentUser.getUuid();
		Integer rightType = currentUser.getRightType();
		String hql = "";
		List<BaseOrg> list = new ArrayList<>();
		if (rightType == 0) {
			// 有所有部门权限
			hql = " from BaseOrg WHERE isDelete=0 order by parentNode,orderIndex asc ";
			list = this.queryByHql(hql);

			return list;
		} else {
			// 指定部门、所在部门及主管的部门
			String sql = MessageFormat.format(
					"SELECT DEPT_ID ,CREATE_TIME ,CREATE_USER ,EXT_FIELD01 ,EXT_FIELD02 ,EXT_FIELD03 ,EXT_FIELD04 ,EXT_FIELD05 ,ISDELETE ,ORDER_INDEX ,UPDATE_TIME ,UPDATE_USER ,VERSION ,ISLEAF ,NODE_CODE ,NODE_LEVEL ,NODE_TEXT ,PARENT_NODE ,TREE_IDS ,DEPT_TYPE ,FAX ,IN_PHONE ,ISSYSTEM ,MAIN_LEADER ,OUT_PHONE ,REMARK ,VICE_LEADER ,SUPER_JOB ,SUPER_DEPT ,ALL_DEPTNAME ,SUPERDEPT_NAME ,SUPERJOB_NAME FROM dbo.SYS_V_USERRIGHTDEPT WHERE USER_ID=''{0}'' ORDER BY PARENT_NODE,ORDER_INDEX ASC",
					userId);
			List<?> alist = this.querySql(sql);
			BaseOrg dept = null;
			Integer length = alist.size();
			for (int i = 0; i < length; i++) {
				Object[] obj = (Object[]) alist.get(i);
				dept = new BaseOrg();
				dept.setUuid((String) obj[0]);
				dept.setIsDelete((Integer) obj[8]);
				dept.setOrderIndex((Integer) obj[9]);
				dept.setVersion((Integer) obj[12]);
				dept.setLeaf((Boolean) obj[13]);
				dept.setNodeLevel((Integer) obj[15]);
				dept.setNodeText((String) obj[16]);
				dept.setParentNode((String) obj[17]);
				dept.setTreeIds((String) obj[18]);
				dept.setDeptType((String) obj[19]);
				dept.setFax((String) obj[20]);
				dept.setInPhone((String) obj[21]);
				dept.setIssystem((Integer) obj[22]);
				dept.setMainLeaderName((String) obj[23]);
				dept.setOutPhone((String) obj[24]);
				dept.setRemark((String) obj[25]);
				dept.setViceLeader((String) obj[26]);
				dept.setSuperJob((String) obj[27]);
				dept.setSuperDept((String) obj[28]);
				dept.setAllDeptName((String) obj[29]);
				dept.setSuperdeptName((String) obj[30]);
				dept.setSuperjobName((String) obj[31]);

				list.add(dept);
			}
			return list;
		}
	}
	
	
	@Transactional(readOnly=true)
	@Override
	public BaseOrgChkTree getUserRightDeptTree(SysUser currentUser, String rootId) {
		//1.查询部门的数据，并封装到实体类中
		List<BaseOrgChkTree> list = getUserRightDeptTreeList(currentUser);
		
		//2.找到根节点
		BaseOrgChkTree root = new BaseOrgChkTree();
		for (BaseOrgChkTree node : list) {			
			//if (!(StringUtils.isNotEmpty(node.getParent()) && !node.getId().equals(rootId))) {
			if ( StringUtils.isEmpty(node.getParent()) || node.getId().equals(rootId)) {
				root = node;
				list.remove(node);
				break;
			}
		}
		
		//3.递归组装children
		createTreeChildren(list, root);
		return root;
	}
	
	@Transactional(readOnly=true)
	@Override
	public List<BaseOrgChkTree> getUserRightDeptTreeList(SysUser currentUser) {
		String userId = currentUser.getUuid();
		Integer rightType = currentUser.getRightType();
		
		
		//先从redis中取数据	
		Object userRightDeptTree = deptRedisService.getRightDeptTreeByUser(userId);
		if (userRightDeptTree != null) { // 若存在,则直接返回redis数据
			return (List<BaseOrgChkTree>)userRightDeptTree;	
		}
		
		//若当前用户是超级管理员或学校管理员，那就直接查询所有部门
		Integer isAdmin=(Integer)request.getSession().getAttribute(Constant.SESSION_SYS_ISADMIN);
		Integer isSchoolAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN);
		if(isAdmin==1||isSchoolAdmin==1)
			rightType=0;
		
		
		String sql = MessageFormat.format("EXECUTE SYS_P_GETUSERRIGHTDEPTTREE ''{0}'',{1}", userId, rightType);
		List<BaseOrgChkTree> chilrens = new ArrayList<BaseOrgChkTree>();
		List<?> alist = this.queryObjectBySql(sql);
		for (int i = 0; i < alist.size(); i++) {
			Object[] obj = (Object[]) alist.get(i);
			BaseOrgChkTree node = new BaseOrgChkTree();
			node.setId((String) obj[0]);
			node.setText((String) obj[1]);
			node.setIconCls((String) obj[2]);

			if ((Boolean) obj[3]) {
				node.setLeaf(true);
			} else {
				node.setLeaf(false);
			}
			node.setLevel((Integer) obj[4]);
			node.setTreeid((String) obj[5]);
			node.setParent((String) obj[6]);
			node.setOrderIndex((Integer) obj[7]);
			node.setDeptType((String) obj[8]);		
			node.setMainLeaderName((String) obj[9]);
			node.setOutPhone((String) obj[10]);
			node.setRemark((String) obj[11]);
			//node.setViceLeader((String) obj[12]);
			node.setSuperDept((String) obj[13]);
			node.setSuperJob((String) obj[14]);
			node.setAllDeptName((String) obj[15]);
			node.setSuperdeptName((String) obj[16]);
			node.setSuperjobName((String) obj[17]);
			node.setIsRight((String) obj[18]);
			node.setChecked(false);
			chilrens.add(node);
		}
		
		//若不存在，则存入到redis中
		deptRedisService.setRightDeptTreeByUser(userId, chilrens);
		
		return chilrens;
	}
	
	private void createTreeChildren(List<BaseOrgChkTree> childrens, BaseOrgChkTree root) {
		String parentId = root.getId();
		for (int i = 0; i < childrens.size(); i++) {
			BaseOrgChkTree node = childrens.get(i);
			if (StringUtils.isNotEmpty(node.getParent()) && node.getParent().equals(parentId)) {
				root.getChildren().add(node);
				createTreeChildren(childrens, node);
			}
			if (i == childrens.size() - 1) {
				if (root.getChildren().size() < 1) {
					root.setLeaf(true);
				}
				return;
			}
		}
	}
	
	
	/**
	 * 获取用户有权限的部门班级树
	 */
	@Transactional(readOnly=true)
	@Override
	public List<CommTreeChk> getUserRightDeptClassTreeList(SysUser currentUser) {
				
		String userId = currentUser.getUuid();
		Integer rightType = currentUser.getRightType();
		
		//先从redis中取数据
		Object userRightDeptClassTree = deptRedisService.getRightDeptClassTreeByUser(userId);
		if (userRightDeptClassTree != null) { // 若存在,则直接返回redis数据
			return (List<CommTreeChk>)userRightDeptClassTree;
		}
		
		//若当前用户是超级管理员或学校管理员，那就直接查询所有部门
		Integer isAdmin=(Integer)request.getSession().getAttribute(Constant.SESSION_SYS_ISADMIN);
		Integer isSchoolAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN);
		if(isAdmin==1||isSchoolAdmin==1)
			rightType=0;
		
		String sql = MessageFormat.format("EXECUTE SYS_P_GETUSERRIGHTGRADCLASSTREE ''{0}'',{1},''{2}''", userId,
				rightType, "05");
		
		
		List<CommTreeChk> chilrens = new ArrayList<CommTreeChk>();
		CommTreeChk node = null;
		List<Object[]> alist = this.queryObjectBySql(sql);

		for (int i = 0; i < alist.size(); i++) {
			Object[] obj = (Object[]) alist.get(i);
			node = new CommTreeChk();
			node.setId((String) obj[0]);
			node.setText((String) obj[1]);
			node.setIconCls((String) obj[2]);

			if ((Boolean) obj[3]) {
				node.setLeaf(true);
			} else {
				node.setLeaf(false);
			}
			node.setLevel((Integer) obj[4]);
			node.setTreeid((String) obj[5]);
			node.setParent((String) obj[6]);
			node.setOrderIndex((Integer) obj[7]);
			node.setNodeType((String) obj[8]);
			node.setChecked(false);
			chilrens.add(node);
		}
		
		//若不存在，则存入到redis中
		deptRedisService.setRightDeptClassTreeByUser(userId, chilrens);
		return chilrens;
	}
	
	/**
	 * 获取用户有权限的部门学科树
	 */
	@Transactional(readOnly=true)
	@Override
	public List<CommTreeChk> getUserRightDeptDisciplineTreeList(SysUser currentUser) {
		String userId = currentUser.getUuid();
		Integer rightType = currentUser.getRightType();
		
		//先从redis中取数据
		Object userRightDeptDisciplineTree = deptRedisService.getRightDeptDisciplineTreeByUser(userId); 	
		if (userRightDeptDisciplineTree != null) { // 若存在,则直接返回redis数据
			return (List<CommTreeChk>)userRightDeptDisciplineTree;
		}
		
		//若当前用户是超级管理员或学校管理员，那就直接查询所有部门
		Integer isAdmin=(Integer)request.getSession().getAttribute(Constant.SESSION_SYS_ISADMIN);
		Integer isSchoolAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN);
		if(isAdmin==1||isSchoolAdmin==1)
			rightType=0;
		
		String sql = MessageFormat.format("EXECUTE SYS_P_GETUSERRIGHTGRADCLASSTREE ''{0}'',{1},''{2}''", userId,
				rightType, "06");	//06是学科
		
		
		List<CommTreeChk> chilrens = new ArrayList<CommTreeChk>();
		CommTreeChk node = null;
		List<Object[]> alist = this.queryObjectBySql(sql);

		for (int i = 0; i < alist.size(); i++) {
			Object[] obj = (Object[]) alist.get(i);
			node = new CommTreeChk();
			node.setId((String) obj[0]);
			node.setText((String) obj[1]);
			node.setIconCls((String) obj[2]);

			if ((Boolean) obj[3]) {
				node.setLeaf(true);
			} else {
				node.setLeaf(false);
			}
			node.setLevel((Integer) obj[4]);
			node.setTreeid((String) obj[5]);
			node.setParent((String) obj[6]);
			node.setOrderIndex((Integer) obj[7]);
			node.setNodeType((String) obj[8]);
			node.setChecked(false);
			chilrens.add(node);
		}
		
		//若不存在，则存入到redis中
		deptRedisService.setRightDeptDisciplineTreeByUser(userId, chilrens);
		return chilrens;
	}
	

	
}
package com.zd.school.plartform.system.service.Impl;

import com.zd.core.constant.StatuVeriable;
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
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseOrgChkTree;
import com.zd.school.plartform.baseset.model.BaseOrgToUP;
import com.zd.school.plartform.baseset.model.BaseOrgTree;
import com.zd.school.plartform.system.dao.SysOrgDao;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysDatapermissionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

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

	@Resource
	private JwTGradeService gradeService; // 年级的service

	@Resource
	private JwTGradeclassService classService; // 班级的service

	@Resource
	private SysDatapermissionService dataPeimissService; // 数据权限service

	@Resource
	private JwTBasecourseService courseService; // 基础学科service

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
	public Boolean delOrg(String delIds, SysUser currentUser) {
		// 删除班级
		boolean flag = gradeService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
		// 删除年级
		flag = classService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
		// 删除部门
		flag = this.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());

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
				parentOrg.setUpdateUser(currentUser.getXm());
				parentOrg.setUpdateTime(new Date());
				this.merge(parentOrg);
			}
		}
		return flag;
	}

	/**
	 * 
	 * TODO 增加新部门,当增加的部门是年级或班级时，需要将数据同步至年级信息表和班级信息表.
	 * 
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
		String courseId = "";
		if (deptType.equals("06")) {
			JwTBasecourse course = courseService.getByProerties("courseName", nodeText);
			courseId = course.getUuid();
		}

		BaseOrg saveEntity = new BaseOrg();
		//List<String> excludedProp = new ArrayList<>();
		//excludedProp.add("uuid");
		BeanUtils.copyProperties(saveEntity, entity);	
		
		entity.setCreateUser(currentUser.getXm()); // 创建人
		entity.setLeaf(true);
		entity.setIssystem(1);
		entity.setExtField01(courseId); // 对于部门是学科时，绑定已有学科对应的ID
		this.persist(entity);		//先持久化，再修改下面的代码【由于修改了uuid的生成方式】
		
		if (!parentNode.equals(TreeVeriable.ROOT)) {
			BaseOrg parEntity = this.get(parentNode);
			parEntity.setLeaf(false);
			this.merge(parEntity);
			entity.BuildNode(parEntity);		
			entity.setAllDeptName(parEntity.getAllDeptName() + "/" + nodeText);			
		} else
			entity.BuildNode(null);

		// 持久化到数据库
		entity = this.merge(entity);
		entity.setParentName(parentName);
		entity.setParentNode(parentNode);
		entity.setParentType(parentType);

		// 插入年级数据或班级数据
		String orgId = entity.getUuid();
		switch (deptType) {
		case "04": // 年级
			JwTGrade grade = new JwTGrade(orgId);
			grade.setGradeName(entity.getNodeText());
			grade.setCreateUser(currentUser.getXm());
			grade.setOrderIndex(entity.getOrderIndex());
			grade.setIsDelete(0);
			grade.setSchoolId(currentUser.getSchoolId());

			gradeService.merge(grade);
			break;
		case "05": // 班级
			JwTGradeclass gradeclass = new JwTGradeclass(orgId);
			gradeclass.setClassName(entity.getNodeText());
			gradeclass.setOrderIndex(entity.getOrderIndex());
			gradeclass.setIsDelete(0);
			gradeclass.setGraiId(parentNode);
			gradeclass.setCreateUser(currentUser.getXm());

			classService.merge(gradeclass);
			break;
		default:
			break;
		}

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
	public List<BaseOrgChkTree> getOrgChkTreeList(String whereSql, String orderSql, SysUser currentUser) {

		// 先查询出当前用户有权限的部门数据
		List<BaseOrg> listOrg = this.getOrgList(whereSql, orderSql, currentUser);
		// 根据部门数据生成带checkbox的树

		List<BaseOrgChkTree> result = new ArrayList<BaseOrgChkTree>();
		createChildChkTree(new BaseOrgChkTree(TreeVeriable.ROOT, new ArrayList<BaseOrgChkTree>()), result, listOrg);
		// TODO Auto-generated method stub
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
					org.getParentType(), org.getMainLeaderName(), org.getSuperJob(),org.getSuperjobName(), "0");

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
	public BaseOrg doUpdate(BaseOrg entity, String xm) {
		String parentNode = entity.getParentNode();	
		String nodeText = entity.getNodeText();
		String uuid = entity.getUuid();
		
		// 先拿到已持久化的实体
		BaseOrg perEntity = this.get(uuid);
		Boolean isLeaf = perEntity.getLeaf();
		String oldDeptName = perEntity.getNodeText();
		
		// 将entity中不为空的字段动态加入到perEntity中去。
		try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(xm); // 设置修改人的中文名
		perEntity.setLeaf(isLeaf);


		// 更新父节点的是否叶节点的标记
		BaseOrg parentOrg = this.get(parentNode);
		if(parentOrg!=null){
			parentOrg.setUpdateTime(new Date()); // 设置修改时间
			parentOrg.setUpdateUser(xm); // 设置修改人的中文名
			parentOrg.setLeaf(false);
			this.merge(parentOrg);// 执行修改方法
			
			perEntity.BuildNode(parentOrg);
			perEntity.setAllDeptName(parentOrg.getAllDeptName()+"/"+nodeText);
		}
		
		entity = this.merge(perEntity);// 执行修改方法
		
		if(!oldDeptName.equals(nodeText)){
			//再更新其他地方的名称		
			this.setDeptName(nodeText,uuid);
			if(parentOrg!=null&&!parentNode.equals("ROOT"))
				this.setChildAllDeptName(entity,parentOrg.getAllDeptName());
			else
				this.setChildAllDeptName(entity,"ROOT");
		}
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
		String currentAllName=parentAllDeptName+"/"+dept.getNodeText();
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
		
}
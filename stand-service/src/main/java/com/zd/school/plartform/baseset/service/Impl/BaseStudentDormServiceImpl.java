package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.jw.push.model.PushInfo;
import com.zd.school.jw.push.service.PushInfoService;
import com.zd.school.plartform.baseset.dao.BaseStudentDormDao;
import com.zd.school.plartform.baseset.model.BaseOrgChkTree;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseRoomareaService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.student.studentclass.model.StandVClassStudent;
import com.zd.school.student.studentinfo.model.StuBaseinfo;
import com.zd.school.student.studentinfo.service.StuBaseinfoService;

/**
 * 
 * ClassName: DormStudentdormServiceImpl Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: (DORM_T_STUDENTDORM)实体Service接口实现类. date:
 * 2016-08-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseStudentDormServiceImpl extends BaseServiceImpl<DormStudentDorm> implements BaseStudentDormService {

	@Resource
	public void setDormStudentdormDao(BaseStudentDormDao dao) {
		this.dao = dao;
	}
	
	@Autowired
	private  HttpServletRequest request;
	
	@Resource
	private CommTreeService commTreeService;
	@Resource
	private JwTGradeclassService gradeClassService; // 班级
	@Resource
	private BaseDormDefineService dormDefineService;// 宿舍定义

	@Resource
	private BaseOfficeAllotService roomaAllotService;// 房间分配 办公室
	@Resource
	private BaseClassDormAllotService classDormService;
	// 班级宿舍
	/*
	 * @Resource private JwClassstudentService classStuService; // 学生分班
	 */
	@Resource
	private StuBaseinfoService stuBaseinfoService;// 学生
	@Resource
	private BaseRoomareaService roomAreaService;// 区域
	@Resource
	private PushInfoService pushService; // 推送
	@Resource
	private SysOrgService orgService; // 推送
	
	/**
	 * 获取用户有权限的部门班级树
	 */
	@Override
	public CommTreeChk getUserRightDeptClassTree(String rootId, SysUser currentUser) {
		//1.查询部门的数据，并封装到实体类中
		List<CommTreeChk> list = orgService.getUserRightDeptClassTreeList(currentUser);
		
		//2.找到根节点
		CommTreeChk root = new CommTreeChk();
		for (CommTreeChk node : list) {			
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
	private void createTreeChildren(List<CommTreeChk> childrens, CommTreeChk root) {
		String parentId = root.getId();
		for (int i = 0; i < childrens.size(); i++) {
			CommTreeChk node = childrens.get(i);
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

	
	@Override
	public List<DormStudentDorm> oneKeyList(DormStudentDorm entity, String whereSql) {
		/*
		 * 不知其意义 List<DormStudentDorm> newlists = null;// 执行查询方法
		 * List<StandVClassStudent> classStuList = null; // 某年级下全部学生
		 * List<JwTGradeclass> gradeClassList = null; // 某年级下的所有班级
		 * List<StandVClassStudent> boyList = new ArrayList<>(); // 某年级下的所有男生
		 * List<StandVClassStudent> girlList = new ArrayList<>(); // 某年级下的所有女生
		 */
		// 查询出该年级下所有的有效宿舍
		List<DormStudentDorm> lists = this.queryEntityBySql("EXEC JW_P_DORMCOUNT '" + whereSql + "'",
				DormStudentDorm.class);// 需要修改
		// 获取该年级下的所有班级没有分配宿舍的总人数
		/*
		 * String sql = "select a.* from STAND_V_CLASSSTUDENT a" +
		 * " left join DORM_T_STUDENTDORM b on (a.classId=b.CLAI_ID and a.userId!=b.STU_ID)"
		 * + " where a.gradeId = '" + whereSql + "'";
		 */
		/*
		 * String whereSql =
		 * " where claiId in(select uuid from JwTGradeclass  where graiId='" +
		 * entity.getWhereSql() +
		 * "') and isDelete=0 and studentId not in(select stuId from DormStudentDorm where isdelete=0) order by className,xbm"
		 * ; // 先获取到该年级下全部学生 List<JwClassstudent> list =
		 * classStuService.doQuery("from JwClassstudent " + whereSql);
		 */
		/*
		 * String sql =
		 * "select * from STAND_V_CLASSSTUDENT a where a.gradeId = '" + whereSql
		 * + "'" +
		 * " and a.userId not in (select STU_ID from DORM_T_STUDENTDORM  where CLAI_ID=a.classId) "
		 * ; classStuList = this.queryEntityBySql(sql,
		 * StandVClassStudent.class);// 先获取到该年级下全部学生 gradeClassList =
		 * gradeClassService .queryByHql("from JwTGradeclass where graiId='" +
		 * whereSql + "' and isDelete=0");// 某年级下的所有班级
		 * 
		 * // 将男生分出来 for (int i = 0; i < classStuList.size(); i++) { if
		 * (classStuList.get(i).getXbm().equals("1")) {
		 * boyList.add(classStuList.get(i)); } } // 将女生分出来 for (int i = 0; i <
		 * classStuList.size(); i++) { if
		 * (classStuList.get(i).getXbm().equals("2")) {
		 * girlList.add(classStuList.get(i)); } }
		 * 
		 * Integer nanDormCount = this.countDorm(gradeClassList, boyList);
		 * Integer nvDormCount = this.countDorm(gradeClassList, girlList);
		 * 
		 * Object objList = lists.get(0); List<String> strList = new
		 * ArrayList<>(); Object[] objArray = (Object[]) objList; if (objArray
		 * != null) { for (Object o : objArray) { if (o == null) { o = 0; }
		 * strList.add(o.toString()); } newlists = new ArrayList<>();
		 * DormStudentDorm dormStudentDorm = new DormStudentDorm();
		 * dormStudentDorm.setNanCount(Integer.valueOf(strList.get(0)));// 男生数量
		 * dormStudentDorm.setNvCount(Integer.valueOf(strList.get(1)));// 女生数量
		 * dormStudentDorm.setStuCount(Integer.valueOf(strList.get(2)));//
		 * 合计学生总数量 dormStudentDorm.setNanDormCount(nanDormCount);// 男生所需宿舍
		 * dormStudentDorm.setNvDormCount(nvDormCount);// 女生所需宿舍
		 * dormStudentDorm.setSxDorm(nanDormCount+nvDormCount);// 合计所需宿舍
		 * dormStudentDorm.setNanDorm(Integer.valueOf(strList.get(6)));// 男生有效宿舍
		 * dormStudentDorm.setNvDorm(Integer.valueOf(strList.get(7)));// 女生有效宿舍
		 * dormStudentDorm.setHunDorm( Integer.valueOf(strList.get(8)));//
		 * 混合有效宿舍 dormStudentDorm.setYxDorm(Integer.valueOf(strList.get(9)));//
		 * 合计有效宿舍 newlists.add(dormStudentDorm); }
		 */
		return lists;
	}

	/**
	 * 一键分配整个年级的班级宿舍
	 */
	@Override
	public Boolean doOneKeyAllotDorm(String gradId, String boyId, String girlId, SysUser currentUser) {
		Boolean flag = false;
		String boyDormId[] = null;
		String girDormId[] = null;
		List<StandVClassStudent> classStuList = null; // 某年级下全部学生
		List<JwTGradeclass> gradeClassList = null; // 某年级下的所有班级
		List<StandVClassStudent> boyList = new ArrayList<>(); // 某年级下的所有男生
		List<StandVClassStudent> girlList = new ArrayList<>(); // 某年级下的所有女生
		List<String> dormBoyList = new ArrayList<>(); // 某年级下的所有男宿舍集合
		List<String> dormGirlList = new ArrayList<>();// 某年级下的所有女宿舍集合

		// 排序方式：可能要使用班级编码来从低到高的排序（待定）
		String sql = "select * from STAND_V_CLASSSTUDENT a where a.gradeId = '" + gradId + "'"
				+ " and a.userId not in (select STU_ID from DORM_T_STUDENTDORM  where isDelete=0) "
				+ " order by className asc,userNumb asc,xm asc";
		classStuList = this.queryEntityBySql(sql, StandVClassStudent.class);// 先获取到该年级下全部学生
		gradeClassList = gradeClassService
				.queryByHql("from JwTGradeclass where graiId='" + gradId + "' and isDelete=0 order by className asc");// 获取到现有年级下的所有班级

		// 将某年级下的所有男生、女生分出来
		boyList = classStuList.stream().filter((e) -> e.getXbm().equals("1")).collect(Collectors.toList());
		girlList = classStuList.stream().filter((e) -> e.getXbm().equals("2")).collect(Collectors.toList());
	

		if (boyId != null) {
			boyDormId = boyId.split(","); // 选中的所有供男生分配的男宿舍的ID
			for (int i = 0; i < boyDormId.length; i++) {
				dormBoyList.add(boyDormId[i]);
			}
		}
		if (girlId != null) {
			girDormId = girlId.split(","); // 选中的所有供女生分配的女宿舍的ID
			for (int i = 0; i < girDormId.length; i++) {
				dormGirlList.add(girDormId[i]);
			}
		}
		
		//onKeyAllot：一键分配宿舍实现方法（优先分满班级的宿舍，剩余的再放入混合宿舍）
		//onKeyAllot2：一键分配宿舍实现方法（按宿舍的先后顺序进行直接分配）
		// 分配男
		this.onKeyAllot2(gradeClassList, boyList, dormBoyList, currentUser.getUuid());
		// 分配女
		this.onKeyAllot2(gradeClassList, girlList, dormGirlList, currentUser.getUuid());
		flag = true;
		return flag;
	}
	
	/**
	 * 手动分配宿舍
	 */
	@Override
	public Boolean doDormHandAllot(DormStudentDorm entity, Map hashMap, SysUser currentUser)
			throws IllegalAccessException, InvocationTargetException {
		Boolean flag = false;
		BuildDormDefine buildDormDefine = null;// 宿舍信息
		boolean isMixed=false;	//是否为混合宿舍
		String[] studentId = null;
		Integer inAllotCount = 0;// 该宿舍目前已经入住的人数
		Integer canInAllotCount = 0;// 该宿舍目前还可以入住的人数
		JwClassDormAllot jwClassDormAllot = null;// 班级宿舍
		//List<DormStudentDorm> liStudentdorms = null;
		
		// 获取该宿舍下入住的人数
		jwClassDormAllot = classDormService.get(entity.getCdormId());
		String hql="select count(*) from DormStudentDorm where isDelete=0 and cdormId='"+entity.getCdormId()+"'";
		inAllotCount=this.getQueryCountByHql(hql);
		
		buildDormDefine = dormDefineService.get(jwClassDormAllot.getDormId());
		if (inAllotCount >= Integer.valueOf(buildDormDefine.getDormBedCount())) {
			flag = false;
			hashMap.put("count", 1);
			hashMap.put("buildDormDefine", buildDormDefine);
			hashMap.put("inAllotCount", inAllotCount);
			return flag;
		}
		canInAllotCount = Integer.valueOf(buildDormDefine.getDormBedCount()) - inAllotCount;
		studentId = entity.getStuId().split(",");
		if (studentId.length > canInAllotCount) {
			flag = false;
			hashMap.put("count", 2);
			hashMap.put("buildDormDefine", buildDormDefine);
			hashMap.put("inAllotCount", inAllotCount);
			hashMap.put("canInAllotCount", canInAllotCount);
			return flag;
		}
		
		DormStudentDorm studentDorm=null;
		for (int i = 0; i < studentId.length; i++) {
			studentDorm=new DormStudentDorm();
			this.allotStudentDorm(studentDorm, jwClassDormAllot, studentId[i], inAllotCount++, currentUser.getUuid());
			
			roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);				
		}
		
		/*处理是否混合班级宿舍*/
		//查询这批新学生的班级
		String sql="SELECT distinct a.classId FROM STAND_V_CLASSSTUDENT a where a.userId in ('"+ entity.getStuId().replace(",","','")+"')";
		List<Object[]> classList=this.queryObjectBySql(sql);
		if(classList.size()>2){	//如果新学生的班级数目大于2，则肯定为混合
			isMixed=true;
		}else{
			if(!jwClassDormAllot.getClaiId().equals(classList.get(0))){	
				isMixed=true;
			}
		}
		//如果当前宿舍是正常宿舍，并且新学生是其他班级的，那就将宿舍更新为混合宿舍
		if("0".equals(jwClassDormAllot.getIsmixed())&&isMixed==true){
			jwClassDormAllot.setIsmixed("1");
			jwClassDormAllot.setUpdateTime(new Date());
			jwClassDormAllot.setUpdateUser(currentUser.getUuid());
			buildDormDefine.setIsMixed("1");
			buildDormDefine.setUpdateTime(new Date());
			buildDormDefine.setUpdateUser(currentUser.getUuid());
			classDormService.merge(jwClassDormAllot);
			dormDefineService.merge(buildDormDefine);
		}
		
		flag = true;
		return flag;
	}

	/**
	 * 获取未住满人的宿舍
	 */
	@Override
	public List<JwClassDormAllot> mixDormList(JwClassDormAllot entity) {
		List<JwClassDormAllot> dormAllotList = null;
		List list = this.querySql(
				"SELECT A.CDORM_ID,D.ROOM_NAME,F.CLASS_NAME,C.DORM_TYPE,C.DORM_BEDCOUNT,COUNT(*) counts,F.CLAI_ID,B.ISMIXED FROM DORM_T_STUDENTDORM A "
						+ "JOIN JW_T_CLASSDORMALLOT B ON A.CDORM_ID=B.CDORM_ID "
						+ "JOIN BUILD_T_DORMDEFINE C ON B.DORM_ID=C.DORM_ID "
						+ "JOIN BUILD_T_ROOMINFO D ON c.ROOM_ID=d.ROOM_ID "
						+ "JOIN dbo.JW_T_GRADECLASS F ON b.CLAI_ID=f.CLAI_ID WHERE A.ISDELETE=0 "
						+ "GROUP BY A.CDORM_ID,D.ROOM_NAME,F.CLASS_NAME,C.DORM_TYPE,C.DORM_BEDCOUNT,F.CLAI_ID,B.ISMIXED HAVING COUNT(*)<C.DORM_BEDCOUNT");
		dormAllotList = new ArrayList<>();
		for (int i = 0; i < list.size(); i++) {
			Object[] objArray = (Object[]) list.get(i);
			if (objArray != null) {
				entity = new JwClassDormAllot();
				entity.setUuid(objArray[0].toString());
				entity.setDormName(objArray[1].toString());
				entity.setClainame(objArray[2].toString());
				entity.setDormType(objArray[3].toString());
				entity.setDormBedCount(objArray[4].toString());
				entity.setStuCount(objArray[5].toString());
				entity.setClaiId(objArray[6].toString());
				entity.setIsmixed(objArray[7].toString());
				dormAllotList.add(entity);
			}
		}
		return dormAllotList;
	}

	@Override
	public List<JwClassDormAllot> emptyMixDormList(JwClassDormAllot entity) {
		List<JwClassDormAllot> dormAllotList = null;
		List list = this
				.querySql("SELECT A.CDORM_ID,D.ROOM_NAME,F.CLASS_NAME,C.DORM_TYPE,C.DORM_BEDCOUNT,F.CLAI_ID,B.ISMIXED FROM "
						+ " JW_T_CLASSDORMALLOT A JOIN dbo.JW_T_CLASSDORMALLOT B ON A.CDORM_ID=B.CDORM_ID "
						+ " JOIN dbo.BUILD_T_DORMDEFINE C ON B.DORM_ID=C.DORM_ID "
						+ " JOIN dbo.BUILD_T_ROOMINFO D ON c.ROOM_ID=d.ROOM_ID "
						+ " JOIN dbo.JW_T_GRADECLASS F ON b.CLAI_ID=f.CLAI_ID "
						+ " WHERE A.CDORM_ID NOT IN(SELECT CDORM_ID FROM DORM_T_STUDENTDORM  WHERE ISDELETE=0) AND A.ISDELETE=0");
		dormAllotList = new ArrayList<>();
		for (int i = 0; i < list.size(); i++) {
			Object[] objArray = (Object[]) list.get(i);
			if (objArray != null) {
				entity = new JwClassDormAllot();
				entity.setUuid(objArray[0].toString());
				entity.setDormName(objArray[1].toString());
				entity.setClainame(objArray[2].toString());
				entity.setDormType(objArray[3].toString());
				entity.setDormBedCount(objArray[4].toString());
				entity.setClaiId(objArray[5].toString());
				entity.setIsmixed(objArray[6].toString());
				dormAllotList.add(entity);
			}
		}
		return dormAllotList;
	}

	@Override
	public Boolean doPushMessage(String classId) {
		Boolean flag = false;
		List<DormStudentDorm> claStudentList = null;
		PushInfo pushInfo = null;
		StuBaseinfo stuBaseinfo = null;
		BuildDormDefine dormDefin = null;
		JwClassDormAllot jwClassDormAllot = null;
		String roomName = null;
		String areaName = null;// 楼栋名
		String areaLc = null;// 楼层

		String[] str = { "claiId", "isDelete" };
		Object[] str2 = { classId, 0 };
		claStudentList = this.queryByProerties(str, str2);// 班级下的已经入住宿舍的学生
		int i=0;
		for (DormStudentDorm pushMesStuDorm : claStudentList) {
			stuBaseinfo = stuBaseinfoService.get(pushMesStuDorm.getStuId()); // 学生信息
			roomName = pushMesStuDorm.getRoomName();// 房间名
			jwClassDormAllot = classDormService.getByProerties("uuid", pushMesStuDorm.getCdormId());
			dormDefin = dormDefineService.get(jwClassDormAllot.getDormId());
			areaLc = jwClassDormAllot.getAreaName();// 楼层名
			areaName = roomAreaService.getByProerties("uuid", dormDefin.getAreaId()).getParentName();
			pushInfo = new PushInfo();
			pushInfo.setEmplName(stuBaseinfo.getXm());// 姓名
			pushInfo.setEmplNo(stuBaseinfo.getUserNumb());// 学号
			pushInfo.setRegTime(new Date());
			pushInfo.setVersion(0);
			pushInfo.setEventType("宿舍信息");
			pushInfo.setPushStatus(0);
			pushInfo.setPushWay(1);
			pushInfo.setRegStatus("学生：" + pushInfo.getEmplName() + "，你的宿舍分配在" + areaName + "，" + areaLc + "，" + roomName
					+ "房间，床号为：" + pushMesStuDorm.getBedNum());
			pushService.merge(pushInfo);
			
			
			if((i+1)%30==0){
				this.getSession().flush();
				this.getSession().clear();
			}
			i++;
		}
		flag = true;
		return flag;

	}
	
	/**
	 * 自动分配宿舍
	 */
	@Override
	public Integer doDormAutoAllot(String classId, SysUser currentUser) {
		Integer resultCount=0;
		
		List<JwClassDormAllot> classDormList = null;// 获取该班级下所有有效宿舍
		List<JwClassDormAllot> boydormList = new ArrayList<>(); // 男宿舍
		List<JwClassDormAllot> girldormList = new ArrayList<>(); // 女宿舍
		List<JwClassDormAllot> boyMixdormList = new ArrayList<>(); // 男混班宿舍
		List<JwClassDormAllot> girlMixdormList = new ArrayList<>(); // 男混班宿舍
		List<StandVClassStudent> boyList = new ArrayList<>(); // 有效男学生
		List<StandVClassStudent> girlList = new ArrayList<>(); // 有效女学生
		List<StandVClassStudent> classStulist = null;// 获取该班级下所有有效学生且未分配宿舍的

		String[] propName = { "claiId", "isDelete" };
		Object[] propValue = { classId, 0 };
		classDormList = classDormService.queryByProerties(propName, propValue);
		// 将班级下所有宿舍分类
		for (JwClassDormAllot jwClassDormAllot : classDormList) {
			if (jwClassDormAllot.getDormType().equals("1")) { // 男
				if (jwClassDormAllot.getIsmixed().equals("1")) {
					boyMixdormList.add(jwClassDormAllot);// 混班
				} else {
					boydormList.add(jwClassDormAllot);
				}
			} else if (jwClassDormAllot.getDormType().equals("2")) {// 女
				if (jwClassDormAllot.getIsmixed().equals("1")) {
					girlMixdormList.add(jwClassDormAllot);// 混班
				} else {
					girldormList.add(jwClassDormAllot);
				}
			}
		}

		/*
		 * classStulist = classStuService.queryByHql(
		 * "from JwClassstudent WHERE ISDELETE=0" +
		 * " AND studentId NOT IN(SELECT stuId FROM DormStudentDorm " +
		 * "WHERE ISDELETE=0) AND claiId='" + classId + "'"); for
		 * (JwClassstudent jwClassstudent : classStulist) { if
		 * (jwClassstudent.getXbm() != null) if
		 * (jwClassstudent.getXbm().equals("1")) { boyList.add(jwClassstudent);
		 * } else if (jwClassstudent.getXbm().equals("2")) {
		 * girlList.add(jwClassstudent); } }
		 */

		String sql = " select * from STAND_V_CLASSSTUDENT a where a.classId='" + classId + "' and "
				+ " userId not in (select STU_ID from DORM_T_STUDENTDORM  where  isDelete=0)";
		classStulist = this.queryEntityBySql(sql, StandVClassStudent.class);
		for (StandVClassStudent classstudent : classStulist) {
			if (classstudent.getXbm() != null)
				if (classstudent.getXbm().equals("1")) {
					boyList.add(classstudent);
				} else if (classstudent.getXbm().equals("2")) {
					girlList.add(classstudent);
				}
		}
		resultCount+=this.handAllot(boydormList, boyMixdormList, boyList, classId); // 自动分配男
		resultCount+=this.handAllot(girldormList, girlMixdormList, girlList, classId); // 自动分配女
		
		return resultCount;
	}

	/**
	 * 一键分配宿舍实现方法（优先分满班级的宿舍，剩余的再放入混合宿舍）
	 * 
	 * @param gradeClassList
	 *            某年级下的所有班级
	 * @param studentList
	 *            //某年级下的所有男生（女生）（男list或者女list）
	 * @param allDormList
	 *            //某年级下的所有男（女）宿舍集合(男List或者女list)
	 * @param userCh
	 *            //创建人
	 */
	public void onKeyAllot(List<JwTGradeclass> gradeClassList, List<StandVClassStudent> studentList,
			List<String> allDormList, String userCh) {
		List<DormStudentDorm> mixDorm = new ArrayList<>();// 混合宿舍
		Map<String, Integer> mixDormBedCount = new HashMap<String, Integer>();// 混合宿舍床位数
		DormStudentDorm studentDorm = null; // 学生宿舍（均是该班级的学生）
		JwClassDormAllot classDormEntity = null; // 班级宿舍
		BuildDormDefine dormDefEntity = null; // 宿舍定义
		String dormId = "";// 宿舍id BuildDormDefine的uuid

		List<StandVClassStudent> tempList = null; // 用来存储临时数据,存放某个班级的所有男生或女生
		Integer classStuCount = 0;// 该班级所有的人数（男生或女生）
		Integer count = 0;// 用来计数该班级已经分配到宿舍的人数（男生或女生）
		Integer dormBedCount = 0;
		String stuId = "";// 学生id
		Integer overCount = 0; // 某个混合宿舍有剩余的床位数
		Integer mixInBedCount = 0;// 混合宿舍的还可以入住的床位数
		Integer notAllotBedCount = 0;// 某个班级还没有分配宿舍床位的人数
		Integer index = 0;
		Boolean flag = false;

		// 循环属于某年级下的所有班级
		int countNum = 0;
		for (int i = 0; i < gradeClassList.size(); i++) {
			String classId = gradeClassList.get(i).getUuid();// 一个班级
			tempList = studentList.stream().filter((e) -> e.getClassId().equals(classId)).collect(Collectors.toList());// 存放的是这个班级的所有男生或女生
			classStuCount = tempList.size();// 该班级所有的人数（男生或女生）
			countNum += classStuCount;
			count = 0;// 用来计数该班级已经分配到宿舍的人数（男生或女生）
			index = 0;
			flag = false;
			// 循环宿舍，进行分配
			for (int k = 0; k < allDormList.size(); k++) { // 某年级下的所有男（女）宿舍集合
				dormId = allDormList.get(k); // BuildDormDefine宿舍定义表的uuid
				dormDefEntity = dormDefineService.get(dormId); // 获取到宿舍
				dormBedCount = dormDefEntity.getDormBedCount(); // 获取床位数
				count += dormBedCount;
				if (count <= classStuCount) { // 1.此条件内，将住满各个宿舍；
					classDormEntity = new JwClassDormAllot();
					this.allotClassDorm(classDormEntity, dormId, classId, userCh, false);// 给该班级分配宿舍
					this.merDormDefEntity(dormDefEntity, userCh, false);// 将宿舍状态设置为已分配
					for (int m = 0; m < dormBedCount; m++) {
						studentDorm = new DormStudentDorm();// 存放的是宿舍和学生对应关系
						stuId = tempList.get(count - dormBedCount + m).getUserId();
						this.allotStudentDorm(studentDorm, classDormEntity, stuId, m, userCh);

						roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
					}
					notAllotBedCount = classStuCount - count;// 班级还没有分配床位的人数
																// count：已经入住的人数
					allDormList.remove(k); // 每次使用完一个宿舍就将其移除
					k--;
					if (count == classStuCount) {
						break;
					}

				} else { // 2.若分配时，宿舍没注满人，则执行下面的代码

					if (mixDorm.size() == 0) { // 3.若一开始没有混合宿舍，就执行。该班级的所有人数均已入住

						overCount = count - classStuCount;// 分配之后，该混合宿舍剩余床位
						notAllotBedCount = classStuCount - (count - dormBedCount);// 该班级还没有分配宿舍床位的人数
						classDormEntity = new JwClassDormAllot();
						this.allotClassDorm(classDormEntity, dormId, classId, userCh, true);// 给该班级分配宿舍（混合宿舍）
						this.merDormDefEntity(dormDefEntity, userCh, true);// 将宿舍状态设置为已分配
						for (int n = 0; n < notAllotBedCount; n++) {// 该班级的还未分配宿舍的人数循环
							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count - dormBedCount + n).getUserId();
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, n, userCh);

							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						notAllotBedCount = 0;
						// 此时宿舍肯定无法全部使用完那么将此宿舍加入到混合宿舍列表，并且将其最大床位数记录下来
						mixDorm.add(studentDorm);
						mixDormBedCount.put(studentDorm.getUuid(), overCount);
						allDormList.remove(k); // 每次使用完一个宿舍就将其移除
						k--;
						break;

					} else { // 4.否则，入住混合宿舍

						// 5.如果存取剩余的床位数刚好相等，那么将剩余的学生加入到该宿舍
						notAllotBedCount = classStuCount - (count - dormBedCount);// 该班级还没有分配宿舍床位的人数
						for (int mix = 0; mix < mixDorm.size(); mix++) {
							mixInBedCount = mixDormBedCount.get(mixDorm.get(mix).getUuid());// 这个混合宿舍还可以入住的人数
							if (mixInBedCount == notAllotBedCount) {
								index = 1;
								studentDorm = mixDorm.get(mix);// 获取到混合宿舍
								mixDorm.remove(mix);
								flag = true;
								break;
							}
							flag = false;
						}
						// 6.如果混合宿舍可以入住的人数大于该班级还未入住的人数，将该班级的人数分配到该混合宿舍
						if (!flag) {
							for (int mix = 0; mix < mixDorm.size(); mix++) {
								mixInBedCount = mixDormBedCount.get(mixDorm.get(mix).getUuid());// 这个混合宿舍还可以入住的人数
								if (mixInBedCount > notAllotBedCount) {
									index = 1;
									studentDorm = mixDorm.get(mix);// 获取到混合宿舍
									mixDorm.remove(mix);
									break;
								}
							}
						}

						/*
						 * 7.如果标识为0那么代表在混合宿舍中没找到符合当前剩余学生的宿舍
						 * 故重新分配一个新的宿舍给该班级的剩余人数，并且计算出分配完所剩余的床位 ，即该班级人数均匀入住
						 * 即依旧使用当前新的宿舍作为分配的宿舍
						 */
						if (index == 0 && allDormList.size() > 0 && notAllotBedCount > 0) {
							overCount = count - classStuCount;// 表示的这个宿舍还有几个床位剩余
							classDormEntity = new JwClassDormAllot();
							this.allotClassDorm(classDormEntity, dormId, classId, userCh, true);// 给该班级分配宿舍
							this.merDormDefEntity(dormDefEntity, userCh, true);// 将宿舍状态设置为已分配
							for (int n1 = 0; n1 < notAllotBedCount; n1++) {
								studentDorm = new DormStudentDorm();
								stuId = tempList.get(count - dormBedCount + n1).getUserId();
								this.allotStudentDorm(studentDorm, classDormEntity, stuId, n1, userCh);

								roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
							}
							notAllotBedCount = 0;
							// 此时宿舍肯定无法全部使用完那么将此宿舍加入到混合宿舍列表，并且将其最大床位数记录下来
							mixDorm.add(studentDorm);
							mixDormBedCount.put(studentDorm.getUuid(), overCount);
							allDormList.remove(k); // 每次使用完一个宿舍就将其移除
							k--;
							break;
						}

						/*
						 * 8.此处专门针对混合宿舍剩余床位数与班级未入住学生数相等或者大于关系时，
						 * 加入存在的混合宿舍里，则有该班级人数均已入住
						 */
						if (index == 1) {
							overCount = mixInBedCount - notAllotBedCount;// 该混合宿舍还可以在入住的人数
							classDormEntity = classDormService.get(studentDorm.getCdormId());
							classDormEntity.setClaiId(classId); // 指定正确的班级id
							int bedNum = studentDorm.getBedNum();
							for (int n2 = 0; n2 < notAllotBedCount; n2++) {

								studentDorm = new DormStudentDorm();
								stuId = tempList.get(count - dormBedCount + n2).getUserId();
								this.allotStudentDorm(studentDorm, classDormEntity, stuId, bedNum + n2, userCh);

								roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
							}
							if (overCount > 0) {// 表示混合宿舍可以入住的人数大于该班级还未入住的人数
								mixDorm.add(studentDorm);
								mixDormBedCount.put(studentDorm.getUuid(), overCount);
							}
							notAllotBedCount = 0;
							break;
						}
					}

				}
			}

			// 9.若没有可用的宿舍。则使用混合宿舍进行分配
			if (allDormList.size() <= 0 && notAllotBedCount > 0 && index == 0) {
				for (int mix1 = 0; mix1 < mixDorm.size(); mix1++) {
					studentDorm = mixDorm.get(mix1);
					mixInBedCount = mixDormBedCount.get(studentDorm.getUuid());// 这个混合宿舍还可以入住的人数
					classDormEntity = classDormService.get(studentDorm.getCdormId());
					classDormEntity.setClaiId(classId); // 指定正确的班级id

					if (mixInBedCount > notAllotBedCount) {// 10.混合宿舍可以入住的人数大于该班级还未入住的人数

						overCount = mixInBedCount - notAllotBedCount;
						int bedNum = studentDorm.getBedNum();
						for (int n3 = 0; n3 < notAllotBedCount; n3++) {

							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count + n3).getUserId();// 该班级已经入住的人数
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, bedNum + n3, userCh);

							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						mixDormBedCount.put(studentDorm.getUuid(), overCount);
						break;

					} else {// 11.该班级的未入住人数至少需要二个混合宿舍

						int bedNum = studentDorm.getBedNum();
						for (int n4 = 0; n4 < mixInBedCount; n4++) {

							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count + n4).getUserId();
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, bedNum + n4, userCh);

							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						notAllotBedCount -= mixInBedCount;
						count += mixInBedCount;// 已经入住的人数
						mixDorm.remove(mix1);
						mix1--;
					}
				}
			}

			if ((countNum + 1) % 50 == 0) {
				this.getSession().flush();
				this.getSession().clear();
			}
		}
	}

	/**
	 * 一键分配宿舍实现方法（按宿舍的先后顺序进行直接分配）
	 * 
	 * @param gradeClassList
	 *            某年级下的所有班级
	 * @param studentList
	 *            //某年级下的所有男生（女生）（男list或者女list）
	 * @param allDormList
	 *            //某年级下的所有男（女）宿舍集合(男List或者女list)
	 * @param userCh
	 *            //创建人
	 */
	public void onKeyAllot2(List<JwTGradeclass> gradeClassList, List<StandVClassStudent> studentList,
			List<String> allDormList, String userCh) {
		DormStudentDorm mixDorm = null;// 混合宿舍
		Integer mixDormBedCount = 0;// 混合宿舍床位数

		DormStudentDorm studentDorm = null; // 学生宿舍（均是该班级的学生）
		JwClassDormAllot classDormEntity = null; // 班级宿舍
		BuildDormDefine dormDefEntity = null; // 宿舍定义
		String dormId = "";// 宿舍id BuildDormDefine的uuid

		List<StandVClassStudent> tempList = null; // 用来存储临时数据,存放某个班级的所有男生或女生
		Integer classStuCount = 0;// 该班级所有的人数（男生或女生）
		Integer count = 0;// 用来计数该班级已经分配到宿舍的人数（男生或女生）
		Integer dormBedCount = 0;
		String stuId = "";// 学生id
		Integer overCount = 0; // 某个混合宿舍有剩余的床位数
		Integer notAllotBedCount = 0;// 某个班级还没有分配宿舍床位的人数

		// 循环属于某年级下的所有班级
		int countNum = 0;
		for (int i = 0; i < gradeClassList.size(); i++) {
			String classId = gradeClassList.get(i).getUuid();// 一个班级
			tempList = studentList.stream().filter((e) -> e.getClassId().equals(classId)).collect(Collectors.toList());// 存放的是这个班级的所有男生或女生
			classStuCount = tempList.size();// 该班级所有的人数（男生或女生）
			countNum += classStuCount;
			count = 0;// 用来计数该班级已经分配到宿舍的人数（男生或女生）

			notAllotBedCount = classStuCount;

			// 1:优先入住混合宿舍
			if (mixDorm != null) {
				classDormEntity = classDormService.get(mixDorm.getCdormId());
				classDormEntity.setClaiId(classId); // 指定正确的班级id

				if (classStuCount <= mixDormBedCount)
					count = classStuCount; // 计算目前直接入住的人数
				else
					count = mixDormBedCount; // 计算目前直接入住的人数

				overCount = mixDormBedCount - count;// 分配之后，该混合宿舍剩余床位

				int bedNum = mixDorm.getBedNum(); // 床位号
				for (int n1 = 0; n1 < count; n1++) {

					studentDorm = new DormStudentDorm();
					stuId = tempList.get(n1).getUserId();
					this.allotStudentDorm(studentDorm, classDormEntity, stuId, bedNum + n1, userCh);

					roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
				}

				if (overCount > 0) {// 表示混合宿舍可以入住的人数大于该班级还未入住的人数
					mixDorm = studentDorm;
					mixDormBedCount = overCount; // 更新剩余入住人数
				} else {// 移除这个混合宿舍
					mixDorm = null;
					mixDormBedCount = 0;
				}
				notAllotBedCount = classStuCount - count;// 班级还没有分配床位的人数
															// count：已经入住的人数
			}

			// 2.如果还存在未分配的学生，那就分配到新宿舍
			if (notAllotBedCount > 0) {
				// 循环宿舍，进行分配
				for (int k = 0; k < allDormList.size(); k++) { // 某年级下的所有男（女）宿舍集合
					dormId = allDormList.get(k); // BuildDormDefine宿舍定义表的uuid
					dormDefEntity = dormDefineService.get(dormId); // 获取到宿舍
					dormBedCount = dormDefEntity.getDormBedCount(); // 获取床位数
					count += dormBedCount;
					if (count <= classStuCount) { // 3.此条件内，将住满各个新宿舍；
						classDormEntity = new JwClassDormAllot();
						this.allotClassDorm(classDormEntity, dormId, classId, userCh, false);// 给该班级分配宿舍
						this.merDormDefEntity(dormDefEntity, userCh, false);// 将宿舍状态设置为已分配
						for (int m = 0; m < dormBedCount; m++) {
							studentDorm = new DormStudentDorm();// 存放的是宿舍和学生对应关系
							stuId = tempList.get(count - dormBedCount + m).getUserId();
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, m, userCh);

							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}

						notAllotBedCount = classStuCount - count;// 班级还没有分配床位的人数
																	// count：已经入住的人数

						allDormList.remove(k); // 每次使用完一个宿舍就将其移除
						k--;
						if (count == classStuCount) {
							break;
						}

					} else { // 4.将最后一个宿舍设定为混合宿舍，住不满

						overCount = count - classStuCount;// 分配之后，该混合宿舍剩余床位
						notAllotBedCount = classStuCount - (count - dormBedCount);// 该班级还没有分配宿舍床位的人数
						classDormEntity = new JwClassDormAllot();
						this.allotClassDorm(classDormEntity, dormId, classId, userCh, true);// 给该班级分配宿舍（混合宿舍）
						this.merDormDefEntity(dormDefEntity, userCh, true);// 将宿舍状态设置为已分配
						for (int n = 0; n < notAllotBedCount; n++) {// 该班级的还未分配宿舍的人数循环
							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count - dormBedCount + n).getUserId();
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, n, userCh);

							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						notAllotBedCount = 0;

						// 此时宿舍肯定无法全部使用完那么将此宿舍加入到混合宿舍列表，并且将其最大床位数记录下来
						mixDorm = studentDorm;
						mixDormBedCount = overCount;

						allDormList.remove(k); // 每次使用完一个宿舍就将其移除
						k--;
						break;

					}
				}
			}

			if ((countNum + 1) % 50 == 0) {
				this.getSession().flush();
				this.getSession().clear();
			}
		}
	}

	/**
	 * 自动分配该班级的学生到该班级的宿舍
	 * 
	 * @param dormList
	 *            该班级的班级宿舍（男或女宿舍）
	 * @param hunDormList
	 *            该班级的班级宿舍（男或女混合宿舍）
	 * @param stuList
	 *            该班级还未分配宿舍的所有男生或女生
	 * @param claiId
	 *            （班级id）
	 */

	private Integer handAllot(List<JwClassDormAllot> dormList, List<JwClassDormAllot> hunDormList,
			List<StandVClassStudent> stuList, String classId) {
		int resultCount=0;
		
		DormStudentDorm dormStudentDorm = null;
		DormStudentDorm dorm = null;
		int bs = 0; // 标识用了几个宿舍
		Integer bedCount = 0;
		String roomCount = "";
		Integer dormBedCount = 0;

		// 1：先入住正常宿舍
		for (int i = 0; i < dormList.size(); i++) {
			roomCount = "";
			bedCount = Integer.valueOf(dormList.get(i).getDormBedCount());
			for (int j = 1; j <= bedCount; j++) {
				roomCount += j + ",";
			}
			roomCount = roomCount.substring(0, roomCount.length() - 1);
			// 直接获取宿舍下面的可入住人数 查询该班级的学生宿舍中没有入住的床号
			List list = this.querySql("SELECT * FROM dbo.Split('" + roomCount + "',',')  A"
					+ "	WHERE A NOT IN(SELECT BED_NUM FROM dbo.DORM_T_STUDENTDORM" + " WHERE ISDELETE=0 and CDORM_ID "
					+ "IN(SELECT CDORM_ID FROM dbo.JW_T_CLASSDORMALLOT WHERE CDORM_ID='" + dormList.get(i).getUuid()
					+ "'))");

			for (int j = 0; j < list.size(); j++) {
				if (stuList.size() > 0) {
					dormStudentDorm = new DormStudentDorm();
					dormBedCount = Integer.valueOf(list.get(j).toString()); // 获取到床位
					dormStudentDorm.setBedNum(dormBedCount); // 设置床位
					dormStudentDorm.setArkNum(dormBedCount); // 设置柜号
					dormStudentDorm.setCdormId(dormList.get(i).getUuid());
					dormStudentDorm.setClaiId(classId);
					dormStudentDorm.setInTime(new Date());
					dormStudentDorm.setStuId(stuList.get(0).getUserId());
					stuList.remove(0);
					dorm = this.merge(dormStudentDorm);

					roomaAllotService.mjUserRight(dorm.getStuId(), null, null, dorm, null);
					resultCount++;
				} else {
					break;
				}
			}
			++bs;
		}

		// 再入住混合宿舍
		if (bs == dormList.size() && stuList.size() > 0) {
			for (int j = 0; j < hunDormList.size(); j++) {
				roomCount = "";
				bedCount = Integer.valueOf(hunDormList.get(j).getDormBedCount());
				for (int k = 1; k <= bedCount; k++) {
					roomCount += k + ",";
				}
				roomCount = roomCount.substring(0, roomCount.length() - 1);
				List hunList = this.querySql("SELECT * FROM dbo.Split('" + roomCount + "',',')  A"
						+ "	WHERE A NOT IN(SELECT BED_NUM FROM dbo.DORM_T_STUDENTDORM"
						+ " WHERE ISDELETE=0 and CDORM_ID "
						+ "IN(SELECT CDORM_ID FROM dbo.JW_T_CLASSDORMALLOT WHERE CDORM_ID='"
						+ hunDormList.get(j).getUuid() + "'))");
				for (int k = 0; k < hunList.size(); k++) {
					if (stuList.size() > 0) {
						dormStudentDorm = new DormStudentDorm();
						dormBedCount = Integer.valueOf(hunList.get(k).toString()); // 获取到床位
						dormStudentDorm.setBedNum(dormBedCount); // 设置床位
						dormStudentDorm.setArkNum(dormBedCount); // 设置柜号
						dormStudentDorm.setCdormId(hunDormList.get(j).getUuid());
						dormStudentDorm.setClaiId(classId);
						dormStudentDorm.setInTime(new Date());
						dormStudentDorm.setStuId(stuList.get(0).getUserId());
						stuList.remove(0);
						dorm = this.merge(dormStudentDorm);

						roomaAllotService.mjUserRight(dorm.getStuId(), null, null, dorm, null);
						resultCount++;
					} else {
						break;
					}
				}
			}
		}
		
		return resultCount;
	}

	private void allotClassDorm(JwClassDormAllot classDormEntity, String dormId, String classId, String userCh,
			Boolean flag) {
		Integer orderIndex = 0; // 排序号
		orderIndex = classDormService.getDefaultOrderIndex(classDormEntity);
		classDormEntity.setOrderIndex(orderIndex);
		classDormEntity.setDormId(dormId);// 设置宿舍id
		classDormEntity.setClaiId(classId); // 设置班级id
		classDormEntity.setCreateUser(userCh);
		classDormEntity.setCreateTime(new Date());
		if (flag) {
			classDormEntity.setIsmixed("1");// 混合宿舍
		}
		classDormEntity = classDormService.merge(classDormEntity);// 存放的是班级和宿舍对应关系

	}

	public void merDormDefEntity(BuildDormDefine dormDefEntity, String userCh, Boolean flag) {
		dormDefEntity.setRoomStatus("1");// 将宿舍状态设置为已分配
		dormDefEntity.setCreateTime(new Date());
		dormDefEntity.setCreateUser(userCh);
		if (flag) {
			dormDefEntity.setIsMixed("1");// 设置为混合宿舍
		}
		dormDefineService.merge(dormDefEntity);
	}

	public void allotStudentDorm(DormStudentDorm studentDorm, JwClassDormAllot classDormEntity, String stuId,
			int dormBedCount, String userCh) {
		Integer orderIndex = 0; // 排序号
		orderIndex = this.getDefaultOrderIndex(studentDorm);
		studentDorm.setOrderIndex(orderIndex);
		studentDorm.setStuId(stuId); // 设置学生id
		studentDorm.setCdormId(classDormEntity.getUuid());// 设置宿舍id
		studentDorm.setBedNum((dormBedCount + 1));// 床号
		studentDorm.setArkNum(studentDorm.getBedNum());// 柜号（默认跟床号对应）
		//studentDorm.setClaiId(classDormEntity.getClaiId());// 班级id
		studentDorm.setCreateUser(userCh);
		studentDorm.setInTime(new Date());// 设置入住时间

		studentDorm = this.merge(studentDorm);
	}

	/**
	 * 计算男女生宿舍数量
	 * 
	 * @param gradeClassList
	 *            某年级下的所有班级
	 * @param studentList
	 *            某年级下的所有所有男生 或女生
	 * @return
	 */
	// 需修改
	private int countDorm(List<JwTGradeclass> gradeClassList, List<StandVClassStudent> studentList) {
		String classId = "";
		int zc = 0;
		List<Integer> ys = new ArrayList<>();
		List<StandVClassStudent> tempList;// 班级的所有男生或女生
		for (int i = 0; i < gradeClassList.size(); i++) {
			tempList = new ArrayList<>();
			classId = gradeClassList.get(i).getUuid();// 一个班级
			for (int j = 0; j < studentList.size(); j++) {
				if (studentList.get(j).getClassId().equals(classId)) {
					tempList.add(studentList.get(j));// 存放的是这个班级的所有男生或女生
					studentList.remove(j);// 将该班级的学生从年级所有的学生中移除
					j--;
				}
			}
			if (tempList.size() % 6 == 0) {// 先按6来计算
				zc = tempList.size() / 6 + zc;
			} else {
				zc = tempList.size() / 6 + zc;
				ys.add(tempList.size() % 6);
			}

		}
		int ysj = 0;
		int ysi = 0;
		for (int i = 0; i < ys.size(); i++) {
			List<Integer> temp = ys;
			for (int j = 0; j < temp.size(); j++) {
				if (i == j) {
					continue;
				}
				if ((ys.get(i) + temp.get(j)) == 6) {
					zc = zc + 1;
					ys.remove(j);
					ys.remove(i);
					i = -1;
					break;
				}
				if ((ys.get(i) + temp.get(j)) < 6) {
					ysj = temp.get(j);
					ysi = ys.get(i);
					ys.remove(j);
					ys.remove(i);
					i = -1;
					ys.add(ysj + ysi);
					break;
				}
			}

		}
		return zc + ys.size();
	}

	/**
	 * 删除学生宿舍，并判断原有的宿舍，剩余的学生是否同一个班级，再将班级宿舍设置为非混合宿舍
	 */
	@Override
	public Boolean doDeleteDorm(String[] delIds, String userId) {
		// TODO Auto-generated method stub
		Set<String> classDormSet=new HashSet<>();
		DormStudentDorm dorm = null;
		for (int i = 0; i < delIds.length; i++) {
			dorm = this.get(delIds[i]);
			roomaAllotService.mjUserRight(null, null, dorm.getStuId(), dorm, null);
			this.doLogicDelOrRestore(delIds[i], StatuVeriable.ISDELETE,userId);
			
			classDormSet.add(dorm.getCdormId());
		}
		
		//将符合条件的班级宿舍设置为非混合宿舍
		Iterator<String> itera = classDormSet.iterator();
		while(itera.hasNext()){
			String cDormId=itera.next();
			
			JwClassDormAllot jwClassDormAllot = classDormService.get(cDormId);
			if("1".equals(jwClassDormAllot.getIsmixed())){
				
				String hql="select claiId from DormStudentDorm where isDelete=0 and cdormId='"+cDormId+"'";						
				//当此班级宿舍的学员都为同一个班级时，并且此班级和班级宿舍的班级一致时，则为非混合宿舍
				List<String> classIds= this.queryEntityByHql(hql);
				classIds = classIds.stream().distinct().collect(Collectors.toList());
				if(classIds.isEmpty()||(classIds.size()==1&&classIds.get(0).equals(jwClassDormAllot.getClaiId()))){

					BuildDormDefine buildDormDefine = dormDefineService.get(jwClassDormAllot.getDormId());
					
					buildDormDefine.setIsMixed("0");
					buildDormDefine.setUpdateTime(new Date());
					buildDormDefine.setUpdateUser(userId);
					
					jwClassDormAllot.setIsmixed("0");
					jwClassDormAllot.setUpdateTime(new Date());
					jwClassDormAllot.setUpdateUser(userId);				
									
				}
			}
			
		}			
		
		return true;
	}
	
	
	/**
	 * 系统不做床号、柜号的判断，因为实在不好判断。
	 */
	@Override
	public Integer doUpdateBedArkNum(String[] list, String userId) {
		int count=0;
		DormStudentDorm perEntity = null;
		for (int i = 0; i < list.length; i++) {
			String[] id = list[i].split(",");
			if (id != null && id.length > 0) {
				if (id.length == 4) {
					perEntity = this.get(id[1]);
					perEntity.setBedNum(Integer.valueOf(id[2]));
					perEntity.setArkNum(Integer.valueOf(id[3]));
				} else {
					perEntity = this.get(id[0]);
					perEntity.setBedNum(Integer.valueOf(id[1]));
					perEntity.setArkNum(Integer.valueOf(id[2]));
				}
				
				perEntity.setUpdateTime(new Date()); // 设置修改时间
				perEntity.setUpdateUser(userId); // 设置修改人的中文名
				this.merge(perEntity);// 执行修改方法
				
				if((i+1)%30==0){
					this.getSession().flush();
					this.getSession().clear();
				}
				
				++count;
			}
		}
		return count;
	}

	@Override
	public Boolean doAddClassDorm(String classId, String dormIds, SysUser currentUser) {
		// TODO Auto-generated method stub
		
		if(StringUtils.isEmpty(dormIds))
			return false;
		
		String[] dormIdArray = dormIds.split(",");
		
		JwClassDormAllot jwTClassdorm = null;
		for (int i = 0; i < dormIdArray.length; i++) {			
			jwTClassdorm = new JwClassDormAllot();
			jwTClassdorm.setClaiId(classId);
			jwTClassdorm.setDormId(dormIdArray[i]);
			jwTClassdorm.setIsmixed("0");	//非混合宿舍
			jwTClassdorm.setCreateUser(currentUser.getUuid());
			classDormService.merge(jwTClassdorm); //持久化		
		}
		
		//修改宿舍定义表（已分配、非混合）
		String hql="update BuildDormDefine set roomStatus='1',isMixed='0' where uuid in ('"+dormIds.replace(",", "','")+"')";
		dormDefineService.doExecuteCountByHql(hql);
		
		return true;
	}
}
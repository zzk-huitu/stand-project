package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.student.studentclass.model.JwClassstudent;
import com.zd.school.student.studentclass.service.JwClassstudentService;

/**
 * 学生宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseStudentDorm")
public class BaseStudentDormController extends FrameWorkController<DormStudentDorm> implements Constant {
	@Resource
	BaseStudentDormService thisService; // service层接口
	@Resource
	CommTreeService treeService;
	@Resource
	BaseClassDormAllotService classDormService;// 班级宿舍 
	@Resource
	JwClassstudentService classStuService; // 学生分班
   /**
		 * 已入住宿舍学生列表 @Title: list @Description: TODO @param @param entity
		 * 实体类 @param @param request @param @param response @param @throws
		 * IOException 设定参数 @return void 返回类型 @throws
		 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<DormStudentDorm> qr = thisService.queryPageResult(super.start(request), Integer.MAX_VALUE,
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 生成树
	 * 
	 */
	@RequestMapping("/classtreelist")
	public void classtreelist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String node = request.getParameter("node");
		String nodeId = request.getParameter("nodeId");
		String excludes = request.getParameter("excludes");
		if (!(StringUtils.isNotEmpty(node) && node.equalsIgnoreCase(TreeVeriable.ROOT))) {
			node = TreeVeriable.ROOT;
		}
		if (StringUtils.isNotEmpty(nodeId)) {
			node = nodeId;
		}
		SysUser currentUser = getCurrentSysUser();
		CommTree root = thisService.getCommTree(node, "05", currentUser);
		if (node.equalsIgnoreCase(TreeVeriable.ROOT)) {
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		} else {
			List<CommTree> alist = new ArrayList<CommTree>();
			alist.add(root);
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		}
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 查询出一键分配宿舍的信息
	 */
	@RequestMapping("/onKeyList")
	public void onKeyList(@ModelAttribute DormStudentDorm entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		List<DormStudentDorm> newlists = null;
		String whereSql = request.getParameter("whereSql");
		newlists = thisService.oneKeyList(entity, whereSql);
		String strData = jsonBuilder.buildObjListToJson(new Long(newlists.size()), newlists, false);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 一键分配宿舍调用方法
	 * 
	 * @param gradId
	 *            年级id
	 * @param boyId
	 *            男宿舍id
	 * @param girlId
	 *            女宿舍id
	*/
	@RequestMapping("/onKeyAllotDorm")
	public void onKeyAllotDorm(String gradId, String boyId, String girlId, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		Boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		flag = thisService.oneKeyAllotDorm(gradId, boyId, girlId, currentUser);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'一键分配分配成功。'"));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("'一键分配分配失败。'"));
		}

	}
	/**
	 * 班级下面宿舍列表 
	 * 
	 */
	@RequestMapping(value = { "/classDormlist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void classDormlist(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<JwClassDormAllot> qr = classDormService.queryPageResult(super.start(request), Integer.MAX_VALUE,
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 未分配宿舍学生列表 该班级没有分配宿舍的学生
	*/
	@RequestMapping(value = { "/classStuNotAllotlist" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void classStuNotAllotlist(@ModelAttribute JwClassstudent entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		/*select * from STAND_V_CLASSSTUDENT a where classId='' and 
				userId not in (select STU_ID from DORM_T_STUDENTDORM  where CLAI_ID=a.classId)
	    */
		StringBuffer hql = new StringBuffer("from " + entity.getClass().getSimpleName() + "");
	    StringBuffer countHql = new StringBuffer("select count(*) from " + entity.getClass().getSimpleName() + "");
		String whereSql = request.getParameter("whereSql");
	    hql.append(whereSql);
		countHql.append(whereSql);
		
		List<JwClassstudent> lists = classStuService.queryByHql(hql.toString(), 0, 0);// 执行查询方法
		Integer count = thisService.getQueryCountByHql(countHql.toString());// 查询总记录数
		strData = jsonBuilder.buildObjListToJson(new Long(count), lists, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	// 手动分配宿舍 （学生分配宿舍）
	@RequestMapping("/dormHandAllot")
	public void dormHandAllot(DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		Boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		Map<String, Object> hashMap = new HashMap<String, Object>();
		flag = thisService.dormHandAllot(entity, hashMap, currentUser);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'自动分配宿舍成功。'"));
		} else {
			Integer count = (Integer) hashMap.get("count");
			BuildDormDefine buildDormDefine = (BuildDormDefine) hashMap.get("buildDormDefine");
			Integer inAllotCount = (Integer) hashMap.get("inAllotCount");
			if (count == 1) {
				writeJSON(response, jsonBuilder.returnFailureJson(
						"'该宿舍最大人数为：" + buildDormDefine.getDormBedCount() + "人。现已入住：" + inAllotCount + "。'"));
				return;
			} else {
				Integer canInAllotCount = (Integer) hashMap.get("canInAllotCount");
				writeJSON(response, jsonBuilder.returnFailureJson("'该宿舍最大人数为：" + buildDormDefine.getDormBedCount()
						+ "人。现已入住：" + inAllotCount + "。可分配床位数为：" + canInAllotCount + "'"));
				return;
			}
		}
	}
	
	/**
	 * 自动分配宿舍
	 */
	@RequestMapping("/dormAutoAllot")
	public void dormAutoAllot(String claiId, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		Boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		flag = thisService.dormAutoAllot(claiId, currentUser);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'自动分配宿舍成功。'"));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("'自动分配宿舍失败。'"));
		}
	}
	/**
	 * 计算未分配完的混合宿舍
	 */
	@RequestMapping(value = { "/mixDormList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void mixDormList(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		List list = thisService.querySql(
				"SELECT A.CDORM_ID,D.ROOM_NAME,F.CLASS_NAME,C.DORM_TYPE,C.DORM_BEDCOUNT,COUNT(*) counts,F.CLAI_ID FROM DORM_T_STUDENTDORM A "
						+ "JOIN JW_T_CLASSDORMALLOT B ON A.CDORM_ID=B.CDORM_ID "
						+ "JOIN BUILD_T_DORMDEFINE C ON B.DORM_ID=C.DORM_ID "
						+ "JOIN BUILD_T_ROOMINFO D ON c.ROOM_ID=d.ROOM_ID "
						+ "JOIN dbo.JW_T_GRADECLASS F ON b.CLAI_ID=f.CLAI_ID WHERE A.ISDELETE=0 "
						+ "GROUP BY A.CDORM_ID,D.ROOM_NAME,F.CLASS_NAME,C.DORM_TYPE,C.DORM_BEDCOUNT,F.CLAI_ID HAVING COUNT(*)<6");
		List<JwClassDormAllot> dormAllotList = new ArrayList<>();
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
				dormAllotList.add(entity);
			}
		}
		String strData = jsonBuilder.buildObjListToJson(new Long(dormAllotList.size()), dormAllotList, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	/**
	 * 查询出已分配并且人数为0的混班宿舍
	 */
	@RequestMapping(value = { "/emptyMixDormList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void emptyMixDormList(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		List list = thisService
				.querySql("SELECT A.CDORM_ID,D.ROOM_NAME,F.CLASS_NAME,C.DORM_TYPE,C.DORM_BEDCOUNT,F.CLAI_ID FROM "
						+ " JW_T_CLASSDORMALLOT A JOIN dbo.JW_T_CLASSDORMALLOT B ON A.CDORM_ID=B.CDORM_ID "
						+ " JOIN dbo.BUILD_T_DORMDEFINE C ON B.DORM_ID=C.DORM_ID "
						+ " JOIN dbo.BUILD_T_ROOMINFO D ON c.ROOM_ID=d.ROOM_ID "
						+ " JOIN dbo.JW_T_GRADECLASS F ON b.CLAI_ID=f.CLAI_ID "
						+ " WHERE A.CDORM_ID NOT IN(SELECT CDORM_ID FROM DORM_T_STUDENTDORM  WHERE ISDELETE=0) AND A.ISDELETE=0");
		List<JwClassDormAllot> dormAllotList = new ArrayList<>();
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
				dormAllotList.add(entity);
			}
		}
		String strData = jsonBuilder.buildObjListToJson(new Long(dormAllotList.size()), dormAllotList, false);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
}

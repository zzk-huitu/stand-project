
package com.zd.school.plartform.coursemanage.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

/**
 * 教师任课信息
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/CourseTeacher")
public class CourseTeacherController extends FrameWorkController<JwCourseteacher> implements Constant {

	@Resource
	private JwCourseteacherService thisService; // service层接口
	@Resource
	private TeaTeacherbaseService teacherService;
	@Resource
	private SysOrgService sysOrgService;

	/**
	 * 任课信息列表(查询用户有权限的班级的数据）
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String deptId = request.getParameter("deptId");
		String deptType = request.getParameter("deptType");

		if (StringUtils.isEmpty(deptId)) {
			deptId = AdminType.ADMIN_ORG_ID;
		}

		Integer isAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISADMIN);
		Integer isSchoolAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN);

		// 若当前用户是超级管理员/学校管理员，并且为学校部门，则查询出所有的用户
		// if ((isAdmin == 1 || isSchoolAdmin==1) &&
		// deptId.equals(AdminType.ADMIN_ORG_ID)) {...}
		// 当部门不为根部门时 或者 不为管理员时，就要去查询内部的数据
		if (!deptId.equals(AdminType.ADMIN_ORG_ID) || !(isAdmin == 1 || isSchoolAdmin == 1)) {
			if ("05".equals(deptType)) { // 当选择的区域为班级时

				if (StringUtils.isNotEmpty(filter)) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + deptId
							+ "\",\"field\":\"claiId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + deptId
							+ "\",\"field\":\"claiId\"}]";
				}

			} else { // 当选择的区域不为班级时

				SysUser currentUser = getCurrentSysUser();
				String classIds = getClassIds(deptId, currentUser);

				if (StringUtils.isNotEmpty(classIds)) {

					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + classIds
								+ "\",\"field\":\"claiId\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + classIds
								+ "\",\"field\":\"claiId\"}]";
					}

				} else { // 若区域之下没有班级，则直接返回空数据

					strData = jsonBuilder.buildObjListToJson(0L, new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}
			}
		}

		QueryResult<JwCourseteacher> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据

	}

	/**
	 * 生成树 获取用户有权限的学科树 使用redis来存放，方便在list方法中也直接去获取这些权限部门数据
	 */
	@RequestMapping("/disciplineTreeList")
	public void classtreelist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String node = request.getParameter("node"); // 一般传 ROOT
		String nodeId = request.getParameter("nodeId");
		String excludes = request.getParameter("excludes"); // 在结果集中排除某个字段，比如checked复选框字段
		if (!(StringUtils.isNotEmpty(node) && node.equalsIgnoreCase(TreeVeriable.ROOT))) {
			node = TreeVeriable.ROOT;
		}
		if (StringUtils.isNotEmpty(nodeId)) {
			node = nodeId;
		}
		SysUser currentUser = getCurrentSysUser();
		CommTreeChk root = thisService.getUserRightDeptDisciplineTree(node, currentUser); // (04-年级，05-班级，06-学科)
		if (node.equalsIgnoreCase(TreeVeriable.ROOT)) {
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		} else {
			List<CommTreeChk> alist = new ArrayList<CommTreeChk>();
			alist.add(root);
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		}
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 删除
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 * @throws SecurityException
	 */
	@Auth("TEACHERCOURSE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doDelCourseTeacher(delIds, currentUser);
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		}
	}

	/**
	 * 
	 * getYearCourseTeacherList:指定学年、学期的所有班级的任课教师.
	 *
	 * @author luoyibo
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 *             void
	 * @throws @since
	 *             JDK 1.8
	 */
	@RequestMapping("/getYearCourseTeacherList")
	public void getYearCourseTeacherList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Integer studyYear = Integer.parseInt(request.getParameter("studyYear"));
		String semester = request.getParameter("semester");

		String hql = "select new JwCourseteacher(claiId,tteacId,courseId,studyYear,semester) from JwCourseteacher where studyYear="
				+ studyYear + " and semester='" + semester + "' and isDelete='0' ";
		List<JwCourseteacher> lists = thisService.queryByHql(hql);
		String strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 设置任课教师
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 * @throws SecurityException
	 * @throws NoSuchMethodException
	 */
	@Auth("TEACHERCOURSE_add")
	@RequestMapping("/doAddCourseTeacher")
	public void doAddCourseTeacher(HttpServletRequest request, HttpServletResponse response) throws IOException,
			IllegalAccessException, InvocationTargetException, NoSuchMethodException, SecurityException {

		String jsonData = request.getParameter("jsonData");

		SysUser sysuser = getCurrentSysUser();

		Boolean strData = thisService.doAddCourseTeacher(jsonData, sysuser);
		if (strData)
			writeJSON(response, jsonBuilder.returnSuccessJson("\"设置任课教师成功\""));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"设置任课教师失败\""));
	}
	
	@Auth("TEACHERCOURSE_replace")
	@RequestMapping("/doReplaceCourseTeacher")
	public void doReplaceTeacher(HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException, NoSuchMethodException, SecurityException, IllegalArgumentException {
		String uuid = request.getParameter("uuid");		//要修改的教师课程uuid
		String tteacId = request.getParameter("tteacId");	//修改后的教师uuid
		SysUser sysUser = getCurrentSysUser();
		if (StringUtils.isEmpty(tteacId)&&StringUtils.isEmpty(uuid) ) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"设置任课教师失败,参数错误！\""));
			return;
		} else {			
			Integer count = thisService.doReplaceCourseTeacher(uuid,tteacId,sysUser);
			if(count>0)
				writeJSON(response, jsonBuilder.returnSuccessJson("\"设置任课教师成功\""));
			else if(count==-1)
				writeJSON(response, jsonBuilder.returnFailureJson("\"设置任课教师失败，此课程教师已经在此班级授课\""));
			else{
				writeJSON(response, jsonBuilder.returnFailureJson("\"设置任课教师失败！\""));
			}
		}
	
	}

	/**
	 * 更新课程周节数
	 */
	/*
	 * @RequestMapping("/updateZjs") public void updateZjs( @RequestParam("zjs")
	 * int zjs,HttpServletRequest request, HttpServletResponse response) throws
	 * IOException, IllegalAccessException, InvocationTargetException { String
	 * claiId = request.getParameter("claiId"); String courseId =
	 * request.getParameter("courseId"); String batch =
	 * request.getParameter("batch"); if(batch!=null){
	 * thisService.updateZjsByClassId(claiId, courseId, zjs); }else{
	 * thisService.updateByProperties(new String[]{"claiId","courseId"}, new
	 * Object[]{claiId,courseId},new String[]{"acszjs"}, new Object[]{zjs}); }
	 * writeJSON(response, jsonBuilder.returnSuccessJson("'成功'")); }
	 */
	/**
	 * 更新公用实验室 ad9ee55c-6f05-4772-8ad7-ced280fedf0d
	 * fbc07f8e-1041-470d-809a-4706136474c6 f61dcf4c-c7bb-4d91-a65c-73d8f13fb14f
	 * 
	 * 
	 * http://localhost:8080/JwCourseteacher/updatePublicClass?claiId=ad9ee55c-
	 * 6f05-4772-8ad7-ced280fedf0d&courseId=fbc07f8e-1041-470d-809a-4706136474c6
	 * &batch=1&publicClassid=f61dcf4c-c7bb-4d91-a65c-73d8f13fb14f
	 */
	/*
	 * @RequestMapping("/updatePublicClass") public void
	 * updatePublicClass( @RequestParam("publicClassid") String
	 * publicClassid,HttpServletRequest request, HttpServletResponse response)
	 * throws IOException, IllegalAccessException, InvocationTargetException {
	 * String claiId = request.getParameter("claiId"); String courseId =
	 * request.getParameter("courseId"); String batch =
	 * request.getParameter("batch"); if(batch!=null){//比如更新初一年级所有班级
	 * thisService.updatePubliceClass(claiId, courseId, publicClassid); }else{
	 * thisService.updateByProperties(new String[]{"claiId","courseId"}, new
	 * Object[]{claiId,courseId},new String[]{"publicclassid"}, new
	 * Object[]{publicClassid}); } writeJSON(response,
	 * jsonBuilder.returnSuccessJson("'成功'")); }
	 * 
	 * @RequestMapping("/clearPublicClass") public void clearPublicClass(
	 * HttpServletRequest request, HttpServletResponse response) throws
	 * IOException, IllegalAccessException, InvocationTargetException { String
	 * claiId = request.getParameter("claiId"); String courseId =
	 * request.getParameter("courseId"); thisService.updateByProperties(new
	 * String[]{"claiId","courseId"}, new Object[]{claiId,courseId},new
	 * String[]{"publicclassid"}, new Object[]{null}); writeJSON(response,
	 * jsonBuilder.returnSuccessJson("'成功'")); }
	 */

	/**
	 * 获取某个区域下的所有班级id
	 * 
	 * @param roomId
	 * @param roomLeaf
	 * @return
	 */
	private String getClassIds(String deptId, SysUser currentUser) {

		List<CommTreeChk> baseOrgList = sysOrgService.getUserRightDeptClassTreeList(currentUser);
		String classIds = baseOrgList.stream().filter((x) -> {
			if (x.getNodeType().equals("05") && x.getTreeid().indexOf(deptId) != -1)
				return true;
			return false;
		}).map((x) -> x.getId()).collect(Collectors.joining(","));

		return classIds;
	}
}

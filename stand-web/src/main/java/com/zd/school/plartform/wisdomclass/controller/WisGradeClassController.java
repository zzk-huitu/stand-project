package com.zd.school.plartform.wisdomclass.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.model.JwGradeteacher;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.jw.eduresources.service.JwGradeteacherService;
import com.zd.school.jw.eduresources.service.JwTGradeService;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysUserService;

@Controller
@RequestMapping("/GradeClass")
public class WisGradeClassController extends FrameWorkController<JwTGradeclass> implements Constant {
	@Resource
	private JwTGradeclassService thisService;
	@Resource
	private SysOrgService orgService;
	@Resource
	private JwTGradeService gradeService;
	@Resource
	private SysUserService userService;
	@Resource
	private JwGradeteacherService gTeacherService;

	@Resource
	private JwClassteacherService cTeacherService;

	// 获取数据
	@RequestMapping(value = "/classmottolist", method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void classmottolist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String claiId = request.getParameter("claiId");
		String claiIdLeaf = request.getParameter("claiIdLeaf");
		
		if (StringUtils.isNotEmpty(claiId) && !AdminType.ADMIN_ORG_ID.equals(claiId)) {
			if ("1".equals(claiIdLeaf)) { // 当选择的区域为房间时
				if (StringUtils.isNotEmpty(filter)) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + claiId
							+ "\",\"field\":\"uuid\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + claiId
							+ "\",\"field\":\"uuid\"}]";
				}
			} else {					// 当选择的区域不为房间时
				// 当选择的区域不为房间时
				List<String> claiIdList = new ArrayList<>();
				String hql = "select a.uuid from BaseOrg a where a.isDelete=0  and a.deptType='05' and a.treeIds like '%"
						+ claiId + "%'";
		    	claiIdList = thisService.queryEntityByHql(hql);
			
				if(!claiIdList.isEmpty()){
					String roomIds=claiIdList.stream().collect(Collectors.joining(","));		
					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"uuid\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"uuid\"}]";
					}
					
				}else{	// 若区域之下没有房间，则直接返回空数据
					
					strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}				
			}
		}
		
		QueryResult<JwTGradeclass> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	@Auth("CLASSMOTTO_update")
	@RequestMapping("/doUpdate")
	public void doupdate(JwTGradeclass entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		SysUser currentUser = getCurrentSysUser();

		JwTGradeclass perEntity = thisService.get(entity.getUuid());
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);

		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(currentUser.getXm());

		entity = thisService.merge(perEntity);// 执行修改方法

		BaseOrg org = orgService.get(entity.getUuid());
		org.setNodeText(perEntity.getClassName());
		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));
	}

	@RequestMapping(value = "/listUser", method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void listUser(@ModelAttribute JwTGradeclass entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		SysUser currentUser = getCurrentSysUser();
		Integer start = super.start(request);
		Integer limit = super.limit(request);

		String hql = "from JwTGradeclass where isDelete=0";
		Boolean isSchoolAdminRole = false;
		List<SysUser> roleUsers = userService.getUserByRoleName("学校管理员");
		for (SysUser su : roleUsers) {
			if (su.getUuid().equals(currentUser.getUuid())) {
				isSchoolAdminRole = true;
				break;
			}
		}
		if (!isSchoolAdminRole) {
			// 不是学校管理员判断是否是年级组长
			String ghql = "from JwGradeteacher where isDelete=0 and tteacId='" + currentUser.getUuid() + "'";
			List<JwGradeteacher> gradeclassteachers = gTeacherService.queryByHql(ghql);
			if (gradeclassteachers != null && gradeclassteachers.size() > 0) {
				JwGradeteacher gTeacher = gradeclassteachers.get(0);
				hql += " and uuid in(";
				hql += " select uuid from JwTGradeclass where graiId='" + gTeacher.getGraiId() + "'";
				hql += ")";
			} else {
				// 判断是否是班主任
				ghql = "from JwClassteacher where isDelete=0 and tteacId='" + currentUser.getUuid() + "'";
				List<JwClassteacher> classteachers = cTeacherService.queryByHql(ghql);
				if (classteachers != null && classteachers.size() > 0) {
					JwClassteacher cTeacher = classteachers.get(0);
					hql += " and uuid='" + cTeacher.getClaiId() + "'";
				}
			}
		}

		QueryResult<JwTGradeclass> qr = thisService.queryResult(hql, start, limit);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	

	/*
	 * @RequestMapping("/doAdd") public void doadd(JwTGradeclass entity,
	 * HttpServletRequest request, HttpServletResponse response) throws
	 * IOException, IllegalAccessException, InvocationTargetException { //
	 * String courseName = entity.getCourseName(); // 获取当前操作用户 String userCh =
	 * "超级管理员"; SysUser currentUser = getCurrentSysUser(); if (currentUser !=
	 * null) userCh = currentUser.getXm(); Integer orderIndex =
	 * entity.getOrderIndex() + 1; String sName = ""; String gradeId =
	 * entity.getGraiId(); JwTGrade grade = gradeService.get(gradeId); switch
	 * (grade.getGradeCode()) { case "31": sName = "初一"; break; case "32": sName
	 * = "初二"; break; case "33": sName = "初三"; break; case "41": sName = "高一";
	 * break; case "42": sName = "高二"; break; case "43": sName = "高三"; break;
	 * default: break; } for (int i = 1; i < orderIndex; i++) { String className
	 * = sName + "（" + i + "）班"; String[] propName = new String[] { "className",
	 * "isDelete" }; Object[] propValue = new Object[] { "className", "0" };
	 * JwTGradeclass isClass = thisService.getByProerties("className",
	 * className); if (!ModelUtil.isNotNull(isClass)) { JwTGradeclass gradeclass
	 * = new JwTGradeclass(); BeanUtils.copyPropertiesExceptNull(entity,
	 * gradeclass); entity.setOrderIndex(i); entity.setClassName(sName + "（" + i
	 * + "）班"); entity.setCreateUser(userCh); thisService.merge(entity); } }
	 * 
	 * writeJSON(response, jsonBuilder.returnSuccessJson("'创建班级成功'")); }
	 */
}

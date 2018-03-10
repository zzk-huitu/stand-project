package com.zd.school.teacher.teacherinfo.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseOrgChkTree;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

@Controller
@RequestMapping("/TeacherBase")
public class TeaTeacherbaseController extends FrameWorkController<TeaTeacherbase> implements Constant {
	@Resource
	private TeaTeacherbaseService thisService; // service层接口
	@Resource
	private SysOrgService sysOrgService;
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute TeaTeacherbase entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String deptId = request.getParameter("deptId");
		String qureyFilter = request.getParameter("queryFilter");
		if (StringUtils.isEmpty(qureyFilter)) {
			qureyFilter = request.getParameter("filter");
		}
		SysUser currentUser = getCurrentSysUser();

		QueryResult<TeaTeacherbase> qr = thisService.getDeptTeacher(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), qureyFilter, true, deptId, currentUser);
		if (ModelUtil.isNotNull(qr))
			strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 直接查询某个学科下的教师
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/listCourseTeacher" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		String deptId = request.getParameter("deptId");
		String courseId = request.getParameter("courseId");
		
		//当传入的参数树courseId时。就去查询deptId
		if(StringUtils.isEmpty(deptId)&&StringUtils.isNotEmpty(courseId)){
			BaseOrg baseOrg = sysOrgService.getByProerties("extField01", courseId);
			deptId=baseOrg.getUuid();
		}
		
		if(StringUtils.isNotEmpty(deptId)){
			
			String hql="from TeaTeacherbase g where g.isDelete=0 and g.uuid in ("
					+ "	select distinct userId  from BaseUserdeptjob where isDelete=0 and deptId = '"+deptId+"'"
					+ ")";			
			QueryResult<TeaTeacherbase> qr=thisService.queryCountToHql(super.start(request), super.limit(request),
						super.sort(request), super.filter(request), hql,null,null);
			
			strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		
		}else{
			strData = jsonBuilder.buildObjListToJson((long) 0, new ArrayList<>(), true);// 处理数据
		}
		

		writeJSON(response, strData);// 返回数据
	}
}

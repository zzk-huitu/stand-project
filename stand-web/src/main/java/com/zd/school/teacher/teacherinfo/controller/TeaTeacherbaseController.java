package com.zd.school.teacher.teacherinfo.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

@Controller
@RequestMapping("/teacherBase")
public class TeaTeacherbaseController extends FrameWorkController<TeaTeacherbase> implements Constant {
	@Resource
	TeaTeacherbaseService thisService; // service层接口
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
}

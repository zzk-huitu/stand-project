package com.zd.school.plartform.coursemanage.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.oa.attendance.model.AttTitle;
import com.zd.school.oa.attendance.service.AttTermService;
import com.zd.school.oa.attendance.service.AttTimeService;
import com.zd.school.oa.attendance.service.AttTitleService;
import com.zd.school.oa.attendance.service.AttUserService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: AttTitleController Function: ADD FUNCTION. Reason: ADD REASON(可选).
 * Description: 考勤主题(ATT_T_TITLE)实体Controller. date: 2017-05-15
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/AttendTitle")
public class AttendTitleController extends FrameWorkController<AttTitle> implements Constant {

	@Resource
	AttTitleService thisService; // service层接口
	@Resource
	AttUserService attUserService;
	@Resource
	AttTermService attTermService;
	@Resource
	AttTimeService attTimeService;

	/**
	 * @Title: list
	 * @Description: 查询数据列表
	 * @param entity
	 *            实体类
	 * @param request
	 * @param response
	 * @throws IOException
	 *             设定参数
	 * @return void 返回类型
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute AttTitle entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);
		QueryResult<AttTitle> qResult = thisService.list(start, limit, sort, filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @Title: doadd
	 * @Description: 增加新实体信息至数据库
	 * @param AttTitle
	 *            实体类
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("SPECIAL_COURSEATTEND_add")
	@RequestMapping("/doAdd")
	public void doAdd(AttTitle entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等

		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doAddEntity(entity, currentUser);// 执行增加方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
		}
	}

	/**
	 * 
	 * @Title: doDelete
	 * @Description: 逻辑删除指定的数据
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("SPECIAL_COURSEATTEND_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDeleteByIds(delIds, currentUser);
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
			}
		}
	}

	/**
	 * @Title: doUpdate
	 * @Description: 编辑指定记录
	 * @param AttTitle
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("SPECIAL_COURSEATTEND_update")
	@RequestMapping("/doUpdate")
	public void doUpdates(AttTitle entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 入库前检查代码

		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		}
	}

	@RequestMapping("/doAddUsers")
	public void aoAddUsers(HttpServletRequest request, HttpServletResponse response) throws IOException {
		SysUser currentUser = getCurrentSysUser();
		String titleId = request.getParameter("titleId");
		String[] userIds = request.getParameter("userIds").split(",");
		String[] userNames = request.getParameter("userNames").split(",");
		String[] userNumbs = request.getParameter("userNumbs").split(",");
		
		Integer count=thisService.doAddUsers(titleId, userIds,userNames,userNumbs,currentUser.getXm());
		if(count>0)
			writeJSON(response, jsonBuilder.returnSuccessJson("'增加成功'"));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("'增加失败,详情见错误日志'"));		
		
	}
	
	@RequestMapping("/doAddTerms")
	public void doAddTerms(HttpServletRequest request, HttpServletResponse response) throws IOException {
		SysUser currentUser = getCurrentSysUser();
		String titleId = request.getParameter("titleId");
		String[] termCodes = request.getParameter("termCodes").split(",");
		String[] roomIds = request.getParameter("roomIds").split(",");
		String[] roomNames = request.getParameter("roomNames").split(",");
		
		Integer count=thisService.doAddTerms(titleId,termCodes, roomIds,roomNames,currentUser.getXm());
		if(count>0)
			writeJSON(response, jsonBuilder.returnSuccessJson("'增加成功'"));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("'增加失败,详情见错误日志'"));	
			
	}
}

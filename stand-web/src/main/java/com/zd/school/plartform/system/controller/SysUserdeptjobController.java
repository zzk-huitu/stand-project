
package com.zd.school.plartform.system.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseUserdeptjob;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserdeptjobService;

/**
 * 
 * ClassName: BaseUserdeptjobController Function: ADD FUNCTION. Reason: ADD
 * REASON(可选). Description: 用户部门岗位(BASE_T_USERDEPTJOB)实体Controller. date:
 * 2017-03-27
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/SysUserdeptjob")
public class SysUserdeptjobController extends FrameWorkController<BaseUserdeptjob> implements Constant {

	@Resource
	SysUserdeptjobService thisService; // service层接口

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
	/*
	 * @RequestMapping(value = { "/list" }, method = {
	 * org.springframework.web.bind.annotation.RequestMethod.GET,
	 * org.springframework.web.bind.annotation.RequestMethod.POST }) public void
	 * list(@ModelAttribute BaseUserdeptjob entity, HttpServletRequest request,
	 * HttpServletResponse response) throws IOException { String strData = "";
	 * // 返回给js的数据 Integer start = super.start(request); Integer limit =
	 * super.limit(request); String sort = super.sort(request); String filter =
	 * super.filter(request); QueryResult<BaseUserdeptjob> qResult =
	 * thisService.list(start, limit, sort, filter,true); strData =
	 * jsonBuilder.buildObjListToJson(qResult.getTotalCount(),
	 * qResult.getResultList(), true);// 处理数据 writeJSON(response, strData);//
	 * 返回数据 }
	 */

	/**
	 * 
	 * @Title: doadd
	 * @Description: 增加新实体信息至数据库
	 * @param BaseUserdeptjob
	 *            实体类
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	/*
	 * @RequestMapping("/doadd") public void doAdd(BaseUserdeptjob entity,
	 * HttpServletRequest request, HttpServletResponse response) throws
	 * IOException, IllegalAccessException, InvocationTargetException {
	 * 
	 * //此处为放在入库前的一些检查的代码，如唯一校验等
	 * 
	 * //获取当前操作用户 SysUser currentUser = getCurrentSysUser(); try { entity =
	 * thisService.doAddEntity(entity, currentUser);// 执行增加方法 if
	 * (ModelUtil.isNotNull(entity)) writeJSON(response,
	 * jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity))); else
	 * writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'")); }
	 * catch (Exception e) { writeJSON(response,
	 * jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'")); } }
	 */

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
	/*
	 * @RequestMapping("/dodelete") public void doDelete(HttpServletRequest
	 * request, HttpServletResponse response) throws IOException { String delIds
	 * = request.getParameter("ids"); if (StringUtils.isEmpty(delIds)) {
	 * writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'")); return;
	 * } else { SysUser currentUser = getCurrentSysUser(); try { boolean flag =
	 * thisService.doLogicDeleteByIds(delIds, currentUser); if (flag) {
	 * writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'")); } else {
	 * writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'")); } }
	 * catch (Exception e) { writeJSON(response,
	 * jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'")); } } }
	 */
	/**
	 * @Title: doUpdate
	 * @Description: 编辑指定记录
	 * @param BaseUserdeptjob
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	/*
	 * @RequestMapping("/doupdate") public void doUpdates(BaseUserdeptjob
	 * entity, HttpServletRequest request, HttpServletResponse response) throws
	 * IOException, IllegalAccessException, InvocationTargetException {
	 * 
	 * //入库前检查代码
	 * 
	 * //获取当前的操作用户 SysUser currentUser = getCurrentSysUser(); try { entity =
	 * thisService.doUpdateEntity(entity, currentUser);// 执行修改方法 if
	 * (ModelUtil.isNotNull(entity)) writeJSON(response,
	 * jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity))); else
	 * writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'")); }
	 * catch (Exception e) { writeJSON(response,
	 * jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'")); } }
	 */
	
	
	//获取此部门岗位的用户列表
    @RequestMapping(value = { "/getDeptJobUsers" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void getDeptJobUsers(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        String deptJobId = request.getParameter("deptJobId");
        Integer start = super.start(request);
        Integer limit = super.limit(request);
        String sort = StringUtils.convertSortToSql(super.sort(request));
        
        QueryResult<BaseUserdeptjob> qr = thisService.getUserByDeptJobId(deptJobId,start,limit,sort);
        
        if (ModelUtil.isNotNull(qr))
        	strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }
    
    /**
	 * 删除用户所在的部门岗位，只是逻辑删除
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/doRmoveDeptJobFromUser")
	public void doRmoveDeptJobFromUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("delIds");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入要解除绑定的部门岗位\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doRemoveUserFromDeptJob(delIds,currentUser);
			if (flag)
				writeJSON(response, jsonBuilder.returnSuccessJson("\"解除绑定成功\""));
			else
				writeJSON(response, jsonBuilder.returnSuccessJson("\"解除绑定失败\""));
		}
	}
	
	/**
	 * 调整指定用户的主部门岗位
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/doSetMasterDeptJob")
	public void doSetMasterDeptJob(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String deptJobId = request.getParameter("deptJobId");
		String userIds = request.getParameter("userIds");
		if (StringUtils.isEmpty(deptJobId) || StringUtils.isEmpty(userIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入要设置部门岗位\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doSetMasterDeptJobFromUser(userIds,deptJobId, currentUser);
			if (flag)
				writeJSON(response, jsonBuilder.returnSuccessJson("\"设置主部门成功\""));
			else
				writeJSON(response, jsonBuilder.returnSuccessJson("\"设置主部门失败\""));
		}
	}
	
	/**
	 * 将指定的用户绑定到指定的部门岗位上
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/doAddUserToDeptJob")
	public void addUserToDeptJob(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String deptJobId = request.getParameter("deptJobId");
		String userIds = request.getParameter("userIds");
		if (StringUtils.isEmpty(deptJobId) || StringUtils.isEmpty(userIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入设置的参数\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doAddUserToDeptJob(deptJobId, userIds, currentUser);
			if (flag)
				writeJSON(response, jsonBuilder.returnSuccessJson("\"设置成功\""));
			else
				writeJSON(response, jsonBuilder.returnSuccessJson("\"设置失败\""));
		}
	}
}

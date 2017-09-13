
package com.zd.school.plartform.system.controller;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.model.SysMenuPermission;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysMenuPermissionService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * 
 * ClassName: BaseTPerimissonController Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: 菜单的功能权限表实体Controller. date: 2016-07-17
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/SysMenuPermission")
public class SysMenuPermissionController extends FrameWorkController<SysMenuPermission> implements Constant {

	@Resource
	SysMenuPermissionService thisService; // service层接口

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<SysMenuPermission> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 获取角色菜单功能权限
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/getRoleMenuPerList" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void getRoleMenuPerlist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		String roleId = request.getParameter("roleId"); // 角色ID
		String perId = request.getParameter("perId"); // 角色菜单权限ID

		List<SysMenuPermission> lists = thisService.getRoleMenuPerlist(roleId, perId);

		strData = jsonBuilder.buildObjListToJson((long) lists.size(), lists, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param SysDatapermission
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doAdd")
	public void doAdd(SysMenuPermission entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		try {		
			
			String menuId = entity.getMenuId();

			String hql1 = " o.isDelete='0' and o.perName='" + entity.getPerName() + "'";
			if (thisService.IsFieldExist("menuId", menuId, "-1", hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"菜单功能权限名称不能重复！\""));
				return;
			}		
			hql1 = " o.isDelete='0' and o.perBtnName='" + entity.getPerBtnName() + "'";
			if (thisService.IsFieldExist("menuId", menuId, "-1", hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"菜单按钮别名不能重复！\""));
				return;
			}
			hql1 = " o.isDelete='0' and o.perBtnName='" + entity.getPerBtnName() + "'";
			if (thisService.IsFieldExist("menuId", menuId, "-1", hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"菜单按钮别名不能重复！\""));
				return;
			}
							
			entity = thisService.doAddEntity(entity, currentUser);// 执行增加方法
			if (entity!=null)
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("\"请求失败，请重试或联系管理员！\""));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"请求失败，请重试或联系管理员！\""));
		}
		
		

		
		
		
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
            SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		}
	}

	/**
	 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
	 * SysDatapermission @param @param request @param @param
	 * response @param @throws IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doUpdate")
	public void doUpdate(SysMenuPermission entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		// 获取当前操作用户
		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		try {
			if (currentUser != null)
				userCh = currentUser.getXm();
			
			String menuId = entity.getMenuId();

			String hql1 = " o.isDelete='0' and o.perName='" + entity.getPerName() + "'";
			if (thisService.IsFieldExist("menuId", menuId, entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"菜单功能权限名称不能重复！\""));
				return;
			}		
			hql1 = " o.isDelete='0' and o.perBtnName='" + entity.getPerBtnName() + "'";
			if (thisService.IsFieldExist("menuId", menuId, entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"菜单按钮别名不能重复！\""));
				return;
			}
			hql1 = " o.isDelete='0' and o.perBtnName='" + entity.getPerBtnName() + "'";
			if (thisService.IsFieldExist("menuId", menuId, entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"菜单按钮别名不能重复！\""));
				return;
			}
					
			entity = thisService.doUpdateEntity(entity, currentUser);// 执行增加方法
			if (entity!=null)
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("\"请求失败，请重试或联系管理员！\""));
			
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"请求失败，请重试或联系管理员！\""));
		}
		
	

		

	}

}

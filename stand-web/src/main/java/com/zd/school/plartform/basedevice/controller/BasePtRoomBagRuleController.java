package com.zd.school.plartform.basedevice.controller;

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
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtRoomBagRule;
import com.zd.school.plartform.basedevice.service.PtRoomBagRuleService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 房间钱包规则
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/BasePtRoomBagRule")
public class BasePtRoomBagRuleController extends FrameWorkController<PtRoomBagRule> implements Constant {
	@Resource
	PtRoomBagRuleService thisService; // service层接口

	/**
	 * 房间钱包规则列表
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtRoomBagRule entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtRoomBagRule> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 添加
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("ROOM_BAG_RULE_add")
	@RequestMapping("/doAdd")
	public void doAdd(PtRoomBagRule entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String hql1 = " o.isDelete='0' ";
		// 此处为放在入库前的一些检查的代码，如唯一校验等
		if (thisService.IsFieldExist("roomRuleName", entity.getRoomRuleName(), "-1", hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"钱包规则名称不能重复！\""));
			return;
		}
		
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		
		entity = thisService.doAddEntity(entity, currentUser.getXm());

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));

	}

	/**
	 * 删除规则
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@Auth("ROOM_BAG_RULE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			
			// 判断这些钱包规则是否正在被其他房间所绑定
			String hql = "select count(a.uuid) from PtRoomBagsRuleBind as a where a.roomRuleId in ('" + delIds.replace(",", "','")
					+ "') and a.isDelete=0";
			int count = thisService.getQueryCountByHql(hql);
			if (count > 0) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"这些房间钱包规则当前绑定了房间，请解除绑定后再删除！\""));
				return;
			}

						
			SysUser sysuser = getCurrentSysUser();

			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE, sysuser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}

	/**
	 * doRestore还原删除的记录 @Title: doRestore @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doRestore")
	public void doRestore(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入还原主键\""));
			return;
		} else {
			SysUser sysuser = getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE, sysuser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
			}
		}
	}

	/**
	 * 更新钱包房间规则
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("ROOM_BAG_RULE_update")
	@RequestMapping("/doUpdate")
	public void doUpdates(PtRoomBagRule entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		
		String hql1 = " o.isDelete='0' ";
		// 此处为放在入库前的一些检查的代码，如唯一校验等
		if (thisService.IsFieldExist("roomRuleName", entity.getRoomRuleName(), entity.getUuid(), hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"钱包规则名称不能重复！\""));
			return;
		}
		
		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doUpdateEntity(entity, currentUser.getXm(), null);

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));

	}

}

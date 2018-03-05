
package com.zd.school.plartform.basedevice.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.control.device.model.PtRoomBagRule;
import com.zd.school.control.device.model.PtRoomBagsRuleBind;
import com.zd.school.control.device.model.PtSkMeterbind;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.basedevice.service.PtRoomBagsRuleBindService;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 钱包规则绑定
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/BasePtRoomBagsRuleBind")
public class BasePtRoomBagsRuleBindController extends FrameWorkController<PtRoomBagsRuleBind> implements Constant {

	@Resource
	PtRoomBagsRuleBindService thisService; // service层接口

	@Resource
	BaseDormDefineService dormDefinService;// 宿舍定义

	@Resource
	BaseClassDormAllotService classDormService; // 班级宿舍

	@Resource
	BaseStudentDormService dormStuService; // 学生宿舍
	@Resource
	BaseRoominfoService roomInfoService; // 房间信息
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/assignUserList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void AssignUserList(@ModelAttribute PtRoomBagsRuleBind entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtRoomBagsRuleBind> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 查询出指定扣费下的人员
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtRoomBagsRuleBind entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtRoomBagsRuleBind> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	@Auth("ROOM_BAG_RULE_ruleRoom")
	@RequestMapping(value = { "/ruleRoomlist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void ruleRoomlist(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtRoomBagsRuleBind> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);
		if(qr.getTotalCount()==0){
			writeJSON(response, strData);// 返回数据	
			return;
		}
		
		StringBuffer roomId = new StringBuffer();
		for(PtRoomBagsRuleBind ptSkMeterbind:qr.getResultList()){
			roomId.append(ptSkMeterbind.getRoomId()+",");
		}
		String filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomId.substring(0, roomId.length() - 1)
			+ "\",\"field\":\"uuid\"}]";
		//String sor="[{\"property\":\"orderIndex\",\"direction\":\"DESC\"}]";
		QueryResult<BuildRoominfo> termQr = roomInfoService.queryPageResult(0,0,null, filter, true);
		
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), termQr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	/**
	 * 查询出房间下所有人员（目前只有学生）
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/userList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		BuildDormDefine dormDefine = null;
		List<JwClassDormAllot> classDorm = new ArrayList<JwClassDormAllot>();
		List<DormStudentDorm> list = null;
		List<DormStudentDorm> stuList = new ArrayList<>();
		
		String roomId=request.getParameter("roomId");
		
		if(StringUtils.isNotEmpty(roomId)){
			String[] name = { "roomId", "isDelete" };
			Object[] value = { roomId, 0 };
			dormDefine = dormDefinService.getByProerties(name, value);
			if (dormDefine != null) {
				String[] name2 = { "dormId", "isDelete" };
				Object[] value2 = { dormDefine.getUuid(), 0 };
				classDorm = classDormService.queryByProerties(name2, value2);
				if (classDorm != null) {
					for (int i = 0; i < classDorm.size(); i++) {
						String[] name3 = { "cdormId", "isDelete" };
						Object[] value3 = { classDorm.get(i).getUuid(), 0 };
						list = dormStuService.queryByProerties(name3, value3);
						if (list.size() > 0)
							stuList.addAll(list);
							/*
							for (int j = 0; j < list.size(); j++) {
								stuList.add(list.get(j));							
							}
							*/
						
					}
					strData = jsonBuilder.buildObjListToJson(new Long(stuList.size()), stuList, true);// 处理数据
					writeJSON(response, strData);// 返回数据
				}
			}
		}
	}

	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param ContPerimisson
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@Auth("ROOM_BAG_RULE_binding")
	@RequestMapping("/doAdd")
	public void doAdd(PtRoomBagsRuleBind entity, String meterId, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		String roomIds=request.getParameter("roomIds");	
		String roomRuleId=request.getParameter("roomRuleId");
		String deductionUserIds=request.getParameter("deductionUserIds");
		String deductionRoomIds=request.getParameter("deductionRoomIds");
		
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();

		thisService.doAddRuleBind(roomRuleId,roomIds,deductionUserIds,deductionRoomIds,currentUser.getXm());

		writeJSON(response, jsonBuilder.returnSuccessJson("\"设置成功！\""));	
		
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
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			SysUser sysuser=getCurrentSysUser();
			
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,sysuser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}
	@RequestMapping("/doRulrRoomDelete")
	public void doRulrRoomDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String roomIds = request.getParameter("roomIds");
		if (StringUtils.isEmpty(roomIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			String[] ids =roomIds.split(",");
			for(int i=0;i<ids.length;i++){
				 String hql = " from PtRoomBagsRuleBind where roomId = '"+ ids[i]+"'";
				 PtRoomBagsRuleBind entity = thisService.getEntityByHql(hql);
				 thisService.delete(entity);
			}
		}
		writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
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
			SysUser sysuser=getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE,sysuser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
			}
		}
	}

	/**
	 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
	 * ContPerimisson @param @param request @param @param
	 * response @param @throws IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doUpdate")
	public void doUpdates(PtRoomBagsRuleBind entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

	

		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doUpdateEntity(entity, currentUser.getXm(),null);

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		
	}
}

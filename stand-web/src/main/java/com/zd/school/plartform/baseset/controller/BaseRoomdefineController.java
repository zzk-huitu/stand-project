package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.service.BaseClassRoomDefineService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseFuncRoomDefineService;
import com.zd.school.plartform.baseset.service.BaseOfficeDefineService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;

@Controller
@RequestMapping("/BaseRoomdefine")
public class BaseRoomdefineController extends FrameWorkController<BuildRoominfo> implements Constant {

	@Resource
	private BaseRoominfoService thisService; // service层接口
	@Resource
	BaseClassRoomDefineService classRoomService;// 教室service层接口
	@Resource
	BaseDormDefineService dormRoomService; // 宿舍service层接口
	@Resource
	BaseOfficeDefineService offRoomService; // 办公室service层接口
	@Resource
	BaseFuncRoomDefineService funRoomService; // 功能室service层接口

	@RequestMapping("/doAdd")
	public void doAdd(BuildRoominfo entity, HttpServletRequest request, HttpServletResponse response)
			throws Exception, IllegalAccessException, InvocationTargetException {

		int fs = 0;
		int count = 0;
		String roomType = "";// 房间类型 1.宿舍，2.办公室，3.教室，5、功能室，0、未分配
		String id = ""; // BuildRoominfo的主键
		BuildDormDefine dormRoom = null;// 宿舍定义
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		String userCh = "超级管理员";// 中文名
		if (currentUser != null)
			userCh = currentUser.getXm();
		id = entity.getUuid();
		// 在add前判断房间名称是否唯一
		String roomName = entity.getRoomName();
		Integer conuts = thisService.getCount(roomName);
		if (conuts > 0) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"该房间名称已存在,不能重复。\""));
			return;
		}
		roomType = entity.getRoomType();
		if (id != null) {
			if (roomType.equals("1")) {// 宿舍
				boolean cz = dormRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (cz) {
					++count;
				}
				if (count == 0) {
					String dormType = request.getParameter("dormType");// 宿舍类型
					String dormBedCount = request.getParameter("dormBedCount");// 床位数
					String dormChestCount = request.getParameter("dormChestCount");// 柜子数
					String dormPhone = request.getParameter("dormPhone");// 电话
					String dormFax = request.getParameter("dormFax");// 传真

					dormRoom = new BuildDormDefine();
					dormRoom.setDormType(dormType);
					dormRoom.setDormBedCount(Integer.valueOf(dormBedCount));
					dormRoom.setDormChestCount(Integer.valueOf(dormChestCount));
					dormRoom.setDormPhone(dormPhone);
					dormRoom.setDormFax(dormFax);

					dormRoomService.addDormRoom(entity, dormRoom, id, userCh);
					++fs;
				}
				count = 0;

			} else if (roomType.equals("2")) {// 办公室
				boolean cz = offRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (cz) {
					++count;
				}
				if (count == 0) {
					offRoomService.addOffRoom(entity, id, userCh);
					++fs;
				}
				count = 0;
			} else if (roomType.equals("3")) {// 教室
				boolean cz = classRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (cz) {
					++count;
				}
				if (count == 0) {
					classRoomService.addClassRoom(entity, id, userCh);
					++fs;
				}
				count = 0;

			} else if (roomType.equals("5")) {// 功能室
				boolean cz = funRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (cz) {
					++count;
				}
				if (count == 0) {
					funRoomService.addFunRoom(entity, id, userCh);
					++fs;
				}
				count = 0;
			}
		}

		if (fs > 0) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"增加成功。\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"请勿重复添加。\""));
		}

	}

	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		int fs = 0;
		int count = 0;
		String roomType = "";// 房间类型 1.宿舍，2.办公室，3.教室，5、功能室，0、未分配
		BuildRoominfo roomInfo = null;
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		String xm = "超级管理员";// 中文名
		if (currentUser != null)
			xm = currentUser.getXm();
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		}
		String[] ids = delIds.split(",");
		for (int j = 0; j < ids.length; j++) {
			roomInfo = thisService.get(ids[j]); // 获取BuildRoominfo对象
			roomType = roomInfo.getRoomType();
			if (roomType.equals("1")) {
				dormRoomService.delDormRoom(roomInfo, ids[j], xm);
				++fs;

			} else if (roomType.equals("2")) {
				offRoomService.delOffRoom(roomInfo, ids[j], xm);
				++fs;

			} else if (roomType.equals("3")) {
				classRoomService.delClassRoom(roomInfo, ids[j], xm);
				++fs;

			} else if (roomType.equals("5")) {
				funRoomService.delFunRoom(roomInfo, ids[j], xm);
				++fs;
			}

		}
		if (fs > 0) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"房間都已分配了，不允许删除。\""));
		}

	}

	@RequestMapping("/doUpdate")
	public void doUpdate(BuildDormDefine entity, HttpServletRequest request, HttpServletResponse response)
			throws Exception, IOException, IllegalAccessException, InvocationTargetException {

		SysUser currentUser = getCurrentSysUser();
		entity = dormRoomService.doUpdateEntity(entity, currentUser);

		if (ModelUtil.isNotNull(entity))
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));

	}

	@RequestMapping("/doDormEntity")
	public void doDormEntity(String roomId, HttpServletRequest request, HttpServletResponse response)
			throws Exception, IOException, IllegalAccessException, InvocationTargetException {
		BuildDormDefine entity = null;
		if (!roomId.isEmpty()) {
			entity = dormRoomService.getByRoomId(roomId);
		}
		if (ModelUtil.isNotNull(entity))
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"获取宿舍对象失败,详情见错误日志\""));
	}
}

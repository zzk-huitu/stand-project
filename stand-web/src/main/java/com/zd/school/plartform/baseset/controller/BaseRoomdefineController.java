package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	
    @Auth("BASEROOMDEFINE_add")
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
		id = entity.getUuid();// BuildRoominfo的uuid
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
				boolean cz = dormRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");// 判断该房间是否存在
				if (cz) {
					++count;
				}
				if (count == 0) {
					String dormType = request.getParameter("dormType");// 宿舍类型
					String dormTypeLb = request.getParameter("dormTypeLb");// 宿舍类别

					String dormBedCount = request.getParameter("dormBedCount");// 床位数
					String dormChestCount = request.getParameter("dormChestCount");// 柜子数
					String dormPhone = request.getParameter("dormPhone");// 电话
					String dormFax = request.getParameter("dormFax");// 传真

					dormRoom = new BuildDormDefine();
					dormRoom.setDormType(dormType);
					dormRoom.setDormTypeLb(dormTypeLb);
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
    @Auth("BASEROOMDEFINE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		int count = 0;
		Boolean flag = false;
		Map<String, Object> hashMap = new HashMap<String, Object>();
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
				flag = dormRoomService.delDormRoom(roomInfo, ids[j], xm);
				if (flag) {

				} else {
					hashMap.put("flag", false);
					continue;
				}

			} else if (roomType.equals("2")) {
				flag = offRoomService.delOffRoom(roomInfo, ids[j], xm);
				if (flag) {

				} else {
					hashMap.put("flag", false);
					continue;
				}

			} else if (roomType.equals("3")) {
				flag = classRoomService.delClassRoom(roomInfo, ids[j], xm);
				if (flag) {

				} else {
					hashMap.put("flag", false);
					continue;
				}
			} else if (roomType.equals("5")) {
				flag = funRoomService.delFunRoom(roomInfo, ids[j], xm);
				if (flag) {

				} else {
					hashMap.put("flag", false);
					continue;
				}
			}

		}
		flag =(Boolean) hashMap.get("flag")==null?true:(Boolean) hashMap.get("flag");
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"该房間已分配，不允许删除。\""));

		}

	}
    @Auth("BASEROOMDEFINE_update")
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
	/**
	 * 用于一键分配宿舍时使用（获取男生、女生可用宿舍）/ 添加班级宿舍时
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/onKeylist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void onKeylist(@ModelAttribute BuildDormDefine entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String areaId = request.getParameter("areaId");
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ areaId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		String areaIds = "";
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}
		if(sb.length()>0){
			List<String> roomIdLists = new ArrayList<>();
			areaIds = sb.substring(0, sb.length() - 1);

			hql = "select a.uuid from BuildDormDefine a where a.isDelete=0 and a.dormTypeLb='1' and a.areaId in ('"
					+ areaIds.replace(",", "','") + "')";
			roomIdLists = dormRoomService.queryEntityByHql(hql);
			sb.setLength(0);
			for (int i = 0; i < roomIdLists.size(); i++) {
				sb.append(roomIdLists.get(i) + ",");
			}
			if (sb.length() > 0) {
				filter = filter.substring(0, filter.length()-1);
				filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"roomId\"}"+"]";
			} else {
				filter = filter.substring(0, filter.length()-1);
				filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ areaId+"\",\"field\":\"roomId\"}"+"]";
			}

		}else{
			   filter = filter.substring(0, filter.length()-1);
			   filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ areaId+"\",\"field\":\"roomId\"}"+"]";
			}
		QueryResult<BuildDormDefine> qr = dormRoomService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
}

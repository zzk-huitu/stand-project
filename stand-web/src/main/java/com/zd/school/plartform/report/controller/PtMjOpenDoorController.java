package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
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
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtMjOpenDoor;
import com.zd.school.plartform.basedevice.service.PtMjOpenDoorService;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 门禁开门记录
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtMjOpenDoor")
public class PtMjOpenDoorController extends FrameWorkController<PtMjOpenDoor> implements Constant {

	@Resource
	PtMjOpenDoorService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */

	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtMjOpenDoor entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String roomId = request.getParameter("roomId");
		String filter = request.getParameter("filter");
		if(roomId==null){
			roomId="";
		}
		String hql="select a.uuid from BuildRoomarea a where a.isDelete=0 and a.areaType='04' and a.treeIds like '%"+roomId+"%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		String areaIds = "";
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}
		if (sb.length() > 0) {
			areaIds = sb.substring(0, sb.length() - 1);

			hql = "select a.uuid from BuildRoominfo a where a.isDelete=0  and a.areaId in ('"
					+ areaIds.replace(",", "','") + "')";
			List<String> roomLists = thisService.queryEntityByHql(hql);
			sb.setLength(0);
			for (int i = 0; i < roomLists.size(); i++) {
				sb.append(roomLists.get(i) + ",");
			}
			// 房间id
			if (sb.length() > 0) {
				if (filter != null&&!filter.equals("")) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""
							+ sb.substring(0, sb.length() - 1) + "\",\"field\":\"roomId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""
							+ sb.substring(0, sb.length() - 1) + "\",\"field\":\"roomId\"}]";
				}
			} else {// 区域下没有房间
				if (filter != null&&!filter.equals("")) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}]";
				}
			}
		} else {// 传进来的是房间id 或者 roomId为空时，即直接点击快速搜索查询
			if (filter != null) {
				if (roomId != null&&!filter.equals("")) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}" + "]";
				}
			} else {
				filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
						+ "\",\"field\":\"roomId\"}]";
			}

		}
		QueryResult<PtMjOpenDoor> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/dodelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids = request.getParameter("ids");
		if (StringUtils.isEmpty(ids)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser=getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE,currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		}
	}

	/**
	 * 修改
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doupdate")
	public void doUpdates(PtMjOpenDoor entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		if (currentUser != null)
			userCh = currentUser.getXm();
		// 先拿到已持久化的实体
		// entity.getSchoolId()要自己修改成对应的获取主键的方法
		PtMjOpenDoor perEntity = thisService.get(entity.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		perEntity.setUpdateUser(userCh);

		entity = thisService.merge(perEntity);// 执行修改方法

		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));

	}
	@Auth("PtMjOpenDoor_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportPtMjOpenDoorIsEnd", "0");
		request.getSession().removeAttribute("exporPtMjOpenDoorIsState");
	    String roomId = request.getParameter("roomId");
	    String openDateStart = request.getParameter("openDateStart");
	    String openDateEnd = request.getParameter("openDateEnd");
	    
	    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	    
		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 15, 15, 20, 20,15,15,15 };
		List<PtMjOpenDoor> mjOpenDoorList = null;
		String hql = " from PtMjOpenDoor a where a.isDelete=0 ";
		if (StringUtils.isNotEmpty(roomId)) {
			String roomHql = " select b.uuid from BuildRoomarea a left join BuildRoominfo b on a.uuid = b.areaId "
					+ " where a.isDelete=0 and b.isDelete=0 and a.areaType='04' and a.treeIds like '%" + roomId + "%'";
			List<String> roomLists = thisService.queryEntityByHql(roomHql);
			if (roomLists.size() > 0) {
				StringBuffer sb = new StringBuffer();
				for (int i = 0; i < roomLists.size(); i++) {
					sb.append(roomLists.get(i) + ",");
				}
				hql += " and a.roomId in ('" + sb.substring(0, sb.length() - 1).replace(",", "','") + "') ";
			} else {
				hql += " and a.roomId ='" + roomId + "' ";
			}

		} else {
			hql = " select a from PtMjOpenDoor a right join BuildRoominfo b on a.roomId = b.uuid where a.isDelete=0 and b.isDelete=0 ";
		}
		if (StringUtils.isNotEmpty(openDateStart)) {
			hql+=" and a.openDate>='"+openDateStart+"'";
		}
		if (StringUtils.isNotEmpty(openDateEnd)) {
			hql+=" and a.openDate<='"+openDateEnd+"'";
		}
        mjOpenDoorList = thisService.queryByHql(hql);

		List<Map<String, String>> mjOpenDoorExpList = new ArrayList<>();
		
		Map<String, String> mjOpenDoorMap = null;
		int i = 1;
		for (PtMjOpenDoor mjOpenDoor : mjOpenDoorList) {
			mjOpenDoorMap = new LinkedHashMap<>();
		    mjOpenDoorMap.put("termName", mjOpenDoor.getTermName());
			mjOpenDoorMap.put("userName", mjOpenDoor.getUserName());
			mjOpenDoorMap.put("openDate",format.format(mjOpenDoor.getOpenDate()));
			mjOpenDoorMap.put("roomName", mjOpenDoor.getRoomName());
			mjOpenDoorMap.put("roomArea", mjOpenDoor.getRoomArea());
			mjOpenDoorMap.put("inoutType", mjOpenDoor.getInoutType());
			mjOpenDoorMap.put("openType", mjOpenDoor.getOpenType());
			mjOpenDoorExpList.add(mjOpenDoorMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", mjOpenDoorExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "设备名称", "开门人员姓名", "开门时间", "房间名称","房间所在区域","进出标识","开门类型"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "门禁开门记录", "门禁开门记录", allList);
		if (result == true) {
			request.getSession().setAttribute("exportPtMjOpenDoorIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportPtMjOpenDoorIsEnd", "0");
			request.getSession().setAttribute("exporPtMjOpenDoorIsState", "0");
		}

	}

	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportPtMjOpenDoorIsEnd");
		Object state = request.getSession().getAttribute("exporPtMjOpenDoorIsState");
		if (isEnd != null) {
			if ("1".equals(isEnd.toString())) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"文件导出完成！\""));
			} else if (state != null && state.equals("0")) {
				writeJSON(response, jsonBuilder.returnFailureJson("0"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"文件导出未完成！\""));
			}
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"文件导出未完成！\""));
		}
	}
}

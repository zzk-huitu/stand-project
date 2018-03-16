package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.plartform.basedevice.service.PtSkTermStatusService;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 水控使用状态表
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtSkTermStatus")
public class PtSkTermStatusController extends FrameWorkController<PtSkTermStatus> implements Constant {

	@Resource
	PtSkTermStatusService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树

	/**
	 * 水控使用状态列表
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String strData = ""; // 返回给js的数据
		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");
		String filter = request.getParameter("filter");

		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				if (StringUtils.isNotEmpty(filter)) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}]";
				}
			} else { // 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId, roomLeaf);

				if (!roomList.isEmpty()) {
					String roomIds = roomList.stream().collect(Collectors.joining(","));
					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"roomId\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"roomId\"}]";
					}

				} else { // 若区域之下没有房间，则直接返回空数据

					strData = jsonBuilder.buildObjListToJson(0L, new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}
			}
		}

		QueryResult<PtSkTermStatus> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, false);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据

	}

	/**
	 * 用水统计表
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/statistics" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void statistics(@ModelAttribute PtSkTermStatus entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String querySql = querySql(request);
		//String orderSql = orderSql(request);
		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");

		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				querySql += " and a.room_id = '" + roomId + "'";

			} else { // 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId, roomLeaf);

				if (!roomList.isEmpty()) {
					String roomIds = roomList.stream().collect(Collectors.joining("','","'","'"));
					
					querySql += " and a.room_id in (" + roomIds + ")";

				} else { // 若区域之下没有房间，则直接返回空数据

					strData = jsonBuilder.buildObjListToJson(0L, new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}
			}
		}

		String select = " select SUM(a.USELITER) as useliter,MIN(a.TOTALUSEDLITER) as TOTALUSEDLITERmin,MAX(a.TOTALUSEDLITER) as TOTALUSEDLITERmax,"
				+ " c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT,	e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID	";
		String sqlsub = " from dbo.PT_SK_TERMSTATUS a" + " JOIN dbo.PT_TERM C ON c.TERMSN=a.TERMSN	"
				+ " JOIN dbo.BUILD_T_ROOMINFO D ON a.ROOM_ID=D.ROOM_ID	"
				+ " LEFT JOIN dbo.BUILD_T_ROOMAREA F ON d.AREA_ID=f.AREA_ID	"
				+ " LEFT JOIN dbo.PT_GATEWAY E ON c.GATEWAY_ID=e.GATEWAY_ID  " + "where 1=1 and D.ROOM_TYPE!='0' ";
	
		String groupBySql = " GROUP BY 	c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT, e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID ";
		String orderBySql = " ORDER BY c.TERMNO ASC";
		
		String sqlCount="select count(*) "+sqlsub+querySql+groupBySql;
		
		QueryResult<Object> qResult = thisService.queryPageResultBySql(select + sqlsub + querySql +groupBySql+orderBySql, start,
				limit, null,sqlCount);
		
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据

	}

	
	@Auth("PtSkTermStatus_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportSkTermStatusIsEnd", "0");
		request.getSession().removeAttribute("exportSkTermStatusIsState");
		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");
		String statusDateStart = request.getParameter("statusDateStart");
		String statusDateEnd = request.getParameter("statusDateEnd");

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 15, 15, 20, 20, 15, 15, 15, 15, 15, 20, 20, 15, 15, 15, 15 };
		List<PtSkTermStatus> skTermStatusList = null;
		String hql = " from PtSkTermStatus a where a.isDelete=0 ";
		
		//组装房间id参数
		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				hql += " and a.roomId='"+roomId+"'";
				
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId, roomLeaf);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining("','","'","'"));				
					hql += " and a.roomId in (" + roomIds + ") ";
				} else {
					hql += " and 1=2 ";						//区域之下没有房间，则显示空数据
				}					
			}
		}
		
		if (StringUtils.isNotEmpty(statusDateStart)) {
			hql += " and a.statusDate>='" + statusDateStart + "'";
		}
		if (StringUtils.isNotEmpty(statusDateEnd)) {
			hql += " and a.statusDate<='" + statusDateEnd + "'";
		}
		skTermStatusList = thisService.queryByHql(hql);

		List<Map<String, String>> skTermStatusExpList = new ArrayList<>();

		Map<String, String> skTermStatusMap = null;
		int i = 1;
		for (PtSkTermStatus skTermStatus : skTermStatusList) {
			skTermStatusMap = new LinkedHashMap<>();
			skTermStatusMap.put("xh", i + "");
			skTermStatusMap.put("roomName", skTermStatus.getRoomName());
			skTermStatusMap.put("termName", skTermStatus.getTermName());
			skTermStatusMap.put("statusDate", format.format(skTermStatus.getStatusDate()));
			skTermStatusMap.put("measure", skTermStatus.getMeasure().toString());
			skTermStatusMap.put("price", skTermStatus.getPrice().toString());
			skTermStatusMap.put("useliter", String.valueOf(skTermStatus.getUseliter()));
			skTermStatusMap.put("totalusedliter", String.valueOf(skTermStatus.getTotalusedliter()));
			skTermStatusMap.put("usepulse", String.valueOf(skTermStatus.getUsepulse()));
			skTermStatusMap.put("totalusedpulse", String.valueOf(skTermStatus.getTotalusedpulse()));
			skTermStatusMap.put("usemoney", skTermStatus.getUsemoney().toString());
			skTermStatusMap.put("totalusedmoney", skTermStatus.getTotalusedmoney().toString());
			skTermStatusMap.put("totalrecord", String.valueOf(skTermStatus.getTotalrecord()));
			skTermStatusMap.put("uploadrecord", String.valueOf(skTermStatus.getUploadrecord()));
			i++;
			skTermStatusExpList.add(skTermStatusMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", skTermStatusExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "序号", "房间名称", "设备名称", "状态的日期", "测量单位（脉冲/升）", "费率（元/升）", "冷水当前小时使用水量（升）",
				"冷水已使用总水量（升）", "冷水当前小时使用脉冲数", "冷水总使用脉冲数", "热水交易金额", "热水已交易总额", "热水已交易流水", "热水已上传流水" }); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "水控使用状态", "水控使用状态", allList);
		if (result == true) {
			request.getSession().setAttribute("exportSkTermStatusIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportSkTermStatusIsEnd", "0");
			request.getSession().setAttribute("exportSkTermStatusIsState", "0");
		}
	}
	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportSkTermStatusIsEnd");
		Object state = request.getSession().getAttribute("exportSkTermStatusIsState");
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
	

	@Auth("WATER_COUNT_export")
	@RequestMapping("/doExpWaterCountExcel")
	public void doExpWaterCountExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportSkTermCountIsEnd", "0");
		request.getSession().removeAttribute("exportSkTermCountIsState");
		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");
		String statusDateStart = request.getParameter("statusDateStart");
		String statusDateEnd = request.getParameter("statusDateEnd");

		String sql = " select SUM(a.USELITER) as useliter,MIN(a.TOTALUSEDLITER) as TOTALUSEDLITERmin,MAX(a.TOTALUSEDLITER) as TOTALUSEDLITERmax,"
				+ " c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT,	e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID	"
				+ " from dbo.PT_SK_TERMSTATUS a" + " JOIN dbo.PT_TERM C ON c.TERMSN=a.TERMSN	"
				+ " JOIN dbo.BUILD_T_ROOMINFO D ON a.ROOM_ID=D.ROOM_ID	"
				+ " LEFT JOIN dbo.BUILD_T_ROOMAREA F ON d.AREA_ID=f.AREA_ID	"
				+ " LEFT JOIN dbo.PT_GATEWAY E ON c.GATEWAY_ID=e.GATEWAY_ID  " + "where 1=1 and D.ROOM_TYPE!='0' ";
		
		String groupSql = " GROUP BY 	c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT, e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID ";
		String orderBySql = " ORDER BY c.TERMNO ASC";
		
		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 20, 20, 15, 15, 15, 15, 15, 20, 20 };
		List<Map<String, Object>> skTermStatusList = null;
		
		//组装房间id参数
		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				sql += " and a.ROOM_ID ='" + roomId + "' ";
				
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId, roomLeaf);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining("','","'","'"));	
					sql += " and a.ROOM_ID in (" + roomIds + ") ";
					
				}else{	// 若区域之下没有房间，则直接返回空数据				
					sql += " and 1=2 ";
				}				
			}
		}
		
		if (StringUtils.isNotEmpty(statusDateStart)) {
			sql += " and a.STATUSDATE>='" + statusDateStart + "'";
		}
		if (StringUtils.isNotEmpty(statusDateEnd)) {
			sql += " and a.STATUSDATE<='" + statusDateEnd + "'";
		}
		skTermStatusList = thisService.queryMapBySql(sql + groupSql+orderBySql);

		List<Map<String, String>> skTermStatusExpList = new ArrayList<>();
		Map<String, String> skTermStatusMap = null;
		int i = 1;
		for (Map map : skTermStatusList) {
			skTermStatusMap = new LinkedHashMap<>();
			skTermStatusMap.put("xh", i + "");
			skTermStatusMap.put("TERMNO", (String) map.get("TERMNO"));
			skTermStatusMap.put("TERMNAME", (String) map.get("TERMNAME"));
			skTermStatusMap.put("TERMTYPEID", (String) map.get("TERMTYPEID"));
			skTermStatusMap.put("GATEWAYNAME", (String) map.get("GATEWAYNAME"));
			skTermStatusMap.put("ROOM_NAME", (String) map.get("ROOM_NAME"));
			skTermStatusMap.put("NODE_TEXT", (String) map.get("NODE_TEXT"));
			skTermStatusMap.put("TOTALUSEDLITERmin", map.get("TOTALUSEDLITERmin").toString());
			skTermStatusMap.put("TOTALUSEDLITERmax", map.get("TOTALUSEDLITERmax").toString());
			skTermStatusMap.put("useliter", map.get("useliter").toString());
			i++;
			skTermStatusExpList.add(skTermStatusMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", skTermStatusExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head",
				new String[] { "序号", "设备机号", "设备名称", "设备类型", "网关名称", "房间名称", "楼层名称", "最初用水量", "最终用水量", "累积用水量" }); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "用水统计表", "用水统计表", allList);
		if (result == true) {
			request.getSession().setAttribute("exportSkTermCountIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportSkTermCountIsEnd", "0");
			request.getSession().setAttribute("exportSkTermCountIsState", "0");
		}

	}

	@RequestMapping("/checkWaterCountExportEnd")
	public void checkWaterCountExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportSkTermCountIsEnd");
		Object state = request.getSession().getAttribute("exportSkTermCountIsState");
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

	/**
	 * 获取某个区域下的所有房间数据
	 * 
	 * @param roomId
	 * @param roomLeaf
	 * @return
	 */
	private List<String> getRoomIds(String roomId, String roomLeaf) {
		List<String> result = new ArrayList<>();

		// 当选择的区域不为房间时
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ roomId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		if (lists.size() > 0) {
			String areaIds = lists.stream().collect(Collectors.joining("','", "'", "'"));
			hql = "select a.uuid from BuildRoominfo a where a.isDelete=0  and a.roomType!='0' and a.areaId in (" + areaIds + ")";
			result = thisService.queryEntityByHql(hql);
		}

		return result;
	}

}

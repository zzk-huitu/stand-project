package com.zd.school.plartform.report.controller;

import java.io.IOException;
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
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtEcTermStatus;
import com.zd.school.plartform.basedevice.service.PtEcTermStatusService;
import com.zd.school.plartform.comm.service.CommTreeService;

/**
 * 电控使用状态表
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtEcTermStatus")
public class PtEcTermStatusController extends FrameWorkController<PtEcTermStatus> implements Constant {

	@Resource
	PtEcTermStatusService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树

	
	/**
	 * 电控使用状态列表
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtEcTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");
		
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
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining(","));		
					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"roomId\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"roomId\"}]";
					}
					
				}else{	// 若区域之下没有房间，则直接返回空数据
					
					strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}				
			}
		}

		QueryResult<PtEcTermStatus> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, false);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
		
	}

	/**
	 * 电量统计报表
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/listCount" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void listDl(@ModelAttribute PtEcTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		//Integer start = super.start(request);
		Integer pageIndex=Integer.parseInt(request.getParameter("page"));;	//page
		Integer limit = super.limit(request);		
		String querySql = querySql(request);

		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");
		
		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				querySql+=" and b.room_id = '"+roomId + "'";
				
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining("','","'","'"));	

					querySql+=" and b.room_id in ("+ roomIds + ")";
					
				}else{	// 若区域之下没有房间，则直接返回空数据
					
					strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}				
			}
		}
		
		
		// hql语句
		StringBuffer sql = new StringBuffer("EXEC PT_EC_TERMSTATUS_INFO ");
		sql.append("'" + querySql.replace("'", "''") + "',");
		sql.append("'" + pageIndex + "',");
		sql.append("'" + limit + "'");
		
		List<Map<String, Object>> lists = thisService.queryMapBySql(sql.toString());// 执行查询方法
		int count=Integer.parseInt(lists.get(lists.size()-1).get("rownum").toString());
		lists.remove(lists.size()-1);
		
		strData = jsonBuilder.buildObjListToJson(new Long(count), lists, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	@Auth("PtEcTermStatus_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportEcTermStatusIsEnd", "0");
		request.getSession().removeAttribute("exporEcTermStatusIsState");
	    String roomId = request.getParameter("roomId");
	    String roomLeaf = request.getParameter("roomLeaf");
	    String statusDateStart = request.getParameter("statusDateStart");
	    String statusDateEnd = request.getParameter("statusDateEnd");
	    
	    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 15, 15, 20, 20,15,15,15,15, 15, 20, 20};
		List<PtEcTermStatus> ecTermStatusList = null;
		String hql = " from PtEcTermStatus a where a.isDelete=0 ";
		
		//组装房间id参数
		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				hql += " and a.roomId='"+roomId+"'";
				
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining("','","'","'"));				
					hql += " and a.roomId in (" + roomIds + ") ";
				} else {
					hql += " and 1=2 ";						//区域之下没有房间，则显示空数据
				}					
			}
		}
		
		if (StringUtils.isNotEmpty(statusDateStart)) {
			hql+=" and a.statusDate>='"+statusDateStart+"'";
		}
		if (StringUtils.isNotEmpty(statusDateEnd)) {
			hql+=" and a.statusDate<='"+statusDateEnd+"'";
		}
		ecTermStatusList = thisService.queryByHql(hql);

		List<Map<String, String>> ecTermStatusExpList = new ArrayList<>();
		Map<String, String> ecTermStatusMap = null;
		int i = 1;
		for (PtEcTermStatus ecTermStatus : ecTermStatusList) {
			ecTermStatusMap = new LinkedHashMap<>();
			ecTermStatusMap.put("xh",i+"");
			ecTermStatusMap.put("roomName", ecTermStatus.getRoomName());
			ecTermStatusMap.put("termName", ecTermStatus.getTermName());
			ecTermStatusMap.put("statusDate", format.format(ecTermStatus.getStatusDate()));
			ecTermStatusMap.put("usekwh",String.valueOf(ecTermStatus.getUsekwh()));
			ecTermStatusMap.put("buyedkwh", String.valueOf(ecTermStatus.getBuyedkwh()));
			ecTermStatusMap.put("totalusedkwh", String.valueOf(ecTermStatus.getTotalusedkwh()));
			ecTermStatusMap.put("surpluskwh", String.valueOf(ecTermStatus.getSurpluskwh()));
			ecTermStatusMap.put("voltage", String.valueOf(ecTermStatus.getVoltage()));
			ecTermStatusMap.put("currents", String.valueOf(ecTermStatus.getCurrents()));
			ecTermStatusMap.put("power", String.valueOf(ecTermStatus.getPower()));
		 	i++;
			ecTermStatusExpList.add(ecTermStatusMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", ecTermStatusExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] {"序号","房间名称","设备名称","状态的日期", "当前小时用电量", "已购电总量","已使用总电量","剩余总电量","电压","电流","功率"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "电控使用状态", "电控使用状态", allList);
		if (result == true) {
			request.getSession().setAttribute("exportEcTermStatusIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportEcTermStatusIsEnd", "0");
			request.getSession().setAttribute("exporEcTermStatusIsState", "0");
		}
	}
	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportEcTermStatusIsEnd");
		Object state = request.getSession().getAttribute("exporEcTermStatusIsState");
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
	
	@Auth("ELEC_COUNT_export")
	@RequestMapping("/doEcCountExportExcel")
	public void doEcCountExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportEcTermCountIsEnd", "0");
		request.getSession().removeAttribute("exporEcTermCountIsState");
	    String roomId = request.getParameter("roomId");
	    String roomLeaf = request.getParameter("roomLeaf");
	    String statusDateStart = request.getParameter("statusDateStart");
	    String statusDateEnd = request.getParameter("statusDateEnd");
	  
		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 15, 15, 20, 20,15,15,15,20,20};
		List<Map<String,Object>> ecTermStatusList = null;
		String sql1 = "";
		
		//组装房间id参数
		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				sql1 += " and b.room_id ='" + roomId + "' ";
				
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining("','","'","'"));	
					sql1 += " and b.room_id in (" + roomIds + ") ";
					
				}else{	// 若区域之下没有房间，则直接返回空数据				
					sql1 += " and 1=2 ";
				}				
			}
		}
			
		if (StringUtils.isNotEmpty(statusDateStart)) {
			sql1+=" and b.statusDate>='"+statusDateStart+"'";
		}
		if (StringUtils.isNotEmpty(statusDateEnd)) {
			sql1+=" and b.statusDate<='"+statusDateEnd+"'";
		}
		StringBuffer sql = new StringBuffer("EXEC PT_EC_TERMSTATUS_INFO ");
		sql.append("'" + sql1.replace("'", "''") + "',");
		sql.append("'" + 1 + "',");
		sql.append("'" + 20 + "'");
		ecTermStatusList = thisService.queryMapBySql(sql.toString());
		//int count=Integer.parseInt(ecTermStatusList.get(ecTermStatusList.size()-1).get("rownum").toString());
		ecTermStatusList.remove(ecTermStatusList.size()-1);
		
		List<Map<String, String>> ecTermStatusExpList = new ArrayList<>();
		Map<String, String> ecTermStatusMap = null;
		int i = 1;
		for (Map map : ecTermStatusList) {
			ecTermStatusMap = new LinkedHashMap<>();
			ecTermStatusMap.put("xh",i+"");
			ecTermStatusMap.put("TERMNO",String.valueOf(map.get("TERMNO")));
			ecTermStatusMap.put("TERMNAME",(String) map.get("TERMNAME"));
			ecTermStatusMap.put("TERMSN",(String) map.get("TERMSN"));
			ecTermStatusMap.put("TERMTYPEID",String.valueOf(map.get("TERMTYPEID")));
			ecTermStatusMap.put("GATEWAYNAME", (String) map.get("GATEWAYNAME"));
			ecTermStatusMap.put("ROOM_NAME",(String) map.get("ROOM_NAME"));
			ecTermStatusMap.put("NODE_TEXT",(String) map.get("NODE_TEXT"));
			ecTermStatusMap.put("sumdl",map.get("sumdl")==null?"":map.get("sumdl").toString());
		    i++;
			ecTermStatusExpList.add(ecTermStatusMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", ecTermStatusExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[]{"序号","设备机号","设备名称","设备序列号","设备类型","网关名称","房间名称","楼层名称","总电量"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0, 0,0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "用电统计状态", "用电统计状态", allList);
		if (result == true) {
			request.getSession().setAttribute("exportEcTermCountIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportEcTermCountIsEnd", "0");
			request.getSession().setAttribute("exporEcTermCountIsState", "0");
		}

	}
	@RequestMapping("/checkEcCountExportEnd")
	public void checkEcCountExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportEcTermCountIsEnd");
		Object state = request.getSession().getAttribute("exporEcTermCountIsState");
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
	private List<String> getRoomIds(String areaId) {
		List<String> result = new ArrayList<>();

		// 当选择的区域不为房间时
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ areaId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		if (lists.size() > 0) {
			String areaIds = lists.stream().collect(Collectors.joining("','", "'", "'"));
			hql = "select a.uuid from BuildRoominfo a where a.isDelete=0  and a.roomType!='0' and a.areaId in (" + areaIds + ")";
			result = thisService.queryEntityByHql(hql);
		}

		return result;
	}
}

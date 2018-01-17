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
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtSkTermStatus")
public class PtSkTermStatusController extends FrameWorkController<PtSkTermStatus> implements Constant  {

	@Resource
	PtSkTermStatusService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树
	/**
	 * 水控使用状态列表
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list( HttpServletRequest request, HttpServletResponse response)
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

			if (filter != null&&!filter.equals("")) {
				if (roomId != null) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}" + "]";
				}
			} else {
				filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
						+ "\",\"field\":\"roomId\"}]";
			}

		}

		QueryResult<PtSkTermStatus> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
		
	}
	
	/**
	 * 用水统计表
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/statistics" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void statistics(@ModelAttribute PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		  String strData = ""; // 返回给js的数据
			Integer start = super.start(request);
			Integer limit = super.limit(request);		
			String querySql = querySql(request);
			String orderSql = orderSql(request);
			String roomId = request.getParameter("roomId");
			String roomLeaf = request.getParameter("roomLeaf");
			
			if (StringUtils.isNotEmpty(roomId)) {
				if("1".equals(roomLeaf)){	//当选择的区域为房间时
					
					querySql+=" and a.room_id = '"+roomId + "'";
					
				}else{		//当选择的区域不为房间时
					String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
							+ roomId + "%'";
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
						if(sb.length() > 0){
							String roomIds = sb.substring(0, sb.length() - 1);
							querySql+=" and a.room_id in ('"+ roomIds.replace(",", "','") + "')";
						}					
					}
				}
				
			}
			
			String select=" select SUM(a.USELITER) as useliter,MIN(a.TOTALUSEDLITER) as TOTALUSEDLITERmin,MAX(a.TOTALUSEDLITER) as TOTALUSEDLITERmax,"
					+ " c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT,	e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID	";
			String sqlsub=" from dbo.PT_SK_TERMSTATUS a"
					+ "	LEFT JOIN dbo.PT_TERM C ON c.TERMSN=a.TERMSN	"
					+ " LEFT JOIN dbo.BUILD_T_ROOMINFO D ON a.ROOM_ID=D.ROOM_ID	"
					+ " LEFT JOIN dbo.BUILD_T_ROOMAREA F ON d.AREA_ID=f.AREA_ID	"
					+ " LEFT JOIN dbo.PT_GATEWAY E ON c.GATEWAY_ID=e.GATEWAY_ID  "
					+ "where 1=1 and a.isDelete=0 ";
			orderSql=	 " GROUP BY 	c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT, e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID ";
			
			QueryResult<Object> qResult=thisService.queryPageResultBySql(select+sqlsub+querySql+orderSql, start, limit, null);
			
			/*
	    	if (request.getParameter("iden") != null) {
				String[] strings=new String[]{"useliter","TOTALUSEDLITERmin","TOTALUSEDLITERmax","TERMNAME","ROOM_NAME",
					"TERMSN","NODE_TEXT","GATEWAYNAME","TERMNO","TERMTYPEID"};
				List<Map> list=qResult.getResultList();
				List<PtEcTermStatusSK> newlist= new ArrayList<>();
				for(Map map:list){
					PtEcTermStatusSK sk=new PtEcTermStatusSK();
					sk.setStartDl((BigDecimal) map.get("useliter"));
					sk.setEndDl((BigDecimal) map.get("TOTALUSEDLITERmin"));
					sk.setSumDl((BigDecimal) map.get("TOTALUSEDLITERmax"));
					sk.setAreaName((String) map.get("NODE_TEXT"));
					sk.setRoomName((String) map.get("ROOM_NAME"));
					sk.setTermName((String) map.get("TERMNAME"));
					sk.setTermNo((String) map.get("TERMSN"));
					sk.setGatewayName((String) map.get("GATEWAYNAME"));
					newlist.add(sk);
			
				}
				FastExcel.exportExcel(response, "水控统计表", newlist);
				return;
			}
	        */
	        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	
	}
	
	/**
	 * 修改
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doupdate")
	public void doUpdates(PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		if (currentUser != null)
			userCh = currentUser.getXm();
		// 先拿到已持久化的实体
		// entity.getSchoolId()要自己修改成对应的获取主键的方法
		PtSkTermStatus perEntity = thisService.get(entity.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		perEntity.setUpdateUser(userCh);

		entity = thisService.merge(perEntity);// 执行修改方法

		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));

	}
	@Auth("PtSkTermStatus_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportSkTermStatusIsEnd", "0");
		request.getSession().removeAttribute("exporSkTermStatusIsState");
	    String roomId = request.getParameter("roomId");
	    String statusDateStart = request.getParameter("statusDateStart");
	    String statusDateEnd = request.getParameter("statusDateEnd");
	    
	    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	
		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10,15, 15, 20, 20,15,15,15,15, 15, 20, 20,15,15,15,15 };
		List<PtSkTermStatus> skTermStatusList = null;
		String hql = " from PtSkTermStatus a where a.isDelete=0 ";
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
			hql = " select a from PtSkTermStatus a right join BuildRoominfo b on a.roomId = b.uuid where a.isDelete=0 and b.isDelete=0 ";
		}
		if (StringUtils.isNotEmpty(statusDateStart)) {
			hql+=" and a.statusDate>='"+statusDateStart+"'";
		}
		if (StringUtils.isNotEmpty(statusDateEnd)) {
			hql+=" and a.statusDate<='"+statusDateEnd+"'";
		}
		skTermStatusList = thisService.queryByHql(hql);

		List<Map<String, String>> skTermStatusExpList = new ArrayList<>();
		
		Map<String, String> skTermStatusMap = null;
		int i = 1;
		for (PtSkTermStatus skTermStatus : skTermStatusList) {
			skTermStatusMap = new LinkedHashMap<>();
			skTermStatusMap.put("xh",i+"");
			skTermStatusMap.put("roomName", skTermStatus.getRoomName());
			skTermStatusMap.put("termName", skTermStatus.getTermName());
			skTermStatusMap.put("statusDate", format.format(skTermStatus.getStatusDate()));
			skTermStatusMap.put("measure",skTermStatus.getMeasure().toString() );
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
		courseAllMap.put("head", new String[] {"序号","房间名称","设备名称","状态的日期", "测量单位（脉冲/升）", "费率（元/升）","冷水当前小时使用水量（升）","冷水已使用总水量（升）","冷水当前小时使用脉冲数","冷水总使用脉冲数","热水交易金额","热水已交易总额","热水已交易流水","热水已上传流水"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "水控使用状态", "水控使用状态", allList);
		if (result == true) {
			request.getSession().setAttribute("exportSkTermStatusIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportSkTermStatusIsEnd", "0");
			request.getSession().setAttribute("exporSkTermStatusIsState", "0");
		}

	}
	@Auth("WATER_COUNT_export")
	@RequestMapping("/doExpWaterCountExcel")
	public void doExpWaterCountExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportSkTermStatusIsEnd", "0");
		request.getSession().removeAttribute("exporSkTermStatusIsState");
	    String roomId = request.getParameter("roomId");
	    String statusDateStart = request.getParameter("statusDateStart");
	    String statusDateEnd = request.getParameter("statusDateEnd");
		
	    String sql=" select SUM(a.USELITER) as useliter,MIN(a.TOTALUSEDLITER) as TOTALUSEDLITERmin,MAX(a.TOTALUSEDLITER) as TOTALUSEDLITERmax,"
				+ " c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT,	e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID	"
	        	+ " from dbo.PT_SK_TERMSTATUS a"
				+ "	LEFT JOIN dbo.PT_TERM C ON c.TERMSN=a.TERMSN	"
				+ " LEFT JOIN dbo.BUILD_T_ROOMINFO D ON a.ROOM_ID=D.ROOM_ID	"
				+ " LEFT JOIN dbo.BUILD_T_ROOMAREA F ON d.AREA_ID=f.AREA_ID	"
				+ " LEFT JOIN dbo.PT_GATEWAY E ON c.GATEWAY_ID=e.GATEWAY_ID  "
				+ "where 1=1 and a.isDelete=0 ";
		String groupSql=	 " GROUP BY 	c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT, e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID ";
	
		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10,20,20,15,15,15,15, 15, 20,20};
		List<Map<String,Object>> skTermStatusList = null;
		if (StringUtils.isNotEmpty(roomId)) {
			String roomHql = " select b.uuid from BuildRoomarea a left join BuildRoominfo b on a.uuid = b.areaId "
					+ " where a.isDelete=0 and b.isDelete=0 and a.areaType='04' and a.treeIds like '%" + roomId + "%'";
			List<String> roomLists = thisService.queryEntityByHql(roomHql);
			if (roomLists.size() > 0) {
				StringBuffer sb = new StringBuffer();
				for (int i = 0; i < roomLists.size(); i++) {
					sb.append(roomLists.get(i) + ",");
				}
				sql += " and a.ROOM_ID in ('" + sb.substring(0, sb.length() - 1).replace(",", "','") + "') ";
			} else {
				sql += " and a.ROOM_ID ='" + roomId + "' ";
			}

		}
		if (StringUtils.isNotEmpty(statusDateStart)) {
			sql+=" and a.STATUSDATE>='"+statusDateStart+"'";
		}
		if (StringUtils.isNotEmpty(statusDateEnd)) {
			sql+=" and a.STATUSDATE<='"+statusDateEnd+"'";
		}
		skTermStatusList = thisService.queryMapBySql(sql+groupSql);

		List<Map<String, String>> skTermStatusExpList = new ArrayList<>();
		
		Map<String, String> skTermStatusMap = null;
		int i = 1;
		for (Map map : skTermStatusList) {
			skTermStatusMap = new LinkedHashMap<>();
			skTermStatusMap.put("xh",i+"");
			skTermStatusMap.put("TERMNO",(String) map.get("TERMNO"));
			skTermStatusMap.put("TERMNAME", (String) map.get("TERMNAME"));
			skTermStatusMap.put("TERMTYPEID", (String) map.get("TERMTYPEID"));
			skTermStatusMap.put("GATEWAYNAME", (String) map.get("GATEWAYNAME"));
			skTermStatusMap.put("ROOM_NAME", (String) map.get("ROOM_NAME"));
			skTermStatusMap.put("NODE_TEXT",(String) map.get("NODE_TEXT"));
			skTermStatusMap.put("TOTALUSEDLITERmin",map.get("TOTALUSEDLITERmin").toString());
			skTermStatusMap.put("TOTALUSEDLITERmax", map.get("TOTALUSEDLITERmax").toString());
			skTermStatusMap.put("useliter", map.get("useliter").toString());
			i++;
			skTermStatusExpList.add(skTermStatusMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", skTermStatusExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] {"序号","设备机号","设备名称","设备类型", "网关名称", "房间名称","楼层名称","最初用水量","最终用水量","累积用水量"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0,0, 0, 0, 0, 0, 0, 0, 0,0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "用水统计表", "用水统计表", allList);
		if (result == true) {
			request.getSession().setAttribute("exportSkTermStatusIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportSkTermStatusIsEnd", "0");
			request.getSession().setAttribute("exporSkTermStatusIsState", "0");
		}

	}
	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportSkTermStatusIsEnd");
		Object state = request.getSession().getAttribute("exporSkTermStatusIsState");
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

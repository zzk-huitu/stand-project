package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtIrRoomDevice;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.excel.FastExcel;
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
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		

		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String roomId = request.getParameter("roomId");
		if (roomId == null) {
			roomId = "";
		}
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
			// 房间id
			if (sb.length() > 0) {
				if (filter != null) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""
							+ sb.substring(0, sb.length() - 1) + "\",\"field\":\"roomId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""
							+ sb.substring(0, sb.length() - 1) + "\",\"field\":\"roomId\"}]";
				}
			} else {// 区域下没有房间
				if (filter != null) {
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
	/*
	@RequestMapping(value = { "/statistics" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void statistics(@ModelAttribute PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		  String strData = ""; // 返回给js的数据
			Integer start = super.start(request);
			Integer limit = super.limit(request);
			String sort = super.sort(request);
			String querySql = querySql(request);
			String orderSql = orderSql(request);
			String select=" select SUM(a.USELITER) as useliter,MIN(a.TOTALUSEDLITER) as TOTALUSEDLITERmin,MAX(a.TOTALUSEDLITER) as TOTALUSEDLITERmax,"
					+ " c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT,	e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID	";
			String sqlsub=" from dbo.PT_SK_TERMSTATUS a"
					+ "	LEFT JOIN dbo.PT_TERM C ON c.TERMSN=a.TERMSN	"
					+ "LEFT JOIN dbo.BUILD_T_ROOMINFO D ON a.ROOM_ID=D.ROOM_ID	"
					+ "LEFT JOIN dbo.BUILD_T_ROOMAREA F ON d.AREA_ID=f.AREA_ID	"
					+ "LEFT JOIN dbo.PT_GATEWAY E ON c.GATEWAY_ID=e.GATEWAY_ID  where 1=1 ";
			orderSql=	 " GROUP BY 	c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT, e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID ";
			String sql1=" select count(*) from PT_V_USERROOM where 1=1 ";
	        &&&&QueryResult qResult = thisService.getDao().getForValuesToSql(start, limit, querySql,orderSql,select+sqlsub, " WITH query AS  ("+select+sqlsub+querySql+orderSql+" )  select count(1) from query");
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
	        
	        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	
	}
*/
	
	
}

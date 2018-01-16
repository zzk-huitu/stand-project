package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
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
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtEcTermStatus;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.excel.FastExcel;
import com.zd.school.plartform.basedevice.service.PtEcTermStatusService;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

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

		QueryResult<PtEcTermStatus> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
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
		
		if (StringUtils.isNotEmpty(roomId)) {
			if("1".equals(roomLeaf)){	//当选择的区域为房间时
				
				querySql+=" and b.room_id = '"+roomId + "'";
				
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
						querySql+=" and b.room_id in ('"+ roomIds.replace(",", "','") + "')";
					}					
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

}

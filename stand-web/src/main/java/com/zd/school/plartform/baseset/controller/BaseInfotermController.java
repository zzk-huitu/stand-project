package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
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
import com.zd.core.util.ModelUtil;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.oa.terminal.model.OaRoomTerm;
import com.zd.school.plartform.baseset.service.BaseDicitemService;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * ClassName: OaInfotermController Function: ADD FUNCTION. Reason: ADD
 * REASON(可选). Description: 信息发布终端(OA_T_INFOTERM)实体Controller. date: 2017-01-14
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/BaseInfoterm")
public class BaseInfotermController extends FrameWorkController<OaInfoterm> implements Constant {

	@Resource
	BaseInfotermService thisService; // service层接口

	@Resource
	private BaseRoominfoService roomService;

	@Resource
	BaseDicitemService dicitemService;

	/**
	 * @param entity
	 *            实体类
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             设定参数
	 * @Title: list
	 * @Description: 查询数据列表
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response)
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
		
		QueryResult<OaInfoterm> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request),filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("INFOTERM_add")
	@RequestMapping("/doAdd")
	public void doAdd(OaInfoterm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		Integer beforeNumber = Integer.parseInt(request.getParameter("beforeNumber"));
		Integer termCount = Integer.parseInt(request.getParameter("termCount"));
		// 此处为放在入库前的一些检查的代码，如唯一校验等
		Integer isCount = thisService.getQueryCountByHql(" select count(uuid) from OaInfoterm where isDelete=0 ");
		if (isCount >= beforeNumber) {
			isCount++;
			writeJSON(response, jsonBuilder.returnFailureJson("\"起始顺序号应该从[" + isCount.toString() + "]起\""));
			return;
		}
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doAddEntity(entity, currentUser, beforeNumber, termCount);// 执行增加方法
		if (ModelUtil.isNotNull(entity))
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据增加失败,详情见错误日志\""));
	}

	/**
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 * @Title: doDelete
	 * @Description: 逻辑删除指定的数据
	 */
	@Auth("ROOMTERM_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入主键\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();

			boolean flag = thisService.doLogicDeleteByIds(delIds, currentUser);
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"取消成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"取消失败,详情见错误日志\""));
			}
		}
	}

	/**
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doUpdate")
	public void doUpdates(OaInfoterm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 入库前检查代码

		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
		if (ModelUtil.isNotNull(entity))
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));

	}
	@Auth("ROOMTERM_add")
	@SuppressWarnings("unchecked")
	@RequestMapping("/doSetTerminal")
	public void doSetTerminal(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String setTerminals = request.getParameter("terminals");
		String roomId = request.getParameter("roomId");
		String roomName = request.getParameter("roomName");
		SysUser currentUser = getCurrentSysUser();

		List<OaInfoterm> entityTerminals = (List<OaInfoterm>) jsonBuilder.fromJsonArray(setTerminals, OaInfoterm.class);
		Boolean result = thisService.doSetTerminal(entityTerminals, roomId, roomName, currentUser);
		if (result)
			writeJSON(response, jsonBuilder.returnSuccessJson("\"设置成功\""));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"设置失败,详情见错误日志\""));

	}

	@RequestMapping("/getRoomTermInfo")
	public void getRoomInfo(String roomId, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String sql = "select * from OA_V_ROOMTERM where roomId='" + roomId + "'";
		List<OaRoomTerm> roomTerms = thisService.queryEntityBySql(sql, OaRoomTerm.class);
		if (roomTerms.size() == 0) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"请选择房间！\""));
		} else {
			OaRoomTerm roominfo = roomTerms.get(0);
			String strData = jsonBuilder.toJson(roominfo);
			writeJSON(response, jsonBuilder.returnSuccessJson(strData));
		}

	}

	@Auth("INFOTERM_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportTerminfoIsEnd", "0");
		request.getSession().removeAttribute("exportTerminfoIsState");
		String roomName = request.getParameter("roomName");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 15, 15, 20, 35, };
		List<OaInfoterm> terminfoList = null;
		String hql = " from OaInfoterm where isDelete=0 and isUse=1 ";
		if (StringUtils.isNotEmpty(roomName)) {
			hql += " and roomName like '%" + roomName + "%' ";
		}
		hql += " order by termCode";
		terminfoList = thisService.queryByHql(hql);

		List<Map<String, String>> terminfoExpList = new ArrayList<>();
		Map<String, String> terminfoMap = null;
		for (OaInfoterm terminfo : terminfoList) {
			terminfoMap = new LinkedHashMap<>();
			terminfoMap.put("termCode", terminfo.getTermCode());
			terminfoMap.put("termType", terminfo.getTermType());
			terminfoMap.put("termSpec", terminfo.getTermSpec());
			terminfoMap.put("isUse", terminfo.getIsUse() == 0 ? "未使用" : "已使用");
			terminfoMap.put("roomName", terminfo.getRoomName());
			terminfoExpList.add(terminfoMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", terminfoExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "终端号", "类型", "规格", "使用状态", "房间名称" }); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "信息终端数据", "信息终端数据", allList);
		if (result == true) {
			request.getSession().setAttribute("exportTerminfoIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportTerminfoIsEnd", "0");
			request.getSession().setAttribute("exportTerminfoIsState", "0");
		}

	}
    @Auth("ROOMTERM_export")
	@RequestMapping("/doRoomTermExportExcel")
	public void doRoomTermExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportTerminfoIsEnd", "0");
		request.getSession().removeAttribute("exportTerminfoIsState");
		String ids = request.getParameter("ids");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 25, 25, 25 };
		List<OaInfoterm> terminfoList = null;
		String hql = " from OaInfoterm where isDelete=0 and isUse=1 ";
		if (StringUtils.isNotEmpty(ids)) {
			hql += " and uuid in ('" + ids.replace(",", "','") + "')";
		}
		hql += " order by termCode";
		terminfoList = thisService.queryByHql(hql);
		List<Map<String, String>> terminfoExpList = new ArrayList<>();
		Map<String, String> terminfoMap = null;
		for (OaInfoterm terminfo : terminfoList) {
			terminfoMap = new LinkedHashMap<>();
			terminfoMap.put("termCode", terminfo.getTermCode());
			terminfoMap.put("houseNumb", terminfo.getHouseNumb());
			terminfoMap.put("roomName", terminfo.getRoomName());
			terminfoExpList.add(terminfoMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", terminfoExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "终端号", "使用房间名称", "使用房间门牌号" }); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);
		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "终端分配信息", "终端分配信息", allList);
		if (result == true) {
			request.getSession().setAttribute("exportTerminfoIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportTerminfoIsEnd", "0");
			request.getSession().setAttribute("exportTerminfoIsState", "0");
		}

	}

	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportTerminfoIsEnd");
		Object state = request.getSession().getAttribute("exportTerminfoIsState");
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
	 * 获取某个区域下的所有房间数据（只查询出已定义的房间）
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
			hql = "select a.uuid from BuildRoominfo a where a.isDelete=0 and a.roomType!='0' and a.areaId in (" + areaIds + ")";
			result = thisService.queryEntityByHql(hql);
		}

		return result;
	}
}

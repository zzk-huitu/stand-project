package com.zd.school.plartform.basedevice.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtIrRoomDevice;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.basedevice.service.PtIrRoomDeviceService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

import net.sf.json.JSONObject;

/**
 * 房间红外设备
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/BasePtIrRoomDevice")
public class BasePtIrRoomDeviceController extends FrameWorkController<PtIrRoomDevice> implements Constant {
	
	private static Logger logger = Logger.getLogger(BasePtIrRoomDeviceController.class);
	
	@Resource
	PtIrRoomDeviceService thisService; // service层接口

	@Resource
	BaseOfficeAllotService baseOfficeAllotService; // service层接口

	@Resource
	BaseRoominfoService baseRoominfoService;

	@Resource
	CommTreeService treeService;

	@Resource
	BasePtTermService ptTermService;

	@Value("${irsendurl}")  
    private String irsendurl; 
	
	//@Autowired
	//private Environment environment;
	
	/**
	 * @Title: list
	 * @Description: 查询数据列表
	 * @param entity
	 *            实体类
	 * @param request
	 * @param response
	 * @throws IOException
	 *             设定参数
	 * @return void 返回类型
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtIrRoomDevice entity, HttpServletRequest request, HttpServletResponse response)
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
		QueryResult<PtIrRoomDevice> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 区域和房间树
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/treelist")
	public void getTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		//List<CommTree> lists = treeService.getCommTree("JW_V_AREAROOMINFOTREE", whereSql);
		//只显示已定义的房间
		List<CommTree> lists = treeService.getCommTree("JW_V_AREAROOMINFOTREE_DEFINED", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 将设备绑定到房间
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("PTIRROOMDEVICE_add")
	@RequestMapping("/doAdd")
	public void doAdd(PtIrRoomDevice entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		
		thisService.doBindRoomBrand(entity.getRoomId(),entity.getBrandId(),currentUser.getXm());
			
		writeJSON(response, jsonBuilder.returnSuccessJson("\"绑定成功\""));
	}

	/**
	 * 解绑
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@Auth("PTIRROOMDEVICE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids = request.getParameter("ids");
		if (StringUtils.isEmpty(ids)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE, currentUser.getXm());
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情见错误日志\""));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情见错误日志\""));
			}
		}
	}

	@Auth("PTIRROOMDEVICE_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportRoomDeviceIsEnd", "0");
		request.getSession().removeAttribute("exporRoomDeviceIsState");
		String deviceTypeCode = request.getParameter("deviceTypeCode");
		String roomId = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 25, 20, 45 };
		List<PtIrRoomDevice> roomDeviceList = null;
		String hql = " from PtIrRoomDevice a where a.isDelete=0 ";
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
		
/*		if (StringUtils.isNotEmpty(roomId)) {
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
			hql = " select a from PtIrRoomDevice a right join BuildRoominfo b on a.roomId = b.uuid where a.isDelete=0 and b.isDelete=0 ";
		}*/
		if (StringUtils.isNotEmpty(deviceTypeCode)) {
			hql += " and a.deviceTypeCode like '%" + deviceTypeCode + "%' ";
		}
		roomDeviceList = thisService.queryByHql(hql);

		List<Map<String, String>> roomDeviceExpList = new ArrayList<>();
		Map<String, String> roomDeviceMap = null;
		int i = 1;
		for (PtIrRoomDevice roomDevice : roomDeviceList) {
			roomDeviceMap = new LinkedHashMap<>();
			roomDeviceMap.put("xh", i + "");
			roomDeviceMap.put("roomName", roomDevice.getRoomName());
			roomDeviceMap.put("deviceTypeCode", roomDevice.getDeviceTypeCode());
			roomDeviceMap.put("notes", roomDevice.getNotes());
			i++;
			roomDeviceExpList.add(roomDeviceMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", roomDeviceExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "序号", "房间名称", "型号名称", "备注" }); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "房间红外设备", "房间红外设备", allList);
		if (result == true) {
			request.getSession().setAttribute("exportRoomDeviceIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportRoomDeviceIsEnd", "0");
			request.getSession().setAttribute("exporRoomDeviceIsState", "0");
		}

	}

	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportRoomDeviceIsEnd");
		Object state = request.getSession().getAttribute("exporRoomDeviceIsState");
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

	/* 空调控制 
	 * （未完成，待确定各个数据的方式！）
	 */
	@Auth("CLIMATE_CONTROL_IrSend")
	@RequestMapping(value = { "/doIrSend" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void doIrSend(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String roomid1 = request.getParameter("roomid");
		String opt = request.getParameter("opt");
		SysUser currentUser = getCurrentSysUser();
		String qResult = "";
		if (!StringUtils.isEmpty(roomid1)) {
			String[] idStrings = roomid1.split(",");
			for (String id : idStrings) {
				String datahql = "select d.irDataNo as irDataNo  from PtIrData d ,PtIrRoomDevice rd  "
						+ "where d.brandId=rd.brandId and d.isDelete=0 and rd.isDelete=0 " + " and rd.roomId='" + id
						+ "' and d.irDataName like '%" + opt + "%' ";
				List<Long> irDataNos = thisService.getEntityByHql(datahql, new Object[] {});
				List<PtTerm> list = ptTermService.queryByProerties(new String[] { "roomId", "termTypeID", "isDelete" },
						new Object[] { id, "11", 0 });
				List excued = new ArrayList<String>();
				
				for (PtTerm t : list) {
					if (excued.contains(t.getTermSN()))
						continue;
					for (Long irDataNo : irDataNos) {
						qResult += t.getTermName() + t.getTermSN() + ":";
						String result = irSend(t.getTermSN(), irDataNo + "", currentUser.getUuid());
						Map map = JSONObject.fromObject(result);
						if ((boolean) map.get("result")) {
							// excued.add(t.getTermSN());
						}
						qResult += (String) map.get("message") + "<br>";
					}
				}
			}
		}
		qResult = jsonBuilder.returnSuccessJson("'" + qResult + "'");
		writeJSON(response, qResult);// 返回数据
	}

	private String irSend(String sn, String irno, String uuid) {
		
		CloseableHttpClient httpClient = null; // 生成一个httpclient对象
		HttpGet httpGet = null; // 获得登录后的页面
		httpClient = HttpClients.createDefault();
		uuid = "2A5B06D7-1DBB-47D4-B6AF-128A7AB3A974";
		try {
			httpGet = new HttpGet(irsendurl + "?" + "user_Id=" + uuid + "&sn=" + sn + "&ir_No=" + irno + "");
			HttpResponse response = httpClient.execute(httpGet);
			String str = EntityUtils.toString(response.getEntity());
			return str;

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("错误原因：【"+e.getMessage()+"】 出错堆栈跟踪："+ Arrays.toString( e.getStackTrace()));
		} finally {
			httpGet.abort();
			try {
				httpClient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "失败";
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

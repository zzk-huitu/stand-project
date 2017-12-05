package com.zd.school.plartform.basedevice.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
import com.zd.core.util.DateUtil;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.core.util.TLVUtils;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.control.device.model.TLVModel;
import com.zd.school.jw.eduresources.model.JwCalenderdetail;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.baseset.model.BaseDicitem;
import com.zd.school.plartform.baseset.service.BaseDicitemService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;


/**
 * 房间设备
 *
 */
@Controller
@RequestMapping("/BasePtTerm")
public class BasePtTermController extends FrameWorkController<PtTerm> implements Constant  {
	@Resource
	BasePtTermService thisService; // service层接口
	
	@Resource
	BaseOfficeAllotService baseOfficeAllotService; // service层接口
	
	@Resource
    BaseRoominfoService baseRoominfoService ;
	
	@Resource
	BaseDicitemService dicitemService;
	
	
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtTerm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String roomId = request.getParameter("roomId");
		
		if(filter!=null && filter.equals("[]")){
			filter = null;
		}
		if(roomId==null){
			 roomId=""; 
		}
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ roomId + "%'";
		List<String> areaIdlists = baseOfficeAllotService.queryEntityByHql(hql);
		StringBuffer areasb = new StringBuffer();
		for (int i = 0; i < areaIdlists.size(); i++) {
			areasb.append("'" + areaIdlists.get(i) + "'" + ",");
		}
		if (areasb.length() > 0) {
			List<String> roomIdLists = new ArrayList<>();
			hql = "select a.uuid from BuildRoominfo a where a.areaId in (" + areasb.substring(0, areasb.length() - 1)
					+ ")";
			roomIdLists = baseRoominfoService.queryEntityByHql(hql);
			areasb.setLength(0);
			for (int i = 0; i < roomIdLists.size(); i++) {
				areasb.append(roomIdLists.get(i) + ",");
			}
			if (areasb.length() > 0) {
				if (filter != null) {
					filter = filter.substring(0, filter.length() - 1) + ",{'type':'string','comparison':'in','value':'"
							+ areasb.substring(0, areasb.length() - 1) + "','field':'roomId'}]";
				} else {
					filter = "[{'type':'string','comparison':'in','value':'" + areasb.substring(0, areasb.length() - 1)
							+ "','field':'roomId'}]";
				}
			} else {
				if (filter != null) {
					filter = filter.substring(0, filter.length() - 1) + ",{'type':'string','comparison':'in','value':'"
							+ roomId + "','field':'roomId'}]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"roomId\"}]";
				}
			}
		} else {
			if (filter != null) {
				filter = filter.substring(0, filter.length() - 1) + ",{'type':'string','comparison':'=','value':'"
						+ roomId + "','field':'roomId'}]";
			} else {
				filter = "[{'type':'string','comparison':'=','value':'" + roomId + "','field':'roomId'}]";
			}
		}
		QueryResult<PtTerm> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
		
	/**
	 * 获取未分配的设备
	 */
	@RequestMapping(value = { "/getNoAllotList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void getNoAllotList(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		
		String hql="from PtTerm g where g.isDelete=0 and (g.roomId = '' or g.roomId is null) ";
		
		//QueryResult<PtTerm> qResult = thisService.queryResult(hql, super.start(request), super.limit(request));
		QueryResult<PtTerm> qResult =thisService.queryCountToHql(super.start(request), 
				super.limit(request), super.sort(request), super.filter(request), hql, null, null);
		
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 设置设备的房间绑定关系
	 * @param roomId
	 * @param uuid
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("DEVICEALLOT_add")
	@RequestMapping("/doSetPtTerm")
	public void doSetPtTerm(String roomId, String uuid, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		//String uuids[] = uuid.split(",");
		//String roomIds[] = roomId.split(",");
		//PtTerm entity = null;
		SysUser currentUser = getCurrentSysUser();
		thisService.doSetPtTerm(roomId,uuid,currentUser);// 执行修改方法
       
		writeJSON(response, jsonBuilder.returnSuccessJson("\"分配成功!\""));
		
	}	
	
	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param MjUserright
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doAdd")
	public void doAdd(String roomId, String uuid, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String uuids[] = uuid.split(",");
		String roomIds[] = roomId.split(",");
		PtTerm entity = null;
		for (int i = 0; i < uuids.length; i++) {
			entity = thisService.get(uuids[i]);
			entity.setRoomId(roomIds[i]);
			thisService.merge(entity);
			//thisService.updateByProperties("uuid", uuids[i], "roomId", roomId);
		}
		writeJSON(response, jsonBuilder.returnSuccessJson("\"分配成功!\""));
	}		
	
	/**
	 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
	 * MjUserright @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@Auth("DEVICEALLOT_update")
	@RequestMapping("/doUpdate")
	public void doUpdates(PtTerm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		 SysUser currentUser = getCurrentSysUser();
		 entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
	        if (ModelUtil.isNotNull(entity))
	            writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
	        else
	            writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));
		
		
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@Auth("DEVICEALLOT_delete")
	@RequestMapping("/doDelete")
	public void doDelete(String uuid, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String uuids[] = uuid.split(",");
		for (int i = 0; i < uuids.length; i++) {
			thisService.updateByProperties("uuid", uuids[i], "roomId", "");
		}
			writeJSON(response, jsonBuilder.returnSuccessJson("'成功。'"));
	}	
	
	
	//获取高级参数
	@RequestMapping("/highParam_read")
	public void highParam_read(TLVModel tlvs, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		PtTerm perEntity = thisService.get(tlvs.getUuid());
		String strData ="";
		if(perEntity.getAdvParam()!=null){
			TLVUtils.decode(perEntity.getAdvParam(), tlvs.getTlvs());
			strData = JsonBuilder.getInstance().buildList(tlvs.getTlvs(), "");// 处理数据
		}
		writeJSON(response, strData);// 返回数据
	}
	@RequestMapping("/doSetHighParam")
	public void doSetHighParam(TLVModel tlvs, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		SysUser currentUser = getCurrentSysUser();
		String termTypeID=request.getParameter("termTypeID");
		
		//1.判断，是否批量设置(0-不批量，4-本楼层，3-本楼栋，2-本校区，1-本学校，5-选择批量)
		String termRadio=request.getParameter("termRadio");
		if("1".equals(termRadio)){
			thisService.doBatchUpdateHighParam(tlvs, termTypeID,"1",currentUser.getXm());
		}else if("2".equals(termRadio)){
			thisService.doBatchUpdateHighParam(tlvs, termTypeID,"2",currentUser.getXm());
		}else if("3".equals(termRadio)){
			thisService.doBatchUpdateHighParam(tlvs, termTypeID,"3",currentUser.getXm());
		}else if("4".equals(termRadio)){
			thisService.doBatchUpdateHighParam(tlvs, termTypeID,"4",currentUser.getXm());
		}/*else if("5".equals(termRadio)){
			String termIds=request.getParameter("termIds");
			thisService.doUpdatHighParamToIds(tlvs, termIds , currentUser.getXm());
		}*/else{	//默认为0，只设置当前自己
			thisService.doUpdateHighParam(tlvs, currentUser.getXm());
		}
		
		writeJSON(response, jsonBuilder.returnSuccessJson("\"设备参数设置成功！\""));
		
//		byte[] result = null;
//		PtTerm perEntity = thisService.get(tlvs.getUuid());
//		SysUser currentUser = getCurrentSysUser();
//		result=TLVUtils.encode(tlvs.getTlvs());
//		perEntity.setAdvParam(result);
//		perEntity.setUpdateUser(currentUser.getXm());
//		perEntity.setUpdateTime(new Date());
//		thisService.merge(perEntity);// 执行修改方法
//		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));
	}
	
	
	//获取基础参数
	@RequestMapping("/baseParam_read")
	public void baseParam_read(TLVModel tlvs, HttpServletRequest request, 
			HttpServletResponse response) throws IOException{
		PtTerm perEntity = thisService.get(tlvs.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		String strData ="";
		if(perEntity.getBaseParam()!=null){
			TLVUtils.decode(perEntity.getBaseParam(), tlvs.getTlvs());
			if("11".equals(perEntity.getTermTypeID())||"17".equals(perEntity.getTermTypeID())){
				tlvs.setNotes(perEntity.getNotes());
				strData=JsonBuilder.getInstance().toJson(tlvs);
			}else{
				strData = JsonBuilder.getInstance().buildList(tlvs.getTlvs(), "");// 处理数据
			}
		}
		writeJSON(response, strData);// 返回数据
		
	}
	@RequestMapping("/doSetBaseParam")
	public void doSetBaseParam(TLVModel tlvs, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		SysUser currentUser = getCurrentSysUser();
		String termTypeID=request.getParameter("termTypeID");
		String notes=request.getParameter("notes");
		
		//1.判断，是否批量设置(0-不批量，4-本楼层，3-本楼栋，2-本校区，1-本学校，5-选择批量)
		String termRadio=request.getParameter("termRadio");
		if("1".equals(termRadio)){
			thisService.doBatchUpdateBaseParam(tlvs, termTypeID,notes,"1",currentUser.getXm());
		}else if("2".equals(termRadio)){
			thisService.doBatchUpdateBaseParam(tlvs, termTypeID,notes,"2",currentUser.getXm());
		}else if("3".equals(termRadio)){
			thisService.doBatchUpdateBaseParam(tlvs, termTypeID,notes,"3",currentUser.getXm());
		}else if("4".equals(termRadio)){
			thisService.doBatchUpdateBaseParam(tlvs, termTypeID,notes,"4",currentUser.getXm());
		}/*else if("5".equals(termRadio)){
			String termIds=request.getParameter("termIds");
			thisService.doUpdatHighParamToIds(tlvs, termIds , currentUser.getXm());
		}*/else{	//默认为0，只设置当前自己
			thisService.doUpdateBaseParam(tlvs, notes,currentUser.getXm());
		}
		
		writeJSON(response, jsonBuilder.returnSuccessJson("\"设备参数设置成功！\""));
		
	}
	@RequestMapping("/exportExcel")
    public void exportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportPtTermIsEnd", "0");
		request.getSession().removeAttribute("exportPtTermIsState");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 15, 15, 15, 15};
		
		//数据字典项
		String mapKey = null;
		String[] propValue = { "PTTERMTYPE"};
		Map<String, String> mapDicItem = new HashMap<>();
		List<BaseDicitem> listDicItem = dicitemService.queryByProerties("dicCode", propValue);
		for (BaseDicitem baseDicitem : listDicItem) {
				mapKey = baseDicitem.getItemCode() + baseDicitem.getDicCode();
				mapDicItem.put(mapKey, baseDicitem.getItemName());
			}

		String roomId = request.getParameter("roomId");
		String termName = request.getParameter("termName");
		
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ roomId + "%'";
		String hql1 = " from PtTerm where isDelete=0 ";
		List<String> areaIdlists = baseOfficeAllotService.queryEntityByHql(hql);
		StringBuffer areasb = new StringBuffer();
		for (int i = 0; i < areaIdlists.size(); i++) {
			areasb.append("'" + areaIdlists.get(i) + "'" + ",");
		}
		
		if (areasb.length() > 0) {
			List<String> roomIdLists = new ArrayList<>();
			hql = "select a.uuid from BuildRoominfo a where a.areaId in (" + areasb.substring(0, areasb.length() - 1)
					+ ")";
			roomIdLists = baseRoominfoService.queryEntityByHql(hql);
			areasb.setLength(0);
			for (int i = 0; i < roomIdLists.size(); i++) {
				areasb.append("'"+roomIdLists.get(i)+"'"+ ",");
			}
			if (areasb.length() > 0) {
				hql1 +=" and roomId in (" + areasb.substring(0, areasb.length() - 1)+")";
			} else {
				hql1 +=" and roomId ='" + roomId+"'";
			}
		}else {
			hql1 +=" and roomId ='" + roomId+"'";
		}

		List<PtTerm> ptTermList = null;
		if (StringUtils.isNotEmpty(termName)) {
			hql1 +=" and termName like'%" + termName+"%'";
		}
		hql1=hql1+ " order by createTime desc";
		ptTermList = thisService.queryByHql(hql1);

		// 处理班级基本数据
		List<Map<String, String>> ptTermExportList = new ArrayList<>();
		Map<String, String> ptTermExporMap = null;
		String ClassName="";
		int i=1;
		for (PtTerm ptTermdetail : ptTermList) {
			ptTermExporMap = new LinkedHashMap<>();
			ptTermExporMap.put("xh",i+"");
			ptTermExporMap.put("termName", ptTermdetail.getTermName());
			ptTermExporMap.put("gatewayName", ptTermdetail.getGatewayName());
			ptTermExporMap.put("roomName", ptTermdetail.getRoomName());
			ptTermExporMap.put("termTypeID", mapDicItem.get(ptTermdetail.getTermTypeID()+"PTTERMTYPE"));
			i++;
			ptTermExportList.add(ptTermExporMap);
		}
		// --------2.组装课程表格数据
		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", ptTermExportList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "序号","设备名称","网关名称", "房间名称","设备类型"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "房间下所有设备", "设备列表", allList);
		if (result == true) {
			request.getSession().setAttribute("exportPtTermIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportPtTermIsEnd", "0");
			request.getSession().setAttribute("exportPtTermIsState", "0");
		}
	} 
    
    @RequestMapping("/checkExportEnd")
    public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportPtTermIsEnd");
		Object state = request.getSession().getAttribute("exportPtTermIsState");
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

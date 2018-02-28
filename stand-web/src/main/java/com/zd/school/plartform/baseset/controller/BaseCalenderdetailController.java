package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
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
import com.zd.core.util.DateUtil;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.eduresources.model.JwCalenderdetail ;
import com.zd.school.plartform.baseset.service.BaseCalenderdetailService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 作息节次信息
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/BaseCalenderdetail")
public class BaseCalenderdetailController extends FrameWorkController<JwCalenderdetail> implements Constant {

    @Resource
    BaseCalenderdetailService thisService; // service层接口

    /**
     * 作息时间列表
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute JwCalenderdetail entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		
		String strData = ""; // 返回给js的数据

		QueryResult<JwCalenderdetail> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	
	}

	/**
	 * 添加作息时间
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("SCHOOLCALENDAR_add")
	@RequestMapping("/doAdd")
	public void doAdd(JwCalenderdetail entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等

		// 获取当前操作用户
		
		SysUser currentUser = getCurrentSysUser();

        entity = thisService.doAddEntity(entity, currentUser);// 执行增加方法
        if (ModelUtil.isNotNull(entity))
            writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        else
            writeJSON(response, jsonBuilder.returnFailureJson("\"数据增加失败,详情见错误日志\""));  
	
	}

	/**
	 * 删除作息时间
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@Auth("SCHOOLCALENDAR_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (delIds == null) {
			writeJSON(response, jsonBuilder.returnFailureJson("'未选择需删除的信息'"));
			return;
		}
	
		try {
			
			boolean flag =thisService.doDeleteEntity(delIds);
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,请刷新重试！'"));
		}
	}

	/**
	 * doRestore还原删除的记录 @Title: doRestore @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doRestore")
	public void doRestore(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入还原主键'"));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE, currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'还原成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'还原失败'"));
			}
		}
	}

	/**
	 * 编辑作息时间
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("SCHOOLCALENDAR_update")
	@RequestMapping("/doUpdate")
	public void doUpdates(JwCalenderdetail entity, HttpServletRequest request, HttpServletResponse response)
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
	
	@Auth("SCHOOLCALENDAR_export")
	@RequestMapping("/doExportExcel")
    public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportBaseCalenderdetailIsEnd", "0");
		request.getSession().removeAttribute("exportBaseCalenderdetailIsState");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 22, 22, 22,22 };

		String canderId = request.getParameter("canderId"); // 程序中限定每次只能导出一个班级
		String sheetTitle = request.getParameter("canderName");
		String title = request.getParameter("campusName");

		List<JwCalenderdetail> jwCalenderdetailList = null;
		String hql = " from JwCalenderdetail where isDelete=0 ";
		if (StringUtils.isNotEmpty(canderId)) {
			hql +="and canderId ='" + canderId+"'";
		}
		hql=hql+ " order by beginTime";
		jwCalenderdetailList = thisService.queryByHql(hql);

		// 处理班级基本数据
		List<Map<String, String>> jwCalenderList = new ArrayList<>();
		Map<String, String> jwCalenderMap = null;
		String ClassName="";
		int i=1;
		for (JwCalenderdetail jwCalenderdetail : jwCalenderdetailList) {
			jwCalenderMap = new LinkedHashMap<>();
			jwCalenderMap.put("xh",i+"");
			int isAfgernoon = jwCalenderdetail.getIsafgernoon();
			String timeQuantum = "";
			if(isAfgernoon==0){
				timeQuantum= "上午";
			}else if(isAfgernoon==1){
				timeQuantum= "下午";
			}else if(isAfgernoon==2){
				timeQuantum= "晚上";
			}
			jwCalenderMap.put("timeQuantum", timeQuantum);
			jwCalenderMap.put("jcName", jwCalenderdetail.getJcName());
//			String beginTime = DateUtil.formatDateTime(jwCalenderdetail.getBeginTime());
			jwCalenderMap.put("beginTime", (jwCalenderdetail.getBeginTime()==null)?"":DateUtil.formatDateTime(jwCalenderdetail.getBeginTime()).substring(11,16));
			jwCalenderMap.put("endTime", (jwCalenderdetail.getEndTime()==null)?"":DateUtil.formatDateTime(jwCalenderdetail.getEndTime()).substring(11,16));
			i++;
			jwCalenderList.add(jwCalenderMap);
		}
		// --------2.组装课程表格数据
		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", jwCalenderList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "序号","时段","节次名称", "开始时间","结束时间"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, title, sheetTitle, allList);
		if (result == true) {
			request.getSession().setAttribute("exportBaseCalenderdetailIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportBaseCalenderdetailIsEnd", "0");
			request.getSession().setAttribute("exportBaseCalenderdetailIsState", "0");
		}
	} 
    
    @RequestMapping("/checkExportEnd")
    public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportBaseCalenderdetailIsEnd");
		Object state = request.getSession().getAttribute("exportBaseCalenderdetailIsState");
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

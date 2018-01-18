
package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.core.util.TLVUtils;
import com.zd.core.util.TagLenVal;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.control.device.model.TLVModel;
import com.zd.school.plartform.baseset.model.BaseDicitem;
import com.zd.school.plartform.baseset.service.BaseDicitemService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.ykt.model.PtTask;
import com.zd.school.ykt.service.PtTaskService;

/**
* Created by zenglj on 2017-05-16.
*/
@Controller
@RequestMapping("/PtTask")
public class PtTaskController extends FrameWorkController<PtTask> implements Constant {

    @Resource
    PtTaskService thisService; // service层接口
	@Resource
	BaseDicitemService dicitemService;
    /**
      * @Title: list
      * @Description: 查询数据列表
      * @param entity 实体类
      * @param request
      * @param response
      * @throws IOException    设定参数
      * @return void    返回类型
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(@ModelAttribute PtTask entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
		QueryResult<PtTask> qResult = thisService.list(super.start(request), super.limit(request), super.sort(request),  super.filter(request),true);
        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }
    
    @RequestMapping(value = { "/tasklistbyTermId" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void tasklistbyTermId(@ModelAttribute PtTask entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);
        QueryResult<PtTask> qResult = thisService.tasklistbyTermId(start, limit, sort, filter,true);
        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }
  
    
	@RequestMapping("/baseParam_read")
	public void baseParam_read(TLVModel tlvs, HttpServletRequest request, 
			HttpServletResponse response) throws IOException{
		PtTask perEntity = thisService.get(tlvs.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		String strData ="";
		if(perEntity.getTaskdata()!=null){
			List<TagLenVal> list=TLVUtils.decode(perEntity.getTaskdata(), tlvs.getTlvs());
			tlvs.setTlvs(list);
			strData = JsonBuilder.getInstance().buildList(tlvs.getTlvs(), "");// 处理数据
		}
		writeJSON(response, strData);// 返回数据
	}
	@Auth("TASK_DETAIL_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportTaskIsEnd", "0");
		request.getSession().removeAttribute("exporTaskIsState");
	  
	    String tasktype = request.getParameter("tasktype");
	    String termsn = request.getParameter("termsn");
	    
	
		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10,15, 15, 20, 20,30,25,15,15,30, 20, 20,30};
		// 数据字典项
		String mapKey = null;
		String[] propValue = { "TASKTYPE","PTTERMTYPE" };
		Map<String, String> mapDicItem = new HashMap<>();
		List<BaseDicitem> listDicItem = dicitemService.queryByProerties("dicCode", propValue);
		for (BaseDicitem baseDicitem : listDicItem) {
			mapKey = baseDicitem.getItemCode() + baseDicitem.getDicCode();
			mapDicItem.put(mapKey, baseDicitem.getItemName());
		}
		List<PtTask> ptTaskList = null;
		//String hql = " from PtTask a where a.isDelete=0 ";
		String hql= " select a from PtTask a where a.executetime= "
				+ "(select Max(executetime) from PtTask s1 where s1.termsn=a.termsn)  ";
	
		if (StringUtils.isNotEmpty(tasktype)) {
			hql+=" and a.tasktype like'%"+tasktype+"%'";
		}
		if (StringUtils.isNotEmpty(termsn)) {
			hql+=" and a.termsn like'%"+termsn+"%'";
		}
		hql+=" order by updateTime desc,executetime asc";
		ptTaskList = thisService.queryByHql(hql);

		List<Map<String, String>> ptTasExpList = new ArrayList<>();
		
		Map<String, String> ptTasMap = null;
		SimpleDateFormat format =new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		int i = 1;
		for (PtTask ptTask : ptTaskList) {
			ptTasMap = new LinkedHashMap<>();
			ptTasMap.put("xh",i+"");
			ptTasMap.put("taskno", ptTask.getTaskno());
			ptTasMap.put("taskdate", ptTask.getTaskdate());
			ptTasMap.put("tasktype", mapDicItem.get(ptTask.getTasktype() + "TASKTYPE"));
			ptTasMap.put("devicetype", mapDicItem.get(ptTask.getDevicetype() + "PTTERMTYPE"));
			ptTasMap.put("termsn", ptTask.getTermsn());
			ptTasMap.put("termName", ptTask.getTermName());
			ptTasMap.put("retrycount", ptTask.getRetrycount().toString());
			ptTasMap.put("executecount", ptTask.getExecutecount().toString());
			ptTasMap.put("executetime", format.format(ptTask.getExecutetime()));
			ptTasMap.put("executeresult", ptTask.getExecuteresult()==true?"成功":"失败");
			ptTasMap.put("istaskover", ptTask.getIstaskover()==true?"是":"否");
			ptTasMap.put("resultmsg", ptTask.getResultmsg());
			i++;
			ptTasExpList.add(ptTasMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", ptTasExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] {"序号","任务编号","任务日期","任务类型", "设备类型", "设备序列号","设备序名称","重试次数","执行次数","执行时间","执行结果","任务是否结束","结果消息"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0 }); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "任务明细", "任务明细", allList);
		if (result == true) {
			request.getSession().setAttribute("exportTaskIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportTaskIsEnd", "0");
			request.getSession().setAttribute("exporTaskIsState", "0");
		}

	}
	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportTaskIsEnd");
		Object state = request.getSession().getAttribute("exporTaskIsState");
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

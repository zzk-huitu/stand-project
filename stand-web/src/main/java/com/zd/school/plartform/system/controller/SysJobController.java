
package com.zd.school.plartform.system.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysDeptjobService;
import com.zd.school.plartform.system.service.SysJobService;

/**
 * 岗位管理
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SysJob")
public class SysJobController extends FrameWorkController<BaseJob> implements Constant {

	@Resource
	SysJobService thisService; // service层接口
	@Resource
	SysDeptjobService deptService; // service层接口

	/**
	 * 标准的查询列表功能
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(BaseJob entity, HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<BaseJob> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 标准的添加功能
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("JOBINFO_add")
	@RequestMapping("/doAdd")
	public void doAdd(BaseJob entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String jobCode = entity.getJobCode();
		String jobName = entity.getJobName();

		String hql1 = " o.isDelete='0' ";
		// 此处为放在入库前的一些检查的代码，如唯一校验等
		if (thisService.IsFieldExist("jobCode", jobCode, "-1", hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"岗位编码不能重复！\""));
			return;
		}

		if (thisService.IsFieldExist("jobName", jobName, "-1", hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"岗位名称不能重复！\""));
			return;
		}

		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doAddEntity(entity, currentUser.getXm());

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
	}

	/**
	 * 标准的逻辑删除功能
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@Auth("JOBINFO_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"没有传入删除主键\""));
			return;
		} else {

			// 判断这些岗位是否正在被其他部门使用
			String hql = "select count(a.uuid) from BaseDeptjob as a where a.jobId in ('" + delIds.replace(",", "','")
					+ "') and a.isDelete=0";
			int count = thisService.getQueryCountByHql(hql);
			if (count > 0) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"这些岗位正在被其他部门使用，不允许删除！\""));
				return;
			}

			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE, currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}

	/**
	 * doRestore还原删除的记录 @Title: doRestore @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	//@Auth("JOBINFO_restore")
	@RequestMapping("/doRestore")
	public void doRestore(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入还原主键\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE, currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
			}
		}
	}

	/**
	 * 标准的更新数据功能
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@Auth("JOBINFO_update")
	@RequestMapping("/doUpdate")
	public void doUpdate(BaseJob entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 入库前检查代码

		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();

		//entity = thisService.doUpdateEntity(entity, currentUser.getXm(), null);
		entity = thisService.doUpdate(entity, currentUser.getXm());

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
	}
	
	/**
	 * 获取岗位的部门
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/getJobDept" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void getJobDept(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData="";
		String jobId = request.getParameter("jobId"); // 获得传过来的roleId
		String hql=" from BaseDeptjob a where  a.isDelete=0 and a.jobId = '"+jobId+"'";
		List list = deptService.queryByHql(hql);
	    strData = jsonBuilder.buildObjListToJson(new Long(list.size()), list, true);
		writeJSON(response, strData);
	}
	
	@RequestMapping("/doExportExcel")
    public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession().setAttribute("exportJobinfoIsEnd", "0");
        request.getSession().removeAttribute("exportJobinfoIsState");
        
        String jobName = request.getParameter("jobName");
        
        //先获取数据
        String hql = " from BaseJob where isDelete=0 ";
        if(StringUtils.isNotEmpty(jobName)){
        	hql=hql+"and jobName like '%"+jobName+"%'";
        }
        List<BaseJob> baseJobList = thisService.queryByHql(hql);
          
        List<Map<String, Object>> allList = new ArrayList<>();//存处理后的数据，有的一个sheet里面可能有多张表，所以用list
  		Integer[] columnWidth = new Integer[] { 20, 20, 20};//每个列宽
        
  		//处理数据，选择我们要导出的字段
  		List<Map<String, String>> jobInfoList = new ArrayList<>();//多条数据
		Map<String, String> jobInfoMap = null;//用map去存每一个数据
		for (BaseJob baseJob : baseJobList) {
			jobInfoMap = new LinkedHashMap<>();
			jobInfoMap.put("jobName", baseJob.getJobName());
			jobInfoMap.put("jobCode", baseJob.getJobCode());
			jobInfoMap.put("orderIndex", String.valueOf(baseJob.getOrderIndex()));
			jobInfoList.add(jobInfoMap);
		}
        
		Map<String, Object> jobInfoAllMap = new LinkedHashMap<>();//一个MAP代表一张表的信息，最后放入allList中
		jobInfoAllMap.put("data", jobInfoList);//数据
//		jobInfoAllMap.put("title", "岗位信息表");//标题
		jobInfoAllMap.put("head", new String[] { "岗位名称","岗位编码","级别" }); //列名，规定名字相同的，设定为合并
		jobInfoAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		jobInfoAllMap.put("columnAlignment", new Integer[] { 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		jobInfoAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(jobInfoAllMap);

		String sheetTitle = "岗位信息表";
		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "岗位信息表", sheetTitle, allList);
		if (result == true) {
			request.getSession().setAttribute("exportJobinfoIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportJobinfoIsEnd", "0");
			request.getSession().setAttribute("exportJobinfoIsState", "0");
		}
    } 
    
    @RequestMapping("/checkExportEnd")
    public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

        Object isEnd = request.getSession().getAttribute("exportJobinfoIsEnd");
        Object state = request.getSession().getAttribute("exportJobinfoIsState");
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

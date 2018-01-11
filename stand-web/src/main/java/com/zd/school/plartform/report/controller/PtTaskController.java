
package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.core.util.TLVUtils;
import com.zd.core.util.TagLenVal;
import com.zd.school.control.device.model.TLVModel;
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
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);
        QueryResult<PtTask> qResult = thisService.list(start, limit, sort, filter,true);
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
    /**
     * 
      * @Title: doadd
      * @Description: 增加新实体信息至数据库
      * @param PtTask 实体类
      * @param request
      * @param response
      * @return void    返回类型
      * @throws IOException    抛出异常
     */
    @RequestMapping("/doadd")
    public void doAdd(PtTask entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        
		//此处为放在入库前的一些检查的代码，如唯一校验等
		
		//获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doAddEntity(entity, currentUser);// 执行增加方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
		} catch (Exception e) {
			e.printStackTrace();
			writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
		}
    }

    /**
      * 
      * @Title: doDelete
      * @Description: 逻辑删除指定的数据
      * @param request
      * @param response
      * @return void    返回类型
      * @throws IOException  抛出异常
     */
    @RequestMapping("/dodelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
            return;
        } else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDeleteByIds(delIds, currentUser);
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
				}
			} catch (Exception e) {
				e.printStackTrace();
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
			}
        }
    }
    /**
     * @Title: doUpdate
     * @Description: 编辑指定记录
     * @param PtTask
     * @param request
     * @param response
     * @return void    返回类型
     * @throws IOException  抛出异常
    */
    @RequestMapping("/doupdate")
    public void doUpdates(PtTask entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
		
		//入库前检查代码
		
		//获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		} catch (Exception e) {
			e.printStackTrace();
			writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		}
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
}

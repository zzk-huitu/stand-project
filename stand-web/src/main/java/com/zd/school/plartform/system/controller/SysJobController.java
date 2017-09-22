
package com.zd.school.plartform.system.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

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
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysJobService;

/**
 * ClassName: BizTJobController Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 岗位信息实体Controller. date: 2016-05-16
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/SysJob")
public class SysJobController extends FrameWorkController<BaseJob> implements Constant {
	
    @Resource
    SysJobService thisService; // service层接口
    
    
    /**
     * list查询 @Title: list @Description: TODO @param @param entity
     * 实体类 @param @param request @param @param response @param @throws
     * IOException 设定参数 @return void 返回类型 @throws
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(BaseJob entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        QueryResult<BaseJob> qr = thisService.queryPageResult(super.start(request), super.limit(request),
                super.sort(request), super.filter(request), true);

        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 
     * doAdd @Title: doAdd @Description: TODO @param @param BizTJob
     * 实体类 @param @param request @param @param response @param @throws
     * IOException 设定参数 @return void 返回类型 @throws
     * 
     * @throws InvocationTargetException
     * @throws IllegalAccessException
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
        
        entity=thisService.doAddEntity(entity,currentUser.getXm());     
        
        if(entity==null)
        	writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
    }

    /**
     * doDelete @Title: doDelete @Description: TODO @param @param
     * request @param @param response @param @throws IOException 设定参数 @return
     * void 返回类型 @throws
     */
    @Auth("JOBINFO_delete")
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
            return;
        } else {
            SysUser currentUser = getCurrentSysUser();
            boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
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
    @Auth("JOBINFO_restore")
    @RequestMapping("/doRestore")
    public void doRestore(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入还原主键\""));
            return;
        } else {
            SysUser currentUser = getCurrentSysUser();
            boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE,currentUser.getXm());
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
            }
        }
    }

    /**
     * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
     * BizTJob @param @param request @param @param response @param @throws
     * IOException 设定参数 @return void 返回类型 @throws
     */
    @Auth("JOBINFO_update")
    @RequestMapping("/doUpdate")
    public void doUpdate(BaseJob entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        // 入库前检查代码
    	
        // 获取当前的操作用户
        SysUser currentUser = getCurrentSysUser();  

        entity=thisService.doUpdateEntity(entity, currentUser.getXm(), null);        
        
        if(entity==null)
       	 	writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        
    }
}

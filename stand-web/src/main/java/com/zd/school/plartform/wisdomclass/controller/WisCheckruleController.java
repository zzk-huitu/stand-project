package com.zd.school.plartform.wisdomclass.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

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
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.ecc.model.JwCheckrule;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.wisdomclass.ecc.service.JwCheckruleService;
@Controller
@RequestMapping("/ClassCheckrule")
public class WisCheckruleController extends FrameWorkController<JwCheckrule> implements Constant{
	  @Resource
	  JwCheckruleService thisService; // service层接口
	  
	  /**
	     * @param entity   实体类
	     * @param request
	     * @param response
	     * @return void    返回类型
	     * @throws IOException 设定参数
	     * @Title: list
	     * @Description: 查询数据列表
	     */
	    @RequestMapping(value = {"/list"}, method = {org.springframework.web.bind.annotation.RequestMethod.GET,
	            org.springframework.web.bind.annotation.RequestMethod.POST})
	    public void list(@ModelAttribute JwCheckrule entity, HttpServletRequest request, HttpServletResponse response)
	            throws IOException {
	        String strData = ""; // 返回给js的数据
	        QueryResult<JwCheckrule> qr = thisService.queryPageResult(super.start(request), super.limit(request),
					super.sort(request), super.filter(request), true);

			strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
			writeJSON(response, strData);// 返回数据
	    }
	    @Auth("ECCSET_add")
	    @RequestMapping("/doAdd")
	    public void doAdd(JwCheckrule entity, HttpServletRequest request, HttpServletResponse response)
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
	            writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
	        }
	    }
	    @Auth("ECCSET_delete")
	    @RequestMapping("/doDelete")
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
	                writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
	            }
	        }
	    }
	    @Auth("ECCSET_update")
	    @RequestMapping("/doUpdate")
	    public void doUpdates(JwCheckrule entity, HttpServletRequest request, HttpServletResponse response)
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
	            writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
	        }
	    }
	    
	    @Auth("ECCSET_usingOrnot")
	    @RequestMapping("/doUsingorNo")
	    public void doUsingOrno(HttpServletRequest request, HttpServletResponse response) throws IOException {
	        //获取当前的操作用户
	        SysUser currentUser = getCurrentSysUser();
	        String ids = request.getParameter("ids");
	        String usingStatu = request.getParameter("using");
	        try {
	            Boolean flag = thisService.doUsingOrno(ids, usingStatu, currentUser);
	            if (flag) {
	                writeJSON(response, jsonBuilder.returnSuccessJson("'操作成功'"));
	            } else {
	                writeJSON(response, jsonBuilder.returnFailureJson("'操作失败,详情见错误日志'"));
	            }
	        } catch (Exception e) {
	            writeJSON(response, jsonBuilder.returnFailureJson("'操作失败,详情见错误日志'"));
	        }
	    }
}

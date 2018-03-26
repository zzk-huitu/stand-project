
package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

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
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseDic;
import com.zd.school.plartform.baseset.model.BaseDicTree;
import com.zd.school.plartform.baseset.service.BaseDicService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.redis.service.DicItemRedisService;

/**
 * 数据字典
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/BaseDic")
public class BaseDicController extends FrameWorkController<BaseDic> implements Constant {

    @Resource
    private BaseDicService thisService; // service层接口
    
    @Resource
    private DicItemRedisService dicItemRedisService;
    
    /**
     * 数据字典类别列表
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(@ModelAttribute BaseDic entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
       
        List<BaseDicTree> lists = thisService.getDicTreeList(request.getParameter("whereSql"));

        strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 添加字典
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("DICTIONARY_add")
    @RequestMapping("/doAdd")
    public void doAdd(BaseDic entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String parentNode = entity.getParentNode();      
        String nodeText = entity.getNodeText();
        String dicCode = entity.getDicCode();
        Integer orderIndex = entity.getOrderIndex();
        // 此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0'";
        if (thisService.IsFieldExist("nodeText", nodeText, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"字典名称不能重复！\""));
            return;
        }
        if (thisService.IsFieldExist("dicCode", dicCode, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"字典编码不能重复！\""));
            return;
        }
        String hql1 = " o.isDelete='0' and parentNode='" + parentNode + "' ";
        if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), "-1", hql1)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"同一级别已有此顺序号！\""));
            return;
        }
        // 获取当前操作用户    
        SysUser currentUser = getCurrentSysUser();
                 
        entity=thisService.doAdd(entity,currentUser.getXm());     
        
        if(entity==null)
        	writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
    }

    /**
     * 删除字典
     * @param request
     * @param response
     * @throws IOException
     */
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
     * 更新字典
     * 删除redis的缓存数据，下次读取时再存入redis
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("DICTIONARY_update")
    @RequestMapping("/doUpdate")
    public void doUpdates(BaseDic entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String parentNode = entity.getParentNode();      
        String nodeText = entity.getNodeText();
        String dicCode = entity.getDicCode();
        String uuid = entity.getUuid();
        Integer orderIndex = entity.getOrderIndex();
        // 此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0'";
        if (thisService.IsFieldExist("nodeText", nodeText, uuid, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"字典名称不能重复！\""));
            return;
        }
        if (thisService.IsFieldExist("dicCode", dicCode, uuid, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"字典编码不能重复！\""));
            return;
        }
        String hql1 = " o.isDelete='0' and parentNode='" + parentNode + "' ";
        if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), uuid, hql1)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"同一级别已有此顺序号！\""));
            return;
        }
        
        // 获取当前的操作用户  
        SysUser currentUser = getCurrentSysUser();     
        entity=thisService.doUpdateEntity(entity, currentUser.getXm(),null);           
     			
        if(entity==null)
       	 	writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
        else{
        	// 删除reids中的此数据字典缓存，以至于下次请求时重新从库中获取
            dicItemRedisService.deleteByDicCode(entity.getDicCode());
            
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        }
    }
}

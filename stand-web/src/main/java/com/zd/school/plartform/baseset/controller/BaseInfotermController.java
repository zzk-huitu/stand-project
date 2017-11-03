package com.zd.school.plartform.baseset.controller;


import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.ExportExcelAnnoUtil;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
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
     * @param entity   实体类
     * @param request
     * @param response
     * @return void 返回类型
     * @throws IOException 设定参数
     * @Title: list
     * @Description: 查询数据列表
     */
    @RequestMapping(value = {"/list"}, method = {org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST})
    public void list(@ModelAttribute OaInfoterm entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        Integer start = super.start(request);
        Integer limit = super.limit(request);
        String sort = super.sort(request);
        String filter = super.filter(request);
        QueryResult<OaInfoterm> qResult = thisService.list(start, limit, sort, filter, true);
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
     * @throws IOException 抛出异常
     * @Title: doDelete
     * @Description: 逻辑删除指定的数据
     */
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

    @SuppressWarnings("unchecked")
    @RequestMapping("/doSetTerminal")
    public void doSetTerminal(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String setTerminals = request.getParameter("terminals");
        String roomId = request.getParameter("roomId");
        String roomName = request.getParameter("roomName");
        SysUser currentUser = getCurrentSysUser();

        List<OaInfoterm> entityTerminals = (List<OaInfoterm>) jsonBuilder.fromJsonArray(setTerminals,
                OaInfoterm.class);
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
        List<OaRoomTerm> roomTerms= thisService.queryEntityBySql(sql, OaRoomTerm.class);
        if(roomTerms.size()==0){        	
              writeJSON(response, jsonBuilder.returnFailureJson("\"请选择房间！\""));
        }else{
        	  OaRoomTerm roominfo = roomTerms.get(0);
              String strData = jsonBuilder.toJson(roominfo);
              writeJSON(response, jsonBuilder.returnSuccessJson(strData));
        }
      
    }

 /*  @RequestMapping("/exportExcel")
    public void exportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession().setAttribute("exportTerinfoIsEnd", "0");
        request.getSession().removeAttribute("exportTerinfoIsState");
        String ids = request.getParameter("ids");

        List<OaInfoterm> list = null;
        try {
            list = null;
            String hql = " from OaInfoterm where isDelete=0 and isUse=1 ";
            if (StringUtils.isNotEmpty(ids)) {
                hql += " and uuid in ('" + ids.replace(",", "','") + "')";
            }
            hql += " order by termCode";
            list = thisService.queryByHql(hql);
            FastExcel.exportExcel(response, "终端分配信息", list);
            request.getSession().setAttribute("exportTerinfoIsEnd", "1");
        } catch (Exception e) {
            e.printStackTrace();
            request.getSession().setAttribute("exportTerinfoIsEnd", "0");
            request.getSession().setAttribute("exportTerinfoIsState", "0");
        }
    }
*/
    @RequestMapping("/exportExcel")
    public void exportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession().setAttribute("exportTerinfoIsEnd", "0");
        request.getSession().removeAttribute("exportTerinfoIsState");
        try {
        Class<?> clazz = EntityUtil.getClassByName("com.zd.school.oa.terminal.model.OaInfoterm");//根据实体类名获取类
        List<OaInfoterm> list  =  thisService.queryByHql("from " + clazz.getSimpleName()
        					+" where isDelete=0 and isUse=1  order by termCode");//获取数据
        Map<Integer, String> headMap =ExportExcelAnnoUtil.getHeadMap(clazz);//获取表头信息MAP<排序，列名>
        Map<Integer, Integer> widthMap = ExportExcelAnnoUtil.getWidthMap(clazz);//获取表头列宽MAP<排序，列宽>
        ExportExcelAnnoUtil.exportExcel(response, "信息终端数据", headMap, widthMap, list);
        request.getSession().setAttribute("exportTerinfoIsEnd", "1");
        } catch (Exception e) {
            e.printStackTrace();
            request.getSession().setAttribute("exportTerinfoIsEnd", "0");
            request.getSession().setAttribute("exportTerinfoIsState", "0");
        }
    } 
    
    @RequestMapping("/checkExportEnd")
    public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

        Object isEnd = request.getSession().getAttribute("exportTerinfoIsEnd");
        Object state = request.getSession().getAttribute("exportTerinfoIsState");
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

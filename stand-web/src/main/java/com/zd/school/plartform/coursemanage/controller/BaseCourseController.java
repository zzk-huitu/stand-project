package com.zd.school.plartform.coursemanage.controller;

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
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.eduresources.model.JwTBasecourse;
import com.zd.school.jw.eduresources.service.JwTBasecourseService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 基础课程
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/BaseCourse")
public class BaseCourseController extends FrameWorkController<JwTBasecourse> implements Constant {

    @Resource
    private JwTBasecourseService thisService;

    //获取列表数据
    @RequestMapping(value = "/list", method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void getList(@ModelAttribute JwTBasecourse entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        QueryResult<JwTBasecourse> qr = thisService.queryPageResult(super.start(request), super.limit(request),
                super.sort(request), super.filter(request), true);

        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }
    
    //获取列表数据
    @RequestMapping(value = "/listNoPage", method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void listNoPage(@ModelAttribute JwTBasecourse entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        QueryResult<JwTBasecourse> qr = thisService.queryPageResult(super.start(request), 0,
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
    @Auth("COURSEINFO_add")
    @RequestMapping("/doAdd")
    public void doAdd(JwTBasecourse entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        //String courseCode = entity.getCourseCode();
        String courseName = entity.getCourseName();
        // 此处为放在入库前的一些检查的代码，如唯一校验等

        if (thisService.IsFieldExist("courseName", courseName, "-1")) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"课程名称不能重复！\""));
            return;
        }
        
        // 获取当前操作用户
        String userCh =  getCurrentSysUser().getXm();
        
        JwTBasecourse resultEntity=thisService.doAddEntity(entity, userCh);          

        // 返回实体到前端界面
        writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(resultEntity)));
    }

    /**
     * doDelete @Title: doDelete @Description: TODO @param @param
     * request @param @param response @param @throws IOException 设定参数 @return
     * void 返回类型 @throws
     */
    @Auth("COURSEINFO_delete")
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
            return;
        } else {
        	// 判断这些课程是否被部门学科中绑定
			String hql = "select count(a.uuid) from BaseOrg as a where a.extField01 in ('" + delIds.replace(",", "','")
					+ "') and a.isDelete=0";
			int count = thisService.getQueryCountByHql(hql);
			if (count > 0) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"这些课程目前绑定到了学科中，解绑后才能删除！\""));
				return;
			}
        	SysUser currentUser=getCurrentSysUser();
            boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
            }
        }
    }

    /**
     * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
     * BizTJob @param @param request @param @param response @param @throws
     * IOException 设定参数 @return void 返回类型 @throws
     */
    @Auth("COURSEINFO_update")
    @RequestMapping("/doUpdate")
    public void doUpdates(JwTBasecourse entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        //String courseCode = entity.getCourseCode();
        String courseName = entity.getCourseName();
        String courseId = entity.getUuid();
        // 此处为放在入库前的一些检查的代码，如唯一校验等

        if (thisService.IsFieldExist("courseName", courseName, courseId)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"课程名称不能重复！\""));
            return;
        }

        // 获取当前的操作用户
        String userCh = getCurrentSysUser().getXm();

        JwTBasecourse resultEntity=thisService.doUpdateEntity(entity, userCh, null);      

        writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(resultEntity)));
    }
}

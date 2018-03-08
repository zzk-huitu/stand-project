
package com.zd.school.plartform.coursemanage.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.core.util.TLVUtils;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

/**
 * 教师任课信息
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/CourseTeacher")
public class CourseTeacherController extends FrameWorkController<JwCourseteacher> implements Constant {

    @Resource
    JwCourseteacherService thisService; // service层接口
    @Resource 
    private TeaTeacherbaseService teacherService;
    
    /**
     * 任课信息列表(此方法带修改优化）
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(@ModelAttribute JwCourseteacher entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
		String claiId = request.getParameter("claiId");
		Integer claiLevel=0;
		if(request.getParameter("claiLevel")!=null){
			claiLevel = Integer.parseInt(request.getParameter("claiLevel")); 
		}
        QueryResult<JwCourseteacher> qr = thisService.getClassCourseTeacherList(super.start(request), super.limit(request),
                super.sort(request), super.filter(request), true,claiId,claiLevel);

        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 删除(此服务层方法待修改优化)
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     * @throws NoSuchMethodException
     * @throws SecurityException
     */
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
            return;
        } else {
        	SysUser currentUser = getCurrentSysUser();
        	//thisService.MjJuriAllot(null,delIds);
            boolean flag = thisService.doDelCourseTeacher(delIds, currentUser);
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
            }
        }
    }

    /**
     * 
     * getYearCourseTeacherList:指定学年、学期的所有班级的任课教师.
     *
     * @author luoyibo
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     *             void
     * @throws @since
     *             JDK 1.8
     */
    @RequestMapping("/getYearCourseTeacherList")
    public void getYearCourseTeacherList(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Integer studyYear = Integer.parseInt(request.getParameter("studyYear"));
        String semester = request.getParameter("semester");

        String hql = " from JwCourseteacher where studyYear=" + studyYear + " and semester='" + semester
                + "' and isDelete='0' ";
        List<JwCourseteacher> lists = thisService.queryByHql(hql);
        String strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 设置任课教师(服务层方法带修改优化)
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @RequestMapping("/doAddCourseTeacher")
    public void doAddCourseTeacher(HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String jsonData = request.getParameter("jsonData");
        String removeIds = request.getParameter("removeIds");
        int studyYear = Integer.parseInt(request.getParameter("studyYear"));
        String semester = request.getParameter("semester");
        SysUser sysuser = getCurrentSysUser();
       // thisService.MjJuriAllot(jsonData,null);
        Boolean strData = thisService.doAddCourseTeacher(studyYear, semester, jsonData, removeIds, sysuser);
        if (strData)
            writeJSON(response, jsonBuilder.returnSuccessJson("'设置任课教师成功'"));
        else
            writeJSON(response, jsonBuilder.returnFailureJson("'设置任课教师失败'"));
    }
    
    /**
     * 替换课程老师(服务层方法带修改优化)
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @RequestMapping("/doReplaceCourseTeacher")
    public void doReplaceCourseTeacher(HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String jsonData = request.getParameter("jsonData");
        String replaceCouTea = request.getParameter("replaceCouTea");
        int studyYear = Integer.parseInt(request.getParameter("studyYear"));
        String semester = request.getParameter("semester");
        SysUser sysuser = getCurrentSysUser();
        Boolean strData = thisService.doReplaceCourseTeacher(studyYear, semester, jsonData, replaceCouTea, sysuser);
        if (strData)
            writeJSON(response, jsonBuilder.returnSuccessJson("'设置任课教师成功'"));
        else
            writeJSON(response, jsonBuilder.returnFailureJson("'设置任课教师失败'"));
    }
    
    
    
    @RequestMapping("/replaceTeacher")
    public void replaceTeacher(HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
    	  String uuid = request.getParameter("uuid");
    	  String teacherGroupId = request.getParameter("teacherGroupId");
    	  String tteacId = request.getParameter("tteacId");
       if(StringUtils.isEmpty(tteacId)&&StringUtils.isEmpty(teacherGroupId)){
    	   writeJSON(response, jsonBuilder.returnFailureJson("'设置任课教师失败'"));
    	   return ;
       }else{
    	   if(StringUtils.isEmpty(tteacId)){
    		   tteacId=null;
    	   }
    	   if(StringUtils.isEmpty(teacherGroupId)){
    		   teacherGroupId=null;
    	   }
    	   this.thisService.updateByProperties("uuid", uuid, new String[]{"teacherGroupId","tteacId"}, new Object[]{
    			   teacherGroupId,tteacId
    	  });
       }
            writeJSON(response, jsonBuilder.returnSuccessJson("'设置任课教师成功'"));
    }
    
    
    /**
     * 更新课程周节数
     */
    @RequestMapping("/updateZjs")
    public void updateZjs(	@RequestParam("zjs") int zjs,HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
    	String claiId = request.getParameter("claiId");
    	String courseId = request.getParameter("courseId");
    	String batch = request.getParameter("batch");
    	if(batch!=null){
    		thisService.updateZjsByClassId(claiId, courseId, zjs);
    	}else{
			thisService.updateByProperties(new String[]{"claiId","courseId"}, new Object[]{claiId,courseId},new String[]{"acszjs"}, new Object[]{zjs});
    	}
    	writeJSON(response, jsonBuilder.returnSuccessJson("'成功'"));
    }
    
    /**
     * 更新公用实验室
     * ad9ee55c-6f05-4772-8ad7-ced280fedf0d
     * fbc07f8e-1041-470d-809a-4706136474c6
     * f61dcf4c-c7bb-4d91-a65c-73d8f13fb14f
     * 
     * 
     * http://localhost:8080/JwCourseteacher/updatePublicClass?claiId=ad9ee55c-6f05-4772-8ad7-ced280fedf0d&courseId=fbc07f8e-1041-470d-809a-4706136474c6&batch=1&publicClassid=f61dcf4c-c7bb-4d91-a65c-73d8f13fb14f
     */
    @RequestMapping("/updatePublicClass")
    public void updatePublicClass(	@RequestParam("publicClassid") String publicClassid,HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
    	String claiId = request.getParameter("claiId");
    	String courseId = request.getParameter("courseId");
    	String batch = request.getParameter("batch");
    	if(batch!=null){//比如更新初一年级所有班级
    		thisService.updatePubliceClass(claiId, courseId, publicClassid);
    	}else{
			thisService.updateByProperties(new String[]{"claiId","courseId"}, new Object[]{claiId,courseId},new String[]{"publicclassid"}, new Object[]{publicClassid});
    	}
    	writeJSON(response, jsonBuilder.returnSuccessJson("'成功'"));
    }
    
    @RequestMapping("/clearPublicClass")
    public void clearPublicClass(	HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
    	String claiId = request.getParameter("claiId");
    	String courseId = request.getParameter("courseId");
    	thisService.updateByProperties(new String[]{"claiId","courseId"}, new Object[]{claiId,courseId},new String[]{"publicclassid"}, new Object[]{null});
    	writeJSON(response, jsonBuilder.returnSuccessJson("'成功'"));
	}
}

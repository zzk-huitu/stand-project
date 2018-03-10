package com.zd.school.jw.arrangecourse.service;

import java.lang.reflect.InvocationTargetException;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseService;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;

/**
 * 
 * ClassName: JwCourseteacherService Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 教师任课信息(JW_T_COURSETEACHER)实体Service接口类. date:
 * 2016-08-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

public interface JwCourseteacherService extends BaseService<JwCourseteacher> {

    /**
     * 
     * doAddCourseTeacher:设置任课教师.
     * 
     * @author luoyibo
     * @param semester
     *            任课学期
     * @param currentUser
     *            当前操作者
     * @return String
     * @throws IllegalArgumentException 
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws SecurityException 
     * @throws NoSuchMethodException 
     * @throws @since
     *             JDK 1.8
     */
    public Boolean doAddCourseTeacher(String jsonData, SysUser currentUser) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException, SecurityException;

    public Boolean doDelCourseTeacher(String delIds, SysUser currentUser) throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException;
    
    public QueryResult<JwCourseteacher> getClassCourseTeacherList(Integer start, Integer limit, String sort, String filter,
            Boolean isDelete, String claiId, Integer claiLevel);   
    
	/**
	 * 批量更新周课时
	 */
	public String updateZjsByClassId(String classid,String courseid,int zjs);

	public Integer doReplaceCourseTeacher(String jctUuid, String teacherId, SysUser sysser) throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException;

	public void updatePubliceClass(String claiId, String courseId, String publicClassid);
	
	/**
	 * 获取用户有权限的学科树
	 * @param node
	 * @param currentUser
	 * @return
	 */
	public CommTreeChk getUserRightDeptDisciplineTree(String rootId, SysUser currentUser);
}
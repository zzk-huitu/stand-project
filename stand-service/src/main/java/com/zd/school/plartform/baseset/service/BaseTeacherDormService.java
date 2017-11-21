package com.zd.school.plartform.baseset.service;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseService;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: DormStudentdormService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (DormTeacherDorm)实体Service接口类.
 * date: 2016-08-26
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface BaseTeacherDormService extends BaseService<DormTeacherDorm> {
	
	public QueryResult<DormTeacherDorm> list(Integer start, Integer limit, String sort, String filter, String whereSql,String orderSql,
            SysUser currentUser); 
	public Boolean doOut(String ids,SysUser currentUser);
	public Boolean doAddDormTea(DormTeacherDorm entity,Map hashMap,HttpServletRequest request,SysUser currentUser)throws IllegalAccessException, InvocationTargetException;
    public Boolean doDelete(String delIds);
    public void doSettingOff(String roomIds);
}
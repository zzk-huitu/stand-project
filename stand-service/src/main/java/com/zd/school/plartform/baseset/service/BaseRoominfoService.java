package com.zd.school.plartform.baseset.service;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.BuildRoominfo ;
import com.zd.school.plartform.system.model.SysUser;


/**
 * 
 * ClassName: BuildRoominfoService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 教室信息实体Service接口类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface BaseRoominfoService extends BaseService<BuildRoominfo> {
	public Integer getCount(String roomName);

	public Boolean doBatchAddRoom(BuildRoominfo roominfo, SysUser currentUser);

	public Boolean doDeleteRoomDefine(String delIds, String xm, Map<String, Object> hashMap);

	public Boolean doAddRoomDefine(BuildRoominfo entity, HttpServletRequest request, String userCh) throws IllegalAccessException, InvocationTargetException;

}
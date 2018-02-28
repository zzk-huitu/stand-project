package com.zd.school.plartform.baseset.service;

import java.lang.reflect.InvocationTargetException;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.BuildClassRoomDefine;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.build.define.model.BuildRoominfo;


/**
 * 
 * ClassName: BuildClassroomService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 教室信息实体Service接口类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface BaseClassRoomDefineService extends BaseService<BuildClassRoomDefine> {
	public BuildClassRoomDefine getByRoomId(String roomId);
	public void addClassRoom(BuildRoominfo entity, String id, String userCh) throws IllegalAccessException, InvocationTargetException;
	public Boolean delClassRoom(BuildRoominfo roomInfo,String delId, String xm);
}
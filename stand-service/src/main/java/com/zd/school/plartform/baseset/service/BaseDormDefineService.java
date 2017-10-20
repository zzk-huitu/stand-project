package com.zd.school.plartform.baseset.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: BuildOfficeService Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 宿舍定义 date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

public interface BaseDormDefineService extends BaseService<BuildDormDefine> {
	public BuildDormDefine getByRoomId(String roomId);
    public void addDormRoom(BuildRoominfo entity, BuildDormDefine dormRoom,String id, String userCh) throws Exception;
	public Boolean delDormRoom(BuildRoominfo roomInfo,String delIds, String xm)throws Exception;
	public BuildDormDefine doUpdateEntity(BuildDormDefine entity, SysUser currentUser) throws Exception;
}
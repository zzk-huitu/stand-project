package com.zd.school.plartform.baseset.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.BuildFuncRoomDefine ;
import com.zd.school.build.define.model.BuildRoominfo;


/**
 * 
 * ClassName: BuildFuncroomdefinService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: BUILD_T_FUNCROOMDEFIN实体Service接口类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface BaseFuncRoomDefineService extends BaseService<BuildFuncRoomDefine> {
	public BuildFuncRoomDefine getByRoomId(String roomId);
	public void addFunRoom(BuildRoominfo entity, String id, String userCh) throws Exception;
	public Boolean delFunRoom(BuildRoominfo roomInfo,String delId, String xm)throws Exception;
}
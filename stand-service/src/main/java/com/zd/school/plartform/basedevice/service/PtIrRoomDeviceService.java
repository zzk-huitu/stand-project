package com.zd.school.plartform.basedevice.service;

import java.util.Map;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.control.device.model.PtIrRoomDevice ;


/**
 * 
 * ClassName: PtIrRoomDeviceService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 房间红外设备(PT_IR_ROOM_DEVICE)实体Service接口类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface PtIrRoomDeviceService extends BaseService<PtIrRoomDevice> {

	public void doBindRoomBrand(String roomIds, String brandIds, String xm);
	
}
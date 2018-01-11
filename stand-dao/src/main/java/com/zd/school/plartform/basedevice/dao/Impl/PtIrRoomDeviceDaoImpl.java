package com.zd.school.plartform.basedevice.dao.Impl;


import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtIrRoomDevice ;
import com.zd.school.plartform.basedevice.dao.PtIrRoomDeviceDao;


/**
 * 
 * ClassName: PtIrRoomDeviceDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 房间红外设备(PT_IR_ROOM_DEVICE)实体Dao接口实现类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class PtIrRoomDeviceDaoImpl extends BaseDaoImpl<PtIrRoomDevice> implements PtIrRoomDeviceDao {
    public PtIrRoomDeviceDaoImpl() {
        super(PtIrRoomDevice.class);
        // TODO Auto-generated constructor stub
    }
}
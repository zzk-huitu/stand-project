package com.zd.school.plartform.basedevice.service.Impl;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtIrRoomDevice ;
import com.zd.school.plartform.basedevice.dao.PtIrRoomDeviceDao;
import com.zd.school.plartform.basedevice.service.PtIrRoomDeviceService;


/**
 * 
 * ClassName: PtIrRoomDeviceServiceImpl
 * Function:  ADD FUNCTION. 
 * Reason:  ADD REASON(可选). 
 * Description: 房间红外设备(PT_IR_ROOM_DEVICE)实体Service接口实现类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class PtIrRoomDeviceServiceImpl extends BaseServiceImpl<PtIrRoomDevice> implements PtIrRoomDeviceService{
	 
	 @Resource
	 public void setPtIrRoomDeviceDao(PtIrRoomDeviceDao dao) {
	        this.dao = dao;
	 }
		
	 private static Logger logger = Logger.getLogger(PtIrRoomDeviceServiceImpl.class);
	
}
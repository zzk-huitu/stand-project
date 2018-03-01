package com.zd.school.plartform.basedevice.service.Impl;

import java.util.Date;

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

	@Override
	public void doBindRoomBrand(String roomIds, String brandIds, String xm) {
		
		String[] roomId = roomIds.split(",");
		String[] brandId = brandIds.split(",");
		// TODO Auto-generated method stub
		PtIrRoomDevice roomDevice = null;
		for (int i = 0; i < brandId.length; i++) {
			for (int j = 0; j < roomId.length; j++) {
				String[] name = { "roomId", "brandId" };
				String[] value = { roomId[j], brandId[i] };
				roomDevice = this.getByProerties(name, value);
				if (roomDevice != null) {
					roomDevice.setBrandId(brandId[i]);
					roomDevice.setUpdateTime(new Date());
					roomDevice.setIsDelete(0);
					roomDevice.setUpdateUser(xm);
					this.merge(roomDevice);
				} else {
					roomDevice = new PtIrRoomDevice();
					roomDevice.setBrandId(brandId[i]);
					roomDevice.setRoomId(roomId[j]);
					roomDevice.setCreateTime(new Date());
					roomDevice.setCreateUser(xm);
					this.merge(roomDevice);
				}
			}
		}
	}
	
}
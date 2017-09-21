package com.zd.school.plartform.basedevice.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.plartform.basedevice.dao.BaseGatewayDao;
import com.zd.school.plartform.basedevice.service.BaseGatewayService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 网关表
 * @author hucy
 *
 */
@Service
@Transactional
public class BaseGatewayServiceImpl extends BaseServiceImpl<PtGateway> implements BaseGatewayService{
	
	@Resource
    public void setBaseGatewayDao(BaseGatewayDao dao) {
        this.dao = dao;
    }
	private static Logger logger = Logger.getLogger(BaseGatewayServiceImpl.class);

	@Override
	public PtGateway doUpdateEntity(PtGateway entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		PtGateway perEntity = this.get(entity.getUuid());
				try {
					BeanUtils.copyPropertiesExceptNull(perEntity, entity);
					perEntity.setUpdateTime(new Date()); // 设置修改时间
					perEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
					entity = this.merge(perEntity);// 执行修改方法

					return entity;
				} catch (IllegalAccessException e) {
					logger.error(e.getMessage());
					return null;
				} catch (InvocationTargetException e) {
					logger.error(e.getMessage());
					return null;
				}
		}
	
	@Override
	public PtGateway doAddEntity(PtGateway entity, SysUser currentUser) {
		try {
			Integer orderIndex = this.getDefaultOrderIndex(entity);
			PtGateway perEntity = new PtGateway();
			perEntity.setCreateUser(currentUser.getXm());
			perEntity.setOrderIndex(orderIndex);
			// perEntity.setPriceValue(entity.getPriceValue());
			// perEntity.setPriceStatus(entity.getPriceStatus());
			BeanUtils.copyPropertiesExceptNull(entity, perEntity);
			// 持久化到数据库
			entity = this.merge(entity);
			return entity;
		} catch (IllegalAccessException e) {
			logger.error(e.getMessage());
			return null;
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage());
			return null;
		}
		
	}
}

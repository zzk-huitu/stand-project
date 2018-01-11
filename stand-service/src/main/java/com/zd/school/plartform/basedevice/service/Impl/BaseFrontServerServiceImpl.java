package com.zd.school.plartform.basedevice.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.build.define.model.SysFrontServer;
import com.zd.school.jw.eduresources.model.JwCalenderdetail;
import com.zd.school.plartform.basedevice.dao.BaseFrontServerDao;
import com.zd.school.plartform.basedevice.service.BaseFrontServerService;
import com.zd.school.plartform.baseset.service.Impl.BaseCalenderdetailServiceImpl;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 综合前置管理
 * 
 * @author hucy
 *
 */
@Service
@Transactional
public class BaseFrontServerServiceImpl extends BaseServiceImpl<SysFrontServer> implements BaseFrontServerService {

	@Resource
	public void setSysFrontServerDao(BaseFrontServerDao dao) {
		this.dao = dao;
	}

	private static Logger logger = Logger.getLogger(BaseFrontServerServiceImpl.class);

	@Override
	public SysFrontServer doUpdateEntity(SysFrontServer entity, SysUser currentUser) {

		// 先拿到已持久化的实体
		// entity.getSchoolId()要自己修改成对应的获取主键的方法
		SysFrontServer perEntity = this.get(entity.getUuid());
		perEntity.setUpdateUser(currentUser.getXm());
		// 将entity中不为空的字段动态加入到perEntity中去。
		try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
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
	public SysFrontServer doAddEntity(SysFrontServer entity, SysUser currentUser) {
		try {
			Integer orderIndex = this.getDefaultOrderIndex(entity);
			SysFrontServer perEntity = new SysFrontServer();
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
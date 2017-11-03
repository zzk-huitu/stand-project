package com.zd.school.plartform.basedevice.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.dao.BaseDao;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.build.allot.model.JwClassRoomAllot;
import com.zd.school.control.device.model.MjUserright;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.control.device.model.PtSkMeter;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.plartform.basedevice.dao.MjUserrightDao;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.basedevice.service.MjUserrightService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: MjUserrightServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 门禁权限表(MJ_UserRight)实体Service接口实现类. date:
 * 2016-09-08
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class MjUserrightServiceImpl extends BaseServiceImpl<MjUserright> implements MjUserrightService {

	private static Logger logger = Logger.getLogger(MjUserrightServiceImpl.class);


	@Resource
	public void setMjUserrightDao(MjUserrightDao dao) {
		this.dao = dao;
	}
	
	
	@Override
	public MjUserright doAddEntity(MjUserright entity, SysUser currentUser) {
		try {
			Integer orderIndex = this.getDefaultOrderIndex(entity);
			MjUserright perEntity = new MjUserright();
			perEntity.setCreateUser(currentUser.getXm());
			perEntity.setOrderIndex(orderIndex);
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
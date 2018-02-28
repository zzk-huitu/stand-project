package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.dao.BaseDormDefineDao;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: BuildOfficeServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 宿舍定义Service接口实现类. date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseDormDefineServiceImpl extends BaseServiceImpl<BuildDormDefine> implements BaseDormDefineService {
	@Resource
	public void setBuildLaboratorydefinDao(BaseDormDefineDao dao) {
		this.dao = dao;
	}

	@Resource
	private BaseRoominfoService thisService; // service层接口

	@Override
	public BuildDormDefine getByRoomId(String roomId) {
		String hql = "from BuildDormDefine where 1=1";
		if (!roomId.isEmpty()) {
			hql += " and roomId='" + roomId + "' ";
		}
		BuildDormDefine entity = this.getEntityByHql(hql);
		return entity;
	}

	@Override
	public BuildDormDefine doUpdateEntity(BuildDormDefine entity, SysUser currentUser) throws Exception {
		BuildRoominfo roomInfo = null;
		// 先拿到已持久化的实体
		BuildDormDefine perEntity = this.getByRoomId(entity.getUuid());
		// 获取当前的操作用户
		String userCh = "超级管理员";
		if (currentUser != null)
			userCh = currentUser.getXm();
		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		if (entity.getTteacId() != null && !entity.getTteacId().equals(""))
			perEntity.setDormAdmin(entity.getTteacId()); // 设置教师id
		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(userCh); // 设置修改人的中文名
		entity = this.merge(perEntity);// 执行修改方法
		
		roomInfo=thisService.get(entity.getUuid());
		roomInfo.setRoomName(entity.getRoomName());
		roomInfo.setUpdateTime(new Date());
		roomInfo.setUpdateUser(userCh);
		// 执行更新方法
		thisService.merge(roomInfo);
		return entity;
	}

	@Override
	public void addDormRoom(BuildRoominfo entity, BuildDormDefine dormRoom, String id, String userCh) throws IllegalAccessException, InvocationTargetException {
		BuildRoominfo roomInfo = null;

		roomInfo = thisService.get(id);
		roomInfo.setUpdateTime(new Date());
		roomInfo.setUpdateUser(userCh);
		roomInfo.setRoomName(entity.getRoomName());
		roomInfo.setRoomType("1");// 设置房间类型 1.宿舍
		roomInfo.setAreaStatu(1);// 设置为已分配
		// 执行更新方法
		thisService.merge(roomInfo);

		
		BeanUtils.copyPropertiesExceptNull(dormRoom, entity);
		
		// 生成默认的orderindex
		Integer orderIndex = this.getDefaultOrderIndex(dormRoom);
		dormRoom.setRoomId(id);// 设置房间id
		dormRoom.setCreateTime(new Date());
		dormRoom.setCreateUser(userCh); // 创建人
		dormRoom.setUpdateUser(userCh); // 创建人的中文名
		dormRoom.setOrderIndex(orderIndex);// 排序
		this.merge(dormRoom); // 执行添加方法

	}

	@Override
	public Boolean delDormRoom(BuildRoominfo roomInfo, String delId, String xm) {
		Boolean flag=false;
		BuildDormDefine dormRoom = null;// 宿舍定义
		dormRoom = this.getByRoomId(delId);// roomId
		if (!dormRoom.getRoomStatus().equals("1")) {// 0：未分配 1:已分配
			roomInfo.setUpdateTime(new Date());
			roomInfo.setUpdateUser(xm);
			roomInfo.setRoomType("0");// 设置房间类型为空
			roomInfo.setAreaStatu(0);// 设置房间状态为未分配
			roomInfo.setRoomName(roomInfo.getRoomCode());
			thisService.merge(roomInfo);// 执行更新方法

			this.delete(dormRoom);
			/*
			 * dormRoom.setIsDelete(1); dormRoom.setUpdateTime(new Date());
			 * dormRoom.setUpdateUser(xm); this.merge(dormRoom);
			 */
			flag = true;
		} else {
			flag = false;
		}

		return flag;
	}

	
}
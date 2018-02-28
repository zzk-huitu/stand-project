package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.build.define.model.BuildOfficeDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.dao.BaseOfficeDefineDao;
import com.zd.school.plartform.baseset.service.BaseOfficeDefineService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;

/**
 * 
 * ClassName: BuildOfficeServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 办公室信息实体Service接口实现类. date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseOfficeDefineServiceImpl extends BaseServiceImpl<BuildOfficeDefine> implements BaseOfficeDefineService {
	@Resource
	public void setBuildLaboratorydefinDao(BaseOfficeDefineDao dao) {
		this.dao = dao;
	}

	@Resource
	private BaseRoominfoService thisService; // service层接口

	@Override
	public BuildOfficeDefine getByRoomId(String roomId) {
		String hql = "from BuildOfficeDefine where 1=1";
		if (!roomId.isEmpty()) {
			hql += " and roomId='" + roomId + "' ";
		}
		BuildOfficeDefine entity = this.getEntityByHql(hql);
		return entity;
	}

	@Override
	public void addOffRoom(BuildRoominfo entity, String id, String userCh) throws IllegalAccessException, InvocationTargetException {
		BuildRoominfo roomInfo = null;
		BuildOfficeDefine offRoom = null;// 办公室定义
		offRoom = new BuildOfficeDefine();
		BeanUtils.copyPropertiesExceptNull(offRoom, entity);
		// 生成默认的orderindex
		Integer orderIndex = this.getDefaultOrderIndex(offRoom);
		offRoom.setRoomId(id);// 设置房间id
		offRoom.setCreateUser(userCh); // 创建人
		offRoom.setUpdateUser(userCh); // 创建人的中文名
		offRoom.setCreateTime(new Date());
		offRoom.setOrderIndex(orderIndex);// 排序
		this.merge(offRoom); // 执行添加方法

		roomInfo = thisService.get(id);
		roomInfo.setRoomName(entity.getRoomName());
		roomInfo.setUpdateTime(new Date());
		roomInfo.setUpdateUser(userCh);
		roomInfo.setRoomType("2");// 设置房间类型 2.办公室
		roomInfo.setAreaStatu(1);// 设置为已分配
		// 执行更新方法
		thisService.merge(roomInfo);

	}

	@Override
	public Boolean delOffRoom(BuildRoominfo roomInfo, String delId, String xm) {
		Boolean flag=false;
		BuildOfficeDefine offRoom = null;// 办公室定义
		offRoom = this.getByRoomId(delId);
		if(!offRoom.getRoomStatus().equals("1")){
			roomInfo.setUpdateTime(new Date());
			roomInfo.setUpdateUser(xm);
			roomInfo.setRoomType("0");// 设置房间类型为空
			roomInfo.setAreaStatu(0);// 设置房间状态为未分配
			roomInfo.setRoomName(roomInfo.getRoomCode());
			thisService.merge(roomInfo);// 执行更新方法
			
			this.delete(offRoom);
			/*offRoom.setIsDelete(1);
			offRoom.setUpdateTime(new Date());
			offRoom.setUpdateUser(xm);
			this.merge(offRoom);*/
			flag=true;
		}else {//已分配
			flag=false;
		}
        return flag;
		
	}
}
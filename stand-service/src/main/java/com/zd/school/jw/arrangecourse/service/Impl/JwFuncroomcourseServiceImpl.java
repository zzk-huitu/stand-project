package com.zd.school.jw.arrangecourse.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.jw.arrangecourse.dao.JwFuncroomcourseDao;
import com.zd.school.jw.arrangecourse.model.JwFuncroomcourse;
import com.zd.school.jw.arrangecourse.service.JwFuncroomcourseService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: JwFuncroomcourseServiceImpl Function: ADD FUNCTION. Reason: ADD
 * REASON(可选). Description: 排课课程表(JW_T_FUNCROOMCOURSE)实体Service接口实现类. date:
 * 2017-03-06
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class JwFuncroomcourseServiceImpl extends BaseServiceImpl<JwFuncroomcourse> implements JwFuncroomcourseService {

	@Resource
	public void setJwFuncroomcourseDao(JwFuncroomcourseDao dao) {
		this.dao = dao;
	}

	private static Logger logger = Logger.getLogger(JwFuncroomcourseServiceImpl.class);

	@Override
	public QueryResult<JwFuncroomcourse> list(Integer start, Integer limit, String sort, String filter,
			Boolean isDelete) {
		QueryResult<JwFuncroomcourse> qResult = this.queryPageResult(start, limit, sort, filter, isDelete);
		return qResult;
	}

	/**
	 * 根据主键逻辑删除数据
	 * 
	 * @param ids
	 *            要删除数据的主键
	 * @param currentUser
	 *            当前操作的用户
	 * @return 操作成功返回true，否则返回false
	 */
	@Override
	public Boolean doLogicDeleteByIds(String ids, SysUser currentUser) {
		Boolean delResult = false;
		try {
			Object[] conditionValue = ids.split(",");
			String[] propertyName = { "isDelete", "updateUser", "updateTime" };
			Object[] propertyValue = { 1, currentUser.getXm(), new Date() };
			this.updateByProperties("uuid", conditionValue, propertyName, propertyValue);
			delResult = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
			delResult = false;
		}
		return delResult;
	}

	/**
	 * 根据传入的实体对象更新数据库中相应的数据
	 * 
	 * @param entity
	 *            传入的要更新的实体对象
	 * @param currentUser
	 *            当前操作用户
	 * @return
	 */
	@Override
	public JwFuncroomcourse doUpdateEntity(JwFuncroomcourse entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		JwFuncroomcourse saveEntity = this.get(entity.getUuid());
		try {
			BeanUtils.copyProperties(saveEntity, entity);
			saveEntity.setUpdateTime(new Date()); // 设置修改时间
			saveEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(saveEntity);// 执行修改方法

			return entity;
		} catch (IllegalAccessException e) {
			logger.error(e.getMessage());
			return null;
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage());
			return null;
		}
	}

	/**
	 * 将传入的实体对象持久化到数据
	 * 
	 * @param entity
	 *            传入的要更新的实体对象
	 * @param currentUser
	 *            当前操作用户
	 * @return
	 */
	@Override
	public JwFuncroomcourse doAddEntity(JwFuncroomcourse entity, SysUser currentUser) {
		JwFuncroomcourse saveEntity;
		try {
			// List<String> excludedProp = new ArrayList<>();
			// excludedProp.add("uuid");
			// BeanUtils.copyProperties(saveEntity, entity,excludedProp);
			// saveEntity.setCreateUser(currentUser.getXm()); // 设置修改人的中文名
			// entity = this.merge(saveEntity);// 执行修改方法
			String[] propName = { "funcRoomId", "teachTime", "isDelete" };
			Object[] propValue = { entity.getFuncRoomId(), entity.getTeachTime(), 0 };
			saveEntity = this.getByProerties(propName, propValue);

			if (saveEntity == null) {
				saveEntity = new JwFuncroomcourse();
			}
			BeanUtils.copyPropertiesExceptNullAndStringEmpty(saveEntity, entity);
			saveEntity.setCreateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(saveEntity);// 执行修改方法
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
	public Integer doAddEntityList(List<JwFuncroomcourse> funcRoomCourseList, SysUser currentUser) throws IllegalAccessException, InvocationTargetException {
		Integer count=0;
		
		JwFuncroomcourse saveEntity;
		for(int i=0;i<funcRoomCourseList.size();i++){
			
			JwFuncroomcourse entity=funcRoomCourseList.get(i);
			
			String[] propName = { "funcRoomId", "teachTime", "isDelete" };
			Object[] propValue = { entity.getFuncRoomId(), entity.getTeachTime(), 0 };
			saveEntity = this.getByProerties(propName, propValue);

			if (saveEntity == null) {
				saveEntity = new JwFuncroomcourse();
			}else{
				entity.setUuid(null);
			}			
			BeanUtils.copyPropertiesExceptNullAndStringEmpty(saveEntity, entity);
			saveEntity.setCreateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(saveEntity);// 执行修改方法
			
			count++;
		}
		return count;
		
	}
}
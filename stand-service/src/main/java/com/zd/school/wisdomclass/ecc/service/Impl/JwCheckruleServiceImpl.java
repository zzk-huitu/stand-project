package com.zd.school.wisdomclass.ecc.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.jw.ecc.model.JwCheckrule;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.wisdomclass.ecc.dao.JwCheckruleDao;
import com.zd.school.wisdomclass.ecc.service.JwCheckruleService;

/**
 * 
 * ClassName: JwCheckruleServiceImpl
 * Function:  ADD FUNCTION. 
 * Reason:  ADD REASON(可选). 
 * Description: 课程考勤规则(JW_T_CHECKRULE)实体Service接口实现类.
 * date: 2017-05-10
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class JwCheckruleServiceImpl extends BaseServiceImpl<JwCheckrule> implements JwCheckruleService{

    @Resource
    public void setJwCheckruleDao(JwCheckruleDao dao) {
        this.dao = dao;
    }
	private static Logger logger = Logger.getLogger(JwCheckruleServiceImpl.class);
	
	@Override
	public QueryResult<JwCheckrule> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete) {
        QueryResult<JwCheckrule> qResult = this.queryPageResult(start, limit, sort, filter, isDelete);
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
	public JwCheckrule doUpdateEntity(JwCheckrule entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		JwCheckrule saveEntity = this.get(entity.getUuid());
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
	public JwCheckrule doAddEntity(JwCheckrule entity, SysUser currentUser) {
		JwCheckrule saveEntity = new JwCheckrule();
		try {
			List<String> excludedProp = new ArrayList<>();
			excludedProp.add("uuid");
			BeanUtils.copyProperties(saveEntity, entity,excludedProp);
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
	public Boolean doUsingOrno(String ids, String usingStatu,SysUser currentUser) {
		String conditionName = "uuid";
		String[] propertyName = {"startUsing","updateUser","updateTime"};
		Object[] properyValue = {0,currentUser.getUuid(),new Date()};
		try {
			//设置为启用，要将其它的启用的了设置为未启用
			if ("using".equals(usingStatu)){
				this.updateByProperties("startUsing",1,propertyName,properyValue);
				properyValue[0] = 1;
			}
			this.updateByProperties(conditionName,ids,propertyName,properyValue);
			return  true;
		} catch (Exception e){
			logger.error(e.getMessage());
			return false;
		}
	}
}
package com.zd.school.oa.attendance.service.Impl;

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
import com.zd.school.oa.attendance.dao.AttTitleDao ;
import com.zd.school.oa.attendance.model.AttTerm;
import com.zd.school.oa.attendance.model.AttTitle ;
import com.zd.school.oa.attendance.model.AttUser;
import com.zd.school.oa.attendance.service.AttTermService;
import com.zd.school.oa.attendance.service.AttTimeService;
import com.zd.school.oa.attendance.service.AttTitleService ;
import com.zd.school.oa.attendance.service.AttUserService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: AttTitleServiceImpl
 * Function:  ADD FUNCTION. 
 * Reason:  ADD REASON(可选). 
 * Description: 考勤主题(ATT_T_TITLE)实体Service接口实现类.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class AttTitleServiceImpl extends BaseServiceImpl<AttTitle> implements AttTitleService{

	@Resource
	AttUserService attUserService;
	@Resource
	AttTermService attTermService;
	@Resource
	AttTimeService attTimeService;
    @Resource
    public void setAttTitleDao(AttTitleDao dao) {
        this.dao = dao;
    }
	private static Logger logger = Logger.getLogger(AttTitleServiceImpl.class);
	
	@Override
	public QueryResult<AttTitle> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete) {
        QueryResult<AttTitle> qResult = this.queryPageResult(start, limit, sort, filter, isDelete);
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
			attTermService.updateByProperties("titleId", conditionValue, propertyName, propertyValue);
			attTermService.updateByProperties("titleId", conditionValue, propertyName, propertyValue);
			attUserService.updateByProperties("titleId", conditionValue, propertyName, propertyValue);
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
	public AttTitle doUpdateEntity(AttTitle entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		AttTitle saveEntity = this.get(entity.getUuid());
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
	public AttTitle doAddEntity(AttTitle entity, SysUser currentUser) {
		AttTitle saveEntity = new AttTitle();
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
	public Integer doAddUsers(String titleId, String[] userIds, String[] userNames, String[] userNumbs, String xm) {
		Integer count=0;
	
		for (int i = 0; i < userIds.length; i++) {
			AttUser attUser = new AttUser();
			attUser.setTitleId(titleId);
			attUser.setUserId(userIds[i]);
			attUser.setXm(userNames[i]);
			attUser.setXh(userNumbs[i]);

			attUser.setCreateUser(xm);
			attUser.setCreateTime(new Date());

			attUserService.merge(attUser);
			count++;
		}
		
		return count;	
	}
	
	@Override
	public Integer doAddTerms(String titleId,  String[] termCodes,String[] roomIds, String[] roomNames, String xm) {
		Integer count=0;
		
		for (int i = 0; i < termCodes.length; i++) {
			AttTerm attTerm = new AttTerm();
			attTerm.setTitleId(titleId);
			attTerm.setTermCode(termCodes[i]);
			attTerm.setRoomId(roomIds[i]);
			attTerm.setRoomName(roomNames[i]);

			attTerm.setCreateUser(xm);
			attTerm.setCreateTime(new Date());

			attTermService.merge(attTerm);
			count++;
		}
		
		return count;
		
	}
}
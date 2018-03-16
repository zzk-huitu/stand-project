package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.jw.eduresources.model.JwCalender ;
import com.zd.school.jw.eduresources.model.JwCalenderdetail;
import com.zd.school.jw.eduresources.model.JwTGrade;
import com.zd.school.plartform.baseset.dao.BaseCalenderDao;
import com.zd.school.plartform.baseset.service.BaseCalenderService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: JwCalenderServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 校历信息(JW_T_CALENDER)实体Service接口实现类.
 * date: 2016-08-30
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseCalenderServiceImpl extends BaseServiceImpl<JwCalender> implements BaseCalenderService{

    @Resource
    public void setJwCalenderDao(BaseCalenderDao dao) {
        this.dao = dao;
    }
    private static Logger logger = Logger.getLogger(BaseCalenderServiceImpl.class);
    
	@Override
	public JwCalender  findJwTcanderByClaiId(JwTGrade  jtg) {
		if(jtg == null)
    		return null;
    	if(jtg.getSectionCode() == null || jtg.getSectionCode().trim().equals(""))
    		return null;
    	 return this.dao.getByProerties("sectionCode", jtg.getSectionCode());
	}

	@Override
	public int updateStatu(String calenderIds,String campusNames) {
		// TODO Auto-generated method stub
		try{
			String hql1="update JwCalender set activityState=0 where isDelete=0 and activityState=1 and campusName in('"+campusNames.replace(",","','")+"')";	//弃用
			String hql2="update JwCalender set activityState=1 where uuid in('"+calenderIds.replace(",", "','")+"')";//1：启用
			this.doExecuteCountByHql(hql1);
			this.doExecuteCountByHql(hql2);
			return 1;
		}catch(Exception e){
			return 0;
		}		     
	}

	@Override
	public JwCalender doUpdateEntity(JwCalender entity, SysUser currentUser) {

		JwCalender perEntity = this.get(entity.getUuid());

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
	public JwCalender doAddEntity(JwCalender entity, SysUser currentUser) {
		JwCalender saveEntity = new JwCalender();
		try {
			BeanUtils.copyPropertiesExceptNull(entity, saveEntity);

			// 生成默认的orderindex
			// 如果界面有了排序号的输入，则不需要取默认的了
			Integer orderIndex = this.getDefaultOrderIndex(entity);
			entity.setOrderIndex(orderIndex);// 排序

			// 增加时要设置创建人
			entity.setCreateUser(currentUser.getXm()); // 创建人

			entity.setActivityState(0);

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

	@Override
	public Boolean doDeleteEntity(String delIds) {
		Boolean delResult = false;
		try{
			String doIds = "'" + delIds.replace(",", "','") + "'";
			String hql = "DELETE FROM JwCalenderdetail j  WHERE j.canderId IN (" + doIds + ")";
			this.doExecuteCountByHql(hql);

			hql = "DELETE FROM JwCalender j  WHERE j.uuid IN (" + doIds + ")";
			this.doExecuteCountByHql(hql);
			delResult = true;
		}catch(Exception e){
			logger.error(e.getMessage());
			delResult = false;
		}
		
		return delResult;
	}

	
}
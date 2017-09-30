package com.zd.school.plartform.system.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.system.dao.SysJobDao;
import com.zd.school.plartform.system.service.SysJobService;

/**
 * 
 * ClassName: BizTJobServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 岗位信息实体Service接口实现类.
 * date: 2016-05-16
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
//@Transactional
public class SysJobServiceImpl extends BaseServiceImpl<BaseJob> implements SysJobService{

    @Resource
    public void setBizTJobDao(SysJobDao dao) {
        this.dao = dao;
    }

	@Override
	public BaseJob doUpdate(BaseJob entity, String xm) {
		// TODO Auto-generated method stub		
		BaseJob saveEntity = this.get(entity.getUuid());
		String oldJobName=saveEntity.getJobName();
		try {
			BeanUtils.copyPropertiesExceptNull(saveEntity, entity);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
				
		saveEntity.setUpdateTime( new Date());
		saveEntity.setUpdateUser( xm);
		entity = this.merge(saveEntity);// 执行修改方法
		
		if(!oldJobName.equals(entity.getJobName())){
			//在更新部门岗位表的岗位名称数据
			String updateHql1="update BaseDeptjob a set a.jobName='"+entity.getJobName()+"' where a.jobId='"+entity.getUuid()+"'";
			String updateHql2="update BaseDeptjob a set a.parentjobName='"+entity.getJobName()+"' where a.parentjobId='"+entity.getUuid()+"'";
			this.doExecuteCountByHql(updateHql1);
			this.doExecuteCountByHql(updateHql2);
		}
		
		return entity;
		
	}

}
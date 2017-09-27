package com.zd.school.plartform.baseset.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.BuildOfficeDefine ;
import com.zd.school.plartform.baseset.dao.BaseOfficeDefineDao;
import com.zd.school.plartform.baseset.service.BaseOfficeDefineService;

/**
 * 
 * ClassName: BuildOfficeServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 办公室信息实体Service接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseOfficeDefineServiceImpl extends BaseServiceImpl<BuildOfficeDefine> implements BaseOfficeDefineService{
	 @Resource
	    public void setBuildLaboratorydefinDao(BaseOfficeDefineDao dao) {
	        this.dao = dao;
	    }
}
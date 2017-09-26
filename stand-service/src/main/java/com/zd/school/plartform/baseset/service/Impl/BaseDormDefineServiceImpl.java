package com.zd.school.plartform.baseset.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.plartform.baseset.dao.BaseDormDefineDao;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;

/**
 * 
 * ClassName: BuildOfficeServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 宿舍定义Service接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseDormDefineServiceImpl extends BaseServiceImpl<BuildDormDefine> implements BaseDormDefineService{
	 @Resource
	    public void setBuildLaboratorydefinDao(BaseDormDefineDao dao) {
	        this.dao = dao;
	    }
}
package com.zd.school.plartform.system.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zd.core.service.BaseServiceImpl;
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

}
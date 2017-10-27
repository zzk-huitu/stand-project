package com.zd.school.plartform.baseset.service.Impl;


import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.plartform.baseset.dao.BaseClassDormAllotDao;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;

/**
 * 
 * ClassName: JwClassdormServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 班级宿舍(JW_T_CLASSDORM)实体Service接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseClassDormAllotServiceImpl extends BaseServiceImpl<JwClassDormAllot> implements BaseClassDormAllotService{

    @Resource
    public void setJwClassdormDao(BaseClassDormAllotDao dao) {
        this.dao = dao;
    }

}
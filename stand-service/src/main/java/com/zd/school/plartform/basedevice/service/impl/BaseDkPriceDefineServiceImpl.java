package com.zd.school.plartform.basedevice.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.DkPriceDefine;
import com.zd.school.plartform.basedevice.dao.BaseDkPriceDefineDao;
import com.zd.school.plartform.basedevice.service.BaseDkPriceDefineService;

/**
 * 电控费率定义
 * @author hucy
 *
 */
@Service
@Transactional
public class BaseDkPriceDefineServiceImpl extends BaseServiceImpl<DkPriceDefine> implements BaseDkPriceDefineService{

    @Resource
    public void setDkPriceDefineDao(BaseDkPriceDefineDao dao) {
        this.dao = dao;
    }

}
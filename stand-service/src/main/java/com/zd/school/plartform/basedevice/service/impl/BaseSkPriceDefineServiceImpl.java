package com.zd.school.plartform.basedevice.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.SkPriceDefine;
import com.zd.school.plartform.basedevice.dao.BaseSkPriceDefineDao;
import com.zd.school.plartform.basedevice.service.BaseSkPriceDefineService;

/**
 * 水控费率定义
 * @author hucy
 *
 */
@Service
@Transactional
public class BaseSkPriceDefineServiceImpl extends BaseServiceImpl<SkPriceDefine> implements BaseSkPriceDefineService{

    @Resource
    public void setSkPriceDefineDao(BaseSkPriceDefineDao dao) {
        this.dao = dao;
    }

}
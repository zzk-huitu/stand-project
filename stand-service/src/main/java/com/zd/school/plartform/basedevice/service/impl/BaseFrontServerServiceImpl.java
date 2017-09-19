package com.zd.school.plartform.basedevice.service.impl;


import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.SysFrontServer;
import com.zd.school.plartform.basedevice.dao.BaseFrontServerDao;
import com.zd.school.plartform.basedevice.service.BaseFrontServerService;

/**
 * 综合前置管理
 * @author hucy
 *
 */
@Service
@Transactional
public class BaseFrontServerServiceImpl extends BaseServiceImpl<SysFrontServer> implements BaseFrontServerService{

    @Resource
    public void setSysFrontServerDao(BaseFrontServerDao dao) {
        this.dao = dao;
    }

}
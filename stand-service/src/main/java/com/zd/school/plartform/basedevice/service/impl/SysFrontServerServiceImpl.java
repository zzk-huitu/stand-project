package com.zd.school.plartform.basedevice.service.impl;


import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.SysFrontServer;
import com.zd.school.plartform.basedevice.dao.SysFrontServerDao;
import com.zd.school.plartform.basedevice.service.SysFrontServerService;

/**
 * 综合前置管理
 * @author hucy
 *
 */
@Service
@Transactional
public class SysFrontServerServiceImpl extends BaseServiceImpl<SysFrontServer> implements SysFrontServerService{

    @Resource
    public void setSysFrontServerDao(SysFrontServerDao dao) {
        this.dao = dao;
    }

}
package com.zd.school.plartform.basedevice.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.plartform.basedevice.dao.BaseGatewayDao;
import com.zd.school.plartform.basedevice.service.BaseGatewayService;

/**
 * 网关表
 * @author hucy
 *
 */
@Service
@Transactional
public class BaseGatewayServiceImpl extends BaseServiceImpl<PtGateway> implements BaseGatewayService{
	
	@Resource
    public void setBaseGatewayDao(BaseGatewayDao dao) {
        this.dao = dao;
    }
}

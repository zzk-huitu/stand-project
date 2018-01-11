package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.plartform.basedevice.dao.BaseGatewayDao;

/**
 * 网关表
 * @author hucy
 *
 */
@Repository
public class BaseGatewayDaoImpl extends BaseDaoImpl<PtGateway> implements BaseGatewayDao{
	
	public BaseGatewayDaoImpl() {
		super(PtGateway.class);
	}

}

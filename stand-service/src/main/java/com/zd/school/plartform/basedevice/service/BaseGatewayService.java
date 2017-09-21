package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 网关表
 * @author hucy
 *
 */
public interface BaseGatewayService extends BaseService<PtGateway>{
	public PtGateway doUpdateEntity(PtGateway entity, SysUser currentUser);
	public PtGateway doAddEntity(PtGateway entity, SysUser currentUser);
}

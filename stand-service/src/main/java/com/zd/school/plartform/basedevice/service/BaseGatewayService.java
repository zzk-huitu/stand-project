package com.zd.school.plartform.basedevice.service;

import javax.servlet.http.HttpServletRequest;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.control.device.model.TLVModel;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 网关表
 * @author hucy
 *
 */
public interface BaseGatewayService extends BaseService<PtGateway>{
	public PtGateway doUpdateEntity(PtGateway entity, SysUser currentUser);
	public PtGateway doAddEntity(PtGateway entity, SysUser currentUser);
	public void doSetGatewayParam(HttpServletRequest request, TLVModel tlvs, String userCh);
	public void doUpdateBaseHighParam(TLVModel tlvs, String xm);
	public void doUpdateBaseHighParamToIds(TLVModel tlvs, String gatewayIds, String xm);
	public void doUpdateBaseHighParamToAll(TLVModel tlvs, String xm);
	public void doUpdateBatchFront(PtGateway entity, String xm);
}

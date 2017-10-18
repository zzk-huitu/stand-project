package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.SkPriceDefine;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.plartform.system.model.SysUser;


/**
 * 水控费率定义
 * @author hucy
 *
 */
public interface BaseSkPriceDefineService extends BaseService<SkPriceDefine> {

	public SkPriceDefine doAddEntity(SkPriceDefine entity, SysUser currentUser);
	public SkPriceDefine doUpdateEntity(SkPriceDefine entity, SysUser currentUser);
	
}
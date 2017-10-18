package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.DkPriceDefine;
import com.zd.school.control.device.model.PtSkMeter;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 水控流量计表
 * @author hucy
 *
 */
public interface BasePtSkMeterService extends BaseService<PtSkMeter>{
	public PtSkMeter doAddEntity(PtSkMeter entity, SysUser currentUser);
	public PtSkMeter doUpdateEntity(PtSkMeter entity, SysUser currentUser);
}

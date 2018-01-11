package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.define.model.DkPriceDefine;
import com.zd.school.plartform.system.model.SysUser;


/**
 * 电控费率定义
 * @author hucy
 *
 */
public interface BaseDkPriceDefineService extends BaseService<DkPriceDefine> {
	public DkPriceDefine doAddEntity(DkPriceDefine entity, SysUser currentUser);
	public DkPriceDefine doUpdateEntity(DkPriceDefine entity, SysUser currentUser);
}
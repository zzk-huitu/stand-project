package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtPriceBind;

/**
 * 水控、电控费率绑定表
 * @author hucy
 *
 */
public interface PtPriceBindService extends BaseService<PtPriceBind>{

	void doPriceBind(String[] termId, String[] termSn, String meterId,String xm);

}

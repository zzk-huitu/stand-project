package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtSkMeterbind;

/**
 * 水控流量记表绑定
 *
 *
 */
public interface PtSkMeterbindService extends BaseService<PtSkMeterbind>{
	void doMeterBind(String[] termId, String[] termSn, String meterId,String xm);
}

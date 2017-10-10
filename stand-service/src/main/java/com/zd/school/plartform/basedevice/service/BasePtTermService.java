package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtTerm;

/**
 * 设备表
 * @author hucy
 *
 */
public interface BasePtTermService extends BaseService<PtTerm>{



	void batchUpdate(int termTypeID, String areaType, String areaType2, String[] strings, Object[] objects);

}

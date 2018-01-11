package com.zd.school.plartform.basedevice.service;

import java.util.Map;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtTermBags;

/**
 * 设备钱包
 * @author hucy
 *
 */
public interface PtTermBagsService extends BaseService<PtTermBags>{


	QueryResult<Map> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete,
			String roomId);

}

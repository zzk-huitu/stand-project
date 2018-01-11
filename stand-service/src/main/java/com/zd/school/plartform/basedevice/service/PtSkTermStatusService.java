package com.zd.school.plartform.basedevice.service;

import com.zd.core.dao.BaseDao;
import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtSkTermStatus;


public interface PtSkTermStatusService extends BaseService<PtSkTermStatus> {

	BaseDao<PtSkTermStatus> getDao();

}
package com.zd.school.plartform.basedevice.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.dao.BaseDao;
import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.plartform.basedevice.dao.PtSkTermStatusDao;
import com.zd.school.plartform.basedevice.service.PtSkTermStatusService;

@Service
@Transactional
public class PtSkTermStatusServiceImpl extends BaseServiceImpl<PtSkTermStatus> implements PtSkTermStatusService{

    @Resource
    public void setPtSkTermStatusDao(PtSkTermStatusDao dao) {
        this.dao = dao;
    }

	@Override
	public BaseDao<PtSkTermStatus> getDao() {
		// TODO Auto-generated method stub
		return  this.dao;
	}

}
package com.zd.school.plartform.basedevice.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtPriceBind;
import com.zd.school.plartform.basedevice.dao.PtPriceBindDao;
import com.zd.school.plartform.basedevice.service.PtPriceBindService;

/**
 * 水控、电控费率绑定表
 * @author hucy
 *
 */
@Service
@Transactional
public class PtPriceBindServiceImpl extends BaseServiceImpl<PtPriceBind> implements PtPriceBindService{
	
	@Resource
    public void setPtPriceBindDao(PtPriceBindDao dao) {
        this.dao = dao;
    }
}

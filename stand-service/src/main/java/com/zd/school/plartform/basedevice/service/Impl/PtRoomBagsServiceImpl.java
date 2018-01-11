package com.zd.school.plartform.basedevice.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtRoomBags;
import com.zd.school.plartform.basedevice.dao.PtRoomBagsDao;
import com.zd.school.plartform.basedevice.service.PtRoomBagsService;

/**
 * 宿舍钱包
 * @author hucy
 *
 */
@Service
@Transactional
public class PtRoomBagsServiceImpl extends BaseServiceImpl<PtRoomBags> implements PtRoomBagsService{
	
	@Resource
    public void setPtRoomBagsDao(PtRoomBagsDao dao) {
        this.dao = dao;
    }
}

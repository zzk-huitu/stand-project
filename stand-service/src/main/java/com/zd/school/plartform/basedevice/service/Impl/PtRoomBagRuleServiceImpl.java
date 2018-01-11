package com.zd.school.plartform.basedevice.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtRoomBagRule;
import com.zd.school.plartform.basedevice.dao.PtRoomBagRuleDao;
import com.zd.school.plartform.basedevice.service.PtRoomBagRuleService;

@Service
@Transactional
public class PtRoomBagRuleServiceImpl extends BaseServiceImpl<PtRoomBagRule> implements PtRoomBagRuleService{
	
	@Resource
    public void setPtRoomBagRuleDao(PtRoomBagRuleDao dao) {
        this.dao = dao;
    }
}

package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtRoomBagRule;
import com.zd.school.plartform.basedevice.dao.PtRoomBagRuleDao;

/**
 * 房间钱包规则
 * @author hucy
 *
 */
@Repository
public class PtRoomBagRuleDaoImpl extends BaseDaoImpl<PtRoomBagRule> implements PtRoomBagRuleDao{
	
	public PtRoomBagRuleDaoImpl() {
		super(PtRoomBagRule.class);
	}

}

package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtRoomBagsRuleBind;

/**
 * 钱包规则绑定
 * @author hucy
 *
 */
public interface PtRoomBagsRuleBindService extends BaseService<PtRoomBagsRuleBind>{

	public void doAddRuleBind(String roomRuleId, String roomIds, String deductionUserIds,
			String deductionRoomIds, String xm);

}

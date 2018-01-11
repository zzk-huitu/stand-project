package com.zd.school.plartform.basedevice.service.Impl;

import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtRoomBagsRuleBind;
import com.zd.school.plartform.basedevice.dao.PtRoomBagsRuleBindDao;
import com.zd.school.plartform.basedevice.service.PtRoomBagsRuleBindService;

/**
 * 钱包规则绑定
 * @author hucy
 *
 */
@Service
@Transactional
public class PtRoomBagsRuleBindServiceImpl extends BaseServiceImpl<PtRoomBagsRuleBind> implements PtRoomBagsRuleBindService{
	
	@Resource
    public void setPtRoomBagsRuleBindDao(PtRoomBagsRuleBindDao dao) {
        this.dao = dao;
    }

	@Override
	public void doAddRuleBind(String roomRuleId, String roomIds, String deductionUserIds,
			String deductionRoomIds, String xm) {
		// TODO Auto-generated method stub
		
		String rooms[]=roomIds.split(",");
		
		String deductionUsers[]=null;
		if(StringUtils.isNotEmpty(deductionUserIds))
			deductionUsers=deductionUserIds.split(",");
		
		String deductionRooms[]=null;
		if(StringUtils.isNotEmpty(deductionRoomIds))
			deductionRooms=deductionRoomIds.split(",");
		
		PtRoomBagsRuleBind perEntity = null;
		String getDeductionUserId=null;
		
		for(int i=0;i<rooms.length;i++){
			getDeductionUserId=null;
			//找到扣费人员
			if(deductionRooms!=null)
				for(int j=0;j<deductionRooms.length;j++){
					if(rooms[i].equals(deductionRooms[j])){
						getDeductionUserId=deductionUsers[j];
						break;
					}
				}
			
			//入库
			perEntity = this.getByProerties("roomId", rooms[i]);
			if (perEntity != null) {			
				perEntity.setDeductionUserId(getDeductionUserId);
				perEntity.setRoomRuleId(roomRuleId);
				perEntity.setUpdateTime(new Date());
				perEntity.setCreateUser(xm);
				perEntity.setIsDelete(0);
			} else {
				Integer orderIndex = this.getDefaultOrderIndex(new PtRoomBagsRuleBind());
				perEntity = new PtRoomBagsRuleBind();
				perEntity.setDeductionUserId(getDeductionUserId);
				perEntity.setRoomRuleId(roomRuleId);
				perEntity.setRoomId(rooms[i]);
				perEntity.setOrderIndex(orderIndex);
				perEntity.setUpdateTime(new Date());
				perEntity.setCreateUser(xm);
			}

			this.merge(perEntity);		
		}
	}
}

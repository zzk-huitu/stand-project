package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtRoomBags;
import com.zd.school.plartform.basedevice.dao.PtRoomBagsDao;

/**
 * 宿舍钱包
 * @author hucy
 *
 */
@Repository
public class PtRoomBagsDaoImpl extends BaseDaoImpl<PtRoomBags> implements PtRoomBagsDao{
	
	public PtRoomBagsDaoImpl() {
		super(PtRoomBags.class);
	}

}

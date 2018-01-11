package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtTermBags;
import com.zd.school.plartform.basedevice.dao.PtTermBagsDao;

/**
 * 设备钱包
 * @author hucy
 *
 */
@Repository
public class PtTermBagsDaoImpl extends BaseDaoImpl<PtTermBags> implements PtTermBagsDao{
	
	public PtTermBagsDaoImpl() {
		super(PtTermBags.class);
	}

}

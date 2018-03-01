package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtSkMeterbind;
import com.zd.school.plartform.basedevice.dao.PtSkMeterbindDao;

/**
 * 水控流量记表绑定
 
 *
 */
@Repository
public class PtSkMeterbindDaoImpl extends BaseDaoImpl<PtSkMeterbind> implements PtSkMeterbindDao{
	
	public PtSkMeterbindDaoImpl() {
		super(PtSkMeterbind.class);
	}

}

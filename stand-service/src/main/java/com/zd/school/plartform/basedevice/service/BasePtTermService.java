package com.zd.school.plartform.basedevice.service;

import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 设备表
 * @author hucy
 *
 */
public interface BasePtTermService extends BaseService<PtTerm>{

	public PtTerm doAddEntity(PtTerm entity, SysUser currentUser);
	
	void batchUpdate(int termTypeID, String areaType, String areaType2, String[] strings, Object[] objects);

	public PtTerm doUpdateEntity(PtTerm entity, SysUser currentUser);
	
}

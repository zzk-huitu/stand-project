package com.zd.school.plartform.basedevice.service.Impl;

import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtPriceBind;
import com.zd.school.control.device.model.PtSkMeterbind;
import com.zd.school.plartform.basedevice.dao.PtSkMeterbindDao;
import com.zd.school.plartform.basedevice.service.PtSkMeterbindService;
@Service
@Transactional
public class PtSkMeterbindServiceImpl  extends BaseServiceImpl<PtSkMeterbind> implements PtSkMeterbindService{
	
	@Resource
    public void setPtSkMeterbindDao(PtSkMeterbindDao dao) {
        this.dao = dao;
    }

	@Override
	public void doMeterBind(String[] termId, String[] termSn, String meterId, String xm) {
		Date date=new Date();
		PtSkMeterbind perEntity = null;
		for (int i = 0; i < termId.length; i++) {
			perEntity = this.getByProerties("termId",termId[i]);
			if (perEntity != null) {
				perEntity.setMeterId(meterId);
				perEntity.setUpdateTime(new Date());
				perEntity.setUpdateUser(xm);
				this.merge(perEntity);
			} else {
				perEntity = new PtSkMeterbind();
				perEntity.setMeterId(meterId);
				perEntity.setTermId(termId[i]);
				perEntity.setTermSn(termSn[i]);
				perEntity.setCreateUser(xm);
				perEntity.setCreateTime(date);
				this.merge(perEntity);
			}
		}
	}

}

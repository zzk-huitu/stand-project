package com.zd.school.plartform.basedevice.service.Impl;

import java.util.Date;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtPriceBind;
import com.zd.school.plartform.basedevice.dao.PtPriceBindDao;
import com.zd.school.plartform.basedevice.service.PtPriceBindService;

/**
 * 水控、电控费率绑定表
 * @author hucy
 *
 */
@Service
@Transactional
public class PtPriceBindServiceImpl extends BaseServiceImpl<PtPriceBind> implements PtPriceBindService{
	
	@Resource
    public void setPtPriceBindDao(PtPriceBindDao dao) {
        this.dao = dao;
    }

	@Override
	public void doPriceBind(String[] termId, String[] termSn, String meterId,String xm) {
		// TODO Auto-generated method stub
		
		Date date=new Date();
		PtPriceBind perEntity = null;
		for (int i = 0; i < termId.length; i++) {
			perEntity = this.getByProerties("termId",termId[i]);
			if (perEntity != null) {
				perEntity.setPriceId(meterId);
				perEntity.setUpdateTime(date);
				perEntity.setUpdateUser(xm);
				this.merge(perEntity);
			} else {
				perEntity = new PtPriceBind();
				perEntity.setPriceId(meterId);
				perEntity.setTermId(termId[i]);
				perEntity.setTermSn(termSn[i]);
				perEntity.setCreateUser(xm);
				perEntity.setCreateTime(date);
				this.merge(perEntity);
			}
		}
	}
}

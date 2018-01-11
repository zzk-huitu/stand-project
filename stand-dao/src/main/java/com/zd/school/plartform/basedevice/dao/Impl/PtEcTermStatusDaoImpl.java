package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtEcTermStatus;
import com.zd.school.plartform.basedevice.dao.PtEcTermStatusDao;


@Repository
public class PtEcTermStatusDaoImpl extends BaseDaoImpl<PtEcTermStatus> implements PtEcTermStatusDao {
    public PtEcTermStatusDaoImpl() {
        super(PtEcTermStatus.class);
        // TODO Auto-generated constructor stub
    }
}
package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.plartform.basedevice.dao.PtSkTermStatusDao;


@Repository
public class PtSkTermStatusDaoImpl extends BaseDaoImpl<PtSkTermStatus> implements PtSkTermStatusDao {
    public PtSkTermStatusDaoImpl() {
        super(PtSkTermStatus.class);
        // TODO Auto-generated constructor stub
    }
}
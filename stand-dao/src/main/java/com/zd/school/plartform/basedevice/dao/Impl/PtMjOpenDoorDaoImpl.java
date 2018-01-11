package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtMjOpenDoor;
import com.zd.school.plartform.basedevice.dao.PtMjOpenDoorDao;


@Repository
public class PtMjOpenDoorDaoImpl extends BaseDaoImpl<PtMjOpenDoor> implements PtMjOpenDoorDao {
    public PtMjOpenDoorDaoImpl() {
        super(PtMjOpenDoor.class);
        // TODO Auto-generated constructor stub
    }
}
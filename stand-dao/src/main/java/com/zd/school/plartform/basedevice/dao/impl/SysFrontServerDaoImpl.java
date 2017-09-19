package com.zd.school.plartform.basedevice.dao.impl;



import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.define.model.SysFrontServer;
import com.zd.school.plartform.basedevice.dao.SysFrontServerDao;


/**
 * 综合前置服务器管理
 * @author hucy
 *
 */
@Repository
public class SysFrontServerDaoImpl extends BaseDaoImpl<SysFrontServer> implements SysFrontServerDao {
    public SysFrontServerDaoImpl() {
        super(SysFrontServer.class);
        // TODO Auto-generated constructor stub
    }
}
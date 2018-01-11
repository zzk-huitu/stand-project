package com.zd.school.plartform.basedevice.dao.Impl;



import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.define.model.SysFrontServer;
import com.zd.school.plartform.basedevice.dao.BaseFrontServerDao;


/**
 * 综合前置服务器管理
 * @author hucy
 *
 */
@Repository
public class BaseFrontServerDaoImpl extends BaseDaoImpl<SysFrontServer> implements BaseFrontServerDao {
    public BaseFrontServerDaoImpl() {
        super(SysFrontServer.class);
        // TODO Auto-generated constructor stub
    }
}
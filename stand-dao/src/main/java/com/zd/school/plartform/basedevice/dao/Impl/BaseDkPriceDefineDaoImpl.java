package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.define.model.DkPriceDefine;
import com.zd.school.plartform.basedevice.dao.BaseDkPriceDefineDao;


/**
 * 电控费率定义
 * @author hucy
 *
 */
@Repository
public class BaseDkPriceDefineDaoImpl extends BaseDaoImpl<DkPriceDefine> implements BaseDkPriceDefineDao {
    public BaseDkPriceDefineDaoImpl() {
        super(DkPriceDefine.class);
        // TODO Auto-generated constructor stub
    }
}
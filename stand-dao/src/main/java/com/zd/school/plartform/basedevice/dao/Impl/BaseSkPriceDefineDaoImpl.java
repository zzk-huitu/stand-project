package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.define.model.SkPriceDefine;
import com.zd.school.plartform.basedevice.dao.BaseSkPriceDefineDao;


/**
 * 水控费率定义
 * @author hucy
 *
 */
@Repository
public class BaseSkPriceDefineDaoImpl extends BaseDaoImpl<SkPriceDefine> implements BaseSkPriceDefineDao {
    public BaseSkPriceDefineDaoImpl() {
        super(SkPriceDefine.class);
        // TODO Auto-generated constructor stub
    }
}
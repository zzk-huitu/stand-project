package com.zd.school.plartform.baseset.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.allot.model.JwOfficeAllot;
import com.zd.school.plartform.baseset.dao.BaseOfficeAllotDao;


/**
 * 
 * ClassName: JwOfficeallotDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: JW_T_OFFICEALLOT实体Dao接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class BaseOfficeAllotDaoImpl extends BaseDaoImpl<JwOfficeAllot> implements BaseOfficeAllotDao{
    public BaseOfficeAllotDaoImpl() {
        super(JwOfficeAllot.class);
        // TODO Auto-generated constructor stub
    }
}
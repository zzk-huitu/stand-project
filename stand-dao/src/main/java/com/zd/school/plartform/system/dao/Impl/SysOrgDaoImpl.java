package com.zd.school.plartform.system.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.plartform.baseset.model.BaseOrg ;
import com.zd.school.plartform.system.dao.SysOrgDao;


/**
 * 
 * ClassName: BaseOrgDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: BASE_T_ORG实体Dao接口实现类.
 * date: 2016-07-26
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class SysOrgDaoImpl extends BaseDaoImpl<BaseOrg> implements SysOrgDao {
    public SysOrgDaoImpl() {
        super(BaseOrg.class);
        // TODO Auto-generated constructor stub
    }
}
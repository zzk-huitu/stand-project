package com.zd.school.plartform.system.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.system.dao.SysJobDao;

/**
 * 
 * ClassName: BizTJobDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 岗位信息实体Dao接口实现类.
 * date: 2016-05-16
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class SysJobDaoImpl extends BaseDaoImpl<BaseJob> implements SysJobDao {
    public SysJobDaoImpl() {
        super(BaseJob.class);
        // TODO Auto-generated constructor stub
    }
}
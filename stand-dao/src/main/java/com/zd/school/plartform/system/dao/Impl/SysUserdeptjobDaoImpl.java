package com.zd.school.plartform.system.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.plartform.baseset.model.BaseUserdeptjob ;
import com.zd.school.plartform.system.dao.SysUserdeptjobDao;


/**
 * 
 * ClassName: BaseUserdeptjobDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 用户部门岗位(BASE_T_USERDEPTJOB)实体Dao接口实现类.
 * date: 2017-03-27
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class SysUserdeptjobDaoImpl extends BaseDaoImpl<BaseUserdeptjob> implements SysUserdeptjobDao {
    public SysUserdeptjobDaoImpl() {
        super(BaseUserdeptjob.class);
        // TODO Auto-generated constructor stub
    }
}
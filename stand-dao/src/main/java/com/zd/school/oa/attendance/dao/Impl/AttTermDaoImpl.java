package com.zd.school.oa.attendance.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.oa.attendance.dao.AttTermDao ;
import com.zd.school.oa.attendance.model.AttTerm ;


/**
 * 
 * ClassName: AttTermDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 考勤机具(ATT_T_TERM)实体Dao接口实现类.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class AttTermDaoImpl extends BaseDaoImpl<AttTerm> implements AttTermDao {
    public AttTermDaoImpl() {
        super(AttTerm.class);
        // TODO Auto-generated constructor stub
    }
}
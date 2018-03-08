package com.zd.school.oa.attendance.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.oa.attendance.dao.AttTimeDao ;
import com.zd.school.oa.attendance.model.AttTime ;


/**
 * 
 * ClassName: AttTimeDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 考勤时间(ATT_T_TIME)实体Dao接口实现类.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class AttTimeDaoImpl extends BaseDaoImpl<AttTime> implements AttTimeDao {
    public AttTimeDaoImpl() {
        super(AttTime.class);
        // TODO Auto-generated constructor stub
    }
}
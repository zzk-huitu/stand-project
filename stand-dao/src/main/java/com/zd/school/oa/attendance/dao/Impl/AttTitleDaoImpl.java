package com.zd.school.oa.attendance.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.oa.attendance.dao.AttTitleDao ;
import com.zd.school.oa.attendance.model.AttTitle ;


/**
 * 
 * ClassName: AttTitleDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 考勤主题(ATT_T_TITLE)实体Dao接口实现类.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class AttTitleDaoImpl extends BaseDaoImpl<AttTitle> implements AttTitleDao {
    public AttTitleDaoImpl() {
        super(AttTitle.class);
        // TODO Auto-generated constructor stub
    }
}
package com.zd.school.jw.arrangecourse.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.jw.arrangecourse.dao.JwFuncroomcourseDao ;
import com.zd.school.jw.arrangecourse.model.JwFuncroomcourse ;


/**
 * 
 * ClassName: JwFuncroomcourseDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 排课课程表(JW_T_FUNCROOMCOURSE)实体Dao接口实现类.
 * date: 2017-03-06
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class JwFuncroomcourseDaoImpl extends BaseDaoImpl<JwFuncroomcourse> implements JwFuncroomcourseDao {
    public JwFuncroomcourseDaoImpl() {
        super(JwFuncroomcourse.class);
        // TODO Auto-generated constructor stub
    }
}
package com.zd.school.jw.schoolcourse.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.jw.schoolcourse.dao.JwPublishcourseDao ;
import com.zd.school.jw.schoolcourse.model.JwPublishcourse ;


/**
 * 
 * ClassName: JwPublishcourseDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 校本课程发布课程信息(JW_T_PUBLISHCOURSE)实体Dao接口实现类.
 * date: 2016-11-21
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class JwPublishcourseDaoImpl extends BaseDaoImpl<JwPublishcourse> implements JwPublishcourseDao {
    public JwPublishcourseDaoImpl() {
        super(JwPublishcourse.class);
        // TODO Auto-generated constructor stub
    }
}
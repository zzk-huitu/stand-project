package com.zd.school.wisdomclass.ecc.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.jw.ecc.model.JwCheckrule ;
import com.zd.school.wisdomclass.ecc.dao.JwCheckruleDao;


/**
 * 
 * ClassName: JwCheckruleDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 课程考勤规则(JW_T_CHECKRULE)实体Dao接口实现类.
 * date: 2017-05-10
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class JwCheckruleDaoImpl extends BaseDaoImpl<JwCheckrule> implements JwCheckruleDao {
    public JwCheckruleDaoImpl() {
        super(JwCheckrule.class);
        // TODO Auto-generated constructor stub
    }
}
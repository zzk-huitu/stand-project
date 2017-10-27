package com.zd.school.plartform.baseset.dao.Impl;


import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.plartform.baseset.dao.BaseClassDormAllotDao;


/**
 * 
 * ClassName: JwClassdormDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 班级宿舍(JW_T_CLASSDORM)实体Dao接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class BaseClassDormAllotDaoImpl extends BaseDaoImpl<JwClassDormAllot> implements BaseClassDormAllotDao {
    public BaseClassDormAllotDaoImpl() {
        super(JwClassDormAllot.class);
        // TODO Auto-generated constructor stub
    }
}
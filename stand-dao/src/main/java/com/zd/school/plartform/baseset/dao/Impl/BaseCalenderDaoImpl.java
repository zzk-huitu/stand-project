package com.zd.school.plartform.baseset.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.jw.eduresources.model.JwCalender ;
import com.zd.school.plartform.baseset.dao.BaseCalenderDao;


/**
 * 
 * ClassName: JwCalenderDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 校历信息(JW_T_CALENDER)实体Dao接口实现类.
 * date: 2016-08-30
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class BaseCalenderDaoImpl extends BaseDaoImpl<JwCalender> implements BaseCalenderDao {
    public BaseCalenderDaoImpl() {
        super(JwCalender.class);
        // TODO Auto-generated constructor stub
    }
}
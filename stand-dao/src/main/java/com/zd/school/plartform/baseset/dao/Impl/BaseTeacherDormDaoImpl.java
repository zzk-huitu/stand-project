package com.zd.school.plartform.baseset.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.plartform.baseset.dao.BaseTeacherDormDao;


/**
 * 
 * ClassName: DormStudentdormDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (教师分配宿舍)实体Dao接口实现类.
 * date: 2016-08-26
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class BaseTeacherDormDaoImpl extends BaseDaoImpl<DormTeacherDorm> implements BaseTeacherDormDao {
    public BaseTeacherDormDaoImpl() {
        super(DormTeacherDorm.class);
        // TODO Auto-generated constructor stub
    }
}
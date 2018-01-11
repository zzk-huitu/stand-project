
package com.zd.school.ykt.dao.Impl;

import com.zd.school.ykt.model.PtTask;
import org.springframework.stereotype.Repository;
import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.ykt.dao.PtTaskDao ;
import com.zd.school.ykt.model.PtTask ;

/**
* Created by zenglj on 2017-05-16.
*/
@Repository
public class PtTaskDaoImpl extends BaseDaoImpl<PtTask> implements PtTaskDao {
    public PtTaskDaoImpl() {
        super(PtTask.class);
        // TODO Auto-generated constructor stub
    }
}


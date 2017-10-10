package com.zd.school.plartform.baseset.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.plartform.baseset.dao.BaseTeacherDormDao;
import com.zd.school.plartform.baseset.service.BaseTeacherDormService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: DormStudentdormServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (DormTeacherDorm)实体Service接口实现类.
 * date: 2016-08-26
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseTeacherDormServiceImpl extends BaseServiceImpl<DormTeacherDorm> implements BaseTeacherDormService{

    @Resource
    public void setDormTeacherDormDao(BaseTeacherDormDao dao) {
        this.dao = dao;
    }
    
    @Override
	public QueryResult<DormTeacherDorm> list(Integer start, Integer limit, String sort, String filter, String whereSql,
			String orderSql, SysUser currentUser) {
		String sortSql = StringUtils.convertSortToSql(sort);
		String filterSql = StringUtils.convertFilterToSql(filter);

		StringBuffer hql = new StringBuffer("from DormTeacherDorm o where 1=1 and isDelete=0 ");
		hql.append(whereSql);
		hql.append(filterSql);
		if (orderSql.length() > 0) {
			if (sortSql.length() > 0)
				hql.append(orderSql + " , " + sortSql);
			else
				hql.append(orderSql);
		} else {
			if (sortSql.length() > 0)
				hql.append(" order by  " + sortSql);
		}

		QueryResult<DormTeacherDorm> qResult = this.queryResult(hql.toString(), start, limit);
		return qResult;
	}

}
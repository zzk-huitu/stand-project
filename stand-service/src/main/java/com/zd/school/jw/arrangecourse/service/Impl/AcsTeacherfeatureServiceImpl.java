package com.zd.school.jw.arrangecourse.service.Impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.jw.arrangecourse.model.AcsTeacherfeature ;
import com.zd.school.jw.arrangecourse.dao.AcsTeacherfeatureDao ;
import com.zd.school.jw.arrangecourse.service.AcsTeacherfeatureService ;

/**
 * 
 * ClassName: AcsTeacherfeatureServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (ACS_T_TEACHERFEATURE)实体Service接口实现类.
 * date: 2016-11-25
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class AcsTeacherfeatureServiceImpl extends BaseServiceImpl<AcsTeacherfeature> implements AcsTeacherfeatureService{

    @Resource
    public void setAcsTeacherfeatureDao(AcsTeacherfeatureDao dao) {
        this.dao = dao;
    }

	@Override
	public QueryResult<AcsTeacherfeature> list(Integer start, Integer limit, String sort, String filter, String whereSql,
			String orderSql,SysUser currentUser) {
		String sortSql = StringUtils.convertSortToSql(sort);
		String filterSql = StringUtils.convertFilterToSql(filter);

		StringBuffer hql = new StringBuffer("from AcsTeacherfeature o where 1=1 ");
		hql.append(whereSql);
		hql.append(filterSql);
        if (orderSql.length()>0){
        	if (sortSql.length()>0)
        		hql.append(orderSql+ " , " + sortSql);
        	else 
        		hql.append(orderSql);
        } else {
        	if (sortSql.length()>0)
        		hql.append(" order by  " + sortSql);
        }
        
        QueryResult<AcsTeacherfeature> qResult = this.queryResult(hql.toString(), start, limit);
		return qResult;
	}
}
package com.zd.school.plartform.basedevice.service;

import com.zd.core.dao.BaseDao;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseService;
import com.zd.school.control.device.model.MjUserright ;


/**
 * 
 * ClassName: MjUserrightService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 门禁权限表(MJ_UserRight)实体Service接口类.
 * date: 2016-09-08
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface MjUserrightService extends BaseService<MjUserright> {

	BaseDao<MjUserright> getDao();

	QueryResult<MjUserright> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete);
}
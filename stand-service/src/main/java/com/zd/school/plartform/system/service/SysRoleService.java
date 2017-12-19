package com.zd.school.plartform.system.service;

import java.util.HashMap;
import java.util.Map;

import com.zd.core.service.BaseService;
import com.zd.school.plartform.system.model.SysRole;

/**
 * 
 * ClassName: BaseTRoleService Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 角色管理实体Service接口类. date: 2016-07-17
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

public interface SysRoleService extends BaseService<SysRole> {

	boolean doDelete(String delIds, String isdelete, String xm);
    //public List<SysRole> doQueryForIn(String hql, Integer start, Integer limit,Object[] objs);

	Boolean doDeleteRoleUser(String ids, String userId);

	Boolean doAddRoleUser(String ids, String userId);
	Boolean doDeleteRole(String ids,  Map hashMap,String xm);
}
package com.zd.school.plartform.system.service;

import com.zd.core.service.BaseService;
import com.zd.school.plartform.system.model.SysDeptRight ;
import com.zd.school.plartform.system.model.SysUser;


/**
 * 
 * ClassName: SysDeptrightService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 用户权限部门(SYS_T_DEPTRIGHT)实体Service接口类.
 * date: 2017-04-06
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface SysDeptRightService extends BaseService<SysDeptRight> {

	boolean doDelete(String delIds);

	Boolean doUserRightDept(String userIds, String deptIds, SysUser currentUser);

	

	void doUpdateRightType(String uuid, String rightType, String userId);


	
}
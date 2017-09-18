
package com.zd.school.plartform.system.service;

import java.util.List;

import com.zd.core.service.BaseService;
import com.zd.school.plartform.system.model.SysPermission;
import com.zd.school.plartform.system.model.SysRoleMenuPermission;


public interface SysRoleMenuPermissionService extends BaseService<SysRoleMenuPermission> {

	boolean doSetRoleMenuPermission(String roleId, String perId, String roleMenuPers);

	void removeRoleMenuPermission(String roleId, List<SysPermission> cancelPerimission);

}
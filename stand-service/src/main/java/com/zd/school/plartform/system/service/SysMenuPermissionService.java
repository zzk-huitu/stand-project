
package com.zd.school.plartform.system.service;

import java.util.List;

import com.zd.core.service.BaseService;
import com.zd.school.plartform.system.model.SysMenuPermission;
import com.zd.school.plartform.system.model.SysUser;


public interface SysMenuPermissionService extends BaseService<SysMenuPermission> {

	List<SysMenuPermission> getRoleMenuPerlist(String roleId, String perId);

	SysMenuPermission doAddEntity(SysMenuPermission entity, SysUser currentUser);

	SysMenuPermission doUpdateEntity(SysMenuPermission entity, SysUser currentUser);

}

package com.zd.school.plartform.system.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.plartform.system.dao.SysRoleMenuPermissionDao;
import com.zd.school.plartform.system.model.SysRoleMenuPermission;



@Repository
public class SysRoleMenuPermissionDaoImpl extends BaseDaoImpl<SysRoleMenuPermission> implements SysRoleMenuPermissionDao {
    public SysRoleMenuPermissionDaoImpl() {
        super(SysRoleMenuPermission.class);
        // TODO Auto-generated constructor stub
    }
}

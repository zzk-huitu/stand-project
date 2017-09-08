	
package com.zd.school.plartform.system.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.dao.SysMenuPermissionDao;
import com.zd.school.plartform.system.model.SysMenuPermission;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysMenuPermissionService;

@Service
@Transactional
public class SysMenuPermissionServiceImpl extends BaseServiceImpl<SysMenuPermission> implements SysMenuPermissionService{

    @Resource
    public void setSysMenuPermissionDao(SysMenuPermissionDao dao) {
        this.dao = dao;
    }

	@Override
	public List<SysMenuPermission> getRoleMenuPerlist(String roleId, String perId) {
		List<SysMenuPermission> returnList=null;
		//查询此菜单的功能权限	
		String hql = "select menuPerId from SysRoleMenuPermission a where a.isDelete=0 ";
		if(StringUtils.isNotEmpty(roleId)){
			hql+=" and a.roleId='"+roleId+"'";		
		}
		if(StringUtils.isNotEmpty(perId)){
			hql+=" and a.perId='"+perId+"'";				
		}
		List<String> menuPerIds = this.queryEntityByHql(hql);
		if(menuPerIds.size()>0){
			hql = "from SysMenuPermission s where s.uuid in (:ids) and s.isDelete=0";          
        	returnList = this.queryByHql(hql.toString(), 0, -1, "ids", menuPerIds.toArray());// 执行查询方法
		}else{
			returnList=new ArrayList<>();
		}
        return returnList;
	}

	@Override
	public SysMenuPermission doAddEntity(SysMenuPermission entity, SysUser currentUser) {
		// TODO Auto-generated method stub	
		SysMenuPermission saveEntity = new SysMenuPermission();
		try {
			List<String> excludedProp = new ArrayList<>();
			excludedProp.add("uuid");
			BeanUtils.copyProperties(saveEntity,entity,excludedProp);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		// 生成默认的orderindex
		// 如果界面有了排序号的输入，则不需要取默认的了
		Integer orderIndex = this.getDefaultOrderIndex(saveEntity);
		saveEntity.setOrderIndex(orderIndex);// 排序

		// 增加时要设置创建人
		saveEntity.setCreateUser(currentUser.getXm()); // 创建人
		
		// 持久化到数据库
		entity = this.merge(saveEntity);
		
		return entity;
	}
	
	@Override
	public SysMenuPermission doUpdateEntity(SysMenuPermission entity, SysUser currentUser) {
		// TODO Auto-generated method stub	
		// 先拿到已持久化的实体	
		SysMenuPermission perEntity = this.get(entity.getUuid());
	
		try {
			// 将entity中不为空的字段动态加入到perEntity中去。
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
		entity = this.merge(perEntity);// 执行修改方法

		return entity;
	}

}
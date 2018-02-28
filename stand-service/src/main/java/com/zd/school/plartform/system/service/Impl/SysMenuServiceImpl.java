package com.zd.school.plartform.system.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.AuthorType;
import com.zd.core.constant.MenuType;
import com.zd.core.constant.PermType;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.ModelUtil;
import com.zd.school.plartform.system.dao.SysMenuDao;
import com.zd.school.plartform.system.model.SysMenu;
import com.zd.school.plartform.system.model.SysMenuChkTree;
import com.zd.school.plartform.system.model.SysMenuPermission;
import com.zd.school.plartform.system.model.SysMenuTree;
import com.zd.school.plartform.system.model.SysPermission;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysMenuPermissionService;
import com.zd.school.plartform.system.service.SysMenuService;
import com.zd.school.plartform.system.service.SysPerimissonService;
import com.zd.school.plartform.system.service.SysRoleMenuPermissionService;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 
 * ClassName: BaseTMenuServiceImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 系统菜单表实体Service接口实现类. date: 2016-07-17
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class SysMenuServiceImpl extends BaseServiceImpl<SysMenu> implements SysMenuService {

	@Resource
	public void setBaseTMenuDao(SysMenuDao dao) {
		this.dao = dao;
	}

	@Resource
	private SysRoleService sysRoleService;

	@Resource
	private SysUserService sysUserService;

	@Resource
	private SysPerimissonService perimissonSevice;

	@Resource
	private SysMenuPermissionService menuPermissionService; // service层接口

	@Resource
	private SysRoleMenuPermissionService roleMenuPermissionService;

	/**
	 * 
	 * listTree:获取系统菜单的树形列表
	 *
	 * @author luoyibo
	 * @param whereSql
	 *            :查询条件
	 * @param orderSql
	 *            :排序条件
	 * @param parentSql:
	 * @param querySql
	 * @return List<SysMenuTree>
	 * @throws @since
	 *             JDK 1.8
	 */

	@Override
	public List<SysMenuTree> getTreeList(String whereSql, String orderSql) {

		StringBuffer hql = new StringBuffer("from SysMenu where 1=1");
		hql.append(whereSql);
		hql.append(orderSql);

		// 总记录数
		StringBuffer countHql = new StringBuffer("select count(*) from SysMenu where 1=1");
		countHql.append(whereSql);

		List<SysMenu> typeList = super.queryByHql(hql.toString());
		List<SysMenuTree> result = new ArrayList<SysMenuTree>();
		// 构建Tree数据
		recursion(new SysMenuTree(TreeVeriable.ROOT, new ArrayList<SysMenuTree>()), result, typeList);

		return result;
	}

	private void recursion(SysMenuTree parentNode, List<SysMenuTree> result, List<SysMenu> list) {
		List<SysMenu> childs = new ArrayList<SysMenu>();
		for (SysMenu SysMenu : list) {
			if (SysMenu.getParentNode().equals(parentNode.getId())) {
				childs.add(SysMenu);
			}
		}
		for (SysMenu SysMenu : childs) {
			SysMenuTree child = new SysMenuTree(SysMenu.getUuid(), SysMenu.getNodeText(), "", SysMenu.getLeaf(),
					SysMenu.getNodeLevel(), SysMenu.getTreeIds(), SysMenu.getParentNode(), SysMenu.getOrderIndex(),
					new ArrayList<SysMenuTree>(), SysMenu.getMenuCode(), SysMenu.getSmallIcon(), SysMenu.getBigIcon(),
					SysMenu.getMenuTarget(), SysMenu.getMenuType(), SysMenu.getMenuLeaf(), SysMenu.getNodeCode(),
					SysMenu.getIssystem(), SysMenu.getIsHidden());
			if (SysMenu.getParentNode().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<SysMenuTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			recursion(child, result, list);
		}

	}

	/**
	 * 获取指定对象的授权树
	 * 
	 * @param roodId
	 *            授权树的根节点
	 * @param author
	 *            授权对象ID
	 * @param authorType
	 *            授权类型
	 * @param isSee
	 *            是否可见
	 * @param expanded
	 *            是否展开
	 * @return
	 */
	@Override
	public List<SysMenuTree> getPermTree(String roodId, String author, String authorType, Boolean isSee,
			Boolean expanded) {
		Boolean isAdmin = false;
		String hql = "from SysMenu ";
		
		// 对于超级管理员的用户与角色，默认有所有菜单的权限
		if (authorType.equals(AuthorType.ROLE)) {
			SysRole thisRole = sysRoleService.get(author);
			if (thisRole.getRoleCode().equals(AdminType.ADMIN_ROLE_NAME))
				isAdmin = true;
		} else {
			SysUser thisUser = sysUserService.get(author);
			if (thisUser.getUserName().equals(AdminType.ADMIN_USER_NAME)){
				isAdmin = true;
			}else{				
				Iterator<SysRole> iterator=thisUser.getSysRoles().iterator();
				while(iterator.hasNext()){
					if(iterator.next().getUuid().equals(AdminType.ADMIN_ROLE_ID)){	//判断角色id
						isAdmin = true;
						break;
					}
				}			
			}
		}
		// 除了超级管理员用户，其它的只能看未隐藏的菜单
		if (isAdmin == false)
			hql += " where isHidden='0'";
		hql += " order by parentNode,orderIndex asc ";
		List<SysMenu> lists = super.queryByHql(hql.toString());
		
		// 得到当前对象的权限
		Map<String, SysPermission> maps = buildPermMap(author, authorType);
		if (maps == null) {
			return null;
		}
		// 非超级管理员账户
		if (!isAdmin) {
			List<SysMenu> removeLists = new ArrayList<SysMenu>();
			for (SysMenu node : lists) {
				if (isSee) {
					if (maps.get(node.getUuid()) == null && !node.getUuid().equalsIgnoreCase(TreeVeriable.ROOT)) {
						removeLists.add(node);
					}
				} else {
				}
			}
			if (isSee) {
				for (SysMenu node : removeLists) {
					lists.remove(node);
				}
			}
		}
		List<SysMenuTree> result = new ArrayList<SysMenuTree>();
		// 构建Tree数据
		recursion(new SysMenuTree(TreeVeriable.ROOT, new ArrayList<SysMenuTree>()), result, lists);

		return result;

	}

	// 构建权限map
	private Map<String, SysPermission> buildPermMap(String author, String authorType) {
		Map<String, SysPermission> maps = new HashMap<String, SysPermission>();
		if (AuthorType.ROLE.equalsIgnoreCase(authorType)) {
			SysRole sysRole = sysRoleService.get(author);
			if (sysRole != null && sysRole.getIsDelete() == 0) {
				Set<SysPermission> perms = sysRole.getSysPermissions();
				for (SysPermission perm : perms) {
					maps.put(perm.getPerCode(), perm);
				}
			}
		} else {
			SysUser user = sysUserService.get(author);
			if (user != null) {
				// 得到角色
				Set<SysRole> roles = user.getSysRoles();
				for (SysRole role : roles) {
					// 得到指定角色的权限
					if (role != null && role.getIsDelete() == 0) {
						Set<SysPermission> perms = role.getSysPermissions();
						for (SysPermission perm : perms) {
							maps.put(perm.getPerCode(), perm);
						}
					}
				}
			}
		}
		return maps;
	}

	private void roleMenuRecursion(SysMenuTree parentNode, List<SysMenuTree> result, List<SysMenu> list,
			List<SysMenuPermission> menuPers) {
		List<SysMenu> childs = new ArrayList<SysMenu>();
		for (SysMenu SysMenu : list) {
			if (SysMenu.getParentNode().equals(parentNode.getId())) {
				childs.add(SysMenu);
			}
		}
		for (SysMenu SysMenu : childs) {
			SysMenuTree child = new SysMenuTree(SysMenu.getUuid(), SysMenu.getNodeText(), "", SysMenu.getLeaf(),
					SysMenu.getNodeLevel(), SysMenu.getTreeIds(), SysMenu.getParentNode(), SysMenu.getOrderIndex(),
					new ArrayList<SysMenuTree>(), SysMenu.getMenuCode(), SysMenu.getSmallIcon(), SysMenu.getBigIcon(),
					SysMenu.getMenuTarget(), SysMenu.getMenuType(), SysMenu.getMenuLeaf(), SysMenu.getNodeCode(),
					SysMenu.getIssystem(), SysMenu.getIsHidden(), SysMenu.getPerId());

			String menuPerName = "";
			for (int j = menuPers.size() - 1; j >= 0; j--) {
				if (menuPers.get(j).getMenuId().equals(SysMenu.getUuid())) {
					menuPerName += menuPers.get(j).getPerName() + "/";
					menuPers.remove(j);
				}
			}
			if (menuPerName.length() > 0) {
				menuPerName = menuPerName.substring(0, menuPerName.length() - 1);
			}
			child.setRoleMenuPerName(menuPerName);

			if (SysMenu.getParentNode().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<SysMenuTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			roleMenuRecursion(child, result, list, menuPers);
		}

	}

	@Override
	public List<SysMenuTree> getRoleMenuTreeList(String roleId) {
		// 当前角色有权限的菜单
		Set<SysPermission> rolePerimisson = sysRoleService.get(roleId).getSysPermissions();
		// String hql = "from SysMenu e where e.isHidden='0' and e.uuid in
		// (select o.perCode from SysPermission o where o in (:roleRight)) ";
		String hql = "from SysMenu e where e.uuid in (select o.perCode from SysPermission o where o in (:roleRight)) ";
		// 非超级管理员要排除掉隐藏的菜单
		if (!roleId.equals(AdminType.ADMIN_ROLE_ID))
			hql += " and e.isHidden='0'";	//只显示正常的
		List<SysMenu> lists = new ArrayList<SysMenu>();
		List<SysMenuTree> result = new ArrayList<SysMenuTree>();
		if (rolePerimisson.size() > 0) {
			lists = this.queryByHql(hql.toString(), 0, 999, "roleRight", rolePerimisson.toArray());// 执行查询方法

			// 查询此菜单的功能权限
			List<SysMenuPermission> menuPers = menuPermissionService.getRoleMenuPerlist(roleId, null);
			// 然后在递归组装树中把菜单功能权限设置进来。
			roleMenuRecursion(new SysMenuTree(TreeVeriable.ROOT, new ArrayList<SysMenuTree>()), result, lists,
					menuPers);
		}
		return result;
	}

	/**
	 * 
	 * cancelRoleRightMenu:取消指定角色的菜单权限). new：删除菜单所有功能权限。
	 * 
	 * @author luoyibo
	 * @param roleId
	 * @param cancelMenuId
	 * @return Boolean
	 * @throws @since
	 *             JDK 1.8
	 */
	@Override
	public Boolean doCancelRoleRightMenu(String roleId, String cancelMenuId) {
		Boolean doResult = false;

		String menuIds = "'" + cancelMenuId.replace(",", "','") + "'";
		String hql = " from SysPermission a where a.perCode in (" + menuIds + ") and a.perType='" + PermType.TYPE_MENU
				+ "'";
		List<SysPermission> cancelPerimission = perimissonSevice.queryByHql(hql);

		SysRole cancelRole = sysRoleService.get(roleId);
		Set<SysPermission> rolePermission = cancelRole.getSysPermissions();
		rolePermission.removeAll(cancelPerimission);

		cancelRole.setSysPermissions(rolePermission);
		sysRoleService.merge(cancelRole);

		// 删除此角色的菜单功能权限
		roleMenuPermissionService.removeRoleMenuPermission(roleId, cancelPerimission);

		// 删除此角色的redis菜单数据
		sysUserService.deleteUserMenuTreeRedis(new String[] { roleId });

		doResult = true;

		return doResult;
	}

	/**
	 * 
	 * addRoleRightMenu给指定的角色增加权限菜单 . new：给菜单默认加入所有功能权限。
	 * 
	 * @author luoyibo
	 * @param roleId
	 * @param addMenuid
	 * @return Boolean
	 * @throws @since
	 *             JDK 1.8
	 */
	@Override
	public Boolean doAddRoleRightMenu(String roleId, String addMenuid) {
		Boolean doResult = false;

		String[] addMenuIds = addMenuid.split(",");

		// 要增加权限菜单的角色及已有权限菜单信息
		SysRole addRoleEntity = sysRoleService.get(roleId);
		Set<SysPermission> rolePermission = addRoleEntity.getSysPermissions();

		// 要添加的菜单的权限清单
		List<SysMenu> addMenuEntity = this.queryByProerties("uuid", addMenuIds);
		List<String> perimissonIds = new ArrayList<>();

		String[] propName = { "perType", "perCode" };
		String[] propValue = new String[] {};
		Set<SysPermission> addPerimisson = new HashSet<SysPermission>();
		for (SysMenu sysMenu : addMenuEntity) {
			String perCode = sysMenu.getUuid();
			propValue = new String[] { PermType.TYPE_MENU, perCode };
			SysPermission isPeriminsson = perimissonSevice.getByProerties(propName, propValue);
			// 当前菜单在权限资源表中
			if (ModelUtil.isNotNull(isPeriminsson)) {
				addPerimisson.add(isPeriminsson);
			} else {
				// 当前菜单不在权限资源中，需要先增加权限资源
				isPeriminsson = new SysPermission();
				isPeriminsson.setPerCode(perCode);
				isPeriminsson.setPerType(PermType.TYPE_MENU);

				isPeriminsson = perimissonSevice.merge(isPeriminsson);
				addPerimisson.add(isPeriminsson);
			}
			perimissonIds.add(isPeriminsson.getUuid());
		}
		// rolePermission.removeAll(rolePermission);
		rolePermission.addAll(addPerimisson);

		addRoleEntity.setSysPermissions(rolePermission);
		sysRoleService.merge(addRoleEntity);

		// 初始化角色菜单功能权限。
		for (int i = 0; i < addMenuEntity.size(); i++) {
			SysMenu sysMenu = addMenuEntity.get(i);
			String perCode = sysMenu.getUuid();
			String perId = perimissonIds.get(i);

			// 查询此菜单拥有的功能权限
			String hql = "select a.uuid from SysMenuPermission a where a.isDelete=0 and a.menuId=?";
			List<String> menuPerList = this.queryEntityByHql(hql, perCode);
			String menuPerStr = "";
			for (int j = 0; j < menuPerList.size(); j++) {
				menuPerStr += menuPerList.get(j) + ",";
			}
			if (menuPerStr.length() > 0)
				menuPerStr = menuPerStr.substring(0, menuPerStr.length() - 1);

			roleMenuPermissionService.doSetRoleMenuPermission(roleId, perId, menuPerStr);
		}

		// 如果有新的菜单加入，就清除redis菜单数据
		if (addMenuEntity.size() > 0) {
			sysUserService.deleteUserMenuTreeRedis(new String[] { roleId });
		}

		doResult = true;

		return doResult;
	}

	/**
	 * 
	 * getPermissionMenu:获取指定对象有权限的菜单.
	 *
	 * @author luoyibo
	 * @param roodId
	 * @param author
	 * @param authorType
	 * @return List<SysMenu>
	 * @throws @since
	 *             JDK 1.8
	 */
	private List<SysMenu> getPermissionMenu(String author, String authorType) {
		String hql = "from SysMenu where isHidden='0'";

		// 查询出有效的菜单
		List<SysMenu> lists = super.queryByHql(hql.toString());

		// 对于超级管理员的用户与角色，默认有所有菜单的权限
		if (authorType.equals(AuthorType.ROLE)) {
			SysRole thisRole = sysRoleService.get(author);
			if (thisRole.getRoleCode().equals(AdminType.ADMIN_ROLE_NAME))	//判断角色名
				return lists;
		} else {
			SysUser thisUser = sysUserService.get(author);
			if (thisUser.getUserName().equals(AdminType.ADMIN_USER_NAME)){	//判断用户名
				return lists;
			}else{				
				Iterator<SysRole> iterator=thisUser.getSysRoles().iterator();
				while(iterator.hasNext()){
					if(iterator.next().getUuid().equals(AdminType.ADMIN_ROLE_ID)){	//判断角色id
						return lists;
					}
				}			
			}
		}

		// 对于非超级管理员，得到当前对象的权限
		Map<String, SysPermission> maps = buildPermMap(author, authorType);
		if (maps == null) {
			return null;
		}

		// 根据当前用户的权限，从系统菜单中清除无权限的菜单
		List<SysMenu> removeLists = new ArrayList<SysMenu>();
		for (SysMenu node : lists) {
			if (maps.get(node.getUuid()) == null && !node.getUuid().equalsIgnoreCase(TreeVeriable.ROOT)) {
				// 如果当前菜单不在权限菜单中，则放入清除的菜单中
				removeLists.add(node);
			}
		}
		// 从所有的菜单中删除无权限的菜单
		for (SysMenu node : removeLists) {
			lists.remove(node);
		}

		return lists;
	}

	/**
	 * 
	 * getUserPermissionToRole 获取指定用户能对指定角色授权的菜单.
	 *
	 * @author luoyibo
	 * @param roleId
	 *            要授权菜单的角色
	 * @param userId
	 *            当前授权人
	 * @return List<SysMenuTree>
	 * @throws @since
	 *             JDK 1.8
	 */

	@Override
	public List<SysMenuChkTree> getUserPermissionToRole(String roleId, String userId) {
		// 当前角色已有的授权菜
		Map<String, SysPermission> maps = this.buildPermMap(roleId, AuthorType.ROLE);

		// 当前用户有权限的菜单
		List<SysMenu> userPermissionMenu = this.getPermissionMenu(userId, AuthorType.USER);
		List<SysMenu> removeLists = new ArrayList<SysMenu>();
		for (SysMenu node : userPermissionMenu) {
			if (maps.get(node.getUuid()) != null && !node.getMenuType().equals(MenuType.TYPE_MENU)) {
				// 如果当前菜单在角色的菜单权限中，则过滤掉
				removeLists.add(node);
			}
		}
		// 从当前用户有权限的菜单中除掉已对角色授权的菜单
		for (SysMenu node : removeLists) {
			userPermissionMenu.remove(node);
		}

		List<SysMenuChkTree> result = new ArrayList<SysMenuChkTree>();
		// 生成树形数据
		createChildChkTree(new SysMenuChkTree(TreeVeriable.ROOT, new ArrayList<SysMenuChkTree>()), result,
				userPermissionMenu);

		return result;
	}

	private void createChildChkTree(SysMenuChkTree parentNode, List<SysMenuChkTree> result, List<SysMenu> list) {
		List<SysMenu> childs = new ArrayList<SysMenu>();
		for (SysMenu SysMenu : list) {
			if (SysMenu.getParentNode().equals(parentNode.getId())) {
				childs.add(SysMenu);
			}
		}

		for (SysMenu sysMenu : childs) {
			SysMenuChkTree child = new SysMenuChkTree(sysMenu.getUuid(), sysMenu.getNodeText(), "", sysMenu.getLeaf(),
					sysMenu.getNodeLevel(), sysMenu.getTreeIds(), new ArrayList<SysMenuChkTree>(), false,
					sysMenu.getMenuCode(), sysMenu.getSmallIcon(), sysMenu.getBigIcon(), sysMenu.getMenuTarget(),
					sysMenu.getMenuType(), sysMenu.getMenuLeaf(), sysMenu.getNodeCode(), sysMenu.getParentNode(),
					sysMenu.getOrderIndex(), sysMenu.getIssystem());

			if (sysMenu.getParentNode().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<SysMenuChkTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createChildChkTree(child, result, list);
		}
	}

	@Override
	public SysMenu addMenu(SysMenu menu, SysUser currentUser) throws IllegalAccessException, InvocationTargetException {
		String parentNode = menu.getParentNode();
		String parentName = menu.getParentName();
		String menuType = menu.getMenuType();
		String menuLeaf = "LEAF";
		if (menuType.equals(MenuType.TYPE_MENU))
			menuLeaf = "GENERAL";
	
		SysMenu saveEntity = new SysMenu();
		List<String> excludedProp = new ArrayList<>();
		excludedProp.add("uuid");
		BeanUtils.copyProperties(saveEntity, menu, excludedProp);		
		saveEntity.setCreateUser(currentUser.getXm()); // 创建人
		saveEntity.setLeaf(true);
		saveEntity.setIssystem(1);
		saveEntity.setIsHidden("1");
		saveEntity.setMenuLeaf(menuLeaf);
		if (!parentNode.equals(TreeVeriable.ROOT)) {
			SysMenu parEntity = this.get(parentNode);
			parEntity.setLeaf(false);
			this.merge(parEntity);
			saveEntity.BuildNode(parEntity);
		} else
			saveEntity.BuildNode(null);

		menu = this.merge(saveEntity);
		menu.setParentName(parentName);
		menu.setParentNode(parentNode);

		return menu;
	}

	@Override
	public SysMenu doUpdateMenu(SysMenu entity, String xm) {
		// TODO Auto-generated method stub
		String parentNode = entity.getParentNode();
		String uuid = entity.getUuid();

		// 先拿到已持久化的实体
		SysMenu perEntity = this.get(uuid);
		boolean isLeaf = perEntity.getLeaf();
		// 将entity中不为空的字段动态加入到perEntity中去。
		try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		perEntity.setUpdateTime(new Date()); // 设置修改时间
		perEntity.setUpdateUser(xm); // 设置修改人的中文名
		perEntity.setLeaf(isLeaf);
		entity = this.merge(perEntity);// 执行修改方法
		
		//entity.setParentName(parentName);
		//entity.setParentNode(parentNode);
		
		// 更新父节点的是否叶节点的标记
		SysMenu parentMenu = this.get(parentNode);
		if (parentMenu != null) {
			parentMenu.setUpdateTime(new Date()); // 设置修改时间
			parentMenu.setUpdateUser(xm); // 设置修改人的中文名
			parentMenu.setLeaf(false);
			this.merge(parentMenu);// 执行修改方法
		}

		// 删除有权限的角色的用户的redis数据
		if (entity.getPerId() != null) {
			SysPermission sysPermission = perimissonSevice.get(entity.getPerId());
			if (sysPermission != null)
				sysUserService.deleteUserMenuTreeRedis(sysPermission);
		}

		return entity;
	}
}
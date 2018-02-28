
package com.zd.school.plartform.system.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.ExtDataFilter;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysMenuService;
import com.zd.school.plartform.system.service.SysRoleMenuPermissionService;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 系统角色管理
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SysRole")
public class SysRoleController extends FrameWorkController<SysRole> implements Constant {

    @Resource
    private SysRoleService thisService; // service层接口

    @Resource
    private SysUserService userSerive;

    @Resource
    private SysMenuService menuService;

    @Resource
    private SysRoleMenuPermissionService roleMenuPermissionService;
    	
    /**
     * 获取角色列表（非管理员只能看到非隐藏的角色）
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(@ModelAttribute SysRole entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        String filter = super.filter(request);
        List<ExtDataFilter> listFilters = new ArrayList<ExtDataFilter>();
        if (StringUtils.isNotEmpty(filter)) {
            listFilters = (List<ExtDataFilter>) JsonBuilder.getInstance().fromJsonArray(filter, ExtDataFilter.class);
        }
        ExtDataFilter hideDataFilter = new ExtDataFilter();
        hideDataFilter.setComparison("=");
        hideDataFilter.setField("isHidden");
        hideDataFilter.setType("string");
        hideDataFilter.setValue("0");

        //SysUser currentUser = getCurrentSysUser();
        //if (!currentUser.getUserName().equals(AdminType.ADMIN_ROLE_NAME))
        if (getIsAdmin()==0)	//若非管理员，就加入这个条件
            listFilters.add(hideDataFilter);
        String newFilter = jsonBuilder.buildObjListToJson(Long.valueOf(listFilters.size()), listFilters, false);
        QueryResult<SysRole> qr = thisService.queryPageResult(super.start(request), super.limit(request),
                super.sort(request), newFilter, true);

        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 添加角色（手动新添加的角色是非隐藏、非系统内置的）
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("SYSROLE_add")
    @RequestMapping("/doAdd")
    public void doAdd(SysRole entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String roleName = entity.getRoleName();
        String roleCode = entity.getRoleCode();
        //此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0'";
        if (thisService.IsFieldExist("roleName", roleName, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"角色名称不能重复！\""));
            return;
        }
        if (thisService.IsFieldExist("roleCode", roleCode, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"角色编码不能重复！\""));
            return;
        }
        
        //设置初始化属性
        entity.setIsHidden("0");
        entity.setIssystem(0);
        
        // 获取当前操作用户
        SysUser currentUser = getCurrentSysUser();         
        entity=thisService.doAddEntity(entity,currentUser.getXm());     
        
        if(entity==null)
        	writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        
    }

    /**
     * 删除角色（只能删除未分配给用户的角色）
     * @param request
     * @param response
     * @throws IOException
     */
    @Auth("SYSROLE_delete")
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    	Boolean flag=false;
    	String delIds = request.getParameter("ids");
        SysUser currentUser = getCurrentSysUser();
        Map<String, Object> hashMap = new HashMap<String, Object>();
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"没有传入删除主键\""));
            return;
		} else {
			flag = thisService.doDeleteRole(delIds, hashMap, currentUser.getXm());
			flag = (Boolean) hashMap.get("flag") == null ? true : (Boolean) hashMap.get("flag");
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				String sign = (String) hashMap.get("sign")== null ?"0":(String) hashMap.get("sign");
				if (!sign.equals("1")) {
					StringBuffer roleName = (StringBuffer) hashMap.get("roleName");
					writeJSON(response, jsonBuilder.returnFailureJson("\"角色" + roleName + "正在被其他用户使用，不允许删除！\""));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
				}

				
			}
        }
    }

    /**
     * doRestore还原删除的记录 @Title: doRestore @Description: TODO @param @param
     * request @param @param response @param @throws IOException 设定参数 @return
     * void 返回类型 @throws
     */
    @RequestMapping("/doRestore")
    public void doRestore(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"没有传入还原主键\""));
            return;
        } else {
            SysUser currentUser = getCurrentSysUser();
            boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE,currentUser.getXm());
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
            }
        }
    }

    /**
     * 编辑角色
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("SYSROLE_update")
    @RequestMapping("/doUpdate")
    public void doUpdate(SysRole entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        String roleName = entity.getRoleName();
        String roleCode = entity.getRoleCode();
        String roleId = entity.getUuid();
        //入库前检查代码
        String hql = " o.isDelete='0'";
        if (thisService.IsFieldExist("roleName", roleName, roleId, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"角色名称不能重复！\""));
            return;
        }
        if (thisService.IsFieldExist("roleCode", roleCode, roleId, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"角色编码不能重复！\""));
            return;
        }
        //获取当前的操作用户
        SysUser currentUser = getCurrentSysUser();
       
        entity=thisService.doUpdateEntity(entity, currentUser.getXm(), null);
        
        if(entity==null)
       	 	writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        
    }

    /**
     * 获取用户未分配的角色列表
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/selectList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void selectList(@ModelAttribute SysRole entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        String userId = request.getParameter("userId");
        int start = super.start(request); // 起始记录数
        int limit = super.limit(request);// 每页记录数
        String sort = StringUtils.convertSortToSql(super.sort(request));
        String filter = StringUtils.convertFilterToSql(super.filter(request));
        
        Set<SysRole> userRole = userSerive.get(userId).getSysRoles();
        // hql语句
        StringBuffer hql = new StringBuffer("from SysRole o where o.isDelete=0 ");           
        if (userRole.size() > 0) {
        	StringBuilder sb = new StringBuilder();
            for (SysRole r : userRole) {
                sb.append(r.getUuid());
                sb.append(",");
            }
            sb = sb.deleteCharAt(sb.length()-1);
            String str = sb.toString().replace(",", "','");
            hql.append(" and o.uuid not in('" + str + "')");
        }
    
        //countHql.append("and e not in(:roles)");            
        if(StringUtils.isNotEmpty(filter)){
            hql.append(filter);
        }
        if(StringUtils.isNotEmpty(sort)){
            hql.append(" order by ");
            hql.append( sort);
        }
        
        QueryResult<SysRole> qr = thisService.queryResult(hql.toString(), start, limit);
                  
        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据        
    }

    /**
     * 取消某角色的菜单权限
     * @param request
     * @param response
     * @throws IOException
     */
    @Auth("ROLERIGHT_update")
    @RequestMapping("/doDeleteRight")
    public void cancelRoleRightMenu(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String roleId = request.getParameter("roleId");
        String cancelId = request.getParameter("ids");

        if (StringUtils.isEmpty(roleId) || StringUtils.isEmpty(cancelId)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入取消权限的数据\""));
            return;
        } else {
            boolean flag = menuService.doCancelRoleRightMenu(roleId, cancelId);
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"取消权限成功\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"取消权限失败\""));
            }
        }
    }

	/**
	 * 增加指定角色的授权菜单.
	 * @param request
	 * @param response
	 * @throws IOException
	 */
    @Auth("ROLERIGHT_add")
    @RequestMapping("/doAddRight")
    public void addRoleRightMenu(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String roleId = request.getParameter("roleId");
        String addId = request.getParameter("ids");

        if (StringUtils.isEmpty(roleId) || StringUtils.isEmpty(addId)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入增加权限的数据\""));
            return;
        } else {
            boolean flag = menuService.doAddRoleRightMenu(roleId, addId);
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"增加权限成功\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"增加权限失败\""));
            }
        }
    }
    
    /**
     * 
     * 修改指定角色菜单的功能权限. 
     */
    @Auth("ROLERIGHT_permission")
    @RequestMapping("/doSetRoleMenuPermission")
    public void doSetRoleMenuPermission(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String roleId = request.getParameter("roleId");	//角色ID
        String perId = request.getParameter("perId");	//角色菜单权限ID
        String roleMenuPers = request.getParameter("ids");	//菜单功能权限IDS

        if (StringUtils.isEmpty(roleId) || StringUtils.isEmpty(perId)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入增加权限的数据\""));
            return;
        } else {
            boolean flag = roleMenuPermissionService.doSetRoleMenuPermission(roleId, perId,roleMenuPers);
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"设置功能权限成功！\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"设置功能权限失败，请重试或联系管理员！\""));
            }
        }
    }
    
    /**
     * 获取此角色的用户列表
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/roleUserList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void roleUserList(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        String roleId = request.getParameter("roleId");
     
        QueryResult<SysUser> qr = userSerive.getUserByRoleId(roleId);
        if (ModelUtil.isNotNull(qr))
        	strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }
    
    
    /**
     * 删除指定角色的用户
     * @param ids 要删除用户的角色
     * @param userId 删除的用户Id,多个Id用英文逗号隔开
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/doDeleteRoleUser")
    public void doDeleteRoleUser(String ids, String userId,HttpServletRequest request, HttpServletResponse response) throws IOException{
        if(StringUtils.isEmpty(ids) || StringUtils.isEmpty(userId)){
            writeJSON(response,jsonBuilder.returnFailureJson("\"没有传入相关的参数:角色标识或删除的用户标识\""));
            return;
        }
        /*如果删除的是超级管理员角色的数据，就判断是否存在超级管理员账户*/
        if(ids.contains(AdminType.ADMIN_ROLE_ID)&&userId.contains(AdminType.ADMIN_USER_ID)){
        	writeJSON(response,jsonBuilder.returnFailureJson("\"不允许删除超级管理员角色的administrator账户！\""));
            return;
        }
              
        Boolean flag = thisService.doDeleteRoleUser(ids,userId);
        if(flag){
        	
          	//当操作了当前用户的角色，则更新roleKey的session值
        	SysUser currentUser=getCurrentSysUser();
			if(userId.indexOf(currentUser.getUuid())!=-1){
				SysUser sysUser = userSerive.get(currentUser.getUuid());
				String roleKeys = sysUser.getSysRoles().stream().filter(x -> x.getIsDelete() == 0).map(x -> x.getRoleCode())
				 		.collect(Collectors.joining(","));
				request.getSession().setAttribute(Constant.SESSION_SYS_USER, sysUser);
				request.getSession().setAttribute(Constant.SESSION_ROLE_KEY, roleKeys);
			}
			
            writeJSON(response,jsonBuilder.returnSuccessJson("\"角色用户删除成功\""));
        }else
            writeJSON(response,jsonBuilder.returnFailureJson("\"角色用户删除失败，详情请见错误日志\""));
        
    }

    /**
     * 给指定的角色添加用户
     * @param ids 要添加用户的角色Id
     * @param userId 添加的用户Id,多个Id用英文逗号隔开
     * @param request
     * @param response
     * @throws IOException
     */
    @Auth("SYSROLE_AddRoleUser")
    @RequestMapping("/doAddRoleUser")
    public void doAddRoleUser(String ids, String userId,HttpServletRequest request, HttpServletResponse response) throws IOException{
        if(StringUtils.isEmpty(ids) || StringUtils.isEmpty(userId)){
            writeJSON(response,jsonBuilder.returnFailureJson("\"没有传入相关的参数:角色标识或要添加的用户标识\""));
            return;
        }
        
        Boolean flag = thisService.doAddRoleUser(ids,userId);
        if(flag){
        	
        	//当操作了当前用户的角色，则更新roleKey的session值
        	SysUser currentUser=getCurrentSysUser();
			if(userId.indexOf(currentUser.getUuid())!=-1){
				SysUser sysUser = userSerive.get(currentUser.getUuid());
				String roleKeys = sysUser.getSysRoles().stream().filter(x -> x.getIsDelete() == 0).map(x -> x.getRoleCode())
				 		.collect(Collectors.joining(","));
				request.getSession().setAttribute(Constant.SESSION_SYS_USER, sysUser);
				request.getSession().setAttribute(Constant.SESSION_ROLE_KEY, roleKeys);
			}
			
            writeJSON(response,jsonBuilder.returnSuccessJson("\"角色用户添加成功\""));
        }else
            writeJSON(response,jsonBuilder.returnFailureJson("\"角色用户添加失败，详情请见错误日志\""));
       
    }
    
    
    /**
     * 获取指定角色的用户列表
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/getRoleUser")
    public void  getRoleUser(HttpServletRequest request, HttpServletResponse response) throws  IOException{
        String strData = "";
        Integer start = super.start(request);
        Integer limit = super.limit(request);
        String sort = StringUtils.convertSortToSql(super.sort(request));
        
        String roleId = request.getParameter("roleId");
        String xm = request.getParameter("xm");
        xm=xm==null?"":xm;
        //QueryResult<SysUser> qResult = thisService.getRoleUser(roleId, start, limit);
        
		String hql = "from SysUser as o inner join fetch o.sysRoles as r where r.uuid='" + roleId
				+ "' and r.isDelete=0 and o.isDelete=0 and o.xm like '%"+xm+"%'";	
		
		 if(StringUtils.isNotEmpty(sort)){
            hql += " order by ";
            hql+= sort;
        }
		 
		//List<SysUser> list = userSerive.doQuery(hql);

		QueryResult<SysUser> qr = userSerive.queryResult(hql, start, limit);
		  
		
        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }
}

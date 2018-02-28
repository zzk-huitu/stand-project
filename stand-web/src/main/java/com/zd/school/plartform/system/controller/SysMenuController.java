
package com.zd.school.plartform.system.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.model.SysMenu;
import com.zd.school.plartform.system.model.SysMenuChkTree;
import com.zd.school.plartform.system.model.SysMenuTree;
import com.zd.school.plartform.system.model.SysPermission;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysMenuService;
import com.zd.school.plartform.system.service.SysPerimissonService;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 系统菜单管理
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SysMenu")
public class SysMenuController extends FrameWorkController<SysMenu> implements Constant {

    @Resource
    private SysMenuService thisService; // service层接口
    @Resource
	private SysPerimissonService perimissonSevice;
    @Resource
    private SysUserService userSerive;


    /**
     * 获取菜单列表（非管理员只能看到解锁的菜单）
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/treeList")
    public void getTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String strData = "";
        String whereSql = request.getParameter("whereSql");
        String orderSql = request.getParameter("orderSql");

        SysUser currentUser = getCurrentSysUser();
        List<SysMenuTree> lists = new ArrayList<SysMenuTree>();
        if (currentUser.getUserName().equals(AdminType.ADMIN_USER_NAME)||getIsAdmin()==1)
            lists = thisService.getTreeList(whereSql, orderSql);
        else {
            whereSql += " and isnull(isHidden,'0')='0'";
            lists = thisService.getTreeList(whereSql, orderSql);
        }

        strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据        
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 获取某个角色的菜单列表
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/roleMenuList")
    public void getRoleMenuList(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String strData = "";
        String roleId = request.getParameter("roleId");
        if(roleId==null){
        	strData = JsonBuilder.getInstance().buildList(new ArrayList<>(), "");// 处理数据
        	writeJSON(response, strData);// 返回数据
        	return;
        }
        List<SysMenuTree> lists = thisService.getRoleMenuTreeList(roleId);
              
        strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 
     * 获取指定用户对指定角色的可授权菜单.（排除掉已对指定角色授权的菜单）.
     *
     * @author luoyibo
     * @param request
     * @param response
     * @throws IOException
     *             void
     * @throws @since
     *             JDK 1.8
     */
    @RequestMapping("/userPerToRole")
    public void getUserCanPermissionMenuToRole(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = "";
        String roleId = request.getParameter("roleId"); //要授权的角色
        if(roleId==null){
        	 strData = JsonBuilder.getInstance().buildList( new ArrayList<>(), "");// 处理数据
        	 writeJSON(response,strData);// 返回数据
        	 return;
        }
        SysUser currentUser = getCurrentSysUser();

        List<SysMenuChkTree> lists = thisService.getUserPermissionToRole(roleId, currentUser.getUuid());

        strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 添加菜单
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("MENUMANAGE_add")
    @RequestMapping("/doAdd")
    public void doAdd(SysMenu entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
    	
        Integer orderIndex = entity.getOrderIndex();
        String menuName = entity.getNodeText();
        String menuCode = entity.getMenuCode();
        String parentNode = entity.getParentNode();
      
        //此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0'";
        if (thisService.IsFieldExist("menuCode", menuCode, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"菜单编码不能重复！\""));
            return;
        }
        if (thisService.IsFieldExist("nodeText", menuName, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"菜单名称不能重复！\""));
            return;
        }
        String hql1 = " o.isDelete='0' and o.parentNode='" + parentNode + "' ";
        if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), "-1", hql1)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"同一级别已有此顺序号！\""));
            return;
        }
        //获取当前操作用户
        SysUser currentUser = getCurrentSysUser();
        
        //持久化到数据库
        entity = thisService.addMenu(entity, currentUser);
        
        if(entity==null)
        	writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));       
  
    }

    /**
     * 更新菜单
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("MENUMANAGE_update")
    @RequestMapping("/doUpdate")
    public void doUpdate(SysMenu entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        Integer orderIndex = entity.getOrderIndex();
        String menuName = entity.getNodeText();
        String menuCode = entity.getMenuCode();     
        String parentNode = entity.getParentNode();
        String uuid = entity.getUuid();
        //此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0'";
        if (thisService.IsFieldExist("menuCode", menuCode, uuid, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"菜单编码不能重复！\""));
            return;
        }
        if (thisService.IsFieldExist("nodeText", menuName, uuid, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"菜单名称不能重复！\""));
            return;
        }
        String hql1 = " o.isDelete='0' and o.parentNode='" + parentNode + "' ";
        if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), uuid, hql1)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"同一级别已有此顺序号！\""));
            return;
        }

        //获取当前的操作用户     
        SysUser currentUser = getCurrentSysUser();      
        entity=thisService.doUpdateMenu(entity, currentUser.getXm());
        
        if(entity==null)
       	 	writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));                      

    }

    /**
     * 解锁或锁定菜单
     * @param request
     * @param response
     * @throws IOException
     */
    @Auth("MENUMANAGE_lockFlag")
    @RequestMapping("/doSetLockFlag")
    public void doSetLockFlag(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        String lockFlag = request.getParameter("lockFlag");
        if (StringUtils.isEmpty(delIds)) {
            if (lockFlag.equals("0"))
                writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入要解锁的菜单\""));
            else
                writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入要锁定的菜单\""));
            return;
        } else {
            String hql = " update SysMenu set isHidden='" + lockFlag + "'  where uuid in ('" + delIds.replace(",", "','")  + "') ";
            thisService.doExecuteCountByHql(hql);
                       
            //删除有权限的角色的用户的redis数据
            String[] delIdArr=delIds.split(",");
            for(int i=0;i<delIdArr.length;i++){
            	SysPermission sysPermission= perimissonSevice.getByProerties("perCode", delIdArr[i]);
            	if(sysPermission!=null)
            		userSerive.deleteUserMenuTreeRedis(sysPermission);
            }
            
            writeJSON(response, jsonBuilder.returnSuccessJson("\"处理成功\""));
        }
    }
}

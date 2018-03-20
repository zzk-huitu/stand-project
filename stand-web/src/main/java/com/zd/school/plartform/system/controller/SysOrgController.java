
package com.zd.school.plartform.system.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.DBContextHolder;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseOrgChkTree;
import com.zd.school.plartform.baseset.model.BaseOrgToUP;
import com.zd.school.plartform.baseset.model.BaseOrgTree;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.model.SysUserToUP;
import com.zd.school.plartform.system.service.SysOrgService;

/**
 * 部门管理
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SysOrg")
public class SysOrgController extends FrameWorkController<BaseOrg> implements Constant {

	@Resource
	private SysOrgService thisService; // service层接口

    /**
     * 获取所有部门信息
     * @param request
     * @param response
     * @throws IOException
     */
	@RequestMapping("/treeList")
	public void getOrgTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		String orderSql = request.getParameter("orderSql");
        String excludes = super.excludes(request);

		SysUser currentUser = getCurrentSysUser();
		List<BaseOrgTree> lists = thisService.getOrgTreeList(whereSql, orderSql, currentUser);

		strData = JsonBuilder.getInstance().buildList(lists, excludes);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 获取带有选择框的部门树（★见getUserRightDeptTree方法，通过参数来判断是否显示复选框）
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/chkTreeList")
	public void getOrgChkTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		String orderSql = request.getParameter("orderSql");
		String deptId = request.getParameter("deptId")== null ?TreeVeriable.ROOT: request.getParameter("deptId");
		String excludes = super.excludes(request);

		SysUser currentUser = getCurrentSysUser();
		List<BaseOrgChkTree> lists = thisService.getOrgChkTreeList(whereSql, orderSql,deptId, currentUser);

		strData = JsonBuilder.getInstance().buildList(lists, excludes);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 根据用户的权限，来显示具备权限的树
	 * 注：将每个人的权限树的值，存入到redis中；在修改部门权限或指定部门岗位时删除redis数据。
	 * 通过excludes参数，来排除不需要的参数，如checked复选框参数
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/getUserRightDeptTree" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void getUserRightDeptTree( HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = "";
		// 得到根节点ID
		String node = request.getParameter("node");	//一般传 ROOT
		String nodeId = request.getParameter("nodeId");
		String excludes = request.getParameter("excludes");	//在结果集中排除某个字段，比如checked复选框字段
		if (!(StringUtils.isNotEmpty(node) && node.equalsIgnoreCase(TreeVeriable.ROOT))) {
			node = TreeVeriable.ROOT;
		}
		if (StringUtils.isNotEmpty(nodeId)) {
			node = nodeId;
		}
		
		SysUser currentUser = getCurrentSysUser();
		BaseOrgChkTree root = thisService.getUserRightDeptTree(currentUser, node);
		if (node.equalsIgnoreCase(TreeVeriable.ROOT)) {
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		} else {
			List<BaseOrgChkTree> alist = new ArrayList<BaseOrgChkTree>();
			alist.add(root);
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		}
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 获取用户有权限的部门id
	 */
	@RequestMapping(value = { "/getUserRightDeptIds" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void getUserRightDeptIds( HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		
		SysUser currentUser=getCurrentSysUser();
		
		List<BaseOrgChkTree> baseOrgList = thisService.getUserRightDeptTreeList(currentUser);
		String deptIds = baseOrgList.stream().filter((x) -> x.getIsRight().equals("1"))
				.map((x) -> x.getId()).collect(Collectors.joining("','"));					
		
		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(deptIds)));	// 返回数据
	}
	
	
    /**
     * 添加部门
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
	@Auth("DEPARTMENT_add")
	@RequestMapping("/doAdd")
	public void doAdd(BaseOrg entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String parentNode = entity.getParentNode();
		String parentName = entity.getParentName();
		String parentType = entity.getParentType();
		String nodeText = entity.getNodeText();
		//Integer orderIndex = entity.getOrderIndex();
		Integer defaultOrderIndex = Integer.valueOf(0);

		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String hql1 = " o.isDelete='0' and o.parentNode='" + parentNode + "' ";
/*		if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), "-1", hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("'同一级别已有此顺序号！'"));
			return;
		}*/
		if (thisService.IsFieldExist("nodeText", nodeText, "-1", hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("'同一级别已有此部门！'"));
			return;
		}
		//获取同一级别的顺序号
		String hql = " from BaseOrg where orderIndex = (select max(o.orderIndex) from BaseOrg o where  o.isDelete='0' and o.parentNode='" + parentNode + "' )";
		List list = thisService.queryByHql(hql);
		if (list.size() > 0) {
			defaultOrderIndex = (Integer) EntityUtil.getPropertyValue(list.get(0), "orderIndex") + 1;
		} else
			defaultOrderIndex = 0;
		entity.setOrderIndex(defaultOrderIndex);
		
		SysUser sysuser = getCurrentSysUser();
		
		entity = thisService.addOrg(entity, sysuser);
		entity.setParentName(parentName);
		entity.setParentNode(parentNode);
		entity.setParentType(parentType);
		
		// 返回的是实体前端界面
		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
	}

    /**
     * 删除部门
     * @param request
     * @param response
     * @throws IOException
     */
	@Auth("DEPARTMENT_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String deptId = request.getParameter("ids");
		if (StringUtils.isEmpty(deptId)) {
			writeJSON(response, JsonBuilder.getInstance().returnSuccessJson("\"没有传入删除主键\""));
			return;
		}
		SysUser currentUser = getCurrentSysUser();
		String flag = thisService.delOrg(deptId, currentUser);
		if ("1".equals(flag)) {
			writeJSON(response, JsonBuilder.getInstance().returnSuccessJson("\"删除成功\""));
		} else {
			writeJSON(response, JsonBuilder.getInstance().returnFailureJson("\""+flag+"\""));
		}
	}

	/**
	 * 
	 * doUpdates:修改部门信息.
	 *
	 * @author luoyibo
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 *             void
	 * @throws @since
	 *             JDK 1.8
	 */
	@Auth("DEPARTMENT_update")
	@RequestMapping("/doUpdate")
	public void doUpdate(BaseOrg entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String parentNode = entity.getParentNode();
		String parentName = entity.getParentName();
		String nodeText = entity.getNodeText();
		String uuid = entity.getUuid();
		Integer orderIndex = entity.getOrderIndex();
	//	Integer defaultOrderIndex = Integer.valueOf(0);

		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String hql1 = " o.isDelete='0' and o.parentNode='" + parentNode + "' ";
		if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), uuid, hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("'同一级别已有此顺序号！'"));
			return;
		}
		if (thisService.IsFieldExist("nodeText", nodeText, uuid, hql1)) {
			writeJSON(response, jsonBuilder.returnFailureJson("'同一级别已有此部门！'"));
			return;
		}
/*		BaseOrg baseOrg = thisService.get(uuid);
		if(!baseOrg.getParentNode().equals(parentNode)){//编辑时改变了它的上级部门，需要重新设置orderIndex
			// 获取同一级别的最大的顺序号
			String hql = " from BaseOrg where orderIndex = (select max(o.orderIndex) from BaseOrg o where  o.isDelete='0' and o.parentNode='"
					+ parentNode + "' )";
			List list = thisService.queryByHql(hql);
			if (list.size() > 0) {
				defaultOrderIndex = (Integer) EntityUtil.getPropertyValue(list.get(0), "orderIndex") + 1;
			} else
				defaultOrderIndex = 0;
			entity.setOrderIndex(defaultOrderIndex);
		}else{
			entity.setOrderIndex(baseOrg.getOrderIndex());
		}
*/
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doUpdate(entity, currentUser.getUuid());		
		
		
		if (entity == null){
			writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
		}else{
			//重新设定显示的数据
			entity.setParentName(parentName);
			entity.setParentNode(parentNode);
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		}	
	}
	
	/*
     * 单条数据调用同步UP的方式
     * 弃用
     * */
    @RequestMapping("/doSyncDeptInfoToUp/{smallDeptId}")
	public void doSyncDeptInfoToUp(@PathVariable("smallDeptId") String smallDeptId,HttpServletRequest request, HttpServletResponse response) throws IOException {
    	StringBuffer returnJson = null;
    	try{
    		
    		//String smallDeptId="12";
    	
    		// 1.查询这个smallDeptId的最新的部门信息
			String sql = "select EXT_FIELD04 as departmentId,EXT_FIELD05 as parentDepartmentId,"
					+ "	NODE_TEXT as departmentName,convert(varchar,NODE_LEVEL) as layer,"
					+ " convert(varchar,ORDER_INDEX) as layerorder  "
					+ " from BASE_T_ORG"
					+ " where isdelete=0 and EXT_FIELD04='"+smallDeptId+"'"
					+ " order by DepartmentID asc";
			
			List<BaseOrgToUP> deptInfo = thisService.queryEntityBySql(sql, BaseOrgToUP.class);
			
			//2.进入事物之前切换数据源		
			DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Up6);
			int row = 0;
			if(deptInfo.size()!=0){			
				row = thisService.syncDeptInfoToUP(deptInfo.get(0),smallDeptId);
			}else{			
				row = thisService.syncDeptInfoToUP(null, smallDeptId);			
			}
    		
			if(row==0){
				returnJson = new StringBuffer("{ \"success\" : true, \"msg\":\"未有部门数据需要同步！\"}");
			}else if(row>0){
				returnJson = new StringBuffer("{ \"success\" : true, \"msg\":\"同步部门数据成功！\"}");
			}else{
				returnJson = new StringBuffer("{ \"success\" : false, \"msg\":\"同步部门数据到UP失败，请联系管理员！\"}");
			}
				
	    } catch (Exception e) {
			returnJson = new StringBuffer("{ \"success\" : false, \"msg\":\"同步部门数据到UP失败，请联系管理员！\"}");
		} finally {
			// 恢复数据源
			DBContextHolder.clearDBType();
		}
	
		writeAppJSON(response, returnJson.toString());
    }
    
    
    /*
     * 所有部门数据调用同步UP的方式
     * 更新UP中的部门数据、更新UP用户的部门数据。
     * */
    @Auth("DEPARTMENT_sync")
    @RequestMapping("/doSyncAllDeptInfoToUp")
	public void doSyncAllDeptInfoToUp(HttpServletRequest request, HttpServletResponse response) throws IOException {
    	StringBuffer returnJson = null;
    	try{
    		
    		//String smallDeptId="12";
    		// 0.重新生成副ID
    		thisService.doCreateFuId();
    		
    		// 1.查询这个smallDeptId的最新的部门信息
			String sql = "select EXT_FIELD04 as departmentId,EXT_FIELD05 as parentDepartmentId,"
					+ "	NODE_TEXT as departmentName,convert(varchar,NODE_LEVEL) as layer,"
					+ " convert(varchar,ORDER_INDEX) as layerorder  "
					+ " from BASE_T_ORG"
					+ " where isdelete=0 and DEPT_ID!='ROOT' "
					+ " order by DepartmentID asc";
			
			List<BaseOrgToUP> deptInfo = thisService.queryEntityBySql(sql, BaseOrgToUP.class);
				
			//2.查询最新的用户、部门信息（若人员没有指定部门岗位，则设置为临时部门）
			sql = "select  u.USER_ID as userId,isnull(org.EXT_FIELD04,("
					+ "select top 1 EXT_FIELD04 from BASE_T_ORG where ISDELETE=0 and NODE_TEXT='临时部门'"
					+ "))as departmentId "
					+ " from SYS_T_USER u  left join BASE_T_ORG org on "
					+ " (select top 1 DEPT_ID from BASE_T_UserDeptJOB "
					+ " where USER_ID=u.USER_ID and ISDELETE=0 "
					+ " order by master_dept desc,CREATE_TIME desc)=org.dept_ID "
					+ " order by userId asc";
			List<SysUserToUP> userInfos = thisService.queryEntityBySql(sql, SysUserToUP.class);
			
			//3.进入事物之前切换数据源		
			DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Up6);
			int row = 0;
			if(deptInfo.size()!=0){			
				row = thisService.syncAllDeptInfoToUP(deptInfo);
			}
			
			//4.当部门数据同步更新了之后，再去更新up中用户的部门数据
			thisService.syncAllUserDeptInfoToUP(userInfos);	//执行
			
			
			if(row==0){
				returnJson = new StringBuffer("{ \"success\" : true, \"msg\":\"该部门数据已同步！\"}");
			}else if(row>0){
				returnJson = new StringBuffer("{ \"success\" : true, \"msg\":\"同步部门数据成功！\"}");
			}else{
				returnJson = new StringBuffer("{ \"success\" : false, \"msg\":\"同步部门数据到UP失败，请联系管理员！\"}");
			}
				
	    } catch (Exception e) {
			returnJson = new StringBuffer("{ \"success\" : false, \"msg\":\"同步部门数据到UP失败，请联系管理员！\"}");
		} finally {
			// 恢复数据源
			DBContextHolder.clearDBType();
		}
	
		writeAppJSON(response, returnJson.toString());
    }
}

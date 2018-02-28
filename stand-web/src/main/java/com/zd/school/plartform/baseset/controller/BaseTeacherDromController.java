package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseTeacherDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 教师宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseTeacherDrom")
public class BaseTeacherDromController extends FrameWorkController<DormTeacherDorm> implements Constant {
	@Resource
	BaseTeacherDormService thisService; // service层接口
	@Resource
	CommTreeService treeService; // 生成树
	@Resource
	BaseDormDefineService dormService; // service层接口
    @Resource
	SysUserService userService; // service层接口
  
    
    /**
     * 显示某个区域或房间下的教师入住信息
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute DormTeacherDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
    	    
    	String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String roomId = request.getParameter("roomId");		//前端传入若为区域，则是roomId，否则是dormId
		String roomLeaf = request.getParameter("roomLeaf");
        if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				if (StringUtils.isNotEmpty(filter)) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"dormId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"dormId\"}]";
				}
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getDormIds(roomId);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining(","));		
					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"dormId\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"dormId\"}]";
					}
					
				}else{	// 若区域之下没有房间，则直接返回空数据
					
					strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}				
			}
		}
		
		QueryResult<DormTeacherDorm> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据

	}

    /**
     * 显示所有有教师宿舍的区域树信息（与部门权限无关）
     * @param request
     * @param response
     * @throws IOException
     */
	@RequestMapping("/treelist")
	public void getGradeTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		List<CommTree> lists = treeService.getCommTree("JW_V_DORMALLOTTREE", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 得到某个宿舍的信息
	 * @param entity
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/getDefineInfo")
	public @ResponseBody BuildDormDefine getDefineInfo(DormTeacherDorm entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		String dormId = request.getParameter("dormId");
		return dormService.get(dormId);
	}
	
	/**
	 * 入住教师
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
    @Auth("BASETEACHERDORM_add")
	@RequestMapping("/doAdd")
	public void doAdd(DormTeacherDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		Boolean flag=false;
		Map<String, Object> hashMap = new HashMap<String, Object>();
		SysUser currentUser = getCurrentSysUser();

		flag=thisService.doAddDormTea(entity, hashMap, request, currentUser);
		flag =(Boolean) hashMap.get("flag")==null?true:(Boolean) hashMap.get("flag");
		if(flag){
			// 返回实体到前端界面
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		}else{
			StringBuffer teaName = (StringBuffer) hashMap.get("teaName");
			StringBuffer teaInRoom = (StringBuffer) hashMap.get("teaInRoom");
			writeJSON(response, jsonBuilder.returnFailureJson("'" + teaName.substring(0,teaName.length()-1) + "已存在" + teaInRoom.substring(0,teaInRoom.length()-1) + "教师宿舍'"));
			
		}

	}
    
    /**
     * 删除教师的入住或退住信息
     * @param request
     * @param response
     * @throws IOException
     */
    @Auth("BASETEACHERDORM_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		String roomIds = request.getParameter("roomIds");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			boolean flag = false;
			flag = thisService.doDelete(delIds);
			if (flag) {
				thisService.doSettingOff(roomIds);	//判断此宿舍是否已经没数据了
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}
    
    /*
	@RequestMapping("/doSetOff")
	public void doSetOff(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String roomIds = request.getParameter("roomIds");
        thisService.doSettingOff(roomIds);
			
	}*/

	// 退住
	@Auth("BASETEACHERDORM_out")
	@RequestMapping("/out")
	public void out(HttpServletRequest request, HttpServletResponse response) throws IOException {
		boolean flag = false;
	    String outIds = request.getParameter("ids");
		SysUser currentUser = getCurrentSysUser();
		if (StringUtils.isEmpty(outIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入退住主键\""));
			return;
		} else {
			flag = thisService.doOut(outIds, currentUser);	
		}
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"退住成功\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"退住失败\""));
		}
	}

	@RequestMapping("/getMax")
	public @ResponseBody DormTeacherDorm getMax(HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String dormId = request.getParameter("dormId");
		String sql = "SELECT MAX(ARK_NUM) arkNum,MAX(BED_NUM) bedNum FROM DORM_T_TEACHERDORM WHERE ISDELETE=0 AND IN_OUT=0 and DORM_ID='" + dormId
				+ "'";
		List<Object[]> list = thisService.queryObjectBySql(sql);
		DormTeacherDorm entity = new DormTeacherDorm();
		try {
			entity.setArkNum(Integer.parseInt(list.get(0)[0] + ""));
			entity.setBedNum(Integer.parseInt(list.get(0)[1] + ""));
		} catch (Exception e) {
			entity.setArkNum(0);
			entity.setBedNum(0);
		}
		return entity;
	}
	@RequestMapping("/getTeaDormXmb")
	public @ResponseBody BuildDormDefine getTeaDormXmb(HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String roomId = request.getParameter("roomId");
		String hql = " FROM  BuildDormDefine WHERE roomId='" + roomId + "'";
		BuildDormDefine entity= thisService.getEntityByHql(hql);
		return entity;
	}
	@RequestMapping(value = { "/getTeacherInUser" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void getTeacherInUser(HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String strData = ""; // 返回给js的数据
		QueryResult<SysUser> qr = userService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 获取某个区域下的所有教师宿舍数据
	 * 
	 * @param roomId
	 * @param roomLeaf
	 * @return
	 */
	private List<String> getDormIds(String areaId) {
		List<String> result = new ArrayList<>();

		// 当选择的区域不为房间时
		String sql = "select a.id from JW_V_DORMALLOTTREE a where a.leaf='true' and a.treeIds like '%"
				+ areaId + "%'";
		result = thisService.queryEntityBySql(sql, null);
		
		return result;
	}
}

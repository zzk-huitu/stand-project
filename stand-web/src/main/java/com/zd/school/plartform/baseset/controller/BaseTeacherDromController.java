package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.plartform.baseset.model.BaseCampus;
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
	
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute DormTeacherDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = "";
		String dormId = request.getParameter("dormId");
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ dormId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		String areaIds = "";
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}
		if (sb.length() > 0) {
			areaIds = sb.substring(0, sb.length() - 1);

			hql = "select a.uuid from BuildRoominfo a where a.isDelete=0 and a.roomType='1' and a.areaId in ('"
					+ areaIds.replace(",", "','") + "')";
			List<String> roomLists = thisService.queryEntityByHql(hql);
			sb.setLength(0);
			for (int i = 0; i < roomLists.size(); i++) {
				sb.append(roomLists.get(i) + ",");
			}
			// 房间id
			if (sb.length() > 0) {
				filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + sb.substring(0, sb.length() - 1)
						+ "\",\"field\":\"dormId\"}]";
			}else {
				filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + dormId + "\",\"field\":\"dormId\"}]";
			}
		} else {
			filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + dormId + "\",\"field\":\"dormId\"}]";
		}

		QueryResult<DormTeacherDorm> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据

	}

	@RequestMapping("/treelist")
	public void getGradeTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		List<CommTree> lists = treeService.getCommTree("JW_V_DORMALLOTTREE", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	@RequestMapping("/getDefineInfo")
	public @ResponseBody BuildDormDefine getDefineInfo(DormTeacherDorm entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		String dormId = request.getParameter("dormId");
		return dormService.get(dormId);
	}

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

	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			boolean flag = false;
			String[] delId = delIds.split(",");
			for (String id : delId) {
				flag = thisService.deleteByPK(id);
				// 应当移除门禁
			}
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}

	// 退住
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
			// 应当移除门禁
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
		String sql = "SELECT MAX(ARK_NUM) arkNum,MAX(BED_NUM) bedNum FROM DORM_T_TEACHERDORM WHERE DORM_ID='" + dormId
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
}


package com.zd.school.plartform.coursemanage.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.arrangecourse.model.JwCourseArrange;
import com.zd.school.jw.arrangecourse.model.JwFuncroomcourse;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService;
import com.zd.school.jw.arrangecourse.service.JwFuncroomcourseService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
/**
 * 功能室课程
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/FuncRoomCourse")
public class FuncRoomCourseController extends FrameWorkController<JwFuncroomcourse> implements Constant {

	@Resource
	CommTreeService treeService; // 生成树
	@Resource
	JwFuncroomcourseService thisService; // service层接口

	@Resource
	JwCourseArrangeService courseArrangeService; // service层接口。。。

	@RequestMapping("/treelist")
	public void getTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		
		//只显示功能室的房间
		List<CommTree> lists = treeService.getCommTree("JW_V_FUNCROOMTREE", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * @Title: list
	 * @Description: 查询数据列表
	 * @param entity
	 *            实体类
	 * @param request
	 * @param response
	 * @throws IOException
	 *             设定参数
	 * @return void 返回类型
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list( HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String roomId = request.getParameter("roomId");	//当为叶子时，此值为功能室的id，否则为区域的id
		String roomLeaf = request.getParameter("roomLeaf");
		
		if (StringUtils.isNotEmpty(roomId) && !AdminType.ADMIN_ORG_ID.equals(roomId)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				if (StringUtils.isNotEmpty(filter)) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"funcRoomId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId
							+ "\",\"field\":\"funcRoomId\"}]";
				}
			} else {					// 当选择的区域不为房间时
				List<String> roomList = getRoomIds(roomId);
					
				if(!roomList.isEmpty()){
					String roomIds=roomList.stream().collect(Collectors.joining(","));		
					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"funcRoomId\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + roomIds
								+ "\",\"field\":\"funcRoomId\"}]";
					}
					
				}else{	// 若区域之下没有房间，则直接返回空数据
					
					strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}				
			}
		}
		
		QueryResult<JwFuncroomcourse> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
		
	}

	/**
	 * 查询某个班级的课程安排情况
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = { "/getCourseByClass" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody List<JwCourseArrange> getCourseByClass(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String classId=request.getParameter("classId");
		String hql = "from JwCourseArrange where 1=1 and extField05=1 and isDelete=0 ";
		hql += " and claiId='"+classId+"'";
		hql += " order by teachTime asc";
		List<JwCourseArrange> list = courseArrangeService.queryByHql(hql);
		return list;
	}


	/**
	 * 
	 * @Title: doadd
	 * @Description: 增加新实体信息至数据库
	 * @param JwFuncroomcourse
	 *            实体类
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("FUNCROOMCOURSE_add")
	@RequestMapping("/doAddFuncRoomCourse")
	public void doAddFuncRoomCourse(String entitys, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等

		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		
		List<JwFuncroomcourse> funcRoomCourseList = null;
		if (null != entitys) {
			funcRoomCourseList = (List<JwFuncroomcourse>) JsonBuilder.getInstance().fromJsonArray(entitys, JwFuncroomcourse.class);
		}
		
		Integer result = thisService.doAddEntityList(funcRoomCourseList, currentUser);// 执行增加方法
		if (result>0)
			writeJSON(response, jsonBuilder.returnSuccessJson("\"添加功能室课程成功！\""));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"没有需要添加的班级课程！\""));

	}

	/**
	 * 
	 * @Title: doDelete
	 * @Description: 逻辑删除指定的数据
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("FUNCROOMCOURSE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDeleteByIds(delIds, currentUser);
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
			}
		}
	}

	/**
	 * @Title: doUpdate
	 * @Description: 编辑指定记录
	 * @param JwFuncroomcourse
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@RequestMapping("/doupdate")
	public void doUpdates(JwFuncroomcourse entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 入库前检查代码

		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		}
	}
	
	/**
	 * 获取某个区域下的所有功能室房间数据
	 * 
	 * @param roomId
	 * @param roomLeaf
	 * @return
	 */
	private List<String> getRoomIds(String areaId) {
		List<String> result = new ArrayList<>();

		// 当选择的区域不为房间时
		String sql = "select a.id from JW_V_FUNCROOMTREE a where a.leaf='true' and a.treeIds like '%"
				+ areaId + "%'";
		result = thisService.queryEntityBySql(sql, null);

		return result;
	}
}

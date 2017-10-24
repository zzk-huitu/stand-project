package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.excel.FastExcel;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.student.studentclass.model.JwClassstudent;

/**
 * 学生宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseStudentDorm")
public class BaseStudentDormController extends FrameWorkController<DormStudentDorm> implements Constant {
	@Resource
	BaseStudentDormService thisService; // service层接口
	@Resource
	CommTreeService treeService; // 生成树
	/*@Resource
	JwClassDormAllotService classDormService;// 班级宿舍
	@Resource
	JwClassstudentService classStuService; // 学生分班
	*//**
	 * 已入住宿舍学生列表 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<DormStudentDorm> qr = thisService.queryPageResult(super.start(request), Integer.MAX_VALUE,
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
   /**
	 * 生成树
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/classtreelist")
	public void classtreelist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String node = request.getParameter("node");
		String nodeId = request.getParameter("nodeId");
		String excludes = request.getParameter("excludes");
		if (!(StringUtils.isNotEmpty(node) && node.equalsIgnoreCase(TreeVeriable.ROOT))) {
			node = TreeVeriable.ROOT;
		}
		if (StringUtils.isNotEmpty(nodeId)) {
			node = nodeId;
		}
		SysUser currentUser = getCurrentSysUser();
		CommTree root = thisService.getCommTree(node, "05", currentUser);
		if (node.equalsIgnoreCase(TreeVeriable.ROOT)) {
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		} else {
			List<CommTree> alist = new ArrayList<CommTree>();
			alist.add(root);
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		}
		writeJSON(response, strData);// 返回数据
	}
	/**
	 * 班级下面宿舍列表
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	/*@RequestMapping(value = { "/dormAllotlist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void dormAllotlist(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<JwClassDormAllot> qr = classDormService.doPaginationQuery(super.start(request), Integer.MAX_VALUE,
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	*//**
	 * 未分配宿舍学生列表
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 *//*
	@RequestMapping(value = { "/stuNotAllotlist" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void stuNotAllotlist(@ModelAttribute JwClassstudent entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		// hql语句
		StringBuffer hql = new StringBuffer("from " + entity.getClass().getSimpleName() + "");
		// 总记录数
		StringBuffer countHql = new StringBuffer("select count(*) from " + entity.getClass().getSimpleName() + "");
		String whereSql = entity.getWhereSql();// 查询条件
		String parentSql = entity.getParentSql();// 条件
		String querySql = entity.getQuerySql();// 查询条件
		String orderSql = entity.getOrderSql();// 排序
		hql.append(whereSql);
		hql.append(parentSql);
		hql.append(querySql);
		hql.append(orderSql);
		countHql.append(whereSql);
		countHql.append(querySql);
		countHql.append(parentSql);
		List<JwClassstudent> lists = classStuService.queryPageResult(hql.toString(), 0, 0);// 执行查询方法
		Integer count = thisService.getCount(countHql.toString());// 查询总记录数
		strData = jsonBuilder.buildObjListToJson(new Long(count), lists, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}*/
	/*// 导出EXCEL
	@RequestMapping("/exportExcel")
	public void exportExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String claiId = request.getParameter("claiId");
		String sql = "select id,level from JW_V_GRADECLASSTREE where level=3 and treeids like '%" + claiId + "%'";
		List<Object[]> lists = thisService.queryObjectBySql(sql);
		List<DormStudentDorm> list = new ArrayList<DormStudentDorm>();
		List<DormStudentDorm> temp = null;
		for (Object[] obj : lists) {
			if (obj[1].toString().equals("3")) {
				String hql = "from DormStudentDorm where claiId='" + obj[0] + "' and isDelete=0 order by inTime";
				temp = thisService.queryByHql(hql);
				list.addAll(temp);
			}
		}
		FastExcel.exportExcel(response, "学生宿舍分配信息", list);
	}*/
}

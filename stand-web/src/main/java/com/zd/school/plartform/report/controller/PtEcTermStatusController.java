package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtEcTermStatus;
import com.zd.school.excel.FastExcel;
import com.zd.school.plartform.basedevice.service.PtEcTermStatusService;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 电控使用状态表
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtEcTermStatus")
public class PtEcTermStatusController extends FrameWorkController<PtEcTermStatus> implements Constant {

	@Resource
	PtEcTermStatusService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树

	// 导出
/*
	@RequestMapping(value = { "/listDl" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void listDl(@ModelAttribute PtEcTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		// hql语句
		StringBuffer hql = new StringBuffer("EXEC PT_EC_TERMSTATUS_INFO ");
		// 总记录数
		List<PtEcTermStatusDk> newList = new ArrayList<>();
		PtEcTermStatusDk statu = null;
		if (entity.getWheresql1() != null)
			if (entity.getWheresql1().equals(""))
				entity.setWheresql1(null);
		if (entity.getWheresql2() != null)
			if (entity.getWheresql2().equals(""))
				entity.setWheresql2(null);
		String wheresql = entity.getWheresql2();
		if (wheresql != null && !wheresql.equals("")) {
			String str1 = wheresql.substring(0, wheresql.lastIndexOf("and statusDate") - 1);
			String str2 = wheresql.substring(wheresql.lastIndexOf("and statusDate"));
			str1 = "\'" + str1.substring(0, str1.indexOf("\'")) + "\'" + str1.substring(str1.indexOf("\'"));
			str2 = "\'" + str2.substring(0, str2.indexOf("\'")) + "\'" + str2.substring(str2.indexOf("\'")) + "''";
			hql.append(entity.getWheresql1());
			hql.append("," + str1 + str2);
		} else {
			hql.append(entity.getWheresql1());
			hql.append("," + entity.getWheresql2());
		}
		List lists = thisService.doQuerySql(hql.toString());// 执行查询方法
		for (int i = 0; i < lists.size(); i++) {
			statu = new PtEcTermStatusDk();
			Object[] obj = (Object[]) lists.get(i);
			if (obj[0] != null)
				statu.setTermNo(obj[0].toString());
			if (obj[1] != null)
				statu.setTermName(obj[1].toString());
			if (obj[2] != null)
				statu.setTermTypeId(obj[2].toString());
			if (obj[3] != null)
				statu.setGatewayName(obj[3].toString());
			if (obj[4] != null)
				statu.setRoomName(obj[4].toString());
			if (obj[5] != null)
				statu.setAreaName(obj[5].toString());
			if (obj[6] != null)
				statu.setStartDl(obj[6].toString());
			if (obj[7] != null)
				statu.setEndDl(obj[7].toString());
			if (obj[8] != null)
				statu.setSumDl(obj[8].toString());
			newList.add(statu);
		}
		if (request.getParameter("iden") != null) {
			FastExcel.exportExcel(response, "电控费率信息", newList);
			return;
		}
		strData = jsonBuilder.buildObjListToJson(new Long(newList.size()), newList, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
*/
	/**
	 * 生成树
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/treelist")
	public void getGradeTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		//List<CommTreeChk> lists = treeService.getCommTreeChk("JW_AREAROOMTERMTREE", whereSql);
		  List<CommTreeChk> lists = treeService.getCommTreeChk("JW_AREAROOMINFOTREE", whereSql);
		
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtEcTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtEcTermStatus> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/dodelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids = request.getParameter("ids");
		if (StringUtils.isEmpty(ids)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser=getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE,currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		}
	}

	/**
	 * 修改
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doupdate")
	public void doUpdates(PtEcTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		if (currentUser != null)
			userCh = currentUser.getXm();
		// 先拿到已持久化的实体
		// entity.getSchoolId()要自己修改成对应的获取主键的方法
		PtEcTermStatus perEntity = thisService.get(entity.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		perEntity.setUpdateUser(userCh);

		entity = thisService.merge(perEntity);// 执行修改方法

		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));

	}

}

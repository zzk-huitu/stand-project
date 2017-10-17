package com.zd.school.plartform.baseset.controller;

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
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.control.device.model.MjUserright;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.jw.push.service.PushInfoService;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseTeacherDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.salary.salary.model.XcSalaryitem;

/**
 * 教师宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseTeacherDrom")
public class BaseTeacherDromController extends FrameWorkController<DormTeacherDorm> implements Constant  {
	@Resource
	BaseTeacherDormService thisService; // service层接口
    @Resource
	CommTreeService treeService; // 生成树
    @Resource
	BaseDormDefineService dormService; // service层接口
    @Resource
    BasePtTermService ptTermService;
   // @Resource
	//MjUserrightService mjService;
    @Resource
	PushInfoService pushService;
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute XcSalaryitem entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		String strData = ""; // 返回给js的数据
		SysUser currentUser = getCurrentSysUser();
		String whereSql = super.querySql(request);
		String orderSql = super.orderSql(request);
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);

		String id = request.getParameter("id");
		String sql = "SELECT * FROM JW_DORMALLOTTREE where id='" + id + "'";

		List<Object[]> list = thisService.queryObjectBySql(sql);
		Object[] obj = list.get(0);
		int level = Integer.parseInt(obj[4] + "");
		if (level == 1) {
			whereSql = "";
		} else if (level != 5) {
			sql = "SELECT id FROM JW_DORMALLOTTREE WHERE parent IN('" + obj[0] + "')";
			for (int i = level + 1; i < 5; i++) {
				sql = "SELECT id FROM JW_DORMALLOTTREE WHERE parent IN(" + sql + ")";
			}
			list = thisService.queryObjectBySql(sql);
			StringBuffer ids = new StringBuffer();
			for (int i = 0; i < list.size(); i++) {
				ids.append("'" + list.get(i) + "',");
			}
			try {
				id = StringUtils.trimLast(ids.toString());
				whereSql = " and dormId in(" + id + ")";
			} catch (Exception e) {
				whereSql=" and 1=2";
			}
		}

		QueryResult<DormTeacherDorm> qResult = thisService.list(start, limit, sort, filter, whereSql, orderSql,
				currentUser);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	@RequestMapping("/treelist")
	public void getGradeTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		List<CommTree> lists = treeService.getCommTree("JW_DORMALLOTTREE", whereSql);
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
		// 此处为放在入库前的一些检查的代码，如唯一校验等

		// 获取当前操作用户
		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		if (currentUser != null)
			userCh = currentUser.getXm();
		String roomName = request.getParameter("roomName");

		String bedCounts = request.getParameter("bedCount");
		String arkCounts = request.getParameter("arkCount");
		String userNumbs = request.getParameter("userNumb");
		String sendCheckNames = request.getParameter("sendCheckName");
		String tteacIds = entity.getTteacId();

		String[] tteacIdArr = tteacIds.split(",");
		String[] bedCount = bedCounts.split(",");
		String[] arkCount = arkCounts.split(",");
		String[] userNumb = userNumbs.split(",");
		String[] sendCheckName = sendCheckNames.split(",");

		List<String> excludedProp = new ArrayList<String>();
		excludedProp.add("uuid");
		for (int i = 0; i < tteacIdArr.length; i++) {
			DormTeacherDorm perEntity = new DormTeacherDorm();
			BeanUtils.copyProperties(perEntity, entity, excludedProp);
			// 生成默认的orderindex
			// 如果界面有了排序号的输入，则不需要取默认的了
			Integer orderIndex = thisService.getDefaultOrderIndex(entity);
			perEntity.setOrderIndex(orderIndex);// 排序
			// 增加时要设置创建人
			perEntity.setCreateUser(userCh); // 创建人
			perEntity.setTteacId(tteacIdArr[i]);
			perEntity.setArkNum(Integer.parseInt(arkCount[i]));
			perEntity.setBedNum(Integer.parseInt(bedCount[i]));
			// 持久化到数据库
			entity = thisService.merge(perEntity);
			
			//写入门禁权限
			List<PtTerm> ptTrems=ptTermService.queryByProerties("roomId", entity.getRoomId());
			for (PtTerm ptTerm : ptTrems) {
				MjUserright mj=new MjUserright();
				mj.setStatusID(0);
				mj.setStuId(userNumb[i]);
				mj.setTermId(ptTerm.getUuid());
				//mjService.merge(mj);
			}
			
			
			//推送消息
			String regStatus = "您好," + sendCheckName[i] + "老师,您已经成功分配至" + roomName + "房间,床位编号:" + bedCount[i] + ",柜子编号:"
					+ arkCount[i];
			//pushService.pushInfo(sendCheckName[i], userNumb[i], "事件提醒",regStatus,currentUser);
		}

		// 返回实体到前端界面
		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
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

}

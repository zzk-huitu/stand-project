package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtSkTermStatus;
import com.zd.school.excel.FastExcel;
import com.zd.school.plartform.basedevice.service.PtSkTermStatusService;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 水控使用状态表
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtSkTermStatus")
public class PtSkTermStatusController extends FrameWorkController<PtSkTermStatus> implements Constant  {

	@Resource
	PtSkTermStatusService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtSkTermStatus> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	/*
	@RequestMapping(value = { "/statistics" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void statistics(@ModelAttribute PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		  String strData = ""; // 返回给js的数据
			Integer start = super.start(request);
			Integer limit = super.limit(request);
			String sort = super.sort(request);
			String querySql = querySql(request);
			String orderSql = orderSql(request);
			String select=" select SUM(a.USELITER) as useliter,MIN(a.TOTALUSEDLITER) as TOTALUSEDLITERmin,MAX(a.TOTALUSEDLITER) as TOTALUSEDLITERmax,"
					+ " c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT,	e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID	";
			String sqlsub=" from dbo.PT_SK_TERMSTATUS a"
					+ "	LEFT JOIN dbo.PT_TERM C ON c.TERMSN=a.TERMSN	"
					+ "LEFT JOIN dbo.BUILD_T_ROOMINFO D ON a.ROOM_ID=D.ROOM_ID	"
					+ "LEFT JOIN dbo.BUILD_T_ROOMAREA F ON d.AREA_ID=f.AREA_ID	"
					+ "LEFT JOIN dbo.PT_GATEWAY E ON c.GATEWAY_ID=e.GATEWAY_ID  where 1=1 ";
			orderSql=	 " GROUP BY 	c.TERMNAME,D.ROOM_NAME,a.TERMSN,f.NODE_TEXT, e.GATEWAYNAME,c.TERMNO,c.TERMTYPEID ";
			String sql1=" select count(*) from PT_V_USERROOM where 1=1 ";
	        QueryResult qResult = thisService.getDao().getForValuesToSql(start, limit, querySql,orderSql,select+sqlsub, " WITH query AS  ("+select+sqlsub+querySql+orderSql+" )  select count(1) from query");
			if (request.getParameter("iden") != null) {
				String[] strings=new String[]{"useliter","TOTALUSEDLITERmin","TOTALUSEDLITERmax","TERMNAME","ROOM_NAME",
					"TERMSN","NODE_TEXT","GATEWAYNAME","TERMNO","TERMTYPEID"};
				List<Map> list=qResult.getResultList();
				List<PtEcTermStatusSK> newlist= new ArrayList<>();
				for(Map map:list){
					PtEcTermStatusSK sk=new PtEcTermStatusSK();
					sk.setStartDl((BigDecimal) map.get("useliter"));
					sk.setEndDl((BigDecimal) map.get("TOTALUSEDLITERmin"));
					sk.setSumDl((BigDecimal) map.get("TOTALUSEDLITERmax"));
					sk.setAreaName((String) map.get("NODE_TEXT"));
					sk.setRoomName((String) map.get("ROOM_NAME"));
					sk.setTermName((String) map.get("TERMNAME"));
					sk.setTermNo((String) map.get("TERMSN"));
					sk.setGatewayName((String) map.get("GATEWAYNAME"));
					newlist.add(sk);
			
				}
				FastExcel.exportExcel(response, "水控统计表", newlist);
				return;
			}
	        
	        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	
	}
*/
	
	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/dodelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids=request.getParameter("ids");
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
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doupdate")
	public void doUpdates(PtSkTermStatus entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		if (currentUser != null)
			userCh = currentUser.getXm();
		// 先拿到已持久化的实体
		// entity.getSchoolId()要自己修改成对应的获取主键的方法
		PtSkTermStatus perEntity = thisService.get(entity.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		perEntity.setUpdateUser(userCh);

		entity = thisService.merge(perEntity);// 执行修改方法

		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));

	}
	
}

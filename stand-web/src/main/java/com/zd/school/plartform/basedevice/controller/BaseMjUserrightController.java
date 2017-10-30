package com.zd.school.plartform.basedevice.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.BaseControllerDateSoureTwo;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.MjUserright;
import com.zd.school.control.device.model.PtGateway;
import com.zd.school.plartform.basedevice.service.MjUserrightService;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: MjUserrightController Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 门禁权限表(MJ_UserRight)实体Controller. date:
 * 2016-09-08
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/BaseMjUserright")
public class BaseMjUserrightController extends BaseControllerDateSoureTwo {

	@Resource
	MjUserrightService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtGateway entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据

		QueryResult<MjUserright> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据

		writeJSON(response, strData);// 返回数据
		
	}
	
	
	
}

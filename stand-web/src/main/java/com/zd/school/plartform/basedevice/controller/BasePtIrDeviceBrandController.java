package com.zd.school.plartform.basedevice.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.control.device.model.PtIrDeviceBrand;
import com.zd.school.plartform.basedevice.service.PtIrDeviceBrandService;
import com.zd.school.plartform.basedevice.service.PtIrRoomDeviceService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 红外设备品牌型号
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/BasePtIrDeviceBrand")
public class BasePtIrDeviceBrandController extends FrameWorkController<PtIrDeviceBrand> implements Constant  {
	
	@Resource
	PtIrDeviceBrandService thisService; // service层接口
	@Resource
	PtIrRoomDeviceService deveiceService; // service层接口
	@Resource
	CommTreeService treeService;

	/**
	 * 品牌树
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/treelist")
	public void getTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		List<CommTree> lists = treeService.getCommTree("PT_V_DEVICE_BRANDTREE", " and 1=1");
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
	public void list(@ModelAttribute PtIrDeviceBrand entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String brandId = request.getParameter("brandId");
		String level = request.getParameter("level");
		if(StringUtils.isNotEmpty(filter) && filter.length()>0){
			if(StringUtils.isEmpty(brandId)&&StringUtils.isEmpty(level)){
				brandId = "d9012b05-e85e-449d-82fc-4a424dee9b00";
				level = "1";
			}
		}
		
		if(level.equals("3")){//品牌类型以下的子节点
			if (StringUtils.isNotEmpty(filter)) {
				filter = filter.substring(0, filter.length() - 1)
						+ ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + brandId
						+ "\",\"field\":\"parentNode\"}]";
			} else {
				filter = "[{'type':'string','comparison':'=','value':'" + brandId + "','field':'parentNode'}]";
			}
     	}else{
			String hql="";
			if(brandId.equals("d9012b05-e85e-449d-82fc-4a424dee9b00")){//所有品牌
				hql="select a.uuid from PtIrDeviceBrand a where a.isDelete=0  and a.level=3";
			}else{//品牌类型
				hql="select a.uuid from PtIrDeviceBrand a where a.isDelete=0  and a.level=3 and a.parentNode like '%"+brandId+"%'";
			}
		    List<String> categorylists=thisService.queryEntityByHql(hql);
		    if(!categorylists.isEmpty()){
				 String brandIds=categorylists.stream().collect(Collectors.joining(","));
				if(StringUtils.isNotEmpty(filter)){			
			    	filter = filter.substring(0,filter.length() - 1)+",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ brandIds+"\",\"field\":\"parentNode\"}]";	
			    }else{
			    	filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ brandIds+"\",\"field\":\"parentNode\"}]";
			    }
			}else{
				strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
				writeJSON(response, strData);// 返回数据
				return;
			}
		}
		QueryResult<PtIrDeviceBrand> qResult = thisService.queryPageResult(super.start(request), super.limit(request),super.sort(request), filter, true);
        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @Title: doadd
	 * @Description: 增加新实体信息至数据库
	 * @param PtIrDeviceBrand
	 *            实体类
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("IRDEVICE_add")
	@RequestMapping("/doAdd")
	public void doAdd(PtIrDeviceBrand entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等

		// 获取当前操作用户
		PtIrDeviceBrand bar = null;
		SysUser currentUser = getCurrentSysUser();
		Integer level = entity.getLevel();
		if (level != 4)
			if (thisService.IsFieldExist("brandname", entity.getBrandname(), "-1"," isDelete=0")) {
				writeJSON(response, jsonBuilder.returnFailureJson("'" + entity.getBrandname() + "已存在'"));
				return;
			}
		
		if (level == 4) {
			if (thisService.IsFieldExist("productModel", entity.getProductModel(), "-1"," isDelete=0")) {
				writeJSON(response, jsonBuilder.returnFailureJson("'" + entity.getProductModel() + "已存在'"));
				return;
			}
			bar = thisService.get(entity.getParentNode());
			entity.setDeviceTypeCode(bar.getDeviceTypeCode());
		} else {
			if (level == 3) {
				bar = thisService.get(entity.getParentNode());
				entity.setDeviceTypeCode(bar.getUuid());
			}
		}
		entity = thisService.doAddEntity(entity, currentUser);// 执行增加方法
		if (ModelUtil.isNotNull(entity))
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据增加失败,详情见错误日志\""));
		
	}
	
	/**
	 * @Title: doUpdate
	 * @Description: 编辑指定记录
	 * @param PtIrDeviceBrand
	 * @param request
	 * @param response
	 * @return void 返回类型
	 * @throws IOException
	 *             抛出异常
	 */
	@Auth("IRDEVICE_update")
	@RequestMapping("/doUpdate")
	public void doUpdates(PtIrDeviceBrand entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 入库前检查代码

		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));
		}
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
	@Auth("IRDEVICE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids = request.getParameter("ids");
		if (StringUtils.isEmpty(ids)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			String hql = " from PtIrRoomDevice a where a.isDelete=0 and a.brandId  in ('" + ids.replace(",", "','")
					+ "')";
			List lists = deveiceService.queryByHql(hql);
			if (lists.size() > 0) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"该品牌已经绑定房间，不能删除！\""));
				return;
			}
			boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE, currentUser.getXm());

			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情请见日志\""));
			}

		}
	}
    @Auth("IRDEVICE_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportDeviceBrandIsEnd", "0");
		request.getSession().removeAttribute("exportDeviceBrandIsState");
		String productModel = request.getParameter("productModel");
		String brandId = request.getParameter("brandId");
        String level = request.getParameter("level");


		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 25, 15, 40};
		List<PtIrDeviceBrand> deviceBrandList = null;
		String hql = " from PtIrDeviceBrand a where a.isDelete=0 ";
	
		if(StringUtils.isNotEmpty(level)&&level.equals("3")){
			hql+=" and a.parentNode = '"+brandId+"' ";
		}else{
			if(brandId.equals("d9012b05-e85e-449d-82fc-4a424dee9b00")){//所有品牌
				hql =" select a from PtIrDeviceBrand a left join PtIrDeviceBrand b on a.parentNode = b.uuid where a.isDelete=0 "
						+ " and b.isDelete=0 and b.level=3";
			}else{
				hql =" select a from PtIrDeviceBrand a left join PtIrDeviceBrand b on a.parentNode = b.uuid where a.isDelete=0 "
						+ " and b.isDelete=0 and b.level=3 and b.parentNode like '%"+brandId+"%'";
			}
		}
		
		if(StringUtils.isNotEmpty(productModel)){
			hql+=" and a.productModel like '%"+productModel+"%' ";
		}
		deviceBrandList = thisService.queryByHql(hql);

		List<Map<String, String>> deviceBrandExpList = new ArrayList<>();
		Map<String, String> deviceBrandMap = null;
		int i=1;
		for (PtIrDeviceBrand deviceBrand : deviceBrandList) {
			deviceBrandMap = new LinkedHashMap<>();
			deviceBrandMap.put("xh", i+"");
			deviceBrandMap.put("productModel", deviceBrand.getProductModel());
			deviceBrandMap.put("brandname", deviceBrand.getBrandname());
			deviceBrandMap.put("notes", deviceBrand.getNotes());
			i++;
			deviceBrandExpList.add(deviceBrandMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", deviceBrandExpList);
		courseAllMap.put("title", null);
		courseAllMap.put("head", new String[] { "序号", "型号", "品牌", "备注"}); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "红外设备", "红外设备", allList);
		if (result == true) {
			request.getSession().setAttribute("exportDeviceBrandIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportDeviceBrandIsEnd", "0");
			request.getSession().setAttribute("exportDeviceBrandIsState", "0");
		}

	}

	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportDeviceBrandIsEnd");
		Object state = request.getSession().getAttribute("exportDeviceBrandIsState");
		if (isEnd != null) {
			if ("1".equals(isEnd.toString())) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"文件导出完成！\""));
			} else if (state != null && state.equals("0")) {
				writeJSON(response, jsonBuilder.returnFailureJson("0"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"文件导出未完成！\""));
			}
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"文件导出未完成！\""));
		}
	}
}

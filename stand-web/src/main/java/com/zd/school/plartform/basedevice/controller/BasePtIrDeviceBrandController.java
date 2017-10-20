package com.zd.school.plartform.basedevice.controller;

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
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtIrDeviceBrand;
import com.zd.school.control.device.model.PtIrRoomDevice;
import com.zd.school.control.device.model.PtSkMeter;
import com.zd.school.plartform.basedevice.service.BasePtSkMeterService;
import com.zd.school.plartform.basedevice.service.PtIrDeviceBrandService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 水控流量计表
 * @author hucy
 *
 */
@Controller
@RequestMapping("/BasePtIrDeviceBrand")
public class BasePtIrDeviceBrandController extends FrameWorkController<PtIrDeviceBrand> implements Constant  {
	
	@Resource
	PtIrDeviceBrandService thisService; // service层接口
	
	@Resource
	CommTreeService treeService;

	/**
	 * 生成树
	 * 
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
		String leaf = request.getParameter("leaf");
		String brandId = request.getParameter("brandId");
		String level = request.getParameter("level");
		
		
		//根据leaf判断到底是传入的品牌ID还是类型ID(为true则是品牌id,为false则是类型id)
		if(level.equals("3")){
			filter = "[{'type':'string','comparison':'=','value':'" + brandId + "','field':'parentNode'}]";
			QueryResult<PtIrDeviceBrand> qResult = thisService.queryPageResult(super.start(request), super.limit(request),super.sort(request), filter, true);
	        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
	        writeJSON(response, strData);// 返回数据
		}else{
			String hql="";
			if(brandId.equals("d9012b05-e85e-449d-82fc-4a424dee9b00")){
				hql="select a.uuid from PtIrDeviceBrand a where a.isDelete=0  and a.level=3";
			}else{
				//若此类型不为品牌，则去查询此类型下的所有品牌
				hql="select a.uuid from PtIrDeviceBrand a where a.isDelete=0  and a.level=3 and a.parentNode like '%"+brandId+"%'";
			}
			//创建categorylists存储类型id
			List<String> categorylists=thisService.queryEntityByHql(hql);
			
			StringBuffer categorysb=new StringBuffer();
			for(int i=0;i<categorylists.size();i++){
				categorysb.append("'"+categorylists.get(i)+"'"+",");
			}
			
			if(categorysb.length()>0){
				//创建brandLists存储品牌id
				List<String> brandLists = new ArrayList<>();
				hql="select a.uuid from PtIrDeviceBrand a where a.uuid in ("+categorysb.substring(0,categorysb.length()-1) +")";
				brandLists=thisService.queryEntityByHql(hql);
				
				StringBuffer brandsb=new StringBuffer();
				//通过循环处理brand数据
				for(int i=0;i<brandLists.size();i++){
					brandsb.append(brandLists.get(i)+",");
				}
						
				filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ brandsb.substring(0,brandsb.length()-1)+"\",\"field\":\"parentNode\"}]";
				QueryResult<PtIrDeviceBrand> qResult = thisService.queryPageResult(super.start(request), super.limit(request),super.sort(request), filter, true);
		        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		        writeJSON(response, strData);// 返回数据
		        
			}else{
				writeJSON(response, jsonBuilder.returnSuccessJson("\"该区域下暂无数据\""));
			}
		}
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
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids = request.getParameter("ids");
		if (StringUtils.isEmpty(ids)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE,currentUser.getXm());
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,品牌已经绑定房间\""));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情见错误日志\""));
			}
		}
	}
	
}

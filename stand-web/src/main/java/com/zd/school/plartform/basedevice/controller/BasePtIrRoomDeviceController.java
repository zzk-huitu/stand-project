package com.zd.school.plartform.basedevice.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
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
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.control.device.model.PtIrRoomDevice ;
import com.zd.school.plartform.basedevice.service.PtIrRoomDeviceService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: PtIrRoomDeviceController
 * Function:  ADD FUNCTION. 
 * Reason:  ADD REASON(可选). 
 * Description: 房间红外设备(PT_IR_ROOM_DEVICE)实体Controller.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/BasePtIrRoomDevice")
public class BasePtIrRoomDeviceController extends FrameWorkController<PtIrRoomDevice> implements Constant {

    @Resource
    PtIrRoomDeviceService thisService; // service层接口
    
    @Resource
	BaseOfficeAllotService baseOfficeAllotService; // service层接口
    
    @Resource
    BaseRoominfoService baseRoominfoService ;

    @Resource
    CommTreeService treeService;
    /**
      * @Title: list
      * @Description: 查询数据列表
      * @param entity 实体类
      * @param request
      * @param response
      * @throws IOException    设定参数
      * @return void    返回类型
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(@ModelAttribute PtIrRoomDevice entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
		
    	String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String roomId = request.getParameter("roomId");
		if(roomId==null){
			 roomId=""; 
		 }
		String hql = "select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"
				+ roomId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		String areaIds = "";
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}
		if (sb.length() > 0) {
			areaIds = sb.substring(0, sb.length() - 1);

			hql = "select a.uuid from BuildRoominfo a where a.isDelete=0  and a.areaId in ('"
					+ areaIds.replace(",", "','") + "')";
			List<String> roomLists = thisService.queryEntityByHql(hql);
			sb.setLength(0);
			for (int i = 0; i < roomLists.size(); i++) {
				sb.append(roomLists.get(i) + ",");
			}
			// 房间id
			if (sb.length() > 0) {
				if(filter!=null){
					filter = filter.substring(0, filter.length()-1);
					filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"roomId\"}"+"]";
				}else{
					filter="[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"roomId\"}]";
				}
			}else {//区域下没有房间
				if(filter!=null){
					 filter = filter.substring(0, filter.length()-1);
					 filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ roomId +"\",\"field\":\"roomId\"}"+"]";
				}else{
					 filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId + "\",\"field\":\"roomId\"}]";	
				}
			}
		} else {//传进来的是房间id 或者 roomId为空时，即直接点击快速搜索查询
			if(filter!=null){
				 if(roomId!=null){
					 filter = filter.substring(0, filter.length()-1);
					 filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ roomId +"\",\"field\":\"roomId\"}"+"]";	 
				 }
			}else{
				 filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + roomId + "\",\"field\":\"roomId\"}]";	
			}
			
		}
		
		QueryResult<PtIrRoomDevice> qResult = thisService.queryPageResult(super.start(request), super.limit(request),super.sort(request), filter, true);
        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    @RequestMapping("/treelist")
	public void getGradeTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		List<CommTree> lists = treeService.getCommTree("JW_V_AREAROOMINFOTREE", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}
    /**
     * 
      * @Title: doadd
      * @Description: 增加新实体信息至数据库
      * @param PtIrRoomDevice 实体类
      * @param request
      * @param response
      * @return void    返回类型
      * @throws IOException    抛出异常
     */
    @RequestMapping("/doAdd")
    public void doAdd(PtIrRoomDevice entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        String[] roomId=entity.getRoomId().split(",");
        String[] brandId=entity.getBrandId().split(",");
      //获取当前操作用户
      		SysUser currentUser = getCurrentSysUser();
        PtIrRoomDevice roomDevice=null;
        for (int i = 0; i < brandId.length; i++) {
			for (int j = 0; j < roomId.length; j++) {
				String[] name={"roomId","brandId"};
				String[] value={roomId[j],brandId[i]};
				roomDevice=thisService.getByProerties(name, value);
				if(roomDevice!=null){
					roomDevice.setBrandId(brandId[i]);
					roomDevice.setUpdateTime(new Date());
					roomDevice.setIsDelete(0);
					roomDevice.setUpdateUser(currentUser.getXm());
					thisService.merge(roomDevice);
				}else{
					roomDevice=new PtIrRoomDevice();
					roomDevice.setBrandId(brandId[i]);
					roomDevice.setRoomId(roomId[j]);
					roomDevice.setCreateTime(new Date());
					roomDevice.setCreateUser(currentUser.getXm());
					thisService.merge(roomDevice);
				}
			}
		}
        writeJSON(response, jsonBuilder.returnSuccessJson("\"绑定成功\""));
    }

    /**
      * 
      * @Title: doDelete
      * @Description: 逻辑删除指定的数据
      * @param request
      * @param response
      * @return void    返回类型
      * @throws IOException  抛出异常
     */
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String ids = request.getParameter("ids");
        if (StringUtils.isEmpty(ids)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
            return;
        } else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE,currentUser.getXm());
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情见错误日志\""));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情见错误日志\""));
			}
        }
    }
    
}

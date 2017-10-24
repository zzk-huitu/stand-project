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
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtIrRoomDevice;
import com.zd.school.control.device.model.PtSkMeter;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;


/**
 * 房间设备
 *
 */
@Controller
@RequestMapping("/BasePtTerm")
public class BasePtTermController extends FrameWorkController<PtTerm> implements Constant  {
	@Resource
	BasePtTermService thisService; // service层接口
	
	@Resource
	BaseOfficeAllotService baseOfficeAllotService; // service层接口
	
	@Resource
    BaseRoominfoService baseRoominfoService ;
	
	
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtTerm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String leaf = request.getParameter("leaf");
		String roomId = request.getParameter("roomId");
		
		if(roomId==null&&leaf==null){
			roomId="";
			leaf ="true";
		}
		
		//根据leaf判断到底是传入的房间ID还是区域ID(为true则是房间id,为false则是区域id)
		if(leaf.equals("true")){
			
			if(filter!=null){
				filter = filter.substring(0, filter.length()-1)+",{'type':'string','comparison':'=','value':'" + roomId + "','field':'roomId'}]";
			}else{
				filter = "[{'type':'string','comparison':'=','value':'" + roomId + "','field':'roomId'}]";
			}
			
			QueryResult<PtTerm> qResult = thisService.queryPageResult(super.start(request), super.limit(request),super.sort(request), filter, true);
	        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
	        writeJSON(response, strData);// 返回数据
		}else{
			//若为类型不为楼层，则去查询此区域下的所有楼层
			String hql="select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"+roomId+"%'";
			//创建areaIdlists存储区域id
			List<String> areaIdlists=baseOfficeAllotService.queryEntityByHql(hql);
			
			StringBuffer areasb=new StringBuffer();
			for(int i=0;i<areaIdlists.size();i++){
				areasb.append("'"+areaIdlists.get(i)+"'"+",");
			}
			
			if(areasb.length()>0){
				//创建roomIdLists存储房间id
				List<String> roomIdLists = new ArrayList<>();
				hql="select a.uuid from BuildRoominfo a where a.areaId in ("+areasb.substring(0,areasb.length()-1) +")";
				roomIdLists=baseRoominfoService.queryEntityByHql(hql);
				StringBuffer roomsb=new StringBuffer();
				
				//通过循环处理roomId数据
				for(int i=0;i<roomIdLists.size();i++){
					roomsb.append(roomIdLists.get(i)+",");
				}
				
				if(filter!=null){
					filter = filter.substring(0, filter.length()-1)+",{'type':'string','comparison':'in','value':'" + roomsb.substring(0,roomsb.length()-1) + "','field':'roomId'}]";
				}else{
					filter = "[{'type':'string','comparison':'in','value':'" + roomsb.substring(0,roomsb.length()-1) + "','field':'roomId'}]";
				}	
				
				QueryResult<PtTerm> qResult = thisService.queryPageResult(super.start(request), super.limit(request),super.sort(request), filter, true);
		        strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		        writeJSON(response, strData);// 返回数据
		        
			}else{
				writeJSON(response, jsonBuilder.returnSuccessJson("\"该区域下暂无房间\""));
			}
			
		}
	}
			
		/**
		 * 
		 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param MjUserright
		 *         实体类 @param @param request @param @param response @param @throws
		 *         IOException 设定参数 @return void 返回类型 @throws
		 */
		@RequestMapping("/doAdd")
		public void doAdd(String roomId, String uuid, HttpServletRequest request, HttpServletResponse response)
				throws IOException, IllegalAccessException, InvocationTargetException {
			String uuids[] = uuid.split(",");
			PtTerm entity = null;
			
			// 获取当前操作用户
	        SysUser currentUser = getCurrentSysUser();
	        
	        boolean flag=true;
			for (int i = 0; i < uuids.length; i++) {
				entity = thisService.get(uuids[i]);
				entity.setRoomId(roomId);
				thisService.updateByProperties("uuid", uuids[i], "roomId", roomId);
			}
				writeJSON(response, jsonBuilder.returnSuccessJson("'成功。'"));
		}		
	
		
		/**
		 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
		 * MjUserright @param @param request @param @param response @param @throws
		 * IOException 设定参数 @return void 返回类型 @throws
		 */
		@RequestMapping("/doUpdate")
		public void doUpdates(PtTerm entity, HttpServletRequest request, HttpServletResponse response)
				throws IOException, IllegalAccessException, InvocationTargetException {
			SysUser currentUser = getCurrentSysUser();
			 entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
		        if (ModelUtil.isNotNull(entity))
		            writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		        else
		            writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));
			
			
		}
	
		/**
		 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
		 * request @param @param response @param @throws IOException 设定参数 @return
		 * void 返回类型 @throws
		 */
		@RequestMapping("/doDelete")
		public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
			String ids = request.getParameter("ids");
			if (StringUtils.isEmpty(ids)) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
				return;
			} else {
				SysUser currentUser = getCurrentSysUser();
				boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE,currentUser.getXm());
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
				}
			}
		}
		
}

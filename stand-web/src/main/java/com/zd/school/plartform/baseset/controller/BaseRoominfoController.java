package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: BuildRoominfoController Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 教室信息实体Controller. date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/BaseRoominfo")
public class BaseRoominfoController extends FrameWorkController<BuildRoominfo> implements Constant {

	private static Logger logger = Logger.getLogger(BaseRoominfoController.class);

	@Resource
	private BaseRoominfoService thisService; // service层接口
	@Resource
	private CommTreeService treeService; // 生成树

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute BuildRoominfo entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String areaId = request.getParameter("areaId");
		String areaType = request.getParameter("areaType")==null?"04":request.getParameter("areaType");
		
		//若为类型不为楼层，则去查询此区域下的所有楼层
		if(!"04".equals(areaType)){
			String hql="select a.uuid from BuildRoomarea a where a.isDelete=0 and a.areaType='04' and a.treeIds like '%"+areaId+"%'";
			List<String> lists=thisService.queryEntityByHql(hql);
			StringBuffer sb=new StringBuffer();
			for(int i=0;i<lists.size();i++){
				sb.append(lists.get(i)+",");
			}
			if(sb.length()>0){
				if(filter.length()>0){
					filter = filter.substring(0, filter.length()-1);
					filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"areaId\"}"+"]";
				}else{
					filter="[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"areaId\"}]";
				}
			}else{//为楼栋或校区，其下没有楼层
				filter="[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+null+"\",\"field\":\"areaId\"}]";
			}
		}
		
		QueryResult<BuildRoominfo> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param BuildRoominfo
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doAdd")
	public void doAdd(BuildRoominfo entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String areaId = entity.getAreaId();
		String roomCode = entity.getRoomCode();
		//String rommType = entity.getRoomType();
		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String hql = " o.isDelete='0' and o.areaId='" + areaId + "' ";
		if (thisService.IsFieldExist("roomCode", roomCode, "-1", hql)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"同一区域已有此编号的房间！\""));
			return;
		}

		SysUser currentUser = getCurrentSysUser();

		Integer orderIndex = thisService.getDefaultOrderIndex(entity);
		entity.setOrderIndex(orderIndex);
		entity.setRoomType("0");		//强制为 未定义类型
		entity.setRoomName(roomCode);	//默认使用编号的命名
		entity = thisService.doAddEntity(entity, currentUser.getXm());

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));

	}

	/**
	 * 批量添加房间
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doBatchAdd")
	public void doBatchAdd(BuildRoominfo entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		SysUser currentUser = getCurrentSysUser();
	
		Boolean bResult = thisService.doBatchAddRoom(entity, currentUser);
		if (bResult) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"批量添加房间成功\""));
		} else
			writeJSON(response, jsonBuilder.returnSuccessJson("\"批量添加房间失败，详情见错误日志\""));		
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE, currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}

	/**
	 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
	 * BuildRoominfo @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doUpdate")
	public void doUpdate(BuildRoominfo entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String areaId = entity.getAreaId();
		String roomName = entity.getRoomName();
		String roomId = entity.getUuid();
		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String hql = " o.isDelete='0' and o.areaId='" + areaId + "' ";
		if (thisService.IsFieldExist("roomName", roomName, roomId, hql)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"同一区域已有此房间！\""));
			return;
		}
	
		SysUser currentUser = getCurrentSysUser();	
		
		entity=thisService.doUpdateEntity(entity, currentUser.getXm(), null);
        
        if(entity==null)
       	 	writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));              

	}

	@RequestMapping("/allRoomTree")
	public void treelist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		String excludes = request.getParameter("excludes");
		List<CommTree> lists = treeService.getCommTree("BUILD_V_ALLROOMTREE", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, excludes);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

}

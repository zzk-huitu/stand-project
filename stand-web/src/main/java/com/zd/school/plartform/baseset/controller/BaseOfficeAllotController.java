package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
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
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.JwOfficeAllot;
import com.zd.school.build.define.model.BuildOfficeDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseOfficeDefineService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 房间分配（原办公室分配）
 *
 */
@Controller
@RequestMapping("/BaseOfficeAllot")
public class BaseOfficeAllotController extends FrameWorkController<JwOfficeAllot> implements Constant  {
	@Resource
	BaseOfficeAllotService thisService; // service层接口
	@Resource
	CommTreeService treeService; // 生成树
	@Resource
	SysUserService sysUserService; // service层接口
	@Resource
	BaseOfficeDefineService offdService;
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute JwOfficeAllot entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = "";
		String roomId = request.getParameter("roomId");//获取区域或房间id（areaId/roomId）
		String hql="select a.uuid from BuildRoomarea a where a.isDelete=0  and a.areaType='04' and a.treeIds like '%"+roomId+"%'";
		List<String> lists=thisService.queryEntityByHql(hql);
		StringBuffer sb=new StringBuffer();
		String areaIds="";
		for(int i=0;i<lists.size();i++){
			sb.append(lists.get(i)+",");
		}
		if(sb.length()>0){
			areaIds=sb.substring(0, sb.length()-1);
		
			hql="select a.uuid from BuildRoominfo a where a.isDelete=0 and a.roomType='2' and a.areaId in ('"+areaIds.replace(",", "','")+"')";
			List<String> roomLists=thisService.queryEntityByHql(hql);
			sb.setLength(0);
			for(int i=0;i<roomLists.size();i++){
				sb.append(roomLists.get(i)+",");
			}
			// 房间id
			if(sb.length()>0){
				filter="[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"roomId\"}]";			
			}
		}else{
			filter="[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\""+ roomId+"\",\"field\":\"roomId\"}]";
		}
		
		QueryResult<JwOfficeAllot> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);

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
	@RequestMapping("/treelist")
	public void getGradeTreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		List<CommTree> lists = treeService.getCommTree("JW_OFFICEALLOTTREE", whereSql);
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param JwOfficeallot
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doAdd")
	public void doAdd(JwOfficeAllot entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		Boolean flag=false;
		BuildOfficeDefine off = null;
		Map<String,JwOfficeAllot> hashMap=new HashMap<String,JwOfficeAllot>();
		String[] name = { "roomId", "isDelete" };
		Object[] value = { entity.getRoomId(), 0 };
		off = offdService.getByProerties(name, value);
		if (off != null) {
			SysUser currentUser = getCurrentSysUser();
			flag = thisService.doAdd(entity,hashMap,currentUser);// 执行增加方法
			if (flag) {
                // 返回实体到前端界面
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			} else {
				JwOfficeAllot valioff = hashMap.get("valioff");
				writeJSON(response, jsonBuilder
						.returnFailureJson("'" + valioff.getXm() + "已存在" + valioff.getRoomName() + "办公室'"));
				return;
			}

		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"您刚已经在定义中删除了此办公室，请刷新树在重试\""));
			return;
		}
		
		
		
	}


	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doDelete")
	public void doDelete(String uuid, String roomId, String tteacId, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
	
		if (StringUtils.isEmpty(uuid)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			boolean flag = thisService.doLogicDelOrRestore(uuid, StatuVeriable.ISDELETE,"");
			thisService.mjUserRight(null, roomId, tteacId, null, null);
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}
	
	/**
	 * 公用的教师查询（用于办公室分配使用）
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/teacherAllot" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void teacherAllot(@ModelAttribute SysUser entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<SysUser> qr = sysUserService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
		
		
	}
}

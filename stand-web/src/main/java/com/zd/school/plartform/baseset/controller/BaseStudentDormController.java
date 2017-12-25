package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.constant.TreeVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.ExportExcelAnnoUtil;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.PoiExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.student.studentclass.model.JwClassstudent;
import com.zd.school.student.studentclass.model.StandVClassStudent;
import com.zd.school.student.studentclass.service.JwClassstudentService;

/**
 * 学生宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseStudentDorm")
public class BaseStudentDormController extends FrameWorkController<DormStudentDorm> implements Constant {
	@Resource
	BaseStudentDormService thisService; // service层接口
	@Resource
	CommTreeService treeService;
	@Resource
	BaseClassDormAllotService classDormService;// 班级宿舍 
	@Resource
	JwClassstudentService classStuService; // 学生分班
	@Resource
	BaseDormDefineService dormDefineService;// 宿舍定义
	@Resource
	private BaseOfficeAllotService roomaAllotService;// 房间分配 办公室

   /**
		 * 已入住宿舍学生列表 @Title: list @Description: TODO @param @param entity
		 * 实体类 @param @param request @param @param response @param @throws
		 * IOException 设定参数 @return void 返回类型 @throws
		 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter="";
		String claiId=request.getParameter("claiId");
		if(claiId==null){
			claiId="";
		}
		String hql = "select a.uuid from BaseOrg a where a.isDelete=0  and a.deptType='05' and a.treeIds like '%"
				+ claiId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}
		if (sb.length() > 0) {
		   filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + sb.substring(0, sb.length() - 1)
						+ "\",\"field\":\"claiId\"}]";
		} else {
			filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + null + "\",\"field\":\"claiId\"}]";
		}
		QueryResult<DormStudentDorm> qr = thisService.queryPageResult(super.start(request),super.limit(request),
				super.sort(request), filter, true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 生成树
	 * 
	 */
	@RequestMapping("/classtreelist")
	public void classtreelist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String node = request.getParameter("node");
		String nodeId = request.getParameter("nodeId");
		String excludes = request.getParameter("excludes");
		if (!(StringUtils.isNotEmpty(node) && node.equalsIgnoreCase(TreeVeriable.ROOT))) {
			node = TreeVeriable.ROOT;
		}
		if (StringUtils.isNotEmpty(nodeId)) {
			node = nodeId;
		}
		SysUser currentUser = getCurrentSysUser();
		CommTree root = thisService.getCommTree(node, "05", currentUser);
		if (node.equalsIgnoreCase(TreeVeriable.ROOT)) {
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		} else {
			List<CommTree> alist = new ArrayList<CommTree>();
			alist.add(root);
			strData = jsonBuilder.buildList(root.getChildren(), excludes);
		}
		writeJSON(response, strData);// 返回数据
	}
	
	@RequestMapping("/getTree")
	public void getBoyTree(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		List<CommTree> lists=null;
		String whereSql = request.getParameter("whereSql");
		String identity = request.getParameter("identity");
		if(identity.equals("1")){//男生
			lists = treeService.getCommTree("JW_V_STU_BOY_DORMALLOTTREE", whereSql);
		}else{//女生
			lists = treeService.getCommTree("JW_V_STU_GRIL_DORMALLOTTREE", whereSql);
		}
		
		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 查询出一键分配宿舍的信息
	 */
	@RequestMapping("/onKeyList")
	public void onKeyList(@ModelAttribute DormStudentDorm entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		List<DormStudentDorm> newlists = null;
		String whereSql = request.getParameter("whereSql");
		newlists = thisService.oneKeyList(entity, whereSql);
		String strData = jsonBuilder.buildObjListToJson(new Long(newlists.size()), newlists, false);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 一键分配宿舍调用方法
	 * 
	 * @param gradId
	 *            年级id
	 * @param boyId
	 *            男宿舍id
	 * @param girlId
	 *            女宿舍id
	*/
	@Auth("BASESTUDENTDORM_oneKeyAllot")
	@RequestMapping("/doKeyAllotDorm")
	public void doKeyAllotDorm(String gradId, String boyId, String girlId, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		Boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		flag = thisService.oneKeyAllotDorm(gradId, boyId, girlId, currentUser);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"一键分配分配成功。\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"一键分配分配失败。\""));
		}

	}
	/**
	 * 班级下面宿舍列表 
	 * 
	 */
	@RequestMapping(value = { "/classDormlist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void classDormlist(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<JwClassDormAllot> qr = classDormService.queryPageResult(super.start(request), Integer.MAX_VALUE,
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	/**
	 * 未分配宿舍学生列表 该班级没有分配宿舍的学生
	*/
	@RequestMapping(value = { "/classStuNotAllotlist" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void classStuNotAllotlist(@ModelAttribute JwClassstudent entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据	
		String classId = request.getParameter("classId");
		
		if(classId==null){
			classId="";
		}
		String hql = "select a.uuid from BaseOrg a where a.isDelete=0  and a.deptType='05' and a.treeIds like '%"
				+ classId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		String str="";
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}		
		if(sb.length()>0)
			str=sb.substring(0,sb.length()-1);
		
		String sql = " select a.userId as userId,a.xm as xm,a.userNumb as userNumb,a.xbm as xbm,a.classId as classId,"
				+ " a.className as className,a.gradeId as gradeId,a.gradeCode as gradeCode,a.gradeName as gradeName "
				+ "from STAND_V_CLASSSTUDENT a where "
				+ " a.userId not in (select STU_ID from DORM_T_STUDENTDORM  where isDelete=0 and  CLAI_ID=a.classId)";
		
		if(classId!=null){
			sql+=" and a.classId in ('"+str.replace(",", "','")+"')";
		}
		
		QueryResult<StandVClassStudent> qr = thisService.queryPageResultBySql(sql, super.start(request),super.limit(request), StandVClassStudent.class);	
	
		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		
		writeJSON(response, strData);// 返回数据
	}
	
	// 手动分配宿舍 （学生分配宿舍）
	
	@Auth("BASESTUDENTDORM_dormAllot,BASESTUDENTDORM_dormAdjust")
	@RequestMapping("/dormHandAllot")
	public void dormHandAllot(DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		Boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		Map<String, Object> hashMap = new HashMap<String, Object>();
		flag = thisService.dormHandAllot(entity, hashMap, currentUser);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'手动分配宿舍成功。'"));
		} else {
			Integer count = (Integer) hashMap.get("count");
			BuildDormDefine buildDormDefine = (BuildDormDefine) hashMap.get("buildDormDefine");
			Integer inAllotCount = (Integer) hashMap.get("inAllotCount");
			if (count == 1) {
				writeJSON(response, jsonBuilder.returnFailureJson(
						"'该宿舍最大人数为：" + buildDormDefine.getDormBedCount() + "人。现已入住：" + inAllotCount + "。'"));
				return;
			} else {
				Integer canInAllotCount = (Integer) hashMap.get("canInAllotCount");
				writeJSON(response, jsonBuilder.returnFailureJson("'该宿舍最大人数为：" + buildDormDefine.getDormBedCount()
						+ "人。现已入住：" + inAllotCount + "。可分配床位数为：" + canInAllotCount + "'"));
				return;
			}
		}
	}
	
	/**
	 * 自动分配宿舍
	 */
	@Auth("BASESTUDENTDORM_dormAllot")
	@RequestMapping("/dormAutoAllot")
	public void dormAutoAllot(String classId, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		Boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		flag = thisService.dormAutoAllot(classId, currentUser);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'自动分配宿舍成功。'"));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("'自动分配宿舍失败。'"));
		}
	}
	/**
	 * 计算未分配完的混合宿舍 该年纪下的所有未分配完的宿舍
	 */
	@RequestMapping(value = { "/mixDormList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void mixDormList(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		List<JwClassDormAllot> dormAllotList = null;
		dormAllotList = thisService.mixDormList(entity);
		String strData = jsonBuilder.buildObjListToJson(new Long(dormAllotList.size()), dormAllotList, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	/**
	 * 查询出已分配并且人数为0的混班宿舍  该年纪下的所有人数为0的混班宿舍
	 */
	@RequestMapping(value = { "/emptyMixDormList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void emptyMixDormList(@ModelAttribute JwClassDormAllot entity, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		List<JwClassDormAllot> dormAllotList=null;
		dormAllotList=thisService.emptyMixDormList(entity);
		String strData = jsonBuilder.buildObjListToJson(new Long(dormAllotList.size()), dormAllotList, false);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	/**
	 * 删除宿舍
	*/
	@Auth("BASESTUDENTDORM_dormAdjust")
	@RequestMapping("/dormDoDelete")
	public void dormDoDelete(String uuid, HttpServletRequest request, HttpServletResponse response) throws IOException {
		int count = 0;
		int fs = 0;
		if (StringUtils.isEmpty(uuid)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			String[] ids = uuid.split(",");
			BuildDormDefine defin = null;
			JwClassDormAllot jwTClassdorm = null;
			for (int j = 0; j < ids.length; j++) {
				jwTClassdorm = classDormService.get(ids[j]);
				boolean flag = thisService.IsFieldExist("cdormId", jwTClassdorm.getUuid(), "-1", "isdelete=0");
				if (flag) {
					++count;
				}
				if (count == 0) {
					defin = dormDefineService.get(jwTClassdorm.getDormId());
					defin.setRoomStatus("0"); // 设置成未分配
					defin.setIsMixed("0");	//恢复为非混合宿舍
					dormDefineService.merge(defin); // 持久化
					jwTClassdorm.setIsDelete(1); // 设置删除状态
					classDormService.merge(jwTClassdorm); // 持久化
					++fs;
				}
				count = 0;
			}
			if (fs > 0) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功。\""));
			} else {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"宿舍都已分配给学生，不允许删除。\""));
			}

		}
	}
	
	/**
	 * 取消分配学生宿舍
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doDelete")
	public void doDelete(DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		boolean flag = false;
		SysUser currentUser = getCurrentSysUser();
		if (StringUtils.isEmpty(entity.getUuid())) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			String[] delIds = entity.getUuid().split(",");
			flag = thisService.doDeleteDorm(delIds,currentUser.getXm());
					
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"取消宿舍成功!\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"取消宿舍失败!\""));
			}
		}
	}
	
	/**
	 * 修改床号和柜子号
	 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
	 * DormStudentdorm @param @param request @param @param
	 * response @param @throws IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doUpdateBedArkNum")
	public void doUpdates(DormStudentDorm entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();

		String[] list = entity.getUuid().split(";");
		int count = 0;
		
		count = thisService.doUpdateBedArkNum(list,currentUser.getXm());
			
		if (count > 0) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"保存成功。\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"保存失败。\""));
		}

	}
	
	//推送消息
	@Auth("BASESTUDENTDORM_dormTs")
	@RequestMapping("/pushMessage")
	public void pushMessage(String classId, HttpServletRequest request, HttpServletResponse response) throws IOException {
		Boolean flag=false;
		flag=thisService.pushMessage(classId);
		if (flag) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"推送信息成功。\""));
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"推送信息失败。\""));
		}
		
	}
	@Auth("BASESTUDENTDORM_export")
	@RequestMapping("/doExportExcel")
	public void doExportExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		request.getSession().setAttribute("exportStuDormIsEnd", "0");
		request.getSession().removeAttribute("exportStuDormIsState");
		String claiId = request.getParameter("claiId");

		List<Map<String, Object>> allList = new ArrayList<>();
		Integer[] columnWidth = new Integer[] { 10, 15, 15, 20, 20, 20, 35 };
		List<DormStudentDorm> stuDormList = null;
		String hql = " from DormStudentDorm where isDelete=0 and claiId='" + claiId + "' order by inTime ";
		stuDormList = thisService.queryByHql(hql);

		List<Map<String, String>> stuDormExpList = new ArrayList<>();
		Map<String, String> stuDormMap = null;
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (DormStudentDorm stuDorm : stuDormList) {
			stuDormMap = new LinkedHashMap<>();
			stuDormMap.put("claiName", stuDorm.getClaiName());
			stuDormMap.put("xm", stuDorm.getXm());
			stuDormMap.put("userNumb", stuDorm.getUserNumb());
			stuDormMap.put("roomName", stuDorm.getRoomName());
			stuDormMap.put("bedNum", stuDorm.getBedNum().toString());
			stuDormMap.put("arkNum", stuDorm.getArkNum().toString());
			stuDormMap.put("inTime", format.format(stuDorm.getInTime()));
			stuDormExpList.add(stuDormMap);
		}

		Map<String, Object> courseAllMap = new LinkedHashMap<>();
		courseAllMap.put("data", stuDormExpList);
		courseAllMap.put("title",null);
		courseAllMap.put("head", new String[] { "班级名称", "学生名称", "学号", "宿舍名称", "床号", "柜号", "入住时间" }); // 规定名字相同的，设定为合并
		courseAllMap.put("columnWidth", columnWidth); // 30代表30个字节，15个字符
		courseAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0, 0, 0, 0}); // 0代表居中，1代表居左，2代表居右
		courseAllMap.put("mergeCondition", null); // 合并行需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
		allList.add(courseAllMap);

		// 在导出方法中进行解析
		boolean result = PoiExportExcel.exportExcel(response, "学生宿舍分配信息", "学生宿舍分配信息", allList);
		if (result == true) {
			request.getSession().setAttribute("exportStuDormIsEnd", "1");
		} else {
			request.getSession().setAttribute("exportStuDormIsEnd", "0");
			request.getSession().setAttribute("exportStuDormIsState", "0");
		}

	}

	@RequestMapping("/checkExportEnd")
	public void checkExportEnd(HttpServletRequest request, HttpServletResponse response) throws Exception {

		Object isEnd = request.getSession().getAttribute("exportStuDormIsEnd");
		Object state = request.getSession().getAttribute("exportStuDormIsState");
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

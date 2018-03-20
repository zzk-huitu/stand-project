package com.zd.school.plartform.wisdomclass.controller;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.util.StringUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoomarea;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.model.JwGradeteacher;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.jw.eduresources.service.JwGradeteacherService;
import com.zd.school.oa.notice.model.OaNotice;
import com.zd.school.oa.notice.model.OaNoticeOther;
import com.zd.school.oa.notice.service.OaNoticeService;
import com.zd.school.plartform.baseset.model.BaseAttachment;
import com.zd.school.plartform.baseset.model.BaseDicitem;
import com.zd.school.plartform.baseset.service.BaseAttachmentService;
import com.zd.school.plartform.baseset.service.BaseDicitemService;
import com.zd.school.plartform.baseset.service.BaseRoomareaService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.student.studentclass.model.JwClassstudent;
import com.zd.school.student.studentclass.service.JwClassstudentService;

/**
 * 
 * ClassName: OaNoticeController Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 公告信息表(OA_T_NOTICE)实体Controller. date: 2016-12-21
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/OaNotice")
public class OaNoticeController extends FrameWorkController<OaNotice> implements Constant {

	@Resource
	OaNoticeService thisService; // service层接口

	@Resource
	private CommTreeService treeSerice;

	@Resource
	private BaseAttachmentService  baseTAttachmentService;

	@Resource
	private BaseRoomareaService buildRoomareaService;
	
	@Resource
	private BaseDicitemService baseDicitemService;
	
	@Resource
	private BaseRoominfoService buildRoominfoService;
	
	@Resource
	private JwClassstudentService jwClassstudentService;
	
	@Resource
	private SysUserService userService;
	
	@Resource
	private JwGradeteacherService gTeacherService;

	@Resource
	private JwClassteacherService cTeacherService;
	
	@Value("${realFileUrl}")  
    private String realFileUrl; //文件目录物理路径
	
	@Value("${virtualFileUrl}")  
    private String virtualFileUrl; //文件目录虚拟路径


	
	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute OaNotice entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter = request.getParameter("filter");
		String noticeType = request.getParameter("noticeType");
		if (StringUtils.isNotEmpty(noticeType)) {
			if (StringUtils.isNotEmpty(filter)) {
				filter = filter.substring(0, filter.length() - 1);
				filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + noticeType
						+ "\",\"field\":\"noticeType\"}" + "]";
			} else {
				filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + noticeType
						+ "\",\"field\":\"noticeType\"}]";
			}
		}
		QueryResult<OaNotice> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param OaNotice
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@Auth("OANOTICE_add")
	@RequestMapping("/doAdd")
	public void doAdd(OaNotice entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等		
			
		String deptIds = request.getParameter("deptIds");	
		String stuIds = request.getParameter("stuIds");
		String terminalIds = request.getParameter("termIds");
		String roleIds = request.getParameter("roleIds");
		String userIds = request.getParameter("userIds");
		String isNoticeParent=request.getParameter("isNoticeParent"); 
		isNoticeParent=isNoticeParent==null?"0":"1";
		
		//设置全体
		if("1".equals(entity.getDeptRadio()))
			deptIds=AdminType.ADMIN_ORG_ID;
		if("1".equals(entity.getStuRadio()))
			stuIds=AdminType.ADMIN_ORG_ID;
		if("1".equals(entity.getTerminalRadio()))
			terminalIds=AdminType.ADMIN_ORG_ID;
		
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
	
		entity = thisService.doAddEntity(entity, currentUser, deptIds, roleIds, userIds,terminalIds,stuIds,isNoticeParent);// 执行增加方法
		if (ModelUtil.isNotNull(entity))
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
		else
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据增加失败,详情见错误日志\""));
		
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@Auth("OANOTICE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
			SysUser currentUser = getCurrentSysUser();
	
			boolean flag = thisService.doLogicDeleteByIds(delIds, currentUser);
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,详情见错误日志\""));
			}		
		}
	}

	/**
	 * doUpdate编辑记录
	 * 
	 * @Title: doUpdate
	 * @Description:
	 * @param OaNotice
	 * @param request
	 * @param response
	 * @throws IOException
	 * @return void 返回类型
	 */
	@Auth("OANOTICE_update")
	@RequestMapping("/doUpdate")
	public void doUpdates(OaNotice entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		String deptIds = request.getParameter("deptIds");
		String roleIds = request.getParameter("roleIds");
		String userIds = request.getParameter("userIds");
		String terminalIds = request.getParameter("termIds");
		String stuIds = request.getParameter("stuIds");
		String isNoticeParent=request.getParameter("isNoticeParent"); 
		isNoticeParent=isNoticeParent==null?"0":"1";
		
		// 入库前检查代码
		//设置全体
		if("1".equals(entity.getDeptRadio()))
			deptIds=AdminType.ADMIN_ORG_ID;
		if("1".equals(entity.getStuRadio()))
			stuIds=AdminType.ADMIN_ORG_ID;
		if("1".equals(entity.getTerminalRadio()))
			terminalIds=AdminType.ADMIN_ORG_ID;
		
		
		// 获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doUpdateEntity(entity, currentUser, deptIds, roleIds, userIds,terminalIds,stuIds,isNoticeParent);// 执行修改方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据修改失败,详情见错误日志\""));
		}
	}

	/**
	 * getTypeTree 获取信息分类树形数据
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/getTypeTree")
	public void getTypeTree(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = "";

		List<CommTree> lists = treeSerice.getCommTree("OA_V_NOTICETYPETREE", whereSql);

		strData = JsonBuilder.getInstance().buildList(lists, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 获取指定公告的通知部门、角色、人员的信息
	 * 
	 * @param id
	 *            指定的公告id
	 * @return
	 */
	@RequestMapping("/getNoticeOther")
	public void getNoticeOther(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String id = request.getParameter("noticeId");
		if (StringUtils.isNotEmpty(id)) {
			OaNoticeOther other = thisService.getNoticeOther(id);
			strData = jsonBuilder.toJson(other);// 处理数据
			writeJSON(response, jsonBuilder.returnSuccessJson(strData));// 返回数据
		} else {
			writeJSON(response, jsonBuilder.returnFailureJson("\"无数据\""));// 返回数据
		}
	}

	@RequestMapping("/getUserOaNotice")
	public @ResponseBody List<OaNotice> getUserOaNotice(HttpServletRequest request, HttpServletResponse response) {
		SysUser currentUser = getCurrentSysUser();
		List<OaNotice> list = thisService.getUserOaNotice(currentUser);
		return list;
	}

	@RequestMapping("/getOaNoticeById")
	public @ResponseBody OaNotice getOaNoticeById(HttpServletRequest request, HttpServletResponse response) {
		String uuid = request.getParameter("uuid");
		return thisService.get(uuid);
	}
	
	
	
	/**
	 * 上传文件
	 * 
	 * @param sendId
	 * @param file
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/doUpload" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void doUpload(@RequestParam("recordId") String recordId,
			@RequestParam(value = "attachIsMain", required = false, defaultValue = "0") Integer attachIsMain,
			@RequestParam("file") MultipartFile file, HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		try {

			if (file != null) {
				//图片服务器路径  
		        //String file_path = "D:\\Q1_Files\\uploadFiles\\";  
				String file_path =realFileUrl;
				
				// 取得当前上传文件的文件名称
				String myFileName = file.getOriginalFilename();
				
				// 如果名称不为“”,说明该文件存在，否则说明该文件不存在
				if (myFileName.trim() != "") {
					// 重命名上传后的文件名
					String type = myFileName.substring(myFileName.lastIndexOf("."));
					//String fileName = String.valueOf(System.currentTimeMillis()) + type;

					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					//String url = "/static/upload/OaNotice/" + sdf.format(System.currentTimeMillis()) + "/";
					String url = "OaNotice/" + sdf.format(System.currentTimeMillis()) + "/";
					//String rootPath = request.getSession().getServletContext().getRealPath("/");
					//rootPath = rootPath.replace("\\", "/");				
					
					// 定义上传路径
					String path = file_path+ url + myFileName;
					File localFile = new File(path);

					if (!localFile.exists()) { // 判断文件夹是否存在
						localFile.mkdirs(); // 不存在则创建
					}

					file.transferTo(localFile);
					

					// 插入数据
					BaseAttachment bt = new BaseAttachment();
					bt.setEntityName("OaNotice");
					bt.setRecordId(recordId);
					bt.setAttachUrl(url + myFileName);
					bt.setAttachName(myFileName);
					bt.setAttachType(type);
					bt.setAttachSize(file.getSize());
					bt.setAttachIsMain(attachIsMain);
					baseTAttachmentService.merge(bt);

					writeJSON(response, "{ \"success\" : true,\"obj\":\"" + url + myFileName + "\"}");
				}
			}

		} catch (Exception e) {
			writeJSON(response, "{ \"success\" : false,\"obj\":null}");
			return;
		}
	}
	@RequestMapping("/doDeleteFile") // Filename sendId
	public void doDeleteFile(HttpServletRequest request, HttpServletResponse response) throws IOException {
		try {
			String fileIds = request.getParameter("fileIds");

			String doIds = "'" + fileIds.replace(",", "','") + "'";

			String hql = "DELETE FROM BaseAttachment b  WHERE b.uuid IN (" + doIds + ")";

			int flag = baseTAttachmentService.doExecuteCountByHql(hql);

			if (flag > 0) {
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败,请刷新重试！\""));
		}
	}
	
	

	@RequestMapping("/getTerminalTtreeList")
	public void getTerminalTtreeList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		String orderSql = request.getParameter("orderSql");
		String excludes = super.excludes(request);
		
		List<Map<String,Object>> lists=new ArrayList<>();
		
	
		//1.创建根目录（深大附中）
		String hql1="from BuildRoomarea t where t.isDelete=0 and t.parentNode='ROOT' and t.nodeLevel=1";
		List<BuildRoomarea> rootAreas=buildRoomareaService.queryEntityByHql(hql1);
		for(int i=0;i<rootAreas.size();i++){
			Map<String,Object> rootAreaMap=new LinkedHashMap<>();
			rootAreaMap.put("text",rootAreas.get(i).getNodeText());
			rootAreaMap.put("leaf",false);
			rootAreaMap.put("checked",false);
			rootAreaMap.put("treeid", rootAreas.get(i).getUuid());
			rootAreaMap.put("type","01");
			
			List<Map<String, Object>> rootChildren=new ArrayList<>();
			rootAreaMap.put("children",rootChildren);
			
			//2.创建第二层（初中、高中校区）
			String hql2="from BuildRoomarea t where t.isDelete=0 and t.parentNode=?";
			List<BuildRoomarea> rootAreasSecond=buildRoomareaService.queryEntityByHql(hql2,rootAreas.get(i).getUuid());
			for(int j=0;j<rootAreasSecond.size();j++){
				
				Map<String,Object> tempMap=new LinkedHashMap<>();
				tempMap.put("text",rootAreasSecond.get(j).getNodeText());
				tempMap.put("leaf",false);
				tempMap.put("checked",false);
				tempMap.put("treeid", rootAreasSecond.get(j).getUuid());
				tempMap.put("type","02");
				
				List<Map<String, Object>> tempMapChildren=new ArrayList<>();
				tempMap.put("children",tempMapChildren);
				
				//查询初中或高中的所有子区域id		
				String roomareaHql="from BuildRoomarea where isDelete=0 order by orderIndex asc ";
				List<BuildRoomarea> roomareaList = buildRoomareaService.queryByHql(roomareaHql);	// 执行查询方法
				StringBuffer childAreasSB = searchChildArea(rootAreasSecond.get(j).getUuid(),roomareaList,new StringBuffer());
				String childAreasStr="";
				if(childAreasSB.length()>0){
					childAreasStr=childAreasSB.substring(0, childAreasSB.length()-1);
				}
				
				//3.创建第三层（功能室、办公室、教室、宿舍）
				String fjlxHql="select a from BaseDicitem a,BaseDic b where "
						+ " a.dicId=b.uuid and b.dicCode=? and a.isDelete=0 and b.isDelete=0 "
						+ " and a.itemName in ('功能室','办公室','教室','宿舍') "
						+ " order by a.itemCode asc";
				List<BaseDicitem> fjlxList=baseDicitemService.queryEntityByHql(fjlxHql, "FJLX");
				for(BaseDicitem baseDicitem : fjlxList){
					Map<String,Object> labMap=new LinkedHashMap<>();	//房间类型室
					labMap.put("text",baseDicitem.getItemName());
					labMap.put("leaf",false);					
					labMap.put("checked",false);
					labMap.put("treeid", baseDicitem.getUuid());
					labMap.put("type","03");
					
					List<Map<String, Object>> labMapChildren=new ArrayList<>();
					labMap.put("children",labMapChildren);
					
					//4.创建第四层（房间号）
					if(StringUtils.isNotEmpty(childAreasStr)){
						String fjHql="from BuildRoominfo a where a.isDelete=0 and a.roomType=? and a.areaId in ("+childAreasStr+")  order by a.areaId asc,a.roomCode asc";
						List<BuildRoominfo> roomInfoList=buildRoominfoService.queryEntityByHql(fjHql, baseDicitem.getItemCode());
						for(BuildRoominfo roomInfo:roomInfoList){
							Map<String,Object> roomInfoMap=new HashMap<>();	//房间类型室
							roomInfoMap.put("text",roomInfo.getRoomName());
							roomInfoMap.put("leaf",true);
							roomInfoMap.put("checked",false);
							roomInfoMap.put("treeid", roomInfo.getUuid());
							roomInfoMap.put("type","04");	
							
							labMapChildren.add(roomInfoMap);
						}
					}
					
					tempMapChildren.add(labMap);
				}				
					
				rootChildren.add(tempMap);
			}	
					
			lists.add(rootAreaMap);
		}
					
		//List<BaseOrgChkTree> lists = thisService.getOrgChkTreeList(whereSql, orderSql, currentUser);

		strData = JsonBuilder.getInstance().buildList(lists, excludes);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	@SuppressWarnings("unused")
	private StringBuffer searchChildArea(String parentId,List<BuildRoomarea> list,StringBuffer sb){
	
		for(BuildRoomarea br : list ){
			if(br.getParentNode().equals(parentId)){
				sb.append("'"+br.getUuid()+"',");
				sb=searchChildArea(br.getUuid(),list,sb);		
			}				
		}
		return sb;
			
	}
	
	
	@RequestMapping("/allClassStuTreelist")
	public void getAllClassStuTreelist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String whereSql = request.getParameter("whereSql");
		SysUser currentUser = getCurrentSysUser();
		
		Boolean isSchoolAdminRole = false;
		List<SysUser> roleUsers = userService.getUserByRoleName("学校管理员");
		for (SysUser su : roleUsers) {
			if (su.getUuid().equals(currentUser.getUuid())) {
				isSchoolAdminRole = true;
				break;
			}
		}
		
		if (!isSchoolAdminRole) {
			// 不是学校管理员判断是否是年级组长
			String hql = "from JwGradeteacher where isDelete=0 and tteacId='" + currentUser.getUuid() + "'";
			List<JwGradeteacher> gradeclassteachers = gTeacherService.queryByHql(hql);
			if (gradeclassteachers != null && gradeclassteachers.size() > 0) {
				JwGradeteacher gTeacher = gradeclassteachers.get(0);
				whereSql += " and level=1";
				whereSql += " or id='" + gTeacher.getGraiId() + "'";
				whereSql += " or parent='" + gTeacher.getGraiId() + "'";
			} else {
				// 判断是否是班主任
				hql = "from JwClassteacher where isDelete=0 and tteacId='" + currentUser.getUuid() + "'";
				List<JwClassteacher> classteachers = cTeacherService.queryByHql(hql);
				if (classteachers != null && classteachers.size() > 0) {
					JwClassteacher cTeacher = classteachers.get(0);
					whereSql += " and level=1";
					whereSql += " or id=(select parent from JW_V_GRADECLASSTREE where id='" + cTeacher.getClaiId()
							+ "')";
					whereSql += " or id='" + cTeacher.getClaiId() + "'";
				}
			}
		}

		List<CommTreeChk> commTreeList = treeSerice.getCommTreeChk("JW_V_GRADECLASSTREE", whereSql);		
		
		String stuHql="from JwClassstudent where isDelete=0 order by orderIndex asc";
		
		
		
		
		
		List<JwClassstudent> stus=jwClassstudentService.queryByHql(stuHql);
		
		addStuInTree(commTreeList,stus);
		
		strData = JsonBuilder.getInstance().buildList(commTreeList, "");// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	@SuppressWarnings("unused")
	private void addStuInTree(List<CommTreeChk> commTreeChks,List<JwClassstudent> stus){
		for(CommTreeChk commTreeChk:commTreeChks){
			List<CommTreeChk> ctc=commTreeChk.getChildren();
			if(ctc.size()==0){
				commTreeChk.setLeaf(false);
				ctc=new ArrayList<CommTreeChk>();
				for(JwClassstudent stu:stus){
					if(stu.getClaiId().equals(commTreeChk.getId())){					
						CommTreeChk child = new CommTreeChk(stu.getStudentId(), stu.getXm(), "", true,
								commTreeChk.getLevel()+1, "", new ArrayList<CommTreeChk>(), commTreeChk.getId(),false);
						
						ctc.add(child);
						//stus.remove(stu);
					}
				}
				commTreeChk.setChildren(ctc);
			}else{
				addStuInTree(ctc,stus);
			}
		}
		
			
	}
}
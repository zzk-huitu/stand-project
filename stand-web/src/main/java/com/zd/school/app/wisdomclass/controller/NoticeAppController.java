package com.zd.school.app.oa.notice;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.DateUtil;
import com.zd.core.util.ModelUtil;
import com.zd.school.oa.notice.model.OaNotice;
import com.zd.school.oa.notice.service.OaNoticeService;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.oa.terminal.service.OaInfotermService;
import com.zd.school.plartform.baseset.model.BaseAttachment;
import com.zd.school.plartform.baseset.service.BaseAttachmentService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;

@Controller
@RequestMapping("/app/notice")
public class NoticeAppController extends FrameWorkController<OaNotice> implements Constant {
	@Resource
	private OaNoticeService thisService; // service层接口
	@Resource
	private SysUserService userService; // service层接口

	@Resource
	private BaseAttachmentService baseTAttachmentService;

	/**
	 * app 获取通知公告列表
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(String terminalNumb, HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);

		QueryResult<OaNotice> qResult = thisService.list(start, limit, sort, filter, terminalNumb);
		if(ModelUtil.isNotNull(qResult)){
			for (OaNotice notice : qResult.getResultList()) {
				String content = notice.getNoticeContent();
				// 过滤文章内容中的html
				content = content.replaceAll("</?[^<]+>", "");
				// 去除字符串中的空格 回车 换行符 制表符 等
				content = content.replaceAll("\\s*|\t|\r|\n", "");
				// 去除空格
				content = content.replaceAll("&nbsp;", "");
				notice.setNoticeContent(content);
			}
			strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
			// 过滤文章内容中的html
			/*strData = strData.replaceAll("</?[^<]+>", "");
			// 去除字符串中的空格 回车 换行符 制表符 等
			strData = strData.replaceAll("\\s*|\t|\r|\n", "");
			// 去除空格
			strData = strData.replaceAll("&nbsp;", "");*/
			
			writeJSON(response, jsonBuilder.returnSuccessAppJson("\"请求成功\"", strData));// 返回数据
		} else {
			strData = "\"没有找到此终端的数据\"";
			writeJSON(response, jsonBuilder.returnFailureAppJson("\"请求失败\"", strData));// 返回数据
		}
	}

	@RequestMapping(value = { "/userList" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody List<OaNotice> userList(String userId, HttpServletRequest request,
			HttpServletResponse response) {
		SysUser user = userService.get(userId);
		return thisService.getUserOaNotice(user);
	}

	@RequestMapping("/getFileList") // Filename sendId
	public void getFileList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String setRecordId = request.getParameter("recordId");
		if (setRecordId == null) {
			writeJSON(response, "[]");
			return;
		}
		List<HashMap<String, Object>> list = baseTAttachmentService.queryByRecordId(setRecordId);
		writeJSON(response, jsonBuilder.toJson(list));
	}
	
	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param OaNotice
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doadd")
	public void doAdd(OaNotice entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String deptIds = request.getParameter("deptIds");
		String roleIds = request.getParameter("roleIds");
		String userIds = request.getParameter("userIds");
		String terminalIds = request.getParameter("termIds");
		String stuIds = request.getParameter("stuIds");
		String isNoticeParent=request.getParameter("isNoticeParent"); 
		isNoticeParent=isNoticeParent==null?"0":"1";
		
		// 获取当前操作用户
		SysUser currentUser = userService.get(request.getParameter("currentUser"));
		try {
			entity = thisService.doAddEntity(entity, currentUser, deptIds, roleIds, userIds,terminalIds,stuIds,isNoticeParent);// 执行增加方法
			if (ModelUtil.isNotNull(entity)){				
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			}else
				writeJSON(response, jsonBuilder.returnFailureJson("\"数据增加失败,详情见错误日志\""));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"数据增加失败,详情见错误日志\""));
		}
	}
	
	
	
	@RequestMapping(value = { "/doUpload" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void doUpload(@RequestParam("recordId") String recordId, 
		 HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
				request.getSession().getServletContext());
		if (multipartResolver.isMultipart(request)) {
			MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
			Iterator<String> iter = multiRequest.getFileNames();
			while (iter.hasNext()) {
				// 一次遍历所有文件
				MultipartFile file = multiRequest.getFile(iter.next().toString());
				if (file != null) {
					// 取得当前上传文件的文件名称
					String myFileName = file.getOriginalFilename();
					// 如果名称不为“”,说明该文件存在，否则说明该文件不存在
					if (myFileName.trim() != "") {
						// 重命名上传后的文件名
						String type = myFileName.substring(myFileName.lastIndexOf("."));
						String fileName = String.valueOf(System.currentTimeMillis()) + type;
						SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
						String url = "/static/upload/OaNotice/" + sdf.format(System.currentTimeMillis()) + "/";
						String rootPath = request.getSession().getServletContext().getRealPath("/");
						rootPath = rootPath.replace("\\", "/");
						// 定义上传路径
						String path = rootPath + url + myFileName;
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
						baseTAttachmentService.merge(bt);
					}
				}
			}
		}
	}
}

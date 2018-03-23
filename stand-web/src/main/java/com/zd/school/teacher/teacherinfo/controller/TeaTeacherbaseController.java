package com.zd.school.teacher.teacherinfo.controller;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.crypto.hash.Sha256Hash;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.PinyinUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.service.BaseAttachmentService;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

@Controller
@RequestMapping("/TeacherBase")
public class TeaTeacherbaseController extends FrameWorkController<TeaTeacherbase> implements Constant {
	@Resource
	private TeaTeacherbaseService thisService; // service层接口

	@Resource
	private SysOrgService sysOrgService;

	@Resource
	private SysRoleService roleService;

	@Value("${realFileUrl}")
	private String realFileUrl; // 文件目录物理路径

	@Value("${virtualFileUrl}")
	private String virtualFileUrl; // 文件目录虚拟路径

	@Resource
	private BaseAttachmentService baseTAttachmentService;// service层接口

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute TeaTeacherbase entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String deptId = request.getParameter("deptId");
		String qureyFilter = request.getParameter("queryFilter");
		if (StringUtils.isEmpty(qureyFilter)) {
			qureyFilter = request.getParameter("filter");
		}
		SysUser currentUser = getCurrentSysUser();

		QueryResult<TeaTeacherbase> qr = thisService.getDeptTeacher(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), qureyFilter, true, deptId, currentUser);
		if (ModelUtil.isNotNull(qr))
			strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 直接查询某个学科下的教师
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/listCourseTeacher" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		String deptId = request.getParameter("deptId");
		String courseId = request.getParameter("courseId");

		// 当传入的参数树courseId时。就去查询deptId
		if (StringUtils.isEmpty(deptId) && StringUtils.isNotEmpty(courseId)) {
			BaseOrg baseOrg = sysOrgService.getByProerties("extField01", courseId);
			deptId = baseOrg.getUuid();
		}

		if (StringUtils.isNotEmpty(deptId)) {

			String hql = "from TeaTeacherbase g where g.isDelete=0 and g.uuid in ("
					+ "	select distinct userId  from BaseUserdeptjob where isDelete=0 and deptId = '" + deptId + "'"
					+ ")";
			QueryResult<TeaTeacherbase> qr = thisService.queryCountToHql(super.start(request), super.limit(request),
					super.sort(request), super.filter(request), hql, null, null);

			strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据

		} else {
			strData = jsonBuilder.buildObjListToJson((long) 0, new ArrayList<>(), true);// 处理数据
		}

		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @throws BadHanyuPinyinOutputFormatCombination
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param TeaTeacherbase
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/doAdd" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void doAdd(TeaTeacherbase entity, @RequestParam("file") MultipartFile file, HttpServletRequest request,
			HttpServletResponse response) throws IOException, BadHanyuPinyinOutputFormatCombination,
			IllegalAccessException, InvocationTargetException {
		if (!file.isEmpty()) {
			// 图片服务器路径
			String file_path = realFileUrl;// String file_path ="D:\\Q1_Files\\uploadFiles\\";

			// 取得当前上传文件的文件名称
			String myFileName = file.getOriginalFilename();

			if (myFileName.trim() != "") {// 如果名称不为“”,说明该文件存在，否则说明该文件不存在
				// 重命名上传后的文件名
//				String type = myFileName.substring(myFileName.lastIndexOf("."));

				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
				String url = "TeacherBase/" + sdf.format(System.currentTimeMillis()) + "/";

				// 定义上传路径
				String path = file_path + url + myFileName;
				File localFile = new File(path);

				if (!localFile.exists()) { // 判断文件夹是否存在
					localFile.mkdirs(); // 不存在则创建
				}

				file.transferTo(localFile);
				entity.setZp(url + myFileName);
			}
		}

		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String userName = entity.getUserName();
		String  sfzjh = entity.getSfzjh();
		String  userNumb = entity.getUserNumb();
		// 判断身份证件号是否重复
		if (StringUtils.isNotEmpty(sfzjh) && thisService.IsFieldExist("sfzjh", sfzjh, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"身份证件号不能重复！\""));
			return;
		}

		// 判断学号是否重复
		if (thisService.IsFieldExist("userNumb", userNumb, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"工号不能重复！\""));
			return;
		}
		
		// 判断学号是否重复
		if (thisService.IsFieldExist("userName", userName, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"用户名不能重复！\""));
			return;
		}
		
//		String deptJobId = request.getParameter("deptJobId");
		// 获取当前操作用户    
        SysUser currentUser = getCurrentSysUser();
        entity=thisService.doAddTeacher(entity,currentUser/*,deptJobId*/);  

		// 返回实体到前端界面
		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
	}

	/**
	 * @param entity
	 * @param file
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping(value = { "/doUpdate" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void doUpdates(TeaTeacherbase entity, @RequestParam("file") MultipartFile file, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		// 入库前检查代码
		try {
			String hql1 = " o.isDelete='0'";
			if (thisService.IsFieldExist("sfzjh", entity.getSfzjh(), entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"教师的身份证件号不能重复！\""));
				return;
			}
			if (StringUtils.isNotEmpty(entity.getUserName())&&thisService.IsFieldExist("userName", entity.getUserName(), entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"用户名不能重复！\""));
				return;
			}
			if (StringUtils.isNotEmpty(entity.getUserNumb())&&thisService.IsFieldExist("userNumb", entity.getUserNumb(), entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"工号不能重复！\""));
				return;
			}

			if (!file.isEmpty() && file.getSize() > 0) {
				// 图片服务器路径
				String file_path = realFileUrl;// String file_path =
				// 取得当前上传文件的文件名称
				String myFileName = file.getOriginalFilename();
				if (myFileName.trim() != "") {// 如果名称不为“”,说明该文件存在，否则说明该文件不存在
					// 重命名上传后的文件名
					String type = myFileName.substring(myFileName.lastIndexOf("."));

					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					String url = "TeacherBase/" + sdf.format(System.currentTimeMillis()) + "/";

					// 定义上传路径
					String path = file_path + url + myFileName;
					File localFile = new File(path);

					if (!localFile.exists()) { // 判断文件夹是否存在
						localFile.mkdirs(); // 不存在则创建
					}

					file.transferTo(localFile);
					entity.setZp(url + myFileName);
				}
			}
			// 获取当前的操作用户
			SysUser currentUser = getCurrentSysUser();
			entity = thisService.doUpdateEntity(entity, currentUser.getXm(), null);

			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));

		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"请求失败,请联系管理员！\""));
		}

	}

}

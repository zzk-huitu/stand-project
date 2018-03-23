
package com.zd.school.student.studentinfo.controller;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.crypto.hash.Sha256Hash;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.PinyinUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.student.studentinfo.model.StuBaseinfo;
import com.zd.school.student.studentinfo.service.StuBaseinfoService;

import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

/**
 * 
 * ClassName: StuBaseinfoController Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 学生基本信息实体Controller. date: 2016-07-19
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/StuBaseinfo")
public class StuBaseinfoController extends FrameWorkController<StuBaseinfo> implements Constant {

	@Resource
	StuBaseinfoService thisService; // service层接口
	
	@Value("${realFileUrl}")
	private String realFileUrl; // 文件目录物理路径

	@Value("${virtualFileUrl}")
	private String virtualFileUrl; // 文件目录虚拟路径

	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param StuBaseinfo
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/doAdd" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void doAdd(@RequestParam("file") MultipartFile file, StuBaseinfo entity, HttpServletRequest request,
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
				String url = "StuBaseinfo/" + sdf.format(System.currentTimeMillis()) + "/";

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
		String sfzjh = entity.getSfzjh();
		String userName = entity.getUserName();
		String xh = entity.getUserNumb();
		String xjh = entity.getXjh();

		// 判断身份证件号是否重复
		if (StringUtils.isNotEmpty(sfzjh)&&thisService.IsFieldExist("sfzjh", sfzjh, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"身份证件号不能重复！\""));
			return;
		}
		
		// 判断用户名是否重复
		if (StringUtils.isNotEmpty(userName) && thisService.IsFieldExist("userName", userName, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"用户名不能重复！\""));
			return;
		}

		// 判断学号是否重复
		if (thisService.IsFieldExist("userNumb", xh, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"学号不能重复！\""));
			return;
		}

		// 判断学籍号是否重复
		if (StringUtils.isNotEmpty(xjh)&&thisService.IsFieldExist("xjh", xjh, "-1")) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"学籍号不能重复！\""));
			return;
		}

		
//		String deptJobId = request.getParameter("deptJobId");
		// 获取当前操作用户    
        SysUser currentUser = getCurrentSysUser();

		entity = thisService.doAddStudent(entity, currentUser/*, deptJobId */);

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
		else
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
	public void doUpdates(StuBaseinfo entity, @RequestParam("file") MultipartFile file, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {
		// 入库前检查代码
		try {
			String hql1 = " o.isDelete='0'";
			if (StringUtils.isNotEmpty(entity.getSfzjh())&&thisService.IsFieldExist("sfzjh", entity.getSfzjh(), entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"身份证件号不能重复！\""));
				return;
			}
			if (StringUtils.isNotEmpty(entity.getUserName())&&thisService.IsFieldExist("userName", entity.getUserName(), entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"用户名不能重复！\""));
				return;
			}
			if (StringUtils.isNotEmpty(entity.getUserNumb())&&thisService.IsFieldExist("userNumb", entity.getUserNumb(), entity.getUuid(), hql1)) {
				writeJSON(response, jsonBuilder.returnFailureJson("\"学号不能重复！\""));
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
					String fileName = String.valueOf(System.currentTimeMillis()) + type;

					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					String url = "StuBaseinfo/" + sdf.format(System.currentTimeMillis()) + "/";

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

package com.zd.school.plartform.coursemanage.controller;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.ImportNotInfo;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.EntityExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.arrangecourse.model.JwCourseArrange;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysOrgService;


/**
 * 
 * ClassName: JwTCourseArrangeController Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: 排课课程表实体Controller. date: 2016-03-24
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/CourseArrange")
public class CourseArrangeController extends FrameWorkController<JwCourseArrange> implements Constant {

	@Resource
	JwCourseArrangeService thisService; // service层接口。。。
	
	@Resource
	private SysOrgService sysOrgService;

	/**
	 * 标准的查询列表功能
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(BaseJob entity, HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		
		String filter = request.getParameter("filter");
		String deptId = request.getParameter("deptId");
		String deptType = request.getParameter("deptType");

		if (StringUtils.isEmpty(deptId)) {
			deptId = AdminType.ADMIN_ORG_ID;
		}

		Integer isAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISADMIN);
		Integer isSchoolAdmin = (Integer) request.getSession().getAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN);

		// 若当前用户是超级管理员/学校管理员，并且为学校部门，则查询出所有的用户
		// if ((isAdmin == 1 || isSchoolAdmin==1) &&
		// deptId.equals(AdminType.ADMIN_ORG_ID)) {...}
		// 当部门不为根部门时 或者 不为管理员时，就要去查询内部的数据
		if (!deptId.equals(AdminType.ADMIN_ORG_ID) || !(isAdmin == 1 || isSchoolAdmin == 1)) {
			if ("05".equals(deptType)) { // 当选择的区域为班级时

				if (StringUtils.isNotEmpty(filter)) {
					filter = filter.substring(0, filter.length() - 1);
					filter += ",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + deptId
							+ "\",\"field\":\"claiId\"}" + "]";
				} else {
					filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + deptId
							+ "\",\"field\":\"claiId\"}]";
				}

			} else { // 当选择的区域不为班级时

				SysUser currentUser = getCurrentSysUser();
				String classIds = getClassIds(deptId, currentUser);

				if (StringUtils.isNotEmpty(classIds)) {

					if (StringUtils.isNotEmpty(filter)) {
						filter = filter.substring(0, filter.length() - 1);
						filter += ",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + classIds
								+ "\",\"field\":\"claiId\"}" + "]";
					} else {
						filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + classIds
								+ "\",\"field\":\"claiId\"}]";
					}

				} else { // 若区域之下没有班级，则直接返回空数据

					strData = jsonBuilder.buildObjListToJson(0L, new ArrayList<>(), true);// 处理数据
					writeJSON(response, strData);// 返回数据
					return;
				}
			}
		}
		
		QueryResult<JwCourseArrange> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), filter, true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
	
	
    @Auth("COURSETABLE_add")
	@RequestMapping("/doAdd")
	public void doAdd(JwCourseArrange entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {
		
		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();

		entity = thisService.doAddEntity(entity, currentUser.getXm());

		if (entity == null)
			writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
		else
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
	}
    
    @Auth("COURSETABLE_delete")
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"没有传入删除主键\""));
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
	
    @Auth("COURSETABLE_use")
	@RequestMapping("/doCouseUse")
	public void doCouseUse(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String ids = request.getParameter("ids");
		String teachTimes = request.getParameter("teachTimes");
		String classIds = request.getParameter("classIds");
		
		String[] idArr=ids.split(",");
		String[] teachTimeArr=teachTimes.split(",");
		String[] classIdArr=classIds.split(",");
		SysUser sysuser = getCurrentSysUser();
		
		thisService.doCouseUse(idArr,classIdArr,teachTimeArr,sysuser.getXm());
		
		writeJSON(response, jsonBuilder.returnSuccessJson("\"启用课表成功\""));		
	}
    @Auth("COURSETABLE_unUse")
	@RequestMapping("/doCouseUnUse")
	public void doCouseUnUse(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String ids = request.getParameter("ids");		
		
		String[] idArr=ids.split(",");	
		SysUser sysuser = getCurrentSysUser();		
		
		thisService.updateByProperties("uuid", idArr,
				new String[]{"extField05","updateUser","updateTime"},
				new Object[]{"0",sysuser.getXm(),new Date()});		
		
		writeJSON(response, jsonBuilder.returnSuccessJson("\"禁用课表成功\""));		
	}
    @Auth("COURSETABLE_import")	
	@RequestMapping(value = { "/importExcel" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void importExcel(@RequestParam("file") MultipartFile file, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		try {
			SysUser currentUser=getCurrentSysUser();
			InputStream in = null;
			List<ImportNotInfo> listReturn;
			
			if (!file.isEmpty()) {
				in = file.getInputStream();
				Workbook workbook = WorkbookFactory.create(in);
				in.close();
				
				//读取信息
				Sheet sheet = workbook.getSheetAt(0);
				int rowCount = sheet.getPhysicalNumberOfRows();	 // 获取总行数
				
				Map<String, List<String>> gccMap = new HashMap<String, List<String>>();		
				for (int r = 2; r < rowCount; r++) {
					Row row = sheet.getRow(r);
					int cellCount = row.getPhysicalNumberOfCells();
	
					for (int c = 2; c < cellCount; c++) {
						List<String> courseList = new ArrayList<String>();
						Cell gcNameCell = sheet.getRow(1).getCell(c);
						String gcName = gcNameCell.getStringCellValue();
						for (int cr = 2; cr < rowCount; cr++) {
							Row courseRow = sheet.getRow(cr);
							Cell cell = courseRow.getCell(c);
							
							if(cell!=null){
								String cellValue = cell.getStringCellValue().trim();
								courseList.add(cellValue);
							}						
						}
						gccMap.put(gcName, courseList);
					}
				}
				
				listReturn = thisService.doImportCourse(gccMap, currentUser);

				if (listReturn.size() == 0)
					writeJSON(response, jsonBuilder.returnSuccessJson("\"课表导入成功！\""));
				else {
					String strData = jsonBuilder.buildList(listReturn, "");
					request.getSession().setAttribute("CourseArrangeImportError", strData);
					writeJSON(response, jsonBuilder.returnSuccessJson("-1")); // 返回前端-1，表示存在错误数据
				}

			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"文件不存在！\""));
			}

		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"课表导入失败,请联系管理员！\""));
		}							
	}
	
	@RequestMapping(value = { "/downNotImportInfo" })
	public void downNotImportInfo(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Object obj = request.getSession().getAttribute("CourseArrangeImportError");
		if (obj != null) {

			request.getSession().removeAttribute("CourseArrangeImportError");// 移除此session

			String downData = (String) obj;

			List<ImportNotInfo> list = (List<ImportNotInfo>) jsonBuilder.fromJsonArray(downData, ImportNotInfo.class);
			EntityExportExcel excel = new EntityExportExcel();

			String[] Title = { "序号", "班级名称", "异常级别", "异常原因" };
			Integer[] coulumnWidth = { 8, 20, 20, 100 };
			Integer[] coulumnDirection = { 1, 1, 1, 1 };

			List<String> excludeList = new ArrayList<>();
			SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy年MM月dd日");
			String fileNAME = "（" + sdf2.format(new Date()) + "）导入课表的异常信息名单";

			excel.exportExcel(response, fileNAME, Title, list, excludeList, coulumnWidth, coulumnDirection);
		}
	}
	
	/**
	 * 获取某个区域下的所有班级id
	 * 
	 * @param roomId
	 * @param roomLeaf
	 * @return
	 */
	private String getClassIds(String deptId, SysUser currentUser) {

		List<CommTreeChk> baseOrgList = sysOrgService.getUserRightDeptClassTreeList(currentUser);
		String classIds = baseOrgList.stream().filter((x) -> {
			if (x.getNodeType().equals("05") && x.getTreeid().indexOf(deptId) != -1)
				return true;
			return false;
		}).map((x) -> x.getId()).collect(Collectors.joining(","));

		return classIds;
	}
	

}

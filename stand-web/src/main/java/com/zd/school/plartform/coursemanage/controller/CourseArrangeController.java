package com.zd.school.plartform.coursemanage.controller;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.ImportNotInfo;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.EntityExportExcel;
import com.zd.core.util.StringUtils;
import com.zd.core.util.readTxt;
import com.zd.school.jw.arrangecourse.model.JwCourseArrange;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.model.JwXyz;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.jw.eduresources.model.JwTBasecourse;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTBasecourseService;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.jw.push.model.PushInfo;
import com.zd.school.jw.push.service.PushInfoService;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

import jxl.Workbook;
import jxl.write.WritableWorkbook;

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
	JwTGradeclassService classService;

	@Resource
	PushInfoService pushService;

	@Resource
	private JwTGradeclassService jwClassService;

	@Resource
	private JwTBasecourseService jtbService;

	@Resource
	private JwCourseteacherService courseTeacherService;

	@Resource
	private TeaTeacherbaseService teacherService;

	@Resource
	private SysUserService userService;
	
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
		String areaId = request.getParameter("areaId");
		String areaType = request.getParameter("areaType");
		if(StringUtils.isEmpty(areaType)){
			areaType="04";
		}else{
			areaType="0"+areaType;
		}
		
		//若为类型班级，则查询下面所有班级
		if(!"04".equals(areaType)){
			String hql="select a.uuid from JwTGradeclass a where a.isDelete=0 and a.graiId ='"+areaId+"'";
			List<String> lists=thisService.queryEntityByHql(hql);
			if(!lists.isEmpty()){
				String areaIds=lists.stream().collect(Collectors.joining(","));
				if(filter.length()>0){
					filter = filter.substring(0, filter.length()-1);
					filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ areaIds+"\",\"field\":\"claiId\"}"+"]";
				}else{
					filter="[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ areaIds+"\",\"field\":\"claiId\"}]";
				}
			}else{//为楼栋或校区，其下没有楼层

				strData = jsonBuilder.buildObjListToJson(0L,new ArrayList<>(), true);// 处理数据
				writeJSON(response, strData);// 返回数据
				return;
			}
		}else{
			if(areaId!=null){
				if(filter.length()>0){
					filter = filter.substring(0, filter.length()-1);
					filter+=",{\"type\":\"string\",\"comparison\":\"=\",\"value\":\""+areaId+"\",\"field\":\"claiId\"}"+"]";
				}else{
					filter="[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\""+ areaId+"\",\"field\":\"claiId\"}]";
				}
			}
		}
		
		QueryResult<JwCourseArrange> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	@RequestMapping(value = { "/importExcel" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void importExcel(@RequestParam("file") MultipartFile file, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		try {
			org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(file.getInputStream());
			Sheet sheet = workbook.getSheetAt(0);
			int rowCount = sheet.getLastRowNum(); // 获取总行数
			//rowCount=sheet.getPhysicalNumberOfRows();

			Map<String, List<String>> gccMap = new HashMap<String, List<String>>();

			for (int r = 2; r < rowCount - 1; r++) {
				Row row = sheet.getRow(r);
				int cellCount = row.getPhysicalNumberOfCells();

				for (int c = 2; c < cellCount; c++) {
					List<String> courseList = new ArrayList<String>();
					Cell gcNameCell = sheet.getRow(1).getCell(c);
					String gcName = gcNameCell.getStringCellValue();
					for (int cr = 2; cr < rowCount - 1; cr++) {
						Row courseRow = sheet.getRow(cr);
						Cell cell = courseRow.getCell(c);
						String cellValue = cell.getStringCellValue().trim();
						courseList.add(cellValue);
					}
					gccMap.put(gcName, courseList);
				}

			}

			String schoolId = "2851655E-3390-4B80-B00C-52C7CA62CB39";
			String schoolName = "演示学校";
			String andIsDelete = " and isDelete=0 ";
			String hql;

			String sql = "SELECT ISNULL(MAX(ISDELETE),-1) FROM JW_T_COURSE_ARRANGE WHERE CLASS_NAME LIKE '高%'";
			List<Object[]> objects = thisService.queryObjectBySql(sql);
			Integer maxIsDelete = new Integer(objects.get(0) + "") + 1;

			for (String key : gccMap.keySet()) {
				List<JwCourseArrange> courseArranges = new ArrayList<JwCourseArrange>(); //排课课程表对象

				int gcStrLength = key.length();
				String grade = key.substring(0, 2);
				String gcName;
				if (gcStrLength == 4) {
					String classNum = key.substring(2, 3);
					gcName = grade + "(" + classNum + ")" + "班";
				} else {
					String classNum = key.substring(2, 4);
					gcName = grade + "(" + classNum + ")" + "班";
				}

				hql = "from JwTGradeclass where className='" + gcName + "'" + andIsDelete;
				JwTGradeclass gc = jwClassService.queryByHql(hql).get(0);
				List<String> gcList = gccMap.get(key);
				int index = 0;
				for (int j = 1; j <= gcList.size() / 9; j++) {

					for (int i = 0; i < 9; i++) {
						JwCourseArrange jca;
						try {
							jca = courseArranges.get(i);
						} catch (Exception e) {
							jca = new JwCourseArrange();
							courseArranges.add(jca);
						}
						String cousreName = gcList.get(index);
						index++;
						hql = "from JwTBasecourse where courseName='" + cousreName + "'" + andIsDelete;
						JwTBasecourse basecourse = jtbService.queryByHql(hql).get(0);

						hql = "from JwCourseteacher where courseId='" + basecourse.getUuid() + "' and claiId='"
								+ gc.getUuid() + "'" + andIsDelete;
						JwCourseteacher teacher= new JwCourseteacher();;

						try {
							List<JwCourseteacher> courseteachers = courseTeacherService.queryByHql(hql);
							String teacherGh = "";
							String teacherName = "";
							String teacherId = "";
							for (JwCourseteacher jwCourseteacher : courseteachers) {
								teacherId += jwCourseteacher.getTteacId() + ",";
								teacherGh += jwCourseteacher.getUserNumb() + ",";
								teacherName += jwCourseteacher.getXm() + ",";
							}
							teacherId = StringUtils.trimLast(teacherId);
							teacherGh = StringUtils.trimLast(teacherGh);
							teacherName = StringUtils.trimLast(teacherName);
							teacher.setTteacId(teacherId);
							teacher.setUserNumb(teacherGh);
							teacher.setXm(teacherName);
						} catch (Exception e) {
							//teacher = new JwCourseteacher();
						}

						jca.setSchoolId(schoolId);
						jca.setSchoolName(schoolName);
						jca.setClassName(gcName);
						jca.setClaiId(gc.getUuid());
						jca.setTeachTime(i+1 + "");
						jca.setExtField05("0");
						jca.setIsDelete(maxIsDelete);

						switch (j) {
						case 1:
							jca.setCourseId01(basecourse.getUuid());
							jca.setCourseName01(basecourse.getCourseName());
							jca.setTteacId01(teacher.getTteacId());
							jca.setTeacherGh01(teacher.getUserNumb());
							jca.setTeacherName01(teacher.getXm());
							break;
						case 2:
							jca.setCourseId02(basecourse.getUuid());
							jca.setCourseName02(basecourse.getCourseName());
							jca.setTteacId02(teacher.getTteacId());
							jca.setTeacherGh02(teacher.getUserNumb());
							jca.setTeacherName02(teacher.getXm());
							break;
						case 3:
							jca.setCourseId03(basecourse.getUuid());
							jca.setCourseName03(basecourse.getCourseName());
							jca.setTteacId03(teacher.getTteacId());
							jca.setTeacherGh03(teacher.getUserNumb());
							jca.setTeacherName03(teacher.getXm());
							break;
						case 4:
							jca.setCourseId04(basecourse.getUuid());
							jca.setCourseName04(basecourse.getCourseName());
							jca.setTteacId04(teacher.getTteacId());
							jca.setTeacherGh04(teacher.getUserNumb());
							jca.setTeacherName04(teacher.getXm());
							break;
						case 5:
							jca.setCourseId05(basecourse.getUuid());
							jca.setCourseName05(basecourse.getCourseName());
							jca.setTteacId05(teacher.getTteacId());
							jca.setTeacherGh05(teacher.getUserNumb());
							jca.setTeacherName05(teacher.getXm());
							break;
						case 6:
							jca.setCourseId06(basecourse.getUuid());
							jca.setCourseName06(basecourse.getCourseName());
							jca.setTteacId06(teacher.getTteacId());
							jca.setTeacherGh06(teacher.getUserNumb());
							jca.setTeacherName06(teacher.getXm());
							break;
						case 7:
							jca.setCourseId07(basecourse.getUuid());
							jca.setCourseName07(basecourse.getCourseName());
							jca.setTteacId07(teacher.getTteacId());
							jca.setTeacherGh07(teacher.getUserNumb());
							jca.setTeacherName07(teacher.getXm());
							break;
						}
					}

				}

				for (JwCourseArrange jwCourseArrange : courseArranges) {
					thisService.merge(jwCourseArrange);
				}

			}
			writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson("'课表导入成功'")));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson(jsonBuilder.toJson("'课表导入失败'")));
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = { "/downNotImportInfo" })
	public void downNotImportInfo(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Object obj = request.getSession().getAttribute("UserImportError");
		if (obj != null) {

			request.getSession().removeAttribute("UserImportError");// 移除此session

			String downData = (String) obj;

			List<ImportNotInfo> list = (List<ImportNotInfo>) jsonBuilder.fromJsonArray(downData, ImportNotInfo.class);
			EntityExportExcel excel = new EntityExportExcel();

			String[] Title = { "序号", "用户姓名", "异常级别", "异常原因" };
			Integer[] coulumnWidth = { 8, 20, 20, 100 };
			Integer[] coulumnDirection = { 1, 1, 1, 1 };

			List<String> excludeList = new ArrayList<>();
			SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy年MM月dd日");
			String fileNAME = "（" + sdf2.format(new Date()) + "）导入用户的异常信息名单";

			excel.exportExcel(response, fileNAME, Title, list, excludeList, coulumnWidth, coulumnDirection);
		}
	}
	
	
	

}

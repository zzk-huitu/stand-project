package com.zd.school.app.wisdomclass.controller;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.controller.core.BaseController;
import com.zd.core.util.DateUtil;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.arrangecourse.model.JwFuncroomcourse;
import com.zd.school.jw.arrangecourse.service.JwFuncroomcourseService;
import com.zd.school.jw.ecc.model.EccClassredflag;
import com.zd.school.jw.ecc.model.EccClassstar;
import com.zd.school.jw.eduresources.model.JwCalender;
import com.zd.school.jw.eduresources.model.JwCalenderdetail;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.jw.model.app.ClassInfoForApp;
import com.zd.school.jw.model.app.ClassStudentApp;
import com.zd.school.jw.model.app.CommonApp;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.service.BaseAttachmentService;
import com.zd.school.plartform.baseset.service.BaseCalenderService;
import com.zd.school.plartform.baseset.service.BaseCalenderdetailService;
import com.zd.school.plartform.baseset.service.BaseCampusService;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.student.studentclass.model.JwClassstudent;
import com.zd.school.student.studentclass.service.JwClassstudentService;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;
import com.zd.school.wisdomclass.ecc.service.EccClasselegantService;
import com.zd.school.wisdomclass.ecc.service.EccClassredflagService;
import com.zd.school.wisdomclass.ecc.service.EccClassstarService;

@Controller
@RequestMapping("/app/GradeClass")
public class GradeClassAppController extends BaseController<JwTGradeclass> {

	@Value("${virtualFileUrl}")  	//读取在配置文件属性
	private String virtualFileUrl; 	//文件目录虚拟路径
	
	@Resource
	JwTGradeclassService thisService;

	@Resource
	TeaTeacherbaseService teacherService;

	@Resource
	JwClassteacherService classTeacherService;

	@Resource
	JwClassstudentService classStudentService;

	@Resource
	BaseRoominfoService brService;

	// @Resource
	// JwClassRoomAllotService jraService;

	@Resource
	EccClassstarService starService;

	@Resource
	EccClassredflagService flagService;

	@Resource
	EccClasselegantService elegantService; // service层接口

	@Resource
	BaseAttachmentService baseTAttachmentService;// service层接口

	@Resource
	private BaseInfotermService termService; // 终端设备serice层接口

	@Resource
	private JwFuncroomcourseService funcCourseService; // 功能室课表
	@Resource
	private BaseCampusService campusService; // 校区信息
	@Resource
	private BaseCalenderService calendarService; // 校历
	@Resource
	private BaseCalenderdetailService calendarDetailService; // 校历详情


	/**
	 * 获取班级列表信息
	 * @param classId
	 * @return
	 */
	@RequestMapping(value = { "/getGradeClassList" }, method = RequestMethod.GET)
	public @ResponseBody CommonApp<Map<String, Object>> getGradeClassList() {
		CommonApp<Map<String, Object>> info=new CommonApp<>();
		String sql="select a.CLAI_ID,a.CLASS_NAME,b.GRADE_NAME from JW_T_GRADECLASS a join JW_T_GRADE b "
				+ " on a.GRAI_ID=b.GRAI_ID where a.ISDELETE=0 and b.ISDELETE=0"
				+ " order by b.SECTION_CODE asc,b.GRADE_CODE asc,a.ORDER_INDEX asc";
		List<Map<String, Object>> classMap = thisService.queryMapBySql(sql);
		
		info.setMessage(true);
		info.setMessageInfo("调用成功！");
		info.setList(classMap);
		
		
		return info;
	}
	
	/**
	 * 获取班级信息
	 * @param classId
	 * @return
	 */
	@RequestMapping(value = { "/getClassInfo" }, method = RequestMethod.GET)
	public @ResponseBody ClassInfoForApp getClassInfo(@RequestParam(value = "classId") String classId) {
		
		ClassInfoForApp info = new ClassInfoForApp();

		JwTGradeclass classInfo = thisService.get(classId);// 班级对象
		if (classInfo == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到对应的班级！");
			return info;
		}
		
		Map<String,String> sort = new HashMap<>();
		sort.put("category", "asc");
		JwClassteacher calssTeacher = classTeacherService.getByProerties(
				new String[]{"claiId","isDelete"},
				new Object[]{classId,0},sort);		//率先读取正班主任
		if (calssTeacher == null) {
			info.setMessage(false);
			info.setMessageInfo("找不到班主任信息！");
			return info; 
		}
		String teacherId = calssTeacher.getTteacId();
		List<TeaTeacherbase> teacherList = teacherService.queryByProerties("uuid", teacherId);
		if (teacherList.isEmpty()) {
			info.setMessage(false);
			info.setMessageInfo("未找到该班级的班主任信息！");
			return info;
		}
		info.setTeacherInfo(teacherList.get(0));
		
		
		Date date = new Date();
		String today = DateUtil.formatDate(date);
		
		//查询班级星级信息
		String hql = "from EccClassstar where isDelete=0 and claiId='" + classInfo.getUuid() + "' and beginDate<='"
				+ today + "' and endDate>='" + today + "'";
		List<EccClassstar> classstarList = starService.queryByHql(hql);
		if (!classstarList.isEmpty()) {
			EccClassstar starInfo = classstarList.get(0);
			info.setClassstarInfo(starInfo);
		}
		
		//查询班级红旗信息(显示最新的红旗)
		hql = "from EccClassredflag where isDelete=0 and claiId='" + classInfo.getUuid() + "' and beginDate<='" + today
				+ "' and endDate>='" + today + "' order by redflagType";
		List<EccClassredflag> classflagList = flagService.queryByHql(hql);
		if (classflagList != null && classflagList.size() > 0) {
			if (classflagList.size() > 1) {
				for (int i = 1; i < classflagList.size(); i++) {
					EccClassredflag before = classflagList.get(i - 1);
					EccClassredflag now = classflagList.get(i);
					if (before.getRedflagType().equals(now.getRedflagType())) {
						classflagList.remove(before);
					    i--;
					}
				}
			}
			info.setRedflagList(classflagList);
		}

		info.setMessage(true);
		info.setMessageInfo("请求成功！");
		info.setClassInfo(classInfo);
		return info;
	}
	
	/**
	 * 获取班级学生列表
	 * @param termCode	设备终端号
	 * @param classId	班级ID（若设备绑定的房间为功能室，则不需要传入班级ID）
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping(value = { "/getClassStudent" }, method = RequestMethod.GET)
	public @ResponseBody ClassStudentApp getClassstudent(@RequestParam("termCode") String termCode, 
			@RequestParam(value="classId",required=false) String classId) throws ParseException {
		
		ClassStudentApp info = new ClassStudentApp();

		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);
		if (roomTerm == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}
		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到设备对应房间！");
			return info;
		}

		if (roominfo.getRoomType().equals("5")) { // 当为功能室的时候
			
			classId	= null;	//置空
			
			int dayNum = DateUtil.mathWeekDay(new Date());	// 星期参数
			
			String campusId = campusService.getCampusIdByRoom(roominfo);	//获取校区ID
			
			//找到了校区
			if(campusId!=null){
				String[] propName = new String[] { "campusId", "activityState", "isDelete" };
				Object[] propValue = new Object[] { campusId, 1, 0 };
				JwCalender calender = calendarService.getByProerties(propName, propValue); // 查询出校区启用的作息时间
				
				//找到了作息时间
				if(calender!=null){
					propName = new String[] { "canderId", "isDelete" };
					propValue = new Object[] { calender.getUuid(), 0 };
					List<JwCalenderdetail> calenderDetails = calendarDetailService.queryByProerties(propName, propValue);	//查询出作息时间详细
					
					
					// 根据当前时间取得现在的节次
					String teachTime = "";
					for (JwCalenderdetail calenderdetail : calenderDetails) {
						String tS = DateUtil.formatDate(calenderdetail.getBeginTime(), "HH:mm:ss");
						if (calenderdetail.getEndTime() != null) {
							String tE = DateUtil.formatDate(calenderdetail.getEndTime(), "HH:mm:ss");
							if (DateUtil.isInZone(DateUtil.getLong(tS), DateUtil.getLong(tE), DateUtil.getCurrentTime())) {
								teachTime = calenderdetail.getJcCode(); 
								break;
							}
						}
					}
					
					//获取功能室的课程信息
					propName = new String[] { "roomId", "teachTime","isDelete" };
					propValue = new Object[] { roomTerm.getRoomId(), teachTime,0};
					JwFuncroomcourse funcroomcourses = funcCourseService.getByProerties(propName, propValue);
					
					//最后获取星期N的功能室课程的班级
					if (funcroomcourses != null) {
						classId = EntityUtil.getPropertyValue(funcroomcourses, "claiId0" + dayNum) + "";
					}
				}
			}	
			
		} else { // 当为教室的时候

			// 验证班级是否存在
			JwTGradeclass classInfo = thisService.get(classId);
			if (classInfo == null) {
				info.setMessage(false);
				info.setMessageInfo("未找到该班级信息！");
				return info;
			}

		}

		//获取学生信息（暂时不处理请假的人员）
		if (StringUtils.isNotEmpty(classId)) {
		
			//查询班级下的学生信息
			String hql = "from JwClassstudent where claiId='" + classId + "' and isDelete=0";
			List<JwClassstudent> list = classStudentService.queryByHql(hql);
		
			//直接遍历修改各个数据的照片路径（加入虚拟目录名）
			list.stream().forEach(x->x.setZp(virtualFileUrl+"/"+x.getZp()));
			
//			for (JwClassstudent jwClassstudent : list) {
//				jwClassstudent.setZp(request.getScheme() + "://" + request.getServerName() + ":"
//						+ request.getServerPort() + "/app/JwTGradeclass/download?filename=" + jwClassstudent.getZp());		
//			}
			
			info.setTotalLeaveed(0);
			info.setList(list);
			info.setMessage(true);
			info.setMessageInfo("查询成功");
		} else {
			info.setMessage(false);
			info.setMessageInfo("暂时不需要考勤");
			return info;
		}
		return info;
	}

	
}

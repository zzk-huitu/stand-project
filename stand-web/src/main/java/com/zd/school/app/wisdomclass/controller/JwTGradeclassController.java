package com.zd.school.app.wisdomclass.controller;



import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.controller.core.BaseController;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.DateUtil;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.FileOperateUtil;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.JwClassRoomAllot;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.ecc.model.EccClasselegant;
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
import com.zd.school.jw.model.app.EccClasselegantApp;
import com.zd.school.jw.model.app.JwCheckruleclassApp;
import com.zd.school.jw.model.app.JwCheckrulestudent;
import com.zd.school.jw.model.app.PictureApp;
import com.zd.school.jw.model.app.PictureForApp;
import com.zd.school.jw.model.app.PictureReturnApp;
import com.zd.school.jw.model.app.VideoApp;
import com.zd.school.jw.model.app.VideoForApp;
import com.zd.school.jw.model.app.VideoReturnApp;
import com.zd.school.oa.attendance.model.AttTerm;
import com.zd.school.oa.attendance.model.AttTime;
import com.zd.school.oa.attendance.model.AttTitle;
import com.zd.school.oa.attendance.service.AttTermService;
import com.zd.school.oa.attendance.service.AttTimeService;
import com.zd.school.oa.attendance.service.AttTitleService;
import com.zd.school.oa.attendance.service.AttUserService;
import com.zd.school.oa.flow.model.LeaveApplay;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.model.BaseAttachment;
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
@RequestMapping("/app/JwTGradeclass")
public class JwTGradeclassController extends BaseController<JwTGradeclass> {

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

	//@Resource
	//JwClassRoomAllotService jraService;

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
	
	//@Resource
	//private JwFuncroomcourseService funcCourseService; // 功能室课表
	@Resource
	private BaseCampusService campusService; // 校区信息
	@Resource
	private BaseCalenderService calendarService; // 校历
	@Resource
	private BaseCalenderdetailService calendarDetailService; // 校历详情

	@Resource
	private AttTitleService attTitleService;
	@Resource
	private AttTimeService attTimeService;
	@Resource
	private AttTermService attTermService;
	@Resource
	private AttUserService attUserService;
	//@Resource
	//private LeaveApplayService leaveApplayService;

	
	/**
	 * 根据班级ID得到该班级信息与班主任信息
	 * 
	 * @param classId
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = { "/getClassInfo" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody ClassInfoForApp getClassInfo(String classId, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		ClassInfoForApp info = new ClassInfoForApp();
		
		
		JwTGradeclass classInfo = thisService.get(classId);// 班级对象
		if (classInfo == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到对应的班级！");
			return info;
		}
		
		JwClassteacher calssTeacher = classTeacherService.getByProerties("claiId", classId);
		if (calssTeacher == null) {
			info.setMessage(false);
			info.setMessageInfo("找不到班主任信息");
			return info;
		}
		String teacherId = calssTeacher.getTteacId();
		List<TeaTeacherbase> teacherList = teacherService.queryByProerties("uuid", teacherId);
		if (teacherList == null || teacherList.size() <= 0) {
			info.setMessage(false);
			info.setMessageInfo("未找到该班级的班主任信息：班级ID=" + classInfo.getTeacherId() + "班主任ID=" + teacherId);
			return info;
		}
		
		Date date = new Date();
		String today = DateUtil.formatDate(date);
		String hql = "from EccClassstar where isDelete=0 and claiId='" + classInfo.getUuid() + "' and beginDate<='"
				+ today + "' and endDate>='" + today + "'";
		List<EccClassstar> classstarList = starService.queryByHql(hql);
		if (classstarList != null && classstarList.size() > 0) {
			EccClassstar starInfo = classstarList.get(0);
			info.setClassstarInfo(starInfo);
		}
		hql = "from EccClassredflag where isDelete=0 and claiId='" + classInfo.getUuid() + "' and beginDate<='" + today
				+ "' and endDate>='" + today + "'";
		List<EccClassredflag> classflagList = flagService.queryByHql(hql);
		if (classflagList != null && classflagList.size() > 0) {
			if (classflagList.size() > 1) {
				for (int i = 1; i < classflagList.size(); i++) {
					EccClassredflag before = classflagList.get(i - 1);
					EccClassredflag now = classflagList.get(i);
					if (before.getRedflagType().equals(now.getRedflagType())) {
						classflagList.remove(before);
					}
				}
			}
			info.setRedflagList(classflagList);
		}

		info.setMessage(true);
		info.setMessageInfo("请求成功！");
		info.setTeacherInfo(teacherList.get(0));
		info.setClassInfo(classInfo);
		return info;
	}
	
	// 获取班级学生
	@RequestMapping(value = { "/getClassstudent" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody ClassStudentApp getClassstudent(String termCode,String classId, HttpServletRequest request,
			HttpServletResponse response) throws IOException, ParseException {
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
		
		if (roominfo.getRoomType().equals("5")) {	//当为功能室的时候
			/*		
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			String campusId = campusService.getCampusIdByRoom(roominfo);
			String[] propName = new String[] { "campusId", "activityState", "isDelete" };
			Object[] propValue = new Object[] { campusId, 1, 0 };
			JwCalender calender = calendarService.getByProerties(propName, propValue); // 查询出校区启用校历
			propName = new String[] { "canderId", "isDelete" };
			propValue = new Object[] { calender.getUuid(), 0 };
			List<JwCalenderdetail> calenderDetails = calendarDetailService.queryByProerties(propName, propValue);
			String teachTime = "";
			for (JwCalenderdetail calenderdetail : calenderDetails) {
				String tS = DateUtil.formatDate(calenderdetail.getBeginTime(), "HH:mm:ss");
				if (calenderdetail.getEndTime() != null) {
					String tE = DateUtil.formatDate(calenderdetail.getEndTime(), "HH:mm:ss");
					if (DateUtil.isInZone(DateUtil.getLong(tS), DateUtil.getLong(tE), DateUtil.getCurrentTime())) {
						teachTime = calenderdetail.getJcCode(); // 根据时间取得现在的节次
					}
				}
			}
			propName = new String[] { "roomId", "teachTime" };
			propValue = new Object[] { roomTerm.getRoomId(), teachTime };
			JwFuncroomcourse funcroomcourses = funcCourseService.getByProerties(propName, propValue);
			if (funcroomcourses != null) {
				classId = EntityUtil.getPropertyValue(funcroomcourses, "claiId0" + dayNum) + "";
			}
			*/	
			
		} else {	//当为教室的时候	
			
			//验证班级是否存在
			JwTGradeclass classInfo=thisService.get(classId);
			if (classInfo == null) {
				info.setMessage(false);
				info.setMessageInfo("未找到该班级信息！");
				return info;
			}
			
		}
		
		if (StringUtils.isNotEmpty(classId)) {
			String hql = "from JwClassstudent where claiId='" + classId + "' and isDelete=0";
			List<JwClassstudent> list = classStudentService.queryByHql(hql);
			/*
			if (stuApplayedList == null) {
				stuApplayedList = leaveApplayService.getTodayInXSQJLC();
			}
			List<String> stuIds = new ArrayList<String>();
			for (LeaveApplay leaveApplay : stuApplayedList) {
				stuIds.add(leaveApplay.getApplayUserId());
			}
			int totalLeaveed = 0;
			for (JwClassstudent jwClassstudent : list) {
				jwClassstudent.setZp(request.getScheme() + "://" + request.getServerName() + ":"
						+ request.getServerPort() + "/app/JwTGradeclass/download?filename=" + jwClassstudent.getZp());
				if (stuIds.contains(jwClassstudent.getStudentId())) {
					jwClassstudent.setLeaveed(true);
					totalLeaveed++;
				}
			}
			info.setTotalLeaveed(totalLeaveed);
			*/
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
	
	/**
	 * 根据终端号、班级Id，获取当前课牌图片资源
	 * @param claiId
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = { "/downloadPic" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody PictureApp downloadPic(String termCode,String classId, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		PictureApp info = new PictureApp();
		
		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);	
		if (roomTerm==null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}
		
		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo==null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该设备绑定的房间信息！");
			return info;
		}
			
		
		String[] inType = { "JPG", "JPEG", "BMP", "PNG" };
		int maxSize = 300 * 1024 * 1024;
		List<BaseAttachment> attList = new ArrayList<BaseAttachment>();
		
		if (roominfo.getRoomType().equals("5")) {	//当为功能室的时候
					
			Map<String, String> map = new HashMap<String, String>();
			String[] propName = new String[] { "termCode", "isDelete" };
			Object[] propValue = new Object[] { termCode, 0 };
			List<AttTerm> attTerms = attTermService.queryByProerties(propName, propValue);
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			// 如果当前设备被分配到了特殊课程里
			if (attTerms != null && attTerms.size() != 0) {
				Set<String> titileIdSet = new HashSet<String>();
				for (AttTerm attTerm : attTerms) {
					titileIdSet.add(attTerm.getTitleId());
				}
				String titleIds = "";
				for (String id : titileIdSet) {
					titleIds += id + ",";
				}
				titleIds = "'" + titleIds.replaceAll(",", "','") + "'";
				StringBuffer hql = new StringBuffer("from AttTime where isDelete=0");
				hql.append(" and titleId in(" + titleIds + ")");
				hql.append(" and weekDay=" + dayNum);
				// 每周都需要考勤
				String hql2 = " and beginDate is null and endDate is null";
				List<AttTime> everyWeek = attTimeService.queryByHql(hql.toString() + hql2);
				String today = DateUtil.formatDate(new Date());
				// 某一时间段的周几需要考勤
				hql2 = " and beginDate<='" + today + "' and endDate>='" + today + "'";
				List<AttTime> sometimeWeek = attTimeService.queryByHql(hql.toString() + hql2);
				everyWeek.addAll(sometimeWeek);
				Set<String> claids = new HashSet<String>();
				for (AttTime attTime : everyWeek) {
					hql = new StringBuffer("from JwClassstudent where isDelete=0");
					hql.append(" and studentId in(select userId from AttUser where titleId='" + attTime.getTitleId()
							+ "' and isDelete=0)");
					List<JwClassstudent> list = classStudentService.queryByHql(hql.toString());
					for (JwClassstudent jwClassstudent : list) {
						claids.add(jwClassstudent.getClaiId());
					}
				}
				for (String claid : claids) {
					attList.addAll(filterFile(claid, inType, maxSize));
				}
			} 
			
		} else {	//当为教室的时候	

			JwTGradeclass classInfo=thisService.get(classId);
			if (classInfo == null) {
				info.setMessage(false);
				info.setMessageInfo("未找到该班级信息！");
				return info;
			}
			attList = filterFile(classInfo.getUuid(), inType, maxSize);
			
		}
		
		if (attList.size() > 100) {
			attList = attList.subList(0, 100);
		}
		List<PictureForApp> picList = new ArrayList<PictureForApp>();
		for (BaseAttachment baseAttachment : attList) {
			PictureForApp pic = new PictureForApp();
			String attUrl = baseAttachment.getAttachUrl();
			pic.setPictureName(attUrl.substring(attUrl.lastIndexOf('/') + 1));
			pic.setPictureURL(request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
					+ "/app/JwTGradeclass/download?filename=" + attUrl);
			picList.add(pic);
		}
		
		PictureReturnApp data = new PictureReturnApp();
		data.setTotalCount(picList.size());
		data.setPicList(picList);
		info.setData(data);
		info.setMessage(true);
		info.setMessageInfo("请求成功！");
		return info;
	}
	
	
	/**
	 * 根据终端号、班级Id，获取当前课牌视频资源
	 * @param claiId
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = { "/downloadVideo" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody VideoApp downloadVideo(String termCode,String classId, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		VideoApp info = new VideoApp();
		
		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);			
		if (roomTerm==null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}
		
		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo==null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该设备绑定的房间信息！");
			return info;
		}
	
		String[] inType = { "avi", "mp4", "3gp" };
		int maxSize = 800 * 1024 * 1024;
		List<BaseAttachment> attList = new ArrayList<BaseAttachment>();
		
		if (roominfo.getRoomType().equals("5")) {	//当为功能室的时候
			
			Map<String, String> map = new HashMap<String, String>();
			String[] propName = new String[] { "termCode", "isDelete" };
			Object[] propValue = new Object[] { termCode, 0 };
			List<AttTerm> attTerms = attTermService.queryByProerties(propName, propValue);
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			// 如果当前设备被分配到了特殊课程里
			if (attTerms != null && attTerms.size() != 0) {
				Set<String> titileIdSet = new HashSet<String>();
				for (AttTerm attTerm : attTerms) {
					titileIdSet.add(attTerm.getTitleId());
				}
				String titleIds = "";
				for (String id : titileIdSet) {
					titleIds += id + ",";
				}
				titleIds = "'" + titleIds.replaceAll(",", "','") + "'";
				StringBuffer hql = new StringBuffer("from AttTime where isDelete=0");
				hql.append(" and titleId in(" + titleIds + ")");
				hql.append(" and weekDay=" + dayNum);
				// 每周都需要考勤
				String hql2 = " and beginDate is null and endDate is null";
				List<AttTime> everyWeek = attTimeService.queryByHql(hql.toString() + hql2);
				String today = DateUtil.formatDate(new Date());
				// 某一时间段的周几需要考勤
				hql2 = " and beginDate<='" + today + "' and endDate>='" + today + "'";
				List<AttTime> sometimeWeek = attTimeService.queryByHql(hql.toString() + hql2);
				everyWeek.addAll(sometimeWeek);
				Set<String> claids = new HashSet<String>();
				for (AttTime attTime : everyWeek) {
					hql = new StringBuffer("from JwClassstudent where isDelete=0");
					hql.append(" and studentId in(select userId from AttUser where titleId='" + attTime.getTitleId()
							+ "' and isDelete=0)");
					List<JwClassstudent> list = classStudentService.queryByHql(hql.toString());
					for (JwClassstudent jwClassstudent : list) {
						claids.add(jwClassstudent.getClaiId());
					}
				}
				for (String claid : claids) {
					attList.addAll(filterFile(claid, inType, maxSize));
				}
			} 
			
		} else {	//当为教室的时候	

			JwTGradeclass classInfo=thisService.get(classId);
			if (classInfo == null) {
				info.setMessage(false);
				info.setMessageInfo("未找到该班级信息！");
				return info;
			}
			attList = filterFile(classInfo.getUuid(), inType, maxSize);
			
		}
		
		if (attList.size() > 100) {
			attList = attList.subList(0, 100);
		}
		List<VideoForApp> videoList = new ArrayList<VideoForApp>();
		for (BaseAttachment baseAttachment : attList) {
			VideoForApp pic = new VideoForApp();
			String attUrl = baseAttachment.getAttachUrl();
			pic.setVideoName(attUrl.substring(attUrl.lastIndexOf('/') + 1));
			pic.setVideoURL(request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
					+ "/app/JwTGradeclass/download?filename=" + attUrl);
			videoList.add(pic);
		}
		VideoReturnApp data = new VideoReturnApp();
		data.setTotalCount(videoList.size());
		data.setVideoList(videoList);
		info.setMessage(true);
		info.setMessageInfo("请求成功！");
		info.setData(data);
		return info;
	}
	
	//查询文件
	private List<BaseAttachment> filterFile(String claiId, String[] inType, int maxSize) {
		List<BaseAttachment> returnList = new ArrayList<BaseAttachment>();
		StringBuffer types = new StringBuffer();
		for (String type : inType) {
			types.append("'." + type + "',");
		}
		types = types.deleteCharAt(types.length() - 1);
		String hql = "from EccClasselegant where claiId='" + claiId + "' order by createTime desc";
		List<EccClasselegant> eleganeList = elegantService.queryByHql(hql);
		int size = 0;
		for (EccClasselegant eccClasselegant : eleganeList) {
			hql = "from BaseAttachment where recordId='" + eccClasselegant.getUuid() + "' and attachType in(" + types
					+ ") order by createTime desc";
			List<BaseAttachment> attList = baseTAttachmentService.queryByHql(hql);
			for (BaseAttachment baseAttachment : attList) {
				if (size + baseAttachment.getAttachSize() <= maxSize) {
					returnList.add(baseAttachment);
					size += baseAttachment.getAttachSize();
				}
			}
		}
		return returnList;
	}
}

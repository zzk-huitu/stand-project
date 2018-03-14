package com.zd.school.app.wisdomclass.controller;



import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService;
import com.zd.school.jw.ecc.model.JwCheckrule;
import com.zd.school.jw.model.app.CommonApp;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.service.BaseCampusService;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoomareaService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.wisdomclass.ecc.service.JwCheckruleService;

@Controller
@RequestMapping("/app/JwCheckrule")
public class JwCheckruleAppController {

	@Resource
	private JwCheckruleService thisService; // 考勤规则
	@Resource
	private BaseInfotermService termService; // 终端设备
	@Resource
	private BaseRoominfoService brService; // 房间信息
	
	@Resource
	private BaseRoomareaService areaService; // 区域信息
	@Resource
	private BaseCampusService campusService; // 校区信息
	
	@Resource
	private JwCourseArrangeService courseArrangeService;
	

	@RequestMapping(value = { "/getRole" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody CommonApp<JwCheckrule> jkcourse(String termCode,String classId, HttpServletRequest request,
			HttpServletResponse response) {
		CommonApp<JwCheckrule> app = new CommonApp<JwCheckrule>();
		
		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);
		if (roomTerm == null) {
			app.setMessage(false);
			app.setMessageInfo("没有找到该终端设备！");
			return app;
		}
		
		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo == null) {
			app.setMessage(false);
			app.setMessageInfo("没有找到设备对应房间！");
			return app;
		}
		
		String campusId = campusService.getCampusIdByRoom(roominfo); // 根据房间获取校区ID
		String[] propName = new String[] { "campusId", "activityState", "isDelete" };
		Object[] propValue = new Object[] { campusId, 1, 0 };
		/*JwCalender calender = calendarService.getByProerties(propName, propValue); // 查询出校区启用校历
		if (calender == null) {
			app.setMessage(false);
			app.setMessageInfo("没有找到房间对应校历！");
			return app;
		}*/
		propName = new String[] { "startUsing", "isDelete" };
		propValue = new Object[] { 1, 0 };
		JwCheckrule rule = thisService.getByProerties(propName, propValue); // 查出启用的考勤规则
		app.setObj(rule);
		
		/*int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
		
		if (!roominfo.getRoomTypeName().equals("功能室")) {
			propName = new String[] { "canderId", "needSignIn", "isDelete" };
			propValue = new Object[] { calender.getUuid(), 1, 0 }; // 查出需要考勤的校历详情
			List<JwCalenderdetail> calenderDetails = calendarDetailService.queryByProerties(propName, propValue);
			if (calenderDetails == null) {
				app.setMessage(false);
				app.setMessageInfo("没有找到房间对应校历详情！");
				return app;
			}
			JwClassRoomAllot classRoom = jraService.getByProerties("roomId", roominfo.getUuid());
			StringBuffer hql = new StringBuffer("from JwCourseArrange where claiId='");
			hql.append(classRoom.getClaiId()).append("' and extField05=1 order by teachTime");
			// 执行查询方法得到班级课程表
			List<JwCourseArrange> jtaList = courseArrangeService.doQuery(hql.toString());
			for (JwCourseArrange jwCourseArrange : jtaList) {
				for (JwCalenderdetail jwCalenderdetail : calenderDetails) {
					if (jwCourseArrange.getTeachTime().equals(jwCalenderdetail.getJcCode())) {
						JwCheckruleApp checkRule = new JwCheckruleApp();
						checkRule.setStartTime(DateUtil.formatDate(jwCalenderdetail.getBeginTime(), "HH:mm"));
						checkRule.setEndTime(DateUtil.formatDate(jwCalenderdetail.getEndTime(), "HH:mm"));
						checkRule.setCourseId(EntityUtil.getPropertyValue(jwCourseArrange, "courseId0"+dayNum)+"");
						rule.getCheckRules().add(checkRule);
					}
				}
			}
			app.setMessage(true);
			app.setMessageInfo("请求成功！");
		} else {
			StringBuffer hql = new StringBuffer("from JwFuncroomcourse where roomId='" + roomTerm.getRoomId() + "'");
			hql.append(" and courseId0" + dayNum + " is not null and courseId0" + dayNum + " !='' order by teachTime");
			// 查出这个功能室当天有课程的节次
			List<JwFuncroomcourse> funcroomcourses = funcCourseService.doQuery(hql.toString());
			propName = new String[] { "canderId", "isDelete" };
			propValue = new Object[] { calender.getUuid(), 0 };
			List<JwCalenderdetail> calenderDetails = calendarDetailService.queryByProerties(propName, propValue);
			for (JwFuncroomcourse jwFuncroomcourse : funcroomcourses) {
				for (JwCalenderdetail jwCalenderdetail : calenderDetails) {
					if (jwFuncroomcourse.getTeachTime().equals(jwCalenderdetail.getJcCode())) {
						JwCheckruleApp checkRule = new JwCheckruleApp();
						checkRule.setStartTime(DateUtil.formatDate(jwCalenderdetail.getBeginTime(), "HH:mm"));
						checkRule.setEndTime(DateUtil.formatDate(jwCalenderdetail.getEndTime(), "HH:mm"));
						checkRule.setCourseId(EntityUtil.getPropertyValue(jwFuncroomcourse, "courseId0"+dayNum)+"");
						rule.getCheckRules().add(checkRule);
					}
				}
			}
			
		}*/
		app.setMessage(true);
		app.setMessageInfo("请求成功！");
		return app;
	}

	
}

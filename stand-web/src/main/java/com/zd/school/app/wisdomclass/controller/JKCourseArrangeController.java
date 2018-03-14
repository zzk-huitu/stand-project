package com.zd.school.app.wisdomclass.controller;



import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.DateUtil;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.SortListUtil;
import com.zd.school.build.allot.model.JwClassRoomAllot;
import com.zd.school.build.define.model.BuildFuncRoomDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.arrangecourse.model.JwCourseArrange;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService;
import com.zd.school.jw.ecc.model.JwCheckrule;
import com.zd.school.jw.eduresources.model.JwCalender;
import com.zd.school.jw.eduresources.model.JwCalenderdetail;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.jw.model.app.JKCourse;
import com.zd.school.jw.model.app.JKCourseToDayArray;
import com.zd.school.jw.model.app.JwTcourseArrangeForApp;
import com.zd.school.jw.push.service.PushInfoService;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.service.BaseCalenderService;
import com.zd.school.plartform.baseset.service.BaseCalenderdetailService;
import com.zd.school.plartform.baseset.service.BaseFuncRoomDefineService;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.wisdomclass.ecc.service.JwCheckruleService;

@Controller
@RequestMapping("/app/JKCourseArrange")
public class JKCourseArrangeController extends FrameWorkController<JwCourseArrange> implements Constant {

	@Resource
	JwCourseArrangeService thisService; // service层接口。。。

	@Resource
	JwTGradeclassService classService;

	@Resource
	PushInfoService pushService;

	@Resource
	BaseCalenderService canderService;

	@Resource
	BaseCalenderdetailService canderDetailService;

	@Resource
	BaseRoominfoService brService;

	//@Resource
	//JwClassRoomAllotService jraService;

	//@Resource
	//JwFuncroomcourseService funcroomService;

	@Resource
	BaseFuncRoomDefineService bFuncRoomDefineService;

	@Resource
	private BaseInfotermService termService; // 终端设备serice层接口

	@Resource
	private JwCheckruleService checkruleService;

	/**
	 * 获取考勤课程
	 * @param termCode
	 * @param classIf
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping(value = { "/jkcourse" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody JwTcourseArrangeForApp jkcourse(String termCode,String classId) throws IOException, IllegalAccessException, InvocationTargetException {
		JwTcourseArrangeForApp jk = new JwTcourseArrangeForApp();
		
		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);		
		if (roomTerm==null) {
			jk.setMessage("没有找到该终端设备！");
			jk.setCode(0);
			return jk;
		}
		
		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo==null) {
			jk.setMessage("没有找到该终端下的房间信息！");
			jk.setCode(0);
			return jk;
		}
		
		jk.setCode(1);
		List<JwCourseArrange> newlists = new ArrayList<JwCourseArrange>();

		if (roominfo.getRoomType().equals("5"))	{	//功能室
			/*
			String hql = "from JwFuncroomcourse where roomId='" + roomTerm.getRoomId() + "' order by teachTime";
			List<JwFuncroomcourse> lists = funcroomService.doQuery(hql);
			if (lists != null && lists.size() > 0) {
				for (JwFuncroomcourse funcroomcourse : lists) {
					JwCourseArrange jca = new JwCourseArrange();
					jca.setCourseName01(funcroomcourse.getClassName01());
					jca.setCourseName02(funcroomcourse.getClassName02());
					jca.setCourseName03(funcroomcourse.getClassName03());
					jca.setCourseName04(funcroomcourse.getClassName04());
					jca.setCourseName05(funcroomcourse.getClassName05());
					jca.setCourseName06(funcroomcourse.getClassName06());
					jca.setCourseName07(funcroomcourse.getClassName07());
					jca.setTeachTime(funcroomcourse.getTeachTime());
					jca.setWeekOne(funcroomcourse.getCourseName01());
					jca.setWeekTwo(funcroomcourse.getCourseName02());
					jca.setWeekThree(funcroomcourse.getCourseName03());
					jca.setWeekFour(funcroomcourse.getCourseName04());
					jca.setWeekFive(funcroomcourse.getCourseName05());
					jca.setWeekSix(funcroomcourse.getCourseName06());
					jca.setWeekSeven(funcroomcourse.getCourseName07());
					newlists.add(jca);
				}
				jk.setMessage("查询班级课表成功");
				jk.setJkArrange(newlists);
			} else {
				jk.setMessage("查询班级课表无信息");
				jk.setJkArrange(null);
			}
			*/
		} else {
			
			JwTGradeclass gradeClass = classService.get(classId);// 班级对象
			if (gradeClass == null) {
				jk.setMessage("没有找到对应的班级！");
				return jk;
			}			
						
			StringBuffer hql = new StringBuffer("from JwCourseArrange where claiId='" + classId
					+ "' and extField05=1 and isDelete=0 order by className,teachTime asc");
			List<JwCourseArrange> lists = thisService.queryByHql(hql.toString());// 执行查询方法

			if (lists != null && lists.size() > 0) {
				for (JwCourseArrange jca : lists) {
					jca.setWeekOne(jca.getCourseName01() + "(" + jca.getTeacherName01() + ")");
					jca.setWeekTwo(jca.getCourseName02() + "(" + jca.getTeacherName02() + ")");
					jca.setWeekThree(jca.getCourseName03() + "(" + jca.getTeacherName03() + ")");
					jca.setWeekFour(jca.getCourseName04() + "(" + jca.getTeacherName04() + ")");
					jca.setWeekFive(jca.getCourseName05() + "(" + jca.getTeacherName05() + ")");
					jca.setWeekSix(jca.getCourseName06() + "(" + jca.getTeacherName06() + ")");
					jca.setWeekSeven(jca.getCourseName07() + "(" + jca.getTeacherName07() + ")");
					newlists.add(jca);
				}
				jk.setMessage("查询班级课表成功");
				jk.setJkArrange(newlists);
			} else {
				jk.setMessage("查询班级课表无信息");
				jk.setJkArrange(null);
			}
		}

		
		return jk;
	}

	/**
	 * 根据班级得到当天的课程表
	 * 
	 * @param claiId
	 * @param request
	 * @param response
	 * @throws IOException
	 * @author huangzc
	 */
	@RequestMapping(value = { "/todaycourse" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody JKCourseToDayArray todaycourse(String classId, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		
		
		return getTodaycourse(classId);
	}

	/**
	 * 根据班级得到当天当时的前两节课的课程表
	 * 
	 * @param claiId
	 * @param request
	 * @param response
	 * @throws IOException
	 * @author huangzc
	 * @throws ParseException
	 */
	@RequestMapping(value = { "/getCourseForNow" }, method = {
			org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody JKCourseToDayArray getCourseForNow(String termCode, String classId, String roomType, HttpServletRequest request,
			HttpServletResponse response) throws IOException, ParseException {
		JwCheckrule checkrule = checkruleService.getByProerties("startUsing", 1);
		// 功能室处理课表
		if (roomType != null && roomType.equals("5")) {
			OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);
			JKCourseToDayArray jtd = new JKCourseToDayArray();
			if (ModelUtil.isNotNull(roomTerm)) {
				String[] propName = { "roomId", "isDelete" };
				Object[] propValue = { roomTerm.getRoomId(), 0 };
				BuildFuncRoomDefine funcRoomDefine = bFuncRoomDefineService.getByProerties(propName, propValue);
				SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
				String nowTime[] = sdf.format(new Date()).trim().split(":");
				int hour = Integer.parseInt(nowTime[0]);
				int minute = Integer.parseInt(nowTime[1]);
				int courseNum = 2;
				jtd = getTodaycourseFuncRoom(funcRoomDefine.getUuid());
				if (jtd == null || jtd.getMessage() == false || jtd.getJcList() == null || jtd.getJcList().size() <= 0)
					return jtd;
				List<JKCourse> jkcList = jtd.getJcList();
				List<JKCourse> tempJKC = new ArrayList<JKCourse>();
				jtd.setJcList(null);
				SortListUtil<JKCourse> sortJkc = new SortListUtil<JKCourse>();
				sortJkc.Sort(jkcList, "beginTime", "");
				for (JKCourse jkc : jkcList) {
					String tempTime[] = jkc.getBeginTime().trim().split(":");
					int tempBeginHour = Integer.parseInt(tempTime[0]);
					int tempBeginMinute = Integer.parseInt(tempTime[1]);
					tempTime = jkc.getEndTime().trim().split(":");
					int tempEndHour = Integer.parseInt(tempTime[0]);
					int tempEndMinute = Integer.parseInt(tempTime[1]);
					if (tempBeginMinute - checkrule.getInBefore() < 0) {
						tempBeginHour -= 1;
						tempBeginMinute = tempBeginMinute - checkrule.getInBefore() + 60;
					} else {
						tempBeginMinute = tempBeginMinute - checkrule.getInBefore();
					}
					if (tempEndMinute + checkrule.getOutBefore() >= 60) {
						tempEndHour += 1;
						tempEndMinute = tempEndMinute + checkrule.getOutBefore() - 60;
					} else {
						tempEndMinute = tempEndMinute + checkrule.getOutBefore();
					}

					// if (tempBeginHour < hour) continue;

					// if (tempBeginHour == hour)
					// if (tempBeginMinute <= minute)
					// continue;
					if (DateUtil.isInZone(DateUtil.getLong(tempBeginHour + ":" + tempBeginMinute),
							DateUtil.getLong(tempEndHour + ":" + tempEndMinute), DateUtil.getCurrentTime())) {
						tempJKC.add(jkc);
						courseNum--;
					}
					if (courseNum == 0)
						break;
				}
				jtd.setJcList(tempJKC);
				return jtd;
			} else {
				jtd.setMessage(false);
				jtd.setMessageInfo("没有找到对应设备");
				return jtd;
			}
		} else {
			
			SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
			String nowTime[] = sdf.format(new Date()).trim().split(":");
			int hour = Integer.parseInt(nowTime[0]);
			int minute = Integer.parseInt(nowTime[1]);
			int courseNum = 2;
			JKCourseToDayArray jtd = getTodaycourse(classId);
			if (jtd == null || jtd.getMessage() == false || jtd.getJcList() == null || jtd.getJcList().size() <= 0)
				return jtd;
			List<JKCourse> jkcList = jtd.getJcList();
			List<JKCourse> tempJKC = new ArrayList<JKCourse>();
			jtd.setJcList(null);
			SortListUtil<JKCourse> sortJkc = new SortListUtil<JKCourse>();
			sortJkc.Sort(jkcList, "beginTime", "");
			for (JKCourse jkc : jkcList) {
				String tempTime[] = jkc.getBeginTime().trim().split(":");
				int tempBeginHour = Integer.parseInt(tempTime[0]);
				int tempBeginMinute = Integer.parseInt(tempTime[1]);
				tempTime = jkc.getEndTime().trim().split(":");
				int tempEndHour = Integer.parseInt(tempTime[0]);
				int tempEndMinute = Integer.parseInt(tempTime[1]);
				if (tempBeginMinute - checkrule.getInBefore() < 0) {
					tempBeginHour -= 1;
					tempBeginMinute = tempBeginMinute - checkrule.getInBefore() + 60;
				}
				if (tempEndMinute + checkrule.getOutBefore() >= 60) {
					tempEndHour += 1;
					tempEndMinute = tempEndMinute + checkrule.getOutBefore() - 60;
				}
				if (DateUtil.isInZone(DateUtil.getLong(tempBeginHour + ":" + tempBeginMinute),
						DateUtil.getLong(tempEndHour + ":" + tempEndMinute), DateUtil.getCurrentTime())){
					tempJKC.add(jkc);
					courseNum--;
				}
					// if (tempBeginHour < hour) continue;
					// if (tempBeginHour == hour)
					// if (tempBeginMinute <= minute)
					// continue;
					
				if (courseNum == 0)
					break;
			}
			jtd.setJcList(tempJKC);
			return jtd;
		}

	}

	/**
	 * 根据班级得到当天的课程表
	 * 
	 * @param claiId
	 * @param request
	 * @param response
	 * @throws IOException
	 * @author huangzc
	 */
	public JKCourseToDayArray getTodaycourse(String claiId) throws IOException {
		JKCourseToDayArray jctd = new JKCourseToDayArray();
		if (claiId == null || claiId.trim().equals("")) {
			jctd.setMessage(false);
			jctd.setMessageInfo("请传入参数！");
			return jctd;
		}
		try {
			List<JKCourse> jcList = new ArrayList<JKCourse>();
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			System.out.println("星期=" + dayNum);
			if (dayNum <= 0) {
				jctd.setMessage(false);
				jctd.setMessageInfo("日期参数有误");
				return jctd;
			}
			List<JwCalenderdetail> canderDetilList = canderDetailService.queryJwTCanderdetailByJwTCander(
					canderService.findJwTcanderByClaiId(classService.findJwTGradeByClaiId(claiId)));// 校历详细列表
			System.out.println("校历详细列表=" + canderDetilList.size());
			if (canderDetilList == null || canderDetilList.size() <= 0) {
				jctd.setMessage(false);
				jctd.setMessageInfo("校历详细列表为空");
				return jctd;
			}
			StringBuffer hql = new StringBuffer("from JwCourseArrange where claiId='");
			hql.append(claiId).append("' and extField05=1  order by className,teachTime asc");
			List<JwCourseArrange> jtaList = thisService.queryByHql(hql.toString());// 执行查询方法得到班级课程表
			if (jtaList == null || jtaList.size() <= 0) {
				jctd.setMessage(false);
				jctd.setMessageInfo("查询班级课表无信息");
				return jctd;
			}
			// 数据处理
			List<JwCalenderdetail> canderDetilListed = new ArrayList<JwCalenderdetail>();
			for (JwCalenderdetail jtc : canderDetilList) {
				if (jtc.getJcCode() == null || jtc.getJcCode().trim().equals(""))
					continue;
				canderDetilListed.add(jtc);
			}
			SortListUtil<JwCalenderdetail> slu = new SortListUtil<JwCalenderdetail>();
			slu.Sort(canderDetilListed, "jcCode", null);
			SortListUtil<JwCourseArrange> jta = new SortListUtil<JwCourseArrange>();
			jta.Sort(jtaList, "teachTime", null);
			SimpleDateFormat simpl = new SimpleDateFormat("HH:mm");
			for (JwCalenderdetail tempJtc : canderDetilListed) {
				JKCourse jc = new JKCourse();
				boolean flag = false;
				for (JwCourseArrange tempJta : jtaList) {
					if (tempJtc.getJcCode().equals(tempJta.getTeachTime())) {
						jc.setTeachTime(tempJtc.getJcCode());
						jc.setJcName(tempJtc.getJcName());
						jc.setBeginTime(simpl.format(tempJtc.getBeginTime()));
						jc.setEndTime(simpl.format(tempJtc.getEndTime()));
						jc.setNeedSignIn(tempJtc.getNeedSignIn());
						switch (dayNum) {
						case 1:
							jc.setTeachrName(tempJta.getTeacherName01());
							jc.setCourseName(tempJta.getCourseName01());
							flag = true;
							break;
						case 2:
							jc.setTeachrName(tempJta.getTeacherName02());
							jc.setCourseName(tempJta.getCourseName02());
							flag = true;
							break;
						case 3:
							jc.setTeachrName(tempJta.getTeacherName03());
							jc.setCourseName(tempJta.getCourseName03());
							flag = true;
							break;
						case 4:
							jc.setTeachrName(tempJta.getTeacherName04());
							jc.setCourseName(tempJta.getCourseName04());
							flag = true;
							break;
						case 5:
							jc.setTeachrName(tempJta.getTeacherName05());
							jc.setCourseName(tempJta.getCourseName05());
							flag = true;
							break;
						case 6:
							jc.setTeachrName(tempJta.getTeacherName06());
							jc.setCourseName(tempJta.getCourseName06());
							flag = true;
							break;
						case 7:
							jc.setTeachrName(tempJta.getTeacherName07());
							jc.setCourseName(tempJta.getCourseName07());
							flag = true;
							break;
						default:
							break;
						}
						break;
					}
				}
				if (flag)
					jcList.add(jc);
			}
			if (jcList != null && jcList.size() > 0) {
				jctd.setJcList(jcList);
				jctd.setDayFoWeek(String.valueOf(dayNum));
				jctd.setMessage(true);
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		System.out.println(jctd);
		return jctd;
	}

	public JKCourseToDayArray getTodaycourseFuncRoom(String funcRoomId) throws IOException {
		JKCourseToDayArray jctd = new JKCourseToDayArray();
		if (funcRoomId == null || funcRoomId.trim().equals("")) {
			jctd.setMessage(false);
			jctd.setMessageInfo("请传入参数！");
			return jctd;
		}
		try {
			List<JKCourse> jcList = new ArrayList<JKCourse>();
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			System.out.println("星期=" + dayNum);
			if (dayNum <= 0) {
				jctd.setMessage(false);
				jctd.setMessageInfo("日期参数有误");
				return jctd;
			}
			StringBuffer sql = new StringBuffer("SELECT parent FROM JW_FUNCROOMTREE WHERE id=(");
			sql.append("SELECT parent FROM JW_FUNCROOMTREE WHERE id=(");
			sql.append("SELECT parent FROM dbo.JW_FUNCROOMTREE WHERE id='" + funcRoomId + "'");
			sql.append("))");
			// 拿到初中部或者高中部
			List<Object[]> gradeObj = thisService.queryObjectBySql(sql.toString());

			String[] propName = { "campusId", "activityState", "isDelete" };
			Object[] propValue = { gradeObj.get(0), 1, 0 };
			JwCalender calender = canderService.getByProerties(propName, propValue);

			List<JwCalenderdetail> canderDetilList = canderDetailService.queryJwTCanderdetailByJwTCander(calender);// 校历详细列表
			System.out.println("校历详细列表=" + canderDetilList.size());
			if (canderDetilList == null || canderDetilList.size() <= 0) {
				jctd.setMessage(false);
				jctd.setMessageInfo("校历详细列表为空");
				return jctd;
			}
			sql = new StringBuffer("from JwFuncroomcourse where funcRoomId='");
			sql.append(funcRoomId).append("'  order by teachTime asc");
			/*
			List<JwFuncroomcourse> jtaList = funcroomService.doQuery(hql.toString());// 执行查询方法得到班级课程表
			if (jtaList == null || jtaList.size() <= 0) {
				jctd.setMessage(false);
				jctd.setMessageInfo("查询班级课表无信息");
				return jctd;
			}
			// 数据处理
			List<JwCalenderdetail> canderDetilListed = new ArrayList<JwCalenderdetail>();
			for (JwCalenderdetail jtc : canderDetilList) {
				if (jtc.getJcCode() == null || jtc.getJcCode().trim().equals(""))
					continue;
				canderDetilListed.add(jtc);
			}
			SortListUtil<JwCalenderdetail> slu = new SortListUtil<JwCalenderdetail>();
			slu.Sort(canderDetilListed, "jcCode", null);
			//SortListUtil<JwFuncroomcourse> jta = new SortListUtil<JwFuncroomcourse>();
			//jta.Sort(jtaList, "teachTime", null);
			SimpleDateFormat simpl = new SimpleDateFormat("HH:mm");
			for (JwCalenderdetail tempJtc : canderDetilListed) {
				JKCourse jc = new JKCourse();
				boolean flag = false;
				for (JwFuncroomcourse tempJta : jtaList) {
					if (tempJtc.getJcCode().equals(tempJta.getTeachTime())) {
						jc.setJcName(tempJtc.getJcName());
						jc.setBeginTime(simpl.format(tempJtc.getBeginTime()));
						jc.setEndTime(simpl.format(tempJtc.getEndTime()));
						switch (dayNum) {
						case 1:
							jc.setTeachrName(tempJta.getTeacherName01());
							jc.setCourseName(tempJta.getCourseName01());
							jc.setClassName(tempJta.getClassName01());
							flag = true;
							break;
						case 2:
							jc.setTeachrName(tempJta.getTeacherName02());
							jc.setCourseName(tempJta.getCourseName02());
							jc.setClassName(tempJta.getClassName02());
							flag = true;
							break;
						case 3:
							jc.setTeachrName(tempJta.getTeacherName03());
							jc.setCourseName(tempJta.getCourseName03());
							jc.setClassName(tempJta.getClassName03());
							flag = true;
							break;
						case 4:
							jc.setTeachrName(tempJta.getTeacherName04());
							jc.setCourseName(tempJta.getCourseName04());
							jc.setClassName(tempJta.getClassName04());
							flag = true;
							break;
						case 5:
							jc.setTeachrName(tempJta.getTeacherName05());
							jc.setCourseName(tempJta.getCourseName05());
							jc.setClassName(tempJta.getClassName05());
							flag = true;
							break;
						case 6:
							jc.setTeachrName(tempJta.getTeacherName06());
							jc.setCourseName(tempJta.getCourseName06());
							jc.setClassName(tempJta.getClassName06());
							flag = true;
							break;
						case 7:
							jc.setTeachrName(tempJta.getTeacherName07());
							jc.setCourseName(tempJta.getCourseName07());
							jc.setClassName(tempJta.getClassName07());
							flag = true;
							break;
						default:
							break;
						}
						break;
					}
				}
				if (flag)
					jcList.add(jc);
			}
			if (jcList != null && jcList.size() > 0) {
				jctd.setJcList(jcList);
				jctd.setDayFoWeek(String.valueOf(dayNum));
				jctd.setMessage(true);
			}*/
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		System.out.println(jctd);
		return jctd;
	}
}
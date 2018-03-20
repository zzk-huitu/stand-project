package com.zd.school.app.wisdomclass.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.util.DateUtil;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.arrangecourse.model.JwFuncroomcourse;
import com.zd.school.jw.arrangecourse.service.JwFuncroomcourseService;
import com.zd.school.jw.ecc.model.EccClasselegant;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.jw.model.app.PictureApp;
import com.zd.school.jw.model.app.PictureForApp;
import com.zd.school.jw.model.app.PictureReturnApp;
import com.zd.school.jw.model.app.VideoApp;
import com.zd.school.jw.model.app.VideoForApp;
import com.zd.school.jw.model.app.VideoReturnApp;
import com.zd.school.oa.attendance.model.AttTerm;
import com.zd.school.oa.attendance.model.AttTime;
import com.zd.school.oa.attendance.service.AttTermService;
import com.zd.school.oa.attendance.service.AttTimeService;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.model.BaseAttachment;
import com.zd.school.plartform.baseset.service.BaseAttachmentService;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.wisdomclass.ecc.service.EccClasselegantService;

@Controller
@RequestMapping("/app/ClassFile")
public class ClassFileAppController {	
	
	@Value("${virtualFileUrl}")  	//读取在配置文件属性
	private String virtualFileUrl; 	//文件目录虚拟路径

	    
	@Resource
	private JwTGradeclassService thisService;

	@Resource
	private BaseRoominfoService brService;
	
	@Resource
	private EccClasselegantService elegantService; // service层接口

	@Resource
	private BaseAttachmentService baseTAttachmentService;// service层接口

	@Resource
	private BaseInfotermService termService; // 终端设备serice层接口

	@Resource
	private JwFuncroomcourseService funcCourseService; // 功能室课表

	@Resource
	private AttTimeService attTimeService;
	@Resource
	private AttTermService attTermService;
	
	/**
	 * 获取班级的图片信息
	 * @param termCode	设备终端号
	 * @param classId	班级ID（可为空； 当房间是功能室时，就不用传入此参数）
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = { "/getClassPics" }, method = RequestMethod.GET)
	public PictureApp downloadPic(@RequestParam(value = "termCode") String termCode,
			@RequestParam(value = "classId", required = false) String classId) {
		
		PictureApp info = new PictureApp();

		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);
		if (roomTerm == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}

		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该设备绑定的房间信息！");
			return info;
		}

		// 格式
		String[] inType = { "JPG", "JPEG", "BMP", "PNG" };
		int maxSize = 300 * 1024 * 1024;
		List<BaseAttachment> attList = new ArrayList<BaseAttachment>();

		if (roominfo.getRoomType().equals("5")) { // 当为功能室的时候
			
			String[] propName = new String[] { "termCode", "isDelete" };
			Object[] propValue = new Object[] { termCode, 0 };
			List<AttTerm> attTerms = attTermService.queryByProerties(propName, propValue); // 查询特殊考勤终端
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			
			// 如果当前设备被分配到了特殊课程里
			if (attTerms != null && attTerms.size() != 0) {

				String titleIds = attTerms.stream().map(x -> x.getTitleId())
						.collect(Collectors.joining("','", "'", "'"));

				StringBuffer hql = new StringBuffer("from AttTime where isDelete=0");
				hql.append(" and titleId in(" + titleIds + ")");
				hql.append(" and weekDay=" + dayNum);

				// 每周都需要考勤（查询集合1）
				String hql2 = " and beginDate is null and endDate is null";
				List<AttTime> everyWeek = attTimeService.queryByHql(hql.toString() + hql2);

				// 某一时间段的周几需要考勤（查询集合2）
				String today = DateUtil.formatDate(new Date());
				hql2 = " and beginDate<='" + today + "' and endDate>='" + today + "'";
				List<AttTime> sometimeWeek = attTimeService.queryByHql(hql.toString() + hql2);

				everyWeek.addAll(sometimeWeek); // 融合

				// 查询这些学生中，有哪些班级
				// 获取这些特殊考勤的主题id
				titleIds = everyWeek.stream().map(x -> x.getTitleId()).collect(Collectors.joining("','", "'", "'"));
				String sql = "select distinct a.CLAI_ID from JW_T_CLASSSTUDENT a where a.ISDELETE=0 and "
						+ "	a.STUDENT_ID in (select distinct USER_ID from ATT_T_USER where ISDELETE=0 and TITLE_ID in ("
						+ titleIds + "))";
				List<String> classIds=thisService.queryEntityBySql(sql, null);
				
				/*旧版本的获取方式*/
//				Set<String> claids = new HashSet<String>();
//				for (AttTime attTime : everyWeek) {
//					hql = new StringBuffer("from JwClassstudent where isDelete=0");
//					hql.append(" and studentId in(select userId from AttUser where titleId='" + attTime.getTitleId()
//							+ "' and isDelete=0)");
//					List<JwClassstudent> list = classStudentService.queryByHql(hql.toString());
//					for (JwClassstudent jwClassstudent : list) {
//						claids.add(jwClassstudent.getClaiId());
//					}
//				}
				
				for (String claid : classIds) {
					attList.addAll(filterFile(claid, inType, maxSize));
				}

			}else {	//否则查询功能室课程
							
				propName = new String[] { "roomId","isDelete"};
				propValue = new Object[] { roomTerm.getRoomId(),0 };
				
				Map<String, String> map = new HashMap<String, String>();
				map.clear();
				map.put("teachTime", "asc");
				List<JwFuncroomcourse> funcroomcoursesList = funcCourseService.queryByProerties(propName, propValue,
						map);
				Set<String> classIds = new HashSet<String>();
				for (JwFuncroomcourse jwFuncroomcourse : funcroomcoursesList) {
					String claid = EntityUtil.getPropertyValue(jwFuncroomcourse, "claiId0" + dayNum) + "";	//查询星期N的班级课程
					if (StringUtils.isNotEmpty(claid)) {
						classIds.add(claid);
					}
				}
				for (String claid : classIds) {
					attList.addAll(filterFile(claid, inType, maxSize));
				}
			}

		} else { // 当为教室的时候

			JwTGradeclass classInfo = thisService.get(classId);
			if (classInfo == null) {
				info.setMessage(false);
				info.setMessageInfo("未找到该班级信息！");
				return info;
			}
			attList = filterFile(classInfo.getUuid(), inType, maxSize);

		}
		
		//组装返回值
		if (attList.size() > 100) {
			attList = attList.subList(0, 100);
		}
		List<PictureForApp> picList = new ArrayList<PictureForApp>();
		PictureForApp pic=null;
		for (BaseAttachment baseAttachment : attList) {
			pic = new PictureForApp();
					
			/*文件地址，方式一：使用接口的方式下载文件*/
//			String attUrl = baseAttachment.getAttachUrl();
//			pic.setPictureURL(request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
//				+ "/app/JwTGradeclass/download?filename=" + attUrl);
//			pic.setPictureName(attUrl.substring(attUrl.lastIndexOf('/') + 1));
			
			/*文件地址，方式二：直接使用url的方式获取文件*/
			pic.setPictureURL(virtualFileUrl+"/"+baseAttachment.getAttachUrl());
			pic.setPictureName(baseAttachment.getAttachName());
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
	 * 获取班级的视频信息
	 * @param termCode	设备终端号
	 * @param classId	班级ID（可为空； 当房间是功能室时，就不用传入此参数）
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = { "/getClassVideos" }, method = RequestMethod.GET)
	public VideoApp getClassVideos(@RequestParam(value = "termCode") String termCode,
			@RequestParam(value = "classId", required = false) String classId) {
		
		VideoApp info = new VideoApp();

		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);
		if (roomTerm == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}

		BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		if (roominfo == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该设备绑定的房间信息！");
			return info;
		}

		String[] inType = { "avi", "mp4", "3gp" };
		int maxSize = 800 * 1024 * 1024;
		List<BaseAttachment> attList = new ArrayList<BaseAttachment>();

		if (roominfo.getRoomType().equals("5")) { // 当为功能室的时候
			
			String[] propName = new String[] { "termCode", "isDelete" };
			Object[] propValue = new Object[] { termCode, 0 };
			List<AttTerm> attTerms = attTermService.queryByProerties(propName, propValue); // 查询特殊考勤终端
			int dayNum = DateUtil.mathWeekDay(new Date());// 星期参数
			
			// 如果当前设备被分配到了特殊课程里
			if (attTerms != null && attTerms.size() != 0) {

				String titleIds = attTerms.stream().map(x -> x.getTitleId())
						.collect(Collectors.joining("','", "'", "'"));

				StringBuffer hql = new StringBuffer("from AttTime where isDelete=0");
				hql.append(" and titleId in(" + titleIds + ")");
				hql.append(" and weekDay=" + dayNum);

				// 每周都需要考勤（查询集合1）
				String hql2 = " and beginDate is null and endDate is null";
				List<AttTime> everyWeek = attTimeService.queryByHql(hql.toString() + hql2);

				// 某一时间段的周几需要考勤（查询集合2）
				String today = DateUtil.formatDate(new Date());
				hql2 = " and beginDate<='" + today + "' and endDate>='" + today + "'";
				List<AttTime> sometimeWeek = attTimeService.queryByHql(hql.toString() + hql2);

				everyWeek.addAll(sometimeWeek); // 融合

				// 查询这些学生中，有哪些班级
				// 获取这些特殊考勤的主题id
				titleIds = everyWeek.stream().map(x -> x.getTitleId()).collect(Collectors.joining("','", "'", "'"));
				String sql = "select distinct a.CLAI_ID from JW_T_CLASSSTUDENT a where a.ISDELETE=0 and"
						+ "	a.STUDENT_ID in (select distinct USER_ID from ATT_T_USER where ISDELETE=0 and TITLE_ID in ("
						+ titleIds + "))";
				List<String> classIds=thisService.queryEntityBySql(sql, null);
				
				/*旧版本的获取方式*/
//				Set<String> claids = new HashSet<String>();
//				for (AttTime attTime : everyWeek) {
//					hql = new StringBuffer("from JwClassstudent where isDelete=0");
//					hql.append(" and studentId in(select userId from AttUser where titleId='" + attTime.getTitleId()
//							+ "' and isDelete=0)");
//					List<JwClassstudent> list = classStudentService.queryByHql(hql.toString());
//					for (JwClassstudent jwClassstudent : list) {
//						claids.add(jwClassstudent.getClaiId());
//					}
//				}
				
				for (String claid : classIds) {
					attList.addAll(filterFile(claid, inType, maxSize));
				}

			}else {	//否则查询功能室课程
							
				propName = new String[] { "roomId","isDelete" };
				propValue = new Object[] { roomTerm.getRoomId(),0 };
				
				Map<String, String> map = new HashMap<String, String>();
				map.clear();
				map.put("teachTime", "asc");
				List<JwFuncroomcourse> funcroomcoursesList = funcCourseService.queryByProerties(propName, propValue,
						map);
				Set<String> classIds = new HashSet<String>();
				for (JwFuncroomcourse jwFuncroomcourse : funcroomcoursesList) {
					String claid = EntityUtil.getPropertyValue(jwFuncroomcourse, "claiId0" + dayNum) + "";	//查询星期N的班级课程
					if (StringUtils.isNotEmpty(claid)) {
						classIds.add(claid);
					}
				}
				for (String claid : classIds) {
					attList.addAll(filterFile(claid, inType, maxSize));
				}
			}

		} else { // 当为教室的时候

			JwTGradeclass classInfo = thisService.get(classId);
			if (classInfo == null) {
				info.setMessage(false);
				info.setMessageInfo("未找到该班级信息！");
				return info;
			}
			attList = filterFile(classInfo.getUuid(), inType, maxSize);

		}
		
		//组装返回值
		if (attList.size() > 100) {
			attList = attList.subList(0, 100);
		}
		List<VideoForApp> videoList = new ArrayList<VideoForApp>();
		VideoForApp vd=null;
		for (BaseAttachment baseAttachment : attList) {
			vd = new VideoForApp();
					
			/*文件地址，方式一：使用接口的方式下载文件*/
//			String attUrl = baseAttachment.getAttachUrl();
//			vd.setVideoURL(request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
//				+ "/app/JwTGradeclass/download?filename=" + attUrl);
//			vd.setVideoName(attUrl.substring(attUrl.lastIndexOf('/') + 1));
			
			/*文件地址，方式二：直接使用url的方式获取文件*/
			vd.setVideoURL(virtualFileUrl+"/"+baseAttachment.getAttachUrl());
			vd.setVideoName(baseAttachment.getAttachName());
			videoList.add(vd);
		}
		
	
		VideoReturnApp data = new VideoReturnApp();
		data.setTotalCount(videoList.size());
		data.setVideoList(videoList);
		info.setMessage(true);
		info.setMessageInfo("请求成功！");
		info.setData(data);
		return info;
	}

	// 查询文件信息
	private List<BaseAttachment> filterFile(String claiId, String[] inType, int maxSize) {
		List<BaseAttachment> returnList = new ArrayList<BaseAttachment>();
		StringBuffer types = new StringBuffer();
		for (String type : inType) {
			types.append("'." + type + "',");
		}
		types = types.deleteCharAt(types.length() - 1);
		String hql = "from EccClasselegant where isDelete=0 and claiId='" + claiId + "' order by createTime desc";
		List<EccClasselegant> eleganeList = elegantService.queryByHql(hql);
		int size = 0;
		
		if(!eleganeList.isEmpty()){
			String recordIds=eleganeList.stream().map(x->x.getUuid()).collect(Collectors.joining("','","'","'"));
			
			hql = "from BaseAttachment where isDelete=0 and recordId in (" + recordIds + ") and attachType in(" + types
					+ ") order by createTime desc";
			List<BaseAttachment> attList = baseTAttachmentService.queryByHql(hql);
			for (BaseAttachment baseAttachment : attList) {
				if (size + baseAttachment.getAttachSize() <= maxSize) {
					returnList.add(baseAttachment);
					size += baseAttachment.getAttachSize();
				}
			}
		}
		
		/*N次循环的方式*/
//		for (EccClasselegant eccClasselegant : eleganeList) {
//			hql = "from BaseAttachment where recordId='" + eccClasselegant.getUuid() + "' and attachType in(" + types
//					+ ") order by createTime desc";
//			List<BaseAttachment> attList = baseTAttachmentService.queryByHql(hql);
//			for (BaseAttachment baseAttachment : attList) {
//				if (size + baseAttachment.getAttachSize() <= maxSize) {
//					returnList.add(baseAttachment);
//					size += baseAttachment.getAttachSize();
//				}
//			}
//		}
		
		return returnList;
	}
	
}
package com.zd.school.plartform.basedevice.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.dao.BaseDao;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.allot.model.JwClassRoomAllot;
import com.zd.school.control.device.model.MjUserright;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.jw.eduresources.model.JwClassteacher;
import com.zd.school.jw.eduresources.service.JwClassteacherService;
import com.zd.school.plartform.basedevice.dao.MjUserrightDao;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.basedevice.service.MjUserrightService;

/**
 * 
 * ClassName: MjUserrightServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 门禁权限表(MJ_UserRight)实体Service接口实现类. date:
 * 2016-09-08
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class MjUserrightServiceImpl extends BaseServiceImpl<MjUserright> implements MjUserrightService {

//	@Resource
//	JwClassRoomAllotService classRoomService;

	@Resource
	BasePtTermService ptTermService;

	@Resource
	JwClassteacherService classteacherService;

	@Resource
	JwCourseteacherService courseteacherService;

	@Resource
	public void setMjUserrightDao(MjUserrightDao dao) {
		this.dao = dao;
	}
	@Override
	public BaseDao<MjUserright> getDao() {
		return this.dao ;
	}
//	/**
//	 * 根据班级ID添加班主任和任课教师门禁权限
//	 * @param claiId
//	 */
//	@Override
//	public void addMjByClaiId(String claiId) {
//
//		//储存班主任,任课教师的ID
//		List<String> userIds = new ArrayList<String>();
//
//		//查询出所有班主任
//		String hql = "from JwClassteacher where claiId='" + claiId + "' and isDelete=0";
//		List<JwClassteacher> classteachers = classteacherService.doQuery(hql);
//		for (JwClassteacher jwClassteacher : classteachers) {
//			String userId = jwClassteacher.getTteacId();
//			userIds.add(userId);
//		}
//		//查询出所有任课教师
//		hql = "from JwCourseteacher where claiId='" + claiId + "' and isDelete=0";
//		List<JwCourseteacher> courseteachers = courseteacherService.doQuery(hql);
//		for (JwCourseteacher jwCourseteacher : courseteachers) {
//			String userId = jwCourseteacher.getTteacId();
//			userIds.add(userId);
//		}
//
//		// 根据班级ID查询出班级分配了哪些教室
//		hql = "from JwClassRoomAllot where claiId='" + claiId + "' and isDelete=0";
//		List<JwClassRoomAllot> classRooms = classRoomService.doQuery(hql);
//
//		for (JwClassRoomAllot classRoom : classRooms) {
//			
//			// 根据房间ID查出房间下的所有设备
//			hql = "from PtTerm where roomId='" + classRoom.getRoomId() + "' and isDelete=0";
//			List<PtTerm> ptTerms = ptTermService.doQuery(hql);
//
//			for (String userId : userIds) {
//				// 根据用户ID查出用户所拥有的门禁权限
//				hql = "from MjUserright where stuId='" + userId + "' and isDelete=0";
//				List<MjUserright> userMjList = this.doQuery(hql);
//				for (PtTerm ptTerm : ptTerms) {
//					boolean found = false;
//					for (MjUserright mjUserright : userMjList) {
//						if (mjUserright.getTermId().equals(ptTerm.getUuid())) {
//							// 看用户所拥有的门禁列表里是否有当前门禁
//							found = true;
//						}
//					}
//					if (!found) {
//						// 如果没拥有就写入门禁权限
//						MjUserright mj = new MjUserright();
//						mj.setStatusID(0);
//						mj.setStuId(userId);
//						mj.setTermId(ptTerm.getUuid());
//						this.merge(mj);
//					}
//				}
//			}
//		}
//	}
//
//	/**
//	 * 根据班级ID删除班主任和任课教师门禁权限
//	 * @param claiId
//	 */
//	@Override
//	public void delMjByClaiId(String claiId) {
//
//		//储存班主任,任课教师的ID
//		List<String> userIds = new ArrayList<String>();
//
//		//查询出所有班主任
//		String hql = "from JwClassteacher where claiId='" + claiId + "' and isDelete=1";
//		List<JwClassteacher> classteachers = classteacherService.doQuery(hql);
//		for (JwClassteacher jwClassteacher : classteachers) {
//			String userId = jwClassteacher.getTteacId();
//			userIds.add(userId);
//		}
//		//查询出所有任课教师
//		hql = "from JwCourseteacher where claiId='" + claiId + "' and isDelete=1";
//		List<JwCourseteacher> courseteachers = courseteacherService.doQuery(hql);
//		for (JwCourseteacher jwCourseteacher : courseteachers) {
//			String userId = jwCourseteacher.getTteacId();
//			userIds.add(userId);
//		}
//
//		// 根据班级ID查询出班级分配了哪些教室
//		hql = "from JwClassRoomAllot where claiId='" + claiId + "' and isDelete=0";
//		List<JwClassRoomAllot> classRooms = classRoomService.doQuery(hql);
//
//		for (JwClassRoomAllot classRoom : classRooms) {
//			
//			// 根据房间ID查出房间下的所有设备
//			hql = "from PtTerm where roomId='" + classRoom.getRoomId() + "' and isDelete=0";
//			List<PtTerm> ptTerms = ptTermService.doQuery(hql);
//
//			for (String userId : userIds) {
//				// 根据用户ID查出用户所拥有的门禁权限
//				hql = "from MjUserright where stuId='" + userId + "' and isDelete=0";
//				List<MjUserright> userMjList = this.doQuery(hql);
//				for (PtTerm ptTerm : ptTerms) {
//					
//					for (MjUserright mjUserright : userMjList) {
//						if (mjUserright.getTermId().equals(ptTerm.getUuid())) {
//							// 看用户所拥有的门禁列表里是否有当前门禁
//							this.delete(mjUserright);
//						}
//					}
//					
//				}
//			}
//		}
//	}
	@Override
	public QueryResult<MjUserright> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete) {
		// TODO Auto-generated method stub
		return null;
	}
	
//	@Override
//	public QueryResult<MjUserright> list(Integer start, Integer limit, String sort, String filter, Boolean isDelete) {
//        QueryResult<MjUserright> qResult = this.doPaginationQuery(start, limit, sort, filter, isDelete);
//		return qResult;
//	}
}
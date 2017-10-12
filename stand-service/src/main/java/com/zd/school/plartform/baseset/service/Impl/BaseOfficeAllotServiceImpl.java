package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwOfficeAllot;
import com.zd.school.plartform.baseset.dao.BaseOfficeAllotDao;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.student.studentclass.model.JwClassstudent;

/**
 * 
 * ClassName: JwOfficeallotServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: JW_T_OFFICEALLOT实体Service接口实现类. date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseOfficeAllotServiceImpl extends BaseServiceImpl<JwOfficeAllot> implements BaseOfficeAllotService {

//	@Resource
//	MjUserrightService mjService; // 门禁权限
//	@Resource
//	PtTermService ptTermService; // 设备表接口
//
//	@Resource
//	JwClassRoomAllotService classservice;
//
//	@Resource
//	BuildDormDefineService dormDefine;
//
//	@Resource
//	JwClassDormAllotService classDormService;


	@Resource
	public void setJwOfficeallotDao(BaseOfficeAllotDao dao) {
		this.dao = dao;
	}

	/**
	 * 分配门禁
	 * 2017-10-9：待完成
	 */
	@Override
	public boolean mjUserRight(String uuid, String roomId, String userId, DormStudentDorm dorm, JwClassstudent classStu) {
//		try {
//			if (dorm != null) {
//				String dormId = classDormService.get(dorm.getCdormId()).getDormId();
//				roomId = dormDefine.get(dormId).getRoomId();
//			} else if (classStu != null) {
//				String[] propName = { "claiId", "isDelete" };
//				Object[] propValue = { classStu.getClaiId(), 0 };
//				roomId = classservice.getByProerties(propName, propValue).getRoomId();
//			}
//			String[] propName = { "termTypeID", "isDelete", "roomId" };
//			Object[] propValue = { 4, 0, roomId };
//			MjUserright userRight = null;
//			List<PtTerm> list = ptTermService.queryByProerties(propName, propValue);
//			if (uuid == null || uuid.equals("")) {
//				if (list.size() > 0) {
//					String[] uId = userId.split(",");
//					for (int i = 0; i < list.size(); i++) {
//						for (int j = 0; j < uId.length; j++) {
//							String[] name = { "termId", "stuId" };
//							String[] value = { list.get(i).getUuid(), uId[j] };
//							userRight = mjService.getByProerties(name, value);
//							if (userRight != null) {
//								userRight.setIsDelete(1);
//								userRight.setControlsegId(0);
//								userRight.setCardstatusId(0);
//								userRight.setUpdateTime(new Date());
//								mjService.merge(userRight);
//							}
//						}
//					}
//				}
//			} else {
//				if (list.size() > 0) {
//					for (int i = 0; i < list.size(); i++) {
//						String[] name = { "termId", "stuId" };
//						String[] value = { list.get(i).getUuid(), uuid };
//						userRight = mjService.getByProerties(name, value);
//						if (userRight != null) {
//							userRight.setIsDelete(0);
//							userRight.setUpdateTime(new Date());
//							mjService.merge(userRight);
//						} else {
//							userRight = new MjUserright();
//							userRight.setTermId(list.get(i).getUuid());
//							userRight.setCreateUser("超级管理员");
//							userRight.setStuId(uuid);
//							mjService.merge(userRight);
//						}
//					}
//				}
//			}
//			return true;
//		} catch (Exception e) {
//			e.printStackTrace();
//			return false;
//		}
		return false;
		
	}

	@Override
	public Boolean doAdd(JwOfficeAllot entity, SysUser currentUser) throws IllegalAccessException, InvocationTargetException  {
		Boolean flag=false;
		Integer orderIndex = 0;
		JwOfficeAllot perEntity = null;
		JwOfficeAllot valioff = null;
		String[] strId = null;// 多个老师id
		strId = entity.getTteacId().split(",");// 多个老师id
		for (int i = 0; i < strId.length; i++) {
				Object[] objValue = { entity.getRoomId(), strId[i], 0 };
				String[] objName = { "roomId", "tteacId", "isDelete" };
				valioff = this.getByProerties(objName, objValue);
				if (valioff != null) {
					flag=false;
				}
				// 生成默认的orderindex
				orderIndex = this.getDefaultOrderIndex(entity);
				perEntity = new JwOfficeAllot();
				BeanUtils.copyPropertiesExceptNull(entity, perEntity);
				entity.setCreateUser(currentUser.getXm()); // 创建人
				entity.setTteacId(strId[i]);
				entity.setOrderIndex(orderIndex);// 排序
				this.merge(entity); // 执行添加方法
				this.mjUserRight(strId[i], entity.getRoomId(), entity.getUuid(), null, null);
			}
		flag=true;
		
		return flag;
	}

}
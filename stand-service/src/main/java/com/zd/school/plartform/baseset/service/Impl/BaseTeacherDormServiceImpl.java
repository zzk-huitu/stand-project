package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.control.device.model.MjUserright;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.jw.push.service.PushInfoService;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.baseset.dao.BaseTeacherDormDao;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseTeacherDormService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: DormStudentdormServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (DormTeacherDorm)实体Service接口实现类.
 * date: 2016-08-26
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseTeacherDormServiceImpl extends BaseServiceImpl<DormTeacherDorm> implements BaseTeacherDormService{

    @Resource
    public void setDormTeacherDormDao(BaseTeacherDormDao dao) {
        this.dao = dao;
    }
    @Resource
	BaseDormDefineService dormRoomService; // 宿舍service层接口
    @Resource
	BasePtTermService ptTermService;
    @Resource
	PushInfoService pushService;
/*	 @Resource
	 MjUserrightService mjService;*/
    @Override
	public QueryResult<DormTeacherDorm> list(Integer start, Integer limit, String sort, String filter, String whereSql,
			String orderSql, SysUser currentUser) {
		String sortSql = StringUtils.convertSortToSql(sort);
		String filterSql = StringUtils.convertFilterToSql(filter);

		StringBuffer hql = new StringBuffer("from DormTeacherDorm o where 1=1 and isDelete=0 ");
		hql.append(whereSql);
		hql.append(filterSql);
		if (orderSql.length() > 0) {
			if (sortSql.length() > 0)
				hql.append(orderSql + " , " + sortSql);
			else
				hql.append(orderSql);
		} else {
			if (sortSql.length() > 0)
				hql.append(" order by  " + sortSql);
		}

		QueryResult<DormTeacherDorm> qResult = this.queryResult(hql.toString(), start, limit);
		return qResult;
	}

	@Override
	public Boolean doOut(String outIds, SysUser currentUser) {
		boolean flag = false;
		DormTeacherDorm entity=null;
		String[] outId = outIds.split(",");
		for (String id : outId) {
			entity = this.get(id);
			entity.setOutTime(new Date());
			entity.setInout(1);
			entity.setCreateUser(currentUser.getXm());
			entity.setUpdateTime(new Date());
			this.merge(entity);
			flag = true;
		}
		return flag;
	}

	@Override
	public Boolean doAddDormTea(DormTeacherDorm entity, Map hashMap, HttpServletRequest request, SysUser currentUser) throws IllegalAccessException, InvocationTargetException {
		Boolean flag=false;
		String roomName = request.getParameter("roomName");
        String bedCounts = request.getParameter("bedCount");
		String arkCounts = request.getParameter("arkCount");
		String userNumbs = request.getParameter("userNumb");
		String sendCheckNames = request.getParameter("sendCheckName");
		String tteacIds = entity.getTteacId();

		String[] tteacIdArr = tteacIds.split(",");
		String[] bedCount = bedCounts.split(",");
		String[] arkCount = arkCounts.split(",");
		String[] userNumb = userNumbs.split(",");
		String[] sendCheckName = sendCheckNames.split(",");

		List<String> excludedProp = new ArrayList<String>();
		excludedProp.add("uuid");
		
		StringBuffer teaName = new StringBuffer();
		StringBuffer teaInRoom = new StringBuffer();
		DormTeacherDorm perEntity=null;
		for (int i = 0; i < tteacIdArr.length; i++) {
			String hql = " from DormTeacherDorm where isDelete = 0 and tteacId = '" + tteacIdArr[i] + "' ";
			List<DormTeacherDorm> lists = this.queryByHql(hql);
			if (lists.size() > 0) {
				for (DormTeacherDorm dormEntity : lists) {
					teaName.append(dormEntity.getXm() + ',');
					teaInRoom.append(dormEntity.getDormName() + ',');
				}
				flag=false;
				hashMap.put("flag",flag );
				continue;
			}
			perEntity = new DormTeacherDorm();
			BeanUtils.copyProperties(perEntity, entity, excludedProp);
		    Integer orderIndex = this.getDefaultOrderIndex(entity);
			perEntity.setOrderIndex(orderIndex);// 排序
			// 增加时要设置创建人
			perEntity.setCreateUser(currentUser.getXm()); // 创建人
			perEntity.setTteacId(tteacIdArr[i]);
			perEntity.setArkNum(Integer.parseInt(arkCount[i]));
			perEntity.setBedNum(Integer.parseInt(bedCount[i]));
			// 持久化到数据库
			entity = this.merge(perEntity);

			// 写入门禁权限
			List<PtTerm> ptTrems = ptTermService.queryByProerties("roomId", entity.getRoomId());
			for (PtTerm ptTerm : ptTrems) {
				MjUserright mj = new MjUserright();
				mj.setStatusID(0);
				mj.setStuId(userNumb[i]);
				mj.setTermId(ptTerm.getUuid());
				// mjService.merge(mj);
			}

			// 推送消息
			String regStatus = "您好," + sendCheckName[i] + "老师,您已经成功分配至" + roomName + "房间,床位编号:" + bedCount[i] + ",柜子编号:"
					+ arkCount[i];
			// pushService.pushInfo(sendCheckName[i], userNumb[i], "事件提醒",regStatus,currentUser);
			
			//将教室宿舍设置为已分配
			String dormHql=" from BuildDormDefine a where a.roomId='"+entity.getRoomId()+"'";
		    BuildDormDefine dorm= this.getEntityByHql(dormHql);
			if(dorm!=null){
				dorm.setRoomStatus("1");
				dormRoomService.merge(dorm);
			}
			flag=true;
		}
		hashMap.put("teaName",teaName );
		hashMap.put("teaInRoom",teaInRoom );
		return flag;
	}
}
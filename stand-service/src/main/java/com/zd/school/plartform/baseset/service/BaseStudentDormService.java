package com.zd.school.plartform.baseset.service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

import com.zd.core.service.BaseService;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.model.CommTreeChk;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: DormStudentdormService Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: (DORM_T_STUDENTDORM)实体Service接口类. date:
 * 2016-08-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

public interface BaseStudentDormService extends BaseService<DormStudentDorm> {

	//public CommTree getCommTree(String rootId, String deptType, SysUser currentUser);
	public List<DormStudentDorm> oneKeyList(DormStudentDorm entity,String whereSql);
	public Boolean doOneKeyAllotDorm(String gradId,String boyId,String girlId,SysUser currentUser);
	public Integer doDormAutoAllot(String claiId,SysUser currentUser);
	public Boolean doDormHandAllot(DormStudentDorm entity,Map hashMap,SysUser currentUser)throws IllegalAccessException, InvocationTargetException ;
	public List<JwClassDormAllot>  mixDormList(JwClassDormAllot entity);
	public List<JwClassDormAllot>  emptyMixDormList(JwClassDormAllot entity);
	public Boolean doPushMessage(String classId);
	public Boolean doDeleteDorm(String[] delIds, String userId);
	public Integer doUpdateBedArkNum(String[] list, String userId);
	public Boolean doAddClassDorm(String classId, String dormIds, SysUser currentUser);
	public CommTreeChk getUserRightDeptClassTree(String rootId, SysUser currentUser);
}
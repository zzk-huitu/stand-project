package com.zd.school.plartform.baseset.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.plartform.comm.model.CommTree;
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

	public CommTree getCommTree(String rootId, String deptType, SysUser currentUser);
}
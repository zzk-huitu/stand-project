package com.zd.school.plartform.baseset.service;

import com.zd.core.service.BaseService;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwOfficeAllot ;
import com.zd.school.student.studentclass.model.JwClassstudent;


/**
 * 
 * ClassName: JwOfficeallotService
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: JW_T_OFFICEALLOT实体Service接口类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
public interface BaseOfficeAllotService extends BaseService<JwOfficeAllot> {
	/**
	 * 分配门禁
	 */
	public boolean mjUserRight(String uuid, String roomId, String userId, DormStudentDorm dorm,JwClassstudent classStu);
}
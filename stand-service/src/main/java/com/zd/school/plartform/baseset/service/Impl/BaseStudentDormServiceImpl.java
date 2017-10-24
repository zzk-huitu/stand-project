package com.zd.school.plartform.baseset.service.Impl;

import java.text.MessageFormat;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.AdminType;
import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.plartform.baseset.dao.BaseStudentDormDao;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: DormStudentdormServiceImpl Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: (DORM_T_STUDENTDORM)实体Service接口实现类. date:
 * 2016-08-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseStudentDormServiceImpl extends BaseServiceImpl<DormStudentDorm> implements BaseStudentDormService {

	@Resource
	public void setDormStudentdormDao(BaseStudentDormDao dao) {
		this.dao = dao;
	}

	@Resource
	private CommTreeService commTreeService;

	@Override
	public CommTree getCommTree(String rootId, String deptType, SysUser currentUser) {
		String userId = currentUser.getUuid();
		Integer rightType = currentUser.getRightType();
		if(currentUser.getUuid().equals(AdminType.ADMIN_USER_ID))
			rightType=0;
		
		String sql = MessageFormat.format("EXECUTE SYS_P_GETUSERRIGHTGRADCLASSTREE ''{0}'',{1},''{2}''", userId,
				rightType, deptType);
		CommTree gradeTree = commTreeService.getGradeCommTree(sql, rootId);	//2017-10-9：待完成

		return gradeTree;
		//return null;
	}
}
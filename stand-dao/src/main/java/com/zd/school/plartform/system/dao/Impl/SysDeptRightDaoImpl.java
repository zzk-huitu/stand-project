package com.zd.school.plartform.system.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.plartform.system.dao.SysDeptRightDao;
import com.zd.school.plartform.system.model.SysDeptRight;

/**
 * 
 * ClassName: SysDeptrightDaoImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 用户权限部门(SYS_T_DEPTRIGHT)实体Dao接口实现类. date: 2017-04-06
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class SysDeptRightDaoImpl extends BaseDaoImpl<SysDeptRight> implements SysDeptRightDao {
	public SysDeptRightDaoImpl() {
		super(SysDeptRight.class);
		// TODO Auto-generated constructor stub
	}
}
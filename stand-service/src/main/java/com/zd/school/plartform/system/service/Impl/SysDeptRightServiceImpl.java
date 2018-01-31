package com.zd.school.plartform.system.service.Impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.plartform.system.dao.SysDeptRightDao;
import com.zd.school.plartform.system.model.SysDeptRight;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysDeptRightService;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 
 * ClassName: SysDeptrightServiceImpl Function: ADD FUNCTION. Reason: ADD
 * REASON(可选). Description: 用户权限部门(SYS_T_DEPTRIGHT)实体Service接口实现类. date:
 * 2017-04-06
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class SysDeptRightServiceImpl extends BaseServiceImpl<SysDeptRight> implements SysDeptRightService {
	
	//自动注入dao到service层中，并设置到dao变量中
	@Resource
	public void setSysDeptrightDao(SysDeptRightDao dao) {
		this.dao = dao;	
	}
	
	@Resource
	private SysUserService userService;
	
	@Override
	public Boolean doUserRightDept(String userId, String deptId, SysUser currentUser) {
		Date date=new Date();
		String[] userIds = userId.split(",");
		String[] deptIds = deptId.split(",");
		String[] propertyName = { "updateUser", "updateTime", "rightType" };
		Object[] propertyValue = { currentUser.getUuid(), date, 1 };
		
		String hql="select deptId from SysDeptRight where isDelete=0 and userId=?";
		SysDeptRight deptright = null;
		for (String ui : userIds) {
			//一次性查询出这个用户的所有部门权限，判断是否要入库		
			List<Object> deptIdList = this.queryEntityByHql(hql, ui);		
			for (String di : deptIds) {
				if(!deptIdList.contains(di)){			
					deptright = new SysDeptRight();
					deptright.setUserId(ui);
					deptright.setDeptId(di);
					deptright.setRightSource(1);
					deptright.setCreateTime(date);
					deptright.setCreateUser(currentUser.getUuid());
					this.merge(deptright);
				}
			}
		}

		// 更新指定的用户信息
		userService.updateByProperties("uuid", userIds, propertyName, propertyValue);
		return true;
	}

	@Override
	public boolean doDelete(String delIds) {
		// TODO Auto-generated method stub
		String doIds = "'" + delIds.replace(",", "','") + "'";
		String hql="Delete from SysDeptRight where uuid in ("+doIds+")";
		
	    return this.doExecuteCountByHql(hql)>0;
	}
	

}
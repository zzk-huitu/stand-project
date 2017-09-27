package com.zd.school.plartform.system.service.Impl;

import java.text.MessageFormat;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.StatuVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.school.plartform.system.dao.SysRoleDao;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;

/**
 * 
 * ClassName: BaseTRoleServiceImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 角色管理实体Service接口实现类. date: 2016-07-17
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class SysRoleServiceImpl extends BaseServiceImpl<SysRole> implements SysRoleService {

	@Resource
	public void setBaseTRoleDao(SysRoleDao dao) {
		this.dao = dao;
	}

	@Resource
	private SysUserService userSerive;

	@Override
	public boolean doDelete(String delIds, String isdelete, String xm) {
		// TODO Auto-generated method stub

		// 先调用删除用户菜单数据的方法
		String[] roleIds = delIds.split(",");
		userSerive.deleteUserMenuTreeRedis(roleIds);

		// 再设置逻辑删除
		boolean flag = this.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE, xm);

		return flag;
	}

	// @Autowired
	// SysRoleDao sysRoleDao;
	//
	// public List<SysRole> doQueryForIn(String hql, Integer start, Integer
	// limit,Object[] objs){
	//
	// return sysRoleDao.doQueryForIn(hql, start, limit, objs);
	// }

	@Override
	public Boolean doDeleteRoleUser(String ids, String userId) {

		String temp = userId.replace(",", "','");
		String sql = " delete from SYS_T_ROLEUSER where role_id=''{0}'' and user_id in (''{1}'')";
		sql = MessageFormat.format(sql, ids, temp);
		Integer executeCount = this.doExecuteCountBySql(sql);
		if (executeCount > 0)
			return true;
		else
			return false;

	}

	@Override
	public Boolean doAddRoleUser(String ids, String userId) {
		String[] userIds = userId.split(",");
		StringBuilder sb = new StringBuilder();
		String sql = " insert into SYS_T_ROLEUSER(role_id,user_id) values(''{0}'',''{1}'') ";
		int userCount = userIds.length;
		for (int i = 0; i < userCount; i++) {
			sb.append(MessageFormat.format(sql, ids, userIds[i]));
		}
		Integer executeCount = this.doExecuteCountBySql(sb.toString());
		if (executeCount > 0)
			return true;
		else
			return false;

	}
}
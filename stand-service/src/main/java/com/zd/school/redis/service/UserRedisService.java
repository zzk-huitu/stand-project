package com.zd.school.redis.service;

import java.util.Set;

public interface UserRedisService {
	
	
	public Object getMenuTreeByUser(String userId);
	public Object getDeskFuncByUser(String userId);
	public Object getAuthByUser(String userId);
	public Object getBtnByUser(String userId);
	
	
	public void setMenuTreeByUser(String userId,Object values);
	public void setDeskFuncByUser(String userId,Set<String> values);
	public void setAuthByUser(String userId,Set<String> values);
	public void setBtnByUser(String userId,Set<String> values);
	
	public void deleteAuthByUser(Object... userIds);
	public void deleteBtnByUser(Object... userIds);
	public void deleteMenuTreeByUser(Object... userIds);
	public void deleteDeskFuncByUser(Object... userIds);
}

package com.zd.school.redis.service.Impl;

import java.util.Set;

import javax.annotation.Resource;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.zd.school.redis.service.UserRedisService;

@Service
public class UserRedisServiceImpl implements UserRedisService{
	
	@Resource
	private RedisTemplate<String, Object> redisTemplate;
	

	@Override
	public Object getMenuTreeByUser(String userId) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		Object baseDicItem = hashOper.get("userMenuTree", userId);
		return baseDicItem;
	}

	@Override
	public Object getDeskFuncByUser(String userId) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		Object baseDicItem = hashOper.get("userDeskFunc", userId);
		return baseDicItem;
	}

	@Override
	public void setMenuTreeByUser(String userId, Object values) {
		// TODO Auto-generated method stub
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		hashOper.put("userMenuTree", userId, values);		
	}

	@Override
	public void setDeskFuncByUser(String userId, Set<String> values) {
		// TODO Auto-generated method stub
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		hashOper.put("userDeskFunc", userId, values);		
	}

	@Override
	public void deleteAuthByUser(Object... userIds) {
		// TODO Auto-generated method stub
		if (userIds.length > 0) {
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
			hashOper.delete("userAuth", userIds);
		}
	}

	@Override
	public void deleteBtnByUser(Object... userIds) {
		// TODO Auto-generated method stub
		if (userIds.length > 0) {
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
			hashOper.delete("userBtn", userIds);	
		}
	}

	@Override
	public Object getAuthByUser(String userId) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		Object userAuth = hashOper.get("userAuth", userId);
		return userAuth;
	}

	@Override
	public Object getBtnByUser(String userId) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		Object userBtn = hashOper.get("userBtn", userId);
		return userBtn;
	}

	@Override
	public void setAuthByUser(String userId, Set<String>  values) {
		// TODO Auto-generated method stub
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		hashOper.put("userAuth", userId, values);	
	}

	@Override
	public void setBtnByUser(String userId, Set<String>  values) {
		// TODO Auto-generated method stub
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		hashOper.put("userBtn", userId, values);	
	}

	@Override
	public void deleteMenuTreeByUser(Object... userIds) {
		// TODO Auto-generated method stub
		if (userIds.length > 0) {
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
			hashOper.delete("userMenuTree", userIds);	
		}
	}

	@Override
	public void deleteDeskFuncByUser(Object... userIds) {
		// TODO Auto-generated method stub
		if (userIds.length > 0) {
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
			hashOper.delete("userDeskFunc", userIds);	
		}
	}
	
	

}

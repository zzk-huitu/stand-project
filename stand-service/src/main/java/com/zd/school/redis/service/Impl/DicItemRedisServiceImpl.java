package com.zd.school.redis.service.Impl;

import javax.annotation.Resource;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.zd.school.redis.service.DicItemRedisService;

@Service
public class DicItemRedisServiceImpl implements DicItemRedisService{
	
	@Resource
	private RedisTemplate<String, Object> redisTemplate;
	
	@Override
	public Long deleteByDicCode(String dicCode) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();			
		return hashOper.delete("baseDicItem", dicCode);
	}

	@Override
	public Object getByDicCode(String dicCode) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		Object baseDicItem = hashOper.get("baseDicItem", dicCode);
		return baseDicItem;
	}

	@Override
	public void setByDicCode(String dicCode, Object values) {
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		hashOper.put("baseDicItem", dicCode, values);		
	}
	

}

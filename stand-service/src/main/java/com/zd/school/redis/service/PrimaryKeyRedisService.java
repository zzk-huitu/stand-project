package com.zd.school.redis.service;

public interface PrimaryKeyRedisService {
	public String getId(String code);
	
	public Long getIncrementValue();
	
	public void resetIncrementValue();
}

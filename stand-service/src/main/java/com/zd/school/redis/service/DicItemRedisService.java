package com.zd.school.redis.service;

public interface DicItemRedisService {
	
	public Long deleteByDicCode(String dicCode);
	
	public Object getByDicCode(String dicCode);
	
	public void setByDicCode(String dicCode,Object values);
}

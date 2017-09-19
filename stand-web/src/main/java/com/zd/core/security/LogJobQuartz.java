package com.zd.core.security;

import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.zd.school.plartform.system.model.SysOperateLog;
import com.zd.school.plartform.system.service.SysOperateLogService;

//@Component(value="LogJobQuartz")
public class LogJobQuartz {
	
	@Resource
	private RedisTemplate<String, SysOperateLog> redisTemplate;

	@Resource
	private SysOperateLogService logService; 
	
	protected void execute() {
		try{
			ListOperations<String, SysOperateLog> listOper = redisTemplate.opsForList();
			List<SysOperateLog> lists = listOper.range("SysOperateLog",0,-1);
			redisTemplate.delete("SysOperateLog");
			
			logService.multiAddEntity(lists);
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}

package com.zd.school.redis.service.Impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.zd.core.util.StringUtils;
import com.zd.school.redis.service.PrimaryKeyRedisService;

@Service
public class PrimaryKeyRedisServiceImpl implements PrimaryKeyRedisService{

	@Resource
	private RedisTemplate<String, Object> redisTemplate;
	
	private static Logger logger = Logger.getLogger(PrimaryKeyRedisServiceImpl.class);
	
	private static SimpleDateFormat dateSdf=new SimpleDateFormat("yyyyMMdd");
	private static SimpleDateFormat dateTimeSdf=new SimpleDateFormat("yyyyMMdd HH:mm:ss");
	
	@Override
	public String getId(String code) {
		Long idValue;
		try {
			idValue = getIncrement();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("错误原因：【"+e.getMessage()+"】 出错堆栈跟踪："+ Arrays.toString( e.getStackTrace()));
			return null;
		}
		String incrValue=StringUtils.addString(String.valueOf(idValue),"0",6,"L");
		String dateStr=getDate();
		return dateStr+code+incrValue;	
	}

	@Override
	public Long getIncrementValue() {
		// TODO Auto-generated method stub
		try {
			return getIncrement();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("错误原因：【"+e.getMessage()+"】 出错堆栈跟踪："+ Arrays.toString( e.getStackTrace()));
			return 0L;
		}
	}
		
	
	private Long getIncrement() throws ParseException{
		BoundValueOperations<String, Object>  op = redisTemplate.boundValueOps("Increment_ID");
			
		Long value=op.increment(1);		//据测试，此方法是线程安全的
		
		//若value==1，表明此值是重新开始设定的
		if(value==1){
			//设置缓存过期时间  					
			Date date=dateTimeSdf.parse(dateSdf.format(new Date())+" "+"23:59:59");	//当前的日期加上23:59:59
			op.expireAt(date);          
		}
		       
		return value;
	}
	
	private String getDate(){	
		String value=dateSdf.format(new Date());
		return value;
	}

	@Override
	public void resetIncrementValue() {
		// TODO Auto-generated method stub		
		BoundValueOperations<String, Object>  op = redisTemplate.boundValueOps("Increment_ID");
		redisTemplate.delete("Increment_ID");
	}
	
}

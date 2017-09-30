

package com.zd.school.plartform.system.service.Impl;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.hibernate.CacheMode;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.plartform.system.dao.SysOperateLogDao;
import com.zd.school.plartform.system.model.SysOperateLog;
import com.zd.school.plartform.system.service.SysOperateLogService;

@Service
@Transactional
public class SysOperateLogServiceImpl extends BaseServiceImpl<SysOperateLog> implements SysOperateLogService {

    @Resource
    public void setSysOperateLogDao(SysOperateLogDao dao) {
        this.dao = dao;
    }
	@Resource
	private RedisTemplate<String, SysOperateLog> redisTemplate;

	private static Logger logger = Logger.getLogger(SysOperateLogServiceImpl.class);
	
	@Override
	public void multiAddEntity(List<SysOperateLog> lists) {
		// TODO Auto-generated method stub
		try{	
			//如果你的 hibernate.cache.use_second_level_cache 是 true, 请在会话级别上关闭他      
		    //向（任何一级）缓存中加载大量数据通常也意味着它们很快会被清除出去，这会增加GC开销。    
			this.getSession().setCacheMode(CacheMode.IGNORE);
			SysOperateLog s=null;
			for(int i=0;i<lists.size();i++){
				s=lists.get(i);
				//s.setUuid(UUID.randomUUID().toString());
				//s.setVersion(0);
				this.persist(s);
				
				if ((i+1)%50 == 0) {	//每50条数据，入一次库
					this.getSession().flush();
					this.getSession().clear();
				}		
			}
		}catch(Exception e){
			logger.error("错误原因：【"+e.getMessage()+"】 出错堆栈跟踪："+ Arrays.toString( e.getStackTrace()));
			
			//当发生异常时，就中断执行了，把数据重新存入redis中
			redisTemplate.opsForList().leftPushAll("SysOperateLog", lists);		
			
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
		}
	}
    
    
}


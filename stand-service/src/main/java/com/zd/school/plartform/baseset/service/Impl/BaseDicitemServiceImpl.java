package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.StatuVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.plartform.baseset.model.BaseDic;
import com.zd.school.plartform.baseset.model.BaseDicitem;
import com.zd.school.plartform.baseset.dao.BaseDicitemDao;
import com.zd.school.plartform.baseset.service.BaseDicService;
import com.zd.school.plartform.baseset.service.BaseDicitemService;

/**
 * 
 * ClassName: BaseDicitemServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 数据字典项实体Service接口实现类. date: 2016-07-19
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseDicitemServiceImpl extends BaseServiceImpl<BaseDicitem> implements BaseDicitemService {

	@Resource
	public void setBaseDicitemDao(BaseDicitemDao dao) {
		this.dao = dao;
	}

	@Resource
	private BaseDicService dictionaryService;

	@Resource
	private RedisTemplate<String, Object> redisTemplate;

	@Override
	public BaseDicitem doAdd(BaseDicitem entity, String xm) {
		// TODO Auto-generated method stub

		// 当前节点
		entity = this.doAddEntity(entity, xm);

		if (entity != null) {
			// 删除reids中的此数据字典缓存，以至于下次请求时重新从库中获取
			BaseDic baseDic = dictionaryService.get(entity.getDicId());
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();	
			//if(hashOper.hasKey("baseDicItem", baseDic.getDicCode())==true)
			hashOper.delete("baseDicItem", baseDic.getDicCode());
		}
		return entity;
	}

	@Override
	public BaseDicitem doUpdate(BaseDicitem entity, String xm) {
		// TODO Auto-generated method stub

		// 先拿到已持久化的实体
		entity = this.doUpdateEntity(entity, xm, null);
		
		if (entity != null) {
			// 删除reids中的此数据字典缓存，以至于下次请求时重新从库中获取
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();			
			hashOper.delete("baseDicItem", entity.getDicCode());
		}
		return entity;

	}

	@Override
	public boolean doDeleteOrRestore(String delIds, String isdelete, String xm) {
		boolean flag = this.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,xm);
       
		if(delIds.length()>0){
			BaseDicitem baseDicItem=this.get(delIds.split(",")[0]);
			if(baseDicItem!=null){
				//删除reids中的此数据字典缓存，以至于下次请求时重新从库中获取
				HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
				hashOper.delete("baseDicItem", baseDicItem.getDicCode());
			}
		}
		
		return flag;
	}

}
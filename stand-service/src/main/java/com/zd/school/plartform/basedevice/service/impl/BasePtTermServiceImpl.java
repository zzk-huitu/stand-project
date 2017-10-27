package com.zd.school.plartform.basedevice.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.basedevice.dao.BasePtTermDao;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.comm.model.CommBase;
import com.zd.school.plartform.system.model.SysUser;

@Service
@Transactional
public class BasePtTermServiceImpl extends BaseServiceImpl<PtTerm> implements BasePtTermService{
	
	private static Logger logger = Logger.getLogger(BasePtTermServiceImpl.class);
	
	@Resource
    public void setPtTermDao(BasePtTermDao dao) {
        this.dao = dao;
    }
	
	
	@Override
	public void batchUpdate(int termTypeID,String termid, String areaType, String[] strings, Object[] objects){
		PtTerm term=this.get(termid);
		String roomid=term.getRoomId();
		int area=Integer.parseInt(areaType);
        for(	int level=5;level>area;level--){
        	  String sql = "select id,text,iconCls,leaf,level,parent from  JW_AREAROOMINFOTREE where id='"+roomid+"'" ;
        	   List<CommBase> lists = this.queryEntityBySql(sql, CommBase.class);
        	   String sql2 = "select id,text,iconCls,leaf,level,parent from  JW_AREAROOMINFOTREE where id='"+lists.get(0).getParent()+"'" ;
        	   lists= this.queryEntityBySql(sql2, CommBase.class);
        	   roomid=lists.get(0).getId();
		}
       List<CommBase> list=null;
        list=findChildren(list,roomid);
        for(CommBase cb:list){
        	updateByProperties(new String[]{"termTypeID","roomId"},new Object[]{termTypeID,cb.getId()},strings,objects );
        }
	}
	public  List<CommBase> findChildren(List<CommBase> list, String roomid){
		 if(list==null)list=new ArrayList<>();
		 String sql = "select id,text,iconCls,leaf,level,parent from  JW_AREAROOMINFOTREE where parent='"+roomid+"'" ;
		 List<CommBase> lists = this.queryEntityBySql(sql, CommBase.class);
		 for(CommBase cb:lists){
			 if(cb.getLeaf().equals("true")){
				 list.add(cb);
			 }else{
				 findChildren( list,  cb.getId());
			 }
		 }
		return list;
	}
	
	@Override
	public PtTerm doAddEntity(PtTerm entity, SysUser currentUser) {
		try {
			Integer orderIndex = this.getDefaultOrderIndex(entity);
			PtTerm perEntity = new PtTerm();
			perEntity.setCreateUser(currentUser.getXm());
			perEntity.setOrderIndex(orderIndex);
			BeanUtils.copyPropertiesExceptNull(entity, perEntity);
			// 持久化到数据库
			entity = this.merge(entity);
			return entity;
		} catch (IllegalAccessException e) {
			logger.error(e.getMessage());
			return null;
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage());
			return null;
		}
	}
	
	@Override
	public PtTerm doUpdateEntity(PtTerm entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		PtTerm perEntity = this.get(entity.getUuid());
		try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
			perEntity.setUpdateTime(new Date()); // 设置修改时间
			perEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(perEntity);// 执行修改方法
			return entity;
		} catch (IllegalAccessException e) {
			logger.error(e.getMessage());
			return null;
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage());
			return null;
		}
	}
}

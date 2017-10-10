package com.zd.school.plartform.basedevice.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.basedevice.dao.BasePtTermDao;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.comm.model.CommBase;

@Service
@Transactional
public class BasePtTermServiceImpl extends BaseServiceImpl<PtTerm> implements BasePtTermService{
	
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
	
}

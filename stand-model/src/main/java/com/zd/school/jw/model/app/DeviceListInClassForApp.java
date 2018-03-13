package com.zd.school.jw.model.app;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.zd.school.control.device.model.PtTerm;
import com.zd.school.jw.ecc.model.EccClassredflag;
import com.zd.school.jw.ecc.model.EccClassstar;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.teacher.teacherinfo.model.TeaTeacherbase;


public class DeviceListInClassForApp {
	private boolean message;//调用结果 ture&false
	private String messageInfo;//返回状态信息
	private List<Map<String, Object>> deviceInfo; 
	public boolean getMessage() {
		return message;
	}
	public void setMessage(boolean message) {
		this.message = message;
	}
	public String getMessageInfo() {
		return messageInfo;
	}
	public void setMessageInfo(String messageInfo) {
		this.messageInfo = messageInfo;
	}
	public List<Map<String, Object>> getDeviceInfo() {
		return deviceInfo;
	}
	public void setDeviceInfo(List<Map<String, Object>> deviceInfo) {
		this.deviceInfo = deviceInfo;
	}
	public void putVal(PtTerm term) {
		if(this.deviceInfo==null){
			deviceInfo=new ArrayList<Map<String, Object>>();
		}
		Map<String, Object> map=new HashMap<String, Object>();
		map.put("roomId",term.getRoomId() );
		map.put("termId", term.getUuid());
		map.put("termSN", term.getTermSN());
		map.put("termName", term.getTermName());
		map.put("termTypeId", term.getTermTypeID());
		map.put("note", term.getNotes());
		deviceInfo.add(map);
	}
	
}

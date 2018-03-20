package com.zd.school.jw.model.app;

import java.util.ArrayList;
import java.util.List;

import com.zd.school.jw.arrangecourse.model.JwCourseArrange;


public class JwTcourseArrangeForApp {
	private boolean message;//调用结果 ture&false
	private String messageInfo;//返回状态信息
	private List<JwCourseArrange> list;
	
	public boolean isMessage() {
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
	public List<JwCourseArrange> getList() {
		return list;
	}
	public void setList(List<JwCourseArrange> list) {
		this.list = list;
	}
	
	


}

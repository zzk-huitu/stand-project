package com.zd.school.jw.model.app;

import java.util.List;


public class ClassStudentApp {
	private boolean message;//调用结果 ture&false
	private String messageInfo;//返回状态信息
	private List<?> list;
	private int totalLeaveed;
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
	public List<?> getList() {
		return list;
	}
	public void setList(List<?> list) {
		this.list = list;
	}
	public int getTotalLeaveed() {
		return totalLeaveed;
	}
	public void setTotalLeaveed(int totalLeaveed) {
		this.totalLeaveed = totalLeaveed;
	}
}

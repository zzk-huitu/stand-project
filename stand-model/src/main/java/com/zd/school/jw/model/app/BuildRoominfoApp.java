package com.zd.school.jw.model.app;

import com.zd.school.build.define.model.BuildRoominfo;

public class BuildRoominfoApp {
	private boolean message;//调用结果 ture&false
	private String messageInfo;//返回状态信息
	private BuildRoominfo obj;
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
	public BuildRoominfo getObj() {
		return obj;
	}
	public void setObj(BuildRoominfo obj) {
		this.obj = obj;
	}
}

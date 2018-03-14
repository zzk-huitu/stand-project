package com.zd.school.jw.model.app;

import java.util.ArrayList;
import java.util.List;

public class CommonApp<T> {
	private boolean message;//调用结果 ture&false
	private String messageInfo;//返回状态信息
	private T obj;  //实体对象
	private List<T> list=new ArrayList<T>();
	
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
	public T getObj() {
		return obj;
	}
	public void setObj(T obj) {
		this.obj = obj;
	}
	public List<T> getList() {
		return list;
	}
	public void setList(List<T> list) {
		this.list = list;
	}
	
}

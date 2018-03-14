package com.zd.school.jw.model.app;

import java.util.ArrayList;
import java.util.List;

public class JwCheckruleclassApp{

	private String className;
	private String startTime;
	private String endTime;
	private String teachTime;
	private Integer totalLeaveed;
	private List<?> list=new ArrayList<>();
	
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public List<?> getList() {
		return list;
	}
	public void setList(List<?> list) {
		this.list = list;
	}
	public String getTeachTime() {
		return teachTime;
	}
	public void setTeachTime(String teachTime) {
		this.teachTime = teachTime;
	}
	public Integer getTotalLeaveed() {
		return totalLeaveed;
	}
	public void setTotalLeaveed(Integer totalLeaveed) {
		this.totalLeaveed = totalLeaveed;
	}
	
	
}

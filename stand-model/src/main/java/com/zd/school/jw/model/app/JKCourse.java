package com.zd.school.jw.model.app;

public class JKCourse {

	private String beginTime;
	private String endTime;
	private String courseName;
	private String jcName;
	private String teachrName;
	private String className;
	private Integer needSignIn;
	private String teachTime;

	public String getBeginTime() {
		return beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getJcName() {
		return jcName;
	}

	public void setJcName(String jcName) {
		this.jcName = jcName;
	}

	public String getTeachrName() {
		return teachrName;
	}

	public void setTeachrName(String teachrName) {
		this.teachrName = teachrName;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public Integer getNeedSignIn() {
		return needSignIn;
	}

	public void setNeedSignIn(Integer needSignIn) {
		this.needSignIn = needSignIn;
	}

	public String getTeachTime() {
		return teachTime;
	}

	public void setTeachTime(String teachTime) {
		this.teachTime = teachTime;
	}
}

package com.zd.school.jw.model.app;

public class JwCheckrulestudent {
	private String studentId;
	private String userNumb;
	private String xm;
	private String zp;
	private String cardNo;
	private String factoryFixID;
	private String teachTime;
	private String weekDay;
	private String className;
	private boolean isLeaveed=false;
	public String getUserNumb() {
		return userNumb;
	}
	public void setUserNumb(String userNumb) {
		this.userNumb = userNumb;
	}
	public String getXm() {
		return xm;
	}
	public void setXm(String xm) {
		this.xm = xm;
	}
	public String getZp() {
		return zp;
	}
	public void setZp(String zp) {
		this.zp = zp;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getFactoryFixID() {
		return factoryFixID;
	}
	public void setFactoryFixID(String factoryFixID) {
		this.factoryFixID = factoryFixID;
	}
	public String getStudentId() {
		return studentId;
	}
	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}
	public String getTeachTime() {
		return teachTime;
	}
	public void setTeachTime(String teachTime) {
		this.teachTime = teachTime;
	}
	public String getWeekDay() {
		return weekDay;
	}
	public void setWeekDay(String weekDay) {
		this.weekDay = weekDay;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public boolean isLeaveed() {
		return isLeaveed;
	}
	public void setLeaveed(boolean isLeaveed) {
		this.isLeaveed = isLeaveed;
	}

	
}

package com.zd.school.ykt.model;

import com.zd.core.annotation.FieldInfo;
import com.zd.school.excel.annotation.MapperCell;

public class TdRecordReport {

	@FieldInfo(name = "人员姓名")
	private String employeeName;
	
	@FieldInfo(name = "人员卡号")
	private String employeeStrID;
	
	@FieldInfo(name = "人员ID")
	private String studentId;
	
	@FieldInfo(name = "身份类型")
	private String category;
	
	@FieldInfo(name = "刷卡时间导出")
	private String brushTimeEx;
	
	@FieldInfo(name = "应出勤")
	private Integer attendance;
	
	@FieldInfo(name = "实际出勤")
	private Integer actualAttendance ;
	
	@FieldInfo(name = "缺勤")
	private Integer absence;
	
	@FieldInfo(name = "迟到次数")
	private Integer lateCount;
	
	@FieldInfo(name = "未刷卡次数")
	private Integer noBrushCount;

	public Integer getAttendance() {
		return attendance;
	}

	public void setAttendance(Integer attendance) {
		this.attendance = attendance;
	}

	public Integer getActualAttendance() {
		return actualAttendance;
	}

	public void setActualAttendance(Integer actualAttendance) {
		this.actualAttendance = actualAttendance;
	}

	public Integer getAbsence() {
		return absence;
	}

	public void setAbsence(Integer absence) {
		this.absence = absence;
	}

	public Integer getLateCount() {
		return lateCount;
	}

	public void setLateCount(Integer lateCount) {
		this.lateCount = lateCount;
	}

	public Integer getNoBrushCount() {
		return noBrushCount;
	}

	public void setNoBrushCount(Integer noBrushCount) {
		this.noBrushCount = noBrushCount;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getEmployeeStrID() {
		return employeeStrID;
	}

	public void setEmployeeStrID(String employeeStrID) {
		this.employeeStrID = employeeStrID;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrushTimeEx() {
		return brushTimeEx;
	}

	public void setBrushTimeEx(String brushTimeEx) {
		this.brushTimeEx = brushTimeEx;
	}
}

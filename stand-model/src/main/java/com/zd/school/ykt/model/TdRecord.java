package com.zd.school.ykt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.util.DateTimeSerializer;
import com.zd.school.excel.annotation.MapperCell;

public class TdRecord  implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@MapperCell(cellName = "人员姓名", order = 1)
	@FieldInfo(name = "人员姓名")
	private String employeeName;
	
	@MapperCell(cellName = "人员卡号", order = 2)
	@FieldInfo(name = "人员卡号")
	private String employeeStrID;
	
	@FieldInfo(name = "人员ID")
	private String studentId;
	
	@MapperCell(cellName = "刷卡时间", order = 3)
	@FieldInfo(name = "刷卡时间导出")
	private String brushTimeEx;
	
	@FieldInfo(name = "刷卡时间")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = DateTimeSerializer.class)	
	private Date brushTime;
	
	@MapperCell(cellName = "班级名称", order = 4)
	@FieldInfo(name = "班级名称")
	private String className;
	
	@FieldInfo(name = "出入类型")
	private String inOutType;
	
	@FieldInfo(name = "哪个门刷的卡")
	private String readerName;
	
	@MapperCell(cellName = "身份类型", order = 5)
	@FieldInfo(name = "身份类型")
	private String category;
	
	@FieldInfo(name = "上午刷卡")
	private String morning;
	
	@FieldInfo(name = "下午刷卡")
	private String afternoon;

	@MapperCell(cellName = "已签到", order = 6)
	@FieldInfo(name = "已签到")
	private Integer normal=0;
	
	@MapperCell(cellName = "迟到", order = 7)
	@FieldInfo(name = "迟到")
	private Integer late=0;
	
	@MapperCell(cellName = "未刷卡", order = 8)
	@FieldInfo(name = "未刷卡")
	private Integer noBrush=0;


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

	public Date getBrushTime() {
		return brushTime;
	}

	public void setBrushTime(Date brushTime) {
		this.brushTime = brushTime;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getInOutType() {
		return inOutType;
	}

	public void setInOutType(String inOutType) {
		this.inOutType = inOutType;
	}

	public String getReaderName() {
		return readerName;
	}

	public void setReaderName(String readerName) {
		this.readerName = readerName;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getMorning() {
		return morning;
	}

	public void setMorning(String morning) {
		this.morning = morning;
	}

	public String getAfternoon() {
		return afternoon;
	}

	public void setAfternoon(String afternoon) {
		this.afternoon = afternoon;
	}

	public Integer getNormal() {
		return normal;
	}

	public void setNormal(Integer normal) {
		this.normal = normal;
	}

	public Integer getLate() {
		return late;
	}

	public void setLate(Integer late) {
		this.late = late;
	}

	public Integer getNoBrush() {
		return noBrush;
	}

	public void setNoBrush(Integer noBrush) {
		this.noBrush = noBrush;
	}

	public String getBrushTimeEx() {
		return brushTimeEx;
	}

	public void setBrushTimeEx(String brushTimeEx) {
		this.brushTimeEx = brushTimeEx;
	}

}

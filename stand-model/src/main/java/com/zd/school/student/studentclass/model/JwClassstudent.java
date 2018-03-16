package com.zd.school.student.studentclass.model;

import java.io.Serializable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Formula;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.school.excel.annotation.MapperCell;

/**
 * 学生分班的信息
 * @author Administrator
 *
 */
@Entity
@Table(name = "JW_T_CLASSSTUDENT")
@AttributeOverride(name = "uuid", column = @Column(name = "CSTUDENT_ID", length = 36, nullable = false) )
public class JwClassstudent extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "班级ID")
	@Column(name = "CLAI_ID", length = 36, nullable = true)
	private String claiId;

	@FieldInfo(name = "学生ID")
	@Column(name = "STUDENT_ID", length = 36, nullable = true)
	private String studentId;

	@MapperCell(cellName="学年",order=2)
	@FieldInfo(name = "学年")
	@Column(name = "STUDY_YEAH", length = 10, nullable = false)
	private String studyYeah;

	
	@FieldInfo(name = "学期")
	@Column(name = "SEMESTER", length = 8, nullable = false)
	private String semester;

	@FieldInfo(name = "status")
	@Column(name = "STATUS", length = 8, nullable = true)
	private String status="0";

	@FieldInfo(name = "签到状态  1-签到 2请假 3旷课 4迟到")
	@Column(name = "SIGN_IN_STATE", length = 8, nullable = true)
	private String signInState="3";
	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
	@MapperCell(cellName="所属班级",order=1)
	@FieldInfo(name = "所属班级")
	@Formula("(SELECT a.CLASS_NAME FROM JW_T_GRADECLASS a WHERE a.CLAI_ID=CLAI_ID)")
	private String className;

	@FieldInfo(name = "学段标识")
	@Formula("(SELECT B.GRADE_CODE FROM dbo.JW_T_GRADECLASS A JOIN dbo.JW_T_GRADE B "
			+ "ON A.GRAI_ID=B.GRAI_ID WHERE A.CLAI_ID=CLAI_ID)")
	private String gradeCode;

	@MapperCell(cellName="学号",order=5)
	@FieldInfo(name = "学号")
	@Formula("(SELECT A.USER_NUMB FROM dbo.SYS_T_USER A WHERE A.USER_ID=STUDENT_ID)")
	private String userNumb;

	@MapperCell(cellName="姓名",order=4)
	@Formula("(SELECT A.XM FROM dbo.SYS_T_USER A WHERE A.USER_ID=STUDENT_ID)")
	@FieldInfo(name = "姓名")
	private String xm;
	
	@FieldInfo(name = "性别码GB/T 2261.1")
	@Formula("(SELECT A.XBM FROM dbo.SYS_T_USER A WHERE A.USER_ID=STUDENT_ID)")
	private String xbm;
	
	@Transient
	@MapperCell(cellName="学期",order=3)
	private String semesterEx;
	
	@Transient
	@MapperCell(cellName="性别",order=6)
	private String xbmEx;
	
	@Formula("(SELECT A.ZP FROM dbo.STU_T_BASEINFO A WHERE A.USER_ID=STUDENT_ID)")
	@FieldInfo(name = "照片")
	private String zp;
	
	@Formula("(SELECT TOP 1 A.CARDNO FROM dbo.PT_CARD A WHERE A.USER_ID=STUDENT_ID AND A.CARDSTATUSID=1)")
	@FieldInfo(name = "卡流水号")
	private String cardNo;
	
	@Formula("(SELECT TOP 1 A.FACTORYFIXID FROM dbo.PT_CARD A WHERE A.USER_ID=STUDENT_ID AND A.CARDSTATUSID=1)")
	@FieldInfo(name = "物理卡号")
	private String factoryFixID;

	@Transient
	private boolean isLeaveed=false;
	
	public String getGradeCode() {
		return gradeCode;
	}

	public void setGradeCode(String gradeCode) {
		this.gradeCode = gradeCode;
	}

	public String getClaiId() {
		return claiId;
	}

	public void setClaiId(String claiId) {
		this.claiId = claiId;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}


	public String getSemester() {
		return semester;
	}

	public void setSemester(String semester) {
		this.semester = semester;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getXm() {
		return xm;
	}

	public void setXm(String xm) {
		this.xm = xm;
	}

	public String getXbm() {
		return xbm;
	}

	public void setXbm(String xbm) {
		this.xbm = xbm;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getStudyYeah() {
		return studyYeah;
	}

	public void setStudyYeah(String studyYeah) {
		this.studyYeah = studyYeah;
	}

	public String getUserNumb() {
		return userNumb;
	}

	public void setUserNumb(String userNumb) {
		this.userNumb = userNumb;
	}

	public String getSemesterEx() {
		return semesterEx;
	}

	public void setSemesterEx(String semesterEx) {
		this.semesterEx = semesterEx;
	}

	public String getXbmEx() {
		return xbmEx;
	}

	public void setXbmEx(String xbmEx) {
		this.xbmEx = xbmEx;
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

	public String getSignInState() {
		return signInState;
	}

	public void setSignInState(String signInState) {
		this.signInState = signInState;
	}

	public boolean isLeaveed() {
		return isLeaveed;
	}

	public void setLeaveed(boolean isLeaveed) {
		this.isLeaveed = isLeaveed;
	}

}
package com.zd.school.jw.arrangecourse.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.math.BigDecimal;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;

/**
 * 
 * ClassName: JwFuncroomcourse 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 排课课程表(JW_T_FUNCROOMCOURSE)实体类.
 * date: 2017-03-06
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "JW_T_FUNCROOMCOURSE")
@AttributeOverride(name = "uuid", column = @Column(name = "UUID", length = 36, nullable = false))
public class JwFuncroomcourse extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "学校主键")
    @Column(name = "SCHOOL_ID", length = 36, nullable = true)
    private String schoolId;
    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }
    public String getSchoolId() {
        return schoolId;
    }
        
    @FieldInfo(name = "学校名称")
    @Column(name = "SCHOOL_NAME", length = 36, nullable = true)
    private String schoolName;
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }
    public String getSchoolName() {
        return schoolName;
    }
        
    @FieldInfo(name = "学年")
    @Column(name = "SCHOOL_YEAR", length = 36, nullable = true)
    private String schoolYear;
    public void setSchoolYear(String schoolYear) {
        this.schoolYear = schoolYear;
    }
    public String getSchoolYear() {
        return schoolYear;
    }
        
    @FieldInfo(name = "学期")
    @Column(name = "SCHOOL_TERM", length = 36, nullable = true)
    private String schoolTerm;
    public void setSchoolTerm(String schoolTerm) {
        this.schoolTerm = schoolTerm;
    }
    public String getSchoolTerm() {
        return schoolTerm;
    }
        
    @FieldInfo(name = "房间ID")
    @Column(name = "FUNCROOM_ID", length = 36, nullable = true)
    private String funcRoomId;
    public String getFuncRoomId() {
		return funcRoomId;
	}
	public void setFuncRoomId(String funcRoomId) {
		this.funcRoomId = funcRoomId;
	}
        
    @FieldInfo(name = "节次")
    @Column(name = "TEACH_TIME", length = 36, nullable = true)
    private String teachTime;
    public void setTeachTime(String teachTime) {
        this.teachTime = teachTime;
    }
    public String getTeachTime() {
        return teachTime;
    }
        
    @FieldInfo(name = "课程ID1")
    @Column(name = "COURSE_ID01", length = 360, nullable = true)
    private String courseId01;
    public void setCourseId01(String courseId01) {
        this.courseId01 = courseId01;
    }
    public String getCourseId01() {
        return courseId01;
    }
        
    @FieldInfo(name = "课程名1")
    @Column(name = "COURSE_NAME01", length = 360, nullable = true)
    private String courseName01;
    public void setCourseName01(String courseName01) {
        this.courseName01 = courseName01;
    }
    public String getCourseName01() {
        return courseName01;
    }
        
    @FieldInfo(name = "班级ID1")
    @Column(name = "CLAI_ID01", length = 360, nullable = true)
    private String claiId01;
    public void setClaiId01(String claiId01) {
        this.claiId01 = claiId01;
    }
    public String getClaiId01() {
        return claiId01;
    }
        
    @FieldInfo(name = "班级名称1")
    @Column(name = "CLASS_NAME01", length = 360, nullable = true)
    private String className01;
    public void setClassName01(String className01) {
        this.className01 = className01;
    }
    public String getClassName01() {
        return className01;
    }
        
    @FieldInfo(name = "任课教师姓名1")
    @Column(name = "TEACHER_NAME01", length = 360, nullable = true)
    private String teacherName01;
    public void setTeacherName01(String teacherName01) {
        this.teacherName01 = teacherName01;
    }
    public String getTeacherName01() {
        return teacherName01;
    }
        
    @FieldInfo(name = "课程ID2")
    @Column(name = "COURSE_ID02", length = 360, nullable = true)
    private String courseId02;
    public void setCourseId02(String courseId02) {
        this.courseId02 = courseId02;
    }
    public String getCourseId02() {
        return courseId02;
    }
        
    @FieldInfo(name = "课程名2")
    @Column(name = "COURSE_NAME02", length = 360, nullable = true)
    private String courseName02;
    public void setCourseName02(String courseName02) {
        this.courseName02 = courseName02;
    }
    public String getCourseName02() {
        return courseName02;
    }
        
    @FieldInfo(name = "班级ID2")
    @Column(name = "CLAI_ID02", length = 360, nullable = true)
    private String claiId02;
    public void setClaiId02(String claiId02) {
        this.claiId02 = claiId02;
    }
    public String getClaiId02() {
        return claiId02;
    }
        
    @FieldInfo(name = "班级名称2")
    @Column(name = "CLASS_NAME02", length = 360, nullable = true)
    private String className02;
    public void setClassName02(String className02) {
        this.className02 = className02;
    }
    public String getClassName02() {
        return className02;
    }
        
    @FieldInfo(name = "任课教师姓名2")
    @Column(name = "TEACHER_NAME02", length = 360, nullable = true)
    private String teacherName02;
    public void setTeacherName02(String teacherName02) {
        this.teacherName02 = teacherName02;
    }
    public String getTeacherName02() {
        return teacherName02;
    }
        
    @FieldInfo(name = "课程ID3")
    @Column(name = "COURSE_ID03", length = 360, nullable = true)
    private String courseId03;
    public void setCourseId03(String courseId03) {
        this.courseId03 = courseId03;
    }
    public String getCourseId03() {
        return courseId03;
    }
        
    @FieldInfo(name = "课程名3")
    @Column(name = "COURSE_NAME03", length = 360, nullable = true)
    private String courseName03;
    public void setCourseName03(String courseName03) {
        this.courseName03 = courseName03;
    }
    public String getCourseName03() {
        return courseName03;
    }
        
    @FieldInfo(name = "班级ID3")
    @Column(name = "CLAI_ID03", length = 360, nullable = true)
    private String claiId03;
    public void setClaiId03(String claiId03) {
        this.claiId03 = claiId03;
    }
    public String getClaiId03() {
        return claiId03;
    }
        
    @FieldInfo(name = "班级名称3")
    @Column(name = "CLASS_NAME03", length = 360, nullable = true)
    private String className03;
    public void setClassName03(String className03) {
        this.className03 = className03;
    }
    public String getClassName03() {
        return className03;
    }
        
    @FieldInfo(name = "任课教师姓名3")
    @Column(name = "TEACHER_NAME03", length = 360, nullable = true)
    private String teacherName03;
    public void setTeacherName03(String teacherName03) {
        this.teacherName03 = teacherName03;
    }
    public String getTeacherName03() {
        return teacherName03;
    }
        
    @FieldInfo(name = "课程ID4")
    @Column(name = "COURSE_ID04", length = 360, nullable = true)
    private String courseId04;
    public void setCourseId04(String courseId04) {
        this.courseId04 = courseId04;
    }
    public String getCourseId04() {
        return courseId04;
    }
        
    @FieldInfo(name = "课程名4")
    @Column(name = "COURSE_NAME04", length = 360, nullable = true)
    private String courseName04;
    public void setCourseName04(String courseName04) {
        this.courseName04 = courseName04;
    }
    public String getCourseName04() {
        return courseName04;
    }
        
    @FieldInfo(name = "班级ID4")
    @Column(name = "CLAI_ID04", length = 360, nullable = true)
    private String claiId04;
    public void setClaiId04(String claiId04) {
        this.claiId04 = claiId04;
    }
    public String getClaiId04() {
        return claiId04;
    }
        
    @FieldInfo(name = "班级名称4")
    @Column(name = "CLASS_NAME04", length = 360, nullable = true)
    private String className04;
    public void setClassName04(String className04) {
        this.className04 = className04;
    }
    public String getClassName04() {
        return className04;
    }
        
    @FieldInfo(name = "任课教师姓名4")
    @Column(name = "TEACHER_NAME04", length = 360, nullable = true)
    private String teacherName04;
    public void setTeacherName04(String teacherName04) {
        this.teacherName04 = teacherName04;
    }
    public String getTeacherName04() {
        return teacherName04;
    }
        
    @FieldInfo(name = "课程ID5")
    @Column(name = "COURSE_ID05", length = 360, nullable = true)
    private String courseId05;
    public void setCourseId05(String courseId05) {
        this.courseId05 = courseId05;
    }
    public String getCourseId05() {
        return courseId05;
    }
        
    @FieldInfo(name = "课程名5")
    @Column(name = "COURSE_NAME05", length = 360, nullable = true)
    private String courseName05;
    public void setCourseName05(String courseName05) {
        this.courseName05 = courseName05;
    }
    public String getCourseName05() {
        return courseName05;
    }
        
    @FieldInfo(name = "班级ID5")
    @Column(name = "CLAI_ID05", length = 360, nullable = true)
    private String claiId05;
    public void setClaiId05(String claiId05) {
        this.claiId05 = claiId05;
    }
    public String getClaiId05() {
        return claiId05;
    }
        
    @FieldInfo(name = "班级名称5")
    @Column(name = "CLASS_NAME05", length = 360, nullable = true)
    private String className05;
    public void setClassName05(String className05) {
        this.className05 = className05;
    }
    public String getClassName05() {
        return className05;
    }
        
    @FieldInfo(name = "任课教师姓名5")
    @Column(name = "TEACHER_NAME05", length = 360, nullable = true)
    private String teacherName05;
    public void setTeacherName05(String teacherName05) {
        this.teacherName05 = teacherName05;
    }
    public String getTeacherName05() {
        return teacherName05;
    }
        
    @FieldInfo(name = "课程ID6")
    @Column(name = "COURSE_ID06", length = 360, nullable = true)
    private String courseId06;
    public void setCourseId06(String courseId06) {
        this.courseId06 = courseId06;
    }
    public String getCourseId06() {
        return courseId06;
    }
        
    @FieldInfo(name = "课程名6")
    @Column(name = "COURSE_NAME06", length = 360, nullable = true)
    private String courseName06;
    public void setCourseName06(String courseName06) {
        this.courseName06 = courseName06;
    }
    public String getCourseName06() {
        return courseName06;
    }
        
    @FieldInfo(name = "班级ID6")
    @Column(name = "CLAI_ID06", length = 360, nullable = true)
    private String claiId06;
    public void setClaiId06(String claiId06) {
        this.claiId06 = claiId06;
    }
    public String getClaiId06() {
        return claiId06;
    }
        
    @FieldInfo(name = "班级名称6")
    @Column(name = "CLASS_NAME06", length = 360, nullable = true)
    private String className06;
    public void setClassName06(String className06) {
        this.className06 = className06;
    }
    public String getClassName06() {
        return className06;
    }
        
    @FieldInfo(name = "任课教师姓名6")
    @Column(name = "TEACHER_NAME06", length = 360, nullable = true)
    private String teacherName06;
    public void setTeacherName06(String teacherName06) {
        this.teacherName06 = teacherName06;
    }
    public String getTeacherName06() {
        return teacherName06;
    }
        
    @FieldInfo(name = "课程ID7")
    @Column(name = "COURSE_ID07", length = 360, nullable = true)
    private String courseId07;
    public void setCourseId07(String courseId07) {
        this.courseId07 = courseId07;
    }
    public String getCourseId07() {
        return courseId07;
    }
        
    @FieldInfo(name = "课程名7")
    @Column(name = "COURSE_NAME07", length = 360, nullable = true)
    private String courseName07;
    public void setCourseName07(String courseName07) {
        this.courseName07 = courseName07;
    }
    public String getCourseName07() {
        return courseName07;
    }
        
    @FieldInfo(name = "班级ID7")
    @Column(name = "CLAI_ID07", length = 360, nullable = true)
    private String claiId07;
    public void setClaiId07(String claiId07) {
        this.claiId07 = claiId07;
    }
    public String getClaiId07() {
        return claiId07;
    }
        
    @FieldInfo(name = "班级名称7")
    @Column(name = "CLASS_NAME07", length = 360, nullable = true)
    private String className07;
    public void setClassName07(String className07) {
        this.className07 = className07;
    }
    public String getClassName07() {
        return className07;
    }
        
    @FieldInfo(name = "任课教师姓名7")
    @Column(name = "TEACHER_NAME07", length = 360, nullable = true)
    private String teacherName07;
    public void setTeacherName07(String teacherName07) {
        this.teacherName07 = teacherName07;
    }
    public String getTeacherName07() {
        return teacherName07;
    }
        
    @FieldInfo(name = "startime")
    @Column(name = "STARTIME", length = 10, nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using=DateTimeSerializer.class)
    private Date startime;
    public void setStartime(Date startime) {
        this.startime = startime;
    }
    public Date getStartime() {
        return startime;
    }
        
    @FieldInfo(name = "endtime")
    @Column(name = "ENDTIME", length = 10, nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using=DateTimeSerializer.class)
    private Date endtime;
    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }
    public Date getEndtime() {
        return endtime;
    }
	
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
    
    @Formula("(SELECT A.ROOM_ID FROM dbo.BUILD_T_FUNCROOMDEFINE A WHERE A.FUNCTIONROOM_ID=FUNCROOM_ID)")
	@FieldInfo(name = "房间ID")
	private String roomId;
	public String getRoomId() {
		return roomId;
	}
	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}
}
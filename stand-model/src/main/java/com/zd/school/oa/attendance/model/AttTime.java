package com.zd.school.oa.attendance.model;

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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;

/**
 * 
 * ClassName: AttTime 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 考勤时间(ATT_T_TIME)实体类.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "ATT_T_TIME")
@AttributeOverride(name = "uuid", column = @Column(name = "TIME_ID", length = 36, nullable = false))
public class AttTime extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "主题ID")
    @Column(name = "TITLE_ID", length = 36, nullable = true)
    private String titleId;
    public void setTitleId(String titleId) {
        this.titleId = titleId;
    }
    public String getTitleId() {
        return titleId;
    }
        
    @FieldInfo(name = "星期")
    @Column(name = "WEEK_DAY", length = 10, nullable = false)
    private Integer weekDay;
    public void setWeekDay(Integer weekDay) {
        this.weekDay = weekDay;
    }
    public Integer getWeekDay() {
        return weekDay;
    }
        
    @FieldInfo(name = "选课开始日期")
    @Column(name = "BEGIN_DATE", columnDefinition = "datetime", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using=DateTimeSerializer.class)
    private Date beginDate;
    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }
    public Date getBeginDate() {
        return beginDate;
    }
        
    @FieldInfo(name = "选课结束日期")
    @Column(name = "END_DATE", columnDefinition = "datetime", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using=DateTimeSerializer.class)
    private Date endDate;
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
    public Date getEndDate() {
        return endDate;
    }
        
    @FieldInfo(name = "开始时间")
    @Column(name = "BEGIN_TIME", columnDefinition = "datetime", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using=DateTimeSerializer.class)
    private Date beginTime;
    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }
    public Date getBeginTime() {
        return beginTime;
    }
        
    @FieldInfo(name = "结束时间")
    @Column(name = "END_TIME", columnDefinition = "datetime",nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using=DateTimeSerializer.class)
    private Date endTime;
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
    public Date getEndTime() {
        return endTime;
    }
    
    @FieldInfo(name = "节次")
    @Column(name = "TEACH_TIME", length = 36, nullable = true)
    private String teachTime;
	public String getTeachTime() {
		return teachTime;
	}
	public void setTeachTime(String teachTime) {
		this.teachTime = teachTime;
	}

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
package com.zd.school.ykt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;

@Entity
@Table(name = "Td_Record_Time")
@AttributeOverride(name = "uuid", column = @Column(name = "UUID", length = 36, nullable = false))
public class TdRecordTime extends BaseEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@FieldInfo(name = "特殊刷卡时间")
	@Column(name = "BRUSH_TIME", length = 23, nullable = true)
	@Temporal(TemporalType.TIMESTAMP)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date brushTime;
	
	@FieldInfo(name = "特殊是否需要刷卡类型 0不需要 1需要")
	@Column(name = "BRUSH_TYPE",nullable = true)
	private Integer brushType;

	public Date getBrushTime() {
		return brushTime;
	}

	public void setBrushTime(Date brushTime) {
		this.brushTime = brushTime;
	}

	public Integer getBrushType() {
		return brushType;
	}

	public void setBrushType(Integer brushType) {
		this.brushType = brushType;
	}

}

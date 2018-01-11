package com.zd.school.ykt.model;

import java.io.Serializable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;

@Entity
@Table(name = "Td_Record_Week")
@AttributeOverride(name = "uuid", column = @Column(name = "UUID", length = 36, nullable = false))
public class TdRecordWeek extends BaseEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@FieldInfo(name = "需要刷卡的周几")
	@Column(name = "BRUSH_WEEK",nullable = true)
	private Integer brushWeek;

	public Integer getBrushWeek() {
		return brushWeek;
	}

	public void setBrushWeek(Integer brushWeek) {
		this.brushWeek = brushWeek;
	}
}

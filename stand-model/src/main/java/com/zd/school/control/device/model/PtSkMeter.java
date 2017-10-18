package com.zd.school.control.device.model;

import java.io.Serializable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;

/**
 * 水控流量计表
 * 
 * @author hucy
 *
 */
@Entity
@Table(name = "PT_SK_METER")
@AttributeOverride(name = "uuid", column = @Column(name = "METER_ID", length = 36, nullable = false) )
public class PtSkMeter extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "计量数（脉冲数/升）")
	@Column(name = "MEASURE")
	private Integer measure;

	@FieldInfo(name = "备注")
	@Column(name = "NOTES", length = 200, nullable = true)
	private String notes;

	public Integer getMeasure() {
		return measure;
	}

	public void setMeasure(Integer measure) {
		this.measure = measure;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}



	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
}
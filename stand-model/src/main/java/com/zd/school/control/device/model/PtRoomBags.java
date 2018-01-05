package com.zd.school.control.device.model;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "PT_ROOM_BAGS")
@AttributeOverride(name = "uuid", column = @Column(name = "ROOMBAG_ID", length = 36, nullable = false))
public class PtRoomBags extends BaseEntity implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@FieldInfo(name = "房间ID")
	@Column(name = "ROOM_ID", length = 36, nullable = true)
	private String roomId;
	
	@FieldInfo(name = "房间余额")
	@Column(name = "ROOM_VALUE")
	private BigDecimal roomValue;
	
	@FieldInfo(name = "房间总用")
	@Column(name = "ROOM_TOTALUSED")
	private BigDecimal roomTotalUsed;
	
	@FieldInfo(name = "房间总充")
	@Column(name = "ROOM_TOTALRECHARGE")
	private BigDecimal roomTotalRecharge;
	
	@FieldInfo(name = "水总用")
	@Column(name = "WATER_TOTALUSED")
	private BigDecimal waterTotalused;
	
	@FieldInfo(name = "水改变时间")
	@Column(name = "WATER_UPDATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date waterUpdateTime;
	
	@FieldInfo(name = "电总用")
	@Column(name = "EC_TOTALUSED")
	private BigDecimal ecTotalUsed;
	
	@FieldInfo(name = "电改变时间")
	@Column(name = "EC_UPDATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date ecUpdateTime;
	
	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public BigDecimal getRoomValue() {
		return roomValue;
	}

	public void setRoomValue(BigDecimal roomValue) {
		this.roomValue = roomValue;
	}

	public BigDecimal getRoomTotalUsed() {
		return roomTotalUsed;
	}

	public void setRoomTotalUsed(BigDecimal roomTotalUsed) {
		this.roomTotalUsed = roomTotalUsed;
	}

	public BigDecimal getRoomTotalRecharge() {
		return roomTotalRecharge;
	}

	public void setRoomTotalRecharge(BigDecimal roomTotalRecharge) {
		this.roomTotalRecharge = roomTotalRecharge;
	}

	public BigDecimal getWaterTotalused() {
		return waterTotalused;
	}

	public void setWaterTotalused(BigDecimal waterTotalused) {
		this.waterTotalused = waterTotalused;
	}

	public Date getWaterUpdateTime() {
		return waterUpdateTime;
	}

	public void setWaterUpdateTime(Date waterUpdateTime) {
		this.waterUpdateTime = waterUpdateTime;
	}

	public BigDecimal getEcTotalUsed() {
		return ecTotalUsed;
	}

	public void setEcTotalUsed(BigDecimal ecTotalUsed) {
		this.ecTotalUsed = ecTotalUsed;
	}

	public Date getEcUpdateTime() {
		return ecUpdateTime;
	}

	public void setEcUpdateTime(Date ecUpdateTime) {
		this.ecUpdateTime = ecUpdateTime;
	}

}

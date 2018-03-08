package com.zd.school.control.device.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;
import com.zd.school.excel.annotation.MapperCell;

/**
 * 电控使用状态
 * 
 * @author hucy
 *
 */
@Entity
@Table(name = "PT_EC_TERMSTATUS")
@AttributeOverride(name = "uuid", column = @Column(name = "TERMSTATUS_ID", length = 36, nullable = false) )
public class PtEcTermStatus extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "设备序列号")
	@Column(name = "TERMSN", length = 14, nullable = true)
	private String termSn;

	@FieldInfo(name = "房间编号")
	@Column(name = "ROOM_ID", length = 36, nullable = true)
	private String roomId;

	@MapperCell(cellName = "状态的日期", order = 1)
	@FieldInfo(name = "状态的日期")
	@Temporal(TemporalType.DATE)
	@JsonSerialize(using = DateTimeSerializer.class)
	@Column(name = "STATUSDATE", columnDefinition = "date")
	private Date statusDate;

	@MapperCell(cellName = "状态的小时", order = 2)
	@FieldInfo(name = "状态的小时")
	@Column(name = "STATUSHOUR")
	private Integer statusHour;

	@MapperCell(cellName = "当前小时用电量", order = 3)
	@FieldInfo(name = "当前小时用电量")
	@Column(name = "USEKWH")
	private double usekwh;

	@MapperCell(cellName = "已购电总量", order = 4)
	@FieldInfo(name = "已购电总量")
	@Column(name = "BUYEDKWH")
	private double buyedkwh;

	@MapperCell(cellName = "已使用总电量", order = 5)
	@FieldInfo(name = "已使用总电量")
	@Column(name = "TOTALUSEDKWH")
	private double totalusedkwh;

	@MapperCell(cellName = "剩余总电量", order = 6)
	@FieldInfo(name = "剩余总电量")
	@Column(name = "SURPLUSKWH")
	private double surpluskwh;

	@MapperCell(cellName = "电压", order = 7)
	@FieldInfo(name = "电压")
	@Column(name = "VOLTAGE")
	private long voltage;

	@MapperCell(cellName = "电流", order = 8)
	@FieldInfo(name = "电流")
	@Column(name = "CURRENTS")
	private long currents;

	@MapperCell(cellName = "功率", order = 9)
	@FieldInfo(name = "功率")
	@Column(name = "POWER")
	private long power;

	@MapperCell(cellName = "状态的时间", order = 10)
	@FieldInfo(name = "状态的时间")
	@Column(name = "STATUSTIME")
	private Date statustime;

	@MapperCell(cellName = "房间名称", order = 11)
	@Formula("(SELECT A.ROOM_NAME FROM dbo.BUILD_T_ROOMINFO A WHERE A.ROOM_ID=ROOM_ID)")
	@FieldInfo(name = "房间名称")
	private String roomName;

	/* 用于排除未定义的房间 0 */
	@Formula("(SELECT A.ROOM_TYPE FROM dbo.BUILD_T_ROOMINFO A WHERE A.ROOM_ID=ROOM_ID)")
	@FieldInfo(name = "房间类型")
	private String roomType;

	@Transient
	@FieldInfo(name = "设备机号")
	private String termNo;

	@Transient
	@FieldInfo(name = "设备类型")
	private String termTypeId;

	@Transient
	@FieldInfo(name = "网关名称")
	private String gatewayName;

	@Transient
	@FieldInfo(name = "楼层名称")
	private String areaName;

	@Transient
	@FieldInfo(name = "起始电量")
	private String startDl;

	@Transient
	@FieldInfo(name = "结束电量")
	private String endDl;

	@Transient
	@FieldInfo(name = "总电量")
	private String sumDl;
	@JsonIgnore
	@Transient
	@FieldInfo(name = "条件一")
	private String wheresql1;
	@JsonIgnore
	@Transient
	@FieldInfo(name = "条件二")
	private String wheresql2;

	@MapperCell(cellName = "设备名称", order = 12)
	@Formula("(SELECT A.TERMNAME FROM dbo.PT_TERM A WHERE A.TERMSN=TERMSN)")
	@FieldInfo(name = "设备名称")
	private String termName;

	public String getTermSn() {
		return termSn;
	}

	public void setTermSn(String termSn) {
		this.termSn = termSn;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public Date getStatusDate() {
		return statusDate;
	}

	public void setStatusDate(Date statusDate) {
		this.statusDate = statusDate;
	}

	public Integer getStatusHour() {
		return statusHour;
	}

	public void setStatusHour(Integer statusHour) {
		this.statusHour = statusHour;
	}

	public double getUsekwh() {
		return usekwh;
	}

	public void setUsekwh(double usekwh) {
		this.usekwh = usekwh;
	}

	public double getBuyedkwh() {
		return buyedkwh;
	}

	public void setBuyedkwh(double buyedkwh) {
		this.buyedkwh = buyedkwh;
	}

	public double getTotalusedkwh() {
		return totalusedkwh;
	}

	public void setTotalusedkwh(double totalusedkwh) {
		this.totalusedkwh = totalusedkwh;
	}

	public double getSurpluskwh() {
		return surpluskwh;
	}

	public void setSurpluskwh(double surpluskwh) {
		this.surpluskwh = surpluskwh;
	}

	public long getVoltage() {
		return voltage;
	}

	public void setVoltage(long voltage) {
		this.voltage = voltage;
	}

	public long getCurrents() {
		return currents;
	}

	public void setCurrents(long currents) {
		this.currents = currents;
	}

	public Date getStatustime() {
		return statustime;
	}

	public void setStatustime(Date statustime) {
		this.statustime = statustime;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public long getPower() {
		return power;
	}

	public void setPower(long power) {
		this.power = power;
	}

	public String getTermName() {
		return termName;
	}

	public void setTermName(String termName) {
		this.termName = termName;
	}

	public String getTermNo() {
		return termNo;
	}

	public void setTermNo(String termNo) {
		this.termNo = termNo;
	}

	public String getTermTypeId() {
		return termTypeId;
	}

	public void setTermTypeId(String termTypeId) {
		this.termTypeId = termTypeId;
	}

	public String getGatewayName() {
		return gatewayName;
	}

	public void setGatewayName(String gatewayName) {
		this.gatewayName = gatewayName;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getStartDl() {
		return startDl;
	}

	public void setStartDl(String startDl) {
		this.startDl = startDl;
	}

	public String getEndDl() {
		return endDl;
	}

	public void setEndDl(String endDl) {
		this.endDl = endDl;
	}

	public String getSumDl() {
		return sumDl;
	}

	public void setSumDl(String sumDl) {
		this.sumDl = sumDl;
	}

	public String getWheresql1() {
		return wheresql1;
	}

	public void setWheresql1(String wheresql1) {
		this.wheresql1 = wheresql1;
	}

	public String getWheresql2() {
		return wheresql2;
	}

	public void setWheresql2(String wheresql2) {
		this.wheresql2 = wheresql2;
	}

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
}
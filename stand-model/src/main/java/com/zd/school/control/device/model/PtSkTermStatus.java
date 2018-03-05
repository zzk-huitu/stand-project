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

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;
import com.zd.school.excel.annotation.MapperCell;

/**
 * 水控使用状态
 * @author hucy
 *
 */
@Entity
@Table(name = "PT_SK_TERMSTATUS")
@AttributeOverride(name = "uuid", column = @Column(name = "TERMSTATUS_ID", length = 36, nullable = false))
public class PtSkTermStatus extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "设备序列号")
    @Column(name = "TERMSN", length = 14, nullable = true)
    private String termSn;

    @FieldInfo(name = "房间编号")
    @Column(name = "ROOM_ID", length = 36, nullable = true)
    private String roomId;
   
    @MapperCell(cellName="状态的日期",order=1)
    @FieldInfo(name = "状态的日期")
    @Temporal(TemporalType.DATE)
  	@JsonSerialize(using = DateTimeSerializer.class)
    @Column(name = "STATUSDATE", columnDefinition = "date")
    private Date statusDate;
    
    @MapperCell(cellName="状态的小时",order=2)
    @FieldInfo(name = "状态的小时")
    @Column(name = "STATUSHOUR")
    private Integer statusHour;
    
    @MapperCell(cellName="测量单位（脉冲/升）",order=3)
    @FieldInfo(name = "测量单位（脉冲/升）")
    @Column(name = "MEASURE")
    private Integer measure;

    @MapperCell(cellName="费率（元/升）",order=4)
    @FieldInfo(name = "费率（元/升）")
    @Column(name = "PRICE")
    private BigDecimal price;
    
    @MapperCell(cellName="冷水当前小时使用水量（升）",order=5)
    @FieldInfo(name = "冷水当前小时使用水量（升）")
    @Column(name = "USELITER")
    private double useliter;
    
    @MapperCell(cellName="冷水已使用总水量（升）",order=6)
    @FieldInfo(name = "冷水已使用总水量（升）")
    @Column(name = "TOTALUSEDLITER")
    private double totalusedliter;
    
    @MapperCell(cellName="冷水当前小时使用脉冲数",order=7)
    @FieldInfo(name = "冷水当前小时使用脉冲数")
    @Column(name = "USEPULSE")
    private long usepulse;
    
    @MapperCell(cellName="冷水总使用脉冲数",order=8)
    @FieldInfo(name = "冷水总使用脉冲数")
    @Column(name = "TOTALUSEDPULSE")
    private long totalusedpulse;
    
    @MapperCell(cellName="热水交易金额",order=9)
    @FieldInfo(name = "热水交易金额")
    @Column(name = "USEMONEY")
    private BigDecimal usemoney;
    
    @MapperCell(cellName="热水已交易总额",order=10)
    @FieldInfo(name = "热水已交易总额")
    @Column(name = "TOTALUSEDMONEY")
    private BigDecimal totalusedmoney;

    @MapperCell(cellName="热水已交易流水",order=11)
    @FieldInfo(name = "热水已交易流水")
    @Column(name = "TOTALRECORD")
    private long totalrecord;

    @MapperCell(cellName="热水已上传流水",order=12)
    @FieldInfo(name = "热水已上传流水")
    @Column(name = "UPLOADRECORD")
    private long uploadrecord;
    
    @MapperCell(cellName="状态的时间",order=13)
    @FieldInfo(name = "状态的时间")
    @Column(name = "STATUSTIME")
    private Date statustime;

    @MapperCell(cellName="房间名称",order=14)
    @Formula("(SELECT A.ROOM_NAME FROM dbo.BUILD_T_ROOMINFO A WHERE A.ROOM_ID=ROOM_ID)")
	@FieldInfo(name = "房间名称")
	private String roomName;
    
    @MapperCell(cellName="设备名称",order=15)
    @Formula("(SELECT A.TERMNAME FROM dbo.PT_TERM A WHERE A.TERMSN=TERMSN)")
	@FieldInfo(name = "设备名称")
	private String termName;
    
    
    @MapperCell(cellName="网关名称",order=15)
    @Formula("(SELECT A.GATEWAYNAME FROM PT_GATEWAY A ,PT_TERM t  WHERE   A.GATEWAY_ID=t.GATEWAY_ID and t.TERMSN=TERMSN)")
	@FieldInfo(name = "网关名称")
	private String gatewayName;
    
	@FieldInfo(name = "区域名称")
	@Formula("(SELECT isnull(a.NODE_TEXT,'ROOT') FROM BUILD_T_ROOMAREA a ,BUILD_T_ROOMINFO r WHERE a.AREA_ID=r.AREA_ID and r.ROOM_ID=ROOM_ID)")
	private String areaName;

	/*用于排除未定义的房间 0*/
	@Formula("(SELECT A.ROOM_TYPE FROM dbo.BUILD_T_ROOMINFO A WHERE A.ROOM_ID=ROOM_ID)")
	@FieldInfo(name = "房间类型")
	private String roomType;
	 
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

	public Integer getMeasure() {
		return measure;
	}

	public void setMeasure(Integer measure) {
		this.measure = measure;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public double getUseliter() {
		return useliter;
	}

	public void setUseliter(double useliter) {
		this.useliter = useliter;
	}

	public double getTotalusedliter() {
		return totalusedliter;
	}

	public void setTotalusedliter(double totalusedliter) {
		this.totalusedliter = totalusedliter;
	}

	public long getUsepulse() {
		return usepulse;
	}

	public void setUsepulse(long usepulse) {
		this.usepulse = usepulse;
	}

	public long getTotalusedpulse() {
		return totalusedpulse;
	}

	public void setTotalusedpulse(long totalusedpulse) {
		this.totalusedpulse = totalusedpulse;
	}

	public BigDecimal getUsemoney() {
		return usemoney;
	}

	public void setUsemoney(BigDecimal usemoney) {
		this.usemoney = usemoney;
	}

	public BigDecimal getTotalusedmoney() {
		return totalusedmoney;
	}

	public void setTotalusedmoney(BigDecimal totalusedmoney) {
		this.totalusedmoney = totalusedmoney;
	}

	public long getTotalrecord() {
		return totalrecord;
	}

	public void setTotalrecord(long totalrecord) {
		this.totalrecord = totalrecord;
	}

	public long getUploadrecord() {
		return uploadrecord;
	}

	public void setUploadrecord(long uploadrecord) {
		this.uploadrecord = uploadrecord;
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

	public String getTermName() {
		return termName;
	}

	public void setTermName(String termName) {
		this.termName = termName;
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

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}
	
	

	
	
    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
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

/**
 * 房间钱包规则
 * 
 * @author hucy
 *
 */
@Entity
@Table(name = "PT_ROOM_BAGSRULE")
@AttributeOverride(name = "uuid", column = @Column(name = "ROOMRULE_ID", length = 36, nullable = false))
public class PtRoomBagRule extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "规则名称")
	@Column(name = "ROOMRULENAME", length = 255, nullable = true)
	private String roomRuleName;

	@FieldInfo(name = "允许关电开始时间")
	@Column(name = "SHUTDOWNSTART", columnDefinition = "datetime")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date shutDownStart;

	@FieldInfo(name = "允许关电结束时间")
	@Column(name = "SHUTDOWNEND", columnDefinition = "datetime")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date shutDownEnd;


	@FieldInfo(name = "无余额控制方式（1：不许使用，2：继续使用）")
	@Column(name = "NOMONEYMODE")
	private String noMoneyMode;

	@FieldInfo(name = "报警金额（低于此金额后开始尝试扣费）")
	@Column(name = "WARNVALUE")
	private BigDecimal warnvalue;

	@FieldInfo(name = "扣费模式（0：不扣费，1：平均扣费，2：指定扣费）")
	@Column(name = "DEDUCTIONMODE")
	private String deDuctionMode;

	@FieldInfo(name = "扣费金额（每次扣费的总额）")
	@Column(name = "DEDUCTIONVALUE")
	private BigDecimal deDuctionValue;

	@FieldInfo(name = "是否启用")
	@Column(name = "ISENABLE")
	private BigDecimal isEnable;

	public String getRoomRuleName() {
		return roomRuleName;
	}

	public void setRoomRuleName(String roomRuleName) {
		this.roomRuleName = roomRuleName;
	}

	public Date getShutDownStart() {
		return shutDownStart;
	}

	public void setShutDownStart(Date shutDownStart) {
		this.shutDownStart = shutDownStart;
	}

	public Date getShutDownEnd() {
		return shutDownEnd;
	}

	public void setShutDownEnd(Date shutDownEnd) {
		this.shutDownEnd = shutDownEnd;
	}

	public String getNoMoneyMode() {
		return noMoneyMode;
	}

	public void setNoMoneyMode(String noMoneyMode) {
		this.noMoneyMode = noMoneyMode;
	}

	public BigDecimal getWarnvalue() {
		return warnvalue;
	}

	public void setWarnvalue(BigDecimal warnvalue) {
		this.warnvalue = warnvalue;
	}

	public String getDeDuctionMode() {
		return deDuctionMode;
	}

	public void setDeDuctionMode(String deDuctionMode) {
		this.deDuctionMode = deDuctionMode;
	}

	public BigDecimal getDeDuctionValue() {
		return deDuctionValue;
	}

	public void setDeDuctionValue(BigDecimal deDuctionValue) {
		this.deDuctionValue = deDuctionValue;
	}

	public BigDecimal getIsEnable() {
		return isEnable;
	}

	public void setIsEnable(BigDecimal isEnable) {
		this.isEnable = isEnable;
	}

	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
}
package com.zd.school.control.device.model;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Formula;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;

@Entity
@Table(name = "PT_TERM_BAGS")
@AttributeOverride(name = "uuid", column = @Column(name = "TERMBAG_ID", length = 36, nullable = false))
public class PtTermBags extends BaseEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "设备序列号")
	@Column(name = "TERMSN", length = 14, nullable = true)
	private String termSn;
	
	@FieldInfo(name = "设备类型")
	@Column(name = "TERMTYPEID")
	private Integer termTypeId;
	
	@FieldInfo(name = "设备余额")
	@Column(name = "BAGVALUE")
	private BigDecimal bagValue;
	
	@FieldInfo(name = "总买量")
	@Column(name = "TOTALBUYEDVALUE")
	private BigDecimal totalBuyedValue;
	
	@FieldInfo(name = "总用量")
	@Column(name = "TOTALUSEDVALUE")
	private BigDecimal totalUsedValue;
	
	@FieldInfo(name = "总计清除补助量")
	@Column(name = "TOTALCLEARVALUE")
	private BigDecimal totalClearValue;
	
	@FieldInfo(name = "补助剩余量")
	@Column(name = "SUBVALUE")
	private BigDecimal subValue;
	
	@Transient
	@FieldInfo(name = "绑定费率规则")
	protected String bdrole = "";

	public String getTermSn() {
		return termSn;
	}
	@Formula("(SELECT A.TERMNAME FROM dbo.PT_TERM A WHERE A.TERMSN=TERMSN)")
	public String termName;
	
	public void setTermSn(String termSn) {
		this.termSn = termSn;
	}

	public Integer getTermTypeId() {
		return termTypeId;
	}

	public void setTermTypeId(Integer termTypeId) {
		this.termTypeId = termTypeId;
	}

	public BigDecimal getBagValue() {
		return bagValue;
	}

	public void setBagValue(BigDecimal bagValue) {
		this.bagValue = bagValue;
	}

	public BigDecimal getTotalBuyedValue() {
		return totalBuyedValue;
	}

	public void setTotalBuyedValue(BigDecimal totalBuyedValue) {
		this.totalBuyedValue = totalBuyedValue;
	}

	public BigDecimal getTotalUsedValue() {
		return totalUsedValue;
	}

	public void setTotalUsedValue(BigDecimal totalUsedValue) {
		this.totalUsedValue = totalUsedValue;
	}

	public BigDecimal getTotalClearValue() {
		return totalClearValue;
	}

	public void setTotalClearValue(BigDecimal totalClearValue) {
		this.totalClearValue = totalClearValue;
	}

	public BigDecimal getSubValue() {
		return subValue;
	}

	public void setSubValue(BigDecimal subValue) {
		this.subValue = subValue;
	}

	public String getTermName() {
		return termName;
	}

	public void setTermName(String termName) {
		this.termName = termName;
	}

	public String getBdrole() {
		return bdrole;
	}

	public void setBdrole(String bdrole) {
		this.bdrole = bdrole;
	}

	
	
}

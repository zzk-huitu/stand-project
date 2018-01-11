package com.zd.school.ykt.model;

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
 *  卡类管理
 * ClassName: TcCardtype 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_CardType)实体类.
 * date: 2017-03-20
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_CardType")
@AttributeOverride(name = "uuid", column = @Column(name = "cardtypeid", length = 36, nullable = false))
public class TcCardtype extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
       
    @FieldInfo(name = "cardtypeno")
    @Column(name = "CardTypeNO", length = 5,  updatable=false ,insertable=false ,columnDefinition=" smallint  IDENTITY(1,1) NOT NULL")
    private Short cardtypeno;
    public void setCardtypeno(Short cardtypeno) {
        this.cardtypeno = cardtypeno;
    }
    public Short getCardtypeno() {
        return cardtypeno;
    }
        
    @FieldInfo(name = "cardtype")
    @Column(name = "CardType", length = 40, nullable = true)
    private String cardtype;
    public void setCardtype(String cardtype) {
        this.cardtype = cardtype;
    }
    public String getCardtype() {
        return cardtype;
    }
        
    @FieldInfo(name = "commissioncharge")
    @Column(name = "CommissionCharge", length = 19, nullable = true)
    private BigDecimal commissioncharge;
    public void setCommissioncharge(BigDecimal commissioncharge) {
        this.commissioncharge = commissioncharge;
    }
    public BigDecimal getCommissioncharge() {
        return commissioncharge;
    }
        
    @FieldInfo(name = "deposit")
    @Column(name = "Deposit", length = 19, nullable = true)
    private BigDecimal deposit;
    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }
    public BigDecimal getDeposit() {
        return deposit;
    }
        
    @FieldInfo(name = "useflag")
    @Column(name = "UseFlag", length = 1, nullable = true)
    private Boolean useflag;
    public void setUseflag(Boolean useflag) {
        this.useflag = useflag;
    }
    public Boolean getUseflag() {
        return useflag;
    }
        
    @FieldInfo(name = "cardnotes")
    @Column(name = "CardNotes", length = 200, nullable = true)
    private String cardnotes;
    public void setCardnotes(String cardnotes) {
        this.cardnotes = cardnotes;
    }
    public String getCardnotes() {
        return cardnotes;
    }
        
    @FieldInfo(name = "issuefee")
    @Column(name = "IssueFee", length = 19, nullable = true)
    private BigDecimal issuefee;
    public void setIssuefee(BigDecimal issuefee) {
        this.issuefee = issuefee;
    }
    public BigDecimal getIssuefee() {
        return issuefee;
    }
        
    @FieldInfo(name = "zhejiufee")
    @Column(name = "ZheJiuFee", length = 19, nullable = true)
    private BigDecimal zhejiufee;
    public void setZhejiufee(BigDecimal zhejiufee) {
        this.zhejiufee = zhejiufee;
    }
    public BigDecimal getZhejiufee() {
        return zhejiufee;
    }
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
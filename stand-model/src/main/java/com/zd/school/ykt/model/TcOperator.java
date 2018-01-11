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

import org.apache.commons.io.filefilter.FalseFileFilter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;



/**
 *  营业员管理  
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_Operator)实体类.
 * date: 2017-03-28.
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_Operator")
@AttributeOverride(name = "uuid", column = @Column(name = "OperatorID", length =36, nullable = false))
public class TcOperator  extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
        
        
        

   
	@Column(name = "OperatorNO",    updatable=false ,insertable=false ,columnDefinition=" int  IDENTITY(1,1) NOT NULL")
	private Integer operatorno;
	
	public Integer getOperatorno() {
		return operatorno;
	}
	
	public void setOperatorno(Integer operatorno) {
		this.operatorno = operatorno;
	}

   
	@Column(name = "AccountID",   length =36, nullable = true)
	private String accountid;
	
	public String getAccountid() {
		return accountid;
	}
	
	public void setAccountid(String accountid) {
		this.accountid = accountid;
	}

    @FieldInfo(name = "结算账户名称")
    @Formula("(SELECT a.AccountName FROM TC_Account a WHERE a.AccountID=AccountID )")
    private String accountName;

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
	
    @FieldInfo(name = "营业员名称") 
	@Column(name = "OperatorName", length = 40 ,   nullable = false)
	private String operatorname;
	
	public String getOperatorname() {
		return operatorname;
	}
	
	public void setOperatorname(String operatorname) {
		this.operatorname = operatorname;
	}

    @FieldInfo(name = "流水账号") 
	@Column(name = "OperatorCardID", length = 40 ,   insertable=false , updatable=false,  nullable = true)
	private String operatorcardid;
	
	public String getOperatorcardid() {
		return operatorcardid;
	}
	
	public void setOperatorcardid(String operatorcardid) {
		this.operatorcardid = operatorcardid;
	}

    @FieldInfo(name = "物理卡号") 
	@Column(name = "FactoryFixID", length = 60 ,   insertable=false , updatable=false,  nullable = true)
	private String factoryfixid;
	
	public String getFactoryfixid() {
		return factoryfixid;
	}
	
	public void setFactoryfixid(String factoryfixid) {
		this.factoryfixid = factoryfixid;
	}

    @FieldInfo(name = "应用系统") 
	@Column(name = "UseType",    nullable = true)
	private Integer usetype;
	
	public Integer getUsetype() {
		return usetype;
	}
	
	public void setUsetype(Integer usetype) {
		this.usetype = usetype;
	}

    @FieldInfo(name = "营业员描述") 
	@Column(name = "OperatorNotes", length = 200 ,   nullable = true)
	private String operatornotes;
	
	public String getOperatornotes() {
		return operatornotes;
	}
	
	public void setOperatornotes(String operatornotes) {
		this.operatornotes = operatornotes;
	}

   
	@Column(name = "Passwordt", length = 10 ,   nullable = true)
	private String passwordt;
	
	public String getPasswordt() {
		return passwordt;
	}
	
	public void setPasswordt(String passwordt) {
		this.passwordt = passwordt;
	}

    @FieldInfo(name = "有效期") 
	@Column(name = "ValidDate",    nullable = true)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date validdate;
	
	public Date getValiddate() {
		return validdate;
	}
	
	public void setValiddate( Date validdate) {
		this.validdate = validdate;
	}

   
    
    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}

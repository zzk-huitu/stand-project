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
 * 结算账户管理
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_Account)实体类. 
 * date: 2017-03-23
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_Account")
@AttributeOverride(name = "uuid", column = @Column(name = "AccountID", length = 36, nullable = false))
public class TcAccount extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "accountpwd")
    @Column(name = "AccountPWD", length = 40, nullable = true)
    private String accountpwd;
    public void setAccountpwd(String accountpwd) {
        this.accountpwd = accountpwd;
    }
    public String getAccountpwd() {
        return accountpwd;
    }

    @FieldInfo(name = "accountname")
    @Column(name = "AccountName", length = 40, nullable = false)
    private String accountname;
    public void setAccountname(String accountname) {
        this.accountname = accountname;
    }
    public String getAccountname() {
        return accountname;
    }
        
    @FieldInfo(name = "accountdescription")
    @Column(name = "AccountDescription", length = 200, nullable = true)
    private String accountdescription;
    public void setAccountdescription(String accountdescription) {
        this.accountdescription = accountdescription;
    }
    public String getAccountdescription() {
        return accountdescription;
    }
        
    @FieldInfo(name = "accountownertel")
    @Column(name = "AccountOwnerTel", length = 100, nullable = true)
    private String accountownertel;
    public void setAccountownertel(String accountownertel) {
        this.accountownertel = accountownertel;
    }
    public String getAccountownertel() {
        return accountownertel;
    }
        
    @FieldInfo(name = "accountstatus")
    @Column(name = "AccountStatus", length = 1, nullable = true)
    private Boolean accountstatus;
    public void setAccountstatus(Boolean accountstatus) {
        this.accountstatus = accountstatus;
    }
    public Boolean getAccountstatus() {
        return accountstatus;
    }
        
    @FieldInfo(name = "~帐户编号")
    @Column(name = "AccountNo", length = 20, nullable = true)
    private String accountno;
    public void setAccountno(String accountno) {
        this.accountno = accountno;
    }
    public String getAccountno() {
        return accountno;
    }
        
    @FieldInfo(name = "~管理员姓名")
    @Column(name = "AdminName", length = 100, nullable = true)
    private String adminname;
    public void setAdminname(String adminname) {
        this.adminname = adminname;
    }
    public String getAdminname() {
        return adminname;
    }
        
    @FieldInfo(name = "~证件编号")
    @Column(name = "IDCard", length = 100, nullable = true)
    private String idcard;
    public void setIdcard(String idcard) {
        this.idcard = idcard;
    }
    public String getIdcard() {
        return idcard;
    }
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
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
 * 一卡通系统参数
 * ClassName: TcSysparameter 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_SysParameter)实体类.
 * date: 2017-03-20
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_SysParameter")
@AttributeOverride(name = "uuid", column = @Column(name = "sysparameterid", length = 36, nullable = false) )
public class TcSysparameter extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
       
    @FieldInfo(name = "sysparameterno")
    @Column(name = "SysParameterNO", length = 10, nullable = false)
    private Integer sysparameterno;
    public void setSysparameterno(Integer sysparameterno) {
        this.sysparameterno = sysparameterno;
    }
    public Integer getSysparameterno() {
        return sysparameterno;
    }
        
    @FieldInfo(name = "sysparametername")
    @Column(name = "SysParameterName",  nullable = true, columnDefinition = "nvarchar(50)")
    private String sysparametername;
    public void setSysparametername(String sysparametername) {
        this.sysparametername = sysparametername;
    }
    public String getSysparametername() {
        return sysparametername;
    }
        
    @FieldInfo(name = "sysparametervalue")
    @Column(name = "SysParameterValue",   nullable = true , columnDefinition = "nvarchar(50)")
    private String sysparametervalue;
    public void setSysparametervalue(String sysparametervalue) {
        this.sysparametervalue = sysparametervalue;
    }
    public String getSysparametervalue() {
        return sysparametervalue;
    }
        
    @FieldInfo(name = "remark")
    @Column(name = "Remark",  columnDefinition = "nvarchar(50)", nullable = true)
    private String remark;
    public void setRemark(String remark) {
        this.remark = remark;
    }
    public String getRemark() {
        return remark;
    }
        
    @FieldInfo(name = "sysparametertype")
    @Column(name = "SysParameterType", columnDefinition = "nvarchar(50)", nullable = true)
    private String sysparametertype;
    public void setSysparametertype(String sysparametertype) {
        this.sysparametertype = sysparametertype;
    }
    public String getSysparametertype() {
        return sysparametertype;
    }
        
    @FieldInfo(name = "parentid")
    @Column(name = "ParentID", length = 10, nullable = true)
    private Integer parentid;
    public void setParentid(Integer parentid) {
        this.parentid = parentid;
    }
    public Integer getParentid() {
        return parentid;
    }
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
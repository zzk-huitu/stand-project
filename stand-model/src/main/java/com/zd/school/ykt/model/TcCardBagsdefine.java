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
 * 钱包定义
 * ClassName: TcCardBagsdefine 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_Card_BagsDefine)实体类.  
 * date: 2017-03-21
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_Card_BagsDefine")
@AttributeOverride(name = "uuid", column = @Column(name = "BAGID", length = 36, nullable = false))
public class TcCardBagsdefine extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
        
    @FieldInfo(name = "bagno")
    @Column(name = "BAGNO", length = 5, nullable = false)
    private Short bagno;
    public void setBagno(Short bagno) {
        this.bagno = bagno;
    }
    public Short getBagno() {
        return bagno;
    }
        
    @FieldInfo(name = "钱包名称")
    @Column(name = "BAGNAME", length = 50, nullable = false)
    private String bagname;
    public void setBagname(String bagname) {
        this.bagname = bagname;
    }
    public String getBagname() {
        return bagname;
    }
        
    @FieldInfo(name = "是否启用")
    @Column(name = "STATUS", length = 1, nullable = true)
    private Boolean status;
    public void setStatus(Boolean status) {
        this.status = status;
    }
    public Boolean getStatus() {
        return status;
    }
        
    @FieldInfo(name = "钱包描述")
    @Column(name = "BAGNOTES", length = 500, nullable = true)
    private String bagnotes;
    public void setBagnotes(String bagnotes) {
        this.bagnotes = bagnotes;
    }
    public String getBagnotes() {
        return bagnotes;
    }
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
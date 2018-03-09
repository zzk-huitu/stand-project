package com.zd.school.oa.attendance.model;

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
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;

/**
 * 
 * ClassName: AttUser 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 考勤人员(ATT_T_USER)实体类.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "ATT_T_USER")
@AttributeOverride(name = "uuid", column = @Column(name = "EMP_ID", length = 36, nullable = false))
public class AttUser extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "主题ID")
    @Column(name = "TITLE_ID", length = 36, nullable = true)
    private String titleId;
    public void setTitleId(String titleId) {
        this.titleId = titleId;
    }
    public String getTitleId() {
        return titleId;
    }
        
    @FieldInfo(name = "主键")
    @Column(name = "USER_ID", length = 36, nullable = false)
    private String userId;
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserId() {
        return userId;
    }
    
    
    @FieldInfo(name = "姓名")
    @Formula("(SELECT ISNULL(a.XM,'') FROM SYS_T_USER a WHERE a.USER_ID=USER_ID)")
    private String xm;

    public void setXm(String xm) {
        this.xm = xm;
    }
    public String getXm() {
        return xm;
    }
    @FieldInfo(name = "学号")
    @Formula("(SELECT ISNULL(a.USER_NUMB,'') FROM SYS_T_USER a WHERE a.USER_ID=USER_ID)")
    private String xh;

    public void setXh(String xh) {
        this.xh = xh;
    }
    public String getXh() {
        return xh;
    }
    /*
    @FieldInfo(name = "姓名")
    @Column(name = "XM", length = 36, nullable = false)
    private String xm;
    public void setXm(String xm) {
        this.xm = xm;
    }
    public String getXm() {
        return xm;
    }
        
    @FieldInfo(name = "学号")
    @Column(name = "XH", length = 20, nullable = false)
    private String xh;
    public void setXh(String xh) {
        this.xh = xh;
    }
    public String getXh() {
        return xh;
    }
    */    

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
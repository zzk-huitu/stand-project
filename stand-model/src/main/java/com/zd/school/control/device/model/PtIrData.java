package com.zd.school.control.device.model;

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
 * 
 * ClassName: PtIrData 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 红外设备数据(PT_IR_DATA)实体类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "PT_IR_DATA")
@AttributeOverride(name = "uuid", column = @Column(name = "IR_DATA_ID", length = 36, nullable = false))
public class PtIrData extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "红外数据所属品牌")
    @Column(name = "BRAND_ID", length = 36, nullable = true)
    private String brandId;
    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }
    public String getBrandId() {
        return brandId;
    }
        
    @FieldInfo(name = "红外数据编码")
    @Column(name = "IR_DATA_NO", length = 19, nullable = true)
    private Long irDataNo;
    public void setIrDataNo(Long irDataNo) {
        this.irDataNo = irDataNo;
    }
    public Long getIrDataNo() {
        return irDataNo;
    }
        
    @FieldInfo(name = "红外数据名称")
    @Column(name = "IR_DATA_NAME", length = 50, nullable = true)
    private String irDataName;
    public void setIrDataName(String irDataName) {
        this.irDataName = irDataName;
    }
    public String getIrDataName() {
        return irDataName;
    }
        
    @FieldInfo(name = "红外数据")
    @Column(name = "IR_ACTION_DATA"  ,length=8000, nullable = false)
    private byte[] irActionData;
    public void setIrActionData(byte[] irActionData) {
        this.irActionData = irActionData;
    }
    public byte[] getIrActionData() {
        return irActionData;
    }
        
    @FieldInfo(name = "红外数据")
    @Column(name = "IR_CONVERTED_DATA" ,length=8000, nullable = true)
    private byte[] irConvertedData;
    public void setIrConvertedData(byte[] irConvertedData) {
        this.irConvertedData = irConvertedData;
    }
    public byte[] getIrConvertedData() {
        return irConvertedData;
    }
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
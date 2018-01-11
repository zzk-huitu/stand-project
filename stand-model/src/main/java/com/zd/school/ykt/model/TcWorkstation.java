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
 * 工作站管理
 * ClassName: TcWorkstation 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_WorkStation)实体类.
 * date: 2017-03-21
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_WorkStation")
@AttributeOverride(name = "uuid", column = @Column(name = "WorkStationID", length = 36, nullable = false))
public class TcWorkstation extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
        
    @FieldInfo(name = "workstationno")
    @Column(name = "WorkStationNO", length = 5  ,updatable=false ,insertable=false ,columnDefinition=" smallint  IDENTITY(1,1) NOT NULL")
    private Short workstationno;
    public void setWorkstationno(Short workstationno) {
        this.workstationno = workstationno;
    }
    public Short getWorkstationno() {
        return workstationno;
    }
        
    @FieldInfo(name = "adminid")
    @Column(name = "AdminID", length = 10, nullable = true)
    private Integer adminid;
    public void setAdminid(Integer adminid) {
        this.adminid = adminid;
    }
    public Integer getAdminid() {
        return adminid;
    }
        
    @FieldInfo(name = "workstationname")
    @Column(name = "WorkStationName", length = 30, nullable = true)
    private String workstationname;
    public void setWorkstationname(String workstationname) {
        this.workstationname = workstationname;
    }
    public String getWorkstationname() {
        return workstationname;
    }
        
    @FieldInfo(name = "workstationip")
    @Column(name = "WorkStationIP", length = 100, nullable = true)
    private String workstationip;
    public void setWorkstationip(String workstationip) {
        this.workstationip = workstationip;
    }
    public String getWorkstationip() {
        return workstationip;
    }
        
    @FieldInfo(name = "nic")
    @Column(name = "NIC", length = 100, nullable = true)
    private String nic;
    public void setNic(String nic) {
        this.nic = nic;
    }
    public String getNic() {
        return nic;
    }
        
    @FieldInfo(name = "computername")
    @Column(name = "ComputerName", length = 50, nullable = true)
    private String computername;
    public void setComputername(String computername) {
        this.computername = computername;
    }
    public String getComputername() {
        return computername;
    }
        
    @FieldInfo(name = "availableport")
    @Column(name = "AvailablePort", length = 100, nullable = true)
    private String availableport;
    public void setAvailableport(String availableport) {
        this.availableport = availableport;
    }
    public String getAvailableport() {
        return availableport;
    }
        
    @FieldInfo(name = "online")
    @Column(name = "OnLine", length = 1, nullable = true)
    private Boolean online;
    public void setOnline(Boolean online) {
        this.online = online;
    }
    public Boolean getOnline() {
        return online;
    }
        
    @FieldInfo(name = "msserverport")
    @Column(name = "MSServerPort", length = 10, nullable = true)
    private Integer msserverport;
    public void setMsserverport(Integer msserverport) {
        this.msserverport = msserverport;
    }
    public Integer getMsserverport() {
        return msserverport;
    }
        
    @FieldInfo(name = "~工作站描述")
    @Column(name = "WorkStationNotes", length = 200, nullable = true)
    private String workstationnotes;
    public void setWorkstationnotes(String workstationnotes) {
        this.workstationnotes = workstationnotes;
    }
    public String getWorkstationnotes() {
        return workstationnotes;
    }
        
    @FieldInfo(name = "端口号")
    @Column(name = "CommPort", length = 10, nullable = true)
    private Integer commport;
    public void setCommport(Integer commport) {
        this.commport = commport;
    }
    public Integer getCommport() {
        return commport;
    }
        
    @FieldInfo(name = "最大金额")
    @Column(name = "MaxCardFree", length = 19, nullable = true)
    private BigDecimal maxcardfree;
    public void setMaxcardfree(BigDecimal maxcardfree) {
        this.maxcardfree = maxcardfree;
    }
    public BigDecimal getMaxcardfree() {
        return maxcardfree;
    }
        

    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
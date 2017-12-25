package com.zd.school.jw.ecc.model;

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
 * ClassName: JwCheckrule 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 课程考勤规则(JW_T_CHECKRULE)实体类.
 * date: 2017-05-10
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "JW_T_CHECKRULE")
@AttributeOverride(name = "uuid", column = @Column(name = "RULE_ID", length = 36, nullable = false))
public class JwCheckrule extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "规则名称")
    @Column(name = "RULE_NAME", length = 36, nullable = false)
    private String ruleName;
    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }
    public String getRuleName() {
        return ruleName;
    }
        
    @FieldInfo(name = "考勤模式 1-按半天考勤 2-按全天考勤 3-按节次考勤")
    @Column(name = "CHECK_MODE", length = 5, nullable = false)
    private Integer checkMode;

    public Integer getCheckMode() {
        return checkMode;
    }

    public void setCheckMode(Integer checkMode) {
        this.checkMode = checkMode;
    }

    @FieldInfo(name = "签到提前分钟")
    @Column(name = "IN_BEFORE", length = 5, nullable = false)
    private Integer inBefore;

    public Integer getInBefore() {
        return inBefore;
    }

    public void setInBefore(Integer inBefore) {
        this.inBefore = inBefore;
    }

    @FieldInfo(name = "迟到分钟")
    @Column(name = "BE_LATE", length = 5, nullable = false)
    private Integer beLate;

    public Integer getBeLate() {
        return beLate;
    }

    public void setBeLate(Integer beLate) {
        this.beLate = beLate;
    }

    @FieldInfo(name = "缺勤分钟")
    @Column(name = "ABSENTEEISM", length = 5, nullable = false)
    private Integer absenteeism;

    public Integer getAbsenteeism() {
        return absenteeism;
    }

    public void setAbsenteeism(Integer absenteeism) {
        this.absenteeism = absenteeism;
    }

    @FieldInfo(name = "是否需要签退 0-不需要 1-需要")
    @Column(name = "NEED_CHECKOUT", length = 5, nullable = false)
    private Integer needCheckout;

    public Integer getNeedCheckout() {
        return needCheckout;
    }

    public void setNeedCheckout(Integer needCheckout) {
        this.needCheckout = needCheckout;
    }

    @FieldInfo(name = "签退提前分钟")
    @Column(name = "OUT_BEFORE", length = 5, nullable = true)
    private Integer outBefore;

    public Integer getOutBefore() {
        return outBefore;
    }

    public void setOutBefore(Integer outBefore) {
        this.outBefore = outBefore;
    }

    @FieldInfo(name = "早退分钟")
    @Column(name = "LEAVE_EARLY", length = 5, nullable = true)
    private Integer leaveEarly;

    public Integer getLeaveEarly() {
        return leaveEarly;
    }

    public void setLeaveEarly(Integer leaveEarly) {
        this.leaveEarly = leaveEarly;
    }

    @FieldInfo(name = "签退延迟分钟")
    @Column(name = "OUT_LATE", length = 5, nullable = true)
    private Integer outLate;

    public Integer getOutLate() {
        return outLate;
    }

    public void setOutLate(Integer outLate) {
        this.outLate = outLate;
    }

    @FieldInfo(name = "规则说明")
    @Column(name = "RULE_DESC", length = 255, nullable = true)
    private String ruleDesc;
    public void setRuleDesc(String ruleDesc) {
        this.ruleDesc = ruleDesc;
    }
    public String getRuleDesc() {
        return ruleDesc;
    }
        
    @FieldInfo(name = "启用标识 0-不启用 1-启用")
    @Column(name = "START_USING", length = 5, nullable = false)
    private Integer startUsing;

    public Integer getStartUsing() {
        return startUsing;
    }

    public void setStartUsing(Integer startUsing) {
        this.startUsing = startUsing;
    }
/** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
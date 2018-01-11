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
 *  营业时段管理类  
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (TC_MealType)实体类.
 * date: 2017-03-24.
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "TC_MealType")
@AttributeOverride(name = "uuid", column = @Column(name = "MealTypeID", length =36, nullable = false))
public class TcMealtype  extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
        
        
        
   
	@Column(name = "MealTypeNO", length = 5,  nullable = false)
	private int mealtypeno;
	
	public int getMealtypeno() {
	return mealtypeno;
	}
	
	public void setMealtypeno(int mealtypeno) {
	this.mealtypeno = mealtypeno;
	}


   	/** 时段名称**/
	@Column(name = "MealName", length = 30 ,   nullable = true)
	private String mealname;
	
	public String getMealname() {
	return mealname;
	}
	
	public void setMealname(String mealname) {
	this.mealname = mealname;
	}

   	/** 开始时间**/
	@Column(name = "BeginTime", length = 8 ,   nullable = true)
	private String begintime;
	
	public String getBegintime() {
	return begintime;
	}
	
	public void setBegintime(String begintime) {
	this.begintime = begintime;
	}

   	/** 结束时间**/
	@Column(name = "EndTime", length = 8 ,   nullable = true)
	private String endtime;
	
	public String getEndtime() {
	return endtime;
	}
	
	public void setEndtime(String endtime) {
	this.endtime = endtime;
	}

   	/** 时段说明**/
	@Column(name = "MealNotes", length = 200 ,   nullable = true)
	private String mealnotes;
	
	public String getMealnotes() {
	return mealnotes;
	}
	
	public void setMealnotes(String mealnotes) {
	this.mealnotes = mealnotes;
	}

   
    
    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}

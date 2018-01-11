package com.zd.school.ykt.model;
import java.io.Serializable;
import java.util.Date;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.core.util.DateTimeSerializer;
import com.zd.school.excel.annotation.MapperCell;



/**
 *    
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: (PT_TASK)实体类.
 * date: 2017-05-16.
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "PT_TASK")
@AttributeOverride(name = "uuid", column = @Column(name = "TASK_ID", length =36, nullable =false ))
public class PtTask  extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
        

   
	@Column(name = "TASKNO", length = 8 ,   nullable = false)
	private String taskno;
	
	public String getTaskno() {
		return taskno;
	}
	
	public void setTaskno(String taskno) {
		this.taskno = taskno;
	}

   
	@Column(name = "TASKDATE", length = 8 ,   nullable = false)
	private String taskdate;
	
	public String getTaskdate() {
		return taskdate;
	}
	
	public void setTaskdate(String taskdate) {
		this.taskdate = taskdate;
	}

   
	@Column(name = "TASKTYPE",    nullable = false)
	private Integer tasktype;
	
	public Integer getTasktype() {
		return tasktype;
	}
	
	public void setTasktype(Integer tasktype) {
		this.tasktype = tasktype;
	}

   
	@Column(name = "DEVICETYPE",    nullable = false)
	private Integer devicetype;
	
	public Integer getDevicetype() {
		return devicetype;
	}
	
	public void setDevicetype(Integer devicetype) {
		this.devicetype = devicetype;
	}

   
	@Column(name = "TERMSN", length = 14 ,   nullable = false)
	private String termsn;
	
	public String getTermsn() {
		return termsn;
	}
	
	public void setTermsn(String termsn) {
		this.termsn = termsn;
	}

   
	@Column(name = "TASKDATA", length = 2147483647 ,   nullable = true)
	private byte[] taskdata;
	
	public byte[] getTaskdata() {
		return taskdata;
	}
	
	public void setTaskdata(byte[] taskdata) {
		this.taskdata = taskdata;
	}

   
	@Column(name = "TIMEOUT",    nullable = false)
	private Integer timeout;
	
	public Integer getTimeout() {
		return timeout;
	}
	
	public void setTimeout(Integer timeout) {
		this.timeout = timeout;
	}

   
	@Column(name = "RETRYCOUNT",    nullable = false)
	private Integer retrycount;
	
	public Integer getRetrycount() {
		return retrycount;
	}
	
	public void setRetrycount(Integer retrycount) {
		this.retrycount = retrycount;
	}

   
	@Column(name = "TICKSECEND",    nullable = true)
	private Integer ticksecend;
	
	public Integer getTicksecend() {
		return ticksecend;
	}
	
	public void setTicksecend(Integer ticksecend) {
		this.ticksecend = ticksecend;
	}

   
	@Column(name = "EXECUTECOUNT",    nullable = false)
	private Integer executecount;
	
	public Integer getExecutecount() {
		return executecount;
	}
	
	public void setExecutecount(Integer executecount) {
		this.executecount = executecount;
	}

   
	@Column(name = "EXECUTETIME",    nullable = true)
	@JsonSerialize(using = DateTimeSerializer.class)
	private Date executetime;
	
	public Date getExecutetime() {
		return executetime;
	}
	
	public void setExecutetime(Date executetime) {
		this.executetime = executetime;
	}

   
	@Column(name = "EXECUTERESULT",    nullable = true)
	private Boolean executeresult;
	
	public Boolean getExecuteresult() {
		return executeresult;
	}
	
	public void setExecuteresult(Boolean executeresult) {
		this.executeresult = executeresult;
	}

   
	@Column(name = "EXECUTEIMMEDIATELY",    nullable = true)
	private Boolean executeimmediately;
	
	public Boolean getExecuteimmediately() {
		return executeimmediately;
	}
	
	public void setExecuteimmediately(Boolean executeimmediately) {
		this.executeimmediately = executeimmediately;
	}

   
	@Column(name = "ISTASKOVER",    nullable = true)
	private Boolean istaskover;
	
	public Boolean getIstaskover() {
		return istaskover;
	}
	
	public void setIstaskover(Boolean istaskover) {
		this.istaskover = istaskover;
	}

   
	@Column(name = "RESULTMSG", length = 1000 ,   nullable = true)
	private String resultmsg;
	
	public String getResultmsg() {
		return resultmsg;
	}
	
	public void setResultmsg(String resultmsg) {
		this.resultmsg = resultmsg;
	}

   
	@Column(name = "USER_ID", length = 36 ,   nullable = true)
	private String userId;
	
	public String getUserId() {
		return userId;
	}
	
	public void setUserId(String userId) {
		this.userId = userId;
	}

    @Formula("(SELECT A.TERMNAME FROM dbo.PT_TERM A WHERE A.TERMSN=TERMSN)")
	@FieldInfo(name = "设备名称")
	private String termName;

	public String getTermName() {
		return termName;
	}

	public void setTermName(String termName) {
		this.termName = termName;
	}
    
    
    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}

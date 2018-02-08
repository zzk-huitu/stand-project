package com.zd.school.build.allot.model;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;

@Entity
@Table(name = "DORM_T_STUDENTREMOVE")
@AttributeOverride(name = "uuid", column = @Column(name = "UUID", length = 36, nullable = false) )
public class DormStudentRemove extends BaseEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@FieldInfo(name = "班级宿舍主键")
	@Column(name = "CDORM_ID", length = 36, nullable = true)
	private String cdormId;
	
	@FieldInfo(name = "房间主键")
	@Column(name = "ROOM_ID", length = 36, nullable = true)
	private String roomId;
	
	@FieldInfo(name = "学生主键")
	@Column(name = "STU_ID", length = 50, nullable = true)
	private String stuId;
	
	@FieldInfo(name = "操作类型")
	@Column(name = "OPERA_TYPE", length = 36, nullable = true)
	private String operaType;
	
	@FieldInfo(name = "是否处理")
	@Column(name = "ISHANDLE", length = 36, nullable = true)
	private String isHandle;
	
	@FieldInfo(name = "金额")
    @Column(name = "AMOUNT", length = 18, nullable = true)
    private BigDecimal amount;

	public String getCdormId() {
		return cdormId;
	}

	public void setCdormId(String cdormId) {
		this.cdormId = cdormId;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getStuId() {
		return stuId;
	}

	public void setStuId(String stuId) {
		this.stuId = stuId;
	}

	public String getOperaType() {
		return operaType;
	}

	public void setOperaType(String operaType) {
		this.operaType = operaType;
	}

	public String getIsHandle() {
		return isHandle;
	}

	public void setIsHandle(String isHandle) {
		this.isHandle = isHandle;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
}

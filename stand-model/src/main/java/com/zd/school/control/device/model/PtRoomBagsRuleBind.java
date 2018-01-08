package com.zd.school.control.device.model;

import java.io.Serializable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;
import com.zd.school.excel.annotation.MapperCell;

/**
 * 钱包规则费率绑定
 * 
 * @author hucy
 *
 */
@Entity
@Table(name = "PT_ROOM_BAGSRULEBIND")
@AttributeOverride(name = "uuid", column = @Column(name = "BIND_ID", length = 36, nullable = false))
public class PtRoomBagsRuleBind extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "房间ID")
	@Column(name = "ROOM_ID", length = 36, nullable = true)
	private String roomId;

	@FieldInfo(name = "钱包规则费率绑定ID")
	@Column(name = "ROOMRULE_ID", length = 36, nullable = true)
	private String roomRuleId;

	@FieldInfo(name = "指定扣费模式下扣费的用户ID")
	@Column(name = "DEDUCTION_USER_ID", length = 36, nullable = true)
	private String deductionUserId;

	
	@MapperCell(cellName="学号")
	@FieldInfo(name = "学号")
	@Formula("(SELECT A.USER_NUMB FROM dbo.SYS_T_USER A WHERE A.USER_ID=DEDUCTION_USER_ID)")
	private String userNumb;

	@MapperCell(cellName="学生姓名")
	@Formula("(SELECT A.XM FROM dbo.SYS_T_USER A WHERE A.USER_ID=DEDUCTION_USER_ID)")
	@FieldInfo(name = "姓名")
	private String xm;
	
	@MapperCell(cellName="房间名称")
	@FieldInfo(name = "房间名称")
	@Formula("(SELECT A.ROOM_NAME FROM dbo.BUILD_T_ROOMINFO A WHERE A.ROOM_ID=ROOM_ID)")
	private String roomName;
	
	
	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomRuleId() {
		return roomRuleId;
	}

	public void setRoomRuleId(String roomRuleId) {
		this.roomRuleId = roomRuleId;
	}

	public String getDeductionUserId() {
		return deductionUserId;
	}

	public void setDeductionUserId(String deductionUserId) {
		this.deductionUserId = deductionUserId;
	}

	public String getUserNumb() {
		return userNumb;
	}

	public void setUserNumb(String userNumb) {
		this.userNumb = userNumb;
	}

	public String getXm() {
		return xm;
	}

	public void setXm(String xm) {
		this.xm = xm;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	
	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
}
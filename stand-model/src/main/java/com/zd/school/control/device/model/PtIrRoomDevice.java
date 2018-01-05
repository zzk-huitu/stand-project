package com.zd.school.control.device.model;

import java.io.Serializable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;

/**
 * 
 * ClassName: PtIrRoomDevice 
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 房间红外设备(PT_IR_ROOM_DEVICE)实体类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
 
@Entity
@Table(name = "PT_IR_ROOM_DEVICE")
@AttributeOverride(name = "uuid", column = @Column(name = "DEVICE_ID", length = 36, nullable = false))
public class PtIrRoomDevice extends BaseEntity implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @FieldInfo(name = "房间编号")
    @Column(name = "ROOM_ID", length = 36, nullable = false)
    private String roomId;
    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
    public String getRoomId() {
        return roomId;
    }
        
    @FieldInfo(name = "型号编号")
    @Column(name = "BRAND_ID", length = 36, nullable = false)
    private String brandId;
    
    @FieldInfo(name = "备注")
    @Column(name = "NOTES", length = 1000, nullable = true)
    private String notes;
    
    @Formula("(SELECT A.ROOM_NAME FROM dbo.BUILD_T_ROOMINFO A WHERE A.ROOM_ID=ROOM_ID)")
	@FieldInfo(name = "房间名称")
	private String roomName;
    
    @Formula("(SELECT A.PRODUCTMODEL FROM dbo.PT_IR_DEVICE_BRAND A WHERE A.BRAND_ID=BRAND_ID)")
   	@FieldInfo(name = "型号名称")
   	private String deviceTypeCode;
    
    @Formula("(SELECT A.BRANDNAME FROM dbo.PT_IR_DEVICE_BRAND A WHERE A.BRAND_ID=BRAND_ID)")
   	@FieldInfo(name = "品牌名称")
   	private String deviceBrandName;	//zzk新加入
    
    @Formula("(select B.BRANDNAME from dbo.PT_IR_DEVICE_BRAND B where B.BRAND_ID=("
    		+ "	SELECT A.DEVICETYPECODE FROM dbo.PT_IR_DEVICE_BRAND A WHERE A.BRAND_ID=BRAND_ID"
    		+ "))")
   	@FieldInfo(name = "产品类型名称")
   	private String deviceTypeName;	//zzk新加入
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    public String getNotes() {
        return notes;
    }
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}
	public String getBrandId() {
		return brandId;
	}
	public void setBrandId(String brandId) {
		this.brandId = brandId;
	}
	public String getDeviceTypeCode() {
		return deviceTypeCode;
	}
	public void setDeviceTypeCode(String deviceTypeCode) {
		this.deviceTypeCode = deviceTypeCode;
	}
	public String getDeviceBrandName() {
		return deviceBrandName;
	}
	public void setDeviceBrandName(String deviceBrandName) {
		this.deviceBrandName = deviceBrandName;
	}
	public String getDeviceTypeName() {
		return deviceTypeName;
	}
	public void setDeviceTypeName(String deviceTypeName) {
		this.deviceTypeName = deviceTypeName;
	}
	
	
	
	
    /** 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加 
    *@Transient
    *@FieldInfo(name = "")
    *private String field1;
    */
}
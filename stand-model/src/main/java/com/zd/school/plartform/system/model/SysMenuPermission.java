
package com.zd.school.plartform.system.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.AttributeOverride;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.BaseEntity;

/**
 * 
 * ClassName: BaseTPerimisson Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 菜单功能权限表实体类. date: 2016-07-17
 * 权限ID、菜单ID、权限名称、按钮ref别名、权限接口、备注、菜单编码（查询出来）
 * 
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

@Entity
@Table(name = "SYS_T_MENUPERIMISSON")
@AttributeOverride(name = "uuid", column = @Column(name = "PER_ID", length = 36, nullable = false) )
public class SysMenuPermission extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = "菜单ID")
	@Column(name = "MENU_ID", length = 36, nullable = false)
	private String menuId;

	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}

	public String getMenuId() {
		return menuId;
	}

	@FieldInfo(name = "权限名称")
	@Column(name = "PER_NAME", length = 36, nullable = false)
	private String perName;

	public String getPerName() {
		return perName;
	}

	public void setPerName(String perName) {
		this.perName = perName;
	}

	@FieldInfo(name = "按钮别名")
	@Column(name = "PER_BTN_NAME", length = 36, nullable = false)
	private String perBtnName;

	public String getPerBtnName() {
		return perBtnName;
	}

	public void setPerBtnName(String perBtnName) {
		this.perBtnName = perBtnName;
	}
	
	@FieldInfo(name = "权限接口前缀")
	@Column(name = "PER_AUTHCODE", length = 36, nullable = false)
	private String perAuthCode;

	public String getPerAuthCode() {
		return perAuthCode;
	}

	public void setPerAuthCode(String perAuthCode) {
		this.perAuthCode = perAuthCode;
	}
	
	@FieldInfo(name = "权限接口后缀")
	@Column(name = "PER_AUTH", length = 36, nullable = false)
	private String perAuth;

	public String getPerAuth() {
		return perAuth;
	}

	public void setPerAuth(String perAuth) {
		this.perAuth = perAuth;
	}
	
	@FieldInfo(name = "权限备注")
	@Column(name = "PER_REMARK", length = 100, nullable = false)
	private String perRemark;

	public String getPerRemark() {
		return perRemark;
	}

	public void setPerRemark(String perRemark) {
		this.perRemark = perRemark;
	}
	
	@FieldInfo(name = "菜单名称")
	@Formula("(SELECT a.NODE_TEXT FROM SYS_T_MENU a WHERE a.MENU_ID=MENU_ID)")
	private String menuText;

	public String getMenuText() {
		return menuText;
	}

	public void setMenuText(String menuText) {
		this.menuText = menuText;
	}
	
	@FieldInfo(name = "菜单编码")
	@Formula("(SELECT a.MENU_CODE FROM SYS_T_MENU a WHERE a.MENU_ID=MENU_ID)")
	private String menuCode;

	public String getMenuCode() {
		return menuCode;
	}

	public void setMenuCode(String menuCode) {
		this.menuCode = menuCode;
	}
	

	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
}
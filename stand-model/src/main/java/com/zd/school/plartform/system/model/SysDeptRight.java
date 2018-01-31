package com.zd.school.plartform.system.model;

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
 * ClassName: SysDeptright Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 用户权限部门(SYS_T_DEPTRIGHT)实体类. date: 2017-04-06
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

@Entity
@Table(name = "SYS_T_DEPTRIGHT")
@AttributeOverride(name = "uuid", column = @Column(name = "RIGHTDEPT_ID", length = 36, nullable = false))
public class SysDeptRight extends BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@FieldInfo(name = " 部门ID")
	@Column(name = "DEPT_ID", length = 36, nullable = true)
	private String deptId;

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptId() {
		return deptId;
	}

	@FieldInfo(name = "用户ID")
	@Column(name = "USER_ID", length = 36, nullable = true)
	private String userId;

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserId() {
		return userId;
	}

	@FieldInfo(name = "权限来源 0-自动生成 1-手工设置")
	@Column(name = "RIGHT_SOURCE", nullable = false)
	private Integer rightSource;

	public Integer getRightSource() {
		return rightSource;
	}

	public void setRightSource(Integer rightSource) {
		this.rightSource = rightSource;
	}

	@FieldInfo(name = "主部门名称")
    @Formula("(SELECT ISNULL(a.NODE_TEXT,'') FROM BASE_T_ORG a WHERE a.DEPT_ID = DEPT_ID)")
    private String deptName;

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }
	/**
	 * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
	 * 
	 * @Transient
	 * @FieldInfo(name = "") private String field1;
	 */
}
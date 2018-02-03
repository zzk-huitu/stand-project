/**
 * Project Name:school-model
 * File Name:BaseOrgChkTree.java
 * Package Name:com.zd.school.plartform.baseset.model
 * Date:2016年10月10日下午7:33:16
 * Copyright (c) 2016 ZDKJ All Rights Reserved.
 *
*/

package com.zd.school.plartform.baseset.model;

import java.util.List;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.extjs.ExtTreeNodeChk;

/**
 * ClassName:BaseOrgChkTree Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON. Date: 2016年10月10日 下午7:33:16
 * 
 * @author luoyibo
 * @version
 * @since JDK 1.8
 * @see
 */
public class BaseOrgChkTree extends ExtTreeNodeChk<BaseOrgChkTree> {
	
	@FieldInfo(name = "部门编码")
	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@FieldInfo(name = "外线电话")
	private String outPhone;

	public String getOutPhone() {
		return outPhone;
	}

	public void setOutPhone(String outPhone) {
		this.outPhone = outPhone;
	}

	@FieldInfo(name = "内线电话")
	private String inPhone;

	public String getInPhone() {
		return inPhone;
	}

	public void setInPhone(String inPhone) {
		this.inPhone = inPhone;
	}

	@FieldInfo(name = "传真")
	private String fax;

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	@FieldInfo(name = "是否系统内置")
	private Integer isSystem;

	public Integer getIsSystem() {
		return isSystem;
	}

	public void setIsSystem(Integer isSystem) {
		this.isSystem = isSystem;
	}

	@FieldInfo(name = "备注")
	private String remark;

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@FieldInfo(name = "上级部门")
	private String parent;

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	@FieldInfo(name = "排序字段")
	private Integer orderIndex;

	public Integer getOrderIndex() {
		return orderIndex;
	}

	public void setOrderIndex(Integer orderIndex) {
		this.orderIndex = orderIndex;
	}

	@FieldInfo(name = "部门类型")
	private String deptType;

	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	@FieldInfo(name = "上级部门类型")
	private String parentType;

	public String getParentType() {
		return parentType;
	}

	public void setParentType(String parentType) {
		this.parentType = parentType;
	}

	@FieldInfo(name = "主负责岗位名称")
	private String mainLeaderName;

	public String getMainLeaderName() {
		return mainLeaderName;
	}

	public void setMainLeaderName(String mainLeaderName) {
		this.mainLeaderName = mainLeaderName;
	}

	@FieldInfo(name = "部门全称")  
    private String allDeptName;

    public String getAllDeptName() {
        return allDeptName;
    }
    public void setAllDeptName(String allDeptName) {
        this.allDeptName = allDeptName;
    }
    
    @FieldInfo(name = "上级主管部门") 
    private String superDept;

    public String getSuperDept() {
        return superDept;
    }
    public void setSuperDept(String superDept) {
        this.superDept = superDept;
    }

    @FieldInfo(name = "上级主管部门名称")
    private String superdeptName;

    public String getSuperdeptName() {
        return superdeptName;
    }
    public void setSuperdeptName(String superdeptName) {
        this.superdeptName = superdeptName;
    }
    
	@FieldInfo(name = "上级主管岗位")
	private String superJob;

	public String getSuperJob() {
		return superJob;
	}

	public void setSuperJob(String superJob) {
		this.superJob = superJob;
	}

	@FieldInfo(name = "上级主管岗位名称")
	private String superjobName;

	public String getSuperjobName() {
		return superjobName;
	}

	public void setSuperjobName(String superjobName) {
		this.superjobName = superjobName;
	}

	@FieldInfo(name = "是否有权限")
	private String isRight;

	public String getIsRight() {
		return isRight;
	}

	public void setIsRight(String isRight) {
		this.isRight = isRight;
	}
	
	 /*2017-10-20新加入*/
    @FieldInfo(name = "学段编码")  
    private String sectionCode;

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getSectionCode() {
        return sectionCode;
    }
    /*2017-10-20新加入*/
    @FieldInfo(name = "年级")
    private String nj;

    public String getNj() {
        return nj;
    }

    public void setNj(String nj) {
        this.nj = nj;
    }
    
    
    public BaseOrgChkTree() {
    	super();
	}
    
	public BaseOrgChkTree(String id, List<BaseOrgChkTree> children) {

		super(id, children);
		// TODO Auto-generated constructor stub

	}

	public BaseOrgChkTree(String id, String text, String iconCls, Boolean leaf, Integer level, String treeid,
			List<BaseOrgChkTree> children, String outPhone, String inPhone, String fax, Integer isSystem, String remark,
			String code, String parent, Integer orderIndex, String deptType, String parentType, String mainLeaderName,
			String superJob, String superjobName, String isRight,Boolean checked) {

		super(id, text, iconCls, leaf, level, treeid, children,checked);
		// TODO Auto-generated constructor stub

		this.outPhone = outPhone;
		this.inPhone = inPhone;
		this.fax = fax;
		this.isSystem = isSystem;
		this.remark = remark;
		this.code = code;
		this.parent = parent;
		this.orderIndex = orderIndex;
		this.deptType = deptType;
		this.parentType = parentType;
		this.mainLeaderName = mainLeaderName;
		this.superJob = superJob;
		this.superjobName = superjobName;
		this.isRight = isRight;
	}

	public BaseOrgChkTree(String id, String text, String iconCls, Boolean leaf, Integer level, String treeid,
			List<BaseOrgChkTree> children, String outPhone, String inPhone, String fax, Integer isSystem, String remark,
			String code, String parent, Integer orderIndex, String deptType, String parentType, String mainLeaderName,
			String superJob, String superjobName, String isRight,String nj, String sectionCode,Boolean checked) {

		super(id, text, iconCls, leaf, level, treeid, children,checked);
		// TODO Auto-generated constructor stub

		this.outPhone = outPhone;
		this.inPhone = inPhone;
		this.fax = fax;
		this.isSystem = isSystem;
		this.remark = remark;
		this.code = code;
		this.parent = parent;
		this.orderIndex = orderIndex;
		this.deptType = deptType;
		this.parentType = parentType;
		this.mainLeaderName = mainLeaderName;
		this.superJob = superJob;
		this.superjobName = superjobName;
		this.isRight = isRight;
		this.nj=nj;
		this.sectionCode=sectionCode;
	}
}

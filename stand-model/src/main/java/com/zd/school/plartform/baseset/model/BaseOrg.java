package com.zd.school.plartform.baseset.model;

import java.io.Serializable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.TreeNodeEntity;

/**
 * 
 * ClassName: BaseOrg Function: TODO ADD FUNCTION. Reason: TODO ADD REASON(可选).
 * Description: BASE_T_ORG实体类. date: 2016-07-26
 * saveEntity.setExtField01(courseId); // 对于部门是学科时，绑定已有学科对应的ID
 * ExtField04	副ID
 * ExtField05	父级副ID
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */

@Entity
@Table(name = "BASE_T_ORG")
@AttributeOverride(name = "uuid", column = @Column(name = "DEPT_ID", length = 36, nullable = false))
public class BaseOrg extends TreeNodeEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @FieldInfo(name = "传真")
    @Column(name = "FAX", length = 64, nullable = true)
    private String fax;

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getFax() {
        return fax;
    }

    @FieldInfo(name = "内线电话")
    @Column(name = "IN_PHONE", length = 64, nullable = true)
    private String inPhone;

    public void setInPhone(String inPhone) {
        this.inPhone = inPhone;
    }

    public String getInPhone() {
        return inPhone;
    }

    @FieldInfo(name = "是否系统内置 1-系统内置 0-非系统内置")
    @Column(name = "ISSYSTEM", length = 10, nullable = true)
    private Integer issystem;

    public void setIssystem(Integer issystem) {
        this.issystem = issystem;
    }

    public Integer getIssystem() {
        return issystem;
    }

//	@FieldInfo(name = "主负责岗位")
//	@Column(name = "MAIN_LEADER", length = 64, nullable = true)
//	private String mainLeader;
//
//	public void setMainLeader(String mainLeader) {
//		this.mainLeader = mainLeader;
//	}
//
//	public String getMainLeader() {
//		return mainLeader;
//	}

    @FieldInfo(name = "外线电话")
    @Column(name = "OUT_PHONE", length = 64, nullable = true)
    private String outPhone;

    public void setOutPhone(String outPhone) {
        this.outPhone = outPhone;
    }

    public String getOutPhone() {
        return outPhone;
    }
    
    /*2017-10-20新加入*/
    @FieldInfo(name = "学段编码")
    @Column(name = "SECTION_CODE", length = 32, nullable = true)
    private String sectionCode;

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getSectionCode() {
        return sectionCode;
    }
    /*2017-10-20新加入*/
    @FieldInfo(name = "年级")
    @Column(name = "NJ", length = 32, nullable = true)
    private String nj;

    public String getNj() {
        return nj;
    }

    public void setNj(String nj) {
        this.nj = nj;
    }
    

    @FieldInfo(name = "备注")
    @Column(name = "REMARK", length = 255, nullable = true)
    private String remark;

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getRemark() {
        return remark;
    }
    
    @FieldInfo(name = "副负责岗位")
	@Column(name = "VICE_LEADER", length = 64, nullable = true)
	private String viceLeader;

	public void setViceLeader(String viceLeader) {
		this.viceLeader = viceLeader;
	}

	public String getViceLeader() {
		return viceLeader;
	}

    @FieldInfo(name = "部门类型 01-学校 02-校区 03-部门  04-年级  05-班级　06-学科")
    @Column(name = "DEPT_TYPE", length = 36, nullable = true)
    private String deptType;

    public void setDeptType(String deptType) {
        this.deptType = deptType;
    }

    public String getDeptType() {
        return deptType;
    }

    @FieldInfo(name = "上级主管部门")
    @Column(name = "SUPER_DEPT", length = 64, nullable = true)
    private String superDept;

    public String getSuperDept() {
        return superDept;
    }

    @FieldInfo(name = "上级主管部门名称")
    @Column(name = "SUPERDEPT_NAME", length = 64, nullable = true)
    private String superdeptName;

    public String getSuperdeptName() {
        return superdeptName;
    }

    public void setSuperdeptName(String superdeptName) {
        this.superdeptName = superdeptName;
    }

    public void setSuperDept(String superDept) {
        this.superDept = superDept;
    }

    @FieldInfo(name = "上级主管岗位")
    @Column(name = "SUPER_JOB", length = 64, nullable = true)
    private String superJob;

    public String getSuperJob() {
        return superJob;
    }

    public void setSuperJob(String superJob) {
        this.superJob = superJob;
    }

    @FieldInfo(name = "上级主管岗位名称")
    @Column(name = "SUPERJOB_NAME", length = 64, nullable = true)
    private String superjobName;

    public String getSuperjobName() {
        return superjobName;
    }

    public void setSuperjobName(String superjobName) {
        this.superjobName = superjobName;
    }

    @FieldInfo(name = "部门全称")
    @Column(name = "ALL_DEPTNAME", length = 500, nullable = true)
    //@Formula("(SELECT isnull(a.ALL_DEPTNAME+'/','')+NODE_TEXT FROM BASE_T_ORG a WHERE a.DEPT_ID=PARENT_NODE)")
    private String allDeptName;

    public String getAllDeptName() {
        return allDeptName;
    }
    
    public void setAllDeptName(String allDeptName) {
        this.allDeptName = allDeptName;
    }
    public BaseOrg() {

        super();
        // TODO Auto-generated constructor stub

    }

    public BaseOrg(String uuid) {

        super(uuid);
        // TODO Auto-generated constructor stub

    }

    /**
     * 以下为不需要持久化到数据库中的字段,根据项目的需要手工增加
     * 
     * @Transient
     * @FieldInfo(name = "") private String field1;
     */
    @FieldInfo(name = "上级部门名称")
    @Formula("(SELECT isnull(a.NODE_TEXT,'ROOT') FROM BASE_T_ORG a WHERE a.DEPT_ID=PARENT_NODE)")
    private String parentName;

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    @FieldInfo(name = "上级部门类型")
    @Formula("(SELECT isnull(a.DEPT_TYPE,'01') FROM BASE_T_ORG a WHERE a.DEPT_ID=parent_node)")
    private String parentType;

    public String getParentType() {
        return parentType;
    }

    public void setParentType(String parentType) {
        this.parentType = parentType;
    }


	@FieldInfo(name = "主负责岗位名称")
	@Formula("(SELECT a.JOB_NAME FROM BASE_T_DEPTJOB a WHERE a.JOB_TYPE=0 and a.DEPT_ID=DEPT_ID)")
	private String mainLeaderName;

	public String getMainLeaderName() {
		return mainLeaderName;
	}

	public void setMainLeaderName(String mainLeaderName) {
		this.mainLeaderName = mainLeaderName;
	}	

}
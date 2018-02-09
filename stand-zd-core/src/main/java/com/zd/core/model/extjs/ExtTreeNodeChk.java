/**
 * Project Name:zd-core
 * File Name:ExtTreeNodeChk.java
 * Package Name:com.zd.core.model.extjs
 * Date:2016年7月21日下午5:20:22
 * Copyright (c) 2016 ZDKJ All Rights Reserved.
 *
*/

package com.zd.core.model.extjs;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * ClassName:ExtTreeNodeChk 带checkbox的Ext树节点 数据结构 REASON. Date: 2016年7月21日
 * 下午5:20:22
 * 
 * @author luoyibo
 * @version
 * @since JDK 1.8
 * @see
 */
public class ExtTreeNodeChk<T> implements Serializable{
	private static final long serialVersionUID = 1L;
	
    /** 节点ID */
    public String id;

    /** 节点文本 */
    public String text;

    /** 节点样式 */
    public String iconCls;

    /** 是否叶节点 */
    public Boolean leaf;

    /** 节点层级 */
    public Integer level;
    
    /** 各级上级节点ID组 */
    public String treeid;
    
    /** 上级节点ID */
	private String parent;
	
	/** 同级别排序号 */
	private Integer orderIndex;
    /**
     * 是否选中
     */
    private Boolean checked;

    /** 子节点清单 */
    private List<T> children = new ArrayList<T>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public Boolean getLeaf() {
        return leaf;
    }

    public void setLeaf(Boolean leaf) {
        this.leaf = leaf;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getTreeid() {
        return treeid;
    }

    public void setTreeid(String treeid) {
        this.treeid = treeid;
    }

    public List<T> getChildren() {
        return children;
    }

    public void setChildren(List<T> children) {
        this.children = children;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    public ExtTreeNodeChk() {
        super();
    }
    
    

    public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Integer getOrderIndex() {
		return orderIndex;
	}

	public void setOrderIndex(Integer orderIndex) {
		this.orderIndex = orderIndex;
	}

	
	public ExtTreeNodeChk(String id, List<T> children) {
        super();
        this.id = id;
        this.children = children;
    }

    public ExtTreeNodeChk(String id, String text, String iconCls, Boolean leaf, Integer level, String treeid,
            List<T> children, Boolean checked) {
        super();
        this.id = id;
        this.text = text;
        this.iconCls = iconCls;
        this.leaf = leaf;
        this.level = level;
        this.treeid = treeid;
        this.children = children;
        this.checked = checked;
    }

	public ExtTreeNodeChk(String id, String text, String iconCls, Boolean leaf, Integer level, String treeid,
			String parent, Integer orderIndex, Boolean checked, List<T> children) {
		super();
		this.id = id;
		this.text = text;
		this.iconCls = iconCls;
		this.leaf = leaf;
		this.level = level;
		this.treeid = treeid;
		this.parent = parent;
		this.orderIndex = orderIndex;
		this.checked = checked;
		this.children = children;
	}

    
}

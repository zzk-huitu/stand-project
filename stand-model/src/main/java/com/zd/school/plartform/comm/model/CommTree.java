/**
 * Project Name:school-model
 * File Name:GradeTree.java
 * Package Name:com.zd.school.plartform.comm.model
 * Date:2016年8月23日下午1:53:51
 * Copyright (c) 2016 ZDKJ All Rights Reserved.
 *
*/

package com.zd.school.plartform.comm.model;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.extjs.ExtTreeNode;

import java.util.List;

/**
 * ClassName:GradeTree Function: TODO ADD FUNCTION. Reason: TODO ADD REASON.
 * Date: 2016年8月23日 下午1:53:51
 * 
 * @author luoyibo
 * @version
 * @since JDK 1.8
 * @see
 */
public class CommTree extends ExtTreeNode<CommTree> {
	
	@FieldInfo(name = "节点类型")
	private String nodeType;

	public String getNodeType() {
		return nodeType;
	}

	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}
	
    public CommTree() {

        super();
        // TODO Auto-generated constructor stub

    }

    public CommTree(String id, List<CommTree> children) {

        super(id, children);
        // TODO Auto-generated constructor stub

    }

    public CommTree(String id, String text, String iconCls, Boolean leaf, Integer level, String treeid, String parent,Integer orderIndex,
            List<CommTree> children) {

        super(id, text, iconCls, leaf, level, treeid,parent,orderIndex, children);
    }

}

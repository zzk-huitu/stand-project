package com.zd.school.plartform.comm.model;

import java.util.List;

import com.zd.core.annotation.FieldInfo;
import com.zd.core.model.extjs.ExtTreeNodeChk;

/**
 * ClassName:GradeTree Function: TODO ADD FUNCTION. Reason: TODO ADD REASON.
 * Date: 2016年8月23日 下午1:53:51
 * 
 * @author luoyibo
 * @version
 * @since JDK 1.8
 * @see
 */
public class CommTreeChk extends ExtTreeNodeChk<CommTreeChk> {
    /** 上级层次 */
    public String parent;

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    @FieldInfo(name = "节点类型")
	private String nodeType;

	public String getNodeType() {
		return nodeType;
	}

	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}
	
    public CommTreeChk() {

        super();
        // TODO Auto-generated constructor stub

    }

    public CommTreeChk(String id, List<CommTreeChk> children) {

        super(id, children);
        // TODO Auto-generated constructor stub

    }

    public CommTreeChk(String id, String text, String iconCls, Boolean leaf, Integer level, String treeid,
            List<CommTreeChk> children, String parent,Boolean checked) {

        super(id, text, iconCls, leaf, level, treeid, children,checked);
        // TODO Auto-generated constructor stub
        this.parent = parent;
    }

}

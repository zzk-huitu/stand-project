package com.zd.school.plartform.comm.service.Impl;

import com.zd.core.constant.TreeVeriable;
import com.zd.core.model.BaseEntity;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.comm.dao.CommTreeDao;
import com.zd.school.plartform.comm.model.*;
import com.zd.school.plartform.comm.service.CommTreeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * ClassName: FacultyClassitemServiceImpl Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: 数据字典项实体Service接口实现类. date: 2016-07-19
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class CommTreeServiceImpl extends BaseServiceImpl<BaseEntity> implements CommTreeService {

    @Resource
    public void setDao(CommTreeDao dao) {
        this.dao = dao;
    }

    @Override
    public List<FacultyClassTree> getFacultyClassTree(String whereSql) {

        String sql = "select id,text,iconCls,leaf,level,parent from EDU_V_FACULTYCLASS_TREE where 1=1 " + whereSql;
        List<FacultyClass> lists = this.queryEntityBySql(sql, FacultyClass.class);

        List<FacultyClassTree> result = new ArrayList<FacultyClassTree>();

        // 构建Tree数据
        createFacultyClassChild(new FacultyClassTree(TreeVeriable.ROOT, new ArrayList<FacultyClassTree>()), result,
                lists);

        return result;
    }

    private void createFacultyClassChild(FacultyClassTree parentNode, List<FacultyClassTree> result,
            List<FacultyClass> list) {
        List<FacultyClass> childs = new ArrayList<FacultyClass>();
        for (FacultyClass dic : list) {
            if (dic.getParent().equals(parentNode.getId())) {
                childs.add(dic);
            }
        }
        // public FacultyClassTree(String id, String text, String iconCls,
        // Boolean leaf, Integer level, String treeid,
        // List<FacultyClassTree> children, String parent) {
        for (FacultyClass fc : childs) {
            FacultyClassTree child = new FacultyClassTree(fc.getId(), fc.getText(), fc.getIconCls(),
                    Boolean.parseBoolean(fc.getLeaf().toString()), fc.getLevel(), "", fc.getParent(),0,new ArrayList()
                    );

            if (fc.getParent().equals(TreeVeriable.ROOT)) {
                result.add(child);
            } else {
                List<FacultyClassTree> trees = parentNode.getChildren();
                trees.add(child);
                parentNode.setChildren(trees);
            }
            createFacultyClassChild(child, result, list);
        }
    }

    @Override
    public List<CommTree> getCommTree(String treeView, String whereSql) {

        String sql = "select id,text,iconCls,leaf,level,parent from " + treeView + " where 1=1 " + whereSql;

        List<CommBase> lists = this.queryEntityBySql(sql, CommBase.class);

        List<CommTree> result = new ArrayList<CommTree>();

        // 构建Tree数据
        createTreeChild(new CommTree(TreeVeriable.ROOT, new ArrayList<CommTree>()), result, lists);

        return result;
    }

    public void createTreeChild(CommTree parentNode, List<CommTree> result, List<CommBase> list) {
        List<CommBase> childs = new ArrayList<CommBase>();
        for (CommBase dic : list) {
            if (dic.getParent().equals(parentNode.getId())) {
                childs.add(dic);
            }
        }

        for (CommBase fc : childs) {
            CommTree child = new CommTree(fc.getId(), fc.getText(), fc.getIconCls(), Boolean.parseBoolean(fc.getLeaf()),
                    fc.getLevel(), "", fc.getParent(),0, new ArrayList<CommTree>());

            if (fc.getParent().equals(TreeVeriable.ROOT)) {
                result.add(child);
            } else {
                List<CommTree> trees = parentNode.getChildren();
                trees.add(child);
                parentNode.setChildren(trees);
            }
            createTreeChild(child, result, list);
        }
    }

    @Override
    public List<UpGradeRule> getUpGradeRuleList() {

        String sql = "select beforeName,afterName,upDirect from base_t_upgraderule";
        List<UpGradeRule> lists = this.queryEntityBySql(sql, UpGradeRule.class);
        return lists;
    }
    
	@Override
	public CommTree getGradeCommTree(String sql, String rootId) {
		List<CommTree> list = this.getCommTreeList(sql);
		CommTree root = new CommTree();
		for (CommTree node : list) {
			if (!(StringUtils.isNotEmpty(node.getParent()) && !node.getId().equals(rootId))) {
				root = node;
				list.remove(node);
				break;
			}
		}
		createGradeTreeChildren(list, root);
		return root;
	}
	
	@Override
	public List<CommTree> getCommTreeList(String sql) {
		List<CommTree> chilrens = new ArrayList<CommTree>();
		CommTree node = null;
		List<Object[]> alist = this.queryObjectBySql(sql);

		for (int i = 0; i < alist.size(); i++) {
			Object[] obj = (Object[]) alist.get(i);
			node = new CommTree();
			node.setId((String) obj[0]);
			node.setText((String) obj[1]);
			node.setIconCls((String) obj[2]);

			if ((Boolean) obj[3]) {
				node.setLeaf(true);
			} else {
				node.setLeaf(false);
			}
			node.setLevel((Integer) obj[4]);
			node.setTreeid((String) obj[5]);
			node.setParent((String) obj[6]);
			node.setOrderIndex((Integer) obj[7]);
			node.setNodeType((String) obj[8]);
			//node.setChecked(false);
			chilrens.add(node);
		}
		return chilrens;
	}
	private void createGradeTreeChildren(List<CommTree> childrens, CommTree root) {
		String parentId = root.getId();
		for (int i = 0; i < childrens.size(); i++) {
			CommTree node = childrens.get(i);
			if (StringUtils.isNotEmpty(node.getParent()) && node.getParent().equals(parentId)) {
				root.getChildren().add(node);
				createGradeTreeChildren(childrens, node);
			}
			if (i == childrens.size() - 1) {
				if (root.getChildren().size() < 1) {
					root.setLeaf(true);
				}
				return;
			}
		}
	}
	
	@Override
	public List<CommTreeChk> getCommTreeChk(String treeView, String whereSql) {

		String sql = "select id,text,iconCls,leaf,level,parent from " + treeView + " where 1=1 " + whereSql;

		List<CommBase> lists = this.queryEntityBySql(sql, CommBase.class);

		List<CommTreeChk> result = new ArrayList<CommTreeChk>();

		// 构建Tree数据
		createTreeChildChk(new CommTreeChk(TreeVeriable.ROOT, new ArrayList<CommTreeChk>()), result, lists);

		return result;
	}

	public void createTreeChildChk(CommTreeChk parentNode, List<CommTreeChk> result, List<CommBase> list) {
		List<CommBase> childs = new ArrayList<CommBase>();
		for (CommBase dic : list) {
			if (dic.getParent().equals(parentNode.getId())) {
				childs.add(dic);
			}
		}

		for (CommBase fc : childs) {
			CommTreeChk child = new CommTreeChk(fc.getId(), fc.getText(), fc.getIconCls(),
					Boolean.parseBoolean(fc.getLeaf()), fc.getLevel(), "", new ArrayList<CommTreeChk>(), fc.getParent(),
					false);

			if (fc.getParent().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<CommTreeChk> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createTreeChildChk(child, result, list);
		}
	}
	
	/**指定根节点**/
	@Override
	public List<CommTreeChk> getCommTreeChk_CoustomRoot(String treeView, String root, String whereSql) {

		String sql = "select id,text,iconCls,leaf,level,parent from " + treeView + " where 1=1 " + whereSql;

		List<CommBase> lists = this.queryEntityBySql(sql, CommBase.class);

		CommTreeChk result =null;
		for (CommBase dic : lists) {
			if(dic.getId().equals(root)){
				result = new CommTreeChk(dic.getId(), dic.getText(), dic.getIconCls(),
						Boolean.parseBoolean(dic.getLeaf()), dic.getLevel(), "", new ArrayList<CommTreeChk>(), dic.getParent(),
						false);
			}
		}
		// 构建Tree数据
		createTreeChildChk_CoustomRoot(new CommTreeChk(root, new ArrayList<CommTreeChk>()),root, result.getChildren(), lists);
		List list= new ArrayList();
				list.add(result);
		return list;
	}
	
	private void createTreeChildChk_CoustomRoot(CommTreeChk parentNode, String root,List<CommTreeChk> result, List<CommBase> list) {
		List<CommBase> childs = new ArrayList<CommBase>();
		for (CommBase dic : list) {
			if(dic.getId().equals(root)){
				CommTreeChk child = new CommTreeChk(dic.getId(), dic.getText(), dic.getIconCls(),
						Boolean.parseBoolean(dic.getLeaf()), dic.getLevel(), "", new ArrayList<CommTreeChk>(), dic.getParent(),
						false);
			}
			if (dic.getParent().equals(parentNode.getId())) {
				childs.add(dic);
			}
		}

		for (CommBase fc : childs) {
			CommTreeChk child = new CommTreeChk(fc.getId(), fc.getText(), fc.getIconCls(),
					Boolean.parseBoolean(fc.getLeaf()), fc.getLevel(), "", new ArrayList<CommTreeChk>(), fc.getParent(),
					false);

			if (fc.getParent().equals(root)) {
				result.add(child);
			} else {
				List<CommTreeChk> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createTreeChildChk(child, result, list);
		}
	}
}
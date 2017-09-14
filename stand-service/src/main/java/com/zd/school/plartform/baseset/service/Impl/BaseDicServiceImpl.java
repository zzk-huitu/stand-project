package com.zd.school.plartform.baseset.service.Impl;

import com.zd.core.constant.TreeVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.plartform.baseset.dao.BaseDicDao;
import com.zd.school.plartform.baseset.model.BaseDic;
import com.zd.school.plartform.baseset.model.BaseDicTree;
import com.zd.school.plartform.baseset.service.BaseDicService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * ClassName: BaseDicServiceImpl Function: TODO ADD FUNCTION. Reason: TODO ADD
 * REASON(可选). Description: 数据字典实体Service接口实现类. date: 2016-07-19
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseDicServiceImpl extends BaseServiceImpl<BaseDic> implements BaseDicService {

    @Resource
    public void setBaseDicDao(BaseDicDao dao) {
        this.dao = dao;
    }

    @Override
    public List<BaseDicTree> getDicTreeList(String whereSql) {

        String hql = "from BaseDic where 1=1 " + whereSql + " order by orderIndex asc ";
        List<BaseDic> lists = this.queryByHql(hql);// 执行查询方法
        List<BaseDicTree> result = new ArrayList<BaseDicTree>();

        // 构建Tree数据
        createChild(new BaseDicTree(TreeVeriable.ROOT, new ArrayList<BaseDicTree>()), result, lists);

        return result;
    }

    private void createChild(BaseDicTree parentNode, List<BaseDicTree> result, List<BaseDic> list) {
        List<BaseDic> childs = new ArrayList<BaseDic>();
        for (BaseDic dic : list) {
            if (dic.getParentNode().equals(parentNode.getId())) {
                childs.add(dic);
            }
        }

        for (BaseDic dic : childs) {
            BaseDicTree child = new BaseDicTree(dic.getUuid(), dic.getNodeText(), "", dic.getLeaf(), dic.getNodeLevel(),
                    dic.getTreeIds(), new ArrayList<BaseDicTree>(), dic.getDicCode(), dic.getDicType(),
                    dic.getRefModel(), dic.getParentNode(), dic.getOrderIndex());

            if (dic.getParentNode().equals(TreeVeriable.ROOT)) {
                result.add(child);
            } else {
                List<BaseDicTree> trees = parentNode.getChildren();
                trees.add(child);
                parentNode.setChildren(trees);
            }
            createChild(child, result, list);
        }
    }

	@Override
	public BaseDic doAdd(BaseDic entity, String xm) {
		// TODO Auto-generated method stub

        String parentNode = entity.getParentNode();
        
		 //当前节点
        BaseDic saveEntity = new BaseDic();
        List<String> excludedProp = new ArrayList<>();
		excludedProp.add("uuid");
		try {
			BeanUtils.copyProperties(saveEntity, entity, excludedProp);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		

        // 增加时要设置创建人
		saveEntity.setCreateUser(xm); // 创建人
		saveEntity.setLeaf(true);

        //BaseDic parEntity = thisService.get(parentNode);
        if (!parentNode.equals(TreeVeriable.ROOT)) {
            BaseDic parEntity = this.get(parentNode);
            parEntity.setLeaf(false);
            this.merge(parEntity);

            saveEntity.BuildNode(parEntity);
        } else
        	saveEntity.BuildNode(null);

        // 持久化到数据库
        entity = this.merge(saveEntity);
        
		return entity;
	}


}
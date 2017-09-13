package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.TreeVeriable;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoomAreaTree;
import com.zd.school.build.define.model.BuildRoomarea;
import com.zd.school.plartform.baseset.dao.BaseRoomareaDao;
import com.zd.school.plartform.baseset.service.BaseRoomareaService;

/**
 * 
 * ClassName: BuildRoomareaServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 教室区域实体Service接口实现类. date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseRoomareaServiceImpl extends BaseServiceImpl<BuildRoomarea> implements BaseRoomareaService {

	@Resource
	public void setBuildRoomareaDao(BaseRoomareaDao dao) {
		this.dao = dao;
	}

	public List<BuildRoomAreaTree> getBuildAreaList(String whereSql) {

		String hql = "from BuildRoomarea where 1=1 ";
		if (StringUtils.isNotEmpty(whereSql))
			hql += whereSql;
		hql += " order by orderIndex asc ";
		List<BuildRoomarea> lists = this.queryByHql(hql);// 执行查询方法
		List<BuildRoomAreaTree> result = new ArrayList<BuildRoomAreaTree>();

		// 构建Tree数据
		createChild(new BuildRoomAreaTree(TreeVeriable.ROOT, new ArrayList<BuildRoomAreaTree>()), result, lists);

		return result;
	}

	private void createChild(BuildRoomAreaTree parentNode, List<BuildRoomAreaTree> result, List<BuildRoomarea> list) {
		List<BuildRoomarea> childs = new ArrayList<BuildRoomarea>();
		for (BuildRoomarea dic : list) {
			if (dic.getParentNode().equals(parentNode.getId())) {
				childs.add(dic);
			}
		}
		// public BuildRoomAreaTree(String id, String text, String iconCls,
		// Boolean leaf, Integer level, String treeid,
		// List<BuildRoomAreaTree> children, String areaCode, String areaType,
		// Integer areaStatu, String areaDesc, String areaAddr,
		// String parentArea, Integer orderIndex, Integer roomCount) {

		for (BuildRoomarea dic : childs) {
			BuildRoomAreaTree child = new BuildRoomAreaTree(dic.getUuid(), dic.getNodeText(), "", dic.getLeaf(),
					dic.getNodeLevel(), dic.getTreeIds(), new ArrayList<BuildRoomAreaTree>(), dic.getAreaCode(),
					dic.getAreaType(), dic.getAreaStatu(), dic.getAreaDesc(), dic.getAreaAddr(), dic.getParentNode(),
					dic.getOrderIndex(), dic.getRoomCount());

			if (dic.getParentNode().equals(TreeVeriable.ROOT)) {
				result.add(child);
			} else {
				List<BuildRoomAreaTree> trees = parentNode.getChildren();
				trees.add(child);
				parentNode.setChildren(trees);
			}
			createChild(child, result, list);
		}
	}

	public Integer getChildCount(String areaId) {

		String hql = " select count(*) from BuildRoomarea where isDelete=0 and parentNode='" + areaId + "'";
		Integer childCount = this.getQueryCountByHql(hql);
		// TODO Auto-generated method stub
		return childCount;
	}

	@Override
	public BuildRoomarea doAddEntity(BuildRoomarea entity, String operator) {
		// TODO Auto-generated method stub
		String parentNode = entity.getParentNode();
		BuildRoomarea perEntity = new BuildRoomarea();
		List<String> exclude = new ArrayList<String>();
		exclude.add("uuid");
		try {
			BeanUtils.copyProperties(perEntity, entity, exclude);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}

		perEntity.setCreateUser(operator); // 创建人
		perEntity.setLeaf(true);
		if (!parentNode.equals(TreeVeriable.ROOT)) {
			BuildRoomarea parEntity = this.get(parentNode);
			parEntity.setLeaf(false);
			this.merge(parEntity);
			perEntity.BuildNode(parEntity);
		} else
			perEntity.BuildNode(null);

		perEntity = this.merge(perEntity);

//		perEntity.setParentName(parentName);
//		perEntity.setAreaType(parentType);
//		perEntity.setParentNode(parentNode);

		return perEntity;
	}
	
	@Override
	public BuildRoomarea doUpdateEntity(BuildRoomarea entity, String operator, List<String> excludedProp) {
		// TODO Auto-generated method stub

        //先拿到已持久化的实体
        //entity.getSchoolId()要自己修改成对应的获取主键的方法
        BuildRoomarea perEntity = this.get(entity.getUuid());
        Boolean isLeaf = perEntity.getLeaf();
        //将entity中不为空的字段动态加入到perEntity中去。
        try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        perEntity.setUpdateTime(new Date()); //设置修改时间
        perEntity.setUpdateUser(operator); //设置修改人的中文名
        perEntity.setLeaf(isLeaf);
        perEntity = this.merge(perEntity);//执行修改方法

        return perEntity;
	}
}

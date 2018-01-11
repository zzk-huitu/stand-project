package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtMjOpenDoor;
import com.zd.school.plartform.basedevice.service.PtMjOpenDoorService;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 门禁开门记录
 * 
 * @author hucy
 *
 */
@Controller
@RequestMapping("/PtMjOpenDoor")
public class PtMjOpenDoorController extends FrameWorkController<PtMjOpenDoor> implements Constant {

	@Resource
	PtMjOpenDoorService thisService; // service层接口

	@Resource
	CommTreeService treeService; // 生成树

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	/*zzk暂时注释，需改动
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute PtMjOpenDoor entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		// hql语句
		StringBuffer hql = new StringBuffer("from " + entity.getClass().getSimpleName() + " where 1=1");
		hql.append(entity.getWhereSql());
		// 总记录数
		StringBuffer countHql = new StringBuffer(
				"select count(*) from " + entity.getClass().getSimpleName() + " where 1=1");
		countHql.append(entity.getWhereSql());
		if (entity.getQuerySql() != null) {
			hql.append(entity.getQuerySql());
			countHql.append(entity.getQuerySql());
		}
		hql.append(" ORDER BY OPENDATE DESC");
		List<PtMjOpenDoor> lists = thisService.doQuery(hql.toString(), super.start(request), entity.getLimit());// 执行查询方法
		Integer count = thisService.getCount(countHql.toString());// 查询总记录数
		strData = jsonBuilder.buildObjListToJson(new Long(count), lists, true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
*/
	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/dodelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ids = request.getParameter("ids");
		if (StringUtils.isEmpty(ids)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			SysUser currentUser=getCurrentSysUser();
			boolean flag = thisService.doLogicDelOrRestore(ids, StatuVeriable.ISDELETE,currentUser.getXm());
			if (flag) {
				writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		}
	}

	/**
	 * 修改
	 * 
	 * @param entity
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	@RequestMapping("/doupdate")
	public void doUpdates(PtMjOpenDoor entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String userCh = "超级管理员";
		SysUser currentUser = getCurrentSysUser();
		if (currentUser != null)
			userCh = currentUser.getXm();
		// 先拿到已持久化的实体
		// entity.getSchoolId()要自己修改成对应的获取主键的方法
		PtMjOpenDoor perEntity = thisService.get(entity.getUuid());
		// 将entity中不为空的字段动态加入到perEntity中去。
		BeanUtils.copyPropertiesExceptNull(perEntity, entity);
		perEntity.setUpdateUser(userCh);

		entity = thisService.merge(perEntity);// 执行修改方法

		writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(perEntity)));

	}

}

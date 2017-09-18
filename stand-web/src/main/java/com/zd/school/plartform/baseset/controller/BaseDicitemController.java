
package com.zd.school.plartform.baseset.controller;

import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.StringUtils;
import com.zd.school.plartform.baseset.model.BaseDic;
import com.zd.school.plartform.baseset.model.BaseDicitem;
import com.zd.school.plartform.baseset.service.BaseDicService;
import com.zd.school.plartform.baseset.service.BaseDicitemService;
import com.zd.school.plartform.system.model.SysUser;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;

/**
 * 
 * ClassName: BaseDicitemController Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 数据字典项实体Controller. date: 2016-07-19
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/BaseDicitem")
public class BaseDicitemController extends FrameWorkController<BaseDicitem> implements Constant {

	@Resource
	private BaseDicitemService thisService; // service层接口

	@Resource
	private BaseDicService dictionaryService;

	@Resource
	private RedisTemplate<String, Object> redisTemplate;

	/**
	 * list查询 @Title: list @Description: TODO @param @param entity
	 * 实体类 @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute BaseDicitem entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<BaseDicitem> qr = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);

		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 
	 * @Title: 增加新实体信息至数据库 @Description: TODO @param @param BaseDicitem
	 *         实体类 @param @param request @param @param response @param @throws
	 *         IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doAdd")
	public void doAdd(BaseDicitem entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String dicId = entity.getDicId();

		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String hql = " o.dicId='" + dicId + "' and o.isDelete='0'";
		if (thisService.IsFieldExist("itemName", entity.getItemName(), "-1", hql)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"同一字典下的字典项名称不能相同！\""));
			return;
		}
		if (thisService.IsFieldExist("itemCode", entity.getItemCode(), "-1", hql)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"同一字典下的字典项编码不能相同！\""));
			return;
		}
		//
		// 获取当前操作用户	
		SysUser currentUser = getCurrentSysUser();		
		                
        entity=thisService.doAdd(entity,currentUser.getXm());     
        
        if(entity==null)
        	writeJSON(response, jsonBuilder.returnFailureJson("\"添加失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        
	}

	/**
	 * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doDelete")
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
			return;
		} else {
            SysUser currentUser = getCurrentSysUser();
			//boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
            boolean flag = thisService.doDeleteOrRestore(delIds, StatuVeriable.ISDELETE,currentUser.getXm());
			if (flag) {			
				writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"删除失败\""));
			}
		}
	}

	/**
	 * doRestore还原删除的记录 @Title: doRestore @Description: TODO @param @param
	 * request @param @param response @param @throws IOException 设定参数 @return
	 * void 返回类型 @throws
	 */
	@RequestMapping("/doRestore")
	public void doRestore(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String delIds = request.getParameter("ids");
		if (StringUtils.isEmpty(delIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入还原主键\""));
			return;
		} else {
            SysUser currentUser = getCurrentSysUser();
			//boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE,currentUser.getXm());
            boolean flag = thisService.doDeleteOrRestore(delIds, StatuVeriable.ISNOTDELETE,currentUser.getXm());
            if (flag) {				
				writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
			} else {
				writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
			}
		}
	}

	/**
	 * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
	 * BaseDicitem @param @param request @param @param response @param @throws
	 * IOException 设定参数 @return void 返回类型 @throws
	 */
	@RequestMapping("/doUpdate")
	public void doUpdate(BaseDicitem entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException, IllegalAccessException, InvocationTargetException {

		String dicId = entity.getDicId();

		// 此处为放在入库前的一些检查的代码，如唯一校验等
		String hql = " o.dicId='" + dicId + "' and o.isDelete='0'";
		if (thisService.IsFieldExist("itemName", entity.getItemName(), entity.getUuid(), hql)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"同一字典下的字典项名称不能相同！\""));
			return;
		}
		if (thisService.IsFieldExist("itemCode", entity.getItemCode(), entity.getUuid(), hql)) {
			writeJSON(response, jsonBuilder.returnFailureJson("\"同一字典下的字典项编码不能相同！\""));
			return;
		}

		// 获取当前的操作用户	
		SysUser currentUser = getCurrentSysUser();		
			
        entity=thisService.doUpdate(entity, currentUser.getXm());
        
        if(entity==null)
       	 	writeJSON(response, jsonBuilder.returnFailureJson("\"修改失败，请重试或联系管理员！\""));
        else        
        	writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
               
	}

	@RequestMapping(value = "/getDicItemByDicCode")
	public void getDicItemByDicCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = "";
		String dicCode = request.getParameter("dicCode");

		// if (DictionaryItemCache.get(dicCode) != null) {
		// writeJSON(response, DictionaryItemCache.get(dicCode));
		// } else {
		// BaseDic dictionary = dictionaryService.getByProerties("dicCode",
		// dicCode);
		// String hql = " from BaseDicitem where isDelete=0 and dicId='" +
		// dictionary.getUuid()
		// + "' order by orderIndex asc, itemCode asc ";
		// List<BaseDicitem> lists = thisService.queryByHql(hql);
		// strData = jsonBuilder.buildObjListToJson(new Long(lists.size()),
		// lists, false);
		// DictionaryItemCache.push(dicCode, strData);
		// writeJSON(response, strData);
		// }
		
		//获取hash类型的操作对象
		HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
		Object baseDicItem = hashOper.get("baseDicItem", dicCode);

		if (baseDicItem == null) { // 若存在，则不需要设置
		
			BaseDic dictionary = dictionaryService.getByProerties("dicCode", dicCode);
			String hql = " from BaseDicitem where isDelete=0 and dicId='" + dictionary.getUuid()
					+ "' order by orderIndex asc, itemCode asc ";
			List<BaseDicitem> lists = thisService.queryByHql(hql);
			strData = jsonBuilder.buildObjListToJson(new Long(lists.size()), lists, false);
			
			hashOper.put("baseDicItem", dicCode, strData);		

		} else {
			strData = (String) baseDicItem;
		}
		
		writeJSON(response, strData);
	}
}

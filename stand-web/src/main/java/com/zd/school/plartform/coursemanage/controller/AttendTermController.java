package com.zd.school.plartform.coursemanage.controller;



import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.oa.attendance.model.AttTerm;
import com.zd.school.oa.attendance.model.AttUser;
import com.zd.school.oa.attendance.service.AttTermService;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: AttTermController
 * Function:  ADD FUNCTION. 
 * Reason:  ADD REASON(可选). 
 * Description: 考勤机具(ATT_T_TERM)实体Controller.
 * date: 2017-05-15
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/AttendTerm")
public class AttendTermController extends FrameWorkController<AttTerm> implements Constant {

    @Resource
    AttTermService thisService; // service层接口
    @Resource
	BaseInfotermService InfoTermService; // service层接口
    /**
      * @Title: list
      * @Description: 查询数据列表
      * @param entity 实体类
      * @param request
      * @param response
      * @throws IOException    设定参数
      * @return void    返回类型
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(@ModelAttribute AttTerm entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据

		QueryResult<AttTerm> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
    @Auth("SPECIAL_COURSEATTEND_attendTerm")
   	@RequestMapping(value = { "/termAttendlist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
   			org.springframework.web.bind.annotation.RequestMethod.POST })
   	public void termAttendlist(HttpServletRequest request, HttpServletResponse response)
   			throws IOException {
   		String strData = ""; // 返回给js的数据
   		QueryResult<AttTerm> qr = thisService.queryPageResult(super.start(request), super.limit(request),
   				super.sort(request), super.filter(request), true);
   		if(qr.getTotalCount()==0){
   			writeJSON(response, strData);// 返回数据	
   			return;
   		}
   		StringBuffer termId = new StringBuffer();
   		for(AttTerm attTerm:qr.getResultList()){
   			termId.append(attTerm.getUuid()+",");
   		}
   		String filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + termId.substring(0, termId.length() - 1)
   			+ "\",\"field\":\"uuid\"}]";
   		
   		QueryResult<OaInfoterm> termQr = InfoTermService.queryPageResult(0, 0,null, filter, true);
   		
   		strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), termQr.getResultList(), true);// 处理数据
   		writeJSON(response, strData);// 返回数据
   	}
    /**
     * 
      * @Title: doadd
      * @Description: 增加新实体信息至数据库
      * @param AttTerm 实体类
      * @param request
      * @param response
      * @return void    返回类型
      * @throws IOException    抛出异常
     */
    @RequestMapping("/doAdd")
    public void doAdd(AttTerm entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        
		//此处为放在入库前的一些检查的代码，如唯一校验等
		
		//获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doAddEntity(entity, currentUser);// 执行增加方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("'数据增加失败,详情见错误日志'"));
		}
    }
	@RequestMapping("/doTermAttendAdd")
	public void doTermAttendAdd(String[] userIds, String titleId, HttpServletRequest request,
			HttpServletResponse response) throws IOException, IllegalAccessException, InvocationTargetException {

		// 此处为放在入库前的一些检查的代码，如唯一校验等

		// 获取当前操作用户
		SysUser currentUser = getCurrentSysUser();
		thisService.doTermAttendAdd(userIds, titleId, currentUser.getXm());// 执行增加方法

		writeJSON(response, jsonBuilder.returnSuccessJson("'成功'"));

	}
    /**
      * 
      * @Title: doDelete
      * @Description: 逻辑删除指定的数据
      * @param request
      * @param response
      * @return void    返回类型
      * @throws IOException  抛出异常
     */
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String delIds = request.getParameter("ids");
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
            return;
        } else {
			SysUser currentUser = getCurrentSysUser();
			try {
				boolean flag = thisService.doLogicDeleteByIds(delIds, currentUser);
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败,详情见错误日志'"));
			}
        }
    }

	@RequestMapping("/doTermAttendDelete")
	public void doTermAttendDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String termIds = request.getParameter("isSelectAttendIds");
		if (StringUtils.isEmpty(termIds)) {
			writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
			return;
		} else {
			/*String[] ids = termIds.split(",");
			for (int i = 0; i < ids.length; i++) {
				String hql = " from AttTerm where uuid = '" + ids[i] + "'";
				AttTerm entity = thisService.getEntityByHql(hql);
				thisService.delete(entity);
			} */
			try {
				boolean flag = thisService.deleteByPK(termIds);
				if (flag) {
					writeJSON(response, jsonBuilder.returnSuccessJson("'删除成功'"));
				} else {
					writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
				}
			} catch (Exception e) {
				writeJSON(response, jsonBuilder.returnFailureJson("'删除失败'"));
			}
		}
		
	}
    /**
     * @Title: doUpdate
     * @Description: 编辑指定记录
     * @param AttTerm
     * @param request
     * @param response
     * @return void    返回类型
     * @throws IOException  抛出异常
    */
    @RequestMapping("/doUpdate")
    public void doUpdates(AttTerm entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
		
		//入库前检查代码
		
		//获取当前的操作用户
		SysUser currentUser = getCurrentSysUser();
		try {
			entity = thisService.doUpdateEntity(entity, currentUser);// 执行修改方法
			if (ModelUtil.isNotNull(entity))
				writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
			else
				writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		} catch (Exception e) {
			writeJSON(response, jsonBuilder.returnFailureJson("'数据修改失败,详情见错误日志'"));
		}
    }
}


package com.zd.school.plartform.baseset.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.constant.StatuVeriable;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.EntityUtil;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.plartform.baseset.model.BaseCampus;
import com.zd.school.plartform.baseset.model.BaseSchool;
import com.zd.school.plartform.baseset.service.BaseCampusService;
import com.zd.school.plartform.baseset.service.BaseRoomareaService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 校区信息
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/BaseCampus")
public class BaseCampusController extends FrameWorkController<BaseCampus> implements Constant {

    @Resource
    BaseCampusService thisService; // service层接口

    @Resource
    private BaseRoomareaService areaService;

    /**
     * 校区列表
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
            org.springframework.web.bind.annotation.RequestMethod.POST })
    public void list(BaseCampus entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String strData = ""; // 返回给js的数据
        QueryResult<BaseCampus> qr = thisService.queryPageResult(super.start(request), super.limit(request),
                super.sort(request), super.filter(request), true);

        strData = jsonBuilder.buildObjListToJson(qr.getTotalCount(), qr.getResultList(), true);// 处理数据
        writeJSON(response, strData);// 返回数据
    }

    /**
     * 添加校区
     * @param entity
     * @param request
     * @param response
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    @Auth("BASECAMPUS_add")
    @RequestMapping("/doAdd")
    public void doAdd(BaseCampus entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String campusName = entity.getCampusName();
        String campusCode = entity.getCampusCode();
        String schoolId = entity.getSchoolId();
        String schoolName = entity.getSchoolName();
       // Integer orderIndex = entity.getOrderIndex();
        Integer defaultOrderIndex = Integer.valueOf(0);

        //此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0' and o.schoolId='" + schoolId + "'";
        if (thisService.IsFieldExist("campusName", campusName, "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"已存在此校区名称！\""));
            return;
        }
/*        if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), "-1", hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"已存在此顺序号！\""));
            return;
        }*/
        if (StringUtils.isNotEmpty(campusCode)) {
            if (thisService.IsFieldExist("campusCode", campusCode, "-1", hql)) {
                writeJSON(response, jsonBuilder.returnFailureJson("\"已存在此校区编码！\""));
                return;
            }
        }
		// 获取同一级别的顺序号
        /*
		String hql1 = " from BaseCampus where orderIndex = (select max(o.orderIndex) from BaseCampus o where  o.isDelete='0' and o.schoolId='"
				+ schoolId + "' )";
		List list = thisService.queryByHql(hql1);
		if (list.size() > 0) {
			defaultOrderIndex = (Integer) EntityUtil.getPropertyValue(list.get(0), "orderIndex") + 1;
		} else
			defaultOrderIndex = 0;
		*/
        String hql1 = "select max(o.orderIndex) from BaseCampus o where  o.isDelete='0' and o.schoolId='"
				+ schoolId + "'";
        defaultOrderIndex = thisService.getEntityByHql(hql1);
        if(defaultOrderIndex!=null)
        	defaultOrderIndex++;
        else
        	defaultOrderIndex=1;
        
		entity.setOrderIndex(defaultOrderIndex);
        SysUser currentUser = getCurrentSysUser();
        //持久化到数据库
        entity = thisService.doAdd(entity, currentUser);
        if (ModelUtil.isNotNull(entity)) {
            entity.setSchoolName(schoolName);
            //返回实体到前端界面
            writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        } else {
            writeJSON(response, jsonBuilder.returnFailureJson("\"增加校区失败\""));
        }
    }

    /**
     * doDelete @Title: 逻辑删除指定的数据 @Description: TODO @param @param
     * request @param @param response @param @throws IOException 设定参数 @return
     * void 返回类型 @throws
     * 
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    @Auth("BASECAMPUS_delete")
    @RequestMapping("/doDelete")
    public void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {
        String delIds = request.getParameter("ids");
        Map<String,Object> hashMap = new HashMap<String,Object>();
        SysUser currentUser = getCurrentSysUser();
        if (StringUtils.isEmpty(delIds)) {
            writeJSON(response, jsonBuilder.returnSuccessJson("\"没有传入删除主键\""));
            return;
        } else {  
    		 boolean flag = thisService.doDelete(delIds, currentUser,hashMap);
    		 flag = hashMap.get("rs")==null?true:(boolean) hashMap.get("rs");
            //flag = areaService.logicDelOrRestore(delIds, StatuVeriable.ISDELETE);
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"删除成功\""));
            } else {
                StringBuffer notSb = (StringBuffer) hashMap.get("notSb");
                writeJSON(response, jsonBuilder.returnFailureJson("'"+notSb.substring(0,notSb.length()-1)+"校区关联了部门或建筑物区域,不能删除'"));
               // writeJSON(response, jsonBuilder.returnFailureJson("\"校区关联了部门或建筑物区域,不能删除\""));
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
            boolean flag = thisService.doLogicDelOrRestore(delIds, StatuVeriable.ISNOTDELETE,currentUser.getXm());
            if (flag) {
                writeJSON(response, jsonBuilder.returnSuccessJson("\"还原成功\""));
            } else {
                writeJSON(response, jsonBuilder.returnFailureJson("\"还原失败\""));
            }
        }
    }

    /**
     * doUpdate编辑记录 @Title: doUpdate @Description: TODO @param @param
     * BaseCampus @param @param request @param @param response @param @throws
     * IOException 设定参数 @return void 返回类型 @throws
     */
    @Auth("BASECAMPUS_update")
    @RequestMapping("/doUpdate")
    public void doUpdates(BaseCampus entity, HttpServletRequest request, HttpServletResponse response)
            throws IOException, IllegalAccessException, InvocationTargetException {

        String campusName = entity.getCampusName();
        String campusCode = entity.getCampusCode();
        String schoolId = entity.getSchoolId();
        String schoolName = entity.getSchoolName();
        String uuid = entity.getUuid();
        Integer orderIndex = entity.getOrderIndex();

        //此处为放在入库前的一些检查的代码，如唯一校验等
        String hql = " o.isDelete='0' and o.schoolId='" + schoolId + "'";
        if (thisService.IsFieldExist("campusName", campusName, uuid, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"已存在此校区名称！\""));
            return;
        }
        if (thisService.IsFieldExist("orderIndex", orderIndex.toString(), uuid, hql)) {
            writeJSON(response, jsonBuilder.returnFailureJson("\"已存在此顺序号!\""));
            return;
        }
        if (StringUtils.isNotEmpty(campusCode)) {
            if (thisService.IsFieldExist("campusCode", campusCode, uuid, hql)) {
                writeJSON(response, jsonBuilder.returnFailureJson("\"已存在此校区编码！\""));
                return;
            }
        }
        SysUser currentUser = getCurrentSysUser();

        //持久化到数据库
        entity = thisService.doUpdate(entity, currentUser);
        if (ModelUtil.isNotNull(entity)) {
            entity.setSchoolName(schoolName);
            //返回实体到前端界面
            writeJSON(response, jsonBuilder.returnSuccessJson(jsonBuilder.toJson(entity)));
        } else {
            writeJSON(response, jsonBuilder.returnFailureJson("\"修改校区失败\""));
        }

    }
    @RequestMapping("/getSchool")
    public  @ResponseBody BaseSchool getSchool(HttpServletRequest request, HttpServletResponse response){
    	String hql = " from BaseSchool";
    	BaseSchool baseSchool = thisService.getEntityByHql(hql);
        return baseSchool;
    }
}

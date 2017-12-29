package com.zd.school.platform.wisdomclass.controller;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.school.jw.ecc.model.EccClasselegant;
import com.zd.school.wisdomclass.ecc.service.EccClasselegantService;

@Controller
@RequestMapping("/classPersence")
public class WisClassPersenceController extends FrameWorkController<EccClasselegant> implements Constant{
	@Resource
	EccClasselegantService thisService; // service层接口
	
	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void list(@ModelAttribute EccClasselegant entity, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String strData = ""; // 返回给js的数据
		String filter=request.getParameter("filter");;
		String claiId = request.getParameter("claiId");
		if(claiId==null){
			claiId="";
		}
		String hql = "select a.uuid from BaseOrg a where a.isDelete=0  and a.deptType='05' and a.treeIds like '%"
				+ claiId + "%'";
		List<String> lists = thisService.queryEntityByHql(hql);
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < lists.size(); i++) {
			sb.append(lists.get(i) + ",");
		}
		if (sb.length() > 0) {
			if(filter!=null &&filter.length()>0){
				filter = filter.substring(0, filter.length()-1);
				filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ sb.substring(0,sb.length()-1)+"\",\"field\":\"claiId\"}"+"]";
			}else{
				   filter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + sb.substring(0, sb.length() - 1)
					+ "\",\"field\":\"claiId\"}]";
			}
			
		} else {
			if(filter!=null &&filter.length()>0){
				filter = filter.substring(0, filter.length()-1);
				filter+=",{\"type\":\"string\",\"comparison\":\"in\",\"value\":\""+ claiId+"\",\"field\":\"claiId\"}"+"]";
			}else{
				filter = "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"" + claiId + "\",\"field\":\"claiId\"}]";
			}
		}
		QueryResult<EccClasselegant> qResult = thisService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}
}

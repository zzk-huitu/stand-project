package com.zd.school.app.wisdomclass.controller;



import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.school.oa.notice.model.OaNotice;
import com.zd.school.oa.notice.service.OaNoticeService;

@Controller
@RequestMapping("/app/Notice")
public class NoticeAppController extends FrameWorkController<OaNotice> implements Constant {
	@Resource
	private OaNoticeService thisService; // service层接口
	
	
	@RequestMapping(value = { "/getList" }, method = RequestMethod.GET)
	public void list(@RequestParam("termCode") String termCode, HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);

		QueryResult<OaNotice> qResult = thisService.list(start, limit, sort, filter, termCode);
		if(qResult!=null){
			for (OaNotice notice : qResult.getResultList()) {
				String content = notice.getNoticeContent();
				// 过滤文章内容中的html
				content = content.replaceAll("</?[^<]+>", "");
				// 去除字符串中的空格 回车 换行符 制表符 等
				content = content.replaceAll("\\s*|\t|\r|\n", "");
				// 去除空格
				content = content.replaceAll("&nbsp;", "");
				notice.setNoticeContent(content);
			}
			strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据			
			
			writeJSON(response, jsonBuilder.returnSuccessAppJson("\"请求成功\"", strData));// 返回数据
		} else {
			writeJSON(response, jsonBuilder.returnFailureAppJson("\"没有找到此终端的数据\"", null));// 返回数据
		}
	}

	
}

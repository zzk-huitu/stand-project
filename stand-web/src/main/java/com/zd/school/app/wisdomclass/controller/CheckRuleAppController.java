package com.zd.school.app.wisdomclass.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.school.jw.ecc.model.JwCheckrule;
import com.zd.school.jw.model.app.CommonApp;
import com.zd.school.wisdomclass.ecc.service.JwCheckruleService;

@Controller
@RequestMapping("/app/CheckRule")
public class CheckRuleAppController {

	@Resource
	private JwCheckruleService thisService; // 考勤规则

	@ResponseBody
	@RequestMapping(value = { "/getRule" }, method = RequestMethod.GET)
	public CommonApp<JwCheckrule> getRule() {

		CommonApp<JwCheckrule> app = new CommonApp<JwCheckrule>();

		/* 暂不需要 */
		// OaInfoterm roomTerm = termService.getByProerties("termCode",
		// termCode);
		// if (roomTerm == null) {
		// app.setMessage(false);
		// app.setMessageInfo("没有找到该终端设备！");
		// return app;
		// }
		//
		// BuildRoominfo roominfo = brService.get(roomTerm.getRoomId());
		// if (roominfo == null) {
		// app.setMessage(false);
		// app.setMessageInfo("没有找到设备对应房间！");
		// return app;
		// }

		String[] propName = new String[] { "startUsing", "isDelete" };
		Object[] propValue = new Object[] { 1, 0 };
		JwCheckrule rule = thisService.getByProerties(propName, propValue); // 查出启用的考勤规则

		if (rule == null) {
			app.setMessage(false);
			app.setMessageInfo("没有找到已启用的考勤规则！");
			return app;
		}

		app.setObj(rule);
		app.setMessage(true);
		app.setMessageInfo("请求成功！");
		return app;
	}

}

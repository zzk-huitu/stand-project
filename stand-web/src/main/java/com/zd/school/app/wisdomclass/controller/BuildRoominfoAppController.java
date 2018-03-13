package com.zd.school.app.wisdomclass.controller;


import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.util.ModelUtil;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.model.app.BuildRoominfoApp;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;

@Controller
@RequestMapping("/app/BuildRoominfo")
public class BuildRoominfoAppController {
	@Resource
	private BaseRoominfoService thisService;
	
	@Resource
	private BaseInfotermService termService; // 终端设备serice层接口
	
	@RequestMapping(value = { "/getRoomInfo" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody BuildRoominfoApp getRoomInfo(String claiId, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		BuildRoominfoApp info=new BuildRoominfoApp();
		OaInfoterm roomTerm = termService.getByProerties("termCode", claiId);
		BuildRoominfo room = null;
		if (ModelUtil.isNotNull(roomTerm)) {
			room = thisService.get(roomTerm.getRoomId());
		} else {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}
		if (room == null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端对应的房间！");
			return info;
		}
		info.setMessage(true);
		info.setMessageInfo("请求成功！");
		info.setObj(room);
		return info;
	}
}

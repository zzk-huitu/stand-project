package com.zd.school.app.wisdomclass.controller;


import java.io.IOException;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.jw.model.app.BuildRoominfoApp;
import com.zd.school.oa.terminal.model.OaInfoterm;
import com.zd.school.plartform.baseset.service.BaseInfotermService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;

@Controller
@RequestMapping("/app/RoomInfo")
public class RoomInfoAppController {
	@Resource
	private BaseRoominfoService thisService;
	
	@Resource
	private BaseInfotermService termService; // 终端设备serice层接口
	
	/**
	 * 获取房间信息
	 * @param termCode
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@ResponseBody
	@RequestMapping(value = { "/getRoomInfo" }, method = RequestMethod.GET)
	public  BuildRoominfoApp getRoomInfo(@RequestParam(value="termCode") String termCode){
		BuildRoominfoApp info=new BuildRoominfoApp();
		
		OaInfoterm roomTerm = termService.getByProerties("termCode", termCode);
		
		if (roomTerm==null) {
			info.setMessage(false);
			info.setMessageInfo("没有找到该终端设备！");
			return info;
		}
		
		BuildRoominfo room  = thisService.get(roomTerm.getRoomId());;
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

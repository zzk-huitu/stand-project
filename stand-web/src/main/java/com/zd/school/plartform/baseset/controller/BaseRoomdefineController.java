package com.zd.school.plartform.baseset.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;

@Controller
@RequestMapping("/BaseRoomdefine")
public class BaseRoomdefineController  extends FrameWorkController<BuildRoominfo> implements Constant {
	
	@Resource
	private BaseRoominfoService thisService; // service层接口
	
	
}

package com.zd.school.plartform.baseset.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.school.build.allot.model.JwOfficeAllot;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;

/**
 * 房间分配（原办公室分配）
 *
 */
@Controller
@RequestMapping("/BaseOfficeAllot")
public class BaseOfficeAllotController extends FrameWorkController<JwOfficeAllot> implements Constant  {
	@Resource
	BaseOfficeAllotService thisService; // service层接口
	
	
}

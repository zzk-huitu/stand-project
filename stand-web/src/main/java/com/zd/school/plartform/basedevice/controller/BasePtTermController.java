package com.zd.school.plartform.basedevice.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.plartform.basedevice.service.BasePtTermService;


/**
 * 房间设备
 *
 */
@Controller
@RequestMapping("/BasePtTerm")
public class BasePtTermController extends FrameWorkController<PtTerm> implements Constant  {
	@Resource
	BasePtTermService thisService; // service层接口
	
	
}

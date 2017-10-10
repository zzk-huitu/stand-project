package com.zd.school.plartform.basedevice.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.BaseEntity;
import com.zd.school.plartform.basedevice.service.BaseDkPriceDefineService;
import com.zd.school.plartform.basedevice.service.BaseSkPriceDefineService;

/**
 * 费率定义(水控与电控)
 *
 */
@Controller
@RequestMapping("/BasePriceDefine")
public class BasePriceDefineController extends FrameWorkController<BaseEntity> implements Constant  {
	@Resource
	BaseSkPriceDefineService skPriceDefineService; // service层接口
	@Resource
	BaseDkPriceDefineService dkPriceDefineService; // service层接口
	
	
	
}

package com.zd.school.plartform.baseset.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.school.build.allot.model.DormTeacherDorm;
import com.zd.school.plartform.baseset.service.BaseTeacherDormService;

/**
 * 教师宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseTeacherDrom")
public class BaseTeacherDromController extends FrameWorkController<DormTeacherDorm> implements Constant  {
	@Resource
	BaseTeacherDormService thisService; // service层接口
	
	
}

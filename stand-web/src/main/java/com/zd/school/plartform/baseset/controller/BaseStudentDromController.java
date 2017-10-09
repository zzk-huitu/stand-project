package com.zd.school.plartform.baseset.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;

/**
 * 学生宿舍分配
 *
 */
@Controller
@RequestMapping("/BaseStudentDrom")
public class BaseStudentDromController extends FrameWorkController<DormStudentDorm> implements Constant  {
	@Resource
	BaseStudentDormService thisService; // service层接口
	
	
}

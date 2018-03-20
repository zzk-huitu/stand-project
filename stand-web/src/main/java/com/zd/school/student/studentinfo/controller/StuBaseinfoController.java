
package com.zd.school.student.studentinfo.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.school.student.studentinfo.model.StuBaseinfo;
import com.zd.school.student.studentinfo.service.StuBaseinfoService;

/**
 * 
 * ClassName: StuBaseinfoController Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 学生基本信息实体Controller. date: 2016-07-19
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/StuBaseinfo")
public class StuBaseinfoController extends FrameWorkController<StuBaseinfo> implements Constant {

	@Resource
	StuBaseinfoService thisService; // service层接口
	
	
}

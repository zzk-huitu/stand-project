
package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.constant.Constant;
import com.zd.core.controller.core.FrameWorkController;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.util.DBContextHolder;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.control.device.model.PtRoomBags;
import com.zd.school.plartform.basedevice.service.PtRoomBagsService;
import com.zd.school.plartform.basedevice.service.PtTermBagsService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;

/**
 * 
 * 设备钱包 房间钱包
 * 
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/PtBag")
public class PtBagController extends FrameWorkController implements Constant {

	@Resource
	PtTermBagsService termBagsService; // service层接口
	@Resource
	PtRoomBagsService roomBagsService;
	
	@Resource
	BaseStudentDormService studentdormService;
	//@Resource
	//JwClassDormAllotService classDormAllotService;
	@Resource
	BaseDormDefineService dormDefineService;

	/**
	 * @Title: list
	 * @Description: 查询数据列表
	 * @param entity
	 *            实体类
	 * @param request
	 * @param response
	 * @throws IOException
	 *             设定参数
	 * @return void 返回类型
	 */
	@RequestMapping(value = { "/termbaglist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void termbaglist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);
		String roomid = request.getParameter("roomId");
		QueryResult<Map> qResult = termBagsService.list(start, limit, sort, filter, true, roomid);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	@RequestMapping(value = { "/roombaglist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void roombaglist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		Integer start = super.start(request);
		Integer limit = super.limit(request);
		String sort = super.sort(request);
		String filter = super.filter(request);
		QueryResult<PtRoomBags> qResult = roomBagsService.queryPageResult(start, limit, sort, filter, true);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	@RequestMapping(value = { "/userbagyue" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void userbagyue(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String roomid = request.getParameter("roomId");
		String sql = "select u.*  from PT_V_STUDENTDORM d,SYS_T_USER u where " + "u.USER_ID =d.USER_ID and d.ROOM_ID='"
				+ roomid + "'";
		List<Map<String, Object>> list = roomBagsService.queryMapBySql(sql);
		/*zzk暂时注释
		 * DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Three);
		List<Map> listmap = new ArrayList<Map>();
		try {
			for (Map<String, Object> u : list) {
				String USER_NUMB = (String) u.get("USER_NUMB");
				sql = "SELECT		CardValueXF FROM	TC_Employee	LEFT OUTER JOIN "
						+ "TC_Card ON TC_Employee.CardID = TC_Card.CARDID " + "WHERE	 EmployeeStrID = '" + USER_NUMB
						+ "'";
				List<Map<String, Object>> xf = roomBagsService.getForValuesToSql(sql);
				if (xf != null && xf.size() > 0) {
					u.put("CardValueXF", xf.get(0).get("CardValueXF"));
				} else {
					u.put("CardValueXF", "无记录");
				}

				listmap.add(u);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBContextHolder.clearDBType();
		}

		String strData = jsonBuilder.buildObjListToJson((long) listmap.size(), listmap, true);// 处理数据
		writeJSON(response, strData);// 返回数据
		*/
	}

	@RequestMapping(value = { "/getUserRoomId" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody BuildDormDefine getUserRoomId(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String querySql = super.querySql(request);
		String hql = "from DormStudentDorm where isDelete=0 ";
		hql += querySql;
		List<DormStudentDorm> studentDorms = studentdormService.queryByHql(hql);
		DormStudentDorm studentDormfirst = studentDorms.get(0);
		//zzk暂时注释JwClassDormAllot classDormAllot = classDormAllotService.get(studentDormfirst.getCdormId());
		//BuildDormDefine dormDefine= dormDefineService.get(classDormAllot.getDormId());
		//return dormDefine;
		return null;
	}
}

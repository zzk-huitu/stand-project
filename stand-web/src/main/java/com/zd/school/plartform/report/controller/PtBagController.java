
package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.math.BigDecimal;
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
import com.zd.core.util.StringUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.control.device.model.PtRoomBags;
import com.zd.school.plartform.basedevice.service.PtRoomBagsService;
import com.zd.school.plartform.basedevice.service.PtTermBagsService;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
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
	@Resource
	BaseClassDormAllotService classDormAllotService;
	@Resource
	BaseDormDefineService dormDefineService;

	/**
	 * @Title: list
	 * @Description: 设备钱包列表
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
		String roomid = request.getParameter("roomId");
		QueryResult<Map> qResult = termBagsService.list(super.start(request), super.limit(request), super.sort(request),
				super.filter(request), true, roomid);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 房间钱包
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/roombaglist" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void roombaglist(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String strData = ""; // 返回给js的数据
		QueryResult<PtRoomBags> qResult = roomBagsService.queryPageResult(super.start(request), super.limit(request),
				super.sort(request), super.filter(request), false);
		strData = jsonBuilder.buildObjListToJson(qResult.getTotalCount(), qResult.getResultList(), true);// 处理数据
		writeJSON(response, strData);// 返回数据
	}

	/**
	 * 用户钱包余额
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = { "/userbagyue" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public void userbagyue(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String roomid = request.getParameter("roomId");
		String sql = "select  u.USER_ID,u.USER_NUMB,u.XM  from PT_V_STUDENTDORM d,SYS_T_USER u where "
				+ "u.USER_ID =d.USER_ID and d.ROOM_ID='" + roomid + "'";
		List<Map<String, Object>> list = roomBagsService.queryMapBySql(sql);

		DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Up6);
		List<Map> listmap = new ArrayList<Map>();
		try {
			for (Map<String, Object> u : list) {
				String USER_ID = (String) u.get("USER_ID");
				sql = "select b.bagName,b.cardValue from TC_Employee a "
						+ " left join dbo.TC_Card_Bags b on a.cardID=b.cardID "
						+ " where a.userId='"+USER_ID+"'";
				List<Map<String, Object>> xf = roomBagsService.queryMapBySql(sql);
				
				String cardValueXF="";
				for(int i=0;i<xf.size();i++){
					String cardValueStr = String.valueOf( xf.get(i).get("cardValue"));
					String bagNameStr = String.valueOf( xf.get(i).get("bagName"));
					if(!StringUtils.isEmpty(cardValueStr)&&!StringUtils.isEmpty(bagNameStr)){
						BigDecimal cardValue = new BigDecimal(cardValueStr)
								.setScale(2, BigDecimal.ROUND_HALF_UP);		
						cardValueXF+=bagNameStr+" "+cardValue.toString()+"；";
					}else{
						cardValueXF="无记录";
					}
				}
				if (xf.size() == 0) {			
					cardValueXF="无记录";
				}
				u.put("CardValueXF", cardValueXF);

				listmap.add(u);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBContextHolder.clearDBType();
		}

		String strData = jsonBuilder.buildObjListToJson((long) listmap.size(), listmap, true);// 处理数据
		writeJSON(response, strData);// 返回数据

	}

	@RequestMapping(value = { "/getUserRoomId" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody BuildDormDefine getUserRoomId(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		BuildDormDefine dormDefine = null;
		String querySql = super.querySql(request);
		String hql = "from DormStudentDorm where isDelete=0 ";
		hql += querySql;
		List<DormStudentDorm> studentDorms = studentdormService.queryByHql(hql);
		if (studentDorms.size() != 0) {
			DormStudentDorm studentDormfirst = studentDorms.get(0);
			JwClassDormAllot classDormAllot = classDormAllotService.get(studentDormfirst.getCdormId());
			dormDefine = dormDefineService.get(classDormAllot.getDormId());
		}
		return dormDefine;
	}
}

package com.zd.school.plartform.report.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.security.MyExceptionHandler;
import com.zd.core.util.DBContextHolder;
import com.zd.core.util.StringUtils;
import com.zd.school.control.device.model.PtEcTermStatus;
import com.zd.school.control.device.model.PtPowerResidue;
import com.zd.school.control.device.model.PtRoomBags;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.control.device.model.PtTermBags;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.basedevice.service.PtRoomBagsService;
import com.zd.school.plartform.basedevice.service.PtTermBagsService;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;

@Controller
@RequestMapping("/PtPowerResidue")
public class PtPowerResidueController {

	private static Logger logger = Logger.getLogger(PtPowerResidueController.class);

	@Resource
	private BasePtTermService termService;
	@Resource
	private PtRoomBagsService roomBagsService;
	@Resource
	private PtTermBagsService termBagsService;
	@Resource
	private BaseDormDefineService dormDefineService;
	@Resource
	private BaseClassDormAllotService classDormAllotService;
	@Resource
	private BaseStudentDormService stuDormService;
	@Resource
	private SysUserService userService;

	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody List<PtPowerResidue> list(HttpServletRequest request, HttpServletResponse response)
			throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException,
			InvocationTargetException {

		List<PtPowerResidue> returnlist = new ArrayList<PtPowerResidue>();

		// 1.获取学生的房间id【select * from [JW_V_STU_DORMALLOTTREE]】
		String roomID = request.getParameter("roomId");
		String roomLeaf = request.getParameter("roomLeaf");
		List<String> roomIdList = new ArrayList<String>();

		if (StringUtils.isNotEmpty(roomID)) {
			if ("1".equals(roomLeaf)) { // 当选择的区域为房间时
				roomIdList.add(roomID);
			} else { // 当选择的区域不为房间时,查询出子房间
				String sql = "select a.id from JW_V_STU_DORMALLOTTREE a where a.leaf='false' " + "and a.treeIds like '%"
						+ roomID + "%'";
				List<String> lists = termService.queryEntityBySql(sql, null);
				if (lists.size() > 0) {
					String areaIds = lists.stream().collect(Collectors.joining("','", "'", "'"));

					sql = "select a.id from JW_V_STU_DORMALLOTTREE a where a.leaf='true' and a.parent in (" + areaIds
							+ ")";
					roomIdList = termService.queryEntityBySql(sql, null);
				}
			}
		}else{
			//获取全部学生宿舍
			String sql = "select a.id from JW_V_STU_DORMALLOTTREE a where a.leaf='true'";
			roomIdList = termService.queryEntityBySql(sql, null);
		}

		for (String roomId : roomIdList) {
			try {
				PtPowerResidue temp = new PtPowerResidue();

				PtRoomBags roomBag = roomBagsService.getByProerties("roomId", roomId);
				if (roomBag != null)
					temp.setPowerResidue(roomBag.getRoomValue() + "");

				String[] propName = new String[] { "roomId", "termTypeID", "isDelete" };
				Object[] propValue = new Object[] { roomId, "9", 0 };
				PtTerm term = termService.getByProerties(propName, propValue);
				if (term != null) {
					PtTermBags termBag = termBagsService.getByProerties("termSn", term.getTermSN());
					if (termBag != null)
						temp.setMoneyResidue(termBag.getBagValue() + "");
				}

				String sql = "SELECT user_id,Room_Name,xm FROM dbo.PT_V_STUDENTDORM WHERE ROOM_ID = '" + roomId + "'";
				List<Map<String, Object>> studentDorms = stuDormService.queryMapBySql(sql);
				temp.setRoomName(String.valueOf(studentDorms.get(0).get("Room_Name")));

				DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Up6);

				// 通过反射，去设置各个宿舍人员的数据（这里固定了宿舍人数为6人，实际上可能不合理，推荐使用拼接字符串的形式来实现宿舍人数超过6人的情况）
				Class clazz = temp.getClass();
				for (int i = 0; i < studentDorms.size(); i++) {
					String userId = String.valueOf(studentDorms.get(i).get("user_id"));

					String methodName = "setCardResidue" + (i + 1);
					Method method = clazz.getDeclaredMethod(methodName, String.class);
					try {
						sql = "SELECT CAST(EmployeeName AS VARCHAR(60)) EmployeeName,CardValueXF   FROM	TC_Employee	LEFT OUTER JOIN "
								+ "TC_Card ON TC_Employee.CardID = TC_Card.CARDID   WHERE CardStatusIDXF=1 and Student_id='"
								+ userId + "'";
						List<Object[]> xf = stuDormService.queryObjectBySql(sql);
						String value = xf.get(0)[0] + ":" + xf.get(0)[1];
						method.invoke(temp, value);

					} catch (Exception e) {
						String xm = String.valueOf(studentDorms.get(i).get("xm"));
						method.invoke(temp, xm + " 异常");
						
					}
				}

				returnlist.add(temp);
			} catch (Exception e) {
				// e.printStackTrace();
				logger.error("错误原因：【" + e.getMessage() + "】 出错堆栈跟踪：" + Arrays.toString(e.getStackTrace()));
			} finally {
				DBContextHolder.clearDBType();
			}
		}

		return returnlist;
	}

}

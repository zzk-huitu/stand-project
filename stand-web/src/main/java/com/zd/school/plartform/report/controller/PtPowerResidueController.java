package com.zd.school.plartform.report.controller;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zd.core.util.DBContextHolder;
import com.zd.school.control.device.model.PtPowerResidue;
import com.zd.school.control.device.model.PtRoomBags;
import com.zd.school.control.device.model.PtTerm;
import com.zd.school.control.device.model.PtTermBags;
import com.zd.school.plartform.basedevice.service.BasePtTermService;
import com.zd.school.plartform.basedevice.service.PtRoomBagsService;
import com.zd.school.plartform.basedevice.service.PtTermBagsService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;

@Controller
@RequestMapping("/PtPowerResidue")
public class PtPowerResidueController {

	@Resource
	private BasePtTermService termService;
	@Resource
	private PtRoomBagsService roomBagsService;
	@Resource
	private PtTermBagsService termBagsService;
	@Resource
	private BaseDormDefineService dormDefineService;
	/*
	@Resource
	private JwClassDormAllotService dormAllotService;
	*/
	@Resource
	private BaseStudentDormService stuDormService;
	@Resource
	private SysUserService userService;

	@RequestMapping(value = { "/list" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET,
			org.springframework.web.bind.annotation.RequestMethod.POST })
	public @ResponseBody List<PtPowerResidue> list(HttpServletRequest request, HttpServletResponse response)
			throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException,
			InvocationTargetException {
		String id = request.getParameter("roomId");
		String sql = "SELECT * FROM JW_AREAROOMINFOTREE where id='" + id + "'";
		List<Object[]> list = termService.queryObjectBySql(sql);
		Object[] obj = list.get(0);
		int level = Integer.parseInt(obj[4] + "");
		List<String> idList = new ArrayList<String>();

		if (level == 1) {

		} else if (level != 5) {
			sql = "SELECT id FROM JW_AREAROOMINFOTREE WHERE parent IN('" + obj[0] + "') AND id IN(SELECT ROOM_ID FROM dbo.BUILD_T_DORMDEFINE WHERE ISDELETE=0 AND DORM_ID IN(SELECT DORM_ID FROM dbo.JW_T_CLASSDORMALLOT WHERE ISDELETE=0 AND CDORM_ID IN(SELECT CDORM_ID FROM dbo.DORM_T_STUDENTDORM WHERE ISDELETE=0)))";
			list = termService.queryObjectBySql(sql);

			for (int i = 0; i < list.size(); i++) {
				idList.add(list.get(i) + "");
			}
		} else {
			idList.add(id);
		}

		List<PtPowerResidue> returnlist = new ArrayList<PtPowerResidue>();
		for (String roomId : idList) {
			try {
				PtPowerResidue temp = new PtPowerResidue();
				PtRoomBags roomBag = roomBagsService.getByProerties("roomId", roomId);
				String[] propName = new String[] { "roomId", "termTypeID", "isDelete" };
				Object[] propValue = new Object[] { roomId, 9, 0 };
				PtTerm term = termService.getByProerties(propName, propValue);
				PtTermBags termBag = termBagsService.getByProerties("termSn", term.getTermSN());
				temp.setPowerResidue(roomBag.getRoomValue() + "");
				temp.setMoneyResidue(termBag.getBagValue() + "");

				/*propName = new String[] { "roomId", "isDelete" };
				propValue = new Object[] { roomId, 0 };
				BuildDormDefine dormDefine = dormDefineService.getByProerties(propName, propValue);
				propName = new String[] { "dormId", "isDelete" };
				propValue = new Object[] { dormDefine.getUuid(), 0 };
				JwClassDormAllot dormAllot = dormAllotService.getByProerties(propName, propValue);
				propName = new String[] { "cdormId", "isDelete" };
				propValue = new Object[] { dormAllot.getUuid(), 0 };
				List<DormStudentDorm> studentDorms = stuDormService.queryByProerties(propName, propValue);*/
				sql="SELECT * FROM dbo.PT_V_STUDENTDORM WHERE ROOM_ID = '"+roomId+"'";
				List<Object[]> studentDorms =stuDormService.queryObjectBySql(sql);
				temp.setRoomName(studentDorms.get(0)[5]+"");
				/*zzk暂时注释DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Three);
				for (int i = 0; i < studentDorms.size(); i++) {
					String userId=studentDorms.get(i)[0]+"";
					Class clazz = temp.getClass();
					String methodName = "setCardResidue" + (i + 1);
					Method method = clazz.getDeclaredMethod(methodName, String.class);
					try {
						sql = "SELECT CAST(EmployeeName AS VARCHAR(60)) EmployeeName,CardValueXF   FROM	TC_Employee	LEFT OUTER JOIN "
    			 		+ "TC_Card ON TC_Employee.CardID = TC_Card.CARDID   WHERE CardStatusIDXF=1 and Student_id='"
								+ userId+ "'";
						List<Object[]> xf = stuDormService.ObjectQuerySql(sql);
						String value = xf.get(0)[0]+ ":" + xf.get(0)[1];
						method.invoke(temp, value);
					} catch (Exception e) {
						DBContextHolder.clearDBType();
						SysUser user=userService.get(userId);
						String value = user.getXm()+" 异常";
						method.invoke(temp, value);
						DBContextHolder.setDBType(DBContextHolder.DATA_SOURCE_Three);
					}
				}
				*/
				returnlist.add(temp);
			}catch (Exception e) {
				e.printStackTrace();
			} finally {
				DBContextHolder.clearDBType();
			}
		}

		return returnlist;
	}
}

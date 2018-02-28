package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.build.define.model.BuildRoominfo;
import com.zd.school.plartform.baseset.dao.BaseRoominfoDao;
import com.zd.school.plartform.baseset.service.BaseClassRoomDefineService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseFuncRoomDefineService;
import com.zd.school.plartform.baseset.service.BaseOfficeDefineService;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: BuildRoominfoServiceImpl Function: TODO ADD FUNCTION. Reason: TODO
 * ADD REASON(可选). Description: 教室信息实体Service接口实现类. date: 2016-08-23
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseRoominfoServiceImpl extends BaseServiceImpl<BuildRoominfo> implements BaseRoominfoService {
	private static Logger logger = Logger.getLogger(BaseRoominfoServiceImpl.class);

    @Resource
    public void setBuildRoominfoDao(BaseRoominfoDao dao) {
        this.dao = dao;
    }
    
	@Resource
	private BaseClassRoomDefineService classRoomService;// 教室service层接口
	@Resource
	private BaseDormDefineService dormRoomService; // 宿舍service层接口
	@Resource
	private BaseOfficeDefineService offRoomService; // 办公室service层接口
	@Resource
	private BaseFuncRoomDefineService funRoomService; // 功能室service层接口
	

    public Boolean doBatchAddRoom(BuildRoominfo roominfo, SysUser currentUser) {
        String benginChar = roominfo.getRoomCode();
        Integer roomCount = roominfo.getRoomCount();
        String areaId = roominfo.getAreaId();
        String roomType = "0";	//默认为 未定义房间
        String createUser = currentUser.getXm();
        BuildRoominfo saveRoom = null;
        String roomName = "";   
        int orderIndex=1;
        for (int i = 1; i <= roomCount; i++) {
        	if(i==0)
            	orderIndex = this.getDefaultOrderIndex(saveRoom);
        	
            roomName = benginChar + StringUtils.addString(String.valueOf(i), "0", 2, "L");
            saveRoom = new BuildRoominfo();
            saveRoom.setRoomName(roomName);
            saveRoom.setRoomCode(roomName);                      
            saveRoom.setOrderIndex(orderIndex++);
            saveRoom.setExtField01(roomName);
            saveRoom.setAreaId(areaId);
            saveRoom.setRoomType(roomType);
            saveRoom.setCreateUser(createUser);

            this.merge(saveRoom);
        }
        return true;       
    }

	@Override
	public Integer getCount(String roomName) {
		Integer conut=0;
		String hql=" select count(*) from BuildRoominfo where 1=1 ";
		if(roomName!=null){
			hql+=" and roomName = '"+roomName+"'";	
		}
		conut=this.getQueryCountByHql(hql);
		return conut;
	}

	@Override
	public Boolean doDeleteRoomDefine(String delIds, String xm,Map<String, Object> hashMap) {
		Boolean flag=true;
		String[] ids = delIds.split(",");
		String roomType = "";// 房间类型 1.宿舍，2.办公室，3.教室，5、功能室，0、未分配
		BuildRoominfo roomInfo = null;
		
		List<String> roomList=new ArrayList<>();
		for (int j = 0; j < ids.length; j++) {
			roomInfo = this.get(ids[j]); // 获取BuildRoominfo对象
			roomType = roomInfo.getRoomType();
			if (roomType.equals("1")) {
				flag = dormRoomService.delDormRoom(roomInfo, ids[j], xm);
				if (!flag){
					roomList.add(roomInfo.getRoomName());				
				}

			} else if (roomType.equals("2")) {
				flag = offRoomService.delOffRoom(roomInfo, ids[j], xm);
				if (!flag){
					roomList.add(roomInfo.getRoomName());				
				}			

			} else if (roomType.equals("3")) {
				flag = classRoomService.delClassRoom(roomInfo, ids[j], xm);
				if (!flag){
					roomList.add(roomInfo.getRoomName());				
				}		
				
			} else if (roomType.equals("5")) {
				flag = funRoomService.delFunRoom(roomInfo, ids[j], xm);
				if (!flag){
					roomList.add(roomInfo.getRoomName());			
				}
			}
		}
		if(roomList.size()>0){		
			hashMap.put("roomNames", roomList.stream().collect(Collectors.joining(",")).toString());
			return false;
		}
		
		return true;
	}

	@Override
	public Boolean doAddRoomDefine(BuildRoominfo entity, HttpServletRequest request, String userCh) throws IllegalAccessException, InvocationTargetException {
		boolean flag=false;
		String roomType = "";// 房间类型 1.宿舍，2.办公室，3.教室，5、功能室，0、未分配
		String id = ""; // BuildRoominfo的主键
		
		roomType = entity.getRoomType();
		id = entity.getUuid();// BuildRoominfo的uuid
		
		if (id != null) {
			if (roomType.equals("1")) {// 宿舍
				boolean cz = dormRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");// 判断该房间是否存在
				if (!cz) {
					String dormType = request.getParameter("dormType");// 宿舍类型
					String dormTypeLb = request.getParameter("dormTypeLb");// 宿舍类别

					String dormBedCount = request.getParameter("dormBedCount");// 床位数
					String dormChestCount = request.getParameter("dormChestCount");// 柜子数
					String dormPhone = request.getParameter("dormPhone");// 电话
					String dormFax = request.getParameter("dormFax");// 传真

					BuildDormDefine dormRoom = new BuildDormDefine();
					dormRoom.setDormType(dormType);
					dormRoom.setDormTypeLb(dormTypeLb);
					dormRoom.setDormBedCount(Integer.valueOf(dormBedCount));
					dormRoom.setDormChestCount(Integer.valueOf(dormChestCount));
					dormRoom.setDormPhone(dormPhone);
					dormRoom.setDormFax(dormFax);

					dormRoomService.addDormRoom(entity, dormRoom, id, userCh);		
					flag=true;
				}

			} else if (roomType.equals("2")) {// 办公室
				boolean cz = offRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (!cz) {
					offRoomService.addOffRoom(entity, id, userCh);
					flag=true;
				}
					
			} else if (roomType.equals("3")) {// 教室
				boolean cz = classRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (!cz){
					classRoomService.addClassRoom(entity, id, userCh);				
					flag=true;
				}
				
			} else if (roomType.equals("5")) {// 功能室
				boolean cz = funRoomService.IsFieldExist("roomId", id, "-1", "isdelete=0");
				if (!cz) {
					funRoomService.addFunRoom(entity, id, userCh);			
					flag=true;
				}
			}
		}
		
		return flag;
	}
    
}
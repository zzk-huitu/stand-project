package com.zd.school.plartform.baseset.service.Impl;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.build.define.model.BuildRoominfo ;
import com.zd.school.plartform.baseset.dao.BaseRoominfoDao;
import com.zd.school.plartform.baseset.service.BaseRoominfoService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: BuildRoominfoServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 教室信息实体Service接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseRoominfoServiceImpl extends BaseServiceImpl<BuildRoominfo> implements BaseRoominfoService{
	private static Logger logger = Logger.getLogger(BaseRoominfoServiceImpl.class);
    @Resource
    public void setBuildRoominfoDao(BaseRoominfoDao dao) {
        this.dao = dao;
    }

    public Boolean batchAddRoom(BuildRoominfo roominfo, SysUser currentUser) {
        String benginChar = roominfo.getRoomName();
        Integer roomCount = roominfo.getRoomCount();
        String areaId = roominfo.getAreaId();
        String roomType = roominfo.getRoomType();
        String createUser = currentUser.getXm();
        BuildRoominfo saveRoom = null;
        String roomName = "";       
        for (int i = 1; i <= roomCount; i++) {
            roomName = benginChar + StringUtils.addString(String.valueOf(i), "0", 2, "L");
            saveRoom = new BuildRoominfo();
            saveRoom.setRoomName(roomName);
            saveRoom.setOrderIndex(i);
            saveRoom.setExtField01(roomName);
            saveRoom.setAreaId(areaId);
            saveRoom.setRoomType(roomType);
            saveRoom.setCreateUser(createUser);

            this.merge(saveRoom);
        }
        return true;       
    }
}
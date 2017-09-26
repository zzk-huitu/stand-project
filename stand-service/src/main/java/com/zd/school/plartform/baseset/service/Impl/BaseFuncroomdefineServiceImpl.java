package com.zd.school.plartform.baseset.service.Impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.school.build.define.model.BuildFuncRoomDefine ;
import com.zd.school.plartform.baseset.dao.BaseFuncRoomDefineDao;
import com.zd.school.plartform.baseset.service.BaseFuncRoomDefineService;

/**
 * 
 * ClassName: BuildFuncroomdefinServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: BUILD_T_FUNCROOMDEFIN实体Service接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseFuncroomdefineServiceImpl extends BaseServiceImpl<BuildFuncRoomDefine> implements BaseFuncRoomDefineService{

    @Resource
    public void setBuildFuncroomdefinDao(BaseFuncRoomDefineDao dao) {
        this.dao = dao;
    }

}
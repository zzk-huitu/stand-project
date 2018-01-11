package com.zd.school.plartform.basedevice.dao.Impl;

import org.springframework.stereotype.Repository;

import com.zd.core.dao.BaseDaoImpl;
import com.zd.school.control.device.model.PtIrDeviceBrand ;
import com.zd.school.plartform.basedevice.dao.PtIrDeviceBrandDao;


/**
 * 
 * ClassName: PtIrDeviceBrandDaoImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 红外设备品牌型号(PT_IR_DEVICE_BRAND)实体Dao接口实现类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Repository
public class PtIrDeviceBrandDaoImpl extends BaseDaoImpl<PtIrDeviceBrand> implements PtIrDeviceBrandDao {
    public PtIrDeviceBrandDaoImpl() {
        super(PtIrDeviceBrand.class);
        // TODO Auto-generated constructor stub
    }
}
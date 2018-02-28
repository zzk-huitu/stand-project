package com.zd.school.plartform.basedevice.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.plartform.basedevice.dao.PtIrDeviceBrandDao;
import com.zd.school.plartform.basedevice.service.PtIrDeviceBrandService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.control.device.model.PtIrDeviceBrand ;

/**
 * 
 * ClassName: PtIrDeviceBrandServiceImpl
 * Function:  ADD FUNCTION. 
 * Reason:  ADD REASON(可选). 
 * Description: 红外设备品牌型号(PT_IR_DEVICE_BRAND)实体Service接口实现类.
 * date: 2017-01-12
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class PtIrDeviceBrandServiceImpl extends BaseServiceImpl<PtIrDeviceBrand> implements PtIrDeviceBrandService{
	
    @Resource
    public void setPtIrDeviceBrandDao(PtIrDeviceBrandDao dao) {
        this.dao = dao;
    }
	private static Logger logger = Logger.getLogger(PtIrDeviceBrandServiceImpl.class);
	
	@Override
	public PtIrDeviceBrand doAddEntity(PtIrDeviceBrand entity, SysUser currentUser) {
		PtIrDeviceBrand saveEntity = new PtIrDeviceBrand();
		
		List<String> excludedProp = new ArrayList<>();
		excludedProp.add("uuid");
		try {
			BeanUtils.copyProperties(saveEntity, entity,excludedProp);
		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		saveEntity.setCreateUser(currentUser.getXm()); // 设置修改人的中文名
		entity = this.merge(saveEntity);// 执行修改方法

		return entity;
		
	}
	
	@Override
	public PtIrDeviceBrand doUpdateEntity(PtIrDeviceBrand entity, SysUser currentUser) {
		// 先拿到已持久化的实体
		PtIrDeviceBrand perEntity = this.get(entity.getUuid());
		try {
			BeanUtils.copyPropertiesExceptNull(perEntity, entity);
			perEntity.setUpdateTime(new Date()); // 设置修改时间
			perEntity.setUpdateUser(currentUser.getXm()); // 设置修改人的中文名
			entity = this.merge(perEntity);// 执行修改方法
			
			/*若修改的是第三层的品牌名称，则一并把第四层的品牌名称修改*/
			if(entity.getLevel()==3){
				String hql="update PtIrDeviceBrand set brandname='"+entity.getBrandname()+"'"
						+ " where isDelete=0 and level=4 and parentNode='"+entity.getUuid()+"'";
				this.doExecuteCountByHql(hql);
			}
			return entity;
		} catch (IllegalAccessException e) {
			logger.error(e.getMessage());
			return null;
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage());
			return null;
		}
	}
}
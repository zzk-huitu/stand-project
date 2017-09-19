
package com.zd.school.plartform.system.service;

import java.util.List;

import com.zd.core.service.BaseService;
import com.zd.school.plartform.system.model.SysOperateLog;

public interface SysOperateLogService extends BaseService<SysOperateLog> {

	void multiAddEntity(List<SysOperateLog> lists);


}

package com.zd.school.jw.arrangecourse.service.Impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.model.ImportNotInfo;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.arrangecourse.dao.JwCourseArrangeDao ;
import com.zd.school.jw.arrangecourse.model.JwCourseArrange ;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService ;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.jw.eduresources.model.JwTBasecourse;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTBasecourseService;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.plartform.system.model.SysUser;

/**
 * 
 * ClassName: JwCourseArrangeServiceImpl
 * Function: TODO ADD FUNCTION. 
 * Reason: TODO ADD REASON(可选). 
 * Description: 排课课程表实体Service接口实现类.
 * date: 2016-08-23
 *
 * @author  luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class JwCourseArrangeServiceImpl extends BaseServiceImpl<JwCourseArrange> implements JwCourseArrangeService{

    @Resource
    public void setJwCourseArrangeDao(JwCourseArrangeDao dao) {
        this.dao = dao;
    }
    
    @Resource
	private JwTGradeclassService jwClassService;
    @Resource
	private JwTBasecourseService jtbService;
    @Resource
	private JwCourseteacherService courseTeacherService;
    
    
	@Override
	public List<ImportNotInfo> doImportCourse(Map<String, List<String>> gccMap, SysUser currentUser) {
		
		List<ImportNotInfo> listNotExit = new ArrayList<>();
		ImportNotInfo notExits = null;
		Integer notCount = 1;
		
		String schoolId = currentUser.getSchoolId();
		String schoolName = currentUser.getSchoolName();
		String andIsDelete = " and isDelete=0 ";
		String hql;
		
		String doResult = "";
		String title = "";
		String errorLevel = "";
		boolean isError = false;		
		
		for (String key : gccMap.keySet()) {
			title = key;
			doResult = "成功"; // 默认是成功
			isError = false;
					
			try{	
				
				List<JwCourseArrange> courseArranges = new ArrayList<JwCourseArrange>(); //排课课程表对象
				
				//key为年级班级名称
				/*
				int gcStrLength = key.length();	
				String grade = key.substring(0, 2);
				String gcName;
				if (gcStrLength == 4) {
					String classNum = key.substring(2, 3);
					gcName = grade + "(" + classNum + ")" + "班";
				} else {
					String classNum = key.substring(2, 4);
					gcName = grade + "(" + classNum + ")" + "班";
				}*/
				String[] keys = key.split("-");	//使用-作为分割，也可以直接写班级名称（若班级名称格式为 高一（1）班）
				String grade = "";
				String className = "";
				if(keys.length==2){
					grade=keys[0];
					className=keys[1];
				}else{			
					className=keys[0];
				}
				
			
				//查询此班级信息			
				hql = "from JwTGradeclass where className='" + className + "'" + andIsDelete;	
				List<JwTGradeclass> gcList=jwClassService.queryByHql(hql);
				JwTGradeclass gc=null;
				
				if(gcList.size()==1){
					gc = gcList.get(0);		
				}else{
					if(gcList.size()>1){
						isError=true;
						errorLevel = "错误";
						doResult = "系统中存在多个同名的班级："+className;				
					}else{
						isError=true;
						errorLevel = "错误";
						doResult = "系统中不存在此班级："+className;
					}
					
					notExits = new ImportNotInfo();
					notExits.setOrderIndex(notCount);
					notExits.setTitle(title);
					notExits.setErrorLevel(errorLevel);
					notExits.setErrorInfo(doResult);

					listNotExit.add(notExits);
					notCount++;
					continue;
				}
					
				
				//把课程信息插入到课程安排表中
				List<String> gccList = gccMap.get(key);
				int index = 0;
				for (int j = 1; j <= gccList.size() / 9; j++) {	//每天9门课，一星期5-7天
					
					if(isError==true)	//当出错时，再跳出这一层
						break;
					
					for (int i = 0; i < 9; i++) {
						JwCourseArrange jca;		//每天的课程，都一次性录入到同一条数据中				
						if(courseArranges.size()>i){
							jca = courseArranges.get(i);
						}else{
							jca = new JwCourseArrange();
							courseArranges.add(jca);
						}
						
						String cousreName = gccList.get(index);		//取出课程
						index++;
						
						//查询课程信息
						hql = "from JwTBasecourse where courseName='" + cousreName + "'" + andIsDelete;
						List<JwTBasecourse> baseCourseList= jtbService.queryByHql(hql);
						JwTBasecourse basecourse = null;
						if(baseCourseList.size()==1){
							basecourse = baseCourseList.get(0);		
						}else{
							if(baseCourseList.size()>1){
								isError=true;
								errorLevel = "错误";
								doResult = "系统中存在多个同名的课程："+cousreName;	
								break;	//跳出这一层
							}else{
								isError=true;
								errorLevel = "错误";
								doResult = "系统中不存在此课程信息："+cousreName;
								break;
							}
						}
							
							
						//查询任课教师信息
						hql = "from JwCourseteacher where courseId='" + basecourse.getUuid() + "' and claiId='"
								+ gc.getUuid() + "'" + andIsDelete;					
						
						List<JwCourseteacher> courseteachers = courseTeacherService.queryByHql(hql);
						String teacherGh = "";
						String teacherName = "";
						String teacherId = "";
						for (JwCourseteacher jwCourseteacher : courseteachers) {
							teacherId += jwCourseteacher.getTteacId() + ",";
							teacherGh += jwCourseteacher.getUserNumb() + ",";
							teacherName += jwCourseteacher.getXm() + ",";
						}
						if(teacherId.length()>0){
							teacherId = StringUtils.trimLast(teacherId);
							teacherGh = StringUtils.trimLast(teacherGh);
							teacherName = StringUtils.trimLast(teacherName);	
						}

						jca.setSchoolId(schoolId);
						jca.setSchoolName(schoolName);
						jca.setClassName(className);
						jca.setClaiId(gc.getUuid());
						jca.setTeachTime(i+1 + "");
						jca.setExtField05("0");
						jca.setIsDelete(0);

						switch (j) {
							case 1:
								jca.setCourseId01(basecourse.getUuid());
								jca.setCourseName01(basecourse.getCourseName());
								jca.setTteacId01(teacherId);
								jca.setTeacherGh01(teacherGh);
								jca.setTeacherName01(teacherName);
								break;
							case 2:
								jca.setCourseId02(basecourse.getUuid());
								jca.setCourseName02(basecourse.getCourseName());
								jca.setTteacId02(teacherId);
								jca.setTeacherGh02(teacherGh);
								jca.setTeacherName02(teacherName);
								break;
							case 3:
								jca.setCourseId03(basecourse.getUuid());
								jca.setCourseName03(basecourse.getCourseName());
								jca.setTteacId03(teacherId);
								jca.setTeacherGh03(teacherGh);
								jca.setTeacherName03(teacherName);
								break;
							case 4:
								jca.setCourseId04(basecourse.getUuid());
								jca.setCourseName04(basecourse.getCourseName());
								jca.setTteacId04(teacherId);
								jca.setTeacherGh04(teacherGh);
								jca.setTeacherName04(teacherName);
								break;
							case 5:
								jca.setCourseId05(basecourse.getUuid());
								jca.setCourseName05(basecourse.getCourseName());
								jca.setTteacId05(teacherId);
								jca.setTeacherGh05(teacherGh);
								jca.setTeacherName05(teacherName);
								break;
							case 6:
								jca.setCourseId06(basecourse.getUuid());
								jca.setCourseName06(basecourse.getCourseName());
								jca.setTteacId06(teacherId);
								jca.setTeacherGh06(teacherGh);
								jca.setTeacherName06(teacherName);
								break;
							case 7:
								jca.setCourseId07(basecourse.getUuid());
								jca.setCourseName07(basecourse.getCourseName());
								jca.setTteacId07(teacherId);
								jca.setTeacherGh07(teacherGh);
								jca.setTeacherName07(teacherName);
								break;
						}
					}

				}
				
				//当此班级的课表信息不出现错误时，那就入库
				if(isError==false){
					for (JwCourseArrange jwCourseArrange : courseArranges) {
						this.merge(jwCourseArrange);
					}
				}
						
			}catch (Exception e) {
				
				errorLevel = "错误";
				doResult = "导入失败；异常信息：" + e.getMessage();
			}
			
			if (!"成功".equals(doResult)) {
				// List<Map<String, Object>>
				notExits = new ImportNotInfo();
				notExits.setOrderIndex(notCount);
				notExits.setTitle(title);
				notExits.setErrorLevel(errorLevel);
				notExits.setErrorInfo(doResult);

				listNotExit.add(notExits);
				notCount++;
			}
		}
		
		return listNotExit;
	}


	@Override
	public void doCouseUse(String[] idArr, String[] classIdArr, String[] teachTimeArr, String xm) {
		// TODO Auto-generated method stub
		//将班级下之前启用的课表，设置为不启用
		for(int i=0;i<idArr.length;i++){
			this.updateByProperties(
					new String[]{"claiId","isDelete","teachTime"},
					new Object[]{classIdArr[i],0,teachTimeArr[i]},
					new String[]{"extField05","updateUser","updateTime"},
					new Object[]{"0",xm,new Date()});	
		}
		
		//再设置启用的课表
		this.updateByProperties("uuid", idArr,
				new String[]{"extField05","updateUser","updateTime"},
				new Object[]{"1",xm,new Date()});		
		
	}

}
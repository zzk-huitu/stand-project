package com.zd.school.jw.arrangecourse.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.StatuVeriable;
import com.zd.core.model.extjs.ExtDataFilter;
import com.zd.core.model.extjs.QueryResult;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.core.util.JsonBuilder;
import com.zd.core.util.ModelUtil;
import com.zd.core.util.StringUtils;
import com.zd.school.jw.arrangecourse.dao.JwCourseteacherDao;
import com.zd.school.jw.arrangecourse.model.JwCourseArrange;
import com.zd.school.jw.arrangecourse.model.JwCourseteacher;
import com.zd.school.jw.arrangecourse.service.JwCourseArrangeService;
import com.zd.school.jw.arrangecourse.service.JwCourseteacherService;
import com.zd.school.jw.eduresources.model.JwTGrade;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseUserdeptjob;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysDeptjobService;
import com.zd.school.plartform.system.service.SysJobService;
import com.zd.school.plartform.system.service.SysOrgService;
import com.zd.school.plartform.system.service.SysUserService;
import com.zd.school.plartform.system.service.SysUserdeptjobService;
import com.zd.school.teacher.teacherinfo.service.TeaTeacherbaseService;

/**
 * 
 * ClassName: JwCourseteacherServiceImpl Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: 教师任课信息(JW_T_COURSETEACHER)实体Service接口实现类.
 * date: 2016-08-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class JwCourseteacherServiceImpl extends BaseServiceImpl<JwCourseteacher> implements JwCourseteacherService {

    @Resource
    public void setJwCourseteacherDao(JwCourseteacherDao dao) {
        this.dao = dao;
    }
    
    @Resource
	private SysJobService jobService;
	@Resource
	private SysDeptjobService deptJobService;
	@Resource
	private SysUserdeptjobService userDeptJobService;

	@Resource
	private JwCourseArrangeService courseArrangeService;
	
    @Resource
    private SysOrgService orgService;

    @Resource
    private SysUserService userService;
    
    @Resource
    private JwTGradeclassService gradeClassService;
    
    @Resource 
    private TeaTeacherbaseService teacherService;    
    
    
    /**
     * 
     * doAddCourseTeacher:设置任课教师.
     * 
     * @author luoyibo
     * @param studyYeah
     *            任课学年
     * @param semester
     *            任课学期
     * @param jsonData
     *            需要设置的教师数据
     * @param removeIds
     *            要移除的教师数据
     * @param currentUser
     *            当前操作者
     * @return String
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws @since
     *             JDK 1.8
     */
    @SuppressWarnings("unchecked")
    @Override
    public Boolean doAddCourseTeacher(Integer studyYeah, String semester, String jsonData, String removeIds,
            SysUser currentUser) throws IllegalAccessException, InvocationTargetException {
        Boolean strData = false;

        List<JwCourseteacher> addList = (List<JwCourseteacher>) JsonBuilder.getInstance().fromJsonArray(jsonData,
                JwCourseteacher.class);
        for (JwCourseteacher addTeacher : addList) {
            JwCourseteacher saveEntity = new JwCourseteacher();
            BeanUtils.copyPropertiesExceptNull(addTeacher, saveEntity);
            addTeacher.setOrderIndex(0);//排序
            //增加时要设置创建人
            addTeacher.setCreateUser(currentUser.getXm()); //创建人
            //持久化到数据库
            this.merge(addTeacher);

            //根据设置的班级和课程来处理教师所在的部门
            //加入到班级对应的部门
            SysUser user = userService.get(addTeacher.getTteacId());
            Set<BaseOrg> classDept = null;//user.getUserDepts();
            BaseOrg org = orgService.get(addTeacher.getClaiId());
            if (ModelUtil.isNotNull(org)) {
                classDept.add(org);
            }

            //加入到科目对应的部门
            BaseOrg couseDept = this.getCourseDept(addTeacher.getClaiId(), addTeacher.getCourseId());
            if (ModelUtil.isNotNull(couseDept)) {
                classDept.add(couseDept);
                //user.setUserDepts(classDept);
            }
            user.setUpdateTime(new Date());
            user.setUpdateUser(currentUser.getXm());
            userService.merge(user);
        }

        if (StringUtils.isEmpty(removeIds)) {
            //writeJSON(response, jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
            //return;
        } else {
            this.doLogicDelOrRestore(removeIds, StatuVeriable.ISDELETE,currentUser.getXm());
        }

        strData = true;

        return strData;
    }

    public BaseOrg getCourseDept(String classId, String courseId) {
        BaseOrg couseDept = null;
        BaseOrg classDept = orgService.get(classId);
        String[] classDeptTreIds = classDept.getTreeIds().split(",");
        List<BaseOrg> courseDeptList = orgService.queryByProerties("extField01", courseId);
        for (BaseOrg baseOrg : courseDeptList) {
            String[] treeIds = baseOrg.getTreeIds().split(",");
            if (classDeptTreIds[1].equals(treeIds[1])) {
                couseDept = baseOrg;
                break;
            }
        }
        return couseDept;
    }

    @Override
    public Boolean doDelCourseTeacher(String delIds, SysUser currentUser) {
        Boolean reResult = false;
        String[] idStrings = delIds.split(",");
        List<JwCourseteacher> relaceList = this.queryByProerties("uuid", idStrings);
		for (JwCourseteacher jwCourseteacher : relaceList){
			//删除任课教师表
			jwCourseteacher.setUpdateTime(new Date());
			jwCourseteacher.setUpdateUser(currentUser.getXm());
			jwCourseteacher.setIsDelete(1);
			//删除部门岗位
			String[] propName = new String[] { "jobName", "isDelete" };
			Object[] propValue = new Object[] { "教师", 0 };
			BaseJob job = jobService.getByProerties(propName, propValue);
			propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
			propValue = new Object[] { jwCourseteacher.getTteacId(), jwCourseteacher.getClaiId(), job.getUuid(), 0 };
			BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
			userdeptjob.setIsDelete(1);
			userdeptjob.setUpdateTime(new Date());
			userdeptjob.setUpdateUser(currentUser.getXm());
			userDeptJobService.merge(userdeptjob);
			
			//删除课表
			StringBuffer sql = new StringBuffer("SELECT ISNULL(MAX(UUID),'null') FROM JW_T_COURSE_ARRANGE");
			sql.append(" WHERE EXT_FIELD05=1");
			sql.append(" AND CLAI_ID='" + jwCourseteacher.getClaiId() + "'");
			for (int i = 1; i <= 7; i++) {
				StringBuffer sBuffer = new StringBuffer(
						" AND COURSE_ID0" + i + "='" + jwCourseteacher.getCourseId() + "'");
				String str = sql.toString() + sBuffer.toString();
				List<Object[]> objects = this.queryObjectBySql(str);
				String uuid = objects.get(0) + "";
				if (!uuid.equals("null")) {
					/*
					JwCourseArrange courseArrange = courseArrangeService.get(uuid);
					Class clazz = courseArrange.getClass();
					String methodName = "getTteacId0" + i;
					Method method = clazz.getDeclaredMethod(methodName);
					String tteacId=method.invoke(courseArrange)+"";
					
					methodName = "getTeacherName0" + i;
					method = clazz.getDeclaredMethod(methodName);
					String teacherName=method.invoke(courseArrange)+"";
					if (StringUtils.isNotEmpty(tteacId)) {
						if (tteacId.indexOf(jwCourseteacher.getTteacId())==0) {
							tteacId=tteacId.replace(jwCourseteacher.getTteacId()+",", "");
							teacherName=teacherName.replace(jwCourseteacher.getXm()+",", "");
						} else {
							tteacId=tteacId.replace(","+jwCourseteacher.getTteacId(), "").replace(jwCourseteacher.getTteacId(), "");
							teacherName=teacherName.replace(","+jwCourseteacher.getXm(), "").replace(jwCourseteacher.getXm(), "");
						}
					}
					methodName = "setTteacId0" + i;
					method = clazz.getDeclaredMethod(methodName, String.class);
					method.invoke(courseArrange,tteacId);
					methodName = "setTeacherName0" + i;
					method = clazz.getDeclaredMethod(methodName, String.class);
					method.invoke(courseArrange, teacherName);
					courseArrangeService.merge(courseArrange);
					*/
				}
			}
			reResult=true;
		}
			
        return reResult;

    }

	@Override
	public QueryResult<JwCourseteacher> getClassCourseTeacherList(Integer start, Integer limit, String sort,
			String filter, Boolean isDelete, String claiId, Integer claiLevel) {
        String queryFilter = filter;
        String qrClassId = "";
        ExtDataFilter selfFilter = new ExtDataFilter();
        StringBuffer sbClass = new StringBuffer();
        //指定了班级或年级
        if (StringUtils.isNotEmpty(claiId)) {
            switch (claiLevel) {
            case 1:
                //为1级是查询所有的数据
                break;
            case 2:
                //为2级是查询年级及年级下的班级的数据
                List<JwTGradeclass> classLists = gradeClassService.queryByProerties("graiId", claiId);
                for (JwTGradeclass gc : classLists) {
                    sbClass.append(gc.getUuid() + ",");
                }
                sbClass.append(claiId);
                qrClassId = sbClass.toString();
                break;
            case 3:
                //是3级，查询班级的数据
                qrClassId = claiId;
                break;
            default:
                break;
            }
        }
        //如果要根据指定的ID过滤
        if (StringUtils.isNotEmpty(qrClassId)) {
            //组装指定的过滤条件
            selfFilter = (ExtDataFilter) JsonBuilder.getInstance().fromJson(
                    "{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + qrClassId + "\",\"field\":\"claiId\"}",
                    ExtDataFilter.class);
            //检查有没有外部传入的过滤条件
            if (StringUtils.isNotEmpty(filter)) {
                //有外部传入的条件，要合并上去
                List<ExtDataFilter> listFilters = (List<ExtDataFilter>) JsonBuilder.getInstance().fromJsonArray(filter,
                        ExtDataFilter.class);
                listFilters.add(selfFilter);

                queryFilter = JsonBuilder.getInstance().buildObjListToJson((long) listFilters.size(), listFilters,
                        false);
            } else {
                queryFilter = "[{\"type\":\"string\",\"comparison\":\"in\",\"value\":\"" + qrClassId
                        + "\",\"field\":\"claiId\"}]";
            }
        }
        QueryResult<JwCourseteacher> qr = this.queryPageResult(start, limit, sort, queryFilter, true);
//        QueryResult<JwCourseteacher> teacherList = new QueryResult<TeaTeacherbase>();
//        List<TeaTeacherbase> newList = new ArrayList<TeaTeacherbase>();
//        for (JwCourseteacher t : qr.getResultList()) {
//			TeaTeacherbase teacherbase = teacherService.get(t.getTteacId());
//			String jobInfo = teacherService.getTeacherJobs(teacherbase);
//			String[] strings = jobInfo.split(",");
//			teacherbase.setJobId(strings[0]);
//			teacherbase.setJobName(strings[1]);
//			
//			String deptInfo = teacherService.getTeacherDepts(teacherbase);
//			strings = deptInfo.split(",");
//			teacherbase.setDeptName(strings[1]);	
//			newList.add(teacherbase);			
//		}
//        teacherList.setResultList(newList);
//        teacherList.setTotalCount(qr.getTotalCount());
        return qr;
	}
	
	@Override
	public String updateZjsByClassId(String classid,String courseid, int zjs) {
		JwTGrade grade =gradeClassService.findJwTGradeByClaiId(classid);
		String hql ="update JwCourseteacher ct set ct.acszjs="+zjs+" where "
				+ " ct.claiId in( select gc.uuid from JwTGradeclass gc where gc.graiId"
				+ " in (select uuid from JwTGrade  where sectionCode='"+grade.getSectionCode()+"' )) and  ct.courseId='"+courseid+"' ";
		doExecuteCountByHql(hql);
		return null;
	}

	@Override
	public Boolean doReplaceCourseTeacher(int studyYear, String semester, String jsonData, String replaceCouTea,
			SysUser sysuser) {
		Boolean strData = false;
		try {
			List<JwCourseteacher> addList = (List<JwCourseteacher>) JsonBuilder.getInstance().fromJsonArray(jsonData,
					JwCourseteacher.class);
			String[] replaceCouTeaArr = replaceCouTea.split(",");
			List<JwCourseteacher> relaceList = this.queryByProerties("uuid", replaceCouTeaArr);
			for (JwCourseteacher jwCourseteacher : relaceList) {
				StringBuffer sql = new StringBuffer("SELECT ISNULL(MAX(UUID),'null') FROM JW_T_COURSE_ARRANGE");
				sql.append(" WHERE EXT_FIELD05=1");
				sql.append(" AND CLAI_ID='" + jwCourseteacher.getClaiId() + "'");
				for (int i = 1; i <= 7; i++) {
					StringBuffer sBuffer = new StringBuffer(
							" AND TTEAC_ID0" + i + "='" + jwCourseteacher.getTteacId() + "'");
					String str = sql.toString() + sBuffer.toString();
					List<Object[]> objects = this.queryObjectBySql(str);
					String uuid = objects.get(0) + "";
					if (!uuid.equals("null")) {
						JwCourseArrange courseArrange = courseArrangeService.get(uuid);
						Class clazz = courseArrange.getClass();
						String methodName = "setTteacId0" + i;
						Method method = clazz.getDeclaredMethod(methodName, String.class);
						method.invoke(courseArrange, addList.get(0).getTteacId());
						methodName = "setTeacherName0" + i;
						method = clazz.getDeclaredMethod(methodName, String.class);
						method.invoke(courseArrange, addList.get(0).getXm());
						courseArrangeService.merge(courseArrange);
					}
				}

			}

			for (JwCourseteacher addTeacher : addList) {
				JwCourseteacher saveEntity = new JwCourseteacher();
				BeanUtils.copyPropertiesExceptNull(addTeacher, saveEntity);
				addTeacher.setOrderIndex(0);// 排序
				// 增加时要设置创建人
				addTeacher.setCreateUser(sysuser.getXm()); // 创建人
				// 持久化到数据库
				this.merge(addTeacher);

				// 根据设置的班级和课程来处理教师所在的部门
				// 加入到班级对应的部门
				SysUser user = userService.get(addTeacher.getTteacId());
				Set<BaseOrg> classDept = null;//user.getUserDepts();
				BaseOrg org = orgService.get(addTeacher.getClaiId());
				if (ModelUtil.isNotNull(org)) {
					classDept.add(org);
				}

				// 加入到科目对应的部门
				BaseOrg couseDept = this.getCourseDept(addTeacher.getClaiId(), addTeacher.getCourseId());
				if (ModelUtil.isNotNull(couseDept)) {
					classDept.add(couseDept);
					//user.setUserDepts(classDept);
				}
				user.setUpdateTime(new Date());
				user.setUpdateUser(sysuser.getXm());
				userService.merge(user);
				
				//mjService.addMjByClaiId(addTeacher.getClaiId());
			}

			if (StringUtils.isEmpty(replaceCouTea)) {
				// writeJSON(response,
				// jsonBuilder.returnSuccessJson("'没有传入删除主键'"));
				// return;
			} else {
//				String[] idStrings=replaceCouTea.split(",");
//				for (String id : idStrings) {
//					JwCourseteacher temp=this.get(id);
//					mjService.delMjByClaiId(temp.getClaiId());
//				}
				this.doLogicDelOrRestore(replaceCouTea, StatuVeriable.ISDELETE,sysuser.getXm());
			}

			strData = true;

		} catch (Exception e) {
			e.printStackTrace();
			strData = false;
		}

		return strData;
	}

	@Override
	public void updatePubliceClass(String claiId, String courseId, String publicClassid) {
		// TODO Auto-generated method stub
		JwTGrade grade = gradeClassService.findJwTGradeByClaiId(courseId);
		String hql = "update JwCourseteacher  ct set ct.publicclassid='" + publicClassid + "'  where ct.uuid in ("
				+ " select c.uuid from JwTGradeclass g, JwCourseteacher c where" + " c.claiId=g.uuid  and c.courseId='"
				+ courseId + "'  and   g.graiId   ='" + grade.getUuid() + "' ) ";

		doExecuteCountByHql(hql);
	}
	
	
}
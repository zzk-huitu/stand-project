package com.zd.school.jw.arrangecourse.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
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
import com.zd.school.plartform.baseset.model.BaseDeptjob;
import com.zd.school.plartform.baseset.model.BaseJob;
import com.zd.school.plartform.baseset.model.BaseOrg;
import com.zd.school.plartform.baseset.model.BaseUserdeptjob;
import com.zd.school.plartform.comm.model.CommTreeChk;
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
    
    @Resource
	private RedisTemplate<String, Object> redisTemplate;

    
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
     * @throws SecurityException 
     * @throws NoSuchMethodException 
     * @throws InvocationTargetException 
     * @throws IllegalAccessException 
     * @throws @since
     *             JDK 1.8
     */
    @SuppressWarnings("unchecked")
    @Override
    public Boolean doAddCourseTeacher(String jsonData,SysUser currentUser) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException, SecurityException  {
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
            SysUser user = userService.get(addTeacher.getTteacId());			
			String[] propName = new String[] { "jobName", "isDelete" };
			Object[] propValue = new Object[] { "教师", 0 };
			BaseJob job = jobService.getByProerties(propName, propValue);
			if(job!=null){
				propName = new String[] { "jobId", "deptId", "isDelete" };
				propValue = new Object[] { job.getUuid(), addTeacher.getClaiId(), 0 };
				BaseDeptjob deptjob = deptJobService.getByProerties(propName, propValue);
				if(deptjob!=null){
					propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
					propValue = new Object[] { user.getUuid(), addTeacher.getClaiId(), job.getUuid(), 0 };
					BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
					if(userdeptjob==null){
						userdeptjob = new BaseUserdeptjob();
						userdeptjob.setCreateUser(currentUser.getXm());
						userdeptjob.setCreateTime(new Date());
						userdeptjob.setUserId(user.getUuid());
						userdeptjob.setDeptId(addTeacher.getClaiId());
						userdeptjob.setJobId(job.getUuid());
						userdeptjob.setDeptjobId(deptjob.getUuid());
						userdeptjob.setMasterDept(0);
						userDeptJobService.merge(userdeptjob);
						
						user.setUpdateTime(new Date());
						user.setUpdateUser(currentUser.getXm());
						userService.merge(user);
						
						//清除这个用户的部门树缓存，以至于下次读取时更新缓存
				     	this.delDeptTreeByUsers(user.getUuid());
						
					}
				}			
			}
			
			//更新课表的教师信息
			StringBuffer sql = new StringBuffer("SELECT ISNULL(MAX(UUID),'null') FROM JW_T_COURSE_ARRANGE");
			sql.append(" WHERE ISDELETE=0 AND EXT_FIELD05=1");
			sql.append(" AND CLAI_ID='" + addTeacher.getClaiId() + "'");
			for (int i = 1; i <= 7; i++) {
				StringBuffer sBuffer = new StringBuffer(
						" AND COURSE_ID0" + i + "='" + addTeacher.getCourseId() + "'");
				String str = sql.toString() + sBuffer.toString();
				List<Object[]> objects = this.queryObjectBySql(str);
				String uuid = objects.get(0) + "";
				if (!uuid.equals("null")) {
					JwCourseArrange courseArrange = courseArrangeService.get(uuid);
					Class clazz = courseArrange.getClass();
					
					String methodName = "getTteacId0" + i;
					Method method = clazz.getDeclaredMethod(methodName);
					String tteacId=method.invoke(courseArrange)+"";
					
					methodName = "getTeacherName0" + i;
					method = clazz.getDeclaredMethod(methodName);
					String teacherName=method.invoke(courseArrange)+"";
					if (StringUtils.isNotEmpty(tteacId)) {
						tteacId+=","+addTeacher.getTteacId();
						teacherName+=","+addTeacher.getXm();
					}else{
						tteacId=addTeacher.getTteacId();
						teacherName=addTeacher.getXm();
					}
					methodName = "setTteacId0" + i;
					method = clazz.getDeclaredMethod(methodName, String.class);
					method.invoke(courseArrange,tteacId);
					methodName = "setTeacherName0" + i;
					method = clazz.getDeclaredMethod(methodName, String.class);
					method.invoke(courseArrange, teacherName);
					courseArrangeService.merge(courseArrange);
				}
			}		
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
    public Boolean doDelCourseTeacher(String delIds, SysUser currentUser) throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        Boolean reResult = false;
        String[] idStrings = delIds.split(",");
        List<JwCourseteacher> relaceList = this.queryByProerties("uuid", idStrings);
		for (JwCourseteacher jwCourseteacher : relaceList){
				
			//删除部门岗位（存在问题，当一名教师能教授多门课程时，若删除了一门，那么这个教师在此班级的部门岗位也被删除了）
			String[] propName = new String[] { "jobName", "isDelete" };
			Object[] propValue = new Object[] { "教师", 0 };
			BaseJob job = jobService.getByProerties(propName, propValue);
			if(job!=null){
				propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
				propValue = new Object[] { jwCourseteacher.getTteacId(), jwCourseteacher.getClaiId(), job.getUuid(), 0 };
				BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
				if(userdeptjob!=null){	//在事务中，若第一次循环设置为了isdelete=1，那么第二次同样的条件查询是查不到该数据，即会预先执行。
					//查询此人员是否在此班级任课多门
					String hql="select count(*) from JwCourseteacher a where a.isDelete=0 "
							+ " and a.claiId='"+jwCourseteacher.getClaiId()+"' and tteacId='"+jwCourseteacher.getTteacId()+"'";
					Integer num=this.getQueryCountByHql(hql);
					boolean del=false;
					if(num>1){
						//当num大于1时，就查询当前删除的数据列表中，是否是存在这些多门课程
						long num2=relaceList.stream()
								.filter(x->x.getTteacId().equals(jwCourseteacher.getTteacId()))
								.filter(x->x.getClaiId().equals(jwCourseteacher.getClaiId()))
								.count();
						if(num==num2){
							del=true;
						}
					}else
						del=true;
					
					if(del==true){
						userdeptjob.setIsDelete(1);
						userdeptjob.setUpdateTime(new Date());
						userdeptjob.setUpdateUser(currentUser.getXm());
						userDeptJobService.merge(userdeptjob);
						
						// 清除这个用户的部门树缓存，以至于下次读取时更新缓存
				     	this.delDeptTreeByUsers(jwCourseteacher.getTteacId());
					}									
				}			
			}
					
			//删除课表（修改课表中的教师信息）
			StringBuffer sql = new StringBuffer("SELECT ISNULL(MAX(UUID),'null') FROM JW_T_COURSE_ARRANGE");
			sql.append(" WHERE  ISDELETE=0 AND EXT_FIELD05=1");
			sql.append(" AND CLAI_ID='" + jwCourseteacher.getClaiId() + "'");
			for (int i = 1; i <= 7; i++) {
				StringBuffer sBuffer = new StringBuffer(
						" AND COURSE_ID0" + i + "='" + jwCourseteacher.getCourseId() + "'");
				String str = sql.toString() + sBuffer.toString();
				List<Object[]> objects = this.queryObjectBySql(str);
				String uuid = objects.get(0) + "";
				if (!uuid.equals("null")) {				
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
				}
			}
			
			//删除任课教师表
			jwCourseteacher.setUpdateTime(new Date());
			jwCourseteacher.setUpdateUser(currentUser.getXm());
			jwCourseteacher.setIsDelete(1);
			this.merge(jwCourseteacher);
			reResult=true;
		} 
		
        return reResult;

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
	public void updatePubliceClass(String claiId, String courseId, String publicClassid) {
		// TODO Auto-generated method stub
		JwTGrade grade = gradeClassService.findJwTGradeByClaiId(courseId);
		String hql = "update JwCourseteacher  ct set ct.publicclassid='" + publicClassid + "'  where ct.uuid in ("
				+ " select c.uuid from JwTGradeclass g, JwCourseteacher c where" + " c.claiId=g.uuid  and c.courseId='"
				+ courseId + "'  and   g.graiId   ='" + grade.getUuid() + "' ) ";

		doExecuteCountByHql(hql);
	}

	@Override
	public CommTreeChk getUserRightDeptDisciplineTree(String rootId, SysUser currentUser) {
		//1.查询部门的数据，并封装到实体类中
		List<CommTreeChk> list = orgService.getUserRightDeptDisciplineTreeList(currentUser);
		
		//2.找到根节点
		CommTreeChk root = new CommTreeChk();
		for (CommTreeChk node : list) {			
			//if (!(StringUtils.isNotEmpty(node.getParent()) && !node.getId().equals(rootId))) {
			if ( StringUtils.isEmpty(node.getParent()) || node.getId().equals(rootId)) {
				root = node;
				list.remove(node);
				break;
			}
		}
		
		//3.递归组装children
		createTreeChildren(list, root);
		
		return root;
	}
	private void createTreeChildren(List<CommTreeChk> childrens, CommTreeChk root) {
		String parentId = root.getId();
		for (int i = 0; i < childrens.size(); i++) {
			CommTreeChk node = childrens.get(i);
			if (StringUtils.isNotEmpty(node.getParent()) && node.getParent().equals(parentId)) {
				root.getChildren().add(node);
				createTreeChildren(childrens, node);
			}
			if (i == childrens.size() - 1) {
				if (root.getChildren().size() < 1) {
					root.setLeaf(true);
				}
				return;
			}
		}
	}
	
	/**
	 * 删除这个部门下所有用户的部门权限的缓存数据
	 * 
	 * @param userIds
	 */
	public void delDeptTreeByUsers(Object... userIds) {
		// TODO Auto-generated method stub
		/* 删除用户的菜单redis数据，以至于下次刷新或请求时，可以加载最新数据 */
		if (userIds.length > 0) {
			HashOperations<String, String, Object> hashOper = redisTemplate.opsForHash();
			hashOper.delete("userRightDeptTree", userIds);
			hashOper.delete("userRightDeptClassTree", userIds);		
			hashOper.delete("userRightDeptDisciplineTree", userIds);	
		}
	}

	@Override
	public QueryResult<JwCourseteacher> getClassCourseTeacherList(Integer start, Integer limit, String sort,
			String filter, Boolean isDelete, String claiId, Integer claiLevel) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Integer doReplaceCourseTeacher(String jctUuid, String teaId, SysUser sysUser) throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		// TODO Auto-generated method stub
		JwCourseteacher jct = this.get(jctUuid);
		SysUser teaInfo=userService.get(teaId);
		
		//1.判断新教师，是否有在此班级上任课
		String[] propName = new String[] { "claiId", "tteacId","studyYear","semester","courseId","isDelete" };
		Object[] propValue = new Object[] { jct.getClaiId(),teaId,jct.getStudyYear(),jct.getSemester(),jct.getCourseId(), 0 };
		JwCourseteacher tempJct = this.getByProerties(propName, propValue);
		if(tempJct!=null)
			return -1;
		
		//2.判断此人在此班级是否还有其他任课，并确定是否删除他的部门岗位
		//删除部门岗位（存在问题，当一名教师能教授多门课程时，若删除了一门，那么这个教师在此班级的部门岗位也被删除了）
		propName = new String[] { "jobName", "isDelete" };
		propValue = new Object[] { "教师", 0 };
		BaseJob job = jobService.getByProerties(propName, propValue);
		if(job!=null){
			propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
			propValue = new Object[] { jct.getTteacId(), jct.getClaiId(), job.getUuid(), 0 };
			BaseUserdeptjob userdeptjob=userDeptJobService.getByProerties(propName, propValue);
			if(userdeptjob!=null){
				//查询此人员是否在此班级任课多门
				String hql="select count(*) from JwCourseteacher a where a.isDelete=0 "
						+ " and a.claiId='"+jct.getClaiId()+"' and tteacId='"+jct.getTteacId()+"'";
				Integer num=this.getQueryCountByHql(hql);
				boolean del=false;
				if(num==1)
					del=true;
				
				if(del==true){
					userdeptjob.setIsDelete(1);
					userdeptjob.setUpdateTime(new Date());
					userdeptjob.setUpdateUser(sysUser.getXm());
					userDeptJobService.merge(userdeptjob);
					
					// 清除这个用户的部门树缓存，以至于下次读取时更新缓存
			     	this.delDeptTreeByUsers(jct.getTteacId());
				}									
			}			
		}
		
		//3.判断新教师是否已有此部门岗位，并确定是否加入部门岗位，
		propName = new String[] { "userId", "deptId", "jobId", "isDelete" };
		propValue = new Object[] { teaId, jct.getClaiId(), job.getUuid(), 0 };
		BaseUserdeptjob userdeptjob2=userDeptJobService.getByProerties(propName, propValue);
		if(userdeptjob2==null){
			userdeptjob2 = new BaseUserdeptjob();
			userdeptjob2.setCreateUser(sysUser.getXm());
			userdeptjob2.setCreateTime(new Date());
			userdeptjob2.setUserId(teaId);
			userdeptjob2.setDeptId(jct.getClaiId());
			userdeptjob2.setJobId(job.getUuid());
			userdeptjob2.setDeptjobId(jct.getUuid());
			userdeptjob2.setMasterDept(0);
			userDeptJobService.merge(userdeptjob2);
		
			//清除这个用户的部门树缓存，以至于下次读取时更新缓存
	     	this.delDeptTreeByUsers(teaId);
	
		}
		
		//4.更新课表上的教师信息，采用relace的方式
		StringBuffer sql = new StringBuffer("SELECT ISNULL(MAX(UUID),'null') FROM JW_T_COURSE_ARRANGE");
		sql.append(" WHERE  ISDELETE=0 AND  EXT_FIELD05=1");
		sql.append(" AND CLAI_ID='" + jct.getClaiId() + "'");
		for (int i = 1; i <= 7; i++) {
			StringBuffer sBuffer = new StringBuffer(
					" AND COURSE_ID0" + i + "='" + jct.getCourseId() + "'");
			String str = sql.toString() + sBuffer.toString();
			List<Object[]> objects = this.queryObjectBySql(str);
			String uuid = objects.get(0) + "";
			if (!uuid.equals("null")) {				
				JwCourseArrange courseArrange = courseArrangeService.get(uuid);
				Class clazz = courseArrange.getClass();
				String methodName = "getTteacId0" + i;
				Method method = clazz.getDeclaredMethod(methodName);
				String tteacId=method.invoke(courseArrange)+"";
				
				methodName = "getTeacherName0" + i;
				method = clazz.getDeclaredMethod(methodName);
				String teacherName=method.invoke(courseArrange)+"";
				
				if(StringUtils.isNotEmpty(tteacId)){
					tteacId=tteacId.replace(jct.getTteacId(), teaInfo.getUuid());
					teacherName=teacherName.replace(jct.getXm(), teaInfo.getXm());
				}else{
					tteacId = teaInfo.getUuid();
					teacherName = teaInfo.getXm();
				}
							
				methodName = "setTteacId0" + i;
				method = clazz.getDeclaredMethod(methodName, String.class);
				method.invoke(courseArrange,tteacId);
				methodName = "setTeacherName0" + i;
				method = clazz.getDeclaredMethod(methodName, String.class);
				method.invoke(courseArrange, teacherName);
				courseArrangeService.merge(courseArrange);
			}
		}
		
		//5.更新courseTeacher的teacherId值
		jct.setUpdateTime(new Date());
		jct.setUpdateUser(sysUser.getXm());
		jct.setTteacId(teaInfo.getUuid());
		this.merge(jct);
		
		return 1;
	}
	
	
}
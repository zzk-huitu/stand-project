package com.zd.school.plartform.baseset.service.Impl;

import java.lang.reflect.InvocationTargetException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zd.core.constant.AdminType;
import com.zd.core.service.BaseServiceImpl;
import com.zd.core.util.BeanUtils;
import com.zd.school.build.allot.model.DormStudentDorm;
import com.zd.school.build.allot.model.JwClassDormAllot;
import com.zd.school.build.define.model.BuildDormDefine;
import com.zd.school.jw.eduresources.model.JwTGradeclass;
import com.zd.school.jw.eduresources.service.JwTGradeclassService;
import com.zd.school.plartform.baseset.dao.BaseStudentDormDao;
import com.zd.school.plartform.baseset.service.BaseClassDormAllotService;
import com.zd.school.plartform.baseset.service.BaseDormDefineService;
import com.zd.school.plartform.baseset.service.BaseOfficeAllotService;
import com.zd.school.plartform.baseset.service.BaseStudentDormService;
import com.zd.school.plartform.comm.model.CommTree;
import com.zd.school.plartform.comm.service.CommTreeService;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.student.studentclass.model.JwClassstudent;
import com.zd.school.student.studentclass.model.StandVClassStudent;
import com.zd.school.student.studentclass.service.JwClassstudentService;

/**
 * 
 * ClassName: DormStudentdormServiceImpl Function: TODO ADD FUNCTION. Reason:
 * TODO ADD REASON(可选). Description: (DORM_T_STUDENTDORM)实体Service接口实现类. date:
 * 2016-08-26
 *
 * @author luoyibo 创建文件
 * @version 0.1
 * @since JDK 1.8
 */
@Service
@Transactional
public class BaseStudentDormServiceImpl extends BaseServiceImpl<DormStudentDorm> implements BaseStudentDormService {

	@Resource
	public void setDormStudentdormDao(BaseStudentDormDao dao) {
		this.dao = dao;
	}

	@Resource
	private CommTreeService commTreeService;
    @Resource
	private JwTGradeclassService gradeClassService; // 班级
	@Resource
	private BaseDormDefineService dormDefineService;// 宿舍定义

	@Resource
	private BaseOfficeAllotService roomaAllotService;// 房间分配 办公室
	@Resource
	private BaseClassDormAllotService classDormService;// 班级宿舍
	@Resource
	private JwClassstudentService classStuService; // 学生分班
	@Override
	public CommTree getCommTree(String rootId, String deptType, SysUser currentUser) {
		String userId = currentUser.getUuid();
		Integer rightType = currentUser.getRightType();
		if (currentUser.getUuid().equals(AdminType.ADMIN_USER_ID))
			rightType = 0;

		String sql = MessageFormat.format("EXECUTE SYS_P_GETUSERRIGHTGRADCLASSTREE ''{0}'',{1},''{2}''", userId,
				rightType, deptType);
		CommTree gradeTree = commTreeService.getGradeCommTree(sql, rootId); // 2017-10-9：待完成

		return gradeTree;
		// return null;
	}

	@Override
	public List<DormStudentDorm> oneKeyList(DormStudentDorm entity, String whereSql) {
		List<DormStudentDorm> newlists = null;// 执行查询方法
		List<StandVClassStudent> classStuList = null; // 某年级下全部学生
		List<JwTGradeclass> gradeClassList = null; // 某年级下的所有班级
		List<StandVClassStudent> boyList = new ArrayList<>(); // 某年级下的所有男生
		List<StandVClassStudent> girlList = new ArrayList<>(); // 某年级下的所有女生
		// 查询出该年级下所有的有效宿舍
		List<DormStudentDorm> lists = this.querySql("EXEC JW_P_DORMCOUNT '" + whereSql + "'");//需要修改
	    //获取该年级下的所有班级没有分配宿舍的总人数
	/*	String sql = "select a.* from STAND_V_CLASSSTUDENT a"
				+ " left join DORM_T_STUDENTDORM b on (a.classId=b.CLAI_ID and a.userId!=b.STU_ID)"
				+ " where a.gradeId = '" + whereSql + "'";*/
	/*	String whereSql = " where claiId in(select uuid from JwTGradeclass  where graiId='" + entity.getWhereSql()
		+ "') and isDelete=0 and studentId not in(select stuId from DormStudentDorm where isdelete=0) order by className,xbm";
        // 先获取到该年级下全部学生
        List<JwClassstudent> list = classStuService.doQuery("from JwClassstudent " + whereSql);*/
		String sql = "select * from STAND_V_CLASSSTUDENT a where a.gradeId = '" + whereSql + "'"
				+ " and a.userId not in (select STU_ID from DORM_T_STUDENTDORM  where CLAI_ID=a.classId) ";
		classStuList = this.queryEntityBySql(sql, StandVClassStudent.class);// 先获取到该年级下全部学生
		gradeClassList = gradeClassService
				.queryByHql("from JwTGradeclass where graiId='" + whereSql + "' and isDelete=0");// 某年级下的所有班级

		// 将男生分出来
		for (int i = 0; i < classStuList.size(); i++) {
			if (classStuList.get(i).getXbm().equals("1")) {
				boyList.add(classStuList.get(i));
			}
		}
		// 将女生分出来
		for (int i = 0; i < classStuList.size(); i++) {
			if (classStuList.get(i).getXbm().equals("2")) {
				girlList.add(classStuList.get(i));
			}
		}
		//需要宿舍BuildDormDefine的床位数？  
		Integer nanDormCount = this.countDorm(gradeClassList, boyList);
		Integer nvDormCount = this.countDorm(gradeClassList, girlList);
		
		Object objList = lists.get(0);
		List<String> strList = new ArrayList<>();
		Object[] objArray = (Object[]) objList;
		if (objArray != null) {
			for (Object o : objArray) {
				if (o == null) {
					o = 0;
				}
				strList.add(o.toString());
			}
			newlists = new ArrayList<>();
		    DormStudentDorm dormStudentDorm = new DormStudentDorm();
			dormStudentDorm.setNanCount(Integer.valueOf(strList.get(0)));// 男生数量
			dormStudentDorm.setNvCount(Integer.valueOf(strList.get(1)));// 女生数量
			dormStudentDorm.setStuCount(Integer.valueOf(strList.get(2)));// 合计学生总数量
			dormStudentDorm.setNanDormCount(nanDormCount);// 男生所需宿舍
			dormStudentDorm.setNvDormCount(nvDormCount);// 女生所需宿舍
			dormStudentDorm.setSxDorm(nanDormCount+nvDormCount);// 合计所需宿舍
			dormStudentDorm.setNanDorm(Integer.valueOf(strList.get(6)));// 男生有效宿舍
			dormStudentDorm.setNvDorm(Integer.valueOf(strList.get(7)));// 女生有效宿舍
			dormStudentDorm.setHunDorm( Integer.valueOf(strList.get(8)));// 混合有效宿舍
			dormStudentDorm.setYxDorm(Integer.valueOf(strList.get(9)));// 合计有效宿舍
			newlists.add(dormStudentDorm);
		}
		return newlists;
	}

	@Override
	public Boolean oneKeyAllotDorm(String gradId, String boyId, String girlId, SysUser currentUser) {
		Boolean flag = false;
		String boyDormId[] = null;
		String girDormId[] = null;
		List<StandVClassStudent> classStuList = null; // 某年级下全部学生
		List<JwTGradeclass> gradeClassList = null; // 某年级下的所有班级
		List<StandVClassStudent> boyList = new ArrayList<>(); // 某年级下的所有男生
		List<StandVClassStudent> girlList = new ArrayList<>(); // 某年级下的所有女生
		List<String> dormBoyList = new ArrayList<>(); // 某年级下的所有男宿舍集合
		List<String> dormGirlList = new ArrayList<>();// 某年级下的所有女宿舍集合
		//获取该年级下的所有班级没有分配宿舍的总人数
		/*String sql = "select a.* from STAND_V_CLASSSTUDENT a"
				+ " left join DORM_T_STUDENTDORM b on (a.classId=b.CLAI_ID and a.userId!=b.STU_ID)"
				+ " where a.gradeId = '" + gradId + "'";*/
	/*	String whereSql = " where claiId in(select uuid from JwTGradeclass  where graiId='" + gradId
				+ "') and isDelete=0 and studentId not in(select stuId from DormStudentDorm where isdelete=0) order by className,xbm";
		// 先获取到该年级下全部学生
		List<JwClassstudent> list = classStuService.doQuery("from JwClassstudent " + whereSql);*/
		
		String sql = "select * from STAND_V_CLASSSTUDENT a where a.gradeId = '" + gradId + "'"
				+ " and a.userId not in (select STU_ID from DORM_T_STUDENTDORM  where CLAI_ID=a.classId) ";
		classStuList = this.queryEntityBySql(sql, StandVClassStudent.class);// 先获取到该年级下全部学生
		gradeClassList = gradeClassService
				.queryByHql("from JwTGradeclass where graiId='" + gradId + "' and isDelete=0");// 获取到现有年级下的所有班级

		// 将某年级下的所有男生、女生分出来
		for (int i = 0; i < classStuList.size(); i++) {
			if (classStuList.get(i).getXbm().equals("1")) {
				boyList.add(classStuList.get(i));
				classStuList.remove(i);
				i--;
			} else if (classStuList.get(i).getXbm().equals("2")) {
				girlList.add(classStuList.get(i));
				classStuList.remove(i);
				i--;
			}
		}

		if (boyId != null) {
			boyDormId = boyId.split(","); // 选中的所有供男生分配的男宿舍的ID
			for (int i = 0; i < boyDormId.length; i++) {
				dormBoyList.add(boyDormId[i]);
			}
		}
		if (girlId != null) {
			girDormId = girlId.split(","); // 选中的所有供女生分配的女宿舍的ID
			for (int i = 0; i < girDormId.length; i++) {
				dormGirlList.add(girDormId[i]);
			}
		}
		// 分配男
		this.onKeyAllot(gradeClassList, boyList, dormBoyList, currentUser.getXm());
		// 分配女
		this.onKeyAllot(gradeClassList, girlList, dormGirlList, currentUser.getXm());
		flag = true;
		return flag;
	}

	@Override
	public Boolean dormHandAllot(DormStudentDorm entity, Map hashMap, SysUser currentUser) throws IllegalAccessException, InvocationTargetException {
		Boolean flag=false;
		BuildDormDefine buildDormDefine =null;
		DormStudentDorm perEntity =null;
		String[] studentId =null; 
		Integer inAllotCount = 0;// 该宿舍目前已经入住的人数
		Integer canInAllotCount =0;//该宿舍目前还可以入住的人数
		JwClassDormAllot jwClassDormAllot = classDormService.get(entity.getCdormId());// 获取选择的班级宿舍
		List<DormStudentDorm> liStudentdorms = this.queryByProerties("cdormId", entity.getCdormId());// 获取该宿舍下存在的人数
		for (int i = 0; i < liStudentdorms.size(); i++) {
			if (liStudentdorms.get(i).getIsDelete() == 0) {
				++inAllotCount;
			}
		}
		buildDormDefine = dormDefineService.get(jwClassDormAllot.getDormId());// 获取宿舍信息
		if (inAllotCount >= Integer.valueOf(buildDormDefine.getDormBedCount())) {
			flag=false;
			hashMap.put("count", 1);
			hashMap.put("buildDormDefine", buildDormDefine);
			hashMap.put("inAllotCount", inAllotCount);
			return flag;
		}
	    canInAllotCount = Integer.valueOf(buildDormDefine.getDormBedCount()) - inAllotCount;
		studentId = entity.getStuId().split(",");
		if (studentId.length > canInAllotCount) {
			flag=false;
			hashMap.put("count", 2);
			hashMap.put("buildDormDefine", buildDormDefine);
			hashMap.put("inAllotCount", inAllotCount);
			hashMap.put("canInAllotCount", canInAllotCount);
			return flag;
		}
		for (int i = 0; i < studentId.length; i++) {
			perEntity = new DormStudentDorm();
			perEntity.setBedNum(inAllotCount);
			BeanUtils.copyPropertiesExceptNull(entity, perEntity);
			this.allotStudentDorm(entity, jwClassDormAllot, studentId[i], entity.getBedNum(), currentUser.getXm());
			// 分配门禁 待完成
			roomaAllotService.mjUserRight(entity.getStuId(), null, null, entity, null);
		}
		flag=true;
		return flag;
	}

	@Override
	public Boolean dormAutoAllot(String claiId, SysUser currentUser) {
		Boolean flag=false;
		String[] propName = { "claiId", "isDelete" };
		Object[] propValue = { claiId, 0 };
		List<JwClassDormAllot> dormStuList = classDormService.queryByProerties(propName, propValue);// 获取该班级下所有有效宿舍
		List<JwClassDormAllot> nandormList = new ArrayList<>(); // 男宿舍
		List<JwClassDormAllot> nvdormList = new ArrayList<>(); // 女宿舍
		List<JwClassDormAllot> nanhundormList = new ArrayList<>(); // 男混班宿舍
		List<JwClassDormAllot> nvhundormList = new ArrayList<>(); // 男混班宿舍
		// 将班级下所有宿舍分类
		for (JwClassDormAllot jwClassDormAllot : dormStuList) {
			if (jwClassDormAllot.getDormType().equals("1")) { // 男
				if (jwClassDormAllot.getIsmixed().equals("1")) {
					nanhundormList.add(jwClassDormAllot);// 混班
				} else {
					nandormList.add(jwClassDormAllot);
				}
			} else if (jwClassDormAllot.getDormType().equals("2")) {// 女
				if (jwClassDormAllot.getIsmixed().equals("1")) {
					nvhundormList.add(jwClassDormAllot);// 混班
				} else {
					nvdormList.add(jwClassDormAllot);
				}
			}
		}
		List<JwClassstudent> nanList = new ArrayList<>(); // 有效男学生
		List<JwClassstudent> nvList = new ArrayList<>(); // 有效女学生
		List<JwClassstudent> classStulist = classStuService.queryByHql(
				"from JwClassstudent WHERE ISDELETE=0" + " AND studentId NOT IN(SELECT stuId FROM DormStudentDorm "
						+ "WHERE ISDELETE=0) AND claiId='" + claiId + "'");// 获取该班级下所有有效学生且未分配宿舍的
		for (JwClassstudent jwClassstudent : classStulist) {
			if (jwClassstudent.getXbm() != null)
				if (jwClassstudent.getXbm().equals("1")) {
					nanList.add(jwClassstudent);
				} else if (jwClassstudent.getXbm().equals("2")) {
					nvList.add(jwClassstudent);
				}
		}
		this.fp(nandormList, nanhundormList, nanList, claiId); // 自动分配男
		this.fp(nvdormList, nvhundormList, nvList, claiId); // 自动分配女
		flag=true;
		return flag;
	}
	/**
	 * 一键分配宿舍实现方法
	 * 
	 * @param gradeClassList
	 *            某年级下的所有班级
	 * @param studentList
	 *            //某年级下的所有男生（女生）（男list或者女list）
	 * @param allDormList
	 *            //某年级下的所有男（女）宿舍集合(男List或者女list)
	 * @param userCh
	 *            //创建人
	 */
	public void onKeyAllot(List<JwTGradeclass> gradeClassList, List<StandVClassStudent> studentList,
			List<String> allDormList, String userCh) {
		List<DormStudentDorm> mixDorm = new ArrayList<>();// 混合宿舍
		Map<String, Integer> mixDormBedCount = new HashMap<String, Integer>();// 混合宿舍
		DormStudentDorm studentDorm = null; // 学生宿舍（均是该班级的学生）
		JwClassDormAllot classDormEntity = null; // 班级宿舍
		BuildDormDefine dormDefEntity = null; // 宿舍定义
		String dormId = "";// 宿舍id BuildDormDefine的uuid
		String classId = ""; // 班级id
		List<StandVClassStudent> tempList; // 用来存储临时数据,存放某个班级的所有男生或女生
		Integer classCount=0;// 该班级所有的人数（男生或女生）
		Integer count = 0;// 用来计数该班级已经分配到宿舍的人数（男生或女生）
		Integer dormBedCount = 0;
		String stuId = "";// 学生id
		Integer overCount = 0; // 某个混合宿舍有剩余的床位数
		Integer mixInBedCount = 0;// 混合宿舍的还可以入住的床位数
		Integer notAllotBedCount = 0;// 某个班级还没有分配宿舍床位的人数
		Integer index = 0;
		Boolean flag = false;

		// 循环属于某年级下的所有班级
		for (int i = 0; i < gradeClassList.size(); i++) {
			tempList = new ArrayList<>();
			classId = gradeClassList.get(i).getUuid();// 一个班级
			for (int j = 0; j < studentList.size(); j++) {
				if (studentList.get(j).getClassId().equals(classId)) {
					tempList.add(studentList.get(j));// 存放的是这个班级的所有男生或女生
					studentList.remove(j);// 将该班级的学生从年级所有的学生中移除
					j--;
				}
			}

		    classCount = tempList.size();// 该班级所有的人数（男生或女生）
			count = 0;// 用来计数该班级已经分配到宿舍的人数（男生或女生）
			index = 0;
			flag = false;
			for (int k = 0; k < allDormList.size(); k++) { // 某年级下的所有男（女）宿舍集合
				dormId = allDormList.get(k); // BuildDormDefine的uuid
				dormDefEntity = dormDefineService.get(dormId); // 获取到宿舍
				dormBedCount = dormDefEntity.getDormBedCount();
				count += dormBedCount;
				if (count <= classCount) {
					classDormEntity = new JwClassDormAllot();
					this.allotClassDorm(classDormEntity, dormId, classId, userCh, false);// 给该班级分配宿舍
					this.merDormDefEntity(dormDefEntity, userCh, false);// 将宿舍状态设置为已分配
					for (int m = 0; m < dormBedCount; m++) {
						studentDorm = new DormStudentDorm();// 存放的是宿舍和学生对应关系
						stuId = tempList.get(count - dormBedCount + m).getUserId();
						this.allotStudentDorm(studentDorm, classDormEntity, stuId, m, userCh);

						// 分配门禁 待完成
						roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
					}
					notAllotBedCount=classCount-count;//班级还没有分配床位的人数 count：已经入住的人数
					allDormList.remove(k); // 每次使用完一个宿舍就将其移除
					k--;
					if (count == classCount) {
						break;
					}
				} else {
					if (mixDorm.size() > 0) {
						// 如果存取剩余的床位数刚好相等，那么将剩余的学生加入到该宿舍
						notAllotBedCount = classCount - (count - dormBedCount);// 该班级还没有分配宿舍床位的人数
						for (int mix = 0; mix < mixDorm.size(); mix++) {
							mixInBedCount = mixDormBedCount.get(mixDorm.get(mix).getUuid());// 这个混合宿舍还可以入住的人数
							if (mixInBedCount == notAllotBedCount) {
								index = 1;
								studentDorm = mixDorm.get(mix);// 获取到混合宿舍
								mixDorm.remove(mix);
								flag = true;
								break;
							}
							flag = false;
						}
						// 如果混合宿舍可以入住的人数大于该班级还未入住的人数，将该班级的人数分配到该混合宿舍
						if (!flag) {
							for (int mix = 0; mix < mixDorm.size(); mix++) {
								mixInBedCount = mixDormBedCount.get(mixDorm.get(mix).getUuid());// 这个混合宿舍还可以入住的人数
								if (mixInBedCount > notAllotBedCount) {
									index = 1;
									studentDorm = mixDorm.get(mix);// 获取到混合宿舍
									mixDorm.remove(mix);
									break;
								}
							}
						}
						/*
						 * 如果标识为0那么代表在混合宿舍中没找到符合当前剩余学生的宿舍
						  * 故重新分配一个新的宿舍给该班级的剩余人数，并且计算出分配完所剩余的床位 ，即该班级人数均匀入住
						 */
						if (index == 0 && allDormList.size() > 0 && notAllotBedCount > 0) {
							overCount = count - classCount;// 表示的这个宿舍还有几个床位剩余
							classDormEntity = new JwClassDormAllot();
							this.allotClassDorm(classDormEntity, dormId, classId, userCh, true);// 给该班级分配宿舍
							this.merDormDefEntity(dormDefEntity, userCh, true);// 将宿舍状态设置为已分配
							for (int n1 = 0; n1 < notAllotBedCount; n1++) {
								studentDorm = new DormStudentDorm();
								stuId = tempList.get(count - dormBedCount + n1).getUserId();
								this.allotStudentDorm(studentDorm, classDormEntity, stuId, n1, userCh);

								// 分配门禁 待完成
								roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
							}
							notAllotBedCount=0;
							// 此时宿舍肯定无法全部使用完那么将此宿舍加入到混合宿舍列表，并且将其最大床位数记录下来
							mixDorm.add(studentDorm);
							mixDormBedCount.put(studentDorm.getUuid(), overCount);
							allDormList.remove(k); // 每次使用完一个宿舍就将其移除
							k--;
							break;
						}
						/* 此处专门针对混合宿舍剩余床位数与班级未入住学生数相等或者大于关系时， 加入存在的混合宿舍里，则有该班级人数均已入住*/
						if (index == 1) {
							for (int n2 = 0; n2 < notAllotBedCount; n2++) {
								overCount = mixInBedCount - notAllotBedCount;// 该混合宿舍还可以在入住的人数
								classDormEntity = classDormService.get(studentDorm.getCdormId());
								studentDorm = new DormStudentDorm();
								stuId = tempList.get(count - dormBedCount + n2).getUserId();
								this.allotStudentDorm(studentDorm, classDormEntity, stuId, studentDorm.getBedNum(),userCh);

								// 分配门禁 待完成
								roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
							}
							if (overCount > 0) {// 表示混合宿舍可以入住的人数大于该班级还未入住的人数
								mixDorm.add(studentDorm);
								mixDormBedCount.put(studentDorm.getUuid(), overCount);
							}
							notAllotBedCount=0;
							break;
						}
					} else {//该班级的所有人数均已入住
						overCount = count - classCount;// 该混合宿舍剩余床位
					    notAllotBedCount = classCount - (count - dormBedCount);// 该班级还没有分配宿舍床位的人数
					    classDormEntity = new JwClassDormAllot();
						this.allotClassDorm(classDormEntity, dormId, classId, userCh, true);// 给该班级分配宿舍
						this.merDormDefEntity(dormDefEntity, userCh, true);// 将宿舍状态设置为已分配
						for (int n = 0; n < notAllotBedCount; n++) {// 该班级的还未分配宿舍的人数循环
							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count - dormBedCount + n).getUserId();
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, n, userCh);

							// 分配门禁 待完成
							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						notAllotBedCount=0;
						// 此时宿舍肯定无法全部使用完那么将此宿舍加入到混合宿舍列表，并且将其最大床位数记录下来
						mixDorm.add(studentDorm);
						mixDormBedCount.put(studentDorm.getUuid(), overCount);
						allDormList.remove(k); // 每次使用完一个宿舍就将其移除
						k--;
						break;
					}

				}
			}
			if (allDormList.size() <= 0 && notAllotBedCount > 0 && index == 0) {
				for (int mix1 = 0; mix1 < mixDorm.size(); mix1++) {
					mixInBedCount = mixDormBedCount.get(mixDorm.get(mix1).getUuid());// 这个混合宿舍还可以入住的人数
					if(mixInBedCount>notAllotBedCount){//混合宿舍可以入住的人数大于该班级还未入住的人数
						for (int n3 = 0; n3 < notAllotBedCount; n3++) {
							overCount = mixInBedCount- notAllotBedCount;
							studentDorm = mixDorm.get(i);
							classDormEntity = classDormService.get(studentDorm.getCdormId());
							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count + n3).getUserId();// 该班级已经入住的人数
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, studentDorm.getBedNum(), userCh);

							// 分配门禁 待完成
							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						mixDormBedCount.put(studentDorm.getUuid(), overCount);
						break;
					}else{//该班级的未入住人数至少需要二个混合宿舍
						for (int n4 = 0; n4 < mixInBedCount; n4++) {
							studentDorm = mixDorm.get(i);
							classDormEntity = classDormService.get(studentDorm.getCdormId());
							studentDorm = new DormStudentDorm();
							stuId = tempList.get(count + n4).getUserId();
							this.allotStudentDorm(studentDorm, classDormEntity, stuId, studentDorm.getBedNum(), userCh);

							// 分配门禁 待完成
							roomaAllotService.mjUserRight(studentDorm.getStuId(), null, null, studentDorm, null);
						}
						notAllotBedCount-= mixInBedCount;
						count+=mixInBedCount;//已经入住的人数
						mixDorm.remove(mix1);
						mix1--;
					}
				}
			}

		}
	}
	/**
	 * 自动分配该班级的学生到该班级的宿舍 
	 * 
	 * @param dormList
	 *            该班级的班级宿舍（男或女宿舍）
	 * @param hunDormList
	 *            该班级的班级宿舍（男或女混合宿舍）
	  * @param stuList
	 *            该班级还未分配宿舍的所有男生或女生
	 * @param claiId
	 *            （班级id）
	 */
	
	private void fp(List<JwClassDormAllot> dormList, List<JwClassDormAllot> hunDormList, List<JwClassstudent> stuList,
			String claiId) {
		DormStudentDorm dormStudentDorm = null;
		DormStudentDorm dorm = null;
		int bs = 0; // 标识用了几个宿舍
		Integer bedCount=0;
		String roomCount = "";
		Integer dormBedCount=0;
		for (int i = 0; i < dormList.size(); i++) {
			bedCount = Integer.valueOf(dormList.get(i).getDormBedCount());
			for (int j = 1; j <= bedCount; j++) {
				roomCount+= j + ",";
			}
			roomCount = roomCount.substring(0, roomCount.length() - 1);
			// 直接获取宿舍下面的可入住人数  查询该班级的学生宿舍中没有入住的床号
			List list = this.querySql("SELECT * FROM dbo.Split('" + roomCount + "',',')  A"
					+ "	WHERE A NOT IN(SELECT BED_NUM FROM dbo.DORM_T_STUDENTDORM" + " WHERE ISDELETE=0 and CDORM_ID "
					+ "IN(SELECT CDORM_ID FROM dbo.JW_T_CLASSDORMALLOT WHERE CDORM_ID='" + dormList.get(i).getUuid()
					+ "'))");
			
			for (int j = 0; j < list.size(); j++) {
				if (stuList.size() > 0) {
					dormStudentDorm = new DormStudentDorm();
					dormBedCount = Integer.valueOf(list.get(j).toString()); // 获取到床位
					dormStudentDorm.setBedNum(dormBedCount); // 设置床位
					dormStudentDorm.setArkNum(dormBedCount); // 设置柜号
					dormStudentDorm.setCdormId(dormList.get(i).getUuid());
					dormStudentDorm.setClaiId(claiId);
					dormStudentDorm.setInTime(new Date());
					dormStudentDorm.setStuId(stuList.get(0).getStudentId());
					stuList.remove(0);
					dorm = this.merge(dormStudentDorm);
					// 分配门禁 待完成
					roomaAllotService.mjUserRight(dorm.getStuId(), null, null, dorm, null);
				}
			}
			++bs;
			if (bs == dormList.size() && stuList.size() > 0) {
				for (int j = 0; j < hunDormList.size(); j++) {
					roomCount="";
					bedCount = Integer.valueOf(hunDormList.get(j).getDormBedCount());
					for (int k = 1; k <= bedCount; k++) {
						roomCount+= k + ",";
					}
					roomCount = roomCount.substring(0, roomCount.length() - 1);
					List hunList = this.querySql("SELECT * FROM dbo.Split('" + roomCount + "',',')  A"
							+ "	WHERE A NOT IN(SELECT BED_NUM FROM dbo.DORM_T_STUDENTDORM"
							+ " WHERE ISDELETE=0 and CDORM_ID "
							+ "IN(SELECT CDORM_ID FROM dbo.JW_T_CLASSDORMALLOT WHERE CDORM_ID='"
							+ hunDormList.get(j).getUuid() + "'))");
					for (int k = 0; k < hunList.size(); k++) {
						if (stuList.size() > 0) {
							dormStudentDorm = new DormStudentDorm();
							dormBedCount = Integer.valueOf(hunList.get(k).toString()); // 获取到床位
							dormStudentDorm.setBedNum(dormBedCount); // 设置床位
							dormStudentDorm.setArkNum(dormBedCount); // 设置柜号
							dormStudentDorm.setCdormId(hunDormList.get(j).getUuid());
							dormStudentDorm.setClaiId(claiId);
							dormStudentDorm.setInTime(new Date());
							dormStudentDorm.setStuId(stuList.get(0).getStudentId());
							stuList.remove(0);
							dorm = this.merge(dormStudentDorm);
							// 分配门禁 待完成
							roomaAllotService.mjUserRight(dorm.getStuId(), null, null, dorm, null);
						}
					}
				}
			}
			

		}
	}

	private void allotClassDorm(JwClassDormAllot classDormEntity, String dormId, String classId, String userCh,
			Boolean flag) {
		Integer orderIndex = 0; // 排序号
		orderIndex = classDormService.getDefaultOrderIndex(classDormEntity);
		classDormEntity.setOrderIndex(orderIndex);
		classDormEntity.setDormId(dormId);// 设置宿舍id
		classDormEntity.setClaiId(classId); // 设置班级id
		classDormEntity.setCreateUser(userCh);
		classDormEntity.setCreateTime(new Date());
		if (flag) {
			classDormEntity.setIsmixed("1");// 混合宿舍
		}
		classDormEntity = classDormService.merge(classDormEntity);// 存放的是班级和宿舍对应关系

	}

	public void merDormDefEntity(BuildDormDefine dormDefEntity, String userCh, Boolean flag) {
		dormDefEntity.setRoomStatus("1");// 将宿舍状态设置为已分配
		dormDefEntity.setCreateTime(new Date());
		dormDefEntity.setCreateUser(userCh);
		if (flag) {
			dormDefEntity.setIsMixed("1");// 设置为混合宿舍
		}
		dormDefineService.merge(dormDefEntity);
	}

	public void allotStudentDorm(DormStudentDorm studentDorm, JwClassDormAllot classDormEntity, String stuId,
			int dormBedCount, String userCh) {
		Integer orderIndex = 0; // 排序号
		orderIndex = this.getDefaultOrderIndex(studentDorm);
		studentDorm.setOrderIndex(orderIndex);
		studentDorm.setStuId(stuId); // 设置学生id
		studentDorm.setCdormId(classDormEntity.getUuid());// 设置宿舍id
		studentDorm.setBedNum((dormBedCount + 1));// 床号
		studentDorm.setArkNum(studentDorm.getBedNum());// 柜号（默认跟床号对应）
		studentDorm.setClaiId(classDormEntity.getClaiId());// 班级id
		studentDorm.setCreateUser(userCh);
		studentDorm.setInTime(new Date());// 设置入住时间

		studentDorm = this.merge(studentDorm);
	}
   /**
	 * 计算男女生宿舍数量
	 * 
	 * @param gradeClassList
	 * 某年级下的所有班级
	 * @param studentList
	 * 某年级下的所有所有男生 或女生
	 * @return
	 */
	//需修改
	private int countDorm(List<JwTGradeclass> gradeClassList, List<StandVClassStudent> studentList) {
		String classId="";
		int zc = 0;
		List<Integer> ys = new ArrayList<>();
		List<StandVClassStudent> tempList;//班级的所有男生或女生
		for (int i = 0; i < gradeClassList.size(); i++) {
			tempList = new ArrayList<>();
			classId = gradeClassList.get(i).getUuid();// 一个班级
			for (int j = 0; j < studentList.size(); j++) {
				if (studentList.get(j).getClassId().equals(classId)) {
					tempList.add(studentList.get(j));// 存放的是这个班级的所有男生或女生
					studentList.remove(j);// 将该班级的学生从年级所有的学生中移除
					j--;
				}
			}
			if (tempList.size() % 6 == 0) {//先按6来计算
				zc = tempList.size() / 6 + zc;
			} else {
				zc = tempList.size() / 6 + zc;
				ys.add(tempList.size() % 6);
			}
			
		}
		int ysj = 0;
		int ysi = 0;
		for (int i = 0; i < ys.size(); i++) {
			List<Integer> temp = ys;
			for (int j = 0; j < temp.size(); j++) {
				if ((ys.get(i) + temp.get(j)) == 6) {
					if (i == j) {
						continue;
					}
					zc = zc + 1;
					ys.remove(j);
					ys.remove(i);
					i = -1;
					break;
				}
				if ((ys.get(i) + temp.get(j)) < 6) {
					ysj = temp.get(j);
					ysi = ys.get(i);
					ys.remove(j);
					ys.remove(i);
					i = -1;
					ys.add(ysj + ysi);
					break;
				}
			}

		}
		return zc + ys.size();
	}


}
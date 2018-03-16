Ext.define("core.coursemanage.teachercourse.controller.DetailController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.teachercourse.detailcontroller',
    mixins: {
        //suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        //formUtil: "core.util.FormUtil",
        //gridActionUtil: "core.util.GridActionUtil",
        //dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"panel[xtype=coursemanage.teachercourse.deptcoursetree] button[ref=gridRefresh]": {
            click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore();
                store.load();
                return false;
            }
        },

        "basetreegrid[xtype=coursemanage.teachercourse.deptcoursetree]": {        
            itemclick: function(tree, record, item, index, e, eOpts) {
                this.loadCourseTeacherStore(tree,record);
                return false;
           }
        },

        "basetreegrid[xtype=coursemanage.teachercourse.deptclasstree]": {        
            itemclick: function(tree, record, item, index, e, eOpts) {
                this.selectClassTeacherCourse(tree,record);
                return false;
           }
        },

        "basegrid[xtype=coursemanage.teachercourse.courseteachergrid]":{
        	select : function(model, selected, eOpts) {        		
        		var grid=model.view;
	            // 得到所选教师的id
	            var teacherId = selected.data.uuid;
	            var teacherName = selected.data.xm;
				var detailLayout = grid.up("basepanel[xtype=coursemanage.teachercourse.detaillayout]");
			
				Ext.apply(detailLayout.funData, {
					teacherId: teacherId,
					teacherName:teacherName
				});
			}
        },

        //删除
        "basegrid[xtype=coursemanage.teachercourse.selectedteachergrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.doRemoveCourseTeacher(btn);
                return false;
            }
        },

        "basecombobox[name=semester]":{
        	change:function(e){
        		this.loadYearCourses(e);
        	}
        }

    },


    loadCourseTeacherStore:function(tree,record){
    	var self=this;
                
        //获取点击树节点的参数            
        var deptId= record.get("id");
        var deptType=record.get("nodeType");
       	var deptName= record.get("text");
       	var courseId=record.get("iconCls");		//在存储过程中，用此字段来保存课程id

        if (deptType == "06") {

       		var detailLayout = tree.up("basepanel[xtype=coursemanage.teachercourse.detaillayout]");

       		Ext.apply(detailLayout.funData, {
				courseId: courseId,
				courseName:deptName
			});

	        var storeGrid = detailLayout.down("panel[xtype=coursemanage.teachercourse.courseteachergrid]");
	        var store = storeGrid.getStore();
	        var proxy = store.getProxy();
           	
            proxy.extraParams = {
                deptId: deptId
            };
            store.loadPage(1); // 给form赋值
        }  
    },

    /*加载此学年、学期已存在的任课数据，并保存到funData中*/
    loadYearCourses:function(e){
		var form = e.up("form");
		var studyYear = form.getForm().findField('studyYear').getValue();
		var detailLayout = e.up("panel[xtype=coursemanage.teachercourse.detaillayout]");

		var myStore = Ext.create('Ext.data.Store', {
			model: factory.ModelFactory.getModelByName("com.zd.school.jw.arrangecourse.model.JwCourseteacher", "checked").modelName,
			proxy: {
				type: 'ajax',
				url: comm.get('baseUrl') + "/CourseTeacher/getYearCourseTeacherList",
				extraParams: {
					studyYear: studyYear,
					semester: e.value
				},
				reader: {
					type: "json",
				},
				writer: {
					type: "json"
				}
			},
			autoLoad: true
		});

		Ext.apply(detailLayout.funData, {
			isCourseTeacher: myStore
		});
    },

   
    selectClassTeacherCourse:function(tree,record){

	    var self = this;
	    var nodeType = record.get("nodeType");
	    var claiId = record.get("id");
	    var className = record.get("text");

	    //选择的是班级
	    if (nodeType == '05') {
	  
	        var detailLayout = tree.up("panel[xtype=coursemanage.teachercourse.detaillayout]");
	        var funData = detailLayout.funData;
	        
	        //读取课程和教师的数据
	        var courseId = funData.courseId;
	        var courseName = funData.courseName;
	        var teacherId = funData.teacherId;
	        var teacherName = funData.teacherName;	        	 
	        var isCourseTeacherStore = funData.isCourseTeacher;
	        if (!teacherId) {
	            self.Warning("请先选择要设置的教师");
	            return;
	        }

	        var objForm = detailLayout.down("form");
	        var formObj = objForm.getForm();
	        var studyYear = formObj.findField('studyYear').getValue();
	        var semester = formObj.findField('semester').getValue();
	        var studyYearName=formObj.findField('studyYearName').getValue();
	        if (!studyYear || !semester) {
	            self.Warning("请先设定好学年与学期");
	            return;
	        }
	    	
	    	/*当前待添加的数据*/
	        var addTeacher = {
	        	//teacherGroupId:"",
	            tteacId: teacherId,
	            courseId: courseId,
	            claiId: claiId,
	            xm: teacherName,
	            courseName: courseName,
	            className: className,
	            studyYearName : studyYearName,
	            studyYear: studyYear, //学年
	            semester: semester //学期
	        };
	        /*
	        if(userPwd=="是"){
	        	addTeacher.teacherGroupId=teacherId;
	        	addTeacher.tteacId=null
	        }
	        */	   

	        //已有的任课教师，判断是否已存在
	        var findInCourseTeacher = self.findIsCourseTeacher(isCourseTeacherStore, addTeacher);
	       	if(findInCourseTeacher==-1){
	       		self.Warning("此班级已存在此课程和教师！");
	            return;
	       	}	

	       	//从当前的表格中，判断是否已存在
	       	var seletTeacherGrid = detailLayout.down("panel[xtype=coursemanage.teachercourse.selectedteachergrid]");
	        var selectTeacherStore = seletTeacherGrid.getStore();
	        var objs = selectTeacherStore.getRange();
  	
	        for(var i = 0; i < objs.length;i++ ) {
	        	var tteacId1=objs[i].data.tteacId;
	        	var claiId1=objs[i].data.claiId;
	        	var courseId1=objs[i].data.courseId;
	        	var studyYear1=objs[i].data.studyYear;	
	        	var semester1=objs[i].data.semester;
	        	   
	        	if(teacherId==tteacId1&&claiId==claiId1&&courseId==courseId1&&studyYear==studyYear1&&semester==semester1){ 
		            self.Warning("请勿输入重复数据！");
		            return;
		        }
	        }

	        //若执行到了这里，那么就直接插入
	        selectTeacherStore.insert(0, [addTeacher]);	
	        
	    }
	    
    },

    findIsCourseTeacher: function(store, check) {

        var self = this;
        var result = -2;
        for (var i = 0; i < store.getCount(); i++) {
            var isClassId = store.getAt(i).get("claiId");
            var isCourseId = store.getAt(i).get("courseId");
            var isYear = store.getAt(i).get("studyYear");
            var isSemester = store.getAt(i).get("semester");
            var isTeacherId = store.getAt(i).get("tteacId");
            //当前学年、学期、班级是否有此课程的任课教师
            if (isClassId == check.claiId && isCourseId == check.courseId && isYear == check.studyYear && isSemester == check.semester) {
                //当前学年、学期、班级有此课程的任课教师,判断是否同一老师
                if (isTeacherId == check.tteacId) {
                    //选择的老师和已有教师相同,只标记已找到
                    result = -1;
                    break;
                } else {
                    result = i; //找到的位置
                    break;
                }
            }
        }
        return result;
    },


    doRemoveCourseTeacher:function(btn){

		//1、获取选中数据
		//2、获取存储数据的store
		//3、从store中删除选中数据
		var baseGrid = btn.up("basegrid");
		//得到选中数据
		var records = baseGrid.getSelectionModel().getSelection();
		//得到store
		var store = baseGrid.getStore();
		if (records.length > 0) {
			//封装ids数组
			Ext.Msg.confirm('移除确认', '确实要移除已选择的老师。', function(btn, text) {
				if (btn == 'yes') {
					store.remove(records);
				}
			});
		} else {
			self.Error("请选择要删除的数据!");
		}
    }

});
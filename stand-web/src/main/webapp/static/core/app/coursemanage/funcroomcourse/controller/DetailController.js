Ext.define("core.coursemanage.funcroomcourse.controller.DetailController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.funcroomcourse.detailcontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"panel[xtype=coursemanage.funcroomcourse.classtree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid              
                return false;
            }
        },
        
        "basetreegrid[xtype=coursemanage.funcroomcourse.classtree]": {
            itemclick: function(tree, record, item, index, e, eOpts) { 
            	this.loadCourseGridStore(tree,record);                
                return false; 
            }
        },

        "basegrid[xtype=coursemanage.funcroomcourse.selectcourse] button[ref=gridFastSearchBtn]": {
            beforeclick: function(btn) { 
                this.filterCourseStore(btn);                
                return false; 
            }
        },
        //快速搜索文本框回车事件
        "basegrid[xtype=coursemanage.funcroomcourse.selectcourse] field[funCode=girdFastSearchText]": {
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                    this.filterCourseStore(field);
                }
                return false;
            }
        },

        //点击单元格，将数据选入
        "basegrid[xtype=coursemanage.funcroomcourse.selectcourse]":{
            cellclick: function(table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                this.doSelectCourse(table,cellIndex,record);       
            }

        },

        "basegrid[xtype=coursemanage.funcroomcourse.selectedcourse]":{
            celldblclick: function(table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                this.doCancelCourse(table,cellIndex,record);            
            }

        },

        



    },

    loadCourseGridStore:function(tree,record){ 

        var self=this;
        var detailLayout = tree.up("panel[xtype=coursemanage.funcroomcourse.detaillayout]");     
        var classId = record.get("id");
        var className = record.get("text");
        var nodeType = record.get("nodeType");

		Ext.apply(detailLayout.funData, {
            classId:classId,
            className:className
        });

		var courseGrid = detailLayout.down("panel[xtype=coursemanage.funcroomcourse.selectcourse]");
	    var store = courseGrid.getStore();

        if(nodeType=="05"){			
	        var proxy = store.getProxy();
	        //附带参赛
	        proxy.extraParams={
	            classId:classId	         
	        }
	       
            //过滤数据
            var girdSearchTexts = courseGrid.query("field[funCode=girdFastSearchText]");
            var courseName =girdSearchTexts[0].getValue();    

	        store.load(function(records, operation, success) {
                //如果存在过滤参数，则将其他值设为null
                if(courseName){
                    for(var i=0;i<records.length;i++){
                        var rec=records[i];

                        for (var j = 1; j <= 7; j++) {                    
                            index="0"+j;
                            if (rec.data["courseName"+index]!=courseName) {
                                rec.data["claiId"+index]=null;
                                rec.data["className"+index]=null;
                                rec.data["courseId"+index]=null;
                                rec.data["courseName"+index]=null;
                                rec.data["teacherName"+index]=null;
                                rec.commit();
                            }
                        };
                    }
                }			 
			});
	      
        }else{
        	store.removeAll();
        }       
    },

    filterCourseStore:function(cmp){    
        var courseGrid = cmp.up("basegrid");

        //过滤数据
        var girdSearchTexts = courseGrid.query("field[funCode=girdFastSearchText]");
        var courseName =girdSearchTexts[0].getValue();    
        var store = courseGrid.getStore();

        store.load(function(records, operation, success) {
            //如果存在过滤参数，则将其他值设为null
            if(courseName){
                for(var i=0;i<records.length;i++){
                    var rec=records[i];

                    for (var j = 1; j <= 7; j++) {                    
                        index="0"+j;
                        if (rec.data["courseName"+index]!=courseName) {
                            rec.data["claiId"+index]=null;
                            rec.data["className"+index]=null;
                            rec.data["courseId"+index]=null;
                            rec.data["courseName"+index]=null;
                            rec.data["teacherName"+index]=null;
                            rec.commit();
                        }
                    };
                }
            }            
        });
    },

    doSelectCourse:function(table,cellIndex,record){
        var self=this;
        var detailLayout = table.up("panel[xtype=coursemanage.funcroomcourse.detaillayout]");

        //拼接字段名
        var courseNameIndex = "courseName0" + cellIndex;
        var courseIdIndex = "courseId0" + cellIndex;
        var teacherNameIndex = "teacherName0" + cellIndex;
        var claiIdIndex = "claiId0" + cellIndex;
        var classNameIndex = "className0" + cellIndex;

       
        var courseId = record.data[courseIdIndex];
        if (courseId == null) {     //当点击为节次时，则中止执行
            return false;
        };


        var claiId = record.data["claiId"];
        var className = record.data["className"];
        var teachTime = record.data["teachTime"];
        var courseName = record.data[courseNameIndex];

        //组装基本数据                
        var newRecord = new Object();
        newRecord["teachTime"]=teachTime;
        newRecord[courseIdIndex]=record.get(courseIdIndex);
        newRecord[teacherNameIndex]=record.get(teacherNameIndex);
        newRecord[claiIdIndex] = claiId;
        newRecord[classNameIndex] = className;
        newRecord[courseNameIndex] = courseName;            
        newRecord["funcRoomId"] = detailLayout.up("baseformtab").funData.roomId;    //获取主键

        //获取表格
        var nextGird = detailLayout.down("basegrid[xtype=coursemanage.funcroomcourse.selectedcourse]");
        var nextStore = nextGird.getStore();

        //若表格暂无数据，则直接将数据插入到表格中
        if (nextStore.getCount() == 0) {
            nextStore.add(newRecord);
            return;
        }

        //否则，判断表格是否存在此节次的课程
        var flag = false;
        //for(var i=0;i<nextStore.getCount();i++){
            //var rec=nextStore.getAt(i);

        nextStore.each(function(rec) {
            //如果节次相同就判断
            if (rec.data.teachTime == teachTime) {
                flag = true;

                //已存在此班级，直接跳过
                if(rec.data[claiIdIndex]!=null&&rec.data[claiIdIndex].indexOf(newRecord[claiIdIndex])!=-1){
                    return false;
                }

                //判断是否继续添加 或 直接插入
                if (rec.data[courseIdIndex] != null && rec.data[courseIdIndex] != "") {
                    Ext.Msg.confirm('提示', '当前选择的课程在' + rec.data[classNameIndex] + "星期" + cellIndex + "的第" + teachTime + "节已有课程,是否继续添加?", function(btn, text) {
                        if (btn == 'yes') {
                            rec.data[claiIdIndex] +=','+ newRecord[claiIdIndex];
                            rec.data[classNameIndex] +=','+ newRecord[classNameIndex];
                            rec.data[courseIdIndex] +=','+ newRecord[courseIdIndex];
                            rec.data[courseNameIndex] +=','+ newRecord[courseNameIndex];
                            rec.data[teacherNameIndex] +=','+ newRecord[teacherNameIndex];
                            rec.commit();
                        }
                    })
                } else {
                    rec.data[claiIdIndex] = newRecord[claiIdIndex];
                    rec.data[classNameIndex] = newRecord[classNameIndex];
                    rec.data[courseIdIndex] = newRecord[courseIdIndex];
                    rec.data[courseNameIndex] = newRecord[courseNameIndex];
                    rec.data[teacherNameIndex] = newRecord[teacherNameIndex];
                    rec.commit();
                }
                return false;
            }
        });

        //如果没有相同节次就添加
        if (!flag) {
            nextStore.add(newRecord);
        };
    },


    doCancelCourse:function(table,cellIndex,record){
        var self=this;      
        var classNameIndex = "className0" + cellIndex;
        var courseIdIndex = "courseId0" + cellIndex;
        var teacherNameIndex = "teacherName0" + cellIndex;
        var claiIdIndex = "claiId0" + cellIndex;
        var courseNameIndex = "courseName0" + cellIndex;
        var courseId = record.data[courseIdIndex];
        if (courseId == null) {
            self.msgbox("请选择班级课程!");
            return;
        };
        record.data[claiIdIndex] = null;
        record.data[classNameIndex] = null;
        record.data[courseIdIndex] = null;
        record.data[teacherNameIndex] = null;
        record.data[courseNameIndex] = null;
        record.commit();
    }
});
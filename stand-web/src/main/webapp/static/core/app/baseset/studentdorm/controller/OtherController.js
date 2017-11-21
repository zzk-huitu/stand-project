Ext.define("core.baseset.studentdorm.controller.OtherController", {
	extend: "Ext.app.ViewController",
	alias: 'controller.baseset.studentdorm.othercontroller',
	mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        queryUtil: "core.util.QueryUtil"
    },
    init: function () {
		var self=this;
		this.control({
      /*
        宿舍分配
        */
      //数据列表刷新按钮事件
      "panel[xtype=baseset.studentdorm.dormallottree] button[ref=gridRefresh]": {
          click: function(btn) {
            var baseGrid = btn.up("basetreegrid");
            var store = baseGrid.getStore();
            store.load(); //刷新父窗体的grid
            return false;
           }
         },
         //手动分配宿舍
        "basegrid[xtype=baseset.studentdorm.dormnotallotgrid] button[ref=dormFp]": {
           beforeclick: function(btn) {
            self.doDormHandAllot(btn);
            return false;
          }
        },
         //自动分配宿舍
        "basegrid[xtype=baseset.studentdorm.dormnotallotgrid] button[ref=dormzdFp]": {
           beforeclick: function(btn) {
            self.doDormAutoAllot(btn);
            return false;
          }
        },
        /*
        一键分配宿舍
        */
        "baseformwin[detCode=onekeyallotdorm_detail] button[ref=formSave]": {
          beforeclick: function(btn) {
            self.saveDormAllot_Win(btn);
            return false;
          }
        },
  			//选择男宿舍
  			"basegrid[xtype=baseset.studentdorm.boydormgrid] button[ref=selectNan]": {
  				beforeclick: function(btn) {
  					self.doSelectBoy(btn);
  					return false;
  				}
  			},
  		    //男宿舍批量删除
  		  "basegrid[xtype=baseset.studentdorm.boydormgrid] button[ref=gridDelete]": {
    			 beforeclick: function(btn) {
    				self.doDeleteBoyDorm(btn);
    				return false;
    			}
  			},
  			//选择女宿舍
  			"basegrid[xtype=baseset.studentdorm.girldormgrid] button[ref=selectNv]": {
    				beforeclick: function(btn) {
    					self.doSelectGirl(btn);
    					return false;
    				}
  			},
  			 //女宿舍批量删除
  			"basegrid[xtype=baseset.studentdorm.girldormgrid] button[ref=gridDelete]": {
    				beforeclick: function(btn) {
    					self.doDeleteGirlDorm(btn);
    					return false;
    				}
  			},
        //选中宿舍时
        "mtfuncwindow[funcPanel=pubonkeyallotdorm.mainlayout] button[ref=ssOkBtn]": {
            beforeclick: function(btn) {
              self.doGetDorm(btn);
              return false;
            }
        },
         //关闭选中宿舍layout
        "mtfuncwindow[funcPanel=pubonkeyallotdorm.mainlayout] button[ref=ssCancelBtn]": {
            beforeclick: function(btn) {
              var win = btn.up('window').close();
              return false;
            }
        },
          //选择男宿舍刷新按钮事件
        "panel[xtype=pubonkeyallotdorm.boydormdefinetree] button[ref=gridRefresh]": {
            click: function(btn) {
             var baseGrid = btn.up("basetreegrid");
             var store = baseGrid.getStore();
               store.load(); //刷新父窗体的grid
               return false;
             }
           },
            //选择女宿舍刷新按钮事件
        "panel[xtype=pubonkeyallotdorm.girldormdefinetree] button[ref=gridRefresh]": {
            click: function(btn) {
             var baseGrid = btn.up("basetreegrid");
             var store = baseGrid.getStore();
               store.load(); //刷新父窗体的grid
               return false;
             }
           },

           /*
           虚拟宿舍调整(或换宿舍)
           */
        //未住满宿舍刷新
        "basegrid[xtype=baseset.studentdorm.mixdormgrid] button[ref=gridRefresh]": {
          click: function(btn) {
               var baseGrid = btn.up("basegrid");
               var store = baseGrid.getStore();
               store.load(); //刷新父窗体的grid
               return false;
             }
           },
            //人数为0宿舍刷新
          "basegrid[xtype=baseset.studentdorm.emptymixdormgrid] button[ref=gridRefresh]": {
              click: function(btn) {
                var baseGrid = btn.up("basegrid");
                var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                return false;
             }
           },
            //未分配宿舍学生刷新
           "basegrid[xtype=baseset.studentdorm.notallotstugrid] button[ref=gridRefresh]": {
              click: function(btn) {
                var baseGrid = btn.up("basegrid");
                var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                return false;
             }
           },
           //删除数据
           "basegrid[xtype=baseset.studentdorm.emptymixdormgrid] button[ref=gridDelete]": {
              beforeclick: function(btn) {
                self.doDeleteEmpMixDorm(btn);
                return false;
             }
           },
             //手动分配
           "basegrid[xtype=baseset.studentdorm.notallotstugrid] button[ref=handAllot]": {
              beforeclick: function(btn) {
                self.doHandAllot(btn);
                return false;
             }
           },

  		})
	},

      doDormHandAllot: function(btn){
           var self=this;
           var detailLayout = btn.up("basepanel[xtype=baseset.studentdorm.dormallotLayout]");
           var classDormGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.classdormgrid]");
           var selectClaDorm = classDormGrid.getSelectionModel().getSelection();
           if (selectClaDorm <= 0) {
               self.msgbox("请先选择宿舍再进行操作!");
               return;
           }        
           var classdormgrid = selectClaDorm[0];
           var cdormId = classdormgrid.get("uuid"); //班级宿舍主键
           var dormType = classdormgrid.get("dormType"); //宿舍类型
           var claiId = classdormgrid.get("claiId"); //班级id   

           var dormNotAllotGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.dormnotallotgrid]");
           var rows = dormNotAllotGrid.getSelectionModel().getSelection();
           var stuId = "";
           var yes = 0;
           if (rows <= 0) {
             self.msgbox("选中要分配的学生再进行操作!");
             return;
           }
           //判断性别
           for (var i = 0; i < rows.length; i++) {
            //将学生主键加入到list
            stuId+= rows[i].get('userId') + ",";
            if (dormType != 3) {
              if (dormType != rows[i].get('xbm')) {
                      self.msgbox("选择宿舍的性别与选中学生性别不匹配无法继续!");
                      yes++; //判断标识
                      return;
                    }
                  }
                }
         if (yes == 0) {
             Ext.Msg.confirm("分配确认", "分配宿舍之后，只能从宿舍记录中删除，或者手动修改床号、柜号", function(btns) {
              if (btns == 'yes') {
                var loading = self.LoadMask(detailLayout,'正在分配中，请等待...');

                self.asyncAjax({
                  url: comm.get('baseUrl') + "/BaseStudentDorm/dormHandAllot",
                  params: {
                   cdormId: cdormId,
                   stuId: stuId,
                   claiId: claiId,
                  // bedNum: bedNum
                  },                 
                  success: function(response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    if(data.success){
                        var store = dormNotAllotGrid.getStore();
                        store.load(); //刷新
                        self.msgbox(data.obj); 
                        loading.hide();
                    }else {
                        self.Error(data.obj);
                        loading.hide();
                     }           
                    loading.hide();
                  },
                  failure: function(response) {                   
                    Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                    loading.hide();
                  }
                });     
              }
            })
         }
      },
      doDormAutoAllot: function(btn){
           var self=this;
           var detailLayout = btn.up("basepanel[xtype=baseset.studentdorm.dormallotLayout]");
           var dormAllotTree = detailLayout.down("basetreegrid[xtype=baseset.studentdorm.dormallottree]");
           var treeObj = dormAllotTree.getSelectionModel().getSelection();
           if (treeObj.length <= 0) {
               self.msgbox("请选择班级");
               return;
           } else {
               treeObj = treeObj[0];
           }
           var nodeType = treeObj.get("nodeType");
           if (nodeType != "05") {
               self.msgbox("只能选择班级操作。");
               return;
          }
          var claiId = treeObj.get("id");
          var classDormGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.classdormgrid]");
          var count = classDormGrid.getStore().getCount();
          if (count <= 0) {
              self.msgbox("自动分配时，必须确保班级下有宿舍，并且有未分配的学生。");
              return;
         }
         var dormNotAllotGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.dormnotallotgrid]");
         var counts = dormNotAllotGrid.getStore().getCount();
         if (counts <= 0) {
             self.msgbox("自动分配时，必须确保班级下有宿舍，并且有未分配的学生。");
             return;
         }
         self.asyncAjax({
              url: comm.get('baseUrl') + "/BaseStudentDorm/dormAutoAllot", 
              params: {
                 classId: claiId
                 },                 
                 success: function(response) {
                  var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                  if(data.success){
                        var dormNotAllotGridstore = dormNotAllotGrid.getStore();
                        var proxy = dormNotAllotGridstore.getProxy();
                        whereSql = " where studentId not in (select stuId from DormStudentDorm where isDelete=0) and claiId='" + claiId + "' and isDelete=0";
                        proxy.extraParams = {
                          // whereSql: whereSql,
                          classId:claiId
                         };
                     dormNotAllotGridstore.loadPage(1);
                     self.msgbox(data.obj); 

                 }else {
                   self.Error(data.obj);
                 }           
               },
               failure: function(response) {                   
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
              }
       });
                  
      },

      saveDormAllot_Win: function(btn){
          var self=this;
          var win = btn.up('window');
          var gradId = win.gradId;//areaId
          var basepanel = win.down('basepanel[xtype=baseset.studentdorm.onekeyallotdormlayout]');
          var dormallotdetailgrid = basepanel.down('basegrid[xtype=baseset.studentdorm.dormallotdetailgrid]');
          if (dormallotdetailgrid.getStore().getCount() <= 0) {
            self.msgbox("没有宿舍信息，无法继续");
            return;
          }
          var getAt = dormallotdetailgrid.getStore().getAt(0);
          var nanDormCount = getAt.get('nanDormCount');   //男生所需宿舍
          var nvDormCount = getAt.get('nvDormCount');   //女生所需宿舍
          var sxDorm = getAt.get('sxDorm');        //合计所需宿舍 

          var nanDorm = getAt.get('nanDorm'); //男生有效宿舍
          var nvDorm = getAt.get('nvDorm'); //女生有效宿舍
          var hunDorm = getAt.get('hunDorm'); //混班有效宿舍

          var boyDormGrid = basepanel.down("basegrid[xtype=baseset.studentdorm.boydormgrid]"); //男宿舍列表
          var girlDormGrid = basepanel.down("basegrid[xtype=baseset.studentdorm.girldormgrid]"); //女宿舍列表
          if (nanDorm != 0 || nvDorm != 0 || hunDorm!= 0) {
              self.msgbox("一键分配时，不允许存在有效班级宿舍，如需使用一键分配，请将已有班级宿舍删除");
              return;
          }
          if (boyDormGrid.getStore().getCount() != nanDormCount) {
              self.msgbox("男生宿舍数量无法匹配，无法继续，请检查数据");
              return;
          }
          if (girlDormGrid.getStore().getCount() != nvDormCount) {
              self.msgbox("女宿舍数量无法匹配，无法继续，请检查数据");
              return;
          }
          var count = boyDormGrid.getStore().getCount() + girlDormGrid.getStore().getCount();
          if (count != (nanDormCount + nvDormCount + hunDorm)) {
              self.msgbox("宿舍所需总数无法匹配，请检查数据");
              return;
          }
          if (count==0) {
              self.msgbox("请选择男生或女生宿舍");
              return;
          }
          var uuid = null;
          var boyId = [];
          var girlId = [];
          for (var i = 0; i < boyDormGrid.getStore().getCount(); i++) {
              uuid = boyDormGrid.getStore().getAt(i).get('uuid');
              boyId.push(uuid);
          }
          for (var k = 0; k < girlDormGrid.getStore().getCount(); k++) {
              uuid = girlDormGrid.getStore().getAt(k).get('uuid');
              girlId.push(uuid);
          }
          boyId.join(",");
          girlId.join(",");
          Ext.Msg.confirm("一键分配", "一键分配之后不能回退，如要局部调整请进入手动分配宿舍界面", function(btns) {
            if (btns == 'yes') {
              var loading = self.LoadMask(win,'正在分配中，请等待...');

              self.asyncAjax({
                  url: comm.get('baseUrl') + "/BaseStudentDorm/onKeyAllotDorm",
                  params: {
                    gradId: gradId,
                    boyId: boyId,
                    girlId: girlId,
                  },                      
                  success: function(response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    if(data.success){
                      self.msgbox(data.obj); 
                      loading.hide();
                      win.close();                              
                    }else {
                      self.Error(data.obj);
                      loading.hide();
                      win.close();
                    }           
                    loading.hide();
                  },
                  failure: function(response) {                   
                    Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                    loading.hide();
                  }
              });     
            }
         })               
        },
    	doSelectBoy :function(btn){
        var self=this;
    		var dormInfo = btn.up('basepanel[xtype=baseset.studentdorm.onekeyallotdormlayout]');
    		var baseGrid = dormInfo.down('basegrid[xtype=baseset.studentdorm.boydormgrid]')
    		var funcPanel = "pubonkeyallotdorm.mainlayout";
    		var funcTitle = "宿舍列表";
        var otherController = 'baseset.studentdorm.othercontroller';
        var win = Ext.createWidget("mtfuncwindow", {
            title: funcTitle,
            width: 1100,
            identify: 1,
            baseGrid: baseGrid,
            controller: otherController, 
            height: 500,
            maximizable: false,
            resizable: false, //禁止拖动
            funcPanel: funcPanel,
            items: {
              xtype: funcPanel
            },
           }); //打开自定义窗口 
      
          var oneKeyPanel = win.down("basepanel[xtype=pubonkeyallotdorm.mainlayout]");
          var girldormdefintree = oneKeyPanel.down("basetreegrid[xtype=pubonkeyallotdorm.girldormdefinetree]");
          var boydormdefintree = oneKeyPanel.down("basetreegrid[xtype=pubonkeyallotdorm.boydormdefinetree]");
          girldormdefintree.hidden=true;
          boydormdefintree.hidden=false;
          win.show();
          },
        doDeleteBoyDorm :function(btn){
          var self=this;
        	var boyDormGrid = btn.up('basegrid[xtype=baseset.studentdorm.boydormgrid]');
        	var rows = boyDormGrid.getSelectionModel().getSelection();
        	if (rows <= 0) {
        		self.msgbox("请选择要删除的数据!");
        		return;
        	}
        	for (var i = 0; i < rows.length; i++) {
                  boyDormGrid.getStore().remove(rows[i]); //将选中的移除
              }
          var conutHtml="总数："+boyDormGrid.getStore().getCount();
          boyDormGrid.down('panel[ref= boyTotalInfo]').setHtml(conutHtml);

          },

         doSelectGirl :function(btn){
            var self=this;
          	var dormInfo = btn.up('basepanel[xtype=baseset.studentdorm.onekeyallotdormlayout]');
          	var baseGrid = dormInfo.down('basegrid[xtype=baseset.studentdorm.girldormgrid]')
            var funcPanel = "pubonkeyallotdorm.mainlayout";
          	var funcTitle = "宿舍列表";
            var otherController = 'baseset.studentdorm.othercontroller';
            var win = Ext.createWidget("mtfuncwindow", {
            	title: funcTitle,
            	items: {
            		xtype: funcPanel
              },
            	width: 1100,
            	identify: 2,
            	baseGrid: baseGrid,
              controller: otherController, 
            	height: 500,
            	maximizable: false,
              resizable: false, //禁止拖动
              funcPanel: funcPanel,
              }); //打开自定义窗口

          var oneKeyPanel = win.down("basepanel[xtype=pubonkeyallotdorm.mainlayout]");
          var girldormdefintree = oneKeyPanel.down("basetreegrid[xtype=pubonkeyallotdorm.girldormdefinetree]");
          var boydormdefintree = oneKeyPanel.down("basetreegrid[xtype=pubonkeyallotdorm.boydormdefinetree]");
          girldormdefintree.hidden=false;
          boydormdefintree.hidden=true;
          win.show();
        },
        doDeleteGirlDorm :function(btn){
          var self=this;
        	var girlDormGrid = btn.up('basegrid[xtype=baseset.studentdorm.girldormgrid]');
        	var rows = girlDormGrid.getSelectionModel().getSelection();
        	if (rows <= 0) {
        		self.msgbox("请选择要删除的数据!");
        		return;
        	}
        	for (var i = 0; i < rows.length; i++) {
                  girlDormGrid.getStore().remove(rows[i]); //将选中的移除
              }
          var conutHtml="总数："+girlDormGrid.getStore().getCount();
          girlDormGrid.down('panel[ref= girlTotalInfo]').setHtml(conutHtml);
          },
        doGetDorm: function(btn){
            var self=this;
            var win = btn.up('window');
            var baseGrid = win.baseGrid;
            var identify = win.identify;
            var isselectdormgrid = win.down('panel[xtype=pubonkeyallotdorm.isselectdormgrid]');
            var dormInfo = baseGrid.up('basepanel[xtype=baseset.studentdorm.onekeyallotdormlayout]');
            var arr1 = [];
            var arr2 = [];
            var arr3 = [];
            var arr4 = [];
            var data = null;
            var getAt = null;
            for (var j = 0; j < baseGrid.getStore().getCount(); j++) {
              getAt = baseGrid.getStore().getAt(j);
              data = getAt.data
              arr1.push(getAt.get('uuid'));//男女宿舍列表
            };
            for (var i = 0; i < isselectdormgrid.getStore().getCount(); i++) {
              getAt = isselectdormgrid.getStore().getAt(i);
              data = getAt.data
              arr2.push(getAt.get('uuid'));//已选宿舍
            };
            for (var s in arr1) {
              for (var x in arr2) {
                if (arr1[s] == arr2[x]) {
                  arr3.push(arr1[s]);
                }
              }
            }
           if (arr3.length > 0) {
              self.Warning("列表中已有相同的宿舍，请勿重复选择!");
              return;
            }
            if (identify == 1) {
              for (var k = 0; k < isselectdormgrid.getStore().getCount(); k++) {
                getAt = isselectdormgrid.getStore().getAt(k);
                data = getAt.data
                baseGrid.getStore().insert(0, data);
              };
              var boyDormGrid = dormInfo.down('basegrid[xtype=baseset.studentdorm.boydormgrid]');
              var conutHtml="总数："+isselectdormgrid.getStore().getCount();
              boyDormGrid.down('panel[ref= boyTotalInfo]').setHtml(conutHtml);

              win.close();
            } else if (identify == 2) {
              for (var k = 0; k < isselectdormgrid.getStore().getCount(); k++) {
                getAt = isselectdormgrid.getStore().getAt(k);
                data = getAt.data
                baseGrid.getStore().insert(0, data);
              };
              var girlyDormGrid = dormInfo.down('basegrid[xtype=baseset.studentdorm.girldormgrid]');
              var conutHtml="总数："+isselectdormgrid.getStore().getCount();
              girlyDormGrid.down('panel[ref= girlTotalInfo]').setHtml(conutHtml);

              win.close();
            } else {
              return;
            }

          },
          doDeleteEmpMixDorm: function(btn){
               var self=this;
               var mainLayout = btn.up('basepanel[xtype=baseset.studentdorm.adjustdormlayout]');
               var baseGrid = mainLayout.down('basegrid[xtype=baseset.studentdorm.emptymixdormgrid]');
               var uuid = "";
               var rows = baseGrid.getSelectionModel().getSelection();
               if (rows <= 0) {
                self.msgbox("请先选择宿舍再进行操作!");
                return;
               }
               for (var i = 0; i < rows.length; i++) {
                uuid = uuid + rows[i].get('uuid') + ",";
               }
               Ext.Msg.confirm('删除宿舍', '确定要删除宿舍吗？', function(btns) {
                  var loading = self.LoadMask(baseGrid,'正在删除中，请等待...');
                  if (btns == 'yes') {
                  self.asyncAjax({
                        url: comm.get('baseUrl') + "/BaseStudentDorm/dormDoDelete",
                        params: {
                           uuid: uuid
                        },                      
                   success: function(response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        if(data.success){
                            baseGrid.getStore().remove(records); //不刷新的方式
                            self.msgbox(data.obj); 
                         }else {
                            self.Error(data.obj);
                          }   
                            loading.hide();        
                        },    
                    failure: function(response) {                   
                          Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                          loading.hide();
                    }
                  }); 
              }
            });
         },
      doHandAllot:function(btn){
          var self=this;
          var mainLayout = btn.up('basepanel[xtype=baseset.studentdorm.adjustdormlayout]');
          var objSelect = null;
          var yrzs = 0; //宿舍已入住总人数
          var zdrs = 0; //宿舍最大人数
          var krzrs = 6; //可入住人数
          //获取到未住满的宿舍
          var mixdormgrid =  mainLayout.down('basegrid[xtype=baseset.studentdorm.mixdormgrid]');
          //获取到空宿舍 
          var emptymixdormgrid = mainLayout.down("basegrid[xtype=baseset.studentdorm.emptymixdormgrid]");
          //获取到未分配满的宿舍
          var selectJwtr = mixdormgrid.getSelectionModel().getSelection();
          //获取到人数为零的宿舍
          var selectJwtr2 = emptymixdormgrid.getSelectionModel().getSelection();
          //首先判断是否选中了两边的宿舍
          if (selectJwtr.length <= 0 && selectJwtr2.length <= 0) {
              self.msgbox("请选择宿舍再进行操作，选择宿舍时可以任意选择未住满宿舍或人数为零的宿舍");
              return;
          }
          if (selectJwtr.length > 0 && selectJwtr2.length > 0) {
             self.msgbox("只能选取未住满宿舍，或者人数为零的宿舍，不能两边都选取。");
             return;
         }
         if (selectJwtr.length > 0) {
              objSelect = selectJwtr;
              var ps = objSelect[0];
              zdrs = ps.get("dormBedCount"); //宿舍最大人数
              yrzs = parseInt(ps.get("stuCount")); //宿舍已入住人数
              krzrs = zdrs - yrzs;
            }
        if (selectJwtr2.length > 0) {
              objSelect = selectJwtr2;
            }
          var gridObj = objSelect[0];
          var cdormId = gridObj.get("uuid"); //班级宿舍主键
          var dormType = gridObj.get("dormType"); //宿舍类型
          var claiId = gridObj.get("claiId"); //班级id
         //获取选中的学生
          var stuNotDormGrid = mainLayout.down("basegrid[xtype=baseset.studentdorm.notallotstugrid]");
          var rows = stuNotDormGrid.getSelectionModel().getSelection();
          var stuId = "";
          if (rows <= 0) {
              self.msgbox("选中要分配的学生再进行操作!");
              return;
            }
          if (rows.length > krzrs) {
              self.msgbox("该宿舍现最多只能分配" + krzrs + "人!");
              return;
            }
          //判断性别
          for (var i = 0; i < rows.length; i++) {
             //将学生主键加入到list
             stuId = stuId + rows[i].get('userId') + ",";
             if (dormType != 3) {
              if (dormType != rows[i].get('xbm')) {
                self.msgbox("选择宿舍的性别与选中学生性别不匹配无法继续!");
                return;
              }
            }
          }
          Ext.Msg.confirm('分配确认', '分配宿舍之后，只能从宿舍记录中删除，或者手动修改床号、柜号', function(btns) {
            if (btns == 'yes') {
              var loading = self.LoadMask(mainLayout,'正在分配中，请等待...');
              self.asyncAjax({
                  url: comm.get('baseUrl') + "/BaseStudentDorm/dormHandAllot",
                  params: {
                    cdormId: cdormId,
                    stuId: stuId,
                    claiId: claiId,
                    bedNum: yrzs
                  },                 
                success: function(response) {
                  var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                  if(data.success){
                      mixdormgrid.getStore().load();
                      emptymixdormgrid.getStore().load();
                      stuNotDormGrid.getStore().load();
                      self.msgbox(data.obj); 
                      loading.hide();
                  }else {
                      self.Error(data.obj);
                      loading.hide();
                  }           
                  loading.hide();
                },
                failure: function(response) {                   
                  Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                  loading.hide();
                }
              });     
            }
         });
       },

      });
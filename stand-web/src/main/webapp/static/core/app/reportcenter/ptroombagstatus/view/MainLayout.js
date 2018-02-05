Ext.define("core.reportcenter.ptroombagstatus.view.MainLayout", {
  	extend: "core.base.view.BasePanel",
  	alias: 'widget.reportcenter.ptroombagstatus.mainlayout',

    requires: [   
    "core.reportcenter.ptroombagstatus.controller.MainController",
    ],

    /** 关联此视图控制器 */
    controller: 'reportcenter.ptroombagstatus.maincontroller',

    funCode: "ptroombagstatus_main",
    detCode: 'ptroombagstatus_detail',
    detLayout: 'reportcenter.ptroombagstatus.detaillayout',

    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'reportcenter.ptroombagstatus.othercontroller',

    funData: {
  		action: comm.get('baseUrl') + "/Bag", //请求Action
  		pkName: "uuid",
  		defaultObj: {

      },
    },
  	tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
        titleField:'',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
        addTitle:'',
        editTitle:'',
        detailTitle:'',
        addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
        editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
        detailXtype:null,	//2018/1/3新加入，用于在公共方法中打开指定的界面
    },

      minWidth:1000,
      minHeight:600,
      scrollable:'x',
      layout:'border',

      items: [{
        xtype: "reportcenter.ptroombagstatus.roominfotree",		
        region: "west",
        width:300,
        split:true,
      },{
        xtype: 'basecenterpanel',
        region: "center",          
        layout:'border',
        items: [{
            xtype: "reportcenter.ptroombagstatus.querypanelgrid",
            //layout: 'form',
            region: "north",
            height: 50, 
            bodyStyle:{
                background: '#f5f5f5'
            }                
          },{
            xtype: "reportcenter.ptroombagstatus.ptroomwallethtml",
            region: "north",
            style:{
                background: '#fff'
            },
            height: 180
          },{
            xtype: "reportcenter.ptroombagstatus.ptroomwalletgrid",
            hidden:true
          },{
            xtype: "reportcenter.ptroombagstatus.pttermwalletgrid",
            region: "center",
            height: 150,
            margin:'5 0 5 0'
          },{
            xtype: "container",
            layout: "hbox",
            region: "south",
            height: 200,
            items: [{
              flex: 1,
              xtype: "reportcenter.ptroombagstatus.userwalletgrid",
              style:{
                  borderRight:'6px solid #ececec'
              },
            }, {
                flex: 1,
                xtype: "reportcenter.ptroombagstatus.ptirroomdevicegrid",
            }]
          }]
          
      }]
    
  })

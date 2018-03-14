Ext.define("core.wisdomclass.roomterm.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: 'widget.wisdomclass.roomterm.maingrid',
    dataUrl: comm.get("baseUrl") + "/BaseInfoterm/list", //数据获取地址
    model: "com.zd.school.oa.terminal.model.OaInfoterm", //对应的数据模型
    menuCode:"ROOMTERM",
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '分配',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle',
            funCode:'girdFuntionBtn',
            //disabled:true
        },/*{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            iconCls: 'x-fa fa-pencil-circle',
            funCode:'girdFuntionBtn',
            disabled:true
        },*/{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-minus-circle',
            disabled:true
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   
            iconCls: 'x-fa fa-file-excel-o'
        }]
    },
    tbar:null,
    panelButtomBar:{},
    //排序字段
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },{
        property: "termCode", //排序字段
        direction: "ASC" //升降充
    }],
    //扩展参数
    extParams: {
        filter: "[{'type':'numeric','comparison':'=','value':1,'field':'isUse'}]"
    },
    columns: {
        defaults:{
            align:'center',
            titleAlign:"center"
        },
        items: [ {
            text: "终端号",
            flex:1,
            dataIndex: "termCode",
            renderer: function(value, metaData) {
                var title = "终端号";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "类型",
            width:100,
            dataIndex: "termType",
            columnType: "basecombobox", //列类型
            ddCode: "INFOTERTYPE" //字典代码
        }, {
            text: "规格",
            width:100,
            dataIndex: "termSpec",
            renderer: function(value, metaData) {
                var title = "规格";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "分配人",
            width:100,
            dataIndex: "updateUser",
            renderer: function(value, metaData) {
                var title = "分配人";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "房间名称",
            width:120,
            dataIndex: "roomName",
            renderer: function(value, metaData) {
                var title = "房间名称";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "门牌号",
            width:100,
            dataIndex: "houseNumb",
            renderer: function(value, metaData) {
                var title = "门牌号";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{

            text: "操作",
            xtype: "actiontextcolumn",
            align: 'center',
            width: 150,
            fixed: true,
            items: [/*{
                text:'编辑',  
                style:'font-size:12px;', 
                tooltip: '编辑',
                ref: 'gridEdit',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="ROOMTERM";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('editClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            },*/ {
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="ROOMTERM";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('deleteClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }, {
                text:'详细',  
                style:'font-size:12px;', 
                tooltip: '详细',
                ref: 'gridDetail',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
      }]
  },
})
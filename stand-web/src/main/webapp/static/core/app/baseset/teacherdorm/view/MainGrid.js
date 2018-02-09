Ext.define("core.baseset.teacherdorm.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.teacherdorm.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseTeacherDrom/list",
    model: "com.zd.school.build.allot.model.DormTeacherDorm",
    al:false,
    menuCode:"BASETEACHERDORM", //new：此表格与权限相关的菜单编码
    extParams: {
    },
    defSort: [{
        property: 'inTime',
        direction: 'DESC'
    },{
        property: 'bedNum',
        direction: 'ASC'
    }],
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '数据列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '入住',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-minus-circle',
            disabled:true,
         }, {
            xtype: 'button',
            text: '退住',
            ref: 'gridOut',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-minus-circle',
            disabled:true,  
      }],
    }, 
    panelButtomBar:{},
    columns: {
        defaults:{
            titleAlign:"center"
        },
        items:[{ 
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "主键",
            dataIndex: "uuid",
            hidden:true
        }, {
            text: "教师老师主键",
            dataIndex: "tteacId",
            hidden:true
        }, {
            text: "房间主键",
            dataIndex: "roomId",
            hidden:true
        }, {
            text: "房间主键",
            dataIndex: "dormId",
            hidden:true
        }, {
            flex:1,
            minWidth: 100,
            text: "老师姓名",
            dataIndex: "xm",
            field: {
                xtype: "textfield"
            }
        }, {
            flex:1.2,
            minWidth:120,
            text: "工号",
            dataIndex: "gh",
            field: {
                xtype: "textfield"
            }
        }, {
            flex:1.2,
            minWidth:120,
            text: "房间名称",
            dataIndex: "dormName",
            field: {
                xtype: "textfield"
            }
        }, {
            width:80,
            text: "柜子编号",
            dataIndex: "arkNum",
            field: {
                xtype: "textfield"
            }
        }, {
            width:80,
            text: "床位编号",
            dataIndex: "bedNum",
            field: {
                xtype: "textfield"
            }
        }, {
            width:150,
            text: "入住时间",
            dataIndex: "inTime",
            field: {
                xtype: "textfield"
            }
        }, {
            width:80,
            text: "入/退状态",
            dataIndex: "inout",
            renderer: function(value) {
                switch (value) {
                    case 0:
                        return '入住';
                        break;
                    case 1:
                        return '退住';
                        break;
                }
            }
        }, {
            width:150,
            text: "退住时间",
            dataIndex: "outTime",
            field: {
                xtype: "textfield"
            }
        }, {
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 100,
            fixed: true,
            items: [{
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="BASETEACHERDORM";     // 此菜单的前缀
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
                text:'退住',  
                style:'font-size:12px;', 
                tooltip: '退住',
                ref: 'gridOut',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(record.get("inout")=="1"){
                         return 'x-hidden-display';
                     }else{
                        if(comm.get("isAdmin")!="1"){
                        var menuCode="BASETEACHERDORM";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridOut")==-1){
                            return 'x-hidden-display';
                        }
                      }

                    }
                    return null; 
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('outClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }
         
});
Ext.define("core.baseset.roomdefine.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomdefine.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",

    menuCode:"BASEROOMDEFINE", //new：此表格与权限相关的菜单编码
    extParams: {
        filter: '[{"type":"string","comparison":"!=","value":"0","field":"roomType"}]'
    },
    al:false,
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
            text: '设置房间',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '解除设置',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-minus-circle',
            msg:'是否要解除此房间？',
            disabled:true
        },{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            name: "roomType", //字段名
            xtype: "combobox",
            store:{
                type:'baseset.roomdefine.roomtypestore'
            },
            displayField: 'roomDefineType',
            valueField: 'code',
            value: "",
            emptyText: '请选择房间类型',
            blankText: '请选择一个房间类型',
            editable: false,
            mode: 'local',
            funCode: 'girdFastSearchText',
        },{
            xtype:'textfield',
            name:'roomName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入房间标志'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型  
            iconCls: 'x-fa fa-search',  
        }]
    }, 
   panelButtomBar:{},
   defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },/*{
        property: 'createTime',
        direction: 'DESC'
    }*/],
   columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items:[{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "房间主键",
            dataIndex: "roomId",
            hidden: true
        }, {
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            flex: 1,
            minWidth: 100,
            text: "房间名称",
            dataIndex: "roomName"
        },{
            width: 120,
            text: "房间编号",
            dataIndex: "roomCode",           
        },{
            text: "房间类型", //字段中文名
            dataIndex: "roomType", //字段名
            columnType: "basecombobox", //列类型
            width: 120,
            ddCode: "FJLX" //字典代码
        },{
            width: 120,
            text: "所属楼层",
            dataIndex: "areaName",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 120,
            text: "所属楼栋",
            dataIndex: "areaUpName",
            field: {
                xtype: "textfield"
            }
        },{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 200,
            fixed: true,
            items: [{
                text:'编辑宿舍',  
                style:'font-size:12px;', 
                tooltip: '编辑宿舍',
                ref: 'gridEdit',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){   
                    if(record.get("roomType")!="1"){                    
                        return 'x-hidden-display';                    
                    }else{
                       if(comm.get("isAdmin")!="1"){
                        var menuCode="BASEROOMDEFINE";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridEdit")==-1){
                            return 'x-hidden-display';
                        }
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
            }, {
                text:'解除设置',  
                style:'font-size:12px;', 
                tooltip: '解除设置',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="BASEROOMDEFINE";     // 此菜单的前缀
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
                        record: rec,
                        msg:'是否要解除此房间？'
                    });
                }
            }, {
                text:'详情',  
                style:'font-size:12px;', 
                tooltip: '详情',
                ref: 'gridDetail',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(record.get("roomType")!="1"){                    
                        return 'x-hidden-display';                    
                    }
                    return null; 
                }, 
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }
});
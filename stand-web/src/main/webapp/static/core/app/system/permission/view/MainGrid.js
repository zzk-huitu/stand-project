/*
* 班级学员表
*/
Ext.define("core.system.permission.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.permission.maingrid",
    al:false,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/SysMenuPermission/list", //数据获取地址
    model: "com.zd.school.plartform.system.model.SysMenuPermission", //对应的数据模型
    menuCode:"SYSPERIMISSON",
    /**
     * 工具栏操作按钮
     * 继承自core.base.view.BaseGrid可以在此覆盖重写
     */
    panelTopBar:{
        xtype:'toolbar',
        items: [ {
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle',
        }, {
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            iconCls: 'x-fa fa-pencil-square',
            disabled: true
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-minus-circle',
            disabled: true
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'perName',
            funCode:'girdFastSearchText', 
            isNotForm:true,   //由于文本框重写了baseform下面的funcode值，所以使用这个属性，防止重写这里设定的fundcode值。
            emptyText: '请输入权限名称'
        },{
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',   
            iconCls: 'x-fa fa-search',  
        }]
    },
    /**
     * 高级查询面板
     */
    panelButtomBar: null,
     
    /** 排序字段定义 */
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],
    /** 扩展参数 */
    extParams: {
        whereSql: "",
        //查询的过滤字段
        //type:字段类型 comparison:过滤的比较符 value:过滤字段值 field:过滤字段名
        //filter: "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"null\",\"field\":\"classId\"}]" //默认是查不出数据的
    },
    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            titleAlign:"center",
            align: 'center'
        },
        items:[{
            xtype: "rownumberer",
            flex: 0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            width: 150,
            text: "权限名称",
            dataIndex: "perName"
        },{
            width: 150,
            text: "所属菜单",
            dataIndex: "menuText"
        }, {
            width: 200,
            text: "权限接口全称",
            dataIndex: "perAuth",
            renderer: function(value,metaData,record) {  
                if(value)
                    return record.get("perAuthCode")+"_"+value;
 
                return value;  
            }  
        },{
            width: 150,
            text: "按钮别名",
            dataIndex: "perBtnName"
        },{
            flex:1,
            minWidth: 150,
            text: "备注",
            dataIndex: "perRemark",
            renderer: function(value,metaData) {  

                var title=" 备注 ";

                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
                return value;  
            }  
        },{
            xtype:'actiontextcolumn',
            text: "操作",
            width:200,
            fixed:true,
            align:'center',
            items: [{
                text:'编辑',  
                style:'font-size:12px;',         
                tooltip: '编辑',
                ref: 'gridEdit_Tab', 
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SYSPERIMISSON";     // 此菜单的前缀
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
                        view:view.grid,
                        record: rec,
                        cmd:"edit"
                    });
                }
            },{
                text:'删除',  
                style:'font-size:12px;',
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SYSPERIMISSON";     // 此菜单的前缀
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
                        view:view.grid,
                        record: rec
                    });
                }
            }]
        }]   
    } 
});
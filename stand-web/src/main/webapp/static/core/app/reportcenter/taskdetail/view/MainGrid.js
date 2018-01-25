
Ext.define("core.reportcenter.taskdetail.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.taskdetail.maingrid",
    dataUrl: comm.get('baseUrl') + "/PtTask/list",
    model: "com.zd.school.ykt.model.PtTask",
    menuCode:"TASK_DETAIL", //new：此表格与权限相关的菜单编码
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '任务明细',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px',
            }
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file-excel-o'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        }, {
            xtype:'basecombobox',
            ddCode: "TASKTYPE",
            name:'tasktype',
            funCode: 'girdFastSearchText',
            emptyText: '请输入任务类型'
        }, {
            xtype:'textfield',
            name:'termsn',
            funCode: 'girdFastSearchText',
            emptyText: '请输入设备序列号'
        }, {
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:{
    },

    
    //排序字段及模式定义
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },{
        property: 'executetime',
        direction: 'ASC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            text: "任务编号",
            dataIndex: "taskno",
            flex:1,
            minWidth:120
        },{
            text: "任务日期",
            dataIndex: "taskdate",
            width:150,
        },{
            text: "任务类型",
            dataIndex: "tasktype",
            columnType: "basecombobox", //列类型
            ddCode: "TASKTYPE", //字典代码
            width:120,
        },{
            text: "设备类型",
            dataIndex: "devicetype",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE",//字典代码
            width:150,
        },{
            text: "设备序列号",
            dataIndex: "termsn",
            width:120,
        },{
            text: "设备序名称",
            dataIndex: "termName",
            width:120,
        },{
            text: "重试次数",
            dataIndex: "retrycount",
            width:120,
        },{
            text: "执行次数",
            dataIndex: "executecount",
            width:120,
        },{
            text: "执行时间",
            dataIndex: "executetime",
            width:150,
        },{
            text: "执行结果",
            dataIndex: "executeresult",
            width:120,
            renderer:function(v){
               return v==true?"<font color=green>成功</font>":"<font color=red>失败</font>"
           }
       },{
        text: "任务是否结束",
        dataIndex: "istaskover",
        width:120,
        renderer:function(v){
           return v==true?"<font color=green>是</font>":"<font color=red>否</font>"
       }
    },{
        text: "结果消息",
        dataIndex: "resultmsg",
        width:120,
        renderer: function(value,metaData) {  
            var title=" 结果消息 ";
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
            return value;  
        }  
    },{
        xtype: 'actiontextcolumn',
        text: "操作",
        align: 'center',
        width: 100,
        fixed: true,
        items: [{
            text:'查看参数',  
            style:'font-size:12px;', 
            tooltip: '查看参数',
            ref: 'gridDetail',
            getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                if(comm.get("isAdmin")!="1"){
                    var userBtn=comm.get("userBtn");                 
                    if(userBtn.indexOf(this.menuCode+"_gridDetail")==-1){
                        return 'x-hidden-display';
                    }
                }
                return null; 
            },  
            handler: function(view, rowIndex, colIndex, item) {
                var rec = view.getStore().getAt(rowIndex);
                this.fireEvent('detailClick_Win', {
                    view: view.grid,
                    record: rec
                });
            }
        }]
    }]
    }    
});
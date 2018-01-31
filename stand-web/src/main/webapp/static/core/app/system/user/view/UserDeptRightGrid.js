Ext.define("core.system.user.view.UserDeptRightGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.user.userdeptrightgrid",
    dataUrl: comm.get('baseUrl') + "/SysDeptright/list",
    model: 'com.zd.school.plartform.system.model.SysDeptRight',
    title:"用户部门权限",
    al:false,
    //remoteSort:false,
    
    panelTopBar:{
        xtype:'toolbar',
        items: [ {
            xtype: 'tbtext',
            html: '指定部门',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },{
            xtype: 'button',
            text: '添加部门权限',
            ref: 'gridAdd',
            iconCls: 'x-fa fa-plus-circle'
        }, {
            xtype: 'button',
            text: '解除部门权限',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-minus-circle'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'deptName',
            funCode:'girdFastSearchText', 
            isNotForm:true,   //由于文本框重写了baseform下面的funcode值，所以使用这个属性，防止重写这里设定的fundcode值。
            emptyText: '输入部门查询'
        },{
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',   
            iconCls: 'x-fa fa-search',  
        }],
    },
    panelButtomBar:null,
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
    // extParams: {
    //     whereSql: "",
    //     filter:"[{'type':'numeric','comparison':'=','value':0,'field':'isDelete'},{'type':'string','comparison':'=','value':'0','field':'userId'}]"
    // },
   

    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "部门名称",
            dataIndex: "deptName",
            flex:1,
            minWidth:400            
        }]
    }
});
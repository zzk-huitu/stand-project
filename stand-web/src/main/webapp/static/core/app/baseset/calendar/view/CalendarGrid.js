Ext.define("core.baseset.calendar.view.CalendarGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.calendar.calendargrid",
    dataUrl: comm.get('baseUrl') + "/BaseCalender/list",
    model: factory.ModelFactory.getModelByName("com.zd.school.jw.eduresources.model.JwCalender", "checked").modelName,
    
   
    menuCode:"SCHOOLCALENDAR", //new：此表格与权限相关的菜单编码
    pageDisplayInfo:false,
    //title: "作息时间目录",
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '作息时间目录',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelTime',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        }, {
            xtype: 'button',
            text: '启用',
            disabled:true,
            funCode:'girdFuntionBtn', 
            iconCls: 'x-fa fa-star',
            ref: 'gridUse'
        }],
    }, 
    panelButtomBar:{},
  //排序字段及模式定义
    defSort: [{
        property: 'activityState',
        direction: 'DESC'
    },{
        property: 'activityTime',
        direction: 'DESC'
    },{
        property: 'updateTime',
        direction: 'DESC'
    },],
   
    multiSelect: false,
   // sortableColumns: false,
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
       items: [{
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
        text: "校历名称",
        dataIndex: "canderName",
        field: {
            xtype: "textfield"
        },
        flex: 1,
        minWidth: 150,
        renderer: function(value,metaData) {  
            var title=" 校历名称 ";
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
            return value;  
        }

    }, {
        width: 120,
        text: "生效时间",
        dataIndex: "activityTime",
        renderer: function(v) {
                var date = v.replace(new RegExp(/-/gm), "/");
                return Ext.Date.format(new Date(date), 'Y-m-d');
            }
    }, {
        width: 120,
        text: "适用校区",
        dataIndex: "campusName",
    }, {
        width: 120,
        //fixed : true,
        text: "状态",
        dataIndex: "activityState",
        renderer: function(v) {
            if (v == 1) {
                return "<span style='color:green'>已生效</span>";
            } else {
                return "<span style='color:red'>未生效</span>";
            }

        }
    }]
   } 
   
})
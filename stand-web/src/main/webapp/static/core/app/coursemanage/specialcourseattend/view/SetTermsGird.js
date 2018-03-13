Ext.define("core.coursemanage.specialcourseattend.view.SetTermsGird", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.coursemanage.specialcourseattend.settermsgird",
    model: 'com.zd.school.oa.terminal.model.OaInfoterm',
    dataUrl: comm.get("baseUrl") + "/AttendTerm/termAttendlist", //数据获取地址
    //title:"绑定费率的设备",
    al:false,
    tbar: [{
        xtype: 'button',
        text: '添加',
        ref: 'gridAdd',
        iconCls: 'x-fa fa-plus-circle'
    },{
        xtype: 'button',
        text: '删除',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle'
    }],
    panelTopBar:null,
    panelButtomBar:null,
    remoteSort:false,
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
    extParams: {
    },
   
   
    columns: {
        defaults: {
            titleAlign: "center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
        }, {
            text: "终端号",
            dataIndex: "termCode",
            flex:1,
        },{
            text: "终端类型",
            dataIndex: "termType",
            flex:1,
            columnType: "basecombobox", //列类型
            ddCode: "INFOTERTYPE", //字典代码
        },{
            text: "规格",
            dataIndex: "termSpec",
            flex:1,
        },{
            text: "门牌号",
            dataIndex: "houseNumb",
            flex:1,
        },{
            text: "使用状态",
            dataIndex: "isUse",
            flex:1,
            renderer: function(value) {
                switch (value) {
                  case 0:
                    return '<font color=red>未使用</font>';
                    break;
                  case 1:
                    return '<font color=green>已使用</font>';                    
                    break;
                }
            }
        }]
    },
 
});
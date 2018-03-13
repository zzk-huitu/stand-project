Ext.define("core.coursemanage.specialcourseattend.view.SetTimesGird", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.coursemanage.specialcourseattend.settimesgird",
    model: "com.zd.school.oa.attendance.model.AttTime",
    dataUrl: comm.get("baseUrl") + "/AttendTime/list", //数据获取地址
    //title:"绑定费率的设备",
    al:false,
    tbar: [{
        xtype: 'button',
        text: '添加',
        ref: 'gridAdd',
        iconCls: 'x-fa fa-plus-circle'
    },{
        xtype: "button",
        text: "编辑",
        ref: "gridEdit",
        iconCls: "x-fa fa-pencil-square",
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
        }, {
            text: "星期",
            dataIndex: "weekDay",
            width:100,
        }, {
            text: "选课开始日期",
            dataIndex: "beginDate",
            flex:1,
            renderer: function(v) {
                if(v.trim()!=""){
                    var date = v.replace(new RegExp(/-/gm), "/");
                    return Ext.Date.format(new Date(date), 'Y-m-d');
                }else
                return "";
            }
        }, {
            text: "选课结束日期",
            dataIndex: "endDate",
            flex:1,
            renderer: function(v) {
                if(v.trim()!=""){
                    var date = v.replace(new RegExp(/-/gm), "/");
                    return Ext.Date.format(new Date(date), 'Y-m-d');
                }else
                return "";
            }
        }, {
            text: "开始时间",
            dataIndex: "beginTime",
            flex:1,
            renderer:function(v){
                if(v.trim()!=""){
                    var date=v.replace(new RegExp(/-/gm) ,"/");
                    return Ext.Date.format(new Date(date), 'H:i');
                }else
                return "";
            }
        }, {
            text: "结束时间",
            dataIndex: "endTime",
            flex:1,
            renderer:function(v){
                if(v.trim()!=""){
                    var date=v.replace(new RegExp(/-/gm) ,"/");
                    return Ext.Date.format(new Date(date), 'H:i');
                }else
                return "";
            }
        }, {
            text: "节次",
            dataIndex: "teachTime",
            width:100,
        }]
    },
});
Ext.define("core.baseset.studentdorm.view.DormAllotFinishGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.dormallotfinishgrid",

    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/list",
    model: "com.zd.school.build.allot.model.DormStudentDorm",
    extParams: {
        whereSql: " and isDelete=0",
    },
    defSort: [{
        property: 'inTime',
        direction: 'DESC'
    }],
    al: false,
    noPagging: false,
    pageDisplayInfo:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '已入住宿舍学生',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '取消分配',
            ref: 'dormDelete',
            iconCls: 'x-fa fa-plus-circle',
            titleAlign:'right',
        },{
            xtype: 'button',
            text: '保存修改',
            ref: 'dormSave',
            iconCls: 'x-fa fa-plus-circle'
        }]
    },
    
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

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
            text: "分配宿舍主键",
            dataIndex: "uuid",
            editable: false,
            hidden: true
        }, {
            flex : 1,
            minWidth:80,
            text: "学生学号",
            dataIndex: "userNumb",
            editable: false
        }, {
            flex : 1,
            minWidth:80,
            text: "学生姓名",
            dataIndex: "xm",
            editable: false
        }, {
            text: "*床位",
            dataIndex: "bedNum",
            width: 60,
            editor: {
                allowBlank: false,
                regex: /^[0-9]*$/,
                regexText: '只能输入数字'
            }
        }, {
            text: "*柜号",
            dataIndex: "arkNum",
            width: 60,
            editor: {
                allowBlank: false,
                regex: /^[0-9]*$/,
                regexText: '只能输入数字'
            }
        }, {
            width: 80,
            text: "所在宿舍",
            dataIndex: "roomName",
            editable: false,
            renderer: function(value, metaData) {
                var title = "所在宿舍";
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';
                return value;
            }
        }, {
            text: "入住时间",
            dataIndex: "inTime",
            width: 130,
            editable: false,            
            renderer: function(value, metaData) {
                var date = value.replace(new RegExp(/-/gm), "/");
                var title = "入住时间";
                var ss = Ext.Date.format(new Date(date), 'Y-m-d H:i')
                var html = ss;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return ss;
            }
        }],
    },
    listeners: {
        itemclick: function() {
            return false;
        },
        itemdblclick: function() {
            return false;
        }
    }
})
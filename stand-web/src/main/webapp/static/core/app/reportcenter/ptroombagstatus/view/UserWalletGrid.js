Ext.define("core.reportcenter.ptroombagstatus.view.UserWalletGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptroombagstatus.userwalletgrid",
    dataUrl: comm.get('baseUrl') + "/Bag/userbagyue",
    model: "com.zd.school.teacher.teacherinfo.model.TeaTeacherbase",
    menuCode:"PtRoombagStatus",
    al:false,
    height: 200,
    extParams: {
        whereSql: "",
        querySql:""
    },
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '用户钱包',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px',
            }
        }]
    },
    panelButtomBar:{},
    defSort:[],
  //  title: "用户钱包",
  columns: {        
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
        text: "学号",
        dataIndex: "userNumb",
        flex:1,
        minWidth:120,
        renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
            value= record.raw.USER_NUMB;
            return value
        }
    }, {
        text: "姓名",
        dataIndex: "xm",
        width:120,
        renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
            value= record.raw.XM;
            return value
        }
    }, {
        text: "卡消费余额(元)",
        dataIndex: "cardValueXF",
        width:120,
        renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
            value= record.raw.CardValueXF;
            return parseFloat(value).toFixed(2)
        }
    }]
},

});
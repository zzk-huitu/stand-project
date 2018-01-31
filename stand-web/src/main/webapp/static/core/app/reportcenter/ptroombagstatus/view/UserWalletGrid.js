Ext.define("core.reportcenter.ptroombagstatus.view.UserWalletGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptroombagstatus.userwalletgrid",
    dataUrl: comm.get('baseUrl') + "/PtBag/userbagyue",
    model: "com.zd.school.teacher.teacherinfo.model.TeaTeacherbase",
    menuCode:"PtRoombagStatus",
    al:false,
    height: 200,
    extParams: {
        whereSql: "",
        querySql:""
    },
    noPagging: true,
    remoteSort:false,
    selModel:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '用户钱包',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'32px',
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
            dataIndex: "USER_NUMB",
            width:100,
            // renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
            //     value= record.get("USER_NUMB");
            //     return value
            // }
        }, {
            text: "姓名",
            dataIndex: "XM",            
            width:90,
            // renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
            //     value= record.get("XM");
            //     return value
            // }
        }, {
            text: "卡消费余额(元)",
            dataIndex: "CardValueXF",
            flex:1,
            minWidth:120,
            renderer: function(value, metaData) {
                //var value = record.get("CardValueXF");
            
                var title = "卡消费余额(元)";
                var html = value;
                if(html)
                    html=html.split("；").join("<br/>");

                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';

                return value;

            }
        }]
    },

});
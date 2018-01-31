Ext.define("core.reportcenter.ptroombagstatus.view.PtTermWalletGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptroombagstatus.pttermwalletgrid",
    dataUrl: comm.get('baseUrl') + "/PtBag/termbaglist",
    model: "com.zd.school.control.device.model.PtTermBags",
    extParams: {
        whereSql: "",
        querySql:""
    },
    animCollapse: true,
    // collapsible: true,
    noPagging: true,
    remoteSort:false,
    selModel:false,
    //  title: "设备钱包",
    al:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '设备钱包',
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
    columns: {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "设备序列号",
            dataIndex: "termSn",
            hidden: true
        }, {
            text: "设备类型",
            dataIndex: "termTypeId",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE", //字典代码
            flex:1,
            minWidth:80
        }, {
            text: "设备名称",
            dataIndex: "termName",
            flex:1,
            minWidth:80
           /* renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                value= record.raw.termName;
                return value
            }*/
        }, {
            text: "设备余额",
            dataIndex: "bagValue",
            flex:1,
            minWidth:80,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                var termTypeId= record.get("termTypeId");
                if(termTypeId==8){
                    value =record.get("bagValue");
                    return parseFloat(value).toFixed(2)+" 升"
                }
                if(termTypeId==9){
                   value =record.get("bagValue");
                    return parseFloat(value).toFixed(2)+" 度"
                }
            }
        }, {
            text: "费率",
            dataIndex: "price",
            flex:1,
            minWidth:100,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                var termTypeId= record.get("termTypeId");            
                if(termTypeId==9){
                    value = record.get("dkprice");
                    if(!value)
                        value="0";
                    return value+" 元/度";
                }
                if(termTypeId==8){
                    value = record.get("skprice");
                    if(!value)
                        value="0";
                    return value+" 元/升";
                }
            }
        },{
            text: "总买量",
            dataIndex: "totalBuyedValue",
            flex:1,
            minWidth:80,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                 var termTypeId= record.get("termTypeId");
                if(termTypeId==8){
                    value =record.get("totalBuyedValue");
                    return parseFloat(value).toFixed(2)+" 升"
                }
                if(termTypeId==9){
                    value =record.get("totalBuyedValue");
                    return parseFloat(value).toFixed(2)+" 度"
                }
            }
        }, {
            text: "总用量",
            dataIndex: "totalUsedValue",
            flex:1,
            minWidth:80,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                  var termTypeId= record.get("termTypeId");
                if(termTypeId==8){
                    value =record.get("totalUsedValue");
                    return parseFloat(value).toFixed(2)+" 升"
                }
                if(termTypeId==9){
                    value =record.get("totalUsedValue");
                    return parseFloat(value).toFixed(2)+" 度"
                }
            }
        }, {
            text: "总计清除补助量",
            dataIndex: "totalClearValue",
            flex:1.2,
            minWidth:100,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                 var termTypeId= record.get("termTypeId");
                if(termTypeId==8){
                    value =record.get("totalClearValue");
                    return parseFloat(value).toFixed(2)+" 升"
                }
                if(termTypeId==9){
                    value =record.get("totalClearValue");
                    return parseFloat(value).toFixed(2)+" 度"
                }
            }
        }, {
            text: "补助剩余量",
            dataIndex: "subValue",
            flex:1,
            minWidth:80,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                var termTypeId= record.get("termTypeId");
                if(termTypeId==8){
                    value =record.get("subValue");
                    return parseFloat(value).toFixed(2)+" 升"
                }
                if(termTypeId==9){
                    value =record.get("subValue");
                    return parseFloat(value).toFixed(2)+" 度"
                }
            }
        }, {
            text: "绑定费率规则",
            dataIndex: "bdrole",
            flex:1,
            minWidth:80,
            renderer: function(value) {
                return (value >0) ? '<font color=green>是</font>' : '<font color=red>否</font>';
            }
        }]
    },

});
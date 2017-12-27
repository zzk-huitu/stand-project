Ext.define("core.wisdomclass.redflag.view.FlagTypeGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.wisdomclass.redflag.flagtypegrid",
    dataUrl: comm.get("baseUrl") + "/BaseDicitem/getDicItemByDicCode", //数据获取地址
    model: "com.zd.school.plartform.baseset.model.BaseDicitem", //对应的数据模型
    selModel:null,
    noPagging: true,
    //工具栏操作按钮
    tbar: null,
    //排序字段
    defSort: [{
        property: "itemCode", //排序字段
        direction: "ASC" //升降充
    }],
    //分组字段
    defGroup: [],
    //扩展参数
    extParams: {
        whereSql: "",
        dicCode:"REDFLAG"
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '红旗类型',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }]
    },
    panelButtomBar:{},
    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "类型编码",
        dataIndex: "itemCode",
        hidden: true
    }, {
        text: "红旗类型",
        dataIndex: "itemName"
    }]
});
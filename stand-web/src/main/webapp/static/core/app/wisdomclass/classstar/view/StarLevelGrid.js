Ext.define("core.wisdomclass.classstar.view.StarLevelGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.wisdomclass.classstar.starlevelgrid",
    dataUrl: comm.get("baseUrl") + "/BaseDicitem/getDicItemByDicCode", //数据获取地址
    model: "com.zd.school.plartform.baseset.model.BaseDicitem", //对应的数据模型
    selModel:{ 
        mode:'single',
    },
    noPagging: true,
    //工具栏操作按钮
    tbar: null,
    //排序字段
    defSort: [{
        property: "itemCode", //排序字段
        direction: "ASC" //升降充
    }],
    //扩展参数
    extParams: {
        whereSql: "",
        dicCode:"STARLEVEL"
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '班级星级',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh'
        }]
    },
    panelButtomBar:{},
    columns: {
      defaults:{
            flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "类型编码",
            dataIndex: "itemCode",
            hidden: true
        }, {
            text: "星级",
            dataIndex: "itemName",
            flex:1
        }]
    },

});
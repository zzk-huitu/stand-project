Ext.define("core.public.selectUser.view.SelectUserGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.pubselect.selectusergrid",
    al:true,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/BaseTeacherDrom/getTeacherInUser", //数据获取地址
    model: "com.zd.school.plartform.system.model.SysUser",
    defSort: [{
        property: "deptName", //字段名
        direction: "DESC" //升降序
    },{
        property: "xm", //字段名
        direction: "DESC" //升降序
    }],
    extParams: {
        filter:'[{"type":"string","value":"1","field":"category","comparison":""}]'
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'xm',
            funCode:'girdFastSearchText',
            emptyText: '请输入姓名'
        },{
            xtype:'textfield',
            name:'deptId',
            hidden:true,
            funCode:"girdFastSearchText"
        },{
            width:200,
            emptyText: '请选择部门',
            xtype: "basetreefield",
            ddCode: "DEPTTREE",
            name:"deptName",
            rootId: "ROOT",
            funCode:'girdFastSearchText',
            configInfo: {
                multiSelect: false,
                fieldInfo: "deptName~deptId,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                url:comm.get('baseUrl') + "/SysOrg/chkTreeList"
            }
        }, {
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',
            iconCls: 'x-fa fa-search'
        }]
    },
    /**
     * 高级查询面板
     */
    panelButtomBar: null,
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"            //与下面的2行代码一样的效果
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
              
                var basePanel = grid.up("panel[xtype=pubselect.selectuserlayout]");
                var data = record.data;
                var selectStore = grid.getStore();
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=pubselect.isselectusergrid]");
                    if(isSelectGrid.isVisible()==true){
                        var isSelectStore = isSelectGrid.getStore();
                        for (var i = 0; i < isSelectStore.getCount(); i++) {
                            if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                                Ext.Msg.alert("提示", data.xm+"已存在!");
                                return ;
                            }
                        };
                      
                        selectStore.removeAt(index);
                        isSelectStore.insert(0, [record]);
                    }
                }
                
                return false;
            }
        }
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
            width:150,
            text: "姓名",
            dataIndex: "xm"
        }, {
            width:50,
            text: "性别",
            dataIndex: "xbm",
            columnType: "basecombobox",
            ddCode: "XBM"
        }, {
            flex:1,
            text: "部门",
            dataIndex: "deptName"
        }, {
            width:120,
            text: "岗位",
            dataIndex: "jobName"
        }]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
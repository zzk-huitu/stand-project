Ext.define("core.system.role.view.SelectUserGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.role.selectusergrid",
    al:false,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/SysUser/getUserNotInRoleId", //数据获取地址
    model: "com.zd.school.plartform.system.model.SysUser",
    pageDisplayInfo:false,
    selModel: {
        type: "checkboxmodel",   
        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        //mode:'single',  //multi,simple,single；默认为多选multi
        checkOnly:true,    //如果值为true，则只用点击checkbox列才能选中此条记录
        //allowDeselect:true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    },
    /**
     * 工具栏操作按E钮
     * 继承自core.base.view.BaseGrid可以在此覆盖重写
     */
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
                //controller: 'role.OtherController',
                multiSelect: false,
                fieldInfo: "deptName~deptId,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                url:comm.get('baseUrl') + "/SysOrg/chkTreeList"
            }
        },{
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
                var selectStore = grid.getStore();
                var basePanel = grid.up("panel[xtype=system.role.selectuserlayout]");
                var data = record.data;
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=system.role.isselectusergrid]");
                    if(isSelectGrid.isVisible()==true){
                        var isSelectStore = isSelectGrid.getStore();
                        for (var i = 0; i < isSelectStore.getCount(); i++) {
                            if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                                Ext.Msg.alert("提示", data.userName+"已存在!");
                                return ;
                            }
                        };

                        isSelectStore.insert(0, [record]);
                        selectStore.removeAt(index);
                    }
                }
                return false;
            }
        }
    },

    /** 排序字段定义 */
    defSort: [{
        property: "createTime", //字段名
        direction: "DESC" //升降序
    }],
    /** 扩展参数 */
    extParams: {
        whereSql: "",
        //查询的过滤字段
        //type:字段类型 comparison:过滤的比较符 value:过滤字段值 field:过滤字段名
        //filter: "[{'type':'string','comparison':'=','value':'','field':'claiId'}]"
    },
    columns: {
        defaults: {
            titleAlign: "center"
        },
        items: [{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            width:120,
            text: "用户名",
            dataIndex: "userName"
        },{
            width:80,
            text: "姓名",
            dataIndex: "xm"
        }, {
            width:60,
            text: "性别",
            dataIndex: "xbm",
            columnType: "basecombobox",
            ddCode: "XBM"
        }, {
            minWidth:120,
            flex:1,
            text: "部门",
            dataIndex: "deptName"
        }, {
            width:100,
            text: "岗位",
            dataIndex: "jobName"
        }/*, {
            text: "编制",
            dataIndex: "zxxbzlb",
            ddCode: "ZXXBZLB",
            columnType: "basecombobox",
            minWidth:100,
            flex:1,
            align:'left'
        }*/]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
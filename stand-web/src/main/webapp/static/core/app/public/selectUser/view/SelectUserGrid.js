Ext.define("core.public.selectUser.view.SelectUserGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.pubselect.selectusergrid",
    al:true,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/SysUser/list", //数据获取地址
    model: "com.zd.school.plartform.system.model.SysUser",
    defSort: [{
        property: "deptName", //字段名
        direction: "DESC" //升降序
    },{
        property: "xm", //字段名
        direction: "DESC" //升降序
    }],
    selModel: {
        type: "checkboxmodel",   
        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        //mode:'single',  //multi,simple,single；默认为多选multi
        checkOnly:true,    //如果值为true，则只用点击checkbox列才能选中此条记录
        //allowDeselect:true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    },
    extParams: {
        //这里默认只加载老师，若要改变此值，需要在使用使重写属性，参见：useraccess的MainController的openRoomAccess_Win方法
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
                //url:comm.get('baseUrl') + "/SysOrg/chkTreeList"
                url:comm.get('baseUrl') + "/SysOrg/getUserRightDeptTree"
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
            flex:1,
            minWidth:90,
            text: "用户名",
            dataIndex: "userName"
        }, {
            flex:1,
            minWidth:90,
            text: "姓名",
            dataIndex: "xm"
        },{
            flex:1,
            minWidth:90,
            text: "工号/学号",
            dataIndex: "userNumb"
        },  {
            width:50,
            text: "性别",
            dataIndex: "xbm",
            columnType: "basecombobox",
            ddCode: "XBM"
        }, {
            width:80,
            text: "身份",
            dataIndex: "category",
            columnType: "basecombobox",
            ddCode: "CATEGORY"
        },{
            flex:1,
            minWidth:90,
            text: "部门",
            dataIndex: "deptName"
        }, {
            flex:1,
            minWidth:90,
            text: "岗位",
            dataIndex: "jobName"
        }]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
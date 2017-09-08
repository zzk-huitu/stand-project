/*
* 班级学员表
*/
Ext.define("core.system.roleright.view.SelectedPermissionGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.roleright.selectedpermissiongrid",
    al:false,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/SysMenuPermission/getRoleMenuPerList", //数据获取地址
    model: "com.zd.school.plartform.system.model.SysMenuPermission", //对应的数据模型

    title: "<font color='#ffeb00'>已选菜单权限（双击或往左拖动移除）</font>",
    /**
     * 工具栏操作按钮
     * 继承自core.base.view.BaseGrid可以在此覆盖重写
     */
    panelTopBar: null,
    /**
     * 高级查询面板
     */
    panelButtomBar: null,

    noPagging: true,
     
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
        //filter: "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"null\",\"field\":\"classId\"}]" //默认是查不出数据的
    },
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
            //dragGroup: 'secondGridDDGroup',
            //dropGroup: 'firstGridDDGroup'
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                //Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
            },
            beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
                selectStore = grid.getStore();
                selectStore.removeAt(index);

                var basePanel = grid.up("basepanel");
                var isSelectGrid = basePanel.down("panel[xtype=system.roleright.permissiongrid]");
                var isSelectStore = isSelectGrid.getStore();
                isSelectStore.insert(0, [record]);
                return false;
            }
        }
    },
    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[ {
            width: 100,
            text: "权限名称",
            dataIndex: "perName",
            align:'left'
        }, {
            flex: 1,
            text: "权限接口全称",
            dataIndex: "perAuth",
            align:'left',
            renderer: function(value,metaData,record) {  
                if(value)
                    return record.get("perAuthCode")+"_"+value;
 
                return value;  
            }  
        }]   
    } 
});
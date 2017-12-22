/*
* 菜单权限表
*/
Ext.define("core.system.roleright.view.PermissionGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.roleright.permissiongrid",
    al:false,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/SysMenuPermission/list", //数据获取地址
    model: "com.zd.school.plartform.system.model.SysMenuPermission", //对应的数据模型
    selModel: {
        type: "checkboxmodel",   
        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        //mode:'single',  //multi,simple,single；默认为多选multi
        checkOnly:true,    //如果值为true，则只用点击checkbox列才能选中此条记录
        //allowDeselect:true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    },
    /**
     * 工具栏操作按钮
     * 继承自core.base.view.BaseGrid可以在此覆盖重写
     */
    panelTopBar: {
        xtype: 'toolbar',
        height:45,
        items: [{
            xtype: 'tbtext',
            html: '菜单权限（双击或往右拖动加入）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->']
    },
    /**
     * 高级查询面板
     */
    panelButtomBar: null,

    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup",               
          },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                //Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
            },
            beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
                var basePanel = grid.up("panel[xtype=system.roleright.selectpmslayout]");
                var data = record.data;
                var selectStore = grid.getStore();
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=system.roleright.selectedpermissiongrid]");
                    if(isSelectGrid.isVisible()==true){
                        var isSelectStore = isSelectGrid.getStore();
                        for (var i = 0; i < isSelectStore.getCount(); i++) {
                            if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                                Ext.Msg.alert("提示", data.perName+"已存在!");
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

    /** 排序字段定义 */
    defSort: [{
        property: "updateTime", //字段名
        direction: "DESC" //升降序
    }],
    /** 扩展参数 */
    extParams: {
        whereSql: "",
        //查询的过滤字段
        //type:字段类型 comparison:过滤的比较符 value:过滤字段值 field:过滤字段名
        //filter: "[{\"type\":\"string\",\"comparison\":\"=\",\"value\":\"null\",\"field\":\"classId\"}]" //默认是查不出数据的
    },
    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            xtype: "rownumberer",
            flex: 0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            width: 100,
            text: "权限名称",
            dataIndex: "perName",
            align:'left'
        },  {
            width: 200,
            text: "权限接口全称",
            dataIndex: "perAuth",
            align:'left',
            renderer: function(value,metaData,record) {  
                if(value)
                    return record.get("perAuthCode")+"_"+value;
 
                return value;  
            }  
        },{
            width: 120,
            text: "按钮别名",
            dataIndex: "perBtnName",
             align:'left'
        },{
            flex:1,
            minWidth: 100,
            text: "备注",
            dataIndex: "perRemark",
            align:'left',
            renderer: function(value,metaData) {  

                var title=" 备注 ";

                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
                return value;  
            }  
        }]   
    } 
});
Ext.define("core.coursemanage.specialcourseattend.selectterm.view.SelectTermGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.roomterminal.selecttermgrid",
    al:true,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/BaseInfoterm/list", //数据获取地址
    model: "com.zd.school.oa.terminal.model.OaInfoterm", //对应的数据模型
    defSort: [{
        property: "termCode", //字段名
        direction: "ASC" //升降序
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
       filter: "[{'type':'string','comparison':'=','value':'0','field':'roomId'}]"    
    },
     panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间设备（双击添加）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }],
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
              
                var basePanel = grid.up("panel[xtype=coursemanage.specialcourseattend.selectterm.mainlayout]");
                var data = record.data;
                var selectStore = grid.getStore();
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=roomterminal.isselecttermgrid]");
                    if(isSelectGrid.isVisible()==true){
                        var isSelectStore = isSelectGrid.getStore();
                        for (var i = 0; i < isSelectStore.getCount(); i++) {
                            if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                                Ext.Msg.alert("提示", data.termCode+"已存在!");
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
        text: "终端号",
        dataIndex: "termCode",
         flex:1,
        minWidth:120,
        renderer: function(value, metaData) {
            var title = "终端号";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    } ,{
        text: "门牌号",
        dataIndex: "houseNumb",
        width:150,
        renderer: function(value, metaData) {
            var title = "门牌号";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
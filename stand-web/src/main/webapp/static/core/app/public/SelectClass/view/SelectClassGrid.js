Ext.define("core.public.SelectClass.view.SelectClassGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.public.SelectClass.selectclassgrid",
    al:true,
    frame: false,
    columnLines: false,
    pageDisplayInfo:false,
    dataUrl: comm.get('baseUrl') + "/GradeClass/listUser",
    model: "com.zd.school.jw.eduresources.model.JwTGradeclass",
    selModel: {
        type: "checkboxmodel",   
        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        //mode:'single',  //multi,simple,single；默认为多选multi
        checkOnly:true,    //如果值为true，则只用点击checkbox列才能选中此条记录
        //allowDeselect:true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    },
       panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '待选班级（双击或拖动选择）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px',
            }
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
                var basePanel = grid.up("panel[xtype=public.SelectClass.selectclasslayout]");
                var isSelectGrid;
                var data = record.data;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=public.SelectClass.isselectclassgrid]");
                    
                    if(isSelectGrid.isVisible()==true){
                        var isSelectStore = isSelectGrid.getStore();
                        for (var i = 0; i < isSelectStore.getCount(); i++) {
                            if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                                Ext.Msg.alert("提示", data.className+"已存在!");
                                return ;
                            }
                        };

                        isSelectStore.insert(0, [record]);

                        var selectStore = grid.getStore();
                        selectStore.removeAt(index);
                    }
                }
                
                return false;
            }
        }
    },

    /** 排序字段定义 */
    defSort: [],
    /** 扩展参数 */
    extParams: {
      whereSql: "",
      filter:""
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
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "班级名称",
            dataIndex: "className",            
            minWidth: 100,
            flex:1
        }]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
Ext.define("core.public.selectJob.view.SelectJobGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.pubselect.selectjobgrid",
    al:true,
    dataUrl: comm.get('baseUrl') + "/SysJob/list",
    model: 'com.zd.school.plartform.baseset.model.BaseJob',
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
            html: '岗位信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'tbtext',
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'jobName',
            funCode:'girdFastSearchText',
            emptyText: '请输入岗位名称'
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
               
                var basePanel = grid.up("panel[xtype=pubselect.selectjoblayout]");
                var data = record.data;
                var selectStore = grid.getStore();
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=pubselect.isselectjobgrid]");

                    if(isSelectGrid.isVisible()==true){
                        var isSelectStore = isSelectGrid.getStore();
                           for (var i = 0; i < isSelectStore.getCount(); i++) {
                            if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                                Ext.Msg.alert("提示", data.jobName+"已存在!");
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
        property: 'createTime',
        direction: 'DESC'
    }],
    /** 扩展参数 */
    extParams: {
        whereSql: ""
        //查询的过滤字段
        //type:字段类型 comparison:过滤的比较符 value:过滤字段值 field:过滤字段名
        //filter: "[{'type':'string','comparison':'=','value':'','field':'claiId'}]"
    },
    columns: {
        defaults: {
            titleAlign: "center",
            align:'center'
        },
        items: [{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "名称",
            dataIndex: "jobName",
            flex: 2,
        }, {
            text: "编码",
            dataIndex: "jobCode",
            flex: 1,
        }, {
            text: "级别",
            dataIndex: "orderIndex",
            flex: 1,
        }]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
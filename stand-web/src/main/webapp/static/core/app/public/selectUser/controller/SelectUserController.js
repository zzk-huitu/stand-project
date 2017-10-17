Ext.define("core.public.selectUser.controller.SelectUserController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.pubselect.selectusercontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'

    },
    init: function () {
        this.control({
         "mtfuncwindow[funcPanel=pubselect.selectuserlayout] button[ref=ssOkBtn]": {
                beforeclick: function(btn) {
                    //查询的OK事件
                    //隐藏按钮
                    console.log(666);
                    var win = btn.up("window[xtype=mtfuncwindow]");

                    var dataField = win.dataField;
                    var gridField = win.gridField;
                    var formPanel = Ext.ComponentQuery.query('form[xtype=' + win.formPanel + ']')[0];
                    if (!formPanel)
                        formPanel = Ext.ComponentQuery.query('form[xtype=' + win.formPanel + ']')[1];
                    var bf = formPanel.getForm();

                    var basePanel = win.down("panel[xtype=pubselect.selectuserlayout]");
                    var baseGrid = basePanel.down("basegrid[xtype=pubselect.isselectusergrid]");

                    var records = baseGrid.getStore().data.items;


                    //点击确定之后会得到选中的数据做处理

                    //因为是多选，将值用逗号隔开放入字段中

                    Ext.each(dataField, function(f, index) {
                        var valueArray = new Array();
                        Ext.each(records, function(r) {
                            valueArray.push(r.get(gridField[index]));
                        });

                        var bff = bf.findField(f);
                        if (bff) {
                            bff.setValue(valueArray.join(","));
                        }

                    });

                    win.close();
                    return false;
                }
            },    
        })
    },
});
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

            //快速搜索按按钮
            "basepanel basegrid button[ref=gridFastSearchBtn]": {
                beforeclick: function (btn) {
                    this.queryFastSearchForm(btn);
                    return false;
                }
            },
            //快速搜索文本框回车事件
            "basepanel basegrid field[funCode=girdFastSearchText]": {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.queryFastSearchForm(field);   
                        return false;             
                    }
                }
            },

        })
    },

    queryFastSearchForm:function(component){
        //得到组件                 
        var baseGrid = component.up("basegrid");
        if (!baseGrid)
            return false;

        var toolBar = component.up("toolbar");
        if (!toolBar)
            return false;

        var filter = [];
        var gridFilter=[];
        //获取baseGrid中编写的默认filter值
        var gridFilterStr=baseGrid.extParams.filter;
        if(gridFilterStr&&gridFilterStr.trim()!=""){
            gridFilter=JSON.parse(gridFilterStr);
            filter=gridFilter;
        }
       
        //只取两个值
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        if(girdSearchTexts[0].getValue()!=null){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field":  girdSearchTexts[0].getName(), "comparison": ""});
        }
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = JSON.stringify(filter);
        proxy.extraParams.deptId = girdSearchTexts[1].getValue();

        store.loadPage(1);
    },
});
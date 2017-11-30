Ext.define("core.basedevice.irdevice.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.basedevice.irdevice.detailhtml",
    layout: "form", 
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
        '<div class="trainClass_title">红外设备详情：</div>',
        '<ul>' ,
        '<li style="width:50%" title="{brandname}">所属品牌：{brandname}</li>',
        '<li style="width:50%" title="{productModel}">产品型号：{productModel}</li>',
        '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
        '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
        '<li style="width:50%" title="{notes}">备注：{notes}</li>',
        '<div style="clear:both"></div>',
        '</ul>',
        '</div>'
        ),
    data: {}
});
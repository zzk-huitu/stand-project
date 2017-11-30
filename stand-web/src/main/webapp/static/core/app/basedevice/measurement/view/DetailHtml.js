Ext.define("core.basedevice.measurement.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.basedevice.measurement.detailhtml",
    layout: "form", 
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
        '<div class="trainClass_title">学校详情：</div>',
        '<ul>' ,
        '<li style="width:50%" title="{measure}">计量数：{measure}</li>',
        '<li style="width:50%" title="{notes}">备注：{notes}</li>',
        '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
        '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
        '<div style="clear:both"></div>',
        '</ul>',
        '</div>'
        ),
    data: {}
});
Ext.define("core.wisdomclass.redflag.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.wisdomclass.redflag.detailhtml",

    layout: "form", //从上往下布局
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">流动红旗：</div>',
            '<ul>' ,
                '<li style="width:50%" title="{className}">班级名称：{className}</li>',
                '<li style="width:50%" title="{redflagType}">红旗类型：{redflagType}</li>',
                '<li style="width:50%" title="{beginDate}">开始日期：{beginDate}</li>',
                '<li style="width:50%" title="{endDate}">结束日期：{endDate}</li>',
                '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
                '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
                '<div style="clear:both"></div>',
            '</ul>',
        '</div>'
    ),
    data: {}
});
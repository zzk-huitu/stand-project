Ext.define("core.baseset.campus.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.baseset.campus.detailhtml",

    layout: "form", //从上往下布局
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">校区详情：</div>',
            '<ul>' ,
                '<li style="width:50%" title="{schoolName}">所属学校：{schoolName}</li>',
                '<li style="width:50%" title="{orderIndex}">排序字段：{orderIndex}</li>',
                '<li style="width:50%" title="{campusName}">校区名称：{campusName}</li>',
                '<li style="width:50%" title="{campusCode}">校区编码：{campusCode}</li>',
                '<li style="width:50%" title="{campusAddr}">校区地址：{campusAddr}</li>',
                '<li style="width:50%" title="{zipCode}">邮政编码：{zipCode}</li>',
                '<li style="width:50%" title="{campusPhone}">校区联系电话：{campusPhone}</li>',
                '<li style="width:50%" title="{campusFax}">校区传真电话：{campusFax}</li>',
                '<li style="width:50%" title="{campusHead}">校区负责人号：{campusHead}</li>',
                '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
                '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
                '<div style="clear:both"></div>',
            '</ul>',
        '</div>'
    ),
    data: {}
});
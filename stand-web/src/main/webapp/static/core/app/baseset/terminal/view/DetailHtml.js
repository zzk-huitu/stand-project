Ext.define("core.baseset.terminal.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.baseset.terminal.detailhtml",

    //bodyPadding: '0 10 10 0',
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',

    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
        '<div class="trainClass_title">终端基本信息：</div>',
        '<ul>' ,
        '<li style="width:50%" title="{termCode}">终端号：{termCode}</li>',
        '<li style="width:50%" title="{termType}">终端类型：{termType}</li>',
        '<li style="width:50%">使用状态：<tpl if="isUse == 1">已使用<tpl else>未使用</tpl></li>',
        '<li style="width:50%" title="{roomName}">房间名称：{roomName}</li>',
        '<li style="width:50%" title="{termSpec}">规格：{termSpec}</li>',
        '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
        '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
        '<div style="clear:both"></div>',
        '</ul>',
        '</div>'
    ),
    data: {}
});
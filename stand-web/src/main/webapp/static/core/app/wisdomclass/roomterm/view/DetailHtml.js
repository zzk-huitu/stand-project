Ext.define("core.wisdomclass.roomterm.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.wisdomclass.roomterm.detailhtml",

    layout: "form", //从上往下布局
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
        '<div class="trainClass_title">终端分配：</div>',
        '<ul>' ,
        '<li style="width:50%" title="{termCode}">终端号：{termCode}</li>',
        '<li style="width:50%" >终端类型：',
        '<tpl if="termType==1">平板<tpl else></tpl></li>',
        '<li style="width:50%" title="{termSpec}">规格：{termSpec}</li>',
        '<li style="width:50%" title="{roomName}">分配房间：{roomName}</li>',
        '<li style="width:50%" title="{createTime}">分配时间：{createTime}</li>',
        '<li style="width:50%" title="{createUser}">分配人：{createUser}</li>',
        '<div style="clear:both"></div>',
        '</ul>',
        '</div>'
        ),
    data: {}


});
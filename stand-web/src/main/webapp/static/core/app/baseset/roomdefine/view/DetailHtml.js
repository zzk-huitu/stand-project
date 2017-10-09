Ext.define("core.baseset.roomdefine.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.baseset.roomdefine.detailhtml",

    //bodyPadding: '0 10 10 0',
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'dormBaseInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">宿舍基本信息：</div>',
            '<ul>' ,
            '<li>房间名称：{roomName}</li>',
            '<li>房间类型：宿舍</li>',
            '<li>房间标志：{roomName}</li>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }, {
        xtype: 'container',
        ref: "dormDetailInfo",
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classTraineeInfo">',
            '<div class="trainClass_title">宿舍详情表：</div>',
            '<ul class="trainClass_gridUl" style="max-height: 400px;">',
            '<li>',
            '<span style="width:10%" data-align="center">电话</span><span style="width:10%" data-align="center">传真</span>' ,
            '<span style="width:10%" data-align="center">宿舍类型</span><span style="width:10%" data-align="center">混合宿舍</span>' ,
            '<span style="width:10%" data-align="center">是否分配</span>',
            '{% if (values.obj.length == 0) %}',
            '<li style="width:100%;font-size: 14px;font-weight: 400;text-align: center;line-height: 100px;">此角色暂无用户...</li>',
            '{% if (values.obj.length == 0 ) return  %}',   //reutrun 表示不执行下面的了，在for里面可以使用break、continue
            '<tpl for="obj">',
            '<li><span style="width: 10%;" >{dormPhone}</span><span style="width: 10%;">{dormFax}</span>' ,
            '<span style="width: 10%;"><tpl if="dormType == 1">男<tpl elseif="dormType==2">女<tpl else>不限</tpl></span>',
            '<tpl if="isMixed==0">',
            '<span style="width: 10%;color:red;" >否</span>' ,
            '<tpl else>',
            '<span style="width: 10%;color: green;" >是</span>' ,
            '</tpl>' ,
            '<tpl if="roomStatus==0">',
            '<span style="width: 10%;color:red;" >未分配</span>' ,
            '<tpl else>',
            '<span style="width: 10%;color: green;" >已分配</span>' ,
            '</tpl>' ,
            '</li>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
});

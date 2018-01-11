Ext.define("core.smartcontrol.watermeter.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.smartcontrol.watermeter.detailhtml",

    //bodyPadding: '0 10 10 0',
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'meterInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">基本信息：</div>',
            '<ul>' ,
            '<li style="width:50%" title="{roomRuleName}">计量数（脉冲数/升）：{measure}</li>',
            '<li style="width:50%" title="{shutDownStart}">备注：{notes}</li>',        
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }, {
        xtype: 'container',
        ref: "meterBindRooms",
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classTraineeInfo">',
            '<div class="trainClass_title">绑定费率的设备列表：</div>',
            '<ul class="trainClass_gridUl" style="max-height: 400px;">',
            '<li><span style="width:10%">序号</span>',
            '<span style="width:90%" data-align="center">设备序列号</span>' ,
            '</li>',
            '{% if (values.rows.length == 0) %}',
            '<li style="width:100%;font-size: 14px;font-weight: 400;text-align: center;line-height: 100px;">此费率暂未绑定设备...</li>',
            '{% if (values.rows.length == 0 ) return  %}',   //reutrun 表示不执行下面的了，在for里面可以使用break、continue
            '<tpl for="rows">',
            '<li><span style="width:10%">{[xindex]}</span>',
            '<span style="width: 90%;" >{termSn}</span>',            
            '</li>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
});

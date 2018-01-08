Ext.define("core.smartcontrol.roombagrule.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.smartcontrol.roombagrule.detailhtml",

    //bodyPadding: '0 10 10 0',
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'ruleInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">规则基本信息：</div>',
            '<ul>' ,
            '<li style="width:50%" title="{roomRuleName}">房间规则名称：{roomRuleName}</li>',
            '<li style="width:50%" title="{shutDownStart}">允许关电开始时间：{shutDownStart}</li>',
            '<li style="width:50%" title="{shutDownEnd}">允许关电结束时间：{shutDownEnd}</li>',
            '<li style="width:50%" title="{noMoneyMode}">无余额控制方式：{noMoneyMode}</li>',
            '<li style="width:50%" title="{warnvalue}">报警金额：{warnvalue}</li>',
            '<li style="width:50%" title="{deDuctionMode}">扣费模式：{deDuctionMode}</li>',
            '<li style="width:50%" title="{deDuctionValue}">扣费金额：{deDuctionValue}</li>',
            '<li style="width:50%">状态：',
                '<tpl if="isEnable==1">',
                '<span style="color:green;" >启用</span>' ,
                '<tpl else>',
                '<span style="color: red;" >禁用</span>' ,
                '</tpl>' ,
            '</li>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }, {
        xtype: 'container',
        ref: "ruleBindRooms",
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classTraineeInfo">',
            '<div class="trainClass_title">绑定规则的房间列表：</div>',
            '<ul class="trainClass_gridUl" style="max-height: 400px;">',
            '<li><span style="width:10%">序号</span>',
            '<span style="width:30%" data-align="center">房间名称</span>' ,
            '<span style="width:30%" data-align="center">指定扣费人员（学号）</span><span style="width:30%" data-align="center">指定扣费人员（姓名）</span>' ,            
            '</li>',
            '{% if (values.rows.length == 0) %}',
            '<li style="width:100%;font-size: 14px;font-weight: 400;text-align: center;line-height: 100px;">此规则暂未绑定房间...</li>',
            '{% if (values.rows.length == 0 ) return  %}',   //reutrun 表示不执行下面的了，在for里面可以使用break、continue
            '<tpl for="rows">',
            '<li><span style="width:10%">{[xindex]}</span>',
            '<span style="width: 30%;" >{roomName}</span>',
            '<span style="width: 30%;">{userNumb}</span>' ,
            '<span style="width: 30%;">{xm}</span>',           
            '</li>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
});

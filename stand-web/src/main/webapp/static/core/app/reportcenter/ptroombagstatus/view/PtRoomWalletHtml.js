Ext.define("core.reportcenter.ptroombagstatus.view.PtRoomWalletHtml", {
    extend: "Ext.Container",
    alias: "widget.reportcenter.ptroombagstatus.ptroomwallethtml",

    //bodyPadding: '0 10 10 0',
    margin: '0',
    //scrollable: false,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'ptRoomWalletInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo" style="padding: 5px 10px;">',
            '<div class="trainClass_title" style="font-size: 16px;color: rgb(196, 68, 68);font-weight: 800;border-bottom: 1px solid #e5e5e5;">房间钱包</div>',
            '<ul style="padding:0px;border:none;background:none;">' ,
            '<li style="width:100%;font-size: 14px;" title="{roomRuleName}"><span style="width: 100px;display: inline-block;text-align: right;">房间名称：</span>&nbsp;&nbsp;<span style="color:red">{roomName}</span></li>',
            '<li style="width:33%;font-size: 14px;" title="{shutDownStart}"><span style="width: 100px;display: inline-block;text-align: right;">房间余额：</span>&nbsp;&nbsp;<span style="color:red">{roomValue}</span></li>',
            '<li style="width:33%;font-size: 14px;" title="{shutDownEnd}"><span style="width: 150px;display: inline-block;text-align: right;">房间总使用金额：</span>&nbsp;&nbsp;<span style="color:red">{roomTotalUsed}</span></li>',
            '<li style="width:33%;font-size: 14px;" title="{noMoneyMode}"><span style="width: 150px;display: inline-block;text-align: right;">房间总充值金额：</span>&nbsp;&nbsp;<span style="color:red">{roomTotalRecharge}</span></li>',
            '<li style="width:33%;font-size: 14px;" title="{warnvalue}"><span style="width: 100px;display: inline-block;text-align: right;">总用水金额：</span>&nbsp;&nbsp;<span style="color:red">{waterTotalused}</span></li>',
            '<li style="width:50%;font-size: 14px;" title="{deDuctionMode}"><span style="width: 150px;display: inline-block;text-align: right;">最后用水时间：</span>&nbsp;&nbsp;<span style="color:black">{waterUpdateTime}</span></li>',
            '<li style="width:33%;font-size: 14px;" title="{deDuctionValue}"><span style="width: 100px;display: inline-block;text-align: right;">总用电金额：</span>&nbsp;&nbsp;<span style="color:red">{ecTotalUsed}</span></li>',
            '<li style="width:50%;font-size: 14px;" title="{deDuctionValue}"><span style="width: 150px;display: inline-block;text-align: right;">最后用电时间：</span>&nbsp;&nbsp;<span style="color:black">{ecUpdateTime}</span></li>',            
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
});

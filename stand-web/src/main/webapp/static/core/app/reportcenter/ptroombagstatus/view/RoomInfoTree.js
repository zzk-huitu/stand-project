Ext.define("core.reportcenter.ptroombagstatus.view.RoomInfoTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.reportcenter.ptroombagstatus.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BaseRoomarea/list",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    expandFirst:true,
    sortableColumns:false,
    selModel: {
   },
   tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '区域信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:600
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh',
            titleAlign:'right',
        }]
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: "",
        excludes:"checked"
    },
    columns:{
        defaults:{
            titleAlign:"center"
        },
        items:[{
            text: "区域名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1
        },/* {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:60
        },*/{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
    },
   listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("basepanel[xtype=reportcenter.ptroombagstatus.mainlayout]");

            var roomWalletForm = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptroomwalletform]");
            var formObj=roomWalletForm.getForm();

            var roomName=record.raw.text;
            var roomNameobj=Ext.getCmp("roomName1");
            var roomValueobj=Ext.getCmp("roomValue1");
            var roomTotalUsedobj=Ext.getCmp("roomTotalUsed1");
            var roomTotalRechargeobj=Ext.getCmp("roomTotalRecharge1");
            var waterTotalusedobj=Ext.getCmp("waterTotalused1");
            var waterUpdateTimeobj=Ext.getCmp("waterUpdateTime1");
            var ecTotalUsedobj=Ext.getCmp("ecTotalUsed1");
            var ecUpdateTimeobj=Ext.getCmp("ecUpdateTime1");
            
            //房间钱包
            var storeyGrid1 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptroomwalletgrid]");
            var store1 = storeyGrid1.getStore();
            var proxy1 = store1.getProxy();
            proxy1.extraParams = {
                    filter: "[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'roomId'}]"
            };
            var reader =proxy1.reader;
            store1.load({
                scope: this,
                callback: function(records, operation, success) {
                    if(success==false){
                        self.Error(reader.jsonData.obj);
                    }
                    if(success==true){
                        var records=store1.getAt(0);
                        roomNameobj.setValue(roomName);
                        roomValueobj.setValue(parseFloat(records.data.roomValue).toFixed(4)+" 元");
                        roomTotalUsedobj.setValue(parseFloat(records.data.roomTotalUsed).toFixed(4)+" 元");
                        roomTotalRechargeobj.setValue(parseFloat(records.data.roomTotalRecharge).toFixed(4)+" 元");
                        waterTotalusedobj.setValue(parseFloat(records.data.waterTotalused).toFixed(4)+" 元");
                        waterUpdateTimeobj.setValue(records.data.waterUpdateTime);
                        ecTotalUsedobj.setValue(parseFloat(records.data.ecTotalUsed).toFixed(4)+" 元");
                        ecUpdateTimeobj.setValue(records.data.ecUpdateTime);
                    }
                }
            });             
            //设备钱包
            var storeyGrid = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.pttermwalletgrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                    roomId:record.get('id')
            };
            store.load(); 
            //用户钱包
            var storeyGrid2 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.userwalletgrid]");
            var store2 = storeyGrid2.getStore();
            var proxy2 = store2.getProxy();
            proxy2.extraParams = {
                    roomId:record.get('id')
            };
            store2.load(); 
            //红外设备
            var storeyGrid3 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptirroomdevicegrid]");
            var store3 = storeyGrid3.getStore();
            var proxy3 = store3.getProxy();
            proxy3.extraParams = {
                    filter:"[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'roomId'}]"
                };
            store3.load(); 
            return false;
        }
    }
})
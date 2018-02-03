

Ext.define("core.smartcontrol.roombagrule.view.BindDetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.smartcontrol.roombagrule.binddetaillayout',
    funCode: "roombagrule_binddetail",
    funData: {
        action: comm.get('baseUrl') + "/BasePtRoomBagRule", //请求Action  
        pkName: "uuid",
        defaultObj: {
        }
    },
    
    /*关联此视图控制器*/
    controller: 'smartcontrol.roombagrule.detailcontroller',

     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [{
        xtype: "smartcontrol.roombagrule.roomdefinetree",
        width: 250,
        //split:true,
        style:{
            borderRight:'6px solid #ececec'
        },
    }, {
        xtype: "smartcontrol.roombagrule.roomgrid",
        flex:1,
        minWidth:350,
        //split:true,
        style:{
            borderRight:'6px solid #ececec'
        },
    }, {
        width: 320,
        ref:"noDeductibleMode",        
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [{
            xtype: "smartcontrol.roombagrule.dormallotfinishgrid",            
            flex:1,
            style:{
                borderBottom:'6px solid #ececec'
            },     
        }, {
            xtype: "smartcontrol.roombagrule.dormallotfinishgridtwo",          
            height:200,
        }]
    }]

})
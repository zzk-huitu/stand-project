Ext.define("core.basedevice.baserate.store.CategroyStore",{
    extend:"Ext.data.Store",
    alias: 'store.basedevice.baserate.categroystore',
    fields: ['categroy'],
    data: [
    	{categroy: '电控'},
        {categroy: '水控'},
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
   
});
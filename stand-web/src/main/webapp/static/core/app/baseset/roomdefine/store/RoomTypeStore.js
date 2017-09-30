

Ext.define("core.baseset.roomdefine.store.RoomTypeStore",{
    extend:"Ext.data.Store",
    alias: 'store.baseset.roomdefine.roomtypestore',
    fields: ['code', 'roomDefineType'],
    data: [
    	{code: '1', roomDefineType: '宿舍'},
        {code: '2', roomDefineType: '办公室'},
        {code: '3', roomDefineType: '教室'},
        {code: '5', roomDefineType: '功能室'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
   
});
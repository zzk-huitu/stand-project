Ext.define("core.baseset.roomallot.store.IsSelectRoomStore",{
    extend:"Ext.data.Store",

    alias: 'store.baseset.roomallot.isselectroomstore',

 
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysUser", "checked").modelName,
});
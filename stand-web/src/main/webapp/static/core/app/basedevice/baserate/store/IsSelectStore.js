Ext.define("core.basedevice.baserate.store.IsSelectStore",{
    extend:"Ext.data.Store",

    alias: 'store.basedevice.baserate.isselectstore',

 
    model: factory.ModelFactory.getModelByName("com.zd.school.control.device.model.PtTerm", "checked").modelName,
});
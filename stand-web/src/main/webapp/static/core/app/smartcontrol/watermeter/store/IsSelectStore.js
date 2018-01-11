
Ext.define("core.smartcontrol.watermeter.store.IsSelectStore",{
    extend:"Ext.data.Store",
    alias: 'store.smartcontrol.watermeter.isselectstore',
    model: factory.ModelFactory.getModelByName("com.zd.school.control.device.model.PtTerm", "checked").modelName,
  
});
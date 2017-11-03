
Ext.define("core.basedevice.basedeviceallot.store.IsSelectStore",{
    extend:"Ext.data.Store",
    alias: 'store.basedevice.basedeviceallot.isselectstore',
    model: factory.ModelFactory.getModelByName("com.zd.school.control.device.model.PtTerm", "checked").modelName,
  
});
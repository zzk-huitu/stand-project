
Ext.define("core.public.SelectClass.store.IsSelectedClassStore",{
    extend:"Ext.data.Store",

    alias: 'store.public.SelectClass.isselectedclassstore',
    model: factory.ModelFactory.getModelByName("com.zd.school.jw.ecc.model.EccClassstar", "checked").modelName,
});
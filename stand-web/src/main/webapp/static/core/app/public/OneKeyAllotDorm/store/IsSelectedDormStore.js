
Ext.define("core.public.OneKeyAllotDorm.store.IsSelectedDormStore",{
    extend:"Ext.data.Store",

    alias: 'store.public.selectUser.isselecteddormstore',

    model: factory.ModelFactory.getModelByName("com.zd.school.build.define.model.BuildDormDefine", "checked").modelName,
   
});
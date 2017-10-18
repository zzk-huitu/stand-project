Ext.define("core.baseset.roomallot.store.IsSelectTeacherStore",{
    extend:"Ext.data.Store",

    alias: 'store.baseset.roomallot.isselectteacherstore',

 
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysUser", "checked").modelName,
});
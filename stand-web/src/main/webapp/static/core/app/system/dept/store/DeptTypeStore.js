
Ext.define("core.system.dept.store.DeptTypeStore",{
    extend:"Ext.data.Store",
    alias: 'store.system.dept.depttypestore',
    fields: ['code', 'deptType'],
    data: [
    	{code: '03', deptType: '部门'},
        {code: '04', deptType: '年级'},
        {code: '05', deptType: '班级'},
        {code: '06', deptType: '学科'},
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
   
});
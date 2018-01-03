Ext.define("core.wisdomclass.classelegant.store.FileStore", {
    extend: "Ext.data.Store",
    alias: 'store.wisdomclass.classelegant.filestore',

    fields: [
         {name: 'name', type: 'string'},
         {name: 'size',  type: 'string'},
         {name: 'type',   type: 'string'},
         {name: 'fileId',  type: 'string'},
         {name: 'fileUrl',  type: 'string'}
    ],
    proxy: {
        type: "ajax",
        url: comm.get('baseUrl') + "/BaseAttachment/getFileList",
        extraParams: {orderSql: " order by createTime desc "},
        reader: {
            type: "json",
        },
        writer: {
            type: "json"
        }
    },
    autoLoad: false
})

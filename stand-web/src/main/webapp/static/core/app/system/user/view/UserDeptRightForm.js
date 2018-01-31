Ext.define("core.system.user.view.UserDeptRightForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.system.user.userrightdeptform",
    autoScroll: true,
    items :[ {
       xtype: "fieldset",
       title: '设定用户权限部门',
       layout:'form',
       width:'99%',
       style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:400,
            border: '#097db5 1px solid'
        },
        defaults:{
            width:'100%',
            margin:"10 5 0 5",
            xtype: "textfield"
        },
        items: [{
            xtype: "textfield",
            fieldLabel: "主键",
            name: "uuid",
            hidden: true
        }, {
            xtype: 'radiogroup',
            ref: 'rightDeptRadio',
            fieldLabel: '权限部门',
            columns: 10,
            vertical: true,
            items: [{
                boxLabel: '所有部门',
                name: 'deptRadio',
                inputValue: 0,
                width:150,
            }, {
                boxLabel: '指定部门（包含了本部门、岗位主管、岗位权限的部门）',
                name: 'deptRadio',
                inputValue: 1,
                width:400,
                value:true,
               // checked: true
            }]
        }/*,{
            fieldLabel: "指定部门　",
            name: "deptIds",
            xtype: "textfield",
            hidden: true
        }, {
            columnWidth: 1,
            fieldLabel: "选择部门",
            name: "deptNames",
            readOnly:true,
            emptyText: "请选择有权限的部门",
            xtype: "basetreefield",
            funcPanel: 'notice.mainlayout',
            ddCode: "DEPTTREE",
            rootId: "ROOT",
            configInfo: {
                multiSelect: true,
                fieldInfo: "deptNames~deptIds,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                excludes:"",
                url: comm.get('baseUrl') + "/BaseOrg/getUserRightDeptTree",
            }
        }*/]
    }]
});
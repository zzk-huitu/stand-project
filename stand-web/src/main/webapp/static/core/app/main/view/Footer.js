Ext.define("core.main.view.Footer",{
    extend: "Ext.toolbar.Toolbar",

    cls: 'toolbar-btn-shadow',

    xtype: 'app-footer',
    border:1,  
    defaults:{
        style: {
            fontWeight: 400
        },
    }, 
    items: [
        { 
        	xtype: 'tbtext',        
            bind:{
                html: '用户名：{currentUser}</span>', 
            },
        	
        },
        '->',
        { 
            xtype: 'tbtext',
            bind:{
                text: '© {currentYear} {companyName} - {name}', 
            },
        },
    ]
});
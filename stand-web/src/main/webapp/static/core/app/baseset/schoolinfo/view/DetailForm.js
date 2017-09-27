Ext.define("core.baseset.schoolinfo.view.DetailForm", {
	extend: "core.base.view.BaseForm",
	alias: "widget.baseset.schoolinfo.detailform",
	layout: 'form', // 格式采用列的方式显示
	
	autoHeight: true,
	frame: false,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
        labelWidth: 120,          //  label宽度
    },

    items: [{
    	xtype: "textfield",
    	fieldLabel: "主键",
    	name: "uuid",
    	hidden: true
    }, {
    	xtype: "textfield",
    	fieldLabel: "版本号",
    	name: "version",
    	hidden: true
    }, {
    	xtype: "textfield",
    	fieldLabel: "排序字段",
    	name: "orderIndex",
    	hidden: true
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [ {
            columnWidth: 0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "学校名称",
            name: "schoolName",
            allowBlank: false,
            emptyText: '学校名称',
            blankText: "学校名称不能为空",
            
        },{
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "学校代码",
        	name: "schoolCode",
        	emptyText: '学校代码',
        	blankText: "学校代码不能为空",
        	
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	xtype: "textfield",
        	fieldLabel: "学校英文名",
        	name: "schoolEng",
        	emptyText: '学校英文名',
        	blankText: "学校英文名不能为空",
        	columnWidth: 0.5
        }, {        	
        	xtype: "textfield",
        	fieldLabel: "学校地址",
        	name: "schoolAddr",
        	emptyText: '学校地址',
        	blankText: "学校地址不能为空",
        	columnWidth: 0.5
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{        
        	xtype: "datetimefield",
        	dateType: 'date',
        	fieldLabel: "建校年月",		
        	anchor: '100%',
        	name: "foundYear",
        	maxValue: new Date(),
        	emptyText: '建校年月',
        	blankText: "建校年月不能为空",
        	columnWidth: 0.5
        }, {        	
        	xtype: "datetimefield",
        	dateType: 'date',
        	anchor: '100%',
        	fieldLabel: '校庆日',
        	name: 'anniversaryDay',
        	maxValue: new Date(),
        	emptyText: '校庆日',
        	blankText: "校庆日不能为空",
        	columnWidth: 0.5
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "邮政编码",
        	name: "zipCode",
        	emptyText: '邮政编码',
        	blankText: "邮政编码不能为空"
        }, {
        	columnWidth: 0.5,        	
        	xtype: "basecombobox",
        	fieldLabel: "行政区划",
        	name: "administration",
        	ddCode: "XZQHM",
        	emptyText: '行政区划',
        	blankText: "行政区划不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,        	
        	xtype: "basecombobox",
        	fieldLabel: "办学类型",
        	name: "officeType",
        	ddCode: "BXLX",
        	emptyText: '办学类型',
        	blankText: "办学类型不能为空"
        }, {
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "学校主管部门",
        	name: "chargeDept",
        	emptyText: '学校主管部门',
        	blankText: "学校主管部门不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "联系电话",
        	name: "telephone",
        	emptyText: '联系电话,格式如:0920-29392929',
        	blankText: "联系电话不能为空"
        }, {
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "传真电话",
        	name: "faxNum",
        	emptyText: '传真电话,格式如:0920-29392929',
        	blankText: "传真电话不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "法定代表人工号",
        	name: "legalPerson"
        }, {
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "法人证书号",
        	name: "legalCertificate",
        	emptyText: '法人证书号',
        	blankText: "法人证书号不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "校长工号",
        	name: "schoolmasterId"
        }, {
        	columnWidth: 0.5,        	
        	xtype: "textfield",
        	fieldLabel: "校长姓名",
        	name: "schoolmasterName",
        	emptyText: '校长姓名',
        	blankText: "校长姓名不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "党委负责人工号",
        	name: "partyPersonId"
        }, {
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "组织机构码",
        	name: "orgCode",        	
        	emptyText: '组织机构码',
        	blankText: "组织机构码不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "电子邮箱",
        	name: "email",
        	emptyText: '电子邮箱',
        	blankText: "电子邮箱不能为空",
        	vtype:"email",
        	vtypeText:"不是有效的邮箱地址"
        }, {
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "主页地址",
        	name: "homepage",
        	emptyText: '主页地址,格式如:http://wwww.abc.com',
        	blankText: "主页地址不能为空",
        	vtype:"url",
        	vtypeText:"请输入正确的主页地址"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "历史沿革",
        	name: "historyEvolution",
        	emptyText: '历史沿革',
        	blankText: "历史沿革不能为空"
        }, {
        	columnWidth: 0.5,
        	xtype: "basecombobox",
        	fieldLabel: "学校办别",
        	name: "schoolType",
        	ddCode: "DWBB",
        	emptyText: '学校办别',
        	blankText: "学校办别不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "textfield",
        	fieldLabel: "所属主管单位",
        	name: "chargeUnit",
        	emptyText: '所属主管单位',
        	blankText: "所属主管单位不能为空"
        }, {
        	columnWidth: 0.5,
        	xtype: "basecombobox",
        	fieldLabel: "所在地城乡类型",
        	name: "urbanRuralType",
        	ddCode: "SZDCXLX",
        	emptyText: '所在地城乡类型',
        	blankText: "所在地城乡类型不能为空"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "basecombobox",
        	fieldLabel: "所在地经济属性码",
        	name: "economicCode",
        	ddCode: "SZDQJJSX",
        	emptyText: '所在地经济属性码',
        	blankText: "所在地经济属性码不能为空"
        }, {
        	columnWidth: 0.5,
        	xtype: "basecombobox",
        	fieldLabel: "所在地民族属性",
        	name: "nationNature",
        	emptyText: '请选择...',
        	blankText: '所在地民族属性',
        	ddCode:"SZDMZSX"
        }]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.5,
        	xtype: "basecombobox",
        	fieldLabel: "学制",
        	name: "primaryLength",
        	ddCode: "XZ",
        	emptyText: '学制',
        	blankText: "学制不能为空"
        }, {
        	columnWidth: 0.5,
        	xtype: "numberfield",
        	fieldLabel: "入学年龄",
        	name: "primaryStartAge",
        	emptyText: '入学年龄',
        	blankText: "入学年龄不能为空"
        }]
	}/*, {
		xtype: "basecombobox",
		fieldLabel: "主教学语言码",
		name: "primaryLanCode",
		ddCode: "ZJXYYM",
		allowBlank: true,
		emptyText: '主教学语言码',
		blankText: "主教学语言码不能为空"
	}, {
		xtype: "basecombobox",
		fieldLabel: "辅教学语言码",
		name: "assistedLanCode",
		ddCode: "ZJXYYM",
		allowBlank: true,
		emptyText: '辅教学语言码',
		blankText: "辅教学语言码不能为空"
	}, {
		xtype: "textfield",
		fieldLabel: "招生半径",
		name: "recruitScope"
	}*/]

});
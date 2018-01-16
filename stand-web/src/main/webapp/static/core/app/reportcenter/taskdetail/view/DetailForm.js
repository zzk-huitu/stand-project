Ext.define("core.reportcenter.taskdetail.view.DetailForm", {
	extend: "core.base.view.BaseForm",
	alias : "widget.reportcenter.taskdetail.detailform",
	fieldDefaults: { // 统一设置表单字段默认属性
		labelSeparator: "：", // 分隔符
		msgTarget: "qtip",
		labelWidth: 120,
		labelAlign: "right"
	},
	items: [{
        fieldLabel: '详细',
        id:'detail',
        xtype: 'textareafield',
        name: 'msg',
        height:300,
        fieldStyle:"font-size:14px;",
        readOnly:true
    }], 

	formData: {
		 	"tlvs[0].type": 100,
		 	"tlvs[0].fieldName":"设备序列号",
	        "tlvs[0].tag": 0x1000,
		 
	        "tlvs[1].type": 10,
	        "tlvs[1].fieldName":"设备机号",
	        "tlvs[1].tag": 0x1001,
	        
	        "tlvs[2].type": 10,
	        "tlvs[2].fieldName":"设备类型",
	        "tlvs[2].tag": 0x1002,
		 
	        "tlvs[3].type": 10,
	        "tlvs[3].fieldName":"注册状态",
	        "tlvs[3].tag": 0x1003,
	        
	        "tlvs[4].type": 10,
	        "tlvs[4].fieldName":"设备状态",
	        "tlvs[4].tag": 0x1005,
	        
	        "tlvs[5].type": 10,
	        "tlvs[5].fieldName":"心跳间隔时间",
	        "tlvs[5].tag": 0x1006,
	        
	        "tlvs[6].type": 10,
	        "tlvs[6].fieldName":"系统时间",
	        "tlvs[6].tag": 0x1008,
	        
	        "tlvs[7].type": 10,
	        "tlvs[7].fieldName":"参数类型",
	        "tlvs[7].tag": 0x1009,
	        
	        "tlvs[8].type": 10,
	        "tlvs[8].fieldName":"通讯超时",
	        "tlvs[8].tag": 0x1010,
	        
	        "tlvs[9].type": 10,
	        "tlvs[9].fieldName":"同步状态",
	        "tlvs[9].tag": 0x1012,
	        
	        "tlvs[10].type": 10,
	        "tlvs[10].fieldName":"应答结果",
	        "tlvs[10].tag": 0x1013,
	        
	        "tlvs[11].type": 10,
	        "tlvs[11].fieldName":"上传状态",
	        "tlvs[11].tag": 0x1014,
	        
	        "tlvs[12].type": 10,
	        "tlvs[12].fieldName":"允许卡类",
	        "tlvs[12].tag": 0x1015,
	        
	        "tlvs[13].type": 10,
	        "tlvs[13].fieldName":"允读卡类",
	        "tlvs[13].tag": 0x1016,
	        
	        "tlvs[14].type": 10,
	        "tlvs[14].fieldName":"验有效期",
	        "tlvs[14].tag": 0x1017,
	        
	        "tlvs[15].type": 10,
	        "tlvs[15].fieldName":"锁类型",
	        "tlvs[15].tag": 0x1018,
	        
	        "tlvs[16].type": 10,
	        "tlvs[16].fieldName":"自动锁卡",
	        "tlvs[16].tag": 0x1019,
	        
	        "tlvs[17].type": 10,
	        "tlvs[17].fieldName":"黑白名单判断标记",
	        "tlvs[17].tag": 0x1021,
	        
	        "tlvs[18].type": 10,
	        "tlvs[18].fieldName":"工作模式",
	        "tlvs[18].tag": 0x1023,
	        
	        "tlvs[19].type": 10,
	        "tlvs[19].fieldName":"计费单位",
	        "tlvs[19].tag": 0x1024,
	        
	        "tlvs[20].type": 10,
	        "tlvs[20].fieldName":"设备重启",
	        "tlvs[20].tag": 0x1037,
	        
	        "tlvs[21].type": 10,
	        "tlvs[21].fieldName":"清除参数",
	        "tlvs[21].tag": 0x1038,
	        
	        "tlvs[22].type": 10,
	        "tlvs[22].fieldName":"采集结果",
	        "tlvs[22].tag": 0x1042,
	        
	        "tlvs[23].type": 10,
	        "tlvs[23].fieldName":"记录位置",
	        "tlvs[23].tag": 0x1044,
	        
	        "tlvs[24].type": 10,
	        "tlvs[24].fieldName":"删除设备",
	        "tlvs[24].tag": 0x1045,
	        
	        "tlvs[25].type": 10,
	        "tlvs[25].fieldName":"程序版本",
	        "tlvs[25].tag": 0x1046,
	        
	        "tlvs[26].type": 10,
	        "tlvs[26].fieldName":"自动添加",
	        "tlvs[26].tag": 0x1048,
	        
	        "tlvs[27].type": 10,
	        "tlvs[27].fieldName":"自动升级",
	        "tlvs[27].tag": 0x1049,
	        
	        "tlvs[28].type": 10,
	        "tlvs[28].fieldName":"列表初始化",
	        "tlvs[28].tag": 0x1052,
	        
	        "tlvs[29].type": 10,
	        "tlvs[29].fieldName":"重启时间",
	        "tlvs[29].tag": 0x2000,
	        
	        "tlvs[30].type": 10,
	        "tlvs[30].fieldName":"预扣费模式下预扣费金额",
	        "tlvs[30].tag": 0x2002,
	        
	        "tlvs[31].type": 10,
	        "tlvs[31].fieldName":"刷卡间隔",
	        "tlvs[31].tag": 0x2003,
	        
	        "tlvs[32].type": 10,
	        "tlvs[32].fieldName":"日限次",
	        "tlvs[32].tag": 0x2004,
	        
	        "tlvs[33].type": 10,
	        "tlvs[33].fieldName":"单次限量",
	        "tlvs[33].tag": 0x2005,
	        
	        "tlvs[34].type": 10,
	        "tlvs[34].fieldName":"日限量",
	        "tlvs[34].tag": 0x2006,
	        
	        "tlvs[35].type": 10,
	        "tlvs[35].fieldName":"允许卡类",
	        "tlvs[35].tag": 0x2007,
	        
	        "tlvs[36].type": 10,
	        "tlvs[36].fieldName":"卡机绑定",
	        "tlvs[36].tag": 0x2008,
	        
	        "tlvs[37].type": 10,
	        "tlvs[37].fieldName":"自动锁卡",
	        "tlvs[37].tag": 0x2009,
	        
	        "tlvs[38].type": 10,
	        "tlvs[38].fieldName":"一阶费率",
	        "tlvs[38].tag": 0x2010,
	        
	        "tlvs[39].type": 10,
	        "tlvs[39].fieldName":"二阶费率",
	        "tlvs[39].tag": 0x2011,
	        
	        "tlvs[40].type": 10,
	        "tlvs[40].fieldName":"三阶费率",
	        "tlvs[40].tag": 0x2012,
	        
	        "tlvs[41].type": 10,
	        "tlvs[41].fieldName":"一阶限制",
	        "tlvs[41].tag": 0x2013,
	        
	        "tlvs[42].type": 10,
	        "tlvs[42].fieldName":"二阶限制",
	        "tlvs[42].tag": 0x2014,
	        
	        "tlvs[43].type": 10,
	        "tlvs[43].fieldName":"列表同步",
	        "tlvs[43].tag": 0xA001,
	        
	        "tlvs[44].type": 10,
	        "tlvs[44].fieldName":"设备索引",
	        "tlvs[44].tag": 0xA002,
	        
	        "tlvs[45].type": 10,
	        "tlvs[45].fieldName":"索引属性",
	        "tlvs[45].tag": 0xA003,
	        
	        "tlvs[46].type": 10,
	        "tlvs[46].fieldName":"服务器地址",
	        "tlvs[46].tag": 0x3000,
	        
	        "tlvs[47].type": 10,
	        "tlvs[47].fieldName":"服务器端口",
	        "tlvs[47].tag": 0x3001,
	        
	        "tlvs[48].type": 10,
	        "tlvs[48].fieldName":"设备地址",
	        "tlvs[48].tag": 0x3002,
	        
	        "tlvs[49].type": 10,
	        "tlvs[49].fieldName":"设备MAC值",
	        "tlvs[49].tag": 0x3003,
	        
	        "tlvs[50].type": 10,
	        "tlvs[50].fieldName":"设备网关地址",
	        "tlvs[50].tag": 0x3004,
	        
	        "tlvs[51].type": 10,
	        "tlvs[51].fieldName":"设备子网掩码",
	        "tlvs[51].tag": 0x3005,
	        
	        "tlvs[52].type": 10,
	        "tlvs[52].fieldName":"DHCP使能",
	        "tlvs[52].tag": 0x3008,
	        
	        "tlvs[53].type": 10,
	        "tlvs[53].fieldName":"系统编号",
	        "tlvs[53].tag": 0x4001,
	        
	        "tlvs[54].type": 10,
	        "tlvs[54].fieldName":"水控扇区",
	        "tlvs[54].tag": 0x4002,
	        
	        "tlvs[55].type": 10,
	        "tlvs[55].fieldName":"扇区密钥",
	        "tlvs[55].tag": 0x4003,
	        
	        "tlvs[56].type": 10,
	        "tlvs[56].fieldName":"权限修改方式",
	        "tlvs[56].tag": 0x5000,
	        
	        "tlvs[57].type": 10,
	        "tlvs[57].fieldName":"权限数据",
	        "tlvs[57].tag": 0x5001,
	        
	        "tlvs[58].type": 10,
	        "tlvs[58].fieldName":"权限数量包",
	        "tlvs[58].tag": 0x5002,
	        
	        "tlvs[59].type": 10,
	        "tlvs[59].fieldName":"权限包序号",
	        "tlvs[59].tag": 0x5003,
	        
	        "tlvs[60].type": 10,
	        "tlvs[60].fieldName":"下载完成标记",
	        "tlvs[60].tag": 0x5004,
	        
	        "tlvs[61].type": 10,
	        "tlvs[61].fieldName":"名单版本",
	        "tlvs[61].tag": 0x5005,
	        
	        "tlvs[62].type": 10,
	        "tlvs[62].fieldName":"记录流水号",
	        "tlvs[62].tag": 0x6000,
	        
	        "tlvs[63].type": 10,
	        "tlvs[63].fieldName":"物理卡号",
	        "tlvs[63].tag": 0x6001,
	        
	        "tlvs[64].type": 10,
	        "tlvs[64].fieldName":"设备机号",
	        "tlvs[64].tag": 0x6002,
	        
	        "tlvs[65].type": 10,
	        "tlvs[65].fieldName":"消费时间",
	        "tlvs[65].tag": 0x6003,
	        
	        "tlvs[66].type": 10,
	        "tlvs[66].fieldName":"记录标识",
	        "tlvs[66].tag": 0x6004,
	        
	        "tlvs[67].type": 10,
	        "tlvs[67].fieldName":"记录位置",
	        "tlvs[67].tag": 0x6005,
	        
	        "tlvs[68].type": 10,
	        "tlvs[68].fieldName":"已交易记录流水号",
	        "tlvs[68].tag": 0x6006,
	        
	        "tlvs[69].type": 10,
	        "tlvs[69].fieldName":"发卡流水号",
	        "tlvs[69].tag": 0x6008,
	        
	        "tlvs[70].type": 10,
	        "tlvs[70].fieldName":"卡余额",
	        "tlvs[70].tag": 0x6009,
	        
	        "tlvs[71].type": 10,
	        "tlvs[71].fieldName":"消费额",
	        "tlvs[71].tag": 0x600C,
	        
	        "tlvs[72].type": 10,
	        "tlvs[72].fieldName":"消费次数",
	        "tlvs[72].tag": 0x600D,
	        
	        "tlvs[73].type": 10,
	        "tlvs[73].fieldName":"已交易的总金额",
	        "tlvs[73].tag": 0x6011,
	        
	        "tlvs[74].type": 10,
	        "tlvs[74].fieldName":"已上传的消费总额",
	        "tlvs[74].tag": 0x6012,
	        
	        "tlvs[75].type": 10,
	        "tlvs[75].fieldName":"冷水使用量",
	        "tlvs[75].tag": 0x6013,
	        
	        "tlvs[76].type": 10,
	        "tlvs[76].fieldName":"热水使用量",
	        "tlvs[76].tag": 0x6014,
	        
	        "tlvs[77].type": 10,
	        "tlvs[77].fieldName":"记录满标记",
	        "tlvs[77].tag": 0x6015,
	        
	        "tlvs[78].type": 10,
	        "tlvs[78].fieldName":"请求卡余",
	        "tlvs[78].tag": 0x6019,
	        
	        "tlvs[79].type": 10,
	        "tlvs[79].fieldName":"记录数据",
	        "tlvs[79].tag": 0x6099,
	        
	        "tlvs[80].type": 10,
	        "tlvs[80].fieldName":"报警电量",
	        "tlvs[80].tag": 0x8000,
	        
	        "tlvs[81].type": 10,
	        "tlvs[81].fieldName":"最大电量",
	        "tlvs[81].tag": 0x8001,
	        
	        "tlvs[82].type": 10,
	        "tlvs[82].fieldName":"电量扣费模式",
	        "tlvs[82].tag": 0x8002,
	        
	        "tlvs[83].type": 10,
	        "tlvs[83].fieldName":"限制电流",
	        "tlvs[83].tag": 0x8003,
	        
	        "tlvs[84].type": 10,
	        "tlvs[84].fieldName":"当前电流",
	        "tlvs[84].tag": 0x8004,
	        
	        "tlvs[85].type": 10,
	        "tlvs[85].fieldName":"当前电压",
	        "tlvs[85].tag": 0x8005,
	        
	        "tlvs[86].type": 10,
	        "tlvs[86].fieldName":"当前功率",
	        "tlvs[86].tag": 0x8006,
	        
	        "tlvs[87].type": 10,
	        "tlvs[87].fieldName":"剩余电量",
	        "tlvs[87].tag": 0x8007,
	        
	        "tlvs[88].type": 10,
	        "tlvs[88].fieldName":"总购电量",
	        "tlvs[88].tag": 0x8008,
	        
	        "tlvs[89].type": 10,
	        "tlvs[89].fieldName":"购电",
	        "tlvs[89].tag": 0x8009,
	        
	        "tlvs[90].type": 10,
	        "tlvs[90].fieldName":"远程开关电",
	        "tlvs[90].tag": 0x8010,
	        
	        "tlvs[91].type": 10,
	        "tlvs[91].fieldName":"通断状态",
	        "tlvs[91].tag": 0x8011,
	        
	        "tlvs[92].type": 10,
	        "tlvs[92].fieldName":"总使用量",
	        "tlvs[92].tag": 0x8014,
	        
	        "tlvs[93].type": 10,
	        "tlvs[93].fieldName":"记录间隔时间",
	        "tlvs[93].tag": 0x8015,
	        
	        "tlvs[94].type": 10,
	        "tlvs[94].fieldName":"购电量数据",
	        "tlvs[94].tag": 0x8016,
	        
	        "tlvs[95].type": 10,
	        "tlvs[95].fieldName":"当前功率因素",
	        "tlvs[95].tag": 0x8017,
	        
	        "tlvs[96].type": 10,
	        "tlvs[96].fieldName":"购电任务",
	        "tlvs[96].tag": 0x8018,
	        
	        "tlvs[97].type": 10,
	        "tlvs[97].fieldName":"支持首卡开门标记",
	        "tlvs[97].tag": 0x9000,
	        
	        "tlvs[98].type": 10,
	        "tlvs[98].fieldName":"刷卡开门延迟时间",
	        "tlvs[98].tag": 0x9001,
	        
	        "tlvs[99].type": 10,
	        "tlvs[99].fieldName":"启用门未关报警",
	        "tlvs[99].tag": 0x9002,
	        
	        "tlvs[100].type": 10,
	        "tlvs[100].fieldName":"未关门判断延迟时间",
	        "tlvs[100].tag": 0x9003,
	        
	        "tlvs[101].type": 10,
	        "tlvs[101].fieldName":"蜂鸣器使能",
	        "tlvs[101].tag": 0x9004,
	        
	        "tlvs[102].type": 10,
	        "tlvs[102].fieldName":"远程开关门",
	        "tlvs[102].tag": 0x9005,
	        
	        "tlvs[103].type": 10,
	        "tlvs[103].fieldName":"开关门标记",
	        "tlvs[103].tag": 0x9006,
	        
	        "tlvs[104].type": 10,
	        "tlvs[104].fieldName":"开门延迟时间",
	        "tlvs[104].tag": 0x9007,
	        
	        "tlvs[105].type": 10,
	        "tlvs[105].fieldName":"开关门状态",
	        "tlvs[105].tag": 0x9008,
	        
	        "tlvs[106].type": 10,
	        "tlvs[106].fieldName":"卡机绑定标记",
	        "tlvs[106].tag": 0x9009,
	        
	        "tlvs[107].type": 10,
	        "tlvs[107].fieldName":"设备参数头",
	        "tlvs[107].tag": 0x00FF,
	        
	        "tlvs[108].type": 10,
	        "tlvs[108].fieldName":"红外载波频率",
	        "tlvs[108].tag": 0xB000,
	        
	        "tlvs[109].type": 10,
	        "tlvs[109].fieldName":"发送次数",
	        "tlvs[109].tag": 0xB001,
	        
	        "tlvs[110].type": 10,
	        "tlvs[110].fieldName":"红外代码编号",
	        "tlvs[110].tag": 0xB002,
	        
	        "tlvs[111].type": 10,
	        "tlvs[111].fieldName":"开关路数",
	        "tlvs[111].tag": 0xC004,
	        
	        "tlvs[112].type": 10,
	        "tlvs[112].fieldName":"控制设备",
	        "tlvs[112].tag": 0xC002,
	        
	        "tlvs[113].type": 10,
	        "tlvs[113].fieldName":"定时开关时间表",
	        "tlvs[113].tag": 0xC001,
	        
	        "tlvs[114].type": 10,
	        "tlvs[114].fieldName":"控制类型",
	        "tlvs[114].tag": 0xC003,
	        
	        "tlvs[115].type": 10,
	        "tlvs[115].fieldName":"开关状态",
	        "tlvs[115].tag": 0xC005,
	        
	        "tlvs[116].type": 10,
	        "tlvs[116].fieldName":"开关状态",
	        "tlvs[116].tag": 0xC006,
	        
	        "tlvs[117].type": 10,
	        "tlvs[117].fieldName":"接线类型",
	        "tlvs[117].tag": 0xC007,
	        
	        "tlvs[118].type": 10,
	        "tlvs[118].fieldName":"32类卡扣费费率",
	        "tlvs[118].tag": 0x7000,  
	        
	        "tlvs[119].type": 10,
	        "tlvs[119].fieldName":"计时实时模式",
	        "tlvs[119].tag": 0x00,  
	        
	        "tlvs[120].type": 10,
	        "tlvs[120].fieldName":"计量实时模式",
	        "tlvs[120].tag": 0x11,  
	        
	        "tlvs[121].type": 10,
	        "tlvs[121].fieldName":"计时预扣费模式",
	        "tlvs[121].tag": 0x33,  
	        
	        "tlvs[122].type": 10,
	        "tlvs[122].fieldName":"计量预扣费模式",
	        "tlvs[122].tag": 0x44,  
	    }
});
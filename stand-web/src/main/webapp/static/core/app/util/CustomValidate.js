// 密码相等验证
Ext.apply(Ext.form.VTypes, {
	password: function(val, field) {
		if (field.initialPassField) {
			var pwd = field.findParentByType('form').getForm().findField(field.initialPassField);
			if (val == pwd.getValue()) {
				pwd.clearInvalid();
				return true;
			} else {
				return false;
			}
		}
		return true;
	},
	passwordText: '两次输入不一致，请重新输入'
});
// 大小比较的验证
Ext.apply(Ext.form.VTypes, {
	compareNum: function(val, field) {
		if (field.initialNumField) {
			var otherField = field.findParentByType('ev-generalform').getForm().findField(field.initialNumField);
			this.compareNumText = field.compareNumText;
			if (Ext.isNumber(otherField.getValue()) && otherField.getValue() >= 0) {
				if (field.maxOrMin == "max") {
					if (val >= otherField.getValue()) {
						otherField.clearInvalid();
						return true;
					} else {
						return false;
					}
				} else if (field.maxOrMin == "min") {
					if (val <= otherField.getValue()) {
						otherField.clearInvalid();
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		}
		return true;
	}
});
// 日期范围验证
Ext.apply(Ext.form.VTypes, {
	daterange: function(val, field) {
		var date = field.parseDate(val);
		if (!date) {
			return;
		}
		if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
				.getTime()))) {
			var start = field.findParentByType('ev-generalform').getForm().findField(field.startDateField);
			start.setMaxValue(date);
			start.validate();
			this.dateRangeMax = date;
		} else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
				.getTime()))) {
			var end = field.findParentByType('ev-generalform').getForm().findField(field.endDateField);
			end.setMinValue(date);
			end.validate();
			this.dateRangeMin = date;
		}
		return true;
	}
});
//邮箱编码验证
Ext.apply(Ext.form.VTypes, {
	zipCode: function(val, field) {
		var reg = /^[1-9]\d{5}(?!\d)$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	zipCodeText: '请输入正确的邮政编码',
});
//身份证验证
Ext.apply(Ext.form.VTypes, {
	idCode: function(val, field) {
		var reg = /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	idCodeText: '请输入正确的身份证号码',
});
//移动电话
Ext.apply(Ext.form.VTypes, {
	phoneCode: function(val, field) {
		var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	phoneCodeText: '请输入正确的移动电话号码',
});

// 日期比较验证
Ext.apply(Ext.form.VTypes, {
	beginDate: function(val, field) {
		if (field.compareField) {
			var dateField= field.findParentByType('form').getForm().findField(field.compareField);
			var compareDate= dateField.value;

            if(!Ext.isEmpty(compareDate)){        
            	//var beginDate = new Date(val);  	//直接使用val，获取的日期时间有误差
                var beginDate = new Date(field.value);
                var endDate = new Date(compareDate);
                if (beginDate <= endDate) {
                    dateField.clearInvalid();
                    return true;
                } else {
					return false;
				}           
            }

			
		}
		return true;
	},

	beginDateText: '开始时间不能大于结束时间'
});
// 日期比较验证
Ext.apply(Ext.form.VTypes, {
	endDate: function(val, field) {
		if (field.compareField) {
			var dateField= field.findParentByType('form').getForm().findField(field.compareField);
			var compareDate= dateField.value;

            if(!Ext.isEmpty(compareDate)){
                var beginDate = new Date(compareDate);
                var endDate = new Date(field.value);
                if (beginDate <= endDate) {
                    dateField.clearInvalid();
                    return true;
                } else {
					return false;
				}           
            }

			
		}
		return true;
	},

	endDateText: '结束时间不能小于开始时间'
});

// 时分秒比较验证
Ext.apply(Ext.form.VTypes, {
	startTime: function(val, field) {
		if (field.compareField) {
			var dateField= field.findParentByType('form').getForm().findField(field.compareField);
			var compareDate= dateField.value;

            if(!Ext.isEmpty(compareDate)){            
                var beginDate = new Date(field.value);
                var endDate = new Date(compareDate);
                if (beginDate <= endDate) {
                    dateField.clearInvalid();
                    return true;
                } else {
					return false;
				}           
            }	
		}
		return true;
	},
	startTimeText: '开始时间不能大于结束时间'
});
Ext.apply(Ext.form.VTypes, {
	endTime: function(val, field) {
		if (field.compareField) {
			var dateField= field.findParentByType('form').getForm().findField(field.compareField);
			var compareDate= dateField.value;

            if(!Ext.isEmpty(compareDate)){           
                var beginDate = new Date(compareDate);
                var endDate = new Date(field.value);
              
                if (beginDate <= endDate) {
                    dateField.clearInvalid();
                    return true;
                } else {
					return false;
				}           
            }
			
		}
		return true;
	},
	endTimeText: '结束时间不能小于开始时间'
});


//IP地址验证
Ext.apply(Ext.form.VTypes, {
	ipCode: function(val, field) {
		var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	ipCodeText:'IP格式为：xxx.xxx.xxx.xxx',
});
//MAC地址验证
Ext.apply(Ext.form.VTypes, {
	macCode: function(val, field) {
		//var reg = /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/;
		var reg = /^[0-9]{1}[02468]{1}-([0-9A-Fa-f]{2}-){4}[0-9A-Fa-f]{2}$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	macCodeText:'MAC地址格式为：FF-FF-FF-FF-FF-FF',
});
//userName验证  
Ext.apply(Ext.form.VTypes, {
	userName: function(val, field) {
		var reg = /^[_a-zA-Z0-9]+$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	userNameText:'用户名由英文字母，数字，下划线组成',
});
//xm  
Ext.apply(Ext.form.VTypes, {
	xm: function(val, field) {
		var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	xmText:'姓名由汉字，字母，数字，下划线组成',
});
//userNumb验证  
Ext.apply(Ext.form.VTypes, {
	userNumb: function(val, field) {
		var reg = /^[0-9a-zA-Z_]{0,}$/;
		try {
			if (reg.test(val))
				return true;
			return false;
		} catch (e) {
			return false;
		}
	},
	userNumbText:'用户编号由字母，数字，下划线组成',
});
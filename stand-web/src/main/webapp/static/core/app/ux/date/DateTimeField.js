/**
 * @docauthor Jason Johnston <jason@sencha.com>
 *
 * Provides a date input field with a {@link Ext.picker.Date date picker} dropdown and automatic date
 * validation.
 *
 * This field recognizes and uses the JavaScript Date object as its main {@link #value} type. In addition,
 * it recognizes string values which are parsed according to the {@link #format} and/or {@link #altFormats}
 * configs. These may be reconfigured to use date formats appropriate for the user's locale.
 *
 * The field may be limited to a certain range of dates by using the {@link #minValue}, {@link #maxValue},
 * {@link #disabledDays}, and {@link #disabledDates} config parameters. These configurations will be used both
 * in the field's validation, and in the date picker dropdown by preventing invalid dates from being selected.
 *
 * # Example usage
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         renderTo: Ext.getBody(),
 *         width: 300,
 *         bodyPadding: 10,
 *         title: 'Dates',
 *         items: [{
 *             xtype: 'datefield',
 *             anchor: '100%',
 *             fieldLabel: 'From',
 *             name: 'from_date',
 *             maxValue: new Date()  // limited to the current date or prior
 *         }, {
 *             xtype: 'datefield',
 *             anchor: '100%',
 *             fieldLabel: 'To',
 *             name: 'to_date',
 *             value: new Date()  // defaults to today
 *         }]
 *     });
 *
 * # Date Formats Examples
 *
 * This example shows a couple of different date format parsing scenarios. Both use custom date format
 * configurations; the first one matches the configured `format` while the second matches the `altFormats`.
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         renderTo: Ext.getBody(),
 *         width: 300,
 *         bodyPadding: 10,
 *         title: 'Dates',
 *         items: [{
 *             xtype: 'datefield',
 *             anchor: '100%',
 *             fieldLabel: 'Date',
 *             name: 'date',
 *             // The value matches the format; will be parsed and displayed using that format.
 *             format: 'm d Y',
 *             value: '2 4 1978'
 *         }, {
 *             xtype: 'datefield',
 *             anchor: '100%',
 *             fieldLabel: 'Date',
 *             name: 'date',
 *             // The value does not match the format, but does match an altFormat; will be parsed
 *             // using the altFormat and displayed using the format.
 *             format: 'm d Y',
 *             altFormats: 'm,d,Y|m.d.Y',
 *             value: '2.4.1978'
 *         }]
 *     });
 */
Ext.define('Ext.ux.DateTimeField', {
    extend:'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: ['Ext.ux.DateTimePicker'],
     
    editable : false,
    format : null,
    submitFormat:null,
    startDay: 1,

    formatText:'',
    // invalidText :'',
    // minText :'',
    // ariaMinText:'',
    // maxText:'',
    // ariaMaxText:'',
    
    //分为两种控件， date 和 datetime
    dateType:'datetime',        

    triggers: {
        picker: {
            handler: 'onTriggerClick',
            scope: 'this',
            focusOnMousedown: true
        },
        clear: {
            cls:Ext.baseCSSPrefix + 'form-clear-trigger',
            handler:function(btn){
                var me=this;
                me.reset();
            },
            weight:-1,
            scope: 'this',
            focusOnMousedown: true
        },
    },

    initComponent : function(){
        var me = this,
            isString = Ext.isString,
            min, max;
    
        min = me.minValue;
        max = me.maxValue;
        if(isString(min)){
            me.minValue = me.parseDate(min);
        }
        if(isString(max)){
            me.maxValue = me.parseDate(max);
        }
        me.disabledDatesRE = null;
        me.initDisabledDays();

        if(me.dateType == 'date'){  //date 或者 datetime
            if(!me.submitFormat)
                me.submitFormat  = 'Y-m-d';
            if(!me.format)
                me.format="Y年m月d日";
        }else{
            if(!me.format)
                me.format='Y-m-d H:i:s';
            if(!me.submitFormat)
                me.submitFormat  = 'Y-m-d H:i:s';
        }
        me.callParent();
    },

     /**
     * 创建时间选择器
     * @return {}
     */
     
    createPicker: function() {
        var me = this;
        if(me.dateType == 'date'){
            return me.callParent(arguments);
        }else{
            return me.createTimePicker();
        }
    },

    createTimePicker: function() {
        var me = this,
            format = Ext.String.format;

        // Create floating Picker BoundList. It will acquire a floatParent by looking up
        // its ancestor hierarchy (Pickers use their pickerField property as an upward link)
        // for a floating component.
        return new Ext.ux.DateTimePicker({
            pickerField: me,
            floating: true,
            focusable: false, // Key events are listened from the input field which is never blurred
            hidden: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },

    getValue : function(){
        var me = this;
        if(me.value=="Invalid Date")
            return null;
        var value = Ext.isEmpty(me.value) ? '' : Ext.Date.format(me.value,this.submitFormat || this.format);
        return value;
    },
    // private
    formatDate: function(date,format){
        if(date=="Invalid Date")
            return null;
        return Ext.isDate(date) ? Ext.Date.dateFormat(date, format || this.format) : date;
    },
    /**
     * @private
     * Sets the Date picker's value to match the current field value when expanding.
     */    
    onExpand: function() {
        var me = this;
        var value = this.rawDate;
        //value = Ext.isDate(value) ? value : new Date();
        //this.picker.setValue(value);
        if(value=="Invalid Date" || value==null)
            value =  new Date();
       
        value = Ext.isDate(value) ? value : new Date();
        me.picker.setValue(value);     
        
        if(me.dateType == 'datetime'){
            me.picker.hour.setValue(value.getHours());
            me.picker.minute.setValue(value.getMinutes());
            me.picker.second.setValue(value.getSeconds());
        }
    },


});
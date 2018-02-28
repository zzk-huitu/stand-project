Ext.define("core.baseset.campus.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.campus.othercontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        //formUtil: "core.util.FormUtil",
       // queryUtil: "core.util.QueryUtil"
    },
    init: function () {
    },
    /** 该视图内的组件事件注册 */
    control: {
	    "baseform[xtype=baseset.campus.detailform] ": {
	    	afterrender: function(grid) {
	    		var data =this.ajax({
	    			url:comm.get('baseUrl') + "/BaseCampus/getSchool",

	    		});
	    		var formObj = grid.getForm();
	    		if(data!=null){
	    			formObj.findField("schoolId").setValue(data.uuid);
	    			formObj.findField("schoolName").setValue(data.schoolName);
	    		}else{
	    			formObj.findField("schoolId").setValue("");
	    			formObj.findField("schoolName").setValue("");

	    		}
	    		var baseformtab = grid.up("baseformtab");
	    		var schoolContainer =  grid.down("container[ref=schoolContainer]");
	    		var cmd = baseformtab.operType;
	    		if(cmd=="edit"){
	    			schoolContainer.setVisible(true);
	    		}else{
	    			schoolContainer.setVisible(false);
	    		}
	    		return false;

	    	}
        },
    }
});
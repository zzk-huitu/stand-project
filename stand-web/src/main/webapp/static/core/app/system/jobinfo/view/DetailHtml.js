Ext.define("core.system.jobinfo.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.system.jobinfo.detailhtml",
    layout: "form", 
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'jobBaseInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">岗位基本信息：</div>',
            '<ul>' ,
            '<li style="width:50%" title="{jobName}">岗位名称：{jobName}</li>',
            '<li style="width:50%" title="{jobCode}">岗位编码：{jobCode}</li>',
            '<li style="width:50%" title="{orderIndex}">级别：{orderIndex}</li>',
            '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
            '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }, {
        xtype: 'container',
        ref: "jobDetailInfo",
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classTraineeInfo">',
            '<div class="trainClass_title">岗位部门管理：</div>',
            '<ul class="trainClass_gridUl" style="max-height: 400px;">',
            '<li>',
            '<span style="width:20%" data-align="center">部门名称</span><span style="width:20%" data-align="center">部门全称</span>' ,
            '<span style="width:20%" data-align="center">部门岗位名称</span><span style="width:20%" data-align="center">部门岗位全称</span>' ,
            '<span style="width:10%" data-align="center">岗位类型</span><span style="width:10%" data-align="center">岗位级别</span>' ,
            '{% if (values.rows.length == 0) %}',
            '<li style="width:100%;font-size: 14px;font-weight: 400;text-align: center;line-height: 100px;">此岗位暂无部门岗位信息...</li>',
            '{% if (values.rows.length == 0 ) return  %}',   //reutrun 表示不执行下面的了，在for里面可以使用break、continue
            '<tpl for="rows">',
            '<li>' ,
            '<span style="width: 20%;" >{deptName}</span><span style="width: 20%;">{allDeptName}</span>',
            '<span style="width: 20%;" >{deptjobName}</span><span style="width: 20%;">{alldeptjobName}</span>',
            '<span style="width: 10%;" ><tpl if="jobType == 0">主负责岗位<tpl elseif="jobType==1">副负责岗位<tpl else>普通岗位</tpl></span>',
            '<span style="width: 10%;">{jobLevel}</span>',
            '<div style="clear:both"></div>',
            '</li>',
            '</tpl>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
  
});
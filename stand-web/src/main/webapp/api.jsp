<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>智慧课牌相关接口</title>
</head>
<body>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取班级列表接口</summary>
			<br/>
			<span>URL：</span><a href="/app/GradeClass/getGradeClassList">http://10.10.8.136:9005/app/GradeClass/getGradeClassList</a>
			<h3>返回成功</h3> 
			<span style="color:green">{"message":true,"messageInfo":"调用成功！","obj":null,"list":[{"CLAI_ID":"434c27c5-5f8c-45ea-9c44-8f45113284b8","CLASS_NAME":"（1）班","GRADE_NAME":"高一"}]}</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">{"message":false,"messageInfo":"没有数据！","obj":null,"list":null}</span>
			<h3>请求异常</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取班级信息</summary>
			<br/>
			<span>URL：</span><a href="/app/GradeClass/getClassInfo?classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/GradeClass/getClassInfo?classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>
			<p>
	 		<span>classId：班级ID</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"请求成功！","teacherInfo":{...},"classstarInfo":{...},"redflagList":[{...},{...}],"classInfo":{...}}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"找不到班级信息！","teacherInfo":null,"classstarInfo":null,"redflagList":null,"classInfo":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的班级学生列表</summary>
			<br/>
			<span>URL：</span><a href="/app/GradeClass/getClassStudent?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/GradeClass/getClassStudent?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>	
			<br/>
			<span>URL：</span><a href="/app/GradeClass/getClassStudent?termCode=000002">http://10.10.8.136:9005/app/GradeClass/getClassStudent?termCode=000002</a>		
			<p>
			<span>termCode：设备终端号</span>
			<br/>
	 		<span>classId：班级ID（若设备绑定的房间为功能室，则不需要传入班级ID，此时会从【功能室课程】中查询班级ID）</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"查询成功","list":[{...},{...}],"totalLeaveed":0}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"没有找到该终端设备！","list":null,"totalLeaveed":0}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的房间信息</summary>
			<br/>
			<span>URL：</span><a href="/app/RoomInfo/getRoomInfo?termCode=000001">http://10.10.8.136:9005//app/RoomInfo/getRoomInfo?termCode=000001</a>	
			<p>
			<span>termCode：设备终端号</span>			
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"请求成功！","obj":{...}}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"没有找到该终端对应的房间！","obj":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的公告信息</summary>
			<br/>
			<span>URL：</span><a href="/app/Notice/getList?termCode=000001&limit=3&start=0">http://10.10.8.136:9005/app/Notice/getList?termCode=000001&limit=3&start=0</a>	
			<p>
			<span>termCode：设备终端号</span>	
			<br/>
			<span>start：分页记录起始点（第一页为0，第二页为0+limit*1，第三页为0+limit*2）</span>	
			<br/>
			<span>limit：每页的记录树</span>	
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"请求成功！","obj":{...}}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"没有找到该终端对应的房间！","obj":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前启用的考勤规则</summary>
			<br/>
			<span>URL：</span><a href="/app/CheckRule/getRule">http://10.10.8.136:9005/app/CheckRule/getRule</a>				
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"请求成功！","obj":{...}}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"没有找到已启用的考勤规则！","obj":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的图片资源</summary>
			<br/>
			<span>URL：</span><a href="/app/ClassFile/getClassPics?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/ClassFile/getClassPics?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>				
			<br/>
			<span>URL：</span><a href="/app/ClassFile/getClassPics?termCode=000002">http://10.10.8.136:9005/app/ClassFile/getClassPics?termCode=000002</a>	
			<p>
			<span>termCode：设备终端号</span>
			<br/>
	 		<span>classId：班级ID（若设备绑定的房间为功能室，则不需要传入班级ID，此时会从【1.特殊考勤课程 或 2.功能室课程】中查询班级ID）</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">		
			{"message":true,"messageInfo":"请求成功！","data":{"totalCount":1,"picList":[{...},{...}]}}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"未找到该班级信息！","data":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的视频资源</summary>
			<br/>
			<span>URL：</span><a href="/app/ClassFile/getClassVideos?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/ClassFile/getClassVideos?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>				
			<br/>
			<span>URL：</span><a href="/app/ClassFile/getClassVideos?termCode=000002">http://10.10.8.136:9005/app/ClassFile/getClassVideos?termCode=000002</a>		
			<p>
			<span>termCode：设备终端号</span>
			<br/>
	 		<span>classId：班级ID（若设备绑定的房间为功能室，则不需要传入班级ID，此时会从【1.特殊考勤课程 或 2.功能室课程】中查询班级ID）</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"请求成功！","data":{"totalCount":1,"videoList":[{...},{...}]}}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"未找到该班级信息！","data":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的课程信息</summary>
			<br/>
			<span>URL：</span><a href="/app/CourseArrange/getCourse?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/CourseArrange/getCourse?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>				
			<br/>
			<span>URL：</span><a href="/app/CourseArrange/getCourse?termCode=000002">http://10.10.8.136:9005/app/CourseArrange/getCourse?termCode=000002</a>		
			<p>
			<span>termCode：设备终端号</span>
			<br/>
	 		<span>classId：班级ID（若设备绑定的房间为功能室，则不需要传入班级ID，此时会从【功能室课程】中查询班级ID）</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"查询班级课表成功","list":[{...},{...}]}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"查询班级课表无信息！","list":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌的当天课程信息</summary>
			<br/>
			<span>URL：</span><a href="/app/CourseArrange/getDayCourse?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/CourseArrange/getDayCourse?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>				
			<p>
			<span>termCode：设备终端号</span>
			<br/>
	 		<span>classId：班级ID</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"查询班级课表成功","dayFoWeek":"2","jcList":[{...},{...}]}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"查询班级课表无信息！","dayFoWeek":null,"jcList":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
	
	<section style="padding: 10px;background:#ffeaea">	
		<details>
			<summary style="color:#00BCD4;font-size:20px;font-weight:bold;">获取当前课牌最近的课程信息（前两节课）</summary>
			<br/>
			<span>URL：</span><a href="/app/CourseArrange/getNowCourse?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd">http://10.10.8.136:9005/app/CourseArrange/getNowCourse?termCode=000001&classId=120b4049-78a0-41e4-a2ef-0c26fd3972cd</a>				
			<br/>
			<span>URL：</span><a href="/app/CourseArrange/getNowCourse?termCode=000002">http://10.10.8.136:9005/app/CourseArrange/getNowCourse?termCode=000002</a>		
			<p>
			<span>termCode：设备终端号</span>
			<br/>
	 		<span>classId：班级ID（若设备绑定的房间为功能室，则不需要传入班级ID，此时会从【功能室课程】中查询课程信息）</span>
	 		</p>
			<h3>返回成功</h3> 
			<span style="color:green">
			{"message":true,"messageInfo":"查询班级课表成功","dayFoWeek":"2","jcList":[{...},{...}]}
			</span>
			<h3>返回失败</h3>
			<span style="color:#ff5e00">
			{"message":false,"messageInfo":"查询班级课表无信息！","dayFoWeek":null,"jcList":null}
			</span>
			<h3>请求错误</h3>
			<span style="color:red">{"success": false,"obj":"请求失败，请重试或联系管理员！"}</span>
		</details>
	</section>
	<br/>
</body>
</html>
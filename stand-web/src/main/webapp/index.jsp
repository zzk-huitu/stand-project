<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}"></c:set>

<!DOCTYPE HTML>
<html>
<head>

    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta name="renderer" content="webkit">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">

    <link rel="shortcut icon" href="${contextPath}/static/core/resources/images/favicon.ico" type="image/x-icon">
    
    <title>智慧校园系统</title>

    <script id="microloader" data-app="5e27cc87-c576-447f-8977-0a13139e8872" type="text/javascript" src="${contextPath}/static/core/bootstrap.js"></script>
</head>
<body>

<link rel="stylesheet" type="text/css" href="${contextPath}/static/core/resources/css/icon.css" />
<link rel="stylesheet" type="text/css"	href="${contextPath}/static/core/resources/examples/shared/example.css" />

<script type="text/javascript" src="${contextPath}/static/core/resources/js/jquery-1.8.3.js"></script>
<script type="text/javascript" src="${contextPath}/static/core/resources/js/layer/layer.js"></script>


</body>

<script type="text/javascript" >

    //延迟显示加载层，若不延迟，出现的位置有误，不在正中间
    setTimeout(function(){    
        layer.load(0);
    },200);
    

    window.onload=function(){
     

        var isLogin="${SESSION_SYS_USER.userName}"; 
        if(!isLogin){
            document.location.href ="${contextPath}/login.jsp";
        }


        var ExtCommLoad=function(){  

            var isLoad;
            if(typeof(comm) == 'undefined'){      // Ext namespace won't be defined yet...
                isLoad=null; 
            }else{
                isLoad = comm; 
            }
        
            if(!isLoad){            
                setTimeout(ExtCommLoad,100);
            }else{
                /*在这里把comm数据写入*/
                //console.log(comm);                    
                <!--加载分辨率大小-->
                var clientWidth = document.body.clientWidth;
                var clientHeight = document.body.clientHeight;
                var screenWidth = document.body.scrollWidth;
                var screenHeight = document.body.scrollHeight;
                var resolutionHeight = window.screen.height;
                var resolutionWidth = window.screen.width;
                comm.add("clientWidth", clientWidth);
                comm.add("clientHeight", clientHeight);
                comm.add("screenWidth", screenWidth);
                comm.add("screenHeight", screenHeight);
                comm.add("resolutionWidth", resolutionWidth);
                comm.add("resolutionHeight", resolutionHeight);

                comm.add("userName","${SESSION_SYS_USER.userName}");
                comm.add("xm","${SESSION_SYS_USER.xm}");
                comm.add("globalRoleId","${SESSION_SYS_USER.sysRoles}");
                comm.add("isAdmin","${SESSION_SYS_ISADMIN}");   //1为超级管理员
                comm.add("userBtn","${SESSION_SYS_BTN}");   //模块界面的按钮
                
                comm.add("studyYear","${SESSION_SYS_USER.studyYear}");
                comm.add("semester","${SESSION_SYS_USER.semester}");
                comm.add("studyYeahname","${SESSION_SYS_USER.studyYearname}");   

                comm.add("virtualFileUrl","${SESSION_SYS_VFU}");   //虚拟文件夹目录

                //延迟关闭
                setTimeout(function(){
                    layer.closeAll('loading');
                }, 800);                
            }
        }
        ExtCommLoad();


    }
        
   


    //延迟加载这些js
    // Add a script element as a child of the body
    function downloadJSAtOnload() {
        setTimeout(function(){

            var element1 = document.createElement("script");
            element1.src = "${contextPath}/static/core/resources/js/swfupload/swfupload.js";
            document.body.appendChild(element1);


            var element2 = document.createElement("script");
            element2.src = "${contextPath}/ueditor/ueditor.config.js";
            document.body.appendChild(element2);

            var element3 = document.createElement("script");
            element3.src = "${contextPath}/ueditor/ueditor.all.min.js";
            document.body.appendChild(element3);

            var element4 = document.createElement("script");
            element4.src = "${contextPath}/ueditor/ueditor.parse.min.js";
            document.body.appendChild(element4);
    

            var element6 = document.createElement("link");
            element6.rel = "stylesheet";
            element6.type = "text/css";
            element6.href = "${contextPath}/static/core/app/ux/uploadPanel/UploadPanel.css";
            document.body.appendChild(element6);

        },1500);    
     }

     // Check for browser support of event handling capability
     if (window.addEventListener)
        window.addEventListener("load", downloadJSAtOnload, false);
     else if (window.attachEvent)
        window.attachEvent("onload", downloadJSAtOnload);
     else window.onload = downloadJSAtOnload;


   
</script>
    
</html>

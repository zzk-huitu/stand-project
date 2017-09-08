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
                
                //延迟关闭
                setTimeout(function(){
                    layer.closeAll('loading');
                }, 800);                
            }
        }
        ExtCommLoad();
    }
        
   
   
</script>
    
</html>

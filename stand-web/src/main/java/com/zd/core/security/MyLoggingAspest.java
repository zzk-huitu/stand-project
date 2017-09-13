package com.zd.core.security;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.zd.core.constant.Constant;
import com.zd.school.plartform.system.model.SysUser;

@Component
@Aspect
public class MyLoggingAspest {
	private static Logger logger = Logger.getLogger(MyLoggingAspest.class);
	
	@Pointcut("execution(* *..service..*.do*(..))")  
    public void pointService(){} 
	
	//@Pointcut("execution(* *..controller..*.do*(..))")  
    //public void pointController(){}  
	 
	@Around("pointService()")
	public Object aroundMethod(ProceedingJoinPoint pjd){
		Object result=null;
		String methodName=pjd.getSignature().getName();
	
		try{
			HttpServletRequest request = this.getHttpServletRequest();
			SysUser sysUser = (SysUser)request.getSession().getAttribute(Constant.SESSION_SYS_USER);
			String userName="未知用户";	//当接口不需要登录时，就直接使用这个名称。
			if(sysUser!=null)
				userName=sysUser.getUserName();
			
			//前置
			logger.info("【请求开始】用户名："+userName+"；用户IP："+this.getIpAddress(request)+"；方法名："+methodName+"；参数："+Arrays.toString(pjd.getArgs()));
	
			result=pjd.proceed();
			
			logger.info("【请求成功】返回值："+result);
			
		}catch(Throwable e){
			logger.error("【请求失败】异常原因："+e.getMessage());
			throw new RuntimeException(e);
		}
		//后置
		logger.info("【请求结束】");
		return result;
	}
	
	/** 
     * 获取request 
     * @return 
     */  
    protected HttpServletRequest getHttpServletRequest(){  
        return ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();  
    }  
    
    /**
     * 获取用户的ip
     * @param request
     * @return
     */
    public String getIpAddress(HttpServletRequest request) {  
        String ip = request.getHeader("x-forwarded-for");  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("WL-Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("HTTP_CLIENT_IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getRemoteAddr();  
        }  
        return ip;  
    }  
	
}

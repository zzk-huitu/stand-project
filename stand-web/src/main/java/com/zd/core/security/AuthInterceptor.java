package com.zd.core.security;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.zd.core.annotation.Auth;
import com.zd.core.constant.Constant;
import com.zd.core.util.ModelUtil;
import com.zd.school.plartform.system.service.SysUserService;

@Component
public class AuthInterceptor  extends HandlerInterceptorAdapter {
    
	@Resource
    private SysUserService sysUserService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		// TODO Auto-generated method stub
		if(handler instanceof HandlerMethod){
			Auth auth=((HandlerMethod)handler).getMethod().getAnnotation(Auth.class);
			
			//若标注了此权限，就验证
			if(auth!=null){
				//System.out.println(auth.value());
				
				//若此权限值不为空，就验证
				if(!"".equals(auth.value())){
					HttpSession session = request.getSession();
					
					//当为超级管理员的时候，直接跳过验证
					if("1".equals(String.valueOf(session.getAttribute(Constant.SESSION_SYS_ISADMIN)))){
						return true;
					}
					
					//取出此人的权限数据，进行判断
					Set<String> auths=(Set<String>)session.getAttribute(Constant.SESSION_SYS_AUTH);
					//验证失败，就跳出相应提示
					if(auths==null||!auths.contains(auth.value())){
						boolean ajax = "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
						if (ajax == true) {			
							writeJSON(response, "{ \"success\": false, \"obj\" :\"对不起，您没有此权限!\" }");
						} else {
							response.sendRedirect("/noAuth.jsp");
						}
						return false;
					}				
				}		
			}
		}
		return true;
	}
	
	private void writeJSON(HttpServletResponse response, String contents) throws IOException {
		if (ModelUtil.isNotNull(response)) {
			response.setContentType("text/html;charset=UTF-8;");
			Writer writer = null;
			try {
				response.setCharacterEncoding("UTF-8");
				writer = response.getWriter();
				writer.write(contents);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} finally {
				try {
					writer.flush();
					writer.close();
					response.flushBuffer();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
}

package com.zd.core.security;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.PassThruAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;

import com.zd.core.constant.AdminType;
import com.zd.core.constant.Constant;
import com.zd.core.util.ModelUtil;
import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysRoleService;
import com.zd.school.plartform.system.service.SysUserService;

public class AjaxRequestAuthorizationFilter extends PassThruAuthenticationFilter {
	// TODO - complete JavaDoc
	
	@Resource  
	private RedisTemplate<String, Object> redisTemplate;  	  
	
	@Resource
	private SysUserService sysUserService;
	
	@Resource
	private SysRoleService roleService; // 角色数据服务接口
	
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
		if (isLoginRequest(request, response)) {
			return true;
		} else {

			HttpServletRequest httpRequest = (HttpServletRequest) request;
			HttpServletResponse httpResponse = (HttpServletResponse) response;

			boolean ajax = "XMLHttpRequest".equals(httpRequest.getHeader("X-Requested-With"));

			if (ajax == true) {
				//Subject subject = getSubject(request, response);
				//subject.logout(); 未完成：应该不需要
				writeJSON(httpResponse, "{ \"success\": false, \"obj\" :\"您已登录超时,请重新登录!\" }");

			} else {
				saveRequestAndRedirectToLogin(request, response);
			}

			return false;
		}
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

	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
		Subject subject = getSubject(request, response);
		Session session = subject.getSession(false);
		
		/*session的这个user实体的uuid总是变化，原因不明，所以强行在这里设置回去*/
//		SysUser sysUser = null;
//		if(session!=null){
//			sysUser = (SysUser) session.getAttribute(Constant.SESSION_SYS_USER);
//			if (sysUser != null && !sysUser.getUuid().equals(subject.getPrincipal().toString())) {
//				System.out.println("*****************************");
//				sysUser.setUuid(subject.getPrincipal().toString());
//			}
//		}	
		
		//更新redis数据
		if(subject.isAuthenticated()==true){
			//如果此用户是超级管理员，就不用获取功能权限列表,在过滤器和前端中直接跳过鉴权
			//SysRole adminRole=roleService.get("8a8a8834533a0f8a01533a0f8e220000");
			
		
			//每次读取数据库
			//SysUser sysUser = sysUserService.get(String.valueOf(subject.getPrincipal()));	
			//String roleKeys = sysUser.getSysRoles().stream().filter(x -> x.getIsDelete() == 0).map(x -> x.getRoleCode())
			//		.collect(Collectors.joining(","));
			
			/*
			boolean isAdmin=false;
			Iterator<SysRole> iterator=sysUser.getSysRoles().iterator();
			while(iterator.hasNext()){
				if(iterator.next().getUuid().equals(AdminType.ADMIN_ROLE_ID)){
					isAdmin=true;
					break;
				}
			}*/		
			SysUser sysUser = (SysUser) session.getAttribute(Constant.SESSION_SYS_USER);
			String roleKeys = (String) session.getAttribute(Constant.SESSION_ROLE_KEY);
			if(roleKeys.indexOf(AdminType.ADMIN_ROLE_NAME)==-1){			
				HashMap<String,Set<String>> userRMP_Map = sysUserService.getUserRoleMenuPermission(sysUser,session);	
				//返回null，表示redis没有改变数据，所以不用更新session。若session为空，则在上面的方法中会进行判断和设置。
				if(userRMP_Map!=null){
					session.setAttribute(Constant.SESSION_SYS_AUTH,userRMP_Map.get("auth") );	
					session.setAttribute(Constant.SESSION_SYS_BTN,userRMP_Map.get("btn") );	
				}
				session.setAttribute(Constant.SESSION_SYS_ISADMIN,0);
				
				//学校管理员，理应可以查看所有数据
				if(roleKeys.indexOf(AdminType.SCHOOLADMIN_ROLE_NAME) != -1)
					session.setAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN, 1);
				else
					session.setAttribute(Constant.SESSION_SYS_ISSCHOOLADMIN, 0);
				
			}else{
				session.setAttribute(Constant.SESSION_SYS_ISADMIN,1);
			}
		}
		
		return subject.isAuthenticated();
	}
	
}

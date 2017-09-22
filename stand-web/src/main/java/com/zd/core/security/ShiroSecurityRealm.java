package com.zd.core.security;

import javax.annotation.Resource;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.Sha256CredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.stereotype.Component;

import com.zd.school.plartform.system.model.SysRole;
import com.zd.school.plartform.system.model.SysUser;
import com.zd.school.plartform.system.service.SysUserService;

@Component
public class ShiroSecurityRealm extends AuthorizingRealm {

    @Resource
	private SysUserService sysUserService;;

    @SuppressWarnings("deprecation")
    public ShiroSecurityRealm() {
        setName("ShiroSecurityRealm"); // This name must match the name in the
                                       // SysUser class's getPrincipals() method
        setCredentialsMatcher(new Sha256CredentialsMatcher());
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken)
            throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
        SysUser user = sysUserService.getByProerties("userName", token.getUsername());
        if (user != null) {
            return new SimpleAuthenticationInfo(user.getUuid(), user.getUserPwd(), getName());
        } else {
            //return null;
            throw new AuthenticationException();	//此处表明验证失败，抛出异常，捕获异常处在login的下面代码。
        }
    }
    
    
    //此处代码进行鉴权时，才会使用，在本项目中，没有实际作用
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        Long userId = (Long) principals.fromRealm(getName()).iterator().next();
        SysUser user = sysUserService.get(userId);
        if (user != null) {
            SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
            for (SysRole role : user.getSysRoles()) {
                info.addRole(role.getRoleCode());
                // info.addStringPermissions(role.getRolePerimissions());
            }
            return info;
        } else {
            return null;
        }
    }

}
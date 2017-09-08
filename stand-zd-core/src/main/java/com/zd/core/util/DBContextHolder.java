package com.zd.core.util;

import org.springframework.stereotype.Component;

/**
 * 
 * DataSource操作类（设置DataSource）
 * @author huangzc
 *
 */
@Component
public class DBContextHolder{
	 	public static final String DATA_SOURCE_Q1 = "dataSourceQ1";
	    public static final String DATA_SOURCE_Up6 = "dataSourceUP6";
	    
	    private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>();  
	      
	    public static void setDBType(String dbType) {  
	        contextHolder.set(dbType);  
	    }  
	      
	    public static String getDBType() {  
	        return contextHolder.get();  
	    }  
	      
	    public static void clearDBType() {  
	        contextHolder.remove();  
	    }

}

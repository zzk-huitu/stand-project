package com.zd.core.util;

import java.io.File;
import java.util.HashMap;

import com.google.gson.Gson;
import com.qiniu.common.QiniuException;
import com.qiniu.common.Zone;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.storage.model.DefaultPutRet;
import com.qiniu.util.Auth;
import com.qiniu.util.StringMap;

public class qiniuUtils {
	
	private static String accessKey = "SA5giUlvbAwPRlpezVfJYxL-vvGU-nU9hrmxqGyu";  
	private static String secretKey = "VOfHGJ4KxVtBxUklpt6YRB42O0EIpyd7EMzgI29j";  
	private static String bucket = "zzk-test";  
	/** 
	 * 获取上传凭证 
	 */  
	public static String getUploadCredential() {  
	    Auth auth = Auth.create(accessKey, secretKey); 
	    
	    //定义上传凭证
	    StringMap putPolicy = new StringMap();
	    putPolicy.put("callbackUrl", "http://10.10.8.136:9005/login/testQiniuBack");
	    putPolicy.put("callbackBody", "{\"key\":\"$(key)\",\"hash\":\"$(etag)\",\"bucket\":\"$(bucket)\",\"fsize\":$(fsize),\"user\":\"$(x:user)\",\"age\",$(x:age)}");
	    putPolicy.put("callbackBodyType", "application/json");
	    long expireSeconds = 3600;
	    String upToken = auth.uploadToken(bucket, null, expireSeconds, putPolicy);
	    System.out.println(upToken);  
	    return upToken;  
	}  
	  
	  
	/** 
	 * 文件上传 
	 * @param zone  
	 *    华东    Zone.zone0() 
	 *    华北    Zone.zone1() 
	 *    华南    Zone.zone2() 
	 *    北美    Zone.zoneNa0() 
	 * @param upToken 上传凭证 
	 * @param localFilePath 需要上传的文件本地路径 
	 * @return 
	 */  
	public static DefaultPutRet fileUpload(Zone zone,String upToken,String localFilePath) {  
	    // 构造一个带指定Zone对象的配置类  
	    Configuration cfg = new Configuration(zone); 
	    // ...其他参数参考类注释  
	    UploadManager uploadManager = new UploadManager(cfg);  
	    // 默认不指定key的情况下，以文件内容的hash值作为文件名  
	    String key = null;  
	    try {  
	    	//传入参数的方式
	    	StringMap params=new StringMap();
	    	params.put("x:user", "zzk");
	    	params.put("x:age", 12);
	    	
	    	File f=new File(localFilePath);
	        Response response = uploadManager.put(f, key, upToken,params, null, false);  
	        //Response response = uploadManager.put(localFilePath, key, upToken); 
	        // 解析上传成功的结果  
	        DefaultPutRet putRet = new Gson().fromJson(response.bodyString(), DefaultPutRet.class);
	        
	        //将结果json字符串转为hashmap或实体类
	        HashMap<String,Object> map=response.jsonToObject(HashMap.class);
	        
	        System.out.println(response.bodyString());
	        System.out.println(putRet.key);  
	        System.out.println(putRet.hash);  
	        return putRet;  
	    } catch (QiniuException ex) {  
	        Response r = ex.response;  
	        System.err.println(r.toString());  
	        try {  
	            System.err.println(r.bodyString());  
	        } catch (QiniuException ex2) {  
	            // ignore  
	        }  
	    }  
	    return null;  
	}  
	
	// @Test
	// public void test() {
	// fileUpload(Zone.zone2(),getUploadCredential(),"I:\\develop\\搭建环境相关\\七牛.txt");
	// }
}		

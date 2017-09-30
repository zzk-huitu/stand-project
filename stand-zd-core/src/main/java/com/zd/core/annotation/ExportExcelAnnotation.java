package com.zd.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface ExportExcelAnnotation {
	
	/*
	 * 列宽
	 */
	public int columnWidth() default 0;
	
	/*
	 * 列名
	 */
	public String columnName() default "";
	
	/*
	 * 字段顺序
	 */
	public int order() default 0;
	
}

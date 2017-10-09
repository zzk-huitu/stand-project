package com.zd.core.util;

import java.io.Closeable;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zd.core.annotation.ExportExcelAnnotation;
import com.zd.core.model.BaseEntity;
import com.zd.core.service.BaseService;

public class ExportExcelAnnoUtil implements Closeable {
	
	private static final Logger LOG = LoggerFactory.getLogger(ExportExcelAnnoUtil.class);
	
	/*
	 * 获取表头信息
	 */
	public static Map<Integer, String> getHeadMap(Class<?> clazz){
		
		//声明返回值变量
		Map<Integer, String> headMap = new HashMap<>();
		
		//获取类中声明的变量
		Field[] fields = clazz.getDeclaredFields();
		
		//遍历实体类的字段
		for(Field field :fields){
			 if(field.isAnnotationPresent(ExportExcelAnnotation.class)){
				 ExportExcelAnnotation exportExcelAnnotation = (ExportExcelAnnotation) field.getAnnotation(ExportExcelAnnotation.class);
				 headMap.put(exportExcelAnnotation.order(), exportExcelAnnotation.columnName());
			 }
		
		}
		
		 return  headMap;
	}
	
	/*
	 * 获取列宽信息
	 */
	public static Map<Integer, Integer> getWidthMap(Class<?> clazz){
		
		//声明返回值变量
		Map<Integer, Integer> widthMap = new HashMap<>();
		
		//获取类中声明的变量
		Field[] fields = clazz.getDeclaredFields();
		
		 for(Field field :fields){
			 if(field.isAnnotationPresent(ExportExcelAnnotation.class)){
				 ExportExcelAnnotation exportExcelAnnotation = (ExportExcelAnnotation) field.getAnnotation(ExportExcelAnnotation.class);
				 widthMap.put(exportExcelAnnotation.order(), exportExcelAnnotation.columnWidth());
			 }
		
		 }
		 
		 return  widthMap;
	}
	
	/*
	 * 导出列表
	 * @param Map<Integer, String> headMap 表头信息 存储<字段先后顺序,列名>
	 * @param Map<Integer, Integer> widthMap 列宽信息 存储<字段先后顺序,列宽>
	 * @param Map<Integer, String> codeMap 表头信息 存储<字段先后顺序,字典编码>
	 * @param list 数据列表
     * @param <T>  泛型
     * @return 写入结果
	 */
	public static <T> boolean exportExcel(HttpServletResponse response,String fileName ,Map<Integer, String> headMap ,
			Map<Integer, Integer> widthMap ,List<T> list) throws IOException {
		
		HSSFWorkbook workbook = new HSSFWorkbook();
	    boolean result = false;
	    OutputStream fileOutputStream = null;
	    response.reset();// 清空输出流
		response.setHeader("Content-disposition","attachment; filename=" + new String((fileName + ".xls").getBytes("GB2312"), "ISO8859-1"));
		response.setContentType("application/msexcel");
		
	    if (null != list && !list.isEmpty()) {
            T test = list.get(0);
            Map<String, Field> fieldMap = new HashMap<String, Field>();
            Field[] fields = test.getClass().getDeclaredFields();
            for (Field field : fields) {
                if (field.isAnnotationPresent(ExportExcelAnnotation.class)) {
                	ExportExcelAnnotation mapperCell = field.getAnnotation(ExportExcelAnnotation.class);
                    fieldMap.put(mapperCell.columnName(), field);
                }
            }
	    
	    try {
			Sheet sheet = workbook.createSheet(fileName);

			//处理标题栏数据
			Collection<String> values = headMap.values();
			String[] s = new String[values.size()];
			values.toArray(s);
			
			Collection<Integer> valuesWidth = widthMap.values();
            Integer[] w = new Integer[valuesWidth.size()];
            valuesWidth.toArray(w);
            
			// 生成标题行
			Row titleRow = sheet.createRow(0);
			for (int i = 0; i < s.length; i++) {
			    Cell cell = titleRow.createCell(i);
			    cell.setCellValue(s[i]);
			    //标题居中
                cell.getCellStyle().setAlignment(HorizontalAlignment.CENTER);
                //指定列的宽度
                sheet.setColumnWidth(i, w[i] * 256);
			}
			
			// 生成数据行
			for (int i = 0, length = list.size(); i < length; i++) {
			    Row row = sheet.createRow(i + 1);
			    for (int j = 0; j < s.length; j++) {
                    Cell cell = row.createCell(j);
                    for (Map.Entry<String, Field> data : fieldMap.entrySet()) {
                        if (data.getKey().equals(s[j])) {
                            Field field = data.getValue();
                            field.setAccessible(true);
                            cell.setCellValue(field.get(list.get(i)) != null ? field.get(list.get(i)).toString() : "");
                            break;
                        }
                    }
                }
			}
			 fileOutputStream = response.getOutputStream();
             workbook.write(fileOutputStream);
			}catch (IOException e) {
                LOG.error("流异常", e);
            } catch (IllegalAccessException e) {
                LOG.error("反射异常", e);
            } catch (Exception e) {
                LOG.error("其他异常", e);
            } finally {
                if (null != fileOutputStream) {
                    try {
                        fileOutputStream.close();
                    } catch (IOException e) {
                        LOG.error("关闭流异常", e);
                    }
                }
            }
	    result = true;
	   } 
	    return result;
	}

	@Override
	public void close() throws IOException {
	}
	
	
}

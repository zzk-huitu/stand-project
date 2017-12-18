package com.zd.core.util;

import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PoiExportExcel {

	/**
	 * 导出EXCEL文件（单个sheet，可以多个表格）
	 * @param response	
	 * @param fileName	文件名称
	 * @param sheetTitle  sheet中的大标题（第一行）
	 * @param listContent	sheet中的数据集（list中每个map数据中，存放一个表格的数据；在每个map中又细分为多个不同的Object数据）
	 *  如：（详见导出班级代码）
	 *  List<Map<String, Object>> listContent = new ArrayList<>();	//数据集
	 *  
	 *  Map<String, Object> roomAllMap = new LinkedHashMap<>();		//一个map中，代表一个表格
		roomAllMap.put("data", roomList);				//此表格中的具体遍历数据
		roomAllMap.put("title", "班级学员宿舍信息表");		//表格标题，若为null，且数据集中存在其他map，则下一个map不会空出3行（空出3行，用于划分各个表格）。
		roomAllMap.put("head", new String[] { "姓名", "性别", "是否午休", "是否晚宿" }); 	//若存在名字相同的，则名字相同且相邻的head合并（当head名字相同，并且某行中的对应的列值也相同，则合并它们）
		roomAllMap.put("columnWidth",  new Integer[] { 15, 15, 15, 20 }); // 20代表20个字节，10个字符（整个sheet中，只能存在一个columnWidth,因为列宽是针对整个sheet的）
		roomAllMap.put("columnAlignment", new Integer[] { 0, 0, 0, 0 }); // 0代表居中，1代表居左，2代表居右
		roomAllMap.put("mergeCondition", null); // 跨行合行列需要的条件，条件优先级按顺序决定，NULL表示不合并,空数组表示无条件
	 	listContent.add(roomAllMap);	//加入此map到数据集中
	 * 
	 * @return
	 * @throws IOException
	 */
	public final static boolean exportExcel(HttpServletResponse response, String fileName, String sheetTitle,List<Map<String, Object>> listContent) throws IOException {
		HSSFWorkbook workbook = new HSSFWorkbook();
		boolean result = false;
		OutputStream fileOutputStream = null;
		response.reset();// 清空输出流
		response.setHeader("Content-disposition","attachment; filename=" + new String((fileName + ".xls").getBytes("GB2312"), "ISO8859-1"));
		response.setContentType("application/msexcel");

		if (null != listContent && !listContent.isEmpty()) {

			try {
				Sheet sheet = workbook.createSheet(fileName);
				
				//创建基本的样式
				CellStyle titleStyle = getCellStyle(workbook, "", (short) 26, true, HorizontalAlignment.CENTER,VerticalAlignment.CENTER,true);
				CellStyle headStyle = getCellStyle(workbook, "", (short) 11, true, HorizontalAlignment.CENTER,VerticalAlignment.CENTER,true);
				CellStyle textStyleCenter = getCellStyle(workbook, "", (short) 11, false, HorizontalAlignment.CENTER,VerticalAlignment.CENTER,true);
				CellStyle textStyleLeft = getCellStyle(workbook, "", (short) 11, false, HorizontalAlignment.LEFT,VerticalAlignment.CENTER,true);
				CellStyle textStyleRight = getCellStyle(workbook, "", (short) 11, false, HorizontalAlignment.RIGHT,VerticalAlignment.CENTER,true);
				
				int rowNum = 0; //初始化第一行为0开始计数
				int colCount = ((String[]) listContent.get(0).get("head")).length;//表头的列数
				
				// 第一行先创建一个大标题(当不为null的时候，设置这一行)
				if (sheetTitle != null) {
					Row sheetTitleRow = sheet.createRow(rowNum); //创建标题行
					sheetTitleRow.setHeight((short) 0x300); //设置行高
					Cell sheetTitleCell = sheetTitleRow.createCell(0); //创建第一个单元格
					sheetTitleCell.setCellStyle(titleStyle); //设置标题的样式
					sheetTitleCell.setCellValue(sheetTitle); //给标题格设定值
					sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, colCount - 1)); //合并单元格(起始行，结束行，起始列，结束列)
					rowNum++;
				}

				//处理数据
				for (Map<String, Object> dataList : listContent) {
					
					// 获取数据
					List<Map<String, String>> currentData = (List<Map<String, String>>) dataList.get("data");
					String title = (String) dataList.get("title");
					String[] headArray = (String[]) dataList.get("head");
					Integer[] columnWidthArray = (Integer[]) dataList.get("columnWidth");
					Integer[] columnWidthAlignment = (Integer[]) dataList.get("columnAlignment");
					String[] columnMergeCondition = (String[]) dataList.get("mergeCondition");

					// 设置标题栏内容(当不为null的时候，设置这一行)
					if (title != null) {
						if (rowNum > 1){ // 除了第一个表格的时候，后续表格和之前表格空三行
							rowNum += 3; 
						}
						Row titleRow = sheet.createRow(rowNum); //标题行
						titleRow.setHeight((short) 0x248); //标题行高
						
						for (int i = 0; i < headArray.length; i++) {
							Cell titleCell = titleRow.createCell(i);
							titleCell.setCellStyle(headStyle);
							titleCell.setCellValue(title);
						}
						sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, headArray.length - 1));
						rowNum++;
					}

					// 设置表头内容
					Row headRow = sheet.createRow(rowNum); //表头行
					headRow.setHeight((short) 0x200); //表头行高
					Object[] headMergeObj = null; // （因为2个行或列合并了之后，就必须要先移除合并，才能重新合并更多的行）
					for (int i = 0; i < headArray.length; i++) {
						Cell cell = headRow.createCell(i);
						cell.setCellValue(headArray[i]);
						cell.setCellStyle(headStyle);
						sheet.setColumnWidth(i, columnWidthArray[i] * 256);

						// 如果当前列名和上一列的名字一致，则合并
						if (i > 0 && headArray[i - 1].equals(headArray[i])) {
							if (headMergeObj == null) {
								int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, i - 1, i));
								headMergeObj = new Object[] { index, headArray[i], i - 1 }; //合并的index值，表头值，行号。。
							} else {
								if (headMergeObj[1].equals(headArray[i])) {
									sheet.removeMergedRegion((int) headMergeObj[0]);
									int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, (int) headMergeObj[2], i));
									headMergeObj[0] = index;
								} else {
									int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, i - 1, i));
									headMergeObj = new Object[] { index, headArray[i], i - 1 }; // 合并的index值，表头值，行号。
								}
							}
						}

					}
					rowNum++;

					// 保存上一个map
					Map<String, String> preMap = null;
					// 保存某一列上一个合并的数据，并用来判断是否再合并（因为2个列合并了之后，就必须要先移除合并，才能合并）
					Map<Integer, Object[]> recordMap = new HashMap<>();
					// 保存某一行的上一个合并的数据，并用来判断是否再合并
					Object[] rowMergeObj = null;
					for (int i = 0; i < currentData.size(); i++) {
						Row textRow = sheet.createRow(rowNum);
						Map<String, String> map = currentData.get(i);

						int j = 0, maxTextHeight = (short) 0X250; // 默认行高，可以放2行数据
						String preVal = null; // 保存某一行中，上一列的值
						for (String s : map.keySet()) {
							Object val = map.get(s);
							if (val == null){
								val = "";
							}

							Cell cell = textRow.createCell(j);
							cell.setCellValue(String.valueOf(val));

							if (columnWidthAlignment[j] == 0) {
								cell.setCellStyle(textStyleCenter);
							} else if (columnWidthAlignment[j] == 1) {
								cell.setCellStyle(textStyleLeft);
							} else if (columnWidthAlignment[j] == 2) {
								cell.setCellStyle(textStyleRight);
							} else {
								cell.setCellStyle(textStyleCenter);
							}

							// 计算最大的高度值
							int len = String.valueOf(val).getBytes().length;
							if (len > columnWidthArray[j] + 1) {
								int tempHeight = (len / (columnWidthArray[j] - 1) + 1) * 0X125; // 加入了边框，所以一行放入的字节数会少一个
								if (tempHeight > maxTextHeight)
									maxTextHeight = tempHeight;
							}

							// 判断是否需要进行列合并
							// 如果当前列名和上一列的名字一致，并且行的值也一致，则合并
							if (j > 0 && headArray[j - 1].equals(headArray[j]) && preVal != null&& preVal.equals(val)) {
								if (rowMergeObj == null) {
									int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, j - 1, j));
									rowMergeObj = new Object[] { index, headArray[j - 1], preVal, i, j - 1 }; // 合并的index值，表头值，数据值，行号,列号。
								} else {
									// 当上一个合并的数据值、表头值、行号 与
									// 当前处理的单元格的数据一致时，才继续合并，否则单独合并两列
									if (rowMergeObj[2].equals(val) && rowMergeObj[1].equals(headArray[j])
											&& i == (int) rowMergeObj[3]) {
										sheet.removeMergedRegion((int) rowMergeObj[0]);
										int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, (int) rowMergeObj[4], j));
										rowMergeObj[0] = index;
									} else {
										int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, j - 1, j));
										rowMergeObj = new Object[] { index, headArray[j - 1], preVal, i, j - 1 }; // 合并的index值，表头值，数据值，行号,列号。
									}
								}
							}

							// 判断是否需要进行行合并
							if (i > 0 && preMap.get(s) != null && !preMap.get(s).equals("") && preMap.get(s).equals(val)
									&& columnMergeCondition != null) { // 当前后的值都一致，才能满足最基本的合并条件

								boolean isMerge = true;
								String tempStr = "";
								// 当需要合并的列，满足必要的合并条件后，才允许合并
								for (int k = 0; k < columnMergeCondition.length; k++) {
									tempStr = columnMergeCondition[k];

									// 当前判断的列为条件中的列时，可以直接合并（因为列是有顺序的，所以当判断到当前列的时候，表明前面的列条件都判断完毕）
									if (s.equals(tempStr)) {
										isMerge = true;
										break;
									} else if (!preMap.get(tempStr).equals(map.get(tempStr))) { // 当其中一个条件不满足，则不允许合并
										isMerge = false;
										break;
									}
								}

								if (isMerge == true) {
									// 若不存在值，表明还未合并
									Object[] recordObj = recordMap.get(j);
									if (recordObj == null) {
										int index = sheet
												.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum, j, j));
										recordObj = new Object[] { index, currentData.get(i), rowNum - 1 }; // 合并的index值，MAP，行号。
										recordMap.put(j, recordObj);
									}
									// 若存在值，则判断，值是否一致，一致则合并，否则重新保存新的数据
									else {
										boolean isTempMerger = false;
										Map<String, String> tempMap = (Map) recordObj[1];
										// 当需要合并的列，满足必要的合并条件后，才允许合并
										for (int k = 0; k < columnMergeCondition.length; k++) {
											tempStr = columnMergeCondition[k];

											// 当前判断的列为条件中的列时，可以直接合并（因为列是有顺序的，所以当判断到当前列的时候，表明前面的列条件都判断完毕）
											if (s.equals(tempStr) && tempMap.get(s).equals(val)) {
												isTempMerger = true;
												break;
											} else if (!tempMap.get(tempStr).equals(map.get(tempStr))) { // 当其中一个条件不满足，则不允许合并
												isTempMerger = false;
												break;
											}
										}
										if (isTempMerger == true) {
											sheet.removeMergedRegion((int) recordObj[0]); // 先移除
											int index = sheet.addMergedRegion(new CellRangeAddress((int) recordObj[2], rowNum, j, j)); // 再合并
											recordObj[0] = index;
											recordMap.put(j, recordObj);
										} else { // 否则，重新保存此列的合并数据
											int index = sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum, j, j));
											recordObj = new Object[] { index, currentData.get(i), rowNum - 1 }; // 保存新的合并的index值，列值，行号。
											recordMap.put(j, recordObj);
										}

									}
								}
							}
							preVal = (String) val;
							j++;
						}
						
						// 设置行高
						textRow.setHeight((short) maxTextHeight);
						// 保存上一个map
						preMap = currentData.get(i);
						rowNum++;
					}

				}

				fileOutputStream = response.getOutputStream();
				workbook.write(fileOutputStream);
			} catch (IOException e) {
				System.out.println(e.getMessage());
				return false;
			} catch (Exception e) {
				System.out.println(e.getMessage());
				return false;
			} finally {
				if (null != fileOutputStream) {
					try {
						fileOutputStream.close();
					} catch (IOException e) {
						System.out.println(e.getMessage());
					}
				}
			}
			result = true;
		}
		return result;
	}

	/*
	 * 获取样式格式的方法
	 * @param workbook	Excel文件 
	 * @param fontName	字体名称
	 * @param fontSize  字体大小
	 * @param isBold    是否加粗
	 * @param horizontalAlignment (左，右，居中)对齐
	 * @param verticalAlignment (上，下，居中)对齐
	 * @param isWrapText 是否换行
	 * 
	 */
    public static CellStyle getCellStyle(HSSFWorkbook workbook, String fontName, Short fontSize, Boolean isBold, HorizontalAlignment horizontalAlignment, VerticalAlignment verticalAlignment,Boolean isWrapText) {
        
    	HSSFFont font = workbook.createFont();
    	//默认方正黑体
        if (StringUtils.isEmpty(fontName)){
        	font.setFontName("方正黑体简体");
        }else{
        	font.setFontName(fontName);
        }
        font.setFontHeightInPoints(fontSize);// 字体大小
        font.setBold(isBold);  //是否加粗
        
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(horizontalAlignment);// 左右对齐
        style.setVerticalAlignment(verticalAlignment);// 上下对齐
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setWrapText(true);

        return style;
    }

    /*
     * 导出的数据是多个sheet表的
     */
    public final static boolean exportSheetsExcel(HttpServletResponse response, String fileName,List<String> sheetNames, String sheetTitle,List<Map<String, Object>> listContent) throws IOException {
		HSSFWorkbook workbook = new HSSFWorkbook();
		boolean result = false;
		OutputStream fileOutputStream = null;
		response.reset();// 清空输出流
		response.setHeader("Content-disposition","attachment; filename=" + new String((fileName + ".xls").getBytes("GB2312"), "ISO8859-1"));
		response.setContentType("application/msexcel");

		if (null != listContent && !listContent.isEmpty()) {

			try {		
				//创建基本的样式
				CellStyle headStyle = getCellStyle(workbook, "", (short) 11, true, HorizontalAlignment.CENTER,VerticalAlignment.CENTER,true);
				CellStyle textStyleCenter = getCellStyle(workbook, "", (short) 11, true, HorizontalAlignment.CENTER,VerticalAlignment.CENTER,true);
				CellStyle textStyleLeft = getCellStyle(workbook, "", (short) 11, true, HorizontalAlignment.LEFT,VerticalAlignment.CENTER,true);
				CellStyle textStyleRight = getCellStyle(workbook, "", (short) 11, true, HorizontalAlignment.RIGHT,VerticalAlignment.CENTER,true);
				
				int rowNum = 0; //初始化第一行为0开始计数				
				//处理数据
				for (Map<String, Object> dataList : listContent) {
					
					int sheetNumber=0;
					// 获取数据
					List<Map<String, String>> currentData = (List<Map<String, String>>) dataList.get("data");
					String title = (String) dataList.get("title");
					String[] headArray = (String[]) dataList.get("head");
					Integer[] columnWidthArray = (Integer[]) dataList.get("columnWidth");
					Integer[] columnWidthAlignment = (Integer[]) dataList.get("columnAlignment");
					String[] columnMergeCondition = (String[]) dataList.get("mergeCondition");

					Sheet sheet = workbook.createSheet(sheetNames.get(sheetNumber));
					sheetNumber++;
					
					// 设置标题栏内容(当不为null的时候，设置这一行)
					if (title != null) {
						Row titleRow = sheet.createRow(rowNum); //标题行
						titleRow.setHeight((short) 0x248); //标题行高
						for (int i = 0; i < headArray.length; i++) {
							Cell titleCell = titleRow.createCell(i);
							titleCell.setCellStyle(headStyle);
							titleCell.setCellValue(title);
						}
						sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, headArray.length - 1));
						rowNum++;
					}

					// 设置表头内容
					Row headRow = sheet.createRow(rowNum); //表头行
					headRow.setHeight((short) 0x200); //表头行高
					Object[] headMergeObj = null; // （因为2个行或列合并了之后，就必须要先移除合并，才能重新合并更多的行）
					for (int i = 0; i < headArray.length; i++) {
						Cell cell = headRow.createCell(i);
						cell.setCellValue(headArray[i]);
						cell.setCellStyle(headStyle);
						sheet.setColumnWidth(i, columnWidthArray[i] * 256);

						// 如果当前列名和上一列的名字一致，则合并
						if (i > 0 && headArray[i - 1].equals(headArray[i])) {
							if (headMergeObj == null) {
								int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, i - 1, i));
								headMergeObj = new Object[] { index, headArray[i], i - 1 }; //合并的index值，表头值，行号。。
							} else {
								if (headMergeObj[1].equals(headArray[i])) {
									sheet.removeMergedRegion((int) headMergeObj[0]);
									int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, (int) headMergeObj[2], i));
									headMergeObj[0] = index;
								} else {
									int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, i - 1, i));
									headMergeObj = new Object[] { index, headArray[i], i - 1 }; // 合并的index值，表头值，行号。
								}
							}
						}

					}
					rowNum++;

					// 保存上一个map
					Map<String, String> preMap = null;
					// 保存某一列上一个合并的数据，并用来判断是否再合并（因为2个列合并了之后，就必须要先移除合并，才能合并）
					Map<Integer, Object[]> recordMap = new HashMap<>();
					// 保存某一行的上一个合并的数据，并用来判断是否再合并
					Object[] rowMergeObj = null;
					for (int i = 0; i < currentData.size(); i++) {
						Row textRow = sheet.createRow(rowNum);
						Map<String, String> map = currentData.get(i);

						int j = 0, maxTextHeight = (short) 0X250; // 默认行高，可以放2行数据
						String preVal = null; // 保存某一行中，上一列的值
						for (String s : map.keySet()) {
							Object val = map.get(s);
							if (val == null){
								val = "";
							}

							Cell cell = textRow.createCell(j);
							cell.setCellValue(String.valueOf(val));

							if (columnWidthAlignment[j] == 0) {
								cell.setCellStyle(textStyleCenter);
							} else if (columnWidthAlignment[j] == 1) {
								cell.setCellStyle(textStyleLeft);
							} else if (columnWidthAlignment[j] == 2) {
								cell.setCellStyle(textStyleRight);
							} else {
								cell.setCellStyle(textStyleCenter);
							}

							// 计算最大的高度值
							int len = String.valueOf(val).getBytes().length;
							if (len > columnWidthArray[j] + 1) {
								int tempHeight = (len / (columnWidthArray[j] - 1) + 1) * 0X125; // 加入了边框，所以一行放入的字节数会少一个
								if (tempHeight > maxTextHeight)
									maxTextHeight = tempHeight;
							}

							// 判断是否需要进行列合并
							// 如果当前列名和上一列的名字一致，并且行的值也一致，则合并
							if (j > 0 && headArray[j - 1].equals(headArray[j]) && preVal != null&& preVal.equals(val)) {
								if (rowMergeObj == null) {
									int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, j - 1, j));
									rowMergeObj = new Object[] { index, headArray[j - 1], preVal, i, j - 1 }; // 合并的index值，表头值，数据值，行号,列号。
								} else {
									// 当上一个合并的数据值、表头值、行号 与
									// 当前处理的单元格的数据一致时，才继续合并，否则单独合并两列
									if (rowMergeObj[2].equals(val) && rowMergeObj[1].equals(headArray[j])
											&& i == (int) rowMergeObj[3]) {
										sheet.removeMergedRegion((int) rowMergeObj[0]);
										int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, (int) rowMergeObj[4], j));
										rowMergeObj[0] = index;
									} else {
										int index = sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, j - 1, j));
										rowMergeObj = new Object[] { index, headArray[j - 1], preVal, i, j - 1 }; // 合并的index值，表头值，数据值，行号,列号。
									}
								}
							}

							// 判断是否需要进行行合并
							if (i > 0 && preMap.get(s) != null && !preMap.get(s).equals("") && preMap.get(s).equals(val)
									&& columnMergeCondition != null) { // 当前后的值都一致，才能满足最基本的合并条件

								boolean isMerge = true;
								String tempStr = "";
								// 当需要合并的列，满足必要的合并条件后，才允许合并
								for (int k = 0; k < columnMergeCondition.length; k++) {
									tempStr = columnMergeCondition[k];

									// 当前判断的列为条件中的列时，可以直接合并（因为列是有顺序的，所以当判断到当前列的时候，表明前面的列条件都判断完毕）
									if (s.equals(tempStr)) {
										isMerge = true;
										break;
									} else if (!preMap.get(tempStr).equals(map.get(tempStr))) { // 当其中一个条件不满足，则不允许合并
										isMerge = false;
										break;
									}
								}

								if (isMerge == true) {
									// 若不存在值，表明还未合并
									Object[] recordObj = recordMap.get(j);
									if (recordObj == null) {
										int index = sheet
												.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum, j, j));
										recordObj = new Object[] { index, currentData.get(i), rowNum - 1 }; // 合并的index值，MAP，行号。
										recordMap.put(j, recordObj);
									}
									// 若存在值，则判断，值是否一致，一致则合并，否则重新保存新的数据
									else {
										boolean isTempMerger = false;
										Map<String, String> tempMap = (Map) recordObj[1];
										// 当需要合并的列，满足必要的合并条件后，才允许合并
										for (int k = 0; k < columnMergeCondition.length; k++) {
											tempStr = columnMergeCondition[k];

											// 当前判断的列为条件中的列时，可以直接合并（因为列是有顺序的，所以当判断到当前列的时候，表明前面的列条件都判断完毕）
											if (s.equals(tempStr) && tempMap.get(s).equals(val)) {
												isTempMerger = true;
												break;
											} else if (!tempMap.get(tempStr).equals(map.get(tempStr))) { // 当其中一个条件不满足，则不允许合并
												isTempMerger = false;
												break;
											}
										}
										if (isTempMerger == true) {
											sheet.removeMergedRegion((int) recordObj[0]); // 先移除
											int index = sheet.addMergedRegion(new CellRangeAddress((int) recordObj[2], rowNum, j, j)); // 再合并
											recordObj[0] = index;
											recordMap.put(j, recordObj);
										} else { // 否则，重新保存此列的合并数据
											int index = sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum, j, j));
											recordObj = new Object[] { index, currentData.get(i), rowNum - 1 }; // 保存新的合并的index值，列值，行号。
											recordMap.put(j, recordObj);
										}

									}
								}
							}
							preVal = (String) val;
							j++;
						}
						
						// 设置行高
						textRow.setHeight((short) maxTextHeight);
						// 保存上一个map
						preMap = currentData.get(i);
						rowNum++;
					}

				}

				fileOutputStream = response.getOutputStream();
				workbook.write(fileOutputStream);
			} catch (IOException e) {
				System.out.println(e.getMessage());
				return false;
			} catch (Exception e) {
				System.out.println(e.getMessage());
				return false;
			} finally {
				if (null != fileOutputStream) {
					try {
						fileOutputStream.close();
					} catch (IOException e) {
						System.out.println(e.getMessage());
					}
				}
			}
			result = true;
		}
		return result;
	}
    
}

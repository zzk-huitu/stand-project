package com.zd.school.ykt.model;

import com.zd.school.excel.annotation.MapperCell;

public class XfVemDetail {

	//@MapperCell(cellName = "机器号", order = 0)
	private String machineNo;
	@MapperCell(cellName = "机器名称", order = 0)
	private String termName;
	

	@MapperCell(cellName = "交易类型", order = 1)
	private String tradeType;

	@MapperCell(cellName = "交易流水", order = 2)
	private String tradeNo;

	@MapperCell(cellName = "货道号", order = 3)
	private String nodeNo;

	@MapperCell(cellName = "产品名称", order = 4)
	private String productName;

	@MapperCell(cellName = "产品价格", order = 5)
	private String productMoney;

	@MapperCell(cellName = "物理卡号", order = 6)
	private String cardSerNo;

	@MapperCell(cellName = "交易状态", order = 7)
	private String tradeStatus;

	@MapperCell(cellName = "交易时间", order = 8)
	private String createDate1;

	private String createDate;
	private String f1;
	private String f2;
	private String modifyDate;
	private String oriID1;
	private String oriID2;
	private String vemDetailID;
	

	public String getMachineNo() {
		return machineNo;
	}

	public void setMachineNo(String machineNo) {
		this.machineNo = machineNo;
	}

	public String getTradeType() {
		return tradeType;
	}

	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
	}

	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}

	public String getNodeNo() {
		return nodeNo;
	}

	public void setNodeNo(String nodeNo) {
		this.nodeNo = nodeNo;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductMoney() {
		return productMoney;
	}

	public void setProductMoney(String productMoney) {
		this.productMoney = productMoney;
	}

	public String getCardSerNo() {
		return cardSerNo;
	}

	public void setCardSerNo(String cardSerNo) {
		this.cardSerNo = cardSerNo;
	}

	public String getTradeStatus() {
		return tradeStatus;
	}

	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus;
	}

	public String getCreateDate1() {
		return createDate1;
	}

	public void setCreateDate1(String createDate1) {
		this.createDate1 = createDate1;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getF1() {
		return f1;
	}

	public void setF1(String f1) {
		this.f1 = f1;
	}

	public String getF2() {
		return f2;
	}

	public void setF2(String f2) {
		this.f2 = f2;
	}

	public String getModifyDate() {
		return modifyDate;
	}

	public void setModifyDate(String modifyDate) {
		this.modifyDate = modifyDate;
	}

	public String getOriID1() {
		return oriID1;
	}

	public void setOriID1(String oriID1) {
		this.oriID1 = oriID1;
	}

	public String getOriID2() {
		return oriID2;
	}

	public void setOriID2(String oriID2) {
		this.oriID2 = oriID2;
	}

	public String getVemDetailID() {
		return vemDetailID;
	}

	public void setVemDetailID(String vemDetailID) {
		this.vemDetailID = vemDetailID;
	}

	public String getTermName() {
		return termName;
	}

	public void setTermName(String termName) {
		this.termName = termName;
	}

}

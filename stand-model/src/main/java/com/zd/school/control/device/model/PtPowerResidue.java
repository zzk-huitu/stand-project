package com.zd.school.control.device.model;

import com.zd.core.annotation.FieldInfo;

/**
 * 电量剩余查询
 * @author hucy
 *
 */
public class PtPowerResidue {

	@FieldInfo(name = "宿舍名称")
	private String roomName;
	
	@FieldInfo(name = "电量剩余")
	private String powerResidue;
	
	@FieldInfo(name = "金额剩余")
	private String moneyResidue;
	
	private String cardResidue1;
	private String cardResidue2;
	private String cardResidue3;
	private String cardResidue4;
	private String cardResidue5;
	private String cardResidue6;
	
	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public String getPowerResidue() {
		return powerResidue;
	}

	public void setPowerResidue(String powerResidue) {
		this.powerResidue = powerResidue;
	}

	public String getMoneyResidue() {
		return moneyResidue;
	}

	public void setMoneyResidue(String moneyResidue) {
		this.moneyResidue = moneyResidue;
	}

	public String getCardResidue1() {
		return cardResidue1;
	}

	public void setCardResidue1(String cardResidue1) {
		this.cardResidue1 = cardResidue1;
	}

	public String getCardResidue2() {
		return cardResidue2;
	}

	public void setCardResidue2(String cardResidue2) {
		this.cardResidue2 = cardResidue2;
	}

	public String getCardResidue3() {
		return cardResidue3;
	}

	public void setCardResidue3(String cardResidue3) {
		this.cardResidue3 = cardResidue3;
	}

	public String getCardResidue4() {
		return cardResidue4;
	}

	public void setCardResidue4(String cardResidue4) {
		this.cardResidue4 = cardResidue4;
	}

	public String getCardResidue5() {
		return cardResidue5;
	}

	public void setCardResidue5(String cardResidue5) {
		this.cardResidue5 = cardResidue5;
	}

	public String getCardResidue6() {
		return cardResidue6;
	}

	public void setCardResidue6(String cardResidue6) {
		this.cardResidue6 = cardResidue6;
	}
}

jQuery.sap.declare("zecp.utils.formatter");
zecp.utils.formatter = {
	// 	formatDate: function (value) {
	// 		jQuery.sap.require("sap.ui.core.format.DateFormat");
	// 		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
	// 			pattern: "yyyy-MM-dd HH:mm:ss"
	// 		});
	// 		if (value) {
	// 			var formatDt = oDateFormat.format(value);
	// 			return formatDt;
	// 		} else {
	// 			return value;
	// 		}
	// 	}

	fnFormatCustomer: function (val) {
		var sTrimval;

		if (val) {
			val.toString();
			sTrimval = val.substr(5);
			//console.log(sTrimval);

		}
		return sTrimval;
	},
	fnFormatType: function (val) {
		var oNewVal;
		if (val == "ZLC001") {
			oNewVal = val.replace("ZLC001", "Co-Owner");
		} else if (val == "ZLC002") {
			oNewVal = val.replace("ZLC002", "Leaser");
		} else if (val == "ZLC003") {
			oNewVal = val.replace("ZLC003", "Lesse");
		} else if (val == "ZLC004") {
			oNewVal = val.replace("ZLC004", "Driver");
		} else if (val == "ZLC005") {
			oNewVal = val.replace("ZLC005", "Alt. Lesse");
		} else {
			oNewVal = "";
		}
		return oNewVal;
	},
	fnFormatStatusReason: function (val) {
		var oObject = {
			CWRTO: "CAN - VEHICLE WRITE OFF",
			C1: "CAN - BUYER REMORSE",
			C2: "CAN - DEAL FELL THROUGH",
			C3: "CAN - REPOSSESSION",
			C4: "CAN - RELOCATION",
			C5: "CAN - COLLISION",
			C6: "CAN - TOTAL LOSS FIRE",
			C7: "CAN - THEFT",
			C8: "CAN - CUSTOMER IRATE",
			C9: "CAN - OTHER",
			DOTHR: "DEL - OTHER REASON",
			DPLAN: "DEL - WRONG PLAN",
			DWRTO: "DEL - VEHICLE WRITE OFF",
			SCNAC: "SUS - NAME ADDRESS CHG",
			SCNDI: "SUS - CUST NAME DIFFERENT",
			SCNOV: "SUS - CUST. DISOWN VEH.",
			SCUSC: "SUS - CUSTOMER CHANGED",
			SCUSD: "SUS - CUSTOMER DECEASED",
			SCUSM: "SUS - CUSTOMER MERGED",
			SCUVT: "SUS - CUST. VIN TERM.",
			SFIRE: "SUS - FIRE",
			SINCU: "SUS- INCORRECT CUSTOMER",
			REVRT: "REVERT SEQUENCE",
			SOFSH: "SUSPEND - VEHICLE OFFSHORE",
			SOTHR: "SUS - OTHER REASON",
			SSTOL: "SUSPEND - VEHICLE STOLEN",
			SWRTO: "SUS - VEHICLE WRITEOFF"
		};
		var OnewVal;
		for (var key in oObject) {
			if (key == val) {
				OnewVal = oObject[key];
			}
		}
		return OnewVal;
	},
	appListName: function (custNameF, custNameL, custType, companyNm) {

		if (custType.toUpperCase() === "INDIVIDUAL") {
			return custNameF + " " + custNameL;
		} else {
			return companyNm;
		}

		// return cutNameF+CustNameL+custType+companyNm;
	},
	convUpperCase: function (s) {
		var oval = "";
		if (s !== "" && s !== undefined) {
			oval = s.toUpperCase();
		}
		return oval;

	},
	enquiryPageCnclFee: function (planCode, cancleFee) {
		//UTR3A 
		var vehCnclFeeNAPlan = ["ULR1A", "ULR2A", "ULPZY", "ULP1D", "ULP2E", "UTR1A", "UTR1B", "UTUZH", "UTUWC"];
		//check lenth of plan code if >5 take only first 5
		var pCode = planCode;
		if (planCode && planCode.length > 5) {
			pCode = planCode.substring(0, 5);
		}

		if (pCode) {
			if (vehCnclFeeNAPlan.indexOf(pCode.toUpperCase()) > -1) {
				return "100";
			} else {
				return "N/A";

			}

		} else {
			return cancleFee;
		}

	},
	fnFormatDealerCode: function (dealerCode) {
		if (dealerCode) {
			return dealerCode.substring(dealerCode.length - 5, dealerCode.length);
		}
		return dealerCode;

	},
	//	DMND0004148 - ECP Infostream APP remove customer data from non issuing dealer shriram 2-Aug-2023  code start
	maskNumber: function (telephone) {
		if (telephone) {
			return "XXXXXX" + telephone.substring(-4, 4);
		}
		return telephone;
	}, //	DMND0004148 - ECP Infostream APP remove customer data from non issuing dealer shriram 2-Aug-2023  code End
	postalCode: function (postalCode) {
		var str = postalCode;
		var strLower = str.toLowerCase();
		strUpper = strLower.replace(/\s/g, '');
		strUpperB = strUpper.toUpperCase();
		return strUpperB;
	}
};
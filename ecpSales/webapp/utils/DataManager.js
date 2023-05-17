sap.ui.define([], function () {
	"use strict";
	return {
		oPlanArray6000: ["NTC34", "NTC94", "NTC04", "NTC45", "NTC46", "NTC47", "NTC55", "NTC56", "NTC58", "NTC66", "NTC60", "NTC76", "NTC78",
			"NTC70", "NTF34", "NTF94", "NTC04", "NTF45", "NTF46", "NTF47", "NTF55", "NTF56", "NTF58", "NTF66", "NTF60", "NTF76", "NTF78", "NTF70",
			"CTC40", "CTC50", "NTC68", "NTF68"
		],
		oPlanArray: ["NTC34", "NTC94", "NTC04", "NTC45", "NTC46", "NTC47", "NTF34", "NTF94", "NTF04", "NTF45", "NTF46", "NTF47",
			"CTC40", "CTC50"
		],
		oPlanArray3Y: ["NTC55", "NTC56", "NTC58", "NTC66", "NTC60", "NTC76", "NTC78", "NTC70", "NTF55", "NTF56", "NTF58", "NTF66", "NTF60",
			"NTF76", "NTF78", "NTF70", "NTC68", "NTF68"
		],
		oPlanArray4Y: ["NLC45", "NLC46", "NLC55", "NLC66", "NLC68", "NLC69", "NLC77", "NLC86", "NLC88", "NLC80", "NLF45", "NLF46", "NLF55",
			"NLF66", "NLF68", "NLF69", "NLF77", "NLF86", "NLF88", "NLF80"
		],
		
		_validateInput: function (oInput) {
			var oBinding = oInput.getBinding("value");
			var sValueState = "None";
			var bValidationError = false;

			try {
				oBinding.getType().validateValue(oInput.getValue());
			} catch (oException) {
				sValueState = "Error";
				bValidationError = true;
			}
			if (oInput.getValue() == "" && oInput.mProperties.required == true) {
				sValueState = "Error";
				bValidationError = true;
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		fnReturnDivision: function () {
			var sDivision;
			//  get the locale to determine the language.
			var sDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (sDivisionSent) {
				sDivision = sDivisionSent[1];
			} else {
				sDivision = "10"; // default is english
			}
			return sDivision;
		},
		fnDateModel: function (elm) {
			var oDateModel = new sap.ui.model.json.JSONModel();
			oDateModel.setData({
				dateValueDRS2: new Date(2018, 1, 1),
				secondDateValueDRS2: new Date(),
				dateCurrent: new Date(),
				enableVin: true,
				editPlan: true,
				editAgrType: true
			});
			return elm.getView().setModel(oDateModel, "DateModel");
		},
		funECPBlankObj: function (elm) {
			elm.EcpFieldData = new sap.ui.model.json.JSONModel({
				DBOperation: "",
				BPTYPE: "",
				ZecpIntApp: "",
				ZecpMake: "",
				ZecpAppNum: "",
				ZecpVin: "",
				ZecpAgrNum: "",
				ZecpDealcode: "",
				ZecpAppStat: "",
				ZecpSaleDate: "",
				ZecpOdometer: "",
				ZecpAgrType: "",
				ZecpEffDate: "",
				ZecpExpDate: "",
				ZecpDealName: "",
				ZecpSurchrgFl: "",
				ZecpPreowned: "",
				ZecpCustNum: "",
				ZecpCustName: "",
				ZecpMidName: "",
				ZecpLastName: "",
				ZecpBusPhone: "",
				ZecpEmail: "",
				ZecpSubDate: "",
				ZecpAutocode: "",
				ZecpVehPrice: "",
				ZecpAmtFin: "",
				ZecpLienholder: "",
				ZecpLienterms: "",
				ZecpPlancode: "",
				ZecpRetPrice: "",
				ZecpDefSurchrg: "",
				ZecpVehSurchrgAmt: "",
				ZecpListpurprice: "",
				ZecpVehsurchrg: "",
				ZecpRoadhazard: "",
				ZecpBenefitsFlg: "",
				BccAgrmntSaleDt: "",
				ZecpSource: "",
				ZecpDatecreated: "",
				ZecpLastupdate: "",
				ZecpSaletype: "",
				ZecpFueltype: "",
				ZecpCylnum: "",
				ZecpAdddata1: "",
				ZecpAdddata2: "",
				ZecpAdddata3: "",
				ZecpAdddata4: "",
				ZecpAdddata5: "",
				ZecpCompName: "",
				ZecpAddress: "",
				ZecpCity: "",
				ZecpProvince: "",
				ZecpPostalcode: "",
				ZecpHomePhone: "",
				ZecpBusExt: "",
				ZecpBusOrInd: "",
				ZecpModelcode: "",
				BccEcpAgrmntNum: "",
				BccVin: "",
				BccPlanCd: "",
				BccAplDlrshpNum: "",
				BccAgrStCd: "",
				AgrStDt: "",
				BccAgrEvTypCd: "",
				BccVoasPartNum: "",
				BccAgrmntDlrNum: "",
				BccEcpAutoCd: "",
				BccAgrmntExtcntr: "",
				BccAgrmntPrcAmt: "",
				Dedctble: "",
				VehSurchLst: "",
				BccDtSrchrgFlg: "",
				BccDefSrchrgAmt: "",
				BccAgrmntYrCd: "",
				BccAgrmntSerNo: "",
				BccVehSrchrgFlg: "",
				BccVehSrchrgAmt: " ",
				BccDlrCommsnAmt: " ",
				BccCdbCustNum: "",
				BccAgrmntThruKm: " ",
				BccLubBnftFlg: "",
				BccVehStsKm: " ",
				BccAgrmntDlrPfl: "",
				BccPlnLienHldr: "",
				BccPlnLienTrmth: " ",
				BccPlnLienAmt: " ",
				BccDlrNetDebamt: " ",
				BccNetDebAmt: " ",
				BccNetGwDebAmt: " ",
				BccNetGwCreAmt: " ",
				BccNetGwOffCre: " ",
				BccNetRecvryDeb: " ",
				BccCncTsfFee: " ",
				BccCustRfndAmt: " ",
				BccAdjstdAdmAmt: " ",
				BccAdjstdFdAmt: " ",
				BccAdjstdRapAmt: " ",
				BccAdjstdSurAmt: " ",
				BccAgrActSrDes: "",
				BccAdjstrCmnts: "",
				BccUsrCalAmtflg: "",
				BccRdHzrd: "",
				RdHzrdExpDt: "",
				Odmtr: "",
				TrnfrOdometer: "",
				TrnfrDate: "",
				TrnfrFee: "",
				PrOwndCert: "",
				PrVendorFlag: "",
				BccInscTrnmtFl: "",
				BccRdsdTrnmtFl: "",
				BccMktngTrnmtFl: "",
				BccDlrDebGst: " ",
				BccDlrDebPst: " ",
				BccCustRfndGst: " ",
				BccCustRfndPst: " ",
				BccFinclAjstrId: "",
				BccDebitRequest: "",
				BccCreditRequest: "",
				BccCrtrUserid: "",
				BccCrtnTmstmp: "",
				BccLstUpdPltf: "",
				BccLstUpdPgmid: "",
				BccLstUpdUserid: "",
				BccLstUpdTmstmp: "",
				ZamtFincd: " ",
				ZretailPrice: "",
				ZecpRoadhazard1: "",
				BENEFITSFLAG: "", //Added new entity for translation
				ZecpPlanpurchprice: ""

			});
			elm.EcpFieldData.setDefaultBindingMode("TwoWay");
			elm.getView().setModel(elm.EcpFieldData, "EcpFieldData");
		}
	};

});
sap.ui.define([
	"zecp/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("zecp.controller.AgreementInquiry", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zecp.view.AgreementInquiry
		 */
		onInit: function () {
			var oNodeModel = new sap.ui.model.json.JSONModel();
			oNodeModel.loadData(jQuery.sap.getModulePath("zecp.utils", "/Nodes.json"));
			this.getView().setModel(oNodeModel, "ClaimModel");
			this.getView().setModel(this.getOwnerComponent().getModel("EcpSalesModel"));

			var oVehicleMaster = this.getOwnerComponent().getModel("ZVehicleMasterModel");
			this.getView().setModel(oVehicleMaster, "VinModel");

			this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRoutMatched, this);
			this.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(this.oI18nModel, "i18n");
			var winUrl = window.location.search;

			var userLang = navigator.language || navigator.userLanguage;

			if ((winUrl.indexOf("=fr") > -1) || (userLang == "fr")) {
				this.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(this.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				this.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(this.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
		},

		_onRoutMatched: function (oEvent) {
			var oAgrNum = oEvent.getParameters().arguments.AgrNum;
			var oAgrVIN = oEvent.getParameters().arguments.oAgrVin;
			this.getModel("LocalDataModel").setProperty("/AgreementNum", oAgrNum);

			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/AgreementNumber", oAgrNum);
			this.getView().byId("idAgreementDetailHeader").setTitle(this.getView().getModel("i18n").getResourceBundle().getText(
				"ECPAgreementDetails") + " - " + oAgrNum);
			var oGetModel = this.getModel("ZVehicleMasterModel");
			var zEcpModel = this.getOwnerComponent().getModel("EcpSalesModel");
			var oBusinessModel = this.getModel("ApiBusinessModel");
			var sSelectedLocale;
			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "en"; // default is english
			}
			var oLang = sSelectedLocale.toUpperCase().charAt(0);

			zEcpModel.read("/ZC_ECP_AGREEMENT_V2(p_language='" + oLang + "')/Set", {
				urlParameters: {
					"$filter": "AgreementNumber eq '" + oAgrNum + "'and VIN eq '" + oAgrVIN + "'"
				},
				success: $.proxy(function (data) {

					this.getModel("LocalDataModel").setProperty("/AgreementInfo", data.results[0]);
					// PlanType' , 'LocalDataModel>/AgreementInfo/CancelFee
					this.getModel("LocalDataModel").setProperty("/AgreementInfo/CancelFee", this.enquiryPageCnclFee(data.results[0].PlanType,
						data.results[0].CancelFee));

					//Fixing translation for RoadHazard Yes/No
					var TireHazard = this.getModel("LocalDataModel").getProperty("/AgreementInfo/RoadHazard");
					if (TireHazard.toUpperCase() == "YES" || TireHazard.toUpperCase() == "Y") {

						this.getModel("LocalDataModel").setProperty("/AgreementInfo/RoadHazardTranslates", this.getView().getModel("i18n").getResourceBundle()
							.getText("Yes"));
					} else if (TireHazard.toUpperCase() == "NO" || TireHazard.toUpperCase() == "N") {
						this.getModel("LocalDataModel").setProperty("/AgreementInfo/RoadHazardTranslates", this.getView().getModel("i18n").getResourceBundle()
							.getText("No"));
					} else {
						this.getModel("LocalDataModel").setProperty("/AgreementInfo/RoadHazardTranslates", "");
					}

					var BenefitsFlag = this.getModel("LocalDataModel").getProperty("/AgreementInfo/BenefitsFlag");
					if (BenefitsFlag.toUpperCase() == "YES" || BenefitsFlag.toUpperCase() == "Y") {

						this.getModel("LocalDataModel").setProperty("/AgreementInfo/BenefitsFlagTranlates", this.getView().getModel("i18n").getResourceBundle()
							.getText("Yes"));
					} else if (BenefitsFlag.toUpperCase() == "NO" || BenefitsFlag.toUpperCase() == "N") {
						this.getModel("LocalDataModel").setProperty("/AgreementInfo/BenefitsFlagTranlates", this.getView().getModel("i18n").getResourceBundle()
							.getText("No"));
					} else {
						this.getModel("LocalDataModel").setProperty("/AgreementInfo/BenefitsFlagTranlates", "");
					}
					var oDealer = data.results[0].DealershipNumber;
					if (oDealer) {
						oBusinessModel.read("/A_BusinessPartner", {
							urlParameters: {
								"$filter": "BusinessPartner eq '" + oDealer + "'"
							},
							success: $.proxy(function (businessData) {

								this.getModel("LocalDataModel").setProperty("/DealerData", businessData.results[0]);
							}, this)
						});
					}
					var AgrOwnrSectonCno = data.results[0].CustomerNumber;
					if (AgrOwnrSectonCno) {
						oBusinessModel.read("/A_BusinessPartner", {
							urlParameters: {
								"$filter": "BusinessPartner eq '" + AgrOwnrSectonCno + "' "
							},
							success: $.proxy(function (bpdata) {
								var oFristName = bpdata.results[0].FirstName.toUpperCase() || "";
								var oLastName = bpdata.results[0].LastName.toUpperCase() || "";
								this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/FirstName", oFristName);
								this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/LastName", oLastName);
								this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/BusinessPartnerCategory", bpdata.results[0].BusinessPartnerCategory);
								if (bpdata.results[0].BusinessPartnerCategory === "1") {
									this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress_Name", oFristName + " " + oLastName);
									this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress_BpType", this.getView().getModel("i18n").getResourceBundle()
										.getText("Individual")); // added translation
								} else if (bpdata.results[0].BusinessPartnerCategory === "2") {
									this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress_Name", bpdata.results[0].OrganizationBPName1);
									this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress_BpType", this.getView().getModel("i18n").getResourceBundle()
										.getText("Organization")); // added translation
								}

							}, this),
							error: function () {
								console.log("Error");
							}
						});

						this.fnBusinessPartnerData(AgrOwnrSectonCno, $.proxy(function (budata) {
							this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress", budata.results[0]);
							if (budata.results[0].to_EmailAddress.results.length > 0) {
								var oEmailAdd = budata.results[0].to_EmailAddress.results;
								var sEmail = "";
								if (oEmailAdd.filter(s => s.IsDefaultEmailAddress == true).length > 0) {
									var sEmail = oEmailAdd.filter(s => s.IsDefaultEmailAddress == true)[0].EmailAddress.toUpperCase() || "";
									this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/EmailAddress", sEmail);
								}

							}
							if (budata.results[0].to_PhoneNumber.results.length > 0) {
								// Added for incident INC0184963 start
								var oPhoneNumList = budata.results[0].to_PhoneNumber.results;
								var validPhone = "";
								//oPhoneNumList.filter(s => s.IsDefaultPhoneNumber == true && s.PhoneNumberType == 1)[0].PhoneNumber || "";
								var phoneArr = oPhoneNumList.filter(s => s.IsDefaultPhoneNumber == true && s.PhoneNumberType == 1);
								if (phoneArr.length > 0) {
									validPhone = phoneArr[0].PhoneNumber;
								} else {
									phoneArr = oPhoneNumList.filter(s => s.PhoneNumberType == 1);
									if (phoneArr.length > 0) {
										validPhone = phoneArr[0].PhoneNumber;
									}
								}
								this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/PhoneNumber", validPhone);
								// Added for incident INC0184963 end
							}
							if (budata.results[0].to_FaxNumber.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/FaxNumber", budata.results[0].to_FaxNumber.results[
										0]
									.FaxNumber || "");
							}

							if (budata.results[0].to_MobilePhoneNumber.results.length > 0) {
								// Added for incident INC0184963 start
								var oMobNumList = budata.results[0].to_MobilePhoneNumber.results;
								var validMobile = "";
								var validMobileArr = oMobNumList.filter(s => s.PhoneNumberType == 3);

								if (validMobileArr.length > 0) {
									validMobile = validMobileArr[0].PhoneNumber || "";
								}
								this.getModel("LocalDataModel").setProperty("/AgrOwnrSectonAddress/MobileNumber", validMobile);
								// Added for incident INC0184963 end

							}
						}, this));

					}

					zEcpModel.read("/zc_ecp_vehicle_detailSet", {
						urlParameters: {
							"$filter": "VIN eq '" + this.getModel("LocalDataModel").getProperty("/AgreementInfo/VIN") + "'"
						},
						success: $.proxy(function (vedata) {

							this.getModel("LocalDataModel").setProperty("/PricingModelData", vedata.results[0]);

							if (vedata.results[0].MAKE.toUpperCase() === "LEXUS") {
								this.getModel("LocalDataModel").setProperty("/printBtnState", true);

							} else {
								this.getModel("LocalDataModel").setProperty("/printBtnState", true);
							}

						}, this),
						error: function () {
							console.log("Error");
						}
					});

					zEcpModel.read("/zc_ecp_application", {
						urlParameters: {
							"$filter": "VIN eq '" + this.getModel("LocalDataModel").getProperty("/AgreementInfo/VIN") + "'"
						},
						success: $.proxy(function (apdata) {

							this.getModel("LocalDataModel").setProperty("/AgreementOwnerDetail", apdata.results[0]);

						}, this),
						error: function () {
							console.log("Error");
						}
					});

					oGetModel.read("/zc_c_vehicle", {

						urlParameters: {
							"$filter": "VehicleIdentificationNumber eq '" + this.getModel("LocalDataModel").getProperty("/AgreementInfo/VIN") + "' "
						},
						success: $.proxy(function (zcvedata) {

							this.getModel("LocalDataModel").setProperty("/VehicleDetails", zcvedata.results[0]);

							var vehcOwnrSectonCno = zcvedata.results[0].EndCustomer;
							if (vehcOwnrSectonCno) {
								this.fnBusinessPartnerData(vehcOwnrSectonCno, $.proxy(function (budata) {
									this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress", budata.results[0]);
									if (budata.results[0].to_EmailAddress.results.length > 0) {
										var oEmailAdd = budata.results[0].to_EmailAddress.results;
										var sEmail = "";
										if (oEmailAdd.filter(s => s.IsDefaultEmailAddress == true).length > 0) {
											sEmail = oEmailAdd.filter(s => s.IsDefaultEmailAddress == true)[0].EmailAddress.toUpperCase() || "";
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/EmailAddress", sEmail);
										}

									}
									if (budata.results[0].to_PhoneNumber.results.length > 0) {
										// Added for incident INC0184963 start
										var oPhoneNumList = budata.results[0].to_PhoneNumber.results;
										var validPhone = "";
										//oPhoneNumList.filter(s => s.IsDefaultPhoneNumber == true && s.PhoneNumberType == 1)[0].PhoneNumber || "";
										var phoneArr = oPhoneNumList.filter(s => s.IsDefaultPhoneNumber == true && s.PhoneNumberType == 1);
										if (phoneArr.length > 0) {
											validPhone = phoneArr[0].PhoneNumber;
										} else {
											phoneArr = oPhoneNumList.filter(s => s.PhoneNumberType == 1);
											if (phoneArr.length > 0) {
												validPhone = phoneArr[0].PhoneNumber;
											}
										}

										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/PhoneNumber", validPhone);
										// Added for incident INC0184963 end
									}
									if (budata.results[0].to_FaxNumber.results.length > 0) {
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/FaxNumber", budata.results[0].to_FaxNumber.results[
											0].FaxNumber);
									}
									if (budata.results[0].to_MobilePhoneNumber.results.length > 0) {
										// Added for incident INC0184963 start
										var oMobNumList = budata.results[0].to_MobilePhoneNumber.results;

										var validMobile = "";
										var validMobileArr = oMobNumList.filter(s => s.PhoneNumberType == 3);

										if (validMobileArr.length > 0) {
											validMobile = validMobileArr[0].PhoneNumber || "";
										}
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/Mobile", validMobile);
										// Added for incident INC0184963 end

									}
								}, this));

								oBusinessModel.read("/A_BusinessPartner", {
									urlParameters: {
										"$filter": "BusinessPartner eq '" + vehcOwnrSectonCno + "' "
									},
									success: $.proxy(function (bpdata) {
										var oFristName = bpdata.results[0].FirstName.toUpperCase() || "";
										var oLastName = bpdata.results[0].LastName.toUpperCase() || "";
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/FirstName", oFristName);
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/LastName", oLastName);
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/BusinessPartnerCategory", bpdata.results[0].BusinessPartnerCategory);
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/BusinessPartnerCategory", bpdata.results[0].BusinessPartnerCategory);
										if (bpdata.results[0].BusinessPartnerCategory === "1") {
											// this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/Name", bpdata.results[0].FirstName+" "+ bpdata.results[0].LastName);
											// this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/BpType", "Individual");

											this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress_Name", oFristName + " " +
												oLastName);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress_BpType", this.getView().getModel("i18n").getResourceBundle()
												.getText("Individual")); // added translation

										} else if (bpdata.results[0].BusinessPartnerCategory === "2") {
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress_Name", bpdata.results[0].OrganizationBPName1);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress_BpType", "Organization");
										}
									}, this),
									error: function () {
										console.log("Error");
									}
								});

							}

						}, this)
					});

					this.fnBusinessPartnerData(this.getModel("LocalDataModel").getProperty("/AgreementInfo/DealershipNumber"), $.proxy(function (
						budata) {
						//this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress", budata.results[0]);
						if (budata.results[0].to_EmailAddress.results.length > 0) {
							var oEmailAdd = budata.results[0].to_EmailAddress.results;
							var sEmail = "";
							if (oEmailAdd.filter(s => s.IsDefaultEmailAddress == true).length > 0) {
								sEmail = oEmailAdd.filter(s => s.IsDefaultEmailAddress == true)[0].EmailAddress.toUpperCase() || "";
								this.getModel("LocalDataModel").setProperty("/BusinessPartnerData/EmailAddress", sEmail);
							}

						}

						if (budata.results[0].to_PhoneNumber.results.length > 0) {
							// Added for incident INC0184963 start
							var oPhoneNumList = budata.results[0].to_PhoneNumber.results;
							var validPhone = "";
							//oPhoneNumList.filter(s => s.IsDefaultPhoneNumber == true && s.PhoneNumberType == 1)[0].PhoneNumber || "";
							var phoneArr = oPhoneNumList.filter(s => s.IsDefaultPhoneNumber == true && s.PhoneNumberType == 1);
							if (phoneArr.length > 0) {
								validPhone = phoneArr[0].PhoneNumber;
							} else {
								phoneArr = oPhoneNumList.filter(s => s.PhoneNumberType == 1);
								if (phoneArr.length > 0) {
									validPhone = phoneArr[0].PhoneNumber;
								}
							}
							this.getModel("LocalDataModel").setProperty("/BusinessPartnerData/PhoneNumber", validPhone);
							// Added for incident INC0184963 end
						}

						if (budata.results[0].to_FaxNumber.results.length > 0) {
							this.getModel("LocalDataModel").setProperty("/BusinessPartnerData/FaxNumber", budata.results[0].to_FaxNumber.results[0]
								.FaxNumber || "");
						}
					}, this));

					oBusinessModel.read("/A_BusinessPartner", {
						urlParameters: {
							"$filter": "BusinessPartner eq '" + this.getModel("LocalDataModel").getProperty("/AgreementInfo/DealershipNumber") + "' "
						},
						success: $.proxy(function (bpdata) {

							this.getModel("LocalDataModel").setProperty("/BusinessPartnerName", bpdata.results[0]);

						}, this),
						error: function () {
							console.log("Error");
						}
					});

				}, this),
				error: function () {
					console.log("Error");
				}
			});

			//Reading benefit List

			var oBenefitDataModel = new sap.ui.model.json.JSONModel();
			oBenefitDataModel.setData({

			});
			this.getView().setModel(oBenefitDataModel, "oBenefitDataModel");
			var userLang = navigator.language || navigator.userLanguage;
			var winUrl = window.location.search;
			var lanKey = 'EN';
			if ((winUrl.indexOf("=fr") > -1) || (userLang == "fr")) {
				lanKey = 'FR';
			}
			var oZECPModel = this.getModel("EcpSalesModel");
			var EcpModelV2 = this.getModel("ZecpV2Model");
			this._oToken = oZECPModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});

			EcpModelV2.read("/zc_ecp_valid_plansSet", {
				urlParameters: {
					"$filter": "LANGUAGE eq '" + lanKey + "' and BCC_ECP_AGRMNT_NUM eq '" + oAgrNum + "'",
					"$expand": "ZC_ECP_BENEFITSET"
				},
				success: $.proxy(function (data) {
					this.getModel("LocalDataModel").setProperty("/benefitList02", data.results[0].ZC_ECP_BENEFITSET.results);
					// 	oBenefitDataModel.setData({
					// 		benefitList02: data.results[0].ZC_ECP_BENEFITSET.results
					// 	});

				}, this),
				error: function () {
					console.log("Error");
				}
			});

			//	LANGUAGE eq 'EN' and BCC_ECP_AGRMNT_NUM eq 'G50000104NTC04000'&$expand=ZC_ECP_BENEFITSET

		},
		fnDateFormat: function (val) {
			var Oval;
			if (val) {
				//var oText = val.toUTCString();
				Oval = moment.utc(val).format("YYYY-MM-DD");
			} else {
				Oval = null;
			}
			return Oval;

		},
		handlePressClaim: function (oEvent) {
			var oAgr = this.getModel("LocalDataModel").getProperty("/AgreementNum");
			var oClaimModel = this.getModel("ClaimServiceModel");
			oClaimModel.read("/ZC_CLAIM_HEAD_NEW", {
				urlParameters: {
					"$filter": "AgreementNumber eq '" + oAgr + "'and WarrantyClaimType eq 'ZECP'"
				},
				success: $.proxy(function (data) {
					this.getModel("LocalDataModel").setProperty("/ClaimModelData", data.results);
				}, this),
				error: function (error) {
					console.log(error);
				}
			});

			var oDialogBox = sap.ui.xmlfragment("zecp.view.fragments.ClaimHistory", this);
			this.getView().addDependent(oDialogBox);
			oDialogBox.open();
		},
		onClose: function (oEvent) {
			oEvent.getSource().getParent().close();
		},
		onBacktoList: function () {
			this.getOwnerComponent().getRouter().navTo("AgreementInquiryList");
		},
		onSearchBackList: function () {
			this.getOwnerComponent().getModel("EcpSalesModel").refresh();
			this.getModel("LocalDataModel").setProperty("/VINAGR", "");
			this.getOwnerComponent().getRouter().navTo("AgreementInquiryList");
			this.getModel("LocalDataModel").setProperty("/rowCount", 0);
		},
		onPrintPdf: function () {
			var oAgr = this.getView().getModel("LocalDataModel").getProperty("/AgreementNum");

			var isProxy = "";
			if (window.document.domain == "localhost") {
				isProxy = "proxy";
			}
			var winUrl = window.location.search;
			var userLang = navigator.language || navigator.userLanguage;
			var lanKey = 'E';
			if ((winUrl.indexOf("=fr") > -1) || (userLang == "fr")) {
				lanKey = 'F';
			}
			var w = window.open(isProxy +
				"/node/ZECP_SALES_ODATA_SERVICE_SRV/zc_ecp_agreement_printSet(AGRNUM='" + oAgr + "',LANG='" + lanKey + "')/$value",
				'_blank');
			if (w == null) {
				console.log("Error");
				//MessageBox.warning(oBundle.getText("Error.PopUpBloqued"));
			}
		},
		enquiryPageCnclFee: function (planCode, cancleFee) {
			//UTR3A 
			var vehCnclFeeNAPlan = ["ULR1A", "ULR2A", "ULPZY", "ULP1D", "ULP2E", "UTR1A", "UTR3A", "UTUZH", "UTUWC"];
			//check lenth of plan code if >5 take only first 5
			var pCode = planCode;
			if (planCode && planCode.length > 5) {
				pCode = planCode.substring(0, 5);
			}

			if (pCode) {
				if (vehCnclFeeNAPlan.indexOf(pCode.toUpperCase()) > -1) {
					return "N/A";
				} else {

					return "100";
				}

			} else {
				return cancleFee;
			}

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf zecp.view.AgreementInquiry
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf zecp.view.AgreementInquiry
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf zecp.view.AgreementInquiry
		 */
		//	onExit: function() {
		//
		//	}

	});

});
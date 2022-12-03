sap.ui.define([
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/MessageToast',
	'sap/m/Text',
	'sap/ui/model/Filter',
	"zecp/controller/BaseController",
	'sap/m/MessageBox',
	"zecp/utils/DataManager",
	"sap/ui/core/ValueState",
	"sap/ui/core/BusyIndicator"
], function (Button, Dialog, Label, MessageToast, Text, Filter, Controller, MessageBox, DataManager, ValueState, BusyIndicator) {
	"use strict";
	var winUrl = window.location.search;
	var userLang = navigator.language || navigator.userLanguage;
	var lanKey = 'E';
	if ((winUrl.indexOf("=fr") > -1) || (userLang == "fr")) {
		lanKey = 'F';
	}
	return Controller.extend("zecp.controller.newECPApp", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zecp.view.newECPApp
		 */
		onInit: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("EcpSalesModel"));
			var oVehicleMaster = this.getOwnerComponent().getModel("ZVehicleMasterModel");
			this.getView().setModel(oVehicleMaster, "VinModel");
			this._getPropetyData();
			this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._oRouteNewECP, this);

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

			sap.ui.getCore().attachValidationError(function (oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});

		},

		_fnDateFormat: function (elm) {
			if (elm != "" && elm != null && elm != NaN) {
				var oNumTime = moment.utc(new Date(elm)).valueOf();
				var oTime = "\/Date(" + oNumTime + ")\/";
				return oTime;
			} else {
				return null;
			}
		},

		onEnterVinInput: function (oEvent) {
			var oVal = oEvent.getParameters().value.toUpperCase();
			this.getView().getModel("EcpFieldData").setProperty("/ZecpVin", oVal.trim());
		},
		_oRouteNewECP: function (oEvent) {
			this.getDealer();
			DataManager.fnDateModel(this);

			this.getModel("LocalDataModel").setProperty("/VehPriceState", "None");
			this.getModel("LocalDataModel").setProperty("/PlanPurchase", "None");
			this.getModel("LocalDataModel").setProperty("/AmtFinReq", false);
			this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", false);
			this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", false);
			this.getModel("LocalDataModel").setProperty("/AmtFinState", "None");
			this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "None");
			this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
			this.getModel("LocalDataModel").setProperty("/printBtnState", true);
			this.getModel("LocalDataModel").setProperty("/odometerState", "None");
			this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
			this.getView().byId("idNewECPMsgStrip").setText("");
			this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", false);
			this.getView().byId("idNewECPMsgStripPlan").setText("");
			this.getView().getModel("oSetProperty").setProperty("/oFlag", false);

			this.oAppId = oEvent.getParameters().arguments.appId;
			var oFormatedSaleDate;

			this.getModel("LocalDataModel").setProperty("/InternalApplicationID", this.oAppId);

			// 			this.getDealer();

			this.getModel("LocalDataModel").setProperty("/sCurrentDealer", oEvent.getParameters().arguments.ODealer);
			//this.getModel("LocalDataModel").setProperty("/enabledNext01", true);
			DataManager.funECPBlankObj(this);
			if (this.oAppId != 404 && this.oAppId != undefined) {
				this.getView().getModel("oSetProperty").setProperty("/oTab1visible", true);
				this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab5visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab6visible", false);
				this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab1");
				//this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab4");
				this.getView().getModel("oSetProperty").setProperty("/oPrimeryState01", true);
				this.getView().getModel("oSetProperty").setProperty("/oSecondaryState01", true);
				this.getView().getModel("oSetProperty").setProperty("/oPrimeryState", false);
				this.getView().getModel("oSetProperty").setProperty("/oSecondaryState", true);
				this.getView().getModel("oSetProperty").setProperty("/backToList", false);
				this.getView().getModel("oSetProperty").setProperty("/backPrimery", false);
				this.getView().getModel("oSetProperty").setProperty("/backSecondary", true);
				this.getView().getModel("oSetProperty").setProperty("/saleDat01Visible", false);
				this.getView().getModel("oSetProperty").setProperty("/saleDat02Visible", true);
				this.getView().getModel("DateModel").setProperty("/enableVin", false);
				this.getView().getModel("DateModel").setProperty("/editPlan", false);
				this.getView().getModel("DateModel").setProperty("/editAgrType", false);

				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss",
					UTC: true
				});

				var oZECPModel = this.getModel("EcpSalesModel");
				this._oToken = oZECPModel.getHeaders()['x-csrf-token'];
				$.ajaxSetup({
					headers: {
						'X-CSRF-Token': this._oToken
					}
				});
				var oVehicleMaster = this.getView().getModel("VinModel");
				var oBusinessModel = this.getModel("ApiBusinessModel");
				oZECPModel.read("/zc_ecp_application", {
					urlParameters: {
						"$filter": "InternalApplicationID eq '" + this.oAppId + "' "
					},
					success: $.proxy(function (data) {

						this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData", data.results[0]);
						this.getView().getModel("oSetProperty").setProperty("/oPlan", this.getModel("LocalDataModel").getProperty(
							"/ApplicationOwnerData/ECPPlanCode"));
						this.getView().getModel("oSetProperty").setProperty("/oOdometer", this.getModel("LocalDataModel").getProperty(
							"/ApplicationOwnerData/Odometer"));
						this.getView().getModel("oSetProperty").setProperty("/oAppType", this.getModel("LocalDataModel").getProperty(
							"/ApplicationOwnerData/AgreementType"));

						oFormatedSaleDate = oDateFormat.format(new Date(this.getModel("LocalDataModel").getProperty(
							"/ApplicationOwnerData/SaleDate")));

						// ApplicationOwnerData_Name

						if (data.results[0].BusinessIndividual.toUpperCase() === "BUSINESS") {

							this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_Name", data.results[0].CompanyName);
							this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_BpType", this.getView().getModel(
									"i18n").getResourceBundle()
								.getText("Organization"));

						} else {
							this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_Name", data.results[0].CustomerName +
								" " + data.results[0].CustomerLastName);
							this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_BpType", this.getView().getModel(
									"i18n").getResourceBundle()
								.getText("Individual")); // added translation
						}

						oVehicleMaster.read("/zc_c_vehicle", {
							urlParameters: {
								"$filter": "VehicleIdentificationNumber eq '" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/VIN") +
									"' "
							},
							success: $.proxy(function (vData) {
								this.getModel("LocalDataModel").setProperty("/VehicleDetails", vData.results[0]);
								oBusinessModel.read("/A_BusinessPartnerAddress", {
									urlParameters: {
										"$filter": "BusinessPartner eq '" + this.getModel("LocalDataModel").getProperty("/VehicleDetails/EndCustomer") +
											"' ",
										"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress"
									},
									success: $.proxy(function (businessA) {
										this.getModel("LocalDataModel").setProperty("/OwnerData", businessA.results[0]);
										if (businessA.results != "") {
											if (businessA.results[0].to_EmailAddress.results.length > 0) {
												this.getModel("LocalDataModel").setProperty("/OwnerData/EmailAddress", businessA.results[0].to_EmailAddress.results[
													0].EmailAddress || "");
											} else {
												this.getModel("LocalDataModel").setProperty("/OwnerData/EmailAddress", "");
											}

											if (businessA.results[0].to_PhoneNumber.results.length > 0) {
												this.getModel("LocalDataModel").setProperty("/OwnerData/PhoneNumber", businessA.results[0].to_PhoneNumber.results[
													0].PhoneNumber || "");
											} else {
												this.getModel("LocalDataModel").setProperty("/OwnerData/PhoneNumber", "");

											}
											if (businessA.results[0].to_FaxNumber.results.length > 0) {
												this.getModel("LocalDataModel").setProperty("/OwnerData/FaxNumber", businessA.results[0].to_FaxNumber.results[
													0].FaxNumber || "");
											} else {
												this.getModel("LocalDataModel").setProperty("/OwnerData/FaxNumber", "");

											}
										}
									}, this),
									error: function () {
										console.log("Error");
									}
								});

								oBusinessModel.read("/A_BusinessPartner", {
									urlParameters: {
										"$filter": "BusinessPartner eq '" + this.getModel("LocalDataModel").getProperty("/VehicleDetails/EndCustomer") +
											"' "
									},
									success: $.proxy(function (businessB) {
										if (businessB.results.length > 0) {
											this.getModel("LocalDataModel").setProperty("/AgreementOwnerName", businessB.results[0]);

											this.getModel("LocalDataModel").setProperty("/AgrOwnerSectAddOnAppSub_Name", businessB.results[0].FirstName +
												" " + businessB.results[
													0].LastName);

											this.getModel("LocalDataModel").setProperty("/AgreementOwnerName/FirstName", businessB.results[0].FirstName ||
												"");
											this.getModel("LocalDataModel").setProperty("/AgreementOwnerName/LastName", businessB.results[0].LastName || "");

											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/FirstName", businessB.results[0].FirstName);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/LastName", businessB.results[0].LastName);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/BusinessPartnerCategory", businessB.results[
												0].BusinessPartnerCategory);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/BusinessPartnerCategory", businessB.results[
												0].BusinessPartnerCategory);
											if (businessB.results[0].BusinessPartnerCategory === "1") {
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_Name", businessB.results[0].FirstName +
													" " + businessB.results[0].LastName);
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_BpType", this.getView().getModel("i18n")
													.getResourceBundle().getText("Individual")); // added translation

											} else if (businessB.results[0].BusinessPartnerCategory === "2") {
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_Name", businessB.results[0].OrganizationBPName1);
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_BpType", "Organization");
											}
										}
									}, this),
									error: function () {
										console.log("Error");
									}
								});
							}, this)
						});

						oZECPModel.read("/zc_ecp_crud_operationsSet", {
							urlParameters: {
								"$filter": "ZecpVin eq '" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/VIN") +
									"'and ZecpIntApp eq '" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/InternalApplicationID") +
									"'"
							},
							success: $.proxy(function (crdata) {
								var EcpFieldData = new sap.ui.model.json.JSONModel(crdata.results[0]);
								EcpFieldData.setDefaultBindingMode("TwoWay");
								this.getView().setModel(EcpFieldData, "EcpFieldData");
								this.getValidPlanSet(EcpFieldData);
								var oSelectedPlan = this.getView().getModel("EcpFieldData").getProperty("/ZecpPlancode");
								this.updateTHazBenFlag(oSelectedPlan);
								var isUsedPrimPlan = this.check4PrimUsedVehiclePlan(oSelectedPlan);
								if (isUsedPrimPlan) {
									this.getView().getModel("oSetProperty").setProperty("/notUsedPrimPlan", false);
									this.oECPData.ZecpPlanpurchprice = "0.01";
								} else {
									this.getView().getModel("oSetProperty").setProperty("/notUsedPrimPlan", true);
								}

							}, this),
							error: function (err) {
								console.log(err);
							}
						});

						oZECPModel.read("/zc_ecp_planpricing_dataSet", {
							urlParameters: {
								"$filter": "MGANR eq '" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/ECPPlanCode") +
									"'and ODMTR eq'" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/Odometer") + "'and VIN eq '" +
									this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/VIN") +
									"'and ZECPAGRTYPE eq'" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/AgreementType") +
									"'and ZECPSALE_DATE eq datetime'" + oFormatedSaleDate + "'"
							},
							success: $.proxy(function (pdata) {
								this.getModel("LocalDataModel").setProperty("/oPlanPricingData", pdata.results[0]);
							}, this),
							error: function (err) {
								console.log(err);
							}
						});
						var winUrl = window.location.search;
						var userLang = navigator.language || navigator.userLanguage;
						var vHsetLanKey = 'EN';
						if ((winUrl.indexOf("=fr") > -1) || (userLang == "fr")) {
							vHsetLanKey = 'FR';
						}
						oZECPModel.read("/zc_ecp_vehicle_detailSet", {
							urlParameters: {
								"$filter": "VIN eq '" + this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/VIN") + "' and  SPRAS eq '" +
									vHsetLanKey + "'"
							},
							success: $.proxy(function (vedata) {
								this.getModel("LocalDataModel").setProperty("/PricingModelData", vedata.results[0]);
								//Check and Update Tire Hazard and Benifit Falg for DMS App: Defet ID = 9616
								//this.updateTHazBenFlag(this.getView().getModel("EcpFieldData").getProperty("/ZecpPlancode"));

							}, this),
							error: function () {
								console.log("Error");
							}
						});

						if (this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/Source") == "DMS") {

							this.getView().getModel("oSetProperty").setProperty("/oAgrOwnerDMS", true);
							//this.getView().getModel("oSetProperty").setProperty("/backBtnP", false);
						} else {
							this.getView().getModel("oSetProperty").setProperty("/oAgrOwnerDMS", false);
							//this.getView().getModel("oSetProperty").setProperty("/backBtnP", true);
						}

					}, this),
					error: function (err) {
						console.log(err);
					}
				});

			} else {
				this.getView().getModel("oSetProperty").setProperty("/oTab1visible", true);
				this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab5visible", false);
				this.getView().getModel("oSetProperty").setProperty("/oTab6visible", false);
				this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab1");
				this.getView().getModel("oSetProperty").setProperty("/oPrimeryState01", false);
				this.getView().getModel("oSetProperty").setProperty("/oSecondaryState01", false);
				this.getView().getModel("oSetProperty").setProperty("/oPrimeryState", true);
				this.getView().getModel("oSetProperty").setProperty("/oSecondaryState", true);
				this.getView().getModel("oSetProperty").setProperty("/backToList", true);
				this.getView().getModel("oSetProperty").setProperty("/backPrimery", true);
				this.getView().getModel("oSetProperty").setProperty("/backSecondary", false);

				this.getView().getModel("oSetProperty").setProperty("/notUsedPrimPlan", true);
			}

		},
		updateTHazBenFlag: function (scode) {
			// var sourceType = this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData").Source;
			var pricingModelData = this.getModel("LocalDataModel").getProperty("/PricingModelData");
			var oECPData = this.getView().getModel("EcpFieldData").getData();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			if (pricingModelData && oECPData) {

				var saleDateMoment = moment.utc(oECPData.ZecpSaleDate).format("YYYY-MM-DD");
				var regDateMoment = moment.utc(pricingModelData.WARD_DATE).format("YYYY-MM-DD");

				var SaleDateVar = moment(saleDateMoment, "YYYY-MM-DD");
				var RegDateVar = moment(regDateMoment, "YYYY-MM-DD");
				var DifferTime = Math.round(moment.duration(SaleDateVar.diff(RegDateVar)).asDays());

				var oOdoVal = oECPData.ZecpOdometer;
				// if plancode starts with CTC the tire road hazard should come as NO
				var bul = scode.startsWith("CTC") ? true : false;

				//3year 1095 in days

				if (DifferTime <= 1095 && oOdoVal <= 50000 && (oECPData.ZecpAgrType === oBundle.getText("NEWVEHICLEAGREEMENT") || oECPData.ZecpAgrType ===
						"NEW VEHICLE AGREEMENT") && bul == false) {
					this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "Yes");
					this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", oBundle.getText("Yes"));
				} else if (DifferTime > 1095 || oOdoVal > 50000) {
					this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "No");
					this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", oBundle.getText("No"));
				} else {
					this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "No");
					this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", oBundle.getText("No"));
				}

				var oDay = this.getModel("LocalDataModel").getProperty("/PricingModelData/B_DAYS");
				var oDayMili = parseInt(oDay) * 1000 * 60 * 60 * 24;
				if (oECPData.ZecpAgrType === oBundle.getText("NEWVEHICLEAGREEMENT") || oECPData.ZecpAgrType === "NEW VEHICLE AGREEMENT") {
					if (DifferTime <= oDay) {
						this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "Yes");
						this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", oBundle.getText("Yes"));
					} else if (DifferTime > oDay) {
						this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "No");
						this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", oBundle.getText("No"));
					}
				} else {
					this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "No");
					this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", oBundle.getText("No"));
				}

			}
		},

		handleValueHelp: function (oController) {

			this.inputId = oController.getParameters().id;

			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"zecp.view.fragments.VinListDialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// open value help dialog
			this._valueHelpDialog.open();
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");

			if (sValue) {
				var oFilter = new Filter(
					"VIN",
					sap.ui.model.FilterOperator.EQ, sValue
				);

				evt.getSource().getBinding("items").filter([oFilter]);
			} else {
				evt.getSource().getBinding("items").filter([]);
			}
		},

		_handleValueHelpClose: function (evt) {
			this.oSelectedItem = evt.getParameter("selectedItem");
			this.oSelectedTitle = this.oSelectedItem.getTitle();
			if (this.oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(this.oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		verifyVinDealer: function (vinID) {
			var oZECPModel = this.getModel("EcpSalesModel");

			oZECPModel.read("/zc_ecp_vehicle_detailSet", {
				urlParameters: {
					"$filter": "VIN eq '" + vinID + "'"
				},
				success: $.proxy(function (vedata) {
					if ((window.location.href.search("Division=10") > 0)) {
						if (vedata.results[0].MAKE.toUpperCase() === "TOYOTA") {
							//	valid toyota dealer and VIN
							this._deferVINDealer.resolve();
						} else {
							this._deferVINDealer.reject();
							//	return false;
							//not valid VIN for TOYATA dealer
						}
					}
					if ((window.location.href.search("Division=20") > 0)) {
						if (vedata.results[0].MAKE.toUpperCase() === "LEXUS") {
							//	valid LEXUS dealer and VIN
							this._deferVINDealer.resolve();;
						} else {
							this._deferVINDealer.reject();
							//not valid VIN for LEXUS dealer
						}
					}
					this._deferVINDealer.resolve();

				}, this),
				error: function () {
					console.log("Error");
				}
			});

		},

		// onSelectTab: function (oSelectedKey) {
		// 	// debugger;

		// 	if (oSelectedKey.getParameters().selectedKey == "Tab2") {
		// 		this.OnNextStep2();
		// 	}else if (oSelectedKey.getParameters().selectedKey == "Tab3") {
		// 		this.OnNextStep3();
		// 	} else if (oSelectedKey.getParameters().selectedKey == "Tab4") {
		// 		this.OnNextStep4();
		// 	} 
		// },

		OnNextStep2: function () {

			this.oECPData = this.getView().getModel("EcpFieldData").getData();
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oVin = this.getView().byId("idVinNum");
			var oVal = oVin.getValue();
			oVin.setValueState(sap.ui.core.ValueState.None);

			var VinNum = this.oECPData.ZecpVin.trim();

			var AgrTypes = [{
				typeNames: this.oBundle.getText("NEWVEHICLEAGREEMENT"),
				typeKey: "NEWAGR"
			}, {
				typeNames: this.oBundle.getText("USEDVEHICLEAGREEMENT"),
				typeKey: "USEDAGR"
			}, {
				typeNames: this.oBundle.getText("EXTENSION"),
				typeKey: "EXTENSION"
			}, {
				typeNames: this.oBundle.getText("CERTIFIED"),
				typeKey: "CERTIFIED"
			}];

			var oZECPModel = this.getModel("EcpSalesModel");

			oZECPModel.read("/zc_ecp_valid_vinsSet", {
				urlParameters: {
					"$filter": "VIN eq '" + VinNum + "'"
				},
				success: $.proxy(function (vinData) {
					var oVinLength = vinData.results.length;
					if (oVinLength > 0) {
						//this.getModel("LocalDataModel").setProperty("/AgrSet", AgrTypes);
						//this.getModel("LocalDataModel").setProperty("/enabledNext01", true);
						oZECPModel.read("/zc_ecp_valid_plansSet", {
							urlParameters: {
								"$filter": "VIN eq '" + VinNum + "'"
							},
							success: $.proxy(function (data) {
								this.oFlag = data.results[0].ZZEXT_FLG;
								if (this.oFlag === "YES") {
									this.getModel("LocalDataModel").setProperty("/AgrSet", AgrTypes);
								} else {
									var oFilterdVal = AgrTypes.filter((item) => item.typeNames != "EXTENSION" && item.typeNames != "PROLONGATION");
									this.getModel("LocalDataModel").setProperty("/AgrSet", oFilterdVal);

								}
							}, this),
							error: function () {
								//console.log("Error");
							}
						});

						oZECPModel.read("/zc_ecp_duplicate_agreementSet", {
							urlParameters: {
								"$filter": "VIN eq '" + VinNum + "'"
							},
							success: $.proxy(function (data) {
								var oFlag = data.results[0].ProcessingFlag;
								var sStatus = data.results[0].Status;
								this.getModel("LocalDataModel").setProperty("/duplicateAgrData", data.results[0]);

							}, this),
							error: function (err) {
								sap.ui.core.BusyIndicator.hide();
								console.log(err);
							}

						});

						var winUrl = window.location.search;
						var userLang = navigator.language || navigator.userLanguage;
						var vHset_lanKey = 'EN';
						if ((winUrl.indexOf("=fr") > -1) || (userLang == "fr")) {
							vHset_lanKey = 'FR';
						}

						oZECPModel.read("/zc_ecp_vehicle_detailSet", {
							urlParameters: {
								"$filter": "VIN eq '" + this.oECPData.ZecpVin + "' and  SPRAS eq '" + vHset_lanKey + "'"
							},
							success: $.proxy(function (data) {

								this.getModel("LocalDataModel").setProperty("/PricingModelData", data.results[0]);

								if (data.results[0].WARD_DATE != "" || data.results[0].WARD_DATE != undefined) {
									this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
									this.BccAgrmntPrtDt = data.results[0].WARD_DATE;

								} else {
									this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
									this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("InvalidRegistrationDate"));
									this.getView().byId("idNewECPMsgStrip").setType("Error");
								}
								if (data.results[0].MAKE != "" || data.results[0].MAKE != undefined) {
									this.oECPData.ZecpMake = data.results[0].MAKE;
								}
								if (data.results[0].VEHICLEMODEL != "" || data.results[0].VEHICLEMODEL != undefined) {
									this.oECPData.ZecpModelcode = data.results[0].VEHICLEMODEL;
								}

								if (data.results[0].ZAUTO_CODE != "" || data.results[0].ZAUTO_CODE != undefined) {
									this.oECPData.ZecpAutocode = data.results[0].ZAUTO_CODE;
								}

							}, this),
							error: $.proxy(function () {

								var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
								MessageBox.error(
									this.oBundle.getText("InvalidRegistrationDate"), {

										styleClass: bCompact ? "sapUiSizeCompact" : "",
										onClose: function (sAction) {
											MessageToast.show(sAction);
										}
									}
								);

								console.log("Error");
							}, this)
						});

						// oZECPModel.read("/zc_ecp_application", {
						// 	urlParameters: {
						// 		"$filter": "VIN eq '" + VinNum + "' "
						// 	},
						// 	success: $.proxy(function (data) {

						// 		this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData", data.results[0]);

						// 		this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData", data.results[0]);
						// 		this.getView().getModel("oSetProperty").setProperty("/oPlan", this.getModel("LocalDataModel").getProperty(
						// 			"/ApplicationOwnerData/ECPPlanCode"));
						// 		this.getView().getModel("oSetProperty").setProperty("/oOdometer", this.getModel("LocalDataModel").getProperty(
						// 			"/ApplicationOwnerData/Odometer"));
						// 		this.getView().getModel("oSetProperty").setProperty("/oAppType", this.getModel("LocalDataModel").getProperty(
						// 			"/ApplicationOwnerData/AgreementType"));

						// 		// oFormatedSaleDate = oDateFormat.format(new Date(this.getModel("LocalDataModel").getProperty(
						// 		// 	"/ApplicationOwnerData/SaleDate")));

						// 		// ApplicationOwnerData_Name

						// 		if (data.results[0].BusinessIndividual.toUpperCase() === "BUSINESS") {

						// 			this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_Name", data.results[0].CompanyName);
						// 			this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_BpType", this.getView().getModel(
						// 					"i18n").getResourceBundle()
						// 				.getText("Organization"));

						// 		} else {
						// 			this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_Name", data.results[0].CustomerName +
						// 				" " + data.results[0].CustomerLastName);
						// 			this.getModel("LocalDataModel").setProperty("/ApplicationOwnerData/ApplicationOwnerData_BpType", this.getView().getModel(
						// 					"i18n").getResourceBundle()
						// 				.getText("Individual")); // added translation
						// 		}

						// 		this.oECPData = this.getView().getModel("EcpFieldData").getData();

						// 	}, this),
						// 	error: function (err) {
						// 		console.log(err);
						// 	}
						// });
						//	var oPlansArray = ["NLC46", "NTC34", "NTC94", "NTC45", "NTC46", "NTC47"];

						oZECPModel.read("/zc_ecp_agreement", {
							urlParameters: {
								"$filter": "VIN eq '" + VinNum + "'and AgreementElectricVehicletype ne 'AGEN' "
							},
							success: $.proxy(function (data) {

								var oDataRes = data.results;

								var oResults = oDataRes.filter(v =>
									v["PlanType"].startsWith("NTC34") || v["PlanType"].startsWith("NLC46") || v["PlanType"].startsWith("NTC94") ||
									v["PlanType"].startsWith("NTC45") || v["PlanType"].startsWith("NTC46") || v["PlanType"].startsWith("NTC47")
								);

								this.getModel("LocalDataModel").setProperty("/AgreementDataActive", oResults);

							}, this),
							error: function (err) {
								console.log(err);
							}
						});

						var oGetModel = this.getModel("ZVehicleMasterModel");
						this._oToken = oGetModel.getHeaders()['x-csrf-token'];
						$.ajaxSetup({
							headers: {
								'X-CSRF-Token': this._oToken
							}
						});

						sap.ui.core.BusyIndicator.show();

						oGetModel.read("/zc_c_vehicle", {

							urlParameters: {
								"$filter": "VehicleIdentificationNumber eq '" + VinNum + "' "
							},
							success: $.proxy(function (data) {

								this.CustomerNumberLength = data.results.length;

								oZECPModel.read("/zc_ecp_application", {
									urlParameters: {
										"$filter": "VIN eq '" + VinNum + "'and ApplicationStatus eq 'PENDING'and DealerCode eq '" + this.getModel(
											"LocalDataModel").getProperty(
											"/sCurrentDealer") + "' "
									},
									success: $.proxy(function (odata) {
										sap.ui.core.BusyIndicator.hide();
										this.oAppdata = odata.results.length;
										if (data.results.length <= 0) {

											this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
											this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("CustomerNumberNotFound"));
											this.getView().byId("idNewECPMsgStrip").setType("Error");
											this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
											this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab1");
										}

										if (this.oAppdata > 0 && this.getModel("LocalDataModel").getProperty("/InternalApplicationID") == 404) {
											this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
											this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("VinAlreadySaved"));
											this.getView().byId("idNewECPMsgStrip").setType("Error");
											this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
											this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab1");
										} else if (this.getView().getModel("EcpFieldData").getProperty("/ZecpModelcode") == "Imported US Vehicle") {
											this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
											this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("ForeginVINError"));
											this.getView().byId("idNewECPMsgStrip").setType("Error");
											this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
											this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab1");
										} else {
											this.getModel("LocalDataModel").setProperty("/VehicleDetails", data.results[0]);
											this.oCustomer = data.results[0].EndCustomer;
											this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);

											this._deferVINDealer = jQuery.Deferred();
											this.verifyVinDealer(oVal);
											this._deferVINDealer.done($.proxy(function (oData) {
												this.getView().getModel("oSetProperty").setProperty("/oTab2visible", true);
												this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab2");

												this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
												this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
												this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);

												//this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
												this.getView().byId("idNewECPMsgStrip").setType("None");
												oVin.setValueState(sap.ui.core.ValueState.None);
											}, this)).fail($.proxy(function (oData) {
												this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
												this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("MisMatchDealertypeAndVehicle"));

												this.getView().byId("idNewECPMsgStrip").setType("Error");
											}, this));
										}
									}, this),
									error: function () {
										sap.ui.core.BusyIndicator.hide();
									}

								});

							}, this)
						});
					} else {
						//this.getModel("LocalDataModel").setProperty("/enabledNext01", false);
						this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
						this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("PlsEnterValVIN"));
						this.getView().byId("idNewECPMsgStrip").setType("Error");

						oVin.setValueStateText(this.oBundle.getText("ECP0007EVIN"));
						oVin.setValueState(sap.ui.core.ValueState.Error);
					}
				}, this),
				error: $.proxy(function (err) {
					console.log(err);
					//this.getModel("LocalDataModel").setProperty("/enabledNext01", false);
				}, this)
			});

		},

		onSelectAgrType: function (oEvent) {
			this.oSelectedAgrTypeKey = oEvent.getSource().getSelectedKey();
			var oSelectedText = this.getView().getModel("i18n").getResourceBundle().getText("EXTENSION");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var oAgrTableData = this.getView().getModel("LocalDataModel").getProperty("/AgreementDataActive");
			if (this.oSelectedAgrTypeKey == oSelectedText) {
				this.getView().getModel("oSetProperty").setProperty("/oAgreementTable", true);
			} else {
				this.getView().getModel("oSetProperty").setProperty("/oAgreementTable", false);
			}
			if (oAgrTableData != "" && this.oSelectedAgrTypeKey === oSelectedText) {
				this.getView().getModel("oSetProperty").setProperty("/ostep3", false);
			} else {
				this.getView().getModel("oSetProperty").setProperty("/ostep3", true);
			}
		},

		onSelectAgrRow: function (oEvent) {
			this.oAgrTable = oEvent.getParameters().rowContext.sPath;
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var obj = oEvent.getSource().getModel("LocalDataModel").getProperty(this.oAgrTable);
			if (obj.bcc_agr_st_cd == "A") {
				this.getView().getModel("oSetProperty").setProperty("/ostep3", true);
				this.getView().getModel("oSetProperty").setProperty("/oAgrTopDetails", true);
				this.getView().getModel("oSetProperty").setProperty("/oAgrOwner", true);

				var oDealer = obj.CustomerNumber;
				this.getModel("LocalDataModel").setProperty("/AgreementObj", obj);
				var oBusinessModel = this.getModel("ApiBusinessModel");
				oBusinessModel.read("/A_BusinessPartnerAddress", {
					urlParameters: {
						"$filter": "BusinessPartner eq '" + oDealer + "' ",
						"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress"

					},
					success: $.proxy(function (data) {

						this.getModel("LocalDataModel").setProperty("/OwnerData", data.results[0]);
						if (data.results != "") {
							if (data.results[0].to_EmailAddress.results.length > 0) {
								var oEmailAdd = data.results[0].to_EmailAddress.results;
								var sEmail = oEmailAdd.filter(s => s.IsDefaultEmailAddress == true);

								this.getModel("LocalDataModel").setProperty("/OwnerData/EmailAddress", sEmail[0].EmailAddress || "");
							}
							if (data.results[0].to_PhoneNumber.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/OwnerData/PhoneNumber", data.results[0].to_PhoneNumber.results[0].PhoneNumber ||
									"");
							}
							if (data.results[0].to_FaxNumber.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/OwnerData/FaxNumber", data.results[0].to_FaxNumber.results[0].FaxNumber ||
									"");
							}
						}
					}, this),
					error: function () {
						console.log("Error");
					}
				});

				oBusinessModel.read("/A_BusinessPartner", {
					urlParameters: {
						"$filter": "BusinessPartner eq '" + oDealer + "' "
					},
					success: $.proxy(function (data) {
						if (data.results.length > 0) {
							this.getModel("LocalDataModel").setProperty("/AgreementOwnerName", data.results[0]);
							this.getModel("LocalDataModel").setProperty("/AgrOwnerSectAddOnAppSub_Name", data.results[0].FirstName +
								" " + data.results[
									0].LastName);
							this.getModel("LocalDataModel").setProperty("/AgreementOwnerName/FirstName", data.results[0].FirstName || "");
							this.getModel("LocalDataModel").setProperty("/AgreementOwnerName/LastName", data.results[0].LastName || "");
						}
					}, this),
					error: function () {
						console.log("Error");
					}
				});
			} else {

				MessageBox.error(
					this.oBundle.getText("StatusCanceled"), {
						onClose: function (sAction) {
							MessageToast.show(sAction);
						}
					}
				);
			}
		},

		//this method is to fix the key tranlation issue while calling the zc_ecp_valid_plansSet with Plane type New/used/Ext
		// Becoz this key are getting translated due to language and Service is not able to identified/incorporate the translated key in Service
		getTypeOfAggreementKey: function (planTypeStr) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//var oagr;
			if (planTypeStr === oBundle.getText("NEWVEHICLEAGREEMENT")) {
				return "NEW VEHICLE AGREEMENT";
			}
			if (planTypeStr === oBundle.getText("USEDVEHICLEAGREEMENT")) {
				return "USED VEHICLE AGREEMENT";
			}
			if (planTypeStr === oBundle.getText("EXTENSION")) {
				return "EXTENSION";
			}
			if (planTypeStr === oBundle.getText("CERTIFIED")) {
				return "CERTIFIED VEHICLE AGREEMENT";
			}

		},

		agreementTypeChange: function (planTypeStr) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//var oagr;
			if (planTypeStr === "ENTENTE POUR VÉHICULE NEUF" || planTypeStr === "NEW VEHICLE AGREEMENT") {
				return "NEW VEHICLE AGREEMENT";
			}
			if (planTypeStr === "ENTENTE DE VÉHICULE USAGÉ" || planTypeStr === "USED VEHICLE AGREEMENT") {
				return "USED VEHICLE AGREEMENT";
			}
			if (planTypeStr === "EXTENSION" || planTypeStr === "PROLONGATION") {
				return "EXTENSION";
			}
			if (planTypeStr === "CERTIFIED VEHICLE AGREEMENT" || planTypeStr === "CONTRAT DE VÉHICULE CERTIFIÉ") {
				return "CERTIFIED VEHICLE AGREEMENT";
			}

		},

		fnLanguageCheck: function (planTypeStr) {
			var retVal;
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			if (planTypeStr === "ENTENTE POUR VÉHICULE NEUF" || planTypeStr === "NEW VEHICLE AGREEMENT") {
				return retVal = oBundle.getText("NEWVEHICLEAGREEMENT", planTypeStr);
			}
			if (planTypeStr === "ENTENTE DE VÉHICULE USAGÉ" || planTypeStr === "USED VEHICLE AGREEMENT") {
				return retVal = oBundle.getText("USEDVEHICLEAGREEMENT", planTypeStr);
			}
			if (planTypeStr === "EXTENSION" || planTypeStr === "PROLONGATION") {
				return retVal = oBundle.getText("EXTENSION", planTypeStr);
			}
			if (planTypeStr === "CERTIFIED VEHICLE AGREEMENT" || planTypeStr === "CONTRAT DE VÉHICULE CERTIFIÉ") {
				return retVal = oBundle.getText("CERTIFIED", planTypeStr);
			}
		},
		_fnValidateTab2: function () {
			this.getView().getModel("oSetProperty").setProperty("/oTab2visible", true);
			this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab2");
			this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
		},

		_fnExistAppCheckCreate: function () {
			this._fnValidateTab2();
			var oVin = this.getView().getModel("EcpFieldData").getProperty("/ZecpVin");
			var oAgrTyp = this.getView().getModel("EcpFieldData").getProperty("/ZecpAgrType");
			var zEcpModel = this.getModel("EcpSalesModel");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oOdometer = this.getView().byId("idOdoVal");
			var oOdoVal = oOdometer.getValue();
			var oSaleDateId = this.getView().byId("idDate");
			var oSaleDate = oSaleDateId.getValue();
			var zEcpModel = this.getModel("EcpSalesModel");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var oAgr = this.getView().byId("idAgrType");
			this.DifferTime = this._fnDifSaleDRegD().DifferTime;

			var oAgrInptElem = this.getView().byId("idAgrType");
			oAgrInptElem.setValueState(sap.ui.core.ValueState.None);
			oOdometer.setValueState(sap.ui.core.ValueState.None);
			oSaleDateId.setValueState(sap.ui.core.ValueState.None);
			var sStatus = this.getModel("LocalDataModel").getProperty("/duplicateAgrData/Status");
			var oFlag = this.getModel("LocalDataModel").getProperty("/duplicateAgrData/ProcessingFlag");

			// if (sStatus == "01") {
			// 	if (oAgrTyp != this.getView().getModel("i18n").getResourceBundle().getText("CERTIFIED")) {
			// 		MessageToast.show(oBundle.getText("planError01"), {
			// 			width: "30em",
			// 			my: "center center",
			// 			at: "center center",
			// 			duration: 1200,
			// 			onClose: $.proxy(function () {
			// 				this.getRouter().navTo("ApplicationList");
			// 			}, this)
			// 		});
			// 	}
			// }

			// if (sStatus == "03") {

			// 	MessageToast.show(oBundle.getText("planError03"), {
			// 		width: "30em",
			// 		my: "center center",
			// 		at: "center center",
			// 		duration: 1200,
			// 		onClose: $.proxy(function () {
			// 			this.getRouter().navTo("ApplicationList");
			// 		}, this)
			// 	});

			// }

			// if (sStatus == "04") {
			// 	if (oAgrTyp != this.getView().getModel("i18n").getResourceBundle().getText("EXTENSION")) {
			// 		MessageToast.show(oBundle.getText("planError04"), {
			// 			width: "30em",
			// 			my: "center center",
			// 			at: "center center",
			// 			duration: 1200,
			// 			onClose: $.proxy(function () {
			// 				this.getRouter().navTo("ApplicationList");
			// 			}, this)
			// 		});
			// 	}
			// }

			// if (sStatus == "05") {
			// 	if (oAgrTyp == this.getView().getModel("i18n").getResourceBundle().getText("CERTIFIED")) {
			// 		MessageToast.show(oBundle.getText("planError05"), {
			// 			width: "30em",
			// 			my: "center center",
			// 			at: "center center",
			// 			duration: 1200,
			// 			onClose: $.proxy(function () {
			// 				this.getRouter().navTo("ApplicationList");
			// 			}, this)
			// 		});
			// 	}
			// }

			if (this.oCustomer) {
				var oCustomerNum = this.oCustomer.substr(5);
			}

			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss",
				UTC: true
			});

			var oFormatedSaleDate = oDateFormat.format(new Date(this.getView().getModel("EcpFieldData").getProperty("/ZecpSaleDate")));
			var agreeTypeKey = this.agreementTypeChange(this.oECPData.ZecpAgrType);
			sap.ui.core.BusyIndicator.show();

			var sStatus = this.getModel("LocalDataModel").getProperty("/duplicateAgrData/Status");
			var oFlag = this.getModel("LocalDataModel").getProperty("/duplicateAgrData/ProcessingFlag");
			//var sStatus = data.results[0].Status;

			if (
				(this.fnLanguageCheck(oAgrTyp) == oBundle.getText("NEWVEHICLEAGREEMENT") && oFlag === "N") ||
				(this.fnLanguageCheck(oAgrTyp) == oBundle.getText("USEDVEHICLEAGREEMENT") && oFlag === "N") ||
				(sStatus == "01" && this.fnLanguageCheck(oAgrTyp) != this.getView().getModel("i18n").getResourceBundle().getText("CERTIFIED")) ||
				sStatus == "03" ||
				(sStatus == "04" && this.fnLanguageCheck(oAgrTyp) != this.getView().getModel("i18n").getResourceBundle().getText("EXTENSION")) ||
				(sStatus == "05" && this.fnLanguageCheck(oAgrTyp) == this.getView().getModel("i18n").getResourceBundle().getText("CERTIFIED"))

			) {
				sap.ui.core.BusyIndicator.hide();
				this._fnValidateTab2();
				// MessageToast.show(oBundle.getText("ActiveAgrexist"), {
				// 	width: "30em",
				// 	my: "center center",
				// 	at: "center center",
				// 	duration: 2000,
				// 	onClose: $.proxy(function () {
				// 		this.getRouter().navTo("ApplicationList");
				// 	}, this)
				// });

				// Changes done by Minakshi for	INC0195098 on 13/07/2021
				MessageBox.warning(oBundle.getText("ActiveAgrexist"), {
					actions: [MessageBox.Action.OK],
					emphasizedAction: MessageBox.Action.OK,
					onClose: $.proxy(function (sAction) {
						this.getRouter().navTo("ApplicationList");
					}, this)
				});

			} else {

				zEcpModel.read("/zc_ecp_valid_plansSet", {
					urlParameters: {
						"$filter": "VIN eq '" + this.oECPData.ZecpVin + "'and KUNNR eq '" + oCustomerNum + "'and ZECPAGRTYPE eq '" +
							agreeTypeKey +
							"'and ZECPSALE_DATE eq datetime'" + oFormatedSaleDate + "'and LANGUAGE eq '" + lanKey + "'",
						"$expand": "ZC_ECP_PLANSSET"
					},
					success: $.proxy(function (data) {
							sap.ui.core.BusyIndicator.hide();

							var oPlanData = data.results[0].ZC_ECP_PLANSSET.results;
							if (this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") {
								this.getModel("LocalDataModel").setProperty("/PlanValidSet", oPlanData);
							} else {
								var oFilteredPlan = oPlanData.filter(function (p) {
									return !(String(p.MGANR).startsWith("Z"));
								});

								this.getModel("LocalDataModel").setProperty("/PlanValidSet", oFilteredPlan);
							}

							var oAgrItem = this.getView().getModel("EcpFieldData").getProperty("/ZecpAgrType");
							var oDay = this.getModel("LocalDataModel").getProperty("/PricingModelData/B_DAYS");
							var oDayMili = parseInt(oDay) * 1000 * 60 * 60 * 24;
							if (this.oECPData.ZecpAgrType === "NEW VEHICLE AGREEMENT" || this.oECPData.ZecpAgrType == "ENTENTE POUR VÉHICULE NEUF") {
								if (this._fnDifSaleDRegD().diffSaleRegDate <= oDay) {
									this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "Yes");
									this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", this.oBundle.getText("Yes"));
								} else if (this._fnDifSaleDRegD().diffSaleRegDate > oDay) {
									this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "No");
									this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", this.oBundle.getText("No"));
								}
							} else {
								this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "No");
								this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", this.oBundle.getText("No"));
							}
							if (
								(!($.isEmptyObject(oOdoVal && oAgrItem && oSaleDate)) && this._fnDifSaleDRegD().diffSaleCurrent <= 0 && this._fnDifSaleDRegD()
									.diffSaleRegDate >=
									0 &&
									this.BccAgrmntPrtDt != null &&
									oOdoVal > 0 && (this._fnDifSaleDRegD().diffCurrentSaleDay <= 60 && this.getModel("LocalDataModel").getProperty(
											"/UserType") !=
										"TCI_Admin")) ||

								(!($.isEmptyObject(oOdoVal && oAgrItem && oSaleDate)) && this._fnDifSaleDRegD().diffSaleCurrent <= 0 && this._fnDifSaleDRegD()
									.diffSaleRegDate >=
									0 &&
									this.BccAgrmntPrtDt != null && oOdoVal > 0 && this.getModel("LocalDataModel").getProperty("/UserType") ==
									"TCI_Admin")

								||

								(!($.isEmptyObject(oOdoVal && oAgrItem && oSaleDate)) && this._fnDifSaleDRegD().diffSaleCurrent > 0 &&
									this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||
								(!($.isEmptyObject(oOdoVal && oAgrItem && oSaleDate)) && this._fnDifSaleDRegD().diffSaleRegDate < 0 &&
									this.BccAgrmntPrtDt != null && this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||

								(!($.isEmptyObject(oOdoVal && oAgrItem && oSaleDate)) &&
									(this._fnDifSaleDRegD().diffCurrentSaleDay > 60 && this.getModel("LocalDataModel").getProperty("/UserType") ==
										"TCI_Admin"))

							) {

								this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
								this.getView().byId("idNewECPMsgStrip").setType("None");

								this.getView().getModel("oSetProperty").setProperty("/oTab3visible", true);
								this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab3");

								this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
								this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
								this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);

								oAgr.setValueState(sap.ui.core.ValueState.None);
								oOdometer.setValueState(sap.ui.core.ValueState.None);
								oSaleDateId.setValueState(sap.ui.core.ValueState.None);
							} else if ($.isEmptyObject(oSaleDate)) {
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("ECP0007EDate"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oSaleDateId.setValueState(sap.ui.core.ValueState.Error);
								oSaleDateId.setValueStateText(this.oBundle.getText("ECP0007EDate"));
								this._fnValidateTab2();
							} else if (this._fnDifSaleDRegD().diffSaleCurrent > 0) {
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("PleaseSelectSaleDate"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oSaleDateId.setValueState(sap.ui.core.ValueState.Error);
								oSaleDateId.setValueStateText(this.oBundle.getText("PleaseSelectSaleDate"));
								this._fnValidateTab2();
							} else if (this._fnDifSaleDRegD().diffCurrentSaleDay > 60 && this.getModel("LocalDataModel").getProperty("/UserType") !=
								"TCI_Admin") {
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oSaleDateId.setValueState(sap.ui.core.ValueState.Error);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("SaleDateWithin60days"));
								this._fnValidateTab2();
							} else if (this._fnDifSaleDRegD().diffSaleRegDate < 0 && this.getModel("LocalDataModel").getProperty("/UserType") !=
								"TCI_Admin") {
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("Agreementdateislessthanvehicleregistrationdate") +
									"(" +
									this._fnDifSaleDRegD().regDateMoment + ")");
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oSaleDateId.setValueState(sap.ui.core.ValueState.Error);
								oSaleDateId.setValueStateText(this.oBundle.getText("Agreementdateislessthanvehicleregistrationdate") + "(" + this._fnDifSaleDRegD()
									.regDateMoment +
									")");
								this._fnValidateTab2();
							} else if ($.isEmptyObject(oOdoVal)) {
								this._fnValidateTab2();
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("ECP0007EOdo"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oOdometer.setValueState(sap.ui.core.ValueState.Error);
								oOdometer.setValueStateText(this.oBundle.getText("ECP0007EOdo"));

							} else if (this.BccAgrmntPrtDt == null) {
								this._fnValidateTab2();
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("WarDateErrorMessage"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
							} else if (oOdoVal <= 0) {
								this._fnValidateTab2();
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("OdometerGreaterThan0"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oOdometer.setValueState(sap.ui.core.ValueState.Error);
								oOdometer.setValueStateText(this.oBundle.getText("OdometerGreaterThan0"));
							} else if ($.isEmptyObject(oAgrItem)) {
								this._fnValidateTab2();
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("PleaseSelectAgreementType"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								oAgr.setValueState(sap.ui.core.ValueState.Error);
								oAgr.setValueStateText(this.oBundle.getText("PleaseSelectAgreementType"));
							}

							if (this.fnLanguageCheck(oAgrItem) == this.oBundle.getText("USEDVEHICLEAGREEMENT") || this.fnLanguageCheck(oAgrItem) ==
								this.oBundle.getText("CERTIFIED")) {
								var oSaleYear = new Date(oSaleDate).getFullYear();
								var oModelYr = this.getModel("LocalDataModel").getProperty("/PricingModelData/ZZMOYR");
								var oyearGap = parseInt(oSaleYear - oModelYr);
								if (oyearGap > 7 && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
									this._fnValidateTab2();
									this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
									this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("Modelyearexceedsby") + " " + parseInt(oyearGap -
											7) +
										" " +
										this.oBundle
										.getText("yr"));
									this.getView().byId("idNewECPMsgStrip").setType("Error");

								} else if (this._fnDifSaleDRegD().diffCurrentSaleDay > 60 && this.getModel("LocalDataModel").getProperty("/UserType") !=
									"TCI_Admin") {
									this._fnValidateTab2();
									this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
									this.getView().byId("idNewECPMsgStrip").setType("Error");
									oSaleDateId.setValueState(sap.ui.core.ValueState.Error);
									this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("SaleDateWithin60days"));

								} else if (
									(oyearGap <= 7 && this._fnDifSaleDRegD().diffSaleCurrent <= 0 && this._fnDifSaleDRegD().diffSaleRegDate >= 0 && (
										this._fnDifSaleDRegD().diffCurrentSaleDay < 60 && this.getModel("LocalDataModel").getProperty("/UserType") !=
										"TCI_Admin")) ||
									(oyearGap <= 7 && this._fnDifSaleDRegD().diffSaleCurrent <= 0 && this._fnDifSaleDRegD().diffSaleRegDate >= 0 &&
										this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||
									(oyearGap > 7 && this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||
									(this._fnDifSaleDRegD().diffSaleCurrent > 0 && this.getModel("LocalDataModel").getProperty("/UserType") ==
										"TCI_Admin") ||
									(this._fnDifSaleDRegD().diffSaleRegDate < 0 && this.getModel("LocalDataModel").getProperty("/UserType") ==
										"TCI_Admin")

								) {
									this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
									this.getView().byId("idNewECPMsgStrip").setType("None");
									//this.getView().byId("idFilter03").setProperty("enabled", true);
									this.getView().getModel("oSetProperty").setProperty("/oTab3visible", true);
									this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab3");
									this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
									this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
									this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
									oAgr.setValueState(sap.ui.core.ValueState.None);
									oOdometer.setValueState(sap.ui.core.ValueState.None);
									oSaleDateId.setValueState(sap.ui.core.ValueState.None);
								}
							}

							if (this.oFlag == "" && this.fnLanguageCheck(oAgrItem) == this.oBundle.getText("EXTENSION")) {
								this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
								this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("NoActiveArgreement"));
								this.getView().byId("idNewECPMsgStrip").setType("Error");
								this._fnValidateTab2();
							}

						},
						this),
					error: function () {
						console.log("Error");
						sap.ui.core.BusyIndicator.hide();
					}
				});

			}

		},

		_fnDifSaleDRegD: function () {
			var currenDateMoment = moment(new Date).format("YYYY-MM-DD");
			var oSaleDate = this.getView().getModel("EcpFieldData").getProperty("/ZecpSaleDate");
			if (oSaleDate != "" && this.BccAgrmntPrtDt != "") {
				var saleDateMoment = moment.utc(oSaleDate).format("YYYY-MM-DD");
				var regDateMoment = moment.utc(this.BccAgrmntPrtDt).format("YYYY-MM-DD");
				var SaleDateVar = moment(saleDateMoment, "YYYY-MM-DD");
				var oSaleDateTime = new Date(oSaleDate).getTime();

				var CurrentDateVar = moment(currenDateMoment, "YYYY-MM-DD");
				var oCurrentDate = new Date().getTime();
				var RegDateVar = moment(regDateMoment, "YYYY-MM-DD");
				var oRegDate = new Date(this.BccAgrmntPrtDt).getTime();

				//this.DifferTime = (oSaleDateTime - oRegDate);

				return {
					DifferTime: (oSaleDateTime - oRegDate),
					regDateMoment: regDateMoment,
					diffSaleCurrent: Math.round(moment.duration(SaleDateVar.diff(CurrentDateVar)).asDays()),
					diffCurrentSaleDay: Math.round(moment.duration(CurrentDateVar.diff(SaleDateVar)).asDays()),
					diffSaleRegDate: Math.round(moment.duration(SaleDateVar.diff(RegDateVar)).asDays())
				}
			}
		},

		OnNextStep3: function (oEvent) {

			this._fnExistAppCheckCreate();

			var oBusinessModel = this.getModel("ApiBusinessModel");
			this._oToken = oBusinessModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});

			oBusinessModel.read("/A_BusinessPartnerAddress", {
				urlParameters: {
					"$filter": "BusinessPartner eq '" + this.oCustomer + "' ",
					"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress"

				},
				success: $.proxy(function (data) {

					this.getModel("LocalDataModel").setProperty("/OwnerData", data.results[0]);
					if (data.results != "") {

						if (data.results[0].to_EmailAddress.results.length > 0) {
							this.getModel("LocalDataModel").setProperty("/OwnerData/EmailAddress", data.results[0].to_EmailAddress.results[
								0].EmailAddress || "");
						}
						if (data.results[0].to_PhoneNumber.results.length > 0) {
							this.getModel("LocalDataModel").setProperty("/OwnerData/PhoneNumber", data.results[0].to_PhoneNumber.results[
									0]
								.PhoneNumber || "");
						}

						if (data.results[0].to_FaxNumber.results.length > 0) {
							this.getModel("LocalDataModel").setProperty("/OwnerData/FaxNumber", data.results[0].to_FaxNumber.results[
								0].FaxNumber);
						}
					}

					this.oECPData = this.getView().getModel("EcpFieldData").getData();

					if (data.results[0].BusinessPartner != undefined || data.results[0].BusinessPartner != "") {
						this.oECPData.ZecpCustNum = data.results[0].BusinessPartner;
					}
					if (data.results[0].CityName != undefined || data.results[0].CityName != "") {
						this.oECPData.ZecpCity = data.results[0].CityName;
					}
					if (data.results[0].StreetName != undefined || data.results[0].StreetName != "") {
						this.oECPData.ZecpAddress = data.results[0].StreetName;
					}
					if (data.results[0].to_EmailAddress.results.length > 0) {
						var oEmailAdd = data.results[0].to_EmailAddress.results;
						var sEmail = oEmailAdd.filter(s => s.IsDefaultEmailAddress == true);
						this.oECPData.ZecpEmail = sEmail[0].EmailAddress || "";
					} else {
						this.oECPData.ZecpEmail = "";
					}
					if (data.results[0].PostalCode != undefined || data.results[0].PostalCode != "") {
						this.oECPData.ZecpPostalcode = data.results[0].PostalCode;
					}
					if (data.results[0].Region != undefined || data.results[0].Region != "") {
						this.oECPData.ZecpProvince = data.results[0].Region;
					}
					if (data.results[0].to_PhoneNumber.results.length > 0) {
						this.oECPData.ZecpHomePhone = data.results[0].to_PhoneNumber.results[0].PhoneNumber;
					}
					if (data.results[0].to_FaxNumber.results.length > 0) {
						this.oECPData.ZecpBusPhone = data.results[0].to_FaxNumber.results[0].FaxNumber;
					}

				}, this),
				error: function () {
					console.log("Error");
				}
			});

			oBusinessModel.read("/A_BusinessPartner", {
				urlParameters: {
					"$filter": "BusinessPartner eq '" + this.oCustomer + "' "
				},
				success: $.proxy(function (data) {
					if (data.results.length > 0) {
						this.getModel("LocalDataModel").setProperty("/AgreementOwnerName", data.results[0]);

						if (data.results[0].LastName != undefined || data.results[0].LastName != "") {
							this.oECPData.ZecpLastName = data.results[0].LastName;
							this.getModel("LocalDataModel").setProperty("/AgreementOwnerName/LastName", data.results[0].LastName);

						}
						if (data.results[0].FirstName != undefined || data.results[0].FirstName != "") {
							this.oECPData.ZecpCustName = data.results[0].FirstName;
							this.getModel("LocalDataModel").setProperty("/AgreementOwnerName/FirstName", data.results[0].FirstName);
						}
						this.getModel("LocalDataModel").setProperty("/AgrOwnerSectAddOnAppSub_Name", data.results[0].FirstName +
							" " + data.results[
								0].LastName);
					}
				}, this),
				error: function () {}
			});

		},

		onSelectPlanCode: function (oEvent) {
			var oidPlanCodeId = this.getView().byId("idPlanCode");
			if (oEvent.getParameters().selectedItem != null) {
				this.oPlanCode = oEvent.getParameters().selectedItem.getText();

				oidPlanCodeId.setValueState(sap.ui.core.ValueState.None);
				oidPlanCodeId.setValueStateText("");
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", false);
				this.getView().byId("idNewECPMsgStripPlan").setText("");
			} else {
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("PleaseSelectPlanCode"));
				this.getView().byId("idNewECPMsgStripPlan").setType("Error");
				oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
				oidPlanCodeId.setValueStateText(this.oBundle.getText("ECP0007EPlanCode"));
			}

		},
		onChangePreownedCert: function (oEvent) {
			var oVal = oEvent.getSource().getValue();
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			if (oVal.length > 10) {
				this.getModel("LocalDataModel").setProperty("/PreownedState", "Error");
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("MaximumLength10"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				oEvent.getSource().setValue("");
			} else {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
				this.getModel("LocalDataModel").setProperty("/PreownedState", "None");
			}
		},
		_fnDayHrSecond: function (milliseconds) {
			var day, hour, minute, seconds, month;
			seconds = Math.floor(milliseconds / 1000);
			minute = Math.floor(seconds / 60);
			seconds = seconds % 60;
			hour = Math.floor(minute / 60);
			minute = minute % 60;
			day = Math.floor(hour / 24);
			hour = hour % 24;
			month = Math.floor(day / 30.42);
			day = Math.floor(day % 30.42);
			return {
				month: month,
				day: day,
				hour: hour,
				minute: minute,
				seconds: seconds
			};
		},
		_fnDayMonth: function (val) {
			var day, hour, minute, seconds, month;

			month = parseInt(val / 30.42);
			day = parseInt(val % 30.42);
			return {
				month: month,
				day: day
			};
		},
		getNewVehiclePlnValidated: function (Vin, isGoldPaltPlan) {
			if (!isGoldPaltPlan) {
				this._deferVechPlnValidate.resolve();
				return;
			}
			var claimServiceModel = this.getModel("ClaimServiceModel");
			this._oToken = claimServiceModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});

			claimServiceModel.read("/ZC_WTY_INFO", {
				urlParameters: {
					"$filter": "VinNum eq '" + this.oECPData.ZecpVin + "' "
				},
				success: $.proxy(function (data) {
					this.getModel("LocalDataModel").setProperty("/claimData", data.results[0]);
					this._deferVechPlnValidate.resolve();
				}, this),
				error: function () {
					this._deferVechPlnValidate.resolve();
				}
			});
		},
		check4NewVehiclePlan: function (selectedPlan) {
			var getPlanArray = this.oBundle.getText("NewVehiclePlans").split("/");
			if (getPlanArray.indexOf(selectedPlan) > -1) {
				//New Plan has been slected
				return true;
			} else {
				return false;
			}
		},
		check4PrimUsedVehiclePlan: function (selectedPlan) {
			var vehiclePlansForPriceDisable = ["ULR1A", "ULR2A", "ULPZY", "ULP1D", "ULP2E", "UTR1A", "UTR1B", "UTUZH", "UTUWC", "UTR3A",
				"ULR3A"
			];
			if (vehiclePlansForPriceDisable.indexOf(selectedPlan) > -1) {
				//New Plan has been slected
				return true;
			} else {
				return false;
			}
		},
		_fnValidateTab4: function () {
			this.getView().getModel("oSetProperty").setProperty("/oTab3visible", true);
			this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
			this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab3");

		},
		OnNextStep4: function (oEvent) {
			
			var oRegYear, oSaleDate, oSaleYear, yearDef, yearInMonthDef, oSaleMonth, oRegMonth, monthDef, finalMonthDef, regDay, oSaleDay,
				dayDif, finalDayDef, Date1, Date2, oMonthMiliSecond, TotaldayMonDif;
			oSaleDate = this.getView().getModel("EcpFieldData").getProperty("/ZecpSaleDate");
			var Date1 = new Date(this.BccAgrmntPrtDt).getTime();
			var Date2 = new Date(oSaleDate).getTime();
			var odMerVal = parseInt(this.oECPData.ZecpOdometer);

			if (Date2 > Date1) {
				finalDayDef = Math.round((Date2 - Date1) / (1000 * 3600 * 24));
			}

			var oSelectedPlan = this.getView().getModel("EcpFieldData").getProperty("/ZecpPlancode");
			var oidPlanCodeId = this.getView().byId("idPlanCode");

			var oidPlanCode = oidPlanCodeId.getSelectedItem() || oidPlanCodeId.getValue();
			var isGoldPaltPlan = this.check4NewVehiclePlan(oSelectedPlan);

			var AllValidPlanData = this.getModel("LocalDataModel").getProperty("/PlanValidSet");

			var SelectedPlanDetails = AllValidPlanData.filter(function (p) {
				return p.MGANR == oSelectedPlan;
			});
			if (SelectedPlanDetails != "") {
				this.oAdditionalVal = parseInt(SelectedPlanDetails[0].KMS.replace(/,/g, ''));
				this.oPlanMonth = parseInt(SelectedPlanDetails[0].MONTHS);
				this.PlanTime = parseFloat(this.oPlanMonth * 30.42).toFixed(2);
				this.mxMonth = parseInt(SelectedPlanDetails[0].MAX_MONTH);
				this.mxMillage = parseInt(SelectedPlanDetails[0].MAX_MILEAGE);
			} else {

				MessageToast.show(this.oBundle.getText("NotaValidPlan"), {
					width: "30em",
					my: "center center",
					at: "center center",
					duration: 500,
					onClose: $.proxy(function () {
						this.getRouter().navTo("ApplicationList");
					}, this)
				});
			}

			this._deferVechPlnValidate = jQuery.Deferred();
			this.getNewVehiclePlnValidated(this.oECPData.ZecpVin, isGoldPaltPlan);
			this._deferVechPlnValidate
				.always($.proxy(function (oData) {
					if (isGoldPaltPlan) {
						var factWarrentyEdate = this.getModel("LocalDataModel").getProperty("/claimData").EndDate;
						var saleDate = this.oECPData.ZecpSaleDate;

						if ((odMerVal > 60000 || factWarrentyEdate.getTime() < saleDate.getTime()) && this.getModel("LocalDataModel").getProperty(
								"/UserType") != "TCI_Admin") {

							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("NewVehiclePlanRule"));
							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
							return;
						} else {
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("NewVehiclePlanRule"));
							this.getView().byId("idNewECPMsgStrip").setType("None");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.None);
						}
					}

					if (this.oECPData.ZecpAgrType === "ENTENTE POUR VÉHICULE NEUF" || this.oECPData.ZecpAgrType === "NEW VEHICLE AGREEMENT") {
						// this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "Yes");
						// this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", this.oBundle.getText("Yes"));

						//For Defect 12699
						this.getView().getModel("oSetProperty").setProperty("/notUsedPrimPlan", true);

						if (
							(!($.isEmptyObject(oidPlanCode)) && odMerVal <= this.oAdditionalVal && this._fnDifSaleDRegD().diffSaleRegDate <=
								this.PlanTime && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") ||
							(!($.isEmptyObject(oidPlanCode)) && odMerVal <= this.oAdditionalVal && this._fnDifSaleDRegD().diffSaleRegDate <=
								this.PlanTime && this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||
							(!($.isEmptyObject(oidPlanCode)) && odMerVal > this.oAdditionalVal && this.getModel("LocalDataModel").getProperty("/UserType") ==
								"TCI_Admin") ||
							(!($.isEmptyObject(oidPlanCode)) && this._fnDifSaleDRegD().diffSaleRegDate > this.PlanTime && this.getModel("LocalDataModel")
								.getProperty(
									"/UserType") == "TCI_Admin")

						) {

							this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
							this.getView().byId("idNewECPMsgStrip").setType("None");
							this.getView().getModel("oSetProperty").setProperty("/oTab4visible", true);
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.None);
							this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab4");

							this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
							this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
							this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);

						} else if ($.isEmptyObject(oidPlanCode)) {
							this._fnValidateTab4();
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("PleaseSelectPlanCode"));
							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
							oidPlanCodeId.setValueStateText(this.oBundle.getText("ECP0007EPlanCode"));

						} else if (odMerVal > this.oAdditionalVal && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
							this._fnValidateTab4();
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("Odometervalueexceeds") + " " +
								(odMerVal - this.oAdditionalVal) + this.oBundle
								.getText("KMagainstplanmilagevalue"));
							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
							oidPlanCodeId.setValueStateText("");

						} else if (this._fnDifSaleDRegD().diffSaleRegDate > this.PlanTime && this.getModel("LocalDataModel").getProperty("/UserType") !=
							"TCI_Admin") {
							this._fnValidateTab4();
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							var oTimeDiffer = this.DifferTime - this.PlanTime * 24 * 60 * 60 * 1000;

							var TotalTimeDiffer = this._fnDayHrSecond(oTimeDiffer);

							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("Planperiodexceedsby") + " " +
								TotalTimeDiffer.month + " Months : " + TotalTimeDiffer.day + " Days : " + TotalTimeDiffer.hour + " Hours : " +
								TotalTimeDiffer.minute + " Minutes ");

							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
							oidPlanCodeId.setValueStateText("");

						}

					}

					if (DataManager.fnReturnDivision() == "10" && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
						var findPlanArray = DataManager.oPlanArray.findIndex((item) => item == oSelectedPlan);
						var findPlanArray3Y = DataManager.oPlanArray3Y.findIndex((item) => item == oSelectedPlan);

						if (this._fnDifSaleDRegD().diffSaleRegDate > 31 && findPlanArray > -1) {
							this._fnValidateTab4();
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("RDR31Days"));
							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
						}

						if (this._fnDifSaleDRegD().diffSaleRegDate > 1095 && findPlanArray3Y > -1) {
							this._fnValidateTab4();
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("NewVehiclePlanRule"));
							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
						}

					}

					if (DataManager.fnReturnDivision() == "20" && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
						var findPlanArray4Y = DataManager.oPlanArray4Y.findIndex((item) => item == oSelectedPlan);
						if ((this._fnDifSaleDRegD().diffSaleRegDate > 1460 && findPlanArray4Y > -1) || (odMerVal > 80000 && findPlanArray4Y > -1)) {
							this._fnValidateTab4();
							this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
							this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("NewVehiclePlanRuleLexus"));
							this.getView().byId("idNewECPMsgStrip").setType("Error");
							oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
						}
					}

				}, this));
			var oMonthDef = this.DifferTime;
			var MaxMonthDays = parseInt(this.mxMonth * 30.42);
			var difDayMonth;
			var oAgrTyp = this.oECPData.ZecpAgrType;
			if (this.fnLanguageCheck(oAgrTyp) === this.oBundle.getText("USEDVEHICLEAGREEMENT") || this.fnLanguageCheck(oAgrTyp) === this.oBundle
				.getText("CERTIFIED")
			) {

				//to Fix Defect #12699
				var isUsedPrimPlan = this.check4PrimUsedVehiclePlan(oSelectedPlan);
				if (isUsedPrimPlan) {
					this.getView().getModel("oSetProperty").setProperty("/notUsedPrimPlan", false);
					this.oECPData.ZecpPlanpurchprice = "0.01";
				} else {
					this.getView().getModel("oSetProperty").setProperty("/notUsedPrimPlan", true);
					this.oECPData.ZecpPlanpurchprice = "";
				}

				this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "No");
				this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", this.oBundle.getText("No"));

				//Fixing Defect #11008 Hiding Surcharge boxes
				this.getView().getModel("oSetProperty").setProperty("/oSurcharge", false);
				if (
					(odMerVal <= parseInt(this.mxMillage) && this._fnDifSaleDRegD().diffSaleRegDate <= MaxMonthDays &&
						!($.isEmptyObject(oidPlanCode)) && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") ||
					(odMerVal <= parseInt(this.mxMillage) && this._fnDifSaleDRegD().diffSaleRegDate <= MaxMonthDays &&
						!($.isEmptyObject(oidPlanCode)) && this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||
					(this._fnDifSaleDRegD().diffSaleRegDate > MaxMonthDays &&
						!($.isEmptyObject(oidPlanCode)) && this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") ||
					(odMerVal > parseInt(this.mxMillage) &&
						!($.isEmptyObject(oidPlanCode)) && this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin")

				) {
					this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
					this.getView().byId("idNewECPMsgStrip").setType("None");
					this.getView().getModel("oSetProperty").setProperty("/oTab4visible", true);
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab4");
					this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
					this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
					this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);

				} else if ($.isEmptyObject(oidPlanCode)) {
					this._fnValidateTab4();
					this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("PleaseSelectPlanCode"));
					this.getView().byId("idNewECPMsgStrip").setType("Error");
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
					oidPlanCodeId.setValueStateText(this.oBundle.getText("ECP0007EPlanCode"));
				} else if (odMerVal > parseInt(this.mxMillage) && this._fnDifSaleDRegD().diffSaleRegDate >
					MaxMonthDays && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
					this._fnValidateTab4();
					//var oMonthMiliSecond = (finalMonthDef - this.mxMonth) * 30.42 * 24 * 60 * 60 * 1000;
					difDayMonth = this._fnDifSaleDRegD().diffSaleRegDate - MaxMonthDays;
					TotaldayMonDif = this._fnDayMonth(difDayMonth);
					this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("maxMillageExby") + " " + (odMerVal - parseInt(this.mxMillage)) +
						" KM and" +
						this.oBundle.getText("maxMonthExby") + " " + TotaldayMonDif.month + " Months : " + Math.round(
							TotaldayMonDif.day) + " Days ");
					this.getView().byId("idNewECPMsgStrip").setType("Error");
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);

				} else if (odMerVal > parseInt(this.mxMillage) && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
					this._fnValidateTab4();
					this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("maxMillageExby") + " " + (odMerVal -
						parseInt(this.mxMillage)) + " KM");
					this.getView().byId("idNewECPMsgStrip").setType("Error");
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);

				} else if (this._fnDifSaleDRegD().diffSaleRegDate > MaxMonthDays && this.getModel("LocalDataModel").getProperty("/UserType") !=
					"TCI_Admin") {
					this._fnValidateTab4();

					difDayMonth = this._fnDifSaleDRegD().diffSaleRegDate - MaxMonthDays;
					TotaldayMonDif = this._fnDayMonth(difDayMonth);

					this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("maxMonthExby") + " " +
						TotaldayMonDif.month + " Months : " + TotaldayMonDif.day + " Days");
					this.getView().byId("idNewECPMsgStrip").setType("Error");
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);

				}

				//In Case of used vechical benefit flag will always No
				this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "No");
				this.getView().getModel("EcpFieldData").setProperty("/ZbenefitFlag1", this.oBundle.getText("No"));
			} else {
				this.getView().getModel("oSetProperty").setProperty("/oSurcharge", false);
			}

			//defect id 10908
			if (this.oECPData.ZecpAgrType === "EXTENSION" || this.oECPData.ZecpAgrType == "PROLONGATION") {
				if (!($.isEmptyObject(oidPlanCode))) {
					this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
					this.getView().byId("idNewECPMsgStrip").setType("None");
					this.getView().getModel("oSetProperty").setProperty("/oTab4visible", true);
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab4");

				} else if ($.isEmptyObject(oidPlanCode)) {
					this._fnValidateTab4();
					this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("PleaseSelectPlanCode"));
					this.getView().byId("idNewECPMsgStrip").setType("Error");
					oidPlanCodeId.setValueState(sap.ui.core.ValueState.Error);
					oidPlanCodeId.setValueStateText(this.oBundle.getText("ECP0007EPlanCode"));

				}

			}

			this.updateTHazBenFlag(oSelectedPlan);
			
			this.updateSurchargeValue(this.getModel("LocalDataModel").getProperty("/odometerState"));

			//resetting the LienFields Validation

			this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", false);
			this.getModel("LocalDataModel").setProperty(
				"/ZecpTermsState", "None");
			this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", false);
			this.getModel(
				"LocalDataModel").setProperty("/ZecpLienHolderState", "None");
			this.getModel("LocalDataModel").setProperty("/ZecpTermsReq",
				false);
			this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");

			//Fetching Bussiness Partner Details for Vehicle Owner Detail
			var vehcOwnrSectonCno = this.getModel("LocalDataModel").getProperty("/OwnerData/BusinessPartner");
			var oBusinessModelOnSubmit = this.getModel("ApiBusinessModel");
			this._oToken = oBusinessModelOnSubmit.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});
			if (vehcOwnrSectonCno) {

				oBusinessModelOnSubmit.read("/A_BusinessPartnerAddress", {
					urlParameters: {
						"$filter": "BusinessPartner eq '" + vehcOwnrSectonCno + "' ",
						"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress,to_MobilePhoneNumber"

					},
					success: $.proxy(function (budata) {

							this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub", budata.results[0]);
							this.getModel("LocalDataModel").setProperty("/OwnerData", budata.results[0]);

							if (budata.results[0].to_EmailAddress.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/EmailAddress", budata.results[0].to_EmailAddress.results[
									0].EmailAddress);
							}
							if (budata.results[0].to_PhoneNumber.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/PhoneNumber", budata.results[0].to_PhoneNumber.results[
									0].PhoneNumber);
							}
							if (budata.results[0].to_FaxNumber.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/FaxNumber", budata.results[0].to_FaxNumber.results[
										0]
									.FaxNumber);
							}
							if (budata.results[0].to_MobilePhoneNumber.results.length > 0) {
								this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/Mobile", budata.results[0].to_MobilePhoneNumber.results[
									0].PhoneNumber);
							}

						},
						this),
					error: function () {
						console.log("Error");
					}
				});

				oBusinessModelOnSubmit.read("/A_BusinessPartner", {
					urlParameters: {
						"$filter": "BusinessPartner eq '" + vehcOwnrSectonCno + "' "
					},
					success: $.proxy(function (bpdata) {

						this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/FirstName", bpdata.results[0].FirstName);
						this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/LastName", bpdata.results[0].LastName);
						this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/BusinessPartnerCategory", bpdata.results[0].BusinessPartnerCategory);
						this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/BusinessPartnerCategory", bpdata.results[0].BusinessPartnerCategory);
						if (bpdata.results[0].BusinessPartnerCategory === "1") {
							// this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/Name", bpdata.results[0].FirstName+" "+ bpdata.results[0].LastName);
							// this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/BpType", "Individual");

							this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_Name", bpdata.results[0].FirstName + " " + bpdata.results[
								0].LastName);
							this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_BpType", this.getView().getModel("i18n").getResourceBundle()
								.getText("Individual")); // added translation

						} else if (bpdata.results[0].BusinessPartnerCategory === "2") {
							this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_Name", bpdata.results[0].OrganizationBPName1);
							this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_BpType", this.getView().getModel("i18n").getResourceBundle()
								.getText("Organization"));
						}

					}, this),
					error: function () {
						console.log("Error");
					}
				});
				
				
				

			}
			
			
			

		},
		onChangeAmt: function (oEvent) {
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();

			var val = oEvent.getParameter('value');
			var parsedVal = parseFloat(val);
			if (parsedVal < 0) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().setValueStateText(this.oBundle.getText("negPriceNotAllowed"));
				oEvent.getSource().setShowValueStateMessage(true);
			} else {
				//Handling -0 case
				if (parseFloat(val) === 0) {
					oEvent.getSource().setValue(0);
				}
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}

		},
		onChangeLien: function (oEvent) {
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();

			var val = oEvent.getParameter('value');

			if (val.length < 1) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);

			} else {
				//Handling -0 case

				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}

		},

		onChangeOdometer: function (oEvent) {
			var idOdo = this.getView().byId("idOdo");
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oOdoVal = oEvent.getSource().getValue();
			var oAgrType = this.getView().getModel("EcpFieldData").getProperty("/ZecpAgrType");
			this.getView().getModel("EcpFieldData").setProperty("/ZecpOdometer", oOdoVal);
			if ($.isEmptyObject(oOdoVal)) {
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("PleaseEnterOdometer"));
				this.getView().byId("idNewECPMsgStripPlan").setType("Error");

				this.getModel("LocalDataModel").setProperty("/odometerState", "Error");

			} else if (oOdoVal <= 0) {
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("OdometerGreaterThan0"));
				this.getView().byId("idNewECPMsgStripPlan").setType("Error");
				this.getModel("LocalDataModel").setProperty("/odometerState", "Error");
			} else if (oOdoVal > parseInt(this.oAdditionalVal) &&
				(oAgrType == "NEW VEHICLE AGREEMENT" || oAgrType == "ENTENTE POUR VÉHICULE NEUF") && this.getModel("LocalDataModel").getProperty(
					"/UserType") != "TCI_Admin") {
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("Odometervalueexceeds") + " " +
					(oOdoVal - this.oAdditionalVal) + this.oBundle
					.getText("KMagainstplanmilagevalue"));
				this.getView().byId("idNewECPMsgStripPlan").setType("Error");
				idOdo.setValueState(sap.ui.core.ValueState.Error);
				//idOdo.setValueStateText("");
				this.getModel("LocalDataModel").setProperty("/odometerState", "Error");
				MessageToast.show(this.oBundle.getText("Odometervalueexceeds") + " " +
					(oOdoVal - this.oAdditionalVal) + this.oBundle
					.getText("KMagainstplanmilagevalue"));
				///// added logic for certified agreement on 03/03/2021 singhmi start
			} else if (
				(oOdoVal > parseInt(this.mxMillage) && (oAgrType == "USED VEHICLE AGREEMENT" || oAgrType == "ENTENTE DE VÉHICULE USAGÉ") &&
					this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") ||

				(oOdoVal > parseInt(this.mxMillage) && (oAgrType == "CERTIFIED VEHICLE AGREEMENT" || oAgrType == "CONTRAT DE VÉHICULE CERTIFIÉ") &&
					this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin")

			) {
				///// added logic for certified agreement on 03/03/2021 singhmi end
				//var oMonthMiliSecond = (finalMonthDef - this.mxMonth) * 30.42 * 24 * 60 * 60 * 1000;

				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("maxMillageExby") + " " + (oOdoVal - parseInt(this.mxMillage)) +
					" KM");
				this.getView().byId("idNewECPMsgStripPlan").setType("Error");
				idOdo.setValueState(sap.ui.core.ValueState.Error);
				MessageToast.show(this.oBundle.getText("maxMillageExby") + " " + (oOdoVal - parseInt(this.mxMillage)) + " KM");

			} else {
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", false);
				this.getView().byId("idNewECPMsgStripPlan").setType("None");
				this.getModel("LocalDataModel").setProperty("/odometerState", "None");
				idOdo.setValueState(sap.ui.core.ValueState.None);
				this.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
			}

			var oSelectedPlan = this.getView().getModel("EcpFieldData").getProperty("/ZecpPlancode");
			if (DataManager.fnReturnDivision() == "20" && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
				var findPlanArray4Y = DataManager.oPlanArray4Y.findIndex((item) => item == oSelectedPlan);
				if (oOdoVal > 80000 && findPlanArray4Y > -1) {

					this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("NewVehiclePlanRuleLexus"));
					this.getView().byId("idNewECPMsgStripPlan").setType("Error");

				} else {
					this.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
				}
			}

			if (DataManager.fnReturnDivision() == "10" && this.getModel("LocalDataModel").getProperty("/UserType") != "TCI_Admin") {
				var findPlanArray6000 = DataManager.oPlanArray6000.findIndex((item) => item == oSelectedPlan);
				if (oOdoVal > 60000 && findPlanArray6000 > -1) {
					this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", true);
					this.getView().byId("idNewECPMsgStripPlan").setText(this.oBundle.getText("NewVehiclePlanRule"));
					this.getView().byId("idNewECPMsgStripPlan").setType("Error");
				} else {
					this.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
				}
			}

			if (oOdoVal <= 50000 && this._fnDifSaleDRegD().diffSaleRegDate < 1095 && (oAgrType == "NEW VEHICLE AGREEMENT" || oAgrType ==
					"ENTENTE POUR VÉHICULE NEUF")) {
				this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "Yes");
				this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", this.oBundle.getText("Yes"));
			} else if (oOdoVal > 50000 || this._fnDifSaleDRegD().diffSaleRegDate > 1095) {
				this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard", "No");
				this.getView().getModel("EcpFieldData").setProperty("/ZecpRoadhazard1", this.oBundle.getText("No"));
			}

			this.updateSurchargeValue(this.getModel("LocalDataModel").getProperty("/odometerState"));

		},

		updateSurchargeValue: function (odoMeterState) {
			var oECPData = this.getView().getModel("EcpFieldData").getData();
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss",
				UTC: true
			});

			var oFormatedSaleDate = oDateFormat.format(new Date(this.getView().getModel("EcpFieldData").getProperty("/ZecpSaleDate")));

			if (odoMeterState === "None") {
				var oZECPModel = this.getModel("EcpSalesModel");
				if (this.getModel("LocalDataModel").getProperty("/odometerState") === "None") {
					oZECPModel.read("/zc_ecp_planpricing_dataSet", {
						urlParameters: {
							"$filter": "MGANR eq '" + oECPData.ZecpPlancode + "'and ODMTR eq'" + oECPData.ZecpOdometer + "'and VIN eq '" + oECPData.ZecpVin +
								"'and ZECPAGRTYPE eq'" + oECPData.ZecpAgrType + "'and ZECPSALE_DATE eq datetime'" + oFormatedSaleDate + "'"
						},
						success: $.proxy(function (data) {

							this.getModel("LocalDataModel").setProperty("/oPlanPricingData", data.results[0]);

							var oEcpFieldDataModel = this.getView().getModel("EcpFieldData");
							oEcpFieldDataModel.setProperty("/ZecpRetPrice", data.results[0].ZECP_RET_PRICE);
							// this.oECPData.ZecpRetPrice = data.results[0].ZECP_RET_PRICE;
							oEcpFieldDataModel.setProperty("/ZecpDefSurchrg", data.results[0].ZECP_DEF_SURCHRG);
							// this.oECPData.ZecpDefSurchrg = data.results[0].ZECP_DEF_SURCHRG;
							oEcpFieldDataModel.setProperty("/ZecpVehSurchrgAmt", data.results[0].ZECP_VEH_SURCHRG_AMT);
							// this.oECPData.ZecpVehSurchrgAmt = data.results[0].ZECP_VEH_SURCHRG_AMT;
							oEcpFieldDataModel.setProperty("/ZecpListpurprice", data.results[0].ZECP_LISTPURPRICE);
							//DMND0003027 demand changes done.
							if(data.results[0].BENEFITSFLAG === "X"){
							oEcpFieldDataModel.setProperty("/ZbenefitFlag1", this.getView().getModel("i18n").getResourceBundle().getText("Yes"));
							this.getView().getModel("EcpFieldData").setProperty("/ZecpBenefitsFlg", "Yes");
							// this.oECPData.ZecpListpurprice = data.results[0].ZECP_LISTPURPRICE;
							}
						}, this),
						error: function (err) {
							console.log(err);
						}
					});
				}
			} else {
				return;
			}
		},

		planKmval: function (planId) {
			var planArry = this.getModel("LocalDataModel").getProperty("/ValidPlanSetData");

			var kmStr;
			if (planArry.length > 0) {
				var planLen = planArry.length
				for (var i = 0; i < planLen; i++) {
					if (planArry[i].MGANR = planId) {
						kmStr = planArry[i].KMS;
						break;
					}
				}
			}
			if (kmStr.length > 0) {
				var kmSplitArr = kmStr.split(',');
				if (kmSplitArr.length > 0) {
					var kmSplitArrLen = kmSplitArr.length;
					var numKm = kmSplitArr[0];
					for (var i = 1; i < kmSplitArrLen; i++) {
						numKm = numKm + "" + kmSplitArr[i];
					}
					console.log(numKm);
					return numKm;
				}
			}

		},
		onDelete: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var oECPData = this.getView().getModel("EcpFieldData").getData();

			var dialog = new Dialog({
				title: oBundle.getText("DltECPApp"),
				type: 'Message',
				content: new Text({
					text: oBundle.getText("AreUSureLikeDeleteApp")
				}),
				beginButton: new Button({
					text: oBundle.getText("Yes"),
					press: function () {
						var oModel = that.getView().getModel("EcpSalesModel");
						this._oToken = oModel.getHeaders()['x-csrf-token'];
						$.ajaxSetup({
							headers: {
								'X-CSRF-Token': this._oToken
							}
						});

						oModel.remove("/zc_ecp_crud_operationsSet(ZecpIntApp='" + oECPData.ZecpIntApp + "',ZecpVin='" + oECPData.ZecpVin + "')", {
							method: "DELETE",
							success: function (data) {
								oModel.refresh();
								MessageToast.show(oBundle.getText("AppDeleted") + oECPData.ZecpVin);
							},
							error: function (e) {
								alert("error");
							}
						});

						that.getRouter().navTo("ApplicationList");
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("Cancel"),
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		OnBack: function (oEvent) {
			this.getView().getModel("oSetProperty").setProperty("/oTab1visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
			this.ogetSelectedKey = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
			var ogetKey = this.ogetSelectedKey.split("Tab")[1];

			if (ogetKey > 1 && ogetKey <= 6) {
				var oSelectedNum = ogetKey - 1;
				this.getView().getModel("oSetProperty").setProperty("/oTab" + oSelectedNum + "visible", true);
				this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Tab" + oSelectedNum + "");

			} else {
				this.getModel("EcpSalesModel").refresh();

				this.getRouter().navTo("ApplicationList");

			}
			var oCurrSect = this.getView().getContent()[1];
			var objPgSection = this.getView().byId("testSection");
			oCurrSect.scrollToSection(objPgSection.getId());
		},

		OnBackSecondary: function () {
			this.getRouter().navTo("ApplicationList");
			this.getModel("EcpSalesModel").refresh();
		},
		onBackList: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("SaveChanges"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("WillYouLikeSaveChanges")
				}),

				buttons: [
					new Button({
						text: oBundle.getText("Yes"),
						press: function () {
							that.oECPData = that.getView().getModel("EcpFieldData").getData();
							var objSave = this._fnObject("SAVE", "PENDING");
							if (this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") {
								objSave.ZecpUserid = "ECP Support";
							}
							//objSave.ZecpAgrType =  that.getTypeOfAggreementKey(that.oECPData.ZecpAgrType);         
							var oEcpModel = that.getModel("EcpSalesModel");
							this._oToken = oEcpModel.getHeaders()['x-csrf-token'];
							$.ajaxSetup({
								headers: {
									'X-CSRF-Token': this._oToken
								}
							});
							oEcpModel.create("/zc_ecp_crud_operationsSet", objSave, {
								success: $.proxy(function () {

									oEcpModel.refresh();
									MessageToast.show(oBundle.getText("RecordSaved"));
									that.getRouter().navTo("ApplicationList");
								}, that),
								error: function () {
									console.log("error");
								}
							});

							dialog.close();
						}
					}),

					new Button({
						text: oBundle.getText("No"),
						press: function () {

							that.getRouter().navTo("ApplicationList");
							dialog.close();
						}
					}),
					new Button({
						text: oBundle.getText("Cancel"),
						press: function () {
							dialog.close();
						}
					})

				],

				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		_fnValidateFields: function () {
			var oView = this.getView();
			var aInputsArr = [];

			var ArrayLien = [
				oView.byId("idAmtFin").getValue(),
				oView.byId("idLienHolder").getValue(),
				oView.byId("idLienTerms").getValue()
			];

			var IndexArrayLien = ArrayLien.findIndex(e => e != "");

			// 			var aInputs;

			if (IndexArrayLien > -1) {
				aInputsArr = [
					oView.byId("idPlanPurchase"),
					oView.byId("idOdo"),
					oView.byId("idVPrice"),
					oView.byId("idAmtFin"),
					oView.byId("idLienHolder"),
					oView.byId("idLienTerms")
				];
			} else {
				aInputsArr = [
					oView.byId("idPlanPurchase"),
					oView.byId("idOdo"),
					oView.byId("idVPrice")

				];
			}

			return aInputsArr;

		},

		onSaveApp: function (isFromSubmit) {

			var retPrice = this.getModel("LocalDataModel").getProperty("/oPlanPricingData/ZECP_LISTPURPRICE");
			var planPrice = this.getView().getModel("EcpFieldData").getProperty("/ZecpPlanpurchprice");
			var amtFin = this.getView().getModel("EcpFieldData").getProperty("/ZecpAmtFin");
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oOdometer = this.getView().byId("idOdoVal");
			var oOdoVal = oOdometer.getValue();
			var oidPlanCode = this.getView().getModel("EcpFieldData").getProperty("/ZecpPlancode");

			this.oECPData.ZecpVehPrice = $(".ZecpVehPriceCls input").val();
			this.oECPData.ZecpPlanpurchprice = $(".ZecpPlanpurchpriceCls input").val();
			var sInputArr = this._fnValidateFields();
			var bValidationError;
			jQuery.each(sInputArr, function (i, oInput) {
				if (oInput.getVisible() == true) {
					bValidationError = DataManager._validateInput(oInput) || bValidationError;
				}
			});
			if (bValidationError) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("FillMendatoryField"));

			} else if (parseFloat(planPrice) > parseFloat(retPrice)) {

				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("ExceedPlanPrice"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "Error");

			} else if (parseFloat(planPrice) < 0) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("negPriceNotAllowed"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "Error");
			} else if (parseFloat(amtFin) < 0) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("negPriceNotAllowed"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/AmtFinState", "Error");
			} else if (
				(this.getView().byId("idNewECPMsgStripPlan").getProperty("visible") == false) && !(isFromSubmit.isFrmSubmit)) {
				this.getModel("LocalDataModel").setProperty("/VehPriceState", "None");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "None");
				this.getView().byId("idNewECPMsgStrip").setText("");
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
				this.getView().byId("idNewECPMsgStrip").setType("None");
				this.getModel("LocalDataModel").setProperty("/AmtFinReq", false);
				this.getModel("LocalDataModel").setProperty("/AmtFinState", "None");
				this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", false);
				this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "None");
				this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
				this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", false);
				//this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStripPlan").setProperty("visible", false);
				this.getView().byId("idNewECPMsgStripPlan").setText("");

				this.getModel("LocalDataModel").setProperty("/odometerState", "None");

				this.oECPData = this.getView().getModel("EcpFieldData").getData();
				var objSave = this._fnObject("SAVE", "PENDING");
				if (this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") {
					objSave.ZecpUserid = "ECP Support";
				}
				console.log(objSave);
				//objSave.ZecpAgrType =  this.getTypeOfAggreementKey(this.oECPData.ZecpAgrType);  
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				var oEcpModel = this.getModel("EcpSalesModel");
				this._oToken = oEcpModel.getHeaders()['x-csrf-token'];
				$.ajaxSetup({
					headers: {
						'X-CSRF-Token': this._oToken
					}
				});
				oEcpModel.create("/zc_ecp_crud_operationsSet", objSave, {
					success: $.proxy(function () {

						MessageToast.show(oBundle.getText("DraftCreated") + this.oECPData.ZecpVin);
						oEcpModel.refresh();
						this.getRouter().navTo("ApplicationList");
						this.getModel("LocalDataModel").updateBindings(true);
						this.getModel("LocalDataModel").refresh();

						this.getModel("EcpSalesModel").refresh(true);

					}, this),
					error: function () {

					}
				});
			}

		},

		onEnterPlanPurchasePrice: function (oEvent) {
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oval = oEvent.getParameters().value;
			var retPrice = this.getModel("LocalDataModel").getProperty("/oPlanPricingData/ZECP_LISTPURPRICE");

			if (parseFloat(oval) <= parseFloat(retPrice) && parseFloat(oval) >= 0) {
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "None");
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
				this.getView().byId("idNewECPMsgStrip").setText("");
			} else if (parseFloat(oval) < 0) {
				MessageToast.show(this.oBundle.getText("negPriceNotAllowed"));
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("negPriceNotAllowed"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "Error");
			} else {
				MessageToast.show(this.oBundle.getText("ExceedPlanPrice"));
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("ExceedPlanPrice"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "Error");

			}
		},

		onUpdateSavedApp: function (oEvent) {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oECPData = this.getView().getModel("EcpFieldData").getData();
			var oEcpModel = this.getModel("EcpSalesModel");
			this._oToken = oEcpModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});
			var obj = {
				"ZecpIntApp": this.oAppId,
				"ZecpVin": this.getModel("LocalDataModel").getProperty("/ApplicationOwnerData/VIN"),
				"ZecpOdometer": oECPData.ZecpOdometer,
				"ZecpVehPrice": oECPData.ZecpVehPrice,
				"ZecpAmtFin": oECPData.ZecpAmtFin,
				"ZecpLienholder": oECPData.ZecpLienholder,
				"ZecpPlanpurchprice": oECPData.ZecpPlanpurchprice,
				"PrOwndCert": oECPData.PrOwndCert || "0.00",
				"Odmtr": oECPData.ZecpOdometer,
				"ZretailPrice": oECPData.ZretailPrice,
				"ZamtFincd": oECPData.ZamtFincd,
				"BccPlnLienHldr": oECPData.BccPlnLienHldr,
				"ZecpLienterms": oECPData.ZecpLienterms,
				"ZecpBenefitsFlg": oECPData.ZecpBenefitsFlg,
				"ZecpSaleDate": this._fnDateFormat(this.getView().getModel("EcpFieldData").getProperty("/ZecpSaleDate")),
				"ZecpUserid": this.getModel("LocalDataModel").getProperty("/LoggedInUser")
			};

			if (this.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") {
				obj.ZecpUserid = "ECP Support";
			}

			var retPrice = this.getModel("LocalDataModel").getProperty("/oPlanPricingData/ZECP_LISTPURPRICE");
			var planPrice = this.getView().getModel("EcpFieldData").getProperty("/ZecpPlanpurchprice");
			var amtFin = this.getView().getModel("EcpFieldData").getProperty("/ZecpAmtFin");

			var sInputArr = this._fnValidateFields();
			var bValidationError;
			jQuery.each(sInputArr, function (i, oInput) {
				if (oInput.getVisible() == true) {
					bValidationError = DataManager._validateInput(oInput) || bValidationError;
				}
			});
			if (bValidationError) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("FillMendatoryField"));

			} else if (parseFloat(planPrice) > parseFloat(retPrice)) {

				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(oBundle.getText("ExceedPlanPrice"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "Error");

			} else if (parseFloat(planPrice) < 0) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("negPriceNotAllowed"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/PlanPurchase", "Error");
			} else if (parseFloat(amtFin) < 0) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", true);
				this.getView().byId("idNewECPMsgStrip").setText(this.oBundle.getText("negPriceNotAllowed"));
				this.getView().byId("idNewECPMsgStrip").setType("Error");
				this.getModel("LocalDataModel").setProperty("/AmtFinState", "Error");
			} else if ((this.getView().byId("idNewECPMsgStripPlan").getProperty("visible") == false)) {
				this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
				oEcpModel.update("/zc_ecp_crud_operationsSet(ZecpIntApp='" + this.oAppId + "',ZecpVin='" + this.getModel("LocalDataModel").getProperty(
						"/ApplicationOwnerData/VIN") +
					"')", obj, {
						method: "PUT",
						success: $.proxy(function (response) {
							oEcpModel.refresh();
							this.getRouter().navTo("ApplicationList");
							MessageToast.show(oBundle.getText("UpdatedDataHasbeenSavedSuccessFully"));

						}, this),
						error: function () {
							MessageToast.show(oBundle.getText("PleaseTryAgainToSave"));
						}
					});
			}

		},

		//Check and Validate DMS data with Vechical owner to Verify Address Defect_ID: 9618
		//Comparing  Name City Provinecn, Address and Postal code
		validateAgrmtOwnrNVechOwnr: function () {

			var currSettings = this.getView().getModel("oSetProperty").getData();
			if (currSettings.oAgrOwnerDMS) {
				var localDataModel = this.getModel("LocalDataModel").getData();
				var aggreDmsData = localDataModel.ApplicationOwnerData;
				var vechicalAgreementOwnerDetail = localDataModel.AgreementOwnerName;
				var vechicalOwnerDetail = localDataModel.OwnerData;

				if (aggreDmsData.CustomerName.toUpperCase().trim() !== vechicalAgreementOwnerDetail.FirstName.toUpperCase().trim()) {
					return false;
				}
				//checking Last Name
				if (aggreDmsData.CustomerLastName.toUpperCase().trim() !== vechicalAgreementOwnerDetail.LastName.toUpperCase().trim()) {
					return false;
				}

				if (aggreDmsData.PostalCode.toUpperCase() !== vechicalOwnerDetail.PostalCode.toUpperCase()) {
					return false;
				}

				return true;

			} else {
				return true;
			}

		},
		//Verify Address Defect_ID: 9618
		showSubmitValidationError: function () {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var dialog = new Dialog({
				title: 'Error',
				type: 'Message',
				state: 'Error',
				content: new Text({
					text: oBundle.getText("AgreementOwner_And_VechicalOwner_Address_Data_MisMatch")
				}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		validateLineFields: function () {
			var oEcpFieldM = this.getView().getModel("EcpFieldData").getData();
			var localModel = this.getView().getModel("LocalDataModel");
			var finAmt = oEcpFieldM.ZecpAmtFin;

			var lienholderName = oEcpFieldM.ZecpLienholder;

			var lienTerms = oEcpFieldM.ZecpLienterms;

			if (!($.isEmptyObject(finAmt)) || !($.isEmptyObject(lienholderName)) || !($.isEmptyObject(lienTerms))) {
				if ($.isEmptyObject(finAmt) || $.isEmptyObject(lienholderName) || $.isEmptyObject(lienTerms)) {
					if ($.isEmptyObject(finAmt)) {
						//	setError State

						this.getModel("LocalDataModel").setProperty("/AmtFinReq", true);
						this.getModel("LocalDataModel").setProperty("/AmtFinState", "Error");

					} else {

						this.getModel("LocalDataModel").setProperty("/AmtFinReq", true);
						this.getModel("LocalDataModel").setProperty("/AmtFinState", "None");
					}

					if ($.isEmptyObject(lienholderName)) {

						this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", true);
						this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "Error");
					} else {

						this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", true);
						this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "None");
					}
					if ($.isEmptyObject(lienTerms)) {

						this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", true);
						this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "Error");
					} else {

						this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", true);
						this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
					}
				} else {

					this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", true);
					this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
					this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", true);
					this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "None");
					this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", true);
					this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
					return true;
				}
				return false;
			} else {

				this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", false);
				this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
				this.getModel("LocalDataModel").setProperty("/ZecpLienHolderReq", false);
				this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "None");
				this.getModel("LocalDataModel").setProperty("/ZecpTermsReq", false);
				this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
				return true;
			}
		},
		/*
			Defect:9937
			Auth Vinay Chandra
		*/
		setDataValueOnEcpData: function (objSub) {
			var oOwnerData = this.getModel("LocalDataModel").getProperty("/OwnerData");
			var oPricingModelData = this.getModel("LocalDataModel").getProperty("/PricingModelData");
			var oAgreementOwnerName = this.getModel("LocalDataModel").getProperty("/AgreementOwnerName");
			objSub.ZecpCustNum = oOwnerData.BusinessPartner;
			objSub.BPTYPE = oPricingModelData.BPTYPE;

			objSub.ZecpLastName = oAgreementOwnerName.LastName;
			objSub.ZecpCustName = oAgreementOwnerName.FirstName;
			objSub.ZecpAddress = oOwnerData.StreetName;
			objSub.ZecpCity = oOwnerData.CityName;
			objSub.ZecpProvince = oOwnerData.Region;
			objSub.ZecpPostalcode = oOwnerData.PostalCode;
			objSub.ZecpEmail = oOwnerData.EmailAddress;
			objSub.ZecpBusPhone = oOwnerData.ZecpBusPhone;
			objSub.ZecpHomePhone = oOwnerData.FaxNumber;

		},
		/* end of Defect 9937 Auth Vinay Chandra*/

		/*
			Defect:8432
			Auth Vinay Chandra
		*/
		resetValidationError: function () {

			//Lien related Input Fields

			this.getModel("LocalDataModel").setProperty("/ZecpTermsState", "None");
			this.getModel("LocalDataModel").setProperty("/ZecpLienHolderState", "None");
			this.getModel("LocalDataModel").setProperty("/AmtFinState", "None");

			this.getModel("LocalDataModel").setProperty("/VehPriceState", "None");
			this.getModel("LocalDataModel").setProperty("/PlanPurchase", "None");
			this.getView().byId("idNewECPMsgStrip").setText("");
			this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
			this.getView().byId("idNewECPMsgStrip").setType("None");
			this.getModel("LocalDataModel").setProperty("/odometerState", "None");

		},

		onSubmitApp: function () {
			//this._Step04MandatoryFn();
			this.getView().getModel("oSetProperty").setProperty("/submitBtn", false);
			this.resetValidationError();
			//this._fnExistAppCheck();
			$.proxy(this._fnValidateSubmit(), this);

			//ReValidating form

		},
		_fnBusIndConv: function (type) {
			if (type == "Organization" || type == "Organisation") {
				return "Business";
			} else {
				return "Individual";
			}
		},
		_fnObject: function (elm, stat) {
			var currentDate = new Date();
			var zagr = this.agreementTypeChange(this.oECPData.ZecpAgrType);
			var IndBU = this.getModel("LocalDataModel").getProperty("/VechOwnrSectAddOnAppSub_BpType");
			var crudObj = {
				DBOperation: elm,
				BPTYPE: this.getView().getModel("LocalDataModel").getProperty("/PricingModelData/BPTYPE"),
				ZecpIntApp: "",
				ZecpMake: this.oECPData.ZecpMake,
				ZecpAppNum: "",
				ZecpVin: this.oECPData.ZecpVin.trim(),
				ZecpAgrNum: "",
				ZecpDealcode: this.getModel("LocalDataModel").getProperty("/sCurrentDealer"),
				ZecpAppStat: stat,
				ZecpSaleDate: this._fnDateFormat(this.oECPData.ZecpSaleDate),
				ZecpOdometer: this.oECPData.ZecpOdometer,
				ZecpAgrType: zagr,
				ZecpEffDate: null,
				ZecpExpDate: null,
				ZecpDealName: "",
				ZecpSurchrgFl: "N",
				ZecpPreowned: this.oECPData.PrOwndCert,
				ZecpCustNum: this.oECPData.ZecpCustNum,
				ZecpCustName: this.oECPData.ZecpCustName,
				ZecpMidName: "",
				ZecpLastName: this.oECPData.ZecpLastName,
				ZecpBusPhone: this.oECPData.ZecpBusPhone,
				ZecpEmail: this.oECPData.ZecpEmail,
				ZecpSubDate: this._fnDateFormat(currentDate),
				ZecpAutocode: this.oECPData.ZecpAutocode,
				ZecpVehPrice: this.oECPData.ZecpVehPrice || "0.00",
				ZecpAmtFin: this.oECPData.ZecpAmtFin || "0.00",
				ZecpLienholder: this.oECPData.ZecpLienholder || "",
				ZecpLienterms: this.oECPData.ZecpLienterms || "00",
				ZecpPlancode: this.oECPData.ZecpPlancode || "",
				ZecpRetPrice: this.oECPData.ZecpRetPrice || "0.00",
				ZecpDefSurchrg: this.oECPData.ZecpDefSurchrg || "0.00",
				ZecpVehSurchrgAmt: this.oECPData.ZecpVehSurchrgAmt || "0.00",
				ZecpListpurprice: this.oECPData.ZecpListpurprice || "0.00",
				ZecpVehsurchrg: this.oECPData.ZecpVehSurchrgAmt || "0.00",
				ZecpRoadhazard: this.oECPData.ZecpRoadhazard,
				ZecpBenefitsFlg: this.getView().getModel("EcpFieldData").getProperty("/ZecpBenefitsFlg"),
				BccAgrmntSaleDt: this._fnDateFormat(this.oECPData.ZecpSaleDate),
				ZecpSource: this.oECPData.ZecpSource || "ECP",
				ZecpDatecreated: this._fnDateFormat(currentDate),
				ZecpLastupdate: null,
				ZecpSaletype: "",
				ZecpFueltype: "G",
				ZecpCylnum: "4",
				ZecpAdddata1: "",
				ZecpAdddata2: "",
				ZecpAdddata3: "",
				ZecpAdddata4: "",
				ZecpAdddata5: "",
				ZecpCompName: "",
				ZecpAddress: this.oECPData.ZecpAddress,
				ZecpCity: this.oECPData.ZecpCity,
				ZecpProvince: this.oECPData.ZecpProvince,
				ZecpPostalcode: this.oECPData.ZecpPostalcode,
				ZecpHomePhone: this.oECPData.ZecpHomePhone,
				ZecpBusExt: "",
				ZecpBusOrInd: this._fnBusIndConv(IndBU),
				ZecpModelcode: this.oECPData.ZecpModelcode,
				BccEcpAgrmntNum: "",
				BccVin: this.oECPData.ZecpVin,
				BccPlanCd: this.oECPData.ZecpPlancode,
				BccAplDlrshpNum: this.getModel("LocalDataModel").getProperty("/sCurrentDealer"),
				BccAgrStCd: "A",
				AgrStDt: this._fnDateFormat(currentDate),
				BccAgrEvTypCd: "NEW",
				BccVoasPartNum: "",
				BccAgrmntDlrNum: this.getModel("LocalDataModel").getProperty("/sCurrentDealer"),
				BccEcpAutoCd: this.oECPData.ZecpAutocode,
				BccAgrmntExtcntr: "0.00",
				BccAgrmntPrcAmt: this.oECPData.ZecpPlanpurchprice || "0.00",
				Dedctble: "",
				VehSurchLst: "",
				BccDtSrchrgFlg: "",
				BccDefSrchrgAmt: this.oECPData.ZecpDefSurchrg || "0.00",
				BccAgrmntYrCd: "",
				BccAgrmntSerNo: "0.00",
				BccVehSrchrgFlg: "",
				BccVehSrchrgAmt: this.oECPData.ZecpVehSurchrgAmt || "0.00",
				BccDlrCommsnAmt: "0.00",
				BccCdbCustNum: this.oECPData.ZecpCustNum,
				BccAgrmntThruKm: "0.00",
				BccLubBnftFlg: "",
				BccVehStsKm: this.oECPData.ZecpOdometer,
				BccAgrmntDlrPfl: "",
				BccPlnLienHldr: "",
				BccPlnLienTrmth: "0.00",
				BccPlnLienAmt: "0.00",
				BccDlrNetDebamt: "0.00",
				BccNetDebAmt: "0.00",
				BccNetGwDebAmt: "0.00",
				BccNetGwCreAmt: "0.00",
				BccNetGwOffCre: "0.00",
				BccNetRecvryDeb: "0.00",
				BccCncTsfFee: "0.00",
				BccCustRfndAmt: "0.00",
				BccAdjstdAdmAmt: "0.00",
				BccAdjstdFdAmt: "0.00",
				BccAdjstdRapAmt: "0.00",
				BccAdjstdSurAmt: "0.00",
				BccAgrActSrDes: "",
				BccAdjstrCmnts: "",
				BccUsrCalAmtflg: "",
				BccRdHzrd: "",
				Odmtr: this.oECPData.ZecpOdometer,
				TrnfrOdometer: "",
				TrnfrFee: "",
				PrOwndCert: this.oECPData.PrOwndCert,
				PrVendorFlag: "",
				BccInscTrnmtFl: "",
				BccRdsdTrnmtFl: "A",
				BccMktngTrnmtFl: "",
				BccDlrDebGst: "0.00",
				BccDlrDebPst: "0.00",
				BccCustRfndGst: "0.00",
				BccCustRfndPst: "0.00",
				BccFinclAjstrId: "",
				BccDebitRequest: "",
				BccCreditRequest: "",
				BccCrtrUserid: "",
				BccCrtnTmstmp: "",
				BccLstUpdPltf: "",
				BccLstUpdPgmid: "",
				BccLstUpdUserid: "",
				BccLstUpdTmstmp: "",
				ZamtFincd: "0.00",
				ZretailPrice: "0.00",
				ZecpPlanpurchprice: this.oECPData.ZecpPlanpurchprice || "0.00",
				ZecpUserid: this.getModel("LocalDataModel").getProperty("/LoggedInUser")
			};
			// ##change done for DMND0003001 by Minakshi

			return crudObj;
		},

		_fnValidateSubmit: function () {
			var oCounter = 0;
			this.getView().getModel("oSetProperty").setProperty("/subYes", true);
			if (!this.oECPData) {
				this.oECPData = this.getView().getModel("EcpFieldData").getData();
			}
			var fromSubmitObj = {};
			fromSubmitObj.isFrmSubmit = true;
			$.proxy(this.onSaveApp(fromSubmitObj), this);

			if (this.getView().byId("idNewECPMsgStrip").getProperty("visible") || this.getView().byId("idNewECPMsgStripPlan").getProperty(
					"visible")) {
				this.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
				return;
			}

			if (!this.validateAgrmtOwnrNVechOwnr()) {
				this.showSubmitValidationError();
				this.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
				return;
			}

			if (!this.validateLineFields()) {
				this.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
				return;
			}

			var oEcpFieldM = this.getView().getModel("EcpFieldData").getData();
			var oZECPModel = this.getModel("EcpSalesModel");
			oZECPModel.read("/zc_ecp_vehicle_detailSet", {
				urlParameters: {
					"$filter": "VIN eq '" + oEcpFieldM.ZecpVin + "'"
				},
				success: $.proxy(function (vedata) {
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

			var that = this;
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var dialog = new Dialog({
				title: oBundle.getText("SubmitApp"),
				type: "Message",
				content: [
					new Text({
						text: oBundle.getText("AreYouSureToSaveChangesSubmitApptoTCIforAgreementGeneration"),
						id: "idSubmitMessg"
					})
				],
				beginButton: new Button({
					text: oBundle.getText("SubmitApplication"),
					visible: that.getView().getModel("oSetProperty").getProperty("/subYes"),
					press: function () {
						oCounter += 1;
						dialog.close();
						that.getView().getModel("oSetProperty").setProperty("/subYes", false);
						that.oECPData = that.getView().getModel("EcpFieldData").getData();
						var objSub = that._fnObject("SUB", "DELETED");
						if (that.getModel("LocalDataModel").getProperty("/UserType") == "TCI_Admin") {
							objSub.ZecpUserid = "ECP Support";
						}
						//objSub.ZecpAgrType =  that.getTypeOfAggreementKey(that.oECPData.ZecpAgrType);                  
						var oEcpModel = that.getModel("EcpSalesModel");
						/*
						Defect:9937
						Auth Vinay Chandra
						*/
						that.setDataValueOnEcpData(objSub);

						/* End Of Defect 9937 */
						this._oToken = oEcpModel.getHeaders()['x-csrf-token'];
						$.ajaxSetup({
							headers: {
								'X-CSRF-Token': this._oToken
							}
						});
						var oBusinessModel = that.getModel("ApiBusinessModel");
						if (oCounter < 2) {
							oEcpModel.create("/zc_ecp_crud_operationsSet", objSub, {
								success: function (data, response) {
									console.log(response.data);
									that.getView().getModel("LocalDataModel").setProperty("/responseData", response.data);
									if (that.oECPData.ZecpIntApp.charAt(0) === "D") {
										oEcpModel.remove("/zc_ecp_crud_operationsSet(ZecpIntApp='" + that.oECPData.ZecpIntApp + "',ZecpVin='" + that.oECPData
											.ZecpVin +
											"')", {
												method: "DELETE",
												success: function (data) {
													oEcpModel.refresh();
												},
												error: function (e) {
													console.log("error");
												}
											});
									}
									var oAgr = response.data.ZecpAgrNum;
									var oCustomer = response.data.ZecpCustNum;
									oEcpModel.read("/zc_ecp_agreement", {
										urlParameters: {
											"$filter": "AgreementNumber eq '" + oAgr + "'"
										},
										success: function (ret) {
											console.log(ret);
											if (ret.results[0] && (parseInt(ret.results[0].CancelFee) === 0)) {
												ret.results[0].CancelFee = "100.00";
											}
											ret.results[0].RoadHazard = that.oBundle.getText(ret.results[0].RoadHazard); // added translation
											ret.results[0].BenefitsFlag = that.oBundle.getText(ret.results[0].BenefitsFlag); // added translation
											that.getView().getModel("LocalDataModel").setProperty("/AgreementData", ret.results[0]);

											var oDealer = ret.results[0].DealershipNumber;
											var dealerStr = ret.results[0].DealershipNumber
											ret.results[0].DealershipNumber = dealerStr.substring(dealerStr.length - 5, dealerStr.length);
											if (oDealer) {
												oBusinessModel.read("/A_BusinessPartner", {
													urlParameters: {
														"$filter": "BusinessPartner eq '" + oDealer + "'"
													},
													success: function (businessData) {
														if (businessData.results.length > 0) {
															that.getModel("LocalDataModel").setProperty("/DealerData", businessData.results[0]);
														}
													}
												});
											}
										},
										error: function () {}
									});

									oBusinessModel.read("/A_BusinessPartnerAddress", {
										urlParameters: {
											"$filter": "BusinessPartner eq '" + oCustomer + "' ",
											"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress"

										},
										success: function (bData) {

											that.getModel("LocalDataModel").setProperty("/BusinessPartnerData", bData.results[0]);

										},
										error: function () {
											console.log("Error");
										}
									});

									that.printPrevDialogBox = sap.ui.xmlfragment("zecp.view.fragments.AgreementDetails", that);
									that.getView().addDependent(that.printPrevDialogBox);
									that.printPrevDialogBox.open();
									that.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
								},
								error: $.proxy(function (err) {
									//console.log(err + "Error Message for duplicate vin");
									var errorMsg = JSON.parse(err.responseText);
									var msg = errorMsg.error.message.value;
									if (msg == "Duplicate Agreement") {
										MessageBox.show(oBundle.getText("ActiveAgrexist"), MessageBox.Icon.ERROR, "Error", MessageBox.Action.OK, null, null);
									} else {
										MessageBox.show(oBundle.getText("ApplicationIsnotSubmitted"), MessageBox.Icon.ERROR, "Error", MessageBox.Action.OK,
											null, null);
									}

									that.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
								}, this)
							});
						}

					}
				}),

				endButton: new Button({
					text: oBundle.getText("Cancel"),
					press: function () {
						dialog.close();
						that.getView().getModel("oSetProperty").setProperty("/submitBtn", true);
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onPrintAgreement: function () {

			var oAgr = this.getView().getModel("LocalDataModel").getProperty("/AgreementData/AgreementNumber");

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

			}
			this.getModel("LocalDataModel").setProperty("/printBtnState", false);

		},
		onClose: function (oEvent) {
			oEvent.getSource().getParent().close();
		},
		onPressBackPress: function () {
			this.getRouter().navTo("ApplicationList");
		},
		onPressBackPressAgr: function () {
			var that = this;
			if (this.getModel("LocalDataModel").getProperty("/printBtnState") == true) {
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				var dialog = new Dialog({
					title: oBundle.getText("PrintAgreement"),
					type: "Message",
					content: [
						new Text({
							text: oBundle.getText("DoYouWanttoPrintAgreement"),

						})
					],
					beginButton: new Button({
						text: oBundle.getText("Yes"),
						press: $.proxy(function () {
							var oAgr = this.getView().getModel("LocalDataModel").getProperty("/AgreementData/AgreementNumber");

							var isProxy = "";
							if (window.document.domain == "localhost") {
								isProxy = "proxy";
							}
							var w = window.open(isProxy +
								"/node/ZECP_SALES_ODATA_SERVICE_SRV/zc_ecp_agreement_printSet(AGRNUM='" + oAgr + "',LANG='E')/$value",
								'_blank');
							if (w == null) {
								console.log("Error");

							}

							dialog.close();
							that.printPrevDialogBox.destroy();
							this.getRouter().navTo("ApplicationList");
						}, this)
					}),

					endButton: new Button({
						text: oBundle.getText("No"),
						press: $.proxy(function () {
							dialog.close();
							that.printPrevDialogBox.destroy();
							this.getRouter().navTo("ApplicationList");
						}, this)
					}),
					afterClose: function () {
						that.printPrevDialogBox.destroy();
						dialog.destroy();
					}
				});

				dialog.open();
			} else {
				that.printPrevDialogBox.destroy();
				this.getRouter().navTo("ApplicationList");
			}

		},
		onExit: function () {
			this.destroy();
			this.getView().unbindElement();
			this.getModel("EcpSalesModel").refresh();
			this.getView().byId("idNewECPMsgStrip").setProperty("visible", false);
			this.getView().byId("idNewECPMsgStrip").setType("None");
			this.getView().byId("idNewECPMsgStrip").destroy();
		},
		getValidPlanSet: function (oECPDataObj) {

			var oECPData = oECPDataObj.getData()
			var zEcpModel = this.getModel("EcpSalesModel");
			this._oToken = zEcpModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});

			var oCustomerNum;
			if (oECPData.ZecpCustNum) {
				oCustomerNum = oECPData.ZecpCustNum.substr(5);
			}

			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss",
				UTC: true
			});
			var oFormatedSaleDate = oDateFormat.format(new Date(oECPData.ZecpSaleDate));
			var agreeTypeKey = this.getTypeOfAggreementKey(oECPData.ZecpAgrType);
			zEcpModel.read("/zc_ecp_valid_plansSet", {
				urlParameters: {
					"$filter": "VIN eq '" + oECPData.ZecpVin + "'and KUNNR eq '" + oCustomerNum + "'and ZECPAGRTYPE eq '" + agreeTypeKey +
						"'and ZECPSALE_DATE eq datetime'" + oFormatedSaleDate + "' and LANGUAGE eq '" + lanKey + "'",
					"$expand": "ZC_ECP_PLANSSET"
				},
				success: $.proxy(function (data) {

					this.getModel("LocalDataModel").setProperty("/ValidPlanSetData", data.results[0].ZC_ECP_PLANSSET.results);

				}, this),
				error: function () {
					console.log("Error");
				}
			});

		},
		getCIClink: function (dealercode, vin) {

			var locationHref = window.location.href;
			var linkAddress = "";
			if (locationHref.search("dev-ecpsales") > -1 || locationHref.search("webide") > -1) {
				linkAddress = "https://b2b.sit.toyota.ca/CICWeb/customerInfo.htm?.lang=en";
			} else if (locationHref.search("qas-ecpsales") > -1) {
				linkAddress = "https://b2b.acpt.toyota.ca/CICWeb/customerInfo.htm?.lang=en";
			} else if (locationHref.search("uat-ecpsales") > -1) {
				// linkAddress = "https://b2b.acpt.toyota.ca/CICWeb/customerInfo.htm?.lang=en";
				//Changed ling to QA in UAT/ Based on Defect Id:13822,10002
				linkAddress = "https://b2b.acpt.toyota.ca/CICWeb/customerInfo.htm?.lang=en";
			} else if (locationHref.search("ecpsales.scp") > -1) {
				linkAddress = "https://b2b.toyota.ca/CICWeb/customerInfo.htm?.lang=en";
			}

			linkAddress = linkAddress + "&dealerCode=" + dealercode + "&vin=" + vin;
			return linkAddress;
		},
		performCIC: function () {
			var that = this;
			var OVIN = this.getView().getModel("EcpFieldData").getProperty("/ZecpVin");
			var dealerCode = this.getModel("LocalDataModel").getProperty("/VehicleDetails/EndCustomer");

			if (!this.oECPData) {
				this.oECPData = this.getView().getModel("EcpFieldData").getData();
			}
			var vinNo = this.oECPData.ZecpVin;
			var linkAddress = this.getCIClink(dealerCode, OVIN);
			console.log(linkAddress);
			var iframe = new sap.ui.core.HTML();
			var dialog = new Dialog({
				title: 'Perform CIC',
				contentWidth: "90%",
				contentHeight: "90%",
				resizable: true,
				content: iframe,
				beginButton: new Button({
					text: 'Close',
					press: $.proxy(function () {
						var oVehicleMaster = that.getOwnerComponent().getModel("ZVehicleMasterModel");
						oVehicleMaster.read("/zc_c_vehicle", {
							urlParameters: {
								"$filter": "VehicleIdentificationNumber eq '" + OVIN + "'"
							},
							success: $.proxy(function (vData) {
								console.log(vData.results);
								this.getModel("LocalDataModel").setProperty("/VehicleDetails", vData.results[0]);

								var oBusinessModelOnSubmit = this.getModel("ApiBusinessModel");
								oBusinessModelOnSubmit.read("/A_BusinessPartnerAddress", {
									urlParameters: {
										"$filter": "BusinessPartner eq '" + this.getModel("LocalDataModel").getProperty("/VehicleDetails/EndCustomer") +
											"' ",
										"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress,to_MobilePhoneNumber"

									},
									success: $.proxy(function (budata) {

											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub", budata.results[0]);
											this.getModel("LocalDataModel").setProperty("/OwnerData", budata.results[0]);
											if (budata.results[0].to_EmailAddress.results.length > 0) {
												var oEmailAdd = budata.results[0].to_EmailAddress.results;
												var sEmail = oEmailAdd.filter(s => s.IsDefaultEmailAddress == true);
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/EmailAddress", sEmail[0].EmailAddress ||
													"");
												this.getModel("LocalDataModel").setProperty("/OwnerData/EmailAddress", sEmail[0].EmailAddress || "");
											}
											if (budata.results[0].to_PhoneNumber.results.length > 0) {
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/PhoneNumber", budata.results[0].to_PhoneNumber
													.results[
														0].PhoneNumber);
												this.getModel("LocalDataModel").setProperty("/OwnerData/PhoneNumber", budata.results[0].to_PhoneNumber.results[
													0].PhoneNumber || "");
											}
											if (budata.results[0].to_FaxNumber.results.length > 0) {
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/FaxNumber", budata.results[0].to_FaxNumber
													.results[
														0]
													.FaxNumber);
												this.getModel("LocalDataModel").setProperty("/OwnerData/FaxNumber", budata.results[0].to_FaxNumber.results[
													0].FaxNumber || "");
											}
											if (budata.results[0].to_MobilePhoneNumber.results.length > 0) {
												this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/Mobile", budata.results[0].to_MobilePhoneNumber
													.results[
														0].PhoneNumber);
												this.getModel("LocalDataModel").setProperty("/OwnerData/Mobile", budata.results[0].to_MobilePhoneNumber
													.results[
														0].PhoneNumber);
											}

										},
										this),
									error: function () {
										console.log("Error");
									}
								});

								oBusinessModelOnSubmit.read("/A_BusinessPartner", {
									urlParameters: {
										"$filter": "BusinessPartner eq '" + this.getModel("LocalDataModel").getProperty("/VehicleDetails/EndCustomer") +
											"' "
									},
									success: $.proxy(function (bpdata) {

										this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/FirstName", bpdata.results[0].FirstName);
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/LastName", bpdata.results[0].LastName);
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/BusinessPartnerCategory", bpdata.results[
											0].BusinessPartnerCategory);
										this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub/BusinessPartnerCategory", bpdata.results[
											0].BusinessPartnerCategory);
										if (bpdata.results[0].BusinessPartnerCategory === "1") {
											// this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/Name", bpdata.results[0].FirstName+" "+ bpdata.results[0].LastName);
											// this.getModel("LocalDataModel").setProperty("/VechOwnrSectonAddress/BpType", "Individual");

											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_Name", bpdata.results[0].FirstName +
												" " +
												bpdata.results[
													0].LastName);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_BpType", this.getView().getModel(
													"i18n")
												.getResourceBundle()
												.getText("Individual")); // added translation

										} else if (bpdata.results[0].BusinessPartnerCategory === "2") {
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_Name", bpdata.results[0].OrganizationBPName1);
											this.getModel("LocalDataModel").setProperty("/VechOwnrSectAddOnAppSub_BpType",
												this.getView().getModel("i18n").getResourceBundle().getText("Organization"));
										}

									}, this),
									error: function () {
										console.log("Error");
									}
								});

							}, this)

						});

						dialog.close();
					}, this)
				}),
				afterClose: $.proxy(function () {

					dialog.destroy();
				}, this)
			});

			//to get access to the global model
			this.getView().addDependent(dialog);

			iframe.setContent("<iframe id='cicframe' src=" + linkAddress + " width='100%' height='750px'></iframe>");

			dialog.open();
			dialog.setBusy(true);
			document.getElementById('cicframe').onload = function () {
				dialog.setBusy(false);
			};

		},
		onDeletePress: function (oEvent) {
			console.log("dsfasdfa");
		}

	});

});
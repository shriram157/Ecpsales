sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function (Controller, History, Device) {
	"use strict";

	return Controller.extend("zecp.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		onInit: function () {
			this.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(this.oI18nModel, "i18n");
			var userLang = navigator.language || navigator.userLanguage;

			if ((window.location.search == "?language=fr") || (userLang == "fr")) {
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
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		handleLinkPress: function (oEvent) {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oGetText = oEvent.getSource().getText();
			var oval = 404;
			this.getDealer();

			if (oGetText === oBundle.getText("NewApplication")) {
				this.getOwnerComponent().getRouter().navTo("newECPApp", {
					appId: oval,
					ODealer: this.getModel("LocalDataModel").getProperty("/currentIssueDealer")

				});
			} else if (oGetText === oBundle.getText("ViewUpdateApp")) {
				this._resetView();
				this.getOwnerComponent().getRouter().navTo("ApplicationList");
			} else if (oGetText === oBundle.getText("AgreementInquiry")) {
				this._resetView();
				this.getOwnerComponent().getRouter().navTo("AgreementInquiryList");

			}

		},

		_getPropetyData: function () {
			this.getModel("oSetProperty").setData({
				oPrimeryState: true,
				oSecondaryState: true,
				oPrimeryState01: false,
				oSecondaryState01: false,
				oSurcharge: false,
				oTab1visible: true,
				oTab2visible: false,
				oTab3visble: false,
				oTab4visble: false,
				oTab5visble: false,
				oTab6visble: false,
				backToList: true,
				backPrimery: true,
				backSecondary: false,
				AgreementTable: true,
				saleDat01Visible: true,
				saleDat02Visible: false,
				oFlag: false,
				oAgreementTable: false,
				ostep3: true,
				oAgrTopDetails: false,
				oAgrOwner: false,
				oAgrOwnerDMS: false,
				backBtnP: true
			});
		},

		_resetView: function () {
			this._getPropetyData();
			this.getView().getModel("oSetProperty").setProperty("/oTab2visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab3visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab4visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab5visible", false);
			this.getView().getModel("oSetProperty").setProperty("/oTab6visible", false);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getDealer: function () {
			this._getPropetyData();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/ecpSales_node_secured"; //ecpSales_node_secured
				this.attributeUrl = "/userDetails/attributesforlocaltesting";
			} else {
				this.sPrefix = "";
				this.attributeUrl = "/userDetails/attributes";
			}

			var oBusinessModel = this.getModel("ApiBusinessModel");
			this.getView().setModel(oBusinessModel, "OBusinessModel");
			this.getView().setModel(this.getOwnerComponent().getModel("EcpSalesModel"));
			//======================================================================================================================//			
			//  on init method,  get the token attributes and authentication details to the UI from node layer.  - begin
			//======================================================================================================================//		
			//  get the Scopes to the UI 
			//this.sPrefix ="";
			var that = this;
			$.ajax({
				url: this.sPrefix + "/userDetails/currentScopesForUser",
				type: "GET",
				dataType: "json",
				success: function (oData) {
					// var userScopes = oData;
					// userScopes.forEach(function (data) {
					var userType = oData.loggedUserType[0];
					//var userType = "TCI_Admin";
					that.getModel("LocalDataModel").setProperty("/UserType", userType);
					//userType = "TCI_User";
					switch (userType) {
					case "Dealer_Sales_User":

						that.getModel("LocalDataModel").setProperty("/newAppLink", true);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);
						that.getModel("LocalDataModel").setProperty("/editableField", true);
						break;
					case "Dealer_Service_User":
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", false);

						that.getModel("LocalDataModel").setProperty("/newAppLink", false);
						that.getModel("LocalDataModel").setProperty("/editableField", false);
						that.getView().getModel("oSetProperty").setProperty("/oSecondaryState", false);
						that.getView().getModel("oSetProperty").setProperty("/oPrimeryState01", false);
						that._resetView();
						//that.getOwnerComponent().getRouter().navTo("AgreementInquiryList");
						break;

					case "TCI_Admin":

						that.getModel("LocalDataModel").setProperty("/newAppLink", true);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);
						that.getModel("LocalDataModel").setProperty("/editableField", true);
						// 		that.getView().getModel("oSetProperty").setProperty("/oSecondaryState", false);
						// 		that.getView().getModel("oSetProperty").setProperty("/oPrimeryState01", false);
						break;
					case "TCI_User":

						that.getModel("LocalDataModel").setProperty("/newAppLink", true);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);
						that.getModel("LocalDataModel").setProperty("/editableField", true);
						//that.getView().getModel("oSetProperty").setProperty("/oSecondaryState", false);
						//that.getView().getModel("oSetProperty").setProperty("/oPrimeryState01", false);
						//that._resetView();
						//that.getOwnerComponent().getRouter().navTo("AgreementInquiryList");
						break;
					case "Zone_User":

						that.getModel("LocalDataModel").setProperty("/newAppLink", false);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);
						that.getModel("LocalDataModel").setProperty("/editableField", false);
						that.getView().getModel("oSetProperty").setProperty("/oSecondaryState", false);
						that.getView().getModel("oSetProperty").setProperty("/oPrimeryState01", false);
						break;
					default:

					}
				}

				// if (data === "ecpSales!t1188.Manage_ECP_Application") {
				// 	that.getView().getModel("oDateModel").setProperty("/oCreateButton", true);
				// 	that.getModel("LocalDataModel").setProperty("/newAppLink", true);
				// } 

			});

			// get the attributes and BP Details - Minakshi to confirm if BP details needed		// TODO: 
			$.ajax({
				url: this.sPrefix + this.attributeUrl,
				type: "GET",
				dataType: "json",

				success: function (oData) {
					var BpDealer = [];
					var userAttributes = [];

					$.each(oData.attributes, function (i, item) {
						//var BpLength = item.BusinessPartner.length;

						BpDealer.push({
							"BusinessPartnerKey": item.BusinessPartnerKey,
							"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
							"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
							"Division": item.Division,
							"BusinessPartnerType": item.BusinessPartnerType,
							"searchTermReceivedDealerName": item.SearchTerm2
						});

					});
					that.getModel("LocalDataModel").setProperty("/BpDealerModel", BpDealer);
					// ##change done for DMND0003001 by Minakshi
					that.getModel("LocalDataModel").setProperty("/LoggedInUser", oData.userProfile.id);
				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			}).done(function (data, textStatus, jqXHR) {
				that.getModel("LocalDataModel").setProperty("/currentIssueDealer", data.attributes[0].BusinessPartnerKey);

			});
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("ApplicationList", {}, true);
			}
		},
		// Added for incident INC0184963 start
		fnBusinessPartnerData: function (patnerNum, callback) {
			var oBusinessModel = this.getModel("ApiBusinessModel");
			oBusinessModel.read("/A_BusinessPartnerAddress", {
				urlParameters: {
					"$filter": "BusinessPartner eq '" + patnerNum + "' ",
					"$expand": "to_PhoneNumber,to_FaxNumber,to_EmailAddress,to_MobilePhoneNumber"

				},
				success: $.proxy(function (budata) {
					callback(budata);
				}, this),
				error: function (err) {
					console.log(err);
				}
			});

		}
// Added for incident INC0184963 end

	});
});
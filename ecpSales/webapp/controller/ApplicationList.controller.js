sap.ui.define([
	"zecp/controller/BaseController",
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel'
], function (BaseController, Fragment, JSONModel) {
	"use strict";

	return BaseController.extend("zecp.controller.ApplicationList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zecp.view.ApplicationList
		 */
		onInit: function () {
			var oModelDate = new JSONModel();
			this.beforedate = new Date();

			this.priordate = new Date(new Date().setDate(this.beforedate.getDate() - 30));
			oModelDate.setData({
				dateFormatDRS1: "yyyy/MM/dd",
				dateValueDRS2: this.priordate,
				secondDateValueDRS2: this.beforedate,
				oCreateButton: true
			});
			this.getView().setModel(oModelDate, "oDateModel");

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
			var oEcpModel = this.getOwnerComponent().getModel("EcpSalesModel");
			// var oEventBus = sap.ui.getCore().getEventBus();
			// oEventBus.subscribe("newECPApp", "Binded", this.onSelectiDealer, this);

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
					//	userType = "TCI_User";
					switch (userType) {
					case "Dealer_Sales_User":
						that.getView().getModel("oDateModel").setProperty("/oCreateButton", true);
						that.getModel("LocalDataModel").setProperty("/newAppLink", true);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);

						break;
					case "Dealer_Service_User":
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", false);
						that.getView().getModel("oDateModel").setProperty("/oCreateButton", false);
						that.getModel("LocalDataModel").setProperty("/newAppLink", false);
						that._resetView();
						that.getOwnerComponent().getRouter().navTo("AgreementInquiryList");

						break;

					case "TCI_Admin":

						that.getView().getModel("oDateModel").setProperty("/oCreateButton", false);
						that.getModel("LocalDataModel").setProperty("/newAppLink", false);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);

						break;
					case "TCI_User":
						that.getView().getModel("oDateModel").setProperty("/oCreateButton", true);
						that.getModel("LocalDataModel").setProperty("/newAppLink", true);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);
						//that._resetView();
						//	that.getOwnerComponent().getRouter().navTo("AgreementInquiryList");
						break;
					case "Zone_User":
						that.getView().getModel("oDateModel").setProperty("/oCreateButton", false);
						that.getModel("LocalDataModel").setProperty("/newAppLink", false);
						that.getModel("LocalDataModel").setProperty("/viewUpdateLink", true);
						break;
					default:
						// raise a message, because this should not be allowed. 

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
						var BpLength = item.BusinessPartner.length;

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
					//that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");
					// read the saml attachments the same way 
					// $.each(oData.samlAttributes, function (i, item) {
					// 	if(item != ""){
					// 	userAttributes.push({
					// 		"UserType": item.UserType[0],
					// 		"DealerCode": item.DealerCode[0],
					// 		"Language": item.Language[0]
					// 			// "Zone": item.Zone[0]   ---    Not yet available
					// 	});
					// 	}
					// });

					// that.getView().setModel(new sap.ui.model.json.JSONModel(userAttributes), "userAttributesModel");

					//	that._getTheUserAttributes();

				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			}).done(function (data, textStatus, jqXHR) {
				that.getModel("LocalDataModel").setProperty("/currentIssueDealer", data.attributes[0].BusinessPartnerKey);

				var issueDealer = that.getModel("LocalDataModel").getProperty("/currentIssueDealer");
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				var oPriorDate = oDateFormat.format(that.priordate);
				var oCurrentDate = oDateFormat.format(that.beforedate);

				oEcpModel.read("/zc_ecp_application", {
					urlParameters: {
						"$filter": "SubmissionDate ge datetime'" + oPriorDate + "'and SubmissionDate le datetime'" + oCurrentDate +
							"'and DealerCode eq '" + issueDealer + "'and ApplicationStatus eq 'PENDING' "
					},
					success: function (edata) {
						that.getModel("LocalDataModel").setProperty("/EcpApplication", edata.results);
					}
				});
				var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				oRouter.attachRouteMatched(that._onObjectMatched, that);
			});

			// scopes to be used as below. // TODO: Minakshi to continue the below integration

			//if you see scopes   Manage_ECP_Application,  then treat the user as Dealer Sales USer,  this is the only user with manage application
			// TODO:  in the ui for this user,  everything is available and default landing page need to be set view/update application page

			// if you see scopes view ECP Claim & view ECP Agreement & inquiry with  user attribute dealer code then this is a Dealer Service user. 
			// TODO: Suppress the tabs new application and View/update application.  only enable Agreement inquiry and make this a landing page. 

			//if you see scopes view ecp application, view ecp claim, view ecp agreement, view inquiry with no dealer code and no zone then this is a Internal TCIUser Admin[ECP Dept]
			// TODO: Make view/update application as the landing page,  suppress new applicaiton creation button  ( Internal user cannot create an application but view/update is allowed)

			//if you see scopes view ecp application, view ecp claim, view ecp agreement, view inquiry with no dealer code and  zone then this is a  ECP ZONE USER
			// TODO: For ECP Zone user restrict the Drop down of dealers only from that zone you received from the attribute. 
			//suppress new application creation button and make landing page as view/update application

			// if you see scopes View ECP Claim, view ECP Agreement, Inqyiry with no delaer code no zone then this is a Internal TCI User
			// TODO: Suppress the tabs new application and View/update application.  only enable Agreement inquiry and make this a landing page. 

			//======================================================================================================================//			
			//  on init method,  get the token attributes and authentication details to the UI from node layer.  - End
			//======================================================================================================================//				

			this.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(this.oI18nModel, "i18n");
			var winUrl = window.location.search;

			if (winUrl.indexOf("=fr") > -1) {
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
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//	document.title = "::: " + oBundle.getText("title") + " :::";

			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VInBusyInidcator", true);

		},

		onBeforeRendering: function () {
			//this.getView().byId("idDealerCode").setSelectedKey("2400042350");
			//	this.getView().byId("idDealerCode").setValue("42350");

			//	console.log(this.selectedDealer);
		},
		_onObjectMatched: function (oEvent) {
			this.getDealer();
			var oEcpModel = this.getOwnerComponent().getModel("EcpSalesModel");
			var issueDealer = this.getModel("LocalDataModel").getProperty("/currentIssueDealer");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var oPriorDate = oDateFormat.format(this.priordate);
			var oCurrentDate = oDateFormat.format(this.beforedate);
			if (oEvent.getParameters().name === "ApplicationList") {
				this.getOwnerComponent().getModel("EcpSalesModel").refresh();
				oEcpModel.read("/zc_ecp_application", {
					urlParameters: {
						"$filter": "SubmissionDate ge datetime'" + oPriorDate + "'and SubmissionDate le datetime'" + oCurrentDate +
							"'and DealerCode eq '" + issueDealer + "'and ApplicationStatus eq 'PENDING' "
					},
					success: $.proxy(function (data) {
						this.getModel("LocalDataModel").setProperty("/EcpApplication", data.results);
					}, this)
				});

			}

			var productInput = this.getView().byId("idVin");
			productInput.setValue("");

		},

		onAfterRendering: function () {

		},

		onSelectDateRadio: function (oEvent) {
			this.getView().byId("idVin").setValue("");
		},

		onSelectiDealer: function (oEvent) {
			this.getView().byId("idVin").setValue("");
			this.selectedDealer = oEvent.getSource().getSelectedKey();
			console.log(this.selectedDealer);
		},

		OnCreateApp: function (oEvent) {
			var oval = 404;
			this.getOwnerComponent().getRouter().navTo("newECPApp", {
				appId: oval,
				ODealer: this.getModel("LocalDataModel").getProperty("/currentIssueDealer")
			});
		},
		handleValueHelp: function (oController) {

			var oDealer = this.getView().byId("idDealerCode").getSelectedKey();
			var oEcpModel = this.getOwnerComponent().getModel("EcpSalesModel");
			oEcpModel.read("/zc_ecp_application", {
				urlParameters: {
					"$filter": "DealerCode eq '" + oDealer + "'"
				},
				success: $.proxy(function (data) {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VInBusyInidcator", false);
					var oResult = data.results;
					var elements = oResult.reduce(function (previous, current) {

						var object = previous.filter(function (sobj) {
							return sobj.VIN === current.VIN;
						});
						if (object.length == 0) {
							previous.push(current);
						}
						return previous;
					}, []);

					//console.log(elements);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/ApplicationVinList", elements);

				}, this),
				error: $.proxy(function () {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VInBusyInidcator", false);
				}, this)
			});

			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oVinRadioSelected = this.getView().byId("idVinRadio").getSelected();
			if (oVinRadioSelected) {
				this.getView().byId("idAppListMsgStrip").setProperty("visible", false);

				this.inputId = oController.getParameters().id;

				if (!this._valueHelpDialog) {
					this._valueHelpDialog = sap.ui.xmlfragment(
						"zecp.view.fragments.VinDialogForApplist",
						this
					);
					this.getView().addDependent(this._valueHelpDialog);
				}

				this._valueHelpDialog.open();
			} else {
				this.getView().byId("idAppListMsgStrip").setProperty("visible", true);
				this.getView().byId("idAppListMsgStrip").setType("Error");
				this.getView().byId("idAppListMsgStrip").setText(this.oBundle.getText("PleaseSelectRadioButtonForVIN"));
			}
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");

			if (sValue) {
				var oFilter = new sap.ui.model.Filter(
					"VIN",
					sap.ui.model.FilterOperator.Contains, sValue
				);

				evt.getSource().getBinding("items").filter([oFilter]);
			} else {
				evt.getSource().getBinding("items").filter([]);
			}
		},

		_handleValueHelpClose: function (evt) {
			this.oSelectedItem = evt.getParameter("selectedItem");

			if (this.oSelectedItem) {
				this.oSelectedTitle = this.oSelectedItem.getTitle();
				var productInput = this.byId(this.inputId);
				productInput.setValue(this.oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		OnSearchApplication: function () {

			var oDateRadioSelected = this.getView().byId("idDateRadio").getSelected();
			var oVinRadioSelected = this.getView().byId("idVinRadio").getSelected();
			var oEcpModel = this.getOwnerComponent().getModel("EcpSalesModel");
			var oBundleObj = this.getView().getModel("i18n").getResourceBundle();
			this._oToken = oEcpModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});
			this.getView().byId("idAppListMsgStrip").setProperty("visible", false);

			var oDealerCode = this.getView().byId("idDealerCode").getSelectedKey();

			if (oDateRadioSelected && !oVinRadioSelected) {

				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});

				var sQuery = this.getView().byId("idSubmissionDate").getValue();

				var odateFrom = sQuery.split("-")[0];
				var odateTo = sQuery.split("-")[1];
				var odateToRe = odateTo.toString().split(" ");
				odateToRe.splice(4, 1, "23:59:60");
				var oDateToFinal = odateToRe.join(" ");
				//console.log(odateFrom, oDateToFinal);
				var RangeDateFrom = oDateFormat.format(new Date(odateFrom));
				var RangeDateTo = oDateFormat.format(new Date(oDateToFinal));

				if (!$.isEmptyObject(sQuery)) {

					oEcpModel.read("/zc_ecp_application", {
						urlParameters: {
							"$filter": "SubmissionDate ge datetime'" + RangeDateFrom +
								"'and SubmissionDate le datetime'" + RangeDateTo +
								"'and DealerCode eq '" + oDealerCode + "'and ApplicationStatus eq 'PENDING' "

						},
						success: $.proxy(function (data) {

							this.getModel("LocalDataModel").setProperty("/EcpApplication", data.results);
						}, this)
					});
				}

			} else if (!oDateRadioSelected && oVinRadioSelected) {
				var sQuery02 = this.getView().byId("idVin").getValue();
				//	console.log(sQuery);
				if (!$.isEmptyObject(sQuery02)) {
					oEcpModel.read("/zc_ecp_application", {
						urlParameters: {
							"$filter": "VIN eq'" + sQuery02 +

								"'and DealerCode eq '" + oDealerCode + "'and ApplicationStatus eq 'PENDING' "

						},
						success: $.proxy(function (data) {

							this.getModel("LocalDataModel").setProperty("/EcpApplication", data.results);
						}, this)
					});

				} else {
					this.getView().byId("idAppListMsgStrip").setProperty("visible", true);
					this.getView().byId("idAppListMsgStrip").setType("Error");
					this.getView().byId("idAppListMsgStrip").setText(oBundleObj.getText("ECP0001E"));
				}
			}
		},

		onSelectionChange: function (oEvent) {
			var oProp = this.getModel("LocalDataModel").getProperty("/newAppLink");

			//remove before delpoyment
			// oProp = true;
			//end removal of code

			// if (oProp == true) {

			var obj = oEvent.getSource().getModel("LocalDataModel").getProperty(oEvent.getSource().getSelectedContextPaths()[0]);

			this.getOwnerComponent().getRouter().navTo("newECPApp", {
				appId: obj.InternalApplicationID,
				ODealer: this.getModel("LocalDataModel").getProperty("/currentIssueDealer")
			});
			this.getView().byId("idApplicationTable").removeSelections("true");
			this.getModel("EcpSalesModel").refresh();
			//}
		},

		onExit: function () {
			this.destroy();
			this.getModel("EcpSalesModel").refresh();
		}

	});

});
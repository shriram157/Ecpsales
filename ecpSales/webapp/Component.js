sap.ui.define([
	"sap/base/i18n/ResourceBundle",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zecp/model/models",
	"sap/ui/model/odata/v2/ODataModel"
], function (ResourceBundle, Dialog, Text, UIComponent, Device, models, ODataModel) {
	"use strict";

	return UIComponent.extend("zecp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Get resource bundle
			var locale = jQuery.sap.getUriParameters().get('Language');
			var bundle = !locale ? ResourceBundle.create({
				url: './i18n/i18n.properties'
			}): ResourceBundle.create({
				url: './i18n/i18n.properties',
				locale: locale
			});

			// Attach XHR event handler to detect 401 error responses for handling as timeout
			var sessionExpDialog = new Dialog({
				title: bundle.getText('SESSION_EXP_TITLE'),
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: bundle.getText('SESSION_EXP_TEXT')
				})
			});
			var origOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function () {
				this.addEventListener('load', function (event) {
					// TODO Compare host name in URLs to ensure only app resources are checked
					if (event.target.status === 401) {
						if (!sessionExpDialog.isOpen()) {
							sessionExpDialog.open();
						}
					}
				});
				origOpen.apply(this, arguments);
			};

			this.setModel(models.createLocalDataModel(), "LocalDataModel");
			this.setModel(models.createPropertyData(), "oSetProperty");
			

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			var mConfig = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZECP_SALES_ODATA_SERVICE_SRV");
				if (sLocation_conf == 0) {
				mConfig.uri = "/ecpSales_node_secured" + mConfig.uri;  //ecpSales_node_secured
			} else  {
					mConfig.uri = mConfig.uri;
			}
			var oDataModel = new ODataModel(mConfig.uri, {
				useBatch: false,
				// disableHeadRequestForToken: false,
				defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});

		
			this.setModel(oDataModel, "EcpSalesModel");

			var mConfig01 = this.getMetadata().getManifestEntry("/sap.app/dataSources/Z_VEHICLE_MASTER_SRV");
			if (sLocation_conf == 0) {
				mConfig01.uri = "/ecpSales_node_secured" + mConfig01.uri;
			}
			var oDataModel01 = new ODataModel(mConfig01.uri, {
				useBatch: false,
				// disableHeadRequestForToken: true,
				defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});

			

			this.setModel(oDataModel01, "ZVehicleMasterModel");

			var mConfig02 = this.getMetadata().getManifestEntry("/sap.app/dataSources/API_BUSINESS_PARTNER");
			if (sLocation_conf == 0) {
				mConfig02.uri = "/ecpSales_node_secured" + mConfig02.uri;
			}
			var oDataModel02 = new ODataModel(mConfig02.uri, {
				useBatch: false,
				// disableHeadRequestForToken: true,
				defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
		
			this.setModel(oDataModel02, "ApiBusinessModel");
			
			
			
			
			//Adding Claim Model
			var mConfig03 = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZDLR_CLAIM_SRV");
			if (sLocation_conf == 0) {
				mConfig03.uri = "/ecpSales_node_secured" + mConfig03.uri;
			}
			var oDataModel03 = new ODataModel(mConfig03.uri, {
				useBatch: false,
				// disableHeadRequestForToken: true,
				defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
		
			this.setModel(oDataModel03, "ClaimServiceModel");


			// var mConfig03 = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZDLR_CLAIM_SRV");
			// if (sLocation_conf == 0) {
			// 	mConfig03.uri = "/ecpSales_node_secured" + mConfig03.uri;
			// }
			// var oDataModel03 = new ODataModel(mConfig03.uri, {
			// 	useBatch: false,
			// 	// disableHeadRequestForToken: true,
			// 	defaultUpdateMethod: 'PUT',
			// 	json: true
			// });

			
			// this.setModel(oDataModel03, "ZdrClaimModel");

		}
	});
});
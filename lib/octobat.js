
var OctobatCheckoutJS = {
	open: function(key, options, callback){
		console.log("OctobatCheckoutJS built");
		options = options || {};
		var instance = this;

		// Remove current form if any
		var current_form = document.getElementById("_octobat-open-checkout");
		if (current_form){
			current_form.parentNode.removeChild(current_form);
		}

		// Very basic check
		if (typeof key === "undefined" || key === null || key === "" || /^oc_/.test(key) === 0){
			console.error("Invalid key");
			return null;
		}

		this.key = key;

		this.form = document.createElement('form');
		this.form.id = "_octobat-open-checkout";
		this.form.style.display = "none";
		this.form.setAttribute("action", "#");
		this.form.setAttribute("method", "POST");

		this.script = document.createElement('script');
		this.script.src = 'https://cdn.jsdelivr.net/octobat-checkout.js/1.0.1/octobat-checkout.min.js';
		this.script.async = 1;
		this.script.setAttribute("data-octobat-pkey", key);
		this.script.addEventListener('load', function(event){
			console.log("script loaded, open it : " + JSON.stringify(event));
			console.log("Got Octobat : " + window.Octobat);
			instance.show();
		});

		if (typeof callback === "function"){
			// Do domething with user defined callback
			this.user_callback = callback;
		}

		// Set script default options
		this.script.setAttribute("class","octobat-checkout-button");
		// Set user provided script options
		options.customerName && this.script.setAttribute("data-name", options.customerName);
		options.supplierName && this.script.setAttribute("data-supplier-name", options.supplierName);
		options.billingAddress && this.script.setAttribute("data-billing-address", options.billingAddress);
		options.description && this.script.setAttribute("data-description", options.description);
		options.plan && this.script.setAttribute("data-plan", options.plan);
		options.charge && this.script.setAttribute("data-charge", options.charge);
		options.label && this.script.setAttribute("data-label", options.label);
		options.validateTaxNumber && this.script.setAttribute("data-validate-tax-number", options.validateTaxNumber);
		options.image && this.script.setAttribute("data-image", options.image);
		options.quantity && this.script.setAttribute("data-quantity", options.quantity);
		options.coupon && this.script.setAttribute("data-coupon", options.coupon);
		options.detailedPanel && this.script.setAttribute("data-detailed-panel", options.detailedPanel);

		console.log("options.quantity : " + options.quantity);

		this.form.appendChild(this.script);
		document.body.appendChild(this.form);
	},
	show: function(){
		/**
	 	* After the script is inserted in the DOM, we should get
	 	* window.OctobatCheckout defined. Script has been inserted
	 	* after 'open' has been executed, and this function is called
	 	* right after the script is loaded.
	 	*/
		if (typeof window.OctobatCheckout === "undefined" || window.OctobatCheckout === null){
			console.log("Cannot find OctobatCheckout");
			return null;
		}

		console.log("Got Octobat : " + window.Octobat);

		// Overwrite OctobatCheckout callback function
		window.OctobatCheckout.callback = this.callback.bind(this);

		/**
		 * Firing 'click' still seems to be authorized, but for how long ?
		 * See comment from console :
		 * "A DOM event generated from JavaScript has triggered a default action inside the browser.
		 * This behavior is non-standard and will be removed in M53, around September 2016.
		 * See https://www.chromestatus.com/features/5718803933560832 for more details."
		 */
		//eventFire(document.querySelector("button.octobat-checkout-button-el"), "click");
		var t = this.scriptAttributes();
		t.key = this.key;
		window.OctobatCheckout.open(t);
	},
	callback: function(data){
		// Pass JWT token to user defined callback function
  	this.user_callback(data.transaction);
	},
	scriptAttributes: function() {
		var t = {
			octobat_pkey: this.scriptData("octobat-pkey"),
			plan: this.scriptData("plan"),
			charge: this.scriptData("charge"),
			taxes_included: this.scriptData("taxes"),
			transaction_type: this.scriptData("transaction-type") || "eservice",
			gateway: this.scriptData("gateway"),
			moss_compliance: this.scriptData("moss-compliance") || !0,
			validate_tax_number: this.scriptData("validate-tax-number") || !0,
			display_billing_address: this.scriptData("billing-address") || !1,
			coupon: this.scriptData("coupon") || !1,
			name: this.scriptData("name"),
			email: this.scriptData("email"),
			country: this.scriptData("country"),
			street_line_1: this.scriptData("street-line-1"),
			zip_code: this.scriptData("zip-code"),
			city: this.scriptData("city"),
			description: this.scriptData("description"),
			supplier_name: this.scriptData("supplier-name"),
			image: this.scriptData("image"),
			script_id: this.script.getAttribute("id"),
			octobat_checkout_id: this.scriptData("octobat-checkout-id"),
			detailed_panel: this.scriptData("detailed-panel") || !1,
			quantity: this.scriptData("quantity") || 1
		};
		return t
	},
	scriptData: function(e, t) {
		return this.script.getAttribute("data-" + e);
	},
}

window.OctobatCheckoutJS = module.exports = OctobatCheckoutJS;

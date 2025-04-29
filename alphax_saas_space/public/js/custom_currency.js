frappe.ui.form.on("Currency", {
    refresh: function(frm) {
        if (frm.doc.currency_name === "SAR") {
            frm.set_value("symbol", "\uFDFC");
            frm.fields_dict.symbol.$input.css("font-family", "Claudion, sans-serif");
        }
    }
});






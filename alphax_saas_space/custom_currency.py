import frappe

@frappe.whitelist()
def get_custom_currency_symbol(currency):
    if currency == "SAR":
        return "\uFDFC"  # Unicode for the new Saudi Riyal symbol
    return frappe.db.get_value("Currency", currency, "symbol")

@frappe.whitelist()
def update_currency_symbol():
    currency = frappe.get_doc("Currency", "SAR")
    if currency.symbol != "\uFDFC":
        currency.symbol = "\uFDFC"
        currency.save()
        frappe.db.commit()

        
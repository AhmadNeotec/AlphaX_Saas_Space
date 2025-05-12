import frappe
from frappe import whitelist

@frappe.whitelist(allow_guest=True)
def get_logged_user():
    return frappe.session.user
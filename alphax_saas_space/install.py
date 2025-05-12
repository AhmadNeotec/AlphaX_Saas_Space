# apps/neotec_theme/neotec_theme/install.py
import frappe

def set_default_theme():
    users = frappe.get_all("User", filters={"desk_theme": ["in", [None, "", "light"]]}, fields=["name"])
    for user in users:
        frappe.db.set_value("User", user.name, "desk_theme", "alphax_theme")
    frappe.db.commit()
    frappe.log("Set default theme to alphax_theme for all users")
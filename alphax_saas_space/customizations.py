# alphax_saas_space/customizations.py
import frappe

def hide_default_modules(bootinfo):
    user = frappe.session.user
    hide_default = frappe.db.get_value("User", user, "hide_default_modules") or 1
    default_modules = ["Accounts", "Selling", "Buying", "Stock", "CRM", "HR"]
    
    modules = bootinfo["user"].get("modules", [])
    if "my_custom_module" not in modules:
        modules.insert(0, "my_custom_module")
    
    if hide_default and "System Manager" not in frappe.get_roles():
        bootinfo["user"]["modules"] = [m for m in modules if m not in default_modules]
    else:
        custom_module = "my_custom_module"
        if custom_module in modules:
            modules.remove(custom_module)
        modules.insert(0, custom_module)
        bootinfo["user"]["modules"] = modules
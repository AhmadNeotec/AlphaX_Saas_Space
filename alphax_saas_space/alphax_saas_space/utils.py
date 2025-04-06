# alphax_saas_space/alphax_saas_space/utils.py
import frappe

def update_module_visibility(user=None):
    if not user:
        user = frappe.session.user
    
    # Get user’s preference for hiding default modules
    hide_default = frappe.db.get_value("User", user, "hide_default_modules") or 1
    default_modules = ["Accounts", "Selling", "Buying", "Stock", "CRM", "HR"]
    custom_module = "my_custom_module"

    # Get all available modules
    all_modules = frappe.get_all("Module Def", fields=["name"], filters={"app_name": ("!=", "frappe")})
    module_list = [m.name for m in all_modules]

    # Ensure custom module exists
    if custom_module not in module_list:
        if not frappe.db.exists("Module Def", custom_module):
            frappe.get_doc({
                "doctype": "Module Def",
                "name": custom_module,
                "app_name": "alphax_saas_space",
                "module_name": custom_module
            }).insert(ignore_permissions=True)
        module_list.insert(0, custom_module)

    # Apply visibility logic
    if hide_default and "System Manager" not in frappe.get_roles(user):
        visible_modules = [m for m in module_list if m not in default_modules]
    else:
        visible_modules = module_list
        if custom_module in visible_modules:
            visible_modules.remove(custom_module)
        visible_modules.insert(0, custom_module)

    return visible_modules
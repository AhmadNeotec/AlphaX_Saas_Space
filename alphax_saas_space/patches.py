# alphax_saas_space/alphax_saas_space/patches.py
import frappe
from frappe.desk.desktop import get_desk_sidebar_items

def custom_get_desk_sidebar_items():
    user = frappe.session.user
    cached_modules = frappe.cache().get_value(f"module_list:{user}")
    if cached_modules:
        # Filter sidebar items to match cached modules
        sidebar_items = get_desk_sidebar_items()
        filtered_modules = [item for item in sidebar_items["modules"] if item["module_name"] in cached_modules]
        sidebar_items["modules"] = filtered_modules
        return sidebar_items
    return get_desk_sidebar_items()

frappe.desk.desktop.get_desk_sidebar_items = custom_get_desk_sidebar_items
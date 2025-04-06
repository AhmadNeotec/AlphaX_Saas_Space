# alphax_saas_space/www/toggle_modules.py
import frappe
from alphax_saas_space.utils import update_module_visibility

def get_context(context):
    context.user = frappe.session.user
    context.hide_default = frappe.db.get_value("User", context.user, "hide_default_modules") or 1
    context.csrf_token = frappe.sessions.get_csrf_token()
    frappe.db.commit()
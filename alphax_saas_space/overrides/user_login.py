# apps/neotec_theme/neotec_theme/overrides/user_login.py
import frappe

def set_alphax_theme_on_login():
    """Set alphax_theme for the user upon login"""
    user = frappe.session.user
    if user and user != "Guest":
        frappe.db.set_value("User", user, "desk_theme", "alphax_theme")
        frappe.db.commit()
        frappe.log(f"Set alphax_theme for user {user} on login")
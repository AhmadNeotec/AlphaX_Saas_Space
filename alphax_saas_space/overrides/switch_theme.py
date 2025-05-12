import frappe

@frappe.whitelist()
def switch_theme(theme):
    valid_themes = ["dark", "light", "automatic", "alphax_theme"]
    if theme.lower() in valid_themes:
        frappe.db.set_value("User", frappe.session.user, "desk_theme", theme.lower())
        frappe.db.commit()
        frappe.log(f"Theme switched to {theme.lower()} for user {frappe.session.user}")
    else:
        frappe.throw(f"Invalid theme: {theme}")

def set_default_theme_on_login():
    """Set default theme for user on login if not already set"""
    user = frappe.session.user
    if user and user != "Guest":
        current_theme = frappe.db.get_value("User", user, "desk_theme")
        if not current_theme:
            frappe.db.set_value("User", user, "desk_theme", "alphax_theme")
            frappe.db.commit()
            frappe.log(f"Default theme set to alphax_theme for user {user}")


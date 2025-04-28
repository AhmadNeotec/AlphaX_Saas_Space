# your_app/utils/login.py
import frappe
from frappe.auth import LoginManager

class CustomLoginManager(LoginManager):
    def login(self):
        super(CustomLoginManager, self).login()
        # Redirect to dashboard after successful login
        frappe.local.response["home_page"] = "/dashboard"
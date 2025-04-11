// custom.js
frappe.provide("frappe.ui.toolbar");

const original_setup_sidebar = frappe.ui.layout.Layout.prototype.setup_sidebar;

frappe.ui.layout.Layout = class CustomLayout extends frappe.ui.layout.Layout {
    setup_sidebar() {
        // Only create sidebar for doctype-related pages
        if (this.is_doctype_page()) {
            original_setup_sidebar.call(this);
        } else {
            this.sidebar = null;
            $('.layout-side-section').remove();
        }
    }

    is_doctype_page() {
        const route = frappe.get_route();
        return [
            'doctype',
            'list',
            'form',
            'tree',
            'report',
            'dashboard',
            'query-report'
        ].some(part => route.includes(part));
    }
};

// Remove sidebar toggle button on non-doctype pages
frappe.ui.toolbar.toggleSidebar = function () {
    if (frappe.get_route()[0] === 'home') {
        return false;
    }
    return this._super.apply(this, arguments);
};

// Initial cleanup
frappe.ready(() => {
    if (!frappe.get_route()[0].match(/^(doctype|list|form|tree|report|dashboard)$/)) {
        $('.layout-side-section').remove();
        $('.navbar-toggle-sidebar').remove();
    }
});
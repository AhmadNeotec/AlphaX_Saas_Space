console.log('Loading dashboard.js');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard Client Script loaded');
    initializeDashboard();
});

// Main initialization function
function initializeDashboard() {
    setupEventListeners();
    loadContent('/dashboard-view/Accounts');
    checkUserLoginStatus();
    // Logo click handler
    const logoImage = document.querySelector('.brand-logo img');
    if (logoImage) {
        logoImage.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Logo clicked, loading /dashboard');
            loadContent('/dashboard');
        });
    }
}

// Check user login status
function checkUserLoginStatus() {
    // Option 1: Client-side check (preferred if frappe.session is available)
    if (window.frappe && frappe.session) {
        const isLoggedIn = frappe.session.user !== 'Guest';
        console.log('User login status:', isLoggedIn ? 'Logged In' : 'Not Logged In');
        toggleSidebarVisibility(isLoggedIn);
        return;
    }
    // Option 2: API check (requires whitelisted method)
    fetch('/api/method/alphax_saas_space.api.get_logged_user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            const isLoggedIn = data.message !== 'Guest';
            console.log('User login status:', isLoggedIn ? 'Logged In' : 'Not Logged In');
            toggleSidebarVisibility(isLoggedIn);
        })
        .catch(error => {
            console.error('Error checking login status:', error);
            toggleSidebarVisibility(false);
            window.location.href = '/login';
        });
}

// Toggle sidebar and burger menu visibility
// Toggle sidebar visibility
function toggleSidebarVisibility(isLoggedIn) {
    const sidebar = document.getElementById('sidebar');
    const menuCheckbox = document.getElementById('menu-toggle');
    const homeSection = document.querySelector('.home-section');

    if (!sidebar || !menuCheckbox || !homeSection) {
        console.error('DOM elements missing:', {
            sidebar: !!sidebar,
            menuCheckbox: !!menuCheckbox,
            homeSection: !!homeSection
        });
        return;
    }

    if (isLoggedIn) {
        sidebar.style.display = 'block';
        sidebar.classList.remove('hidden');
        sidebar.classList.add('visible');
        homeSection.classList.remove('full-width');
        menuCheckbox.checked = true; // Show sidebar by default
    } else {
        sidebar.style.display = 'none';
        sidebar.classList.add('hidden');
        sidebar.classList.remove('visible');
        homeSection.classList.add('full-width');
        menuCheckbox.checked = false;
        window.location.href = '/login?nocache=' + Date.now();
    }
}

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Hamburger menu toggle
    const menuCheckbox = document.getElementById('menu-toggle');
    if (menuCheckbox) {
        menuCheckbox.addEventListener('change', function () {
            const sidebar = document.getElementById('sidebar');
            const homeSection = document.querySelector('.home-section');
            if (sidebar && homeSection) {
                if (this.checked) {
                    sidebar.classList.remove('hidden');
                    sidebar.classList.add('visible');
                    homeSection.classList.remove('full-width');
                } else {
                    sidebar.classList.add('hidden');
                    sidebar.classList.remove('visible');
                    homeSection.classList.add('full-width');
                }
                console.log('Hamburger menu toggled, checked:', this.checked);
            }
        });
    }


    // Bind menu item clicks
    document.querySelectorAll('.menu-item > span').forEach(span => {
        span.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu span clicked:', this.textContent.trim());
            const route = this.getAttribute('data-route');
            if (route) {
                console.log('Loading route from menu:', route);
                loadContent(route);
            }
        });
    });

    // Bind arrow clicks
    document.querySelectorAll('.menu-item .arrow').forEach(arrow => {
        arrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Arrow clicked for submenu toggle');
            const parentLi = this.closest('.menu-item');
            const subMenu = parentLi.querySelector('.sub-menu');
            if (subMenu) {
                const isOpen = subMenu.classList.contains('open');
                subMenu.classList.toggle('open');
                parentLi.classList.toggle('active', !isOpen);
            }
        });
    });

    // Handle submenu item clicks
    document.querySelectorAll('.sub-menu li').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const route = this.getAttribute('data-route');
            if (route) {
                console.log('Loading route from submenu:', route);
                loadContent(route);
            }
        });
    });

    // Set up profile dropdown (if applicable)
    const profileElement = document.querySelector('.user-profile');
    if (profileElement) {
        profileElement.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });
    }

    // Close dropdown if clicking outside
    document.addEventListener('click', function (e) {
        const profile = document.querySelector('.user-profile');
        const dropdown = document.getElementById('profileDropdown');
        if (profile && dropdown && !profile.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Toggle profile dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Content loading function
function loadContent(url) {
    console.log('loadContent: Called with URL:', url);
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('loadContent: content-area not found');
        return;
    }

    const iframeRoutes = {
        '/chart-of-accounts': '/app/account/view/tree',
        '/settings': '/app/system-settings',
        '/customers': '/app/customer',
        '/customer/new': '/app/customer/new-customer',
        '/email-templates': '/app/email-template',
        '/suppliers': '/app/supplier',
        '/purchase-invoice/new': '/app/purchase-invoice/new-purchase-invoice',
        '/purchase-invoices': '/app/purchase-invoice',
        '/hr-dashboard': '/app/dashboard-view/Human%20Resource',
        '/attendance-dashboard': '/app/dashboard-view/Attendance',
        '/supplier/new': '/app/supplier/new-supplier',
        '/sales-invoices': '/app/sales-invoice',
        '/sales-invoice/new': '/app/sales-invoice/new-sales-invoice',
        '/sales-order': '/app/sales-order',
        '/purchase-order': '/app/purchase-order',
        '/work-order': '/app/work-order',
        '/payment-order': '/app/payment-order',
        '/payment-term': '/app/payment-term',
        '/payment-term/view/report': '/app/payment-term/view/report',
        '/payment-term/new-payment-term': '/app/payment-term/new-payment-term',
        '/payment-entry/new-payment-entry': '/app/payment-entry/new-payment-entry',
        '/payment-entry': '/app/payment-entry',
        '/payment-entry/view/report': '/app/payment-entry/view/report',
        '/product-bundle': '/app/product-bundle',
        '/product-bundle/new-product-bundle': '/app/product-bundle/new-product-bundle',
        '/expense-claim': '/app/expense-claim',
        '/expense-claim/new-expense-claim': '/app/expense-claim/new-expense-claim',
        '/pos-profile': '/app/pos-profile',
        '/point-of-sale': '/app/point-of-sale',
        '/journal-entry': '/app/journal-entry',
        '/journal-entry/new-journal-entry': '/app/journal-entry/new-journal-entry',
        '/banking': '/app/bank-account',
        '/profile-settings': '/app/user-profile',
        '/reports': '/app/query-report',
        '/payables': '/app/payables',
        '/receivables': '/app/receivables',
        '/financial-reports': '/app/financial-reports',
        '/assets': '/app/assets',
        '/buying': '/app/buying',
        '/selling': '/app/selling',
        '/stock': '/app/stock',
        '/recruitment': '/app/recruitment',
        '/employee-lifecycle': '/app/employee-lifecycle',
        '/performance': '/app/performance',
        '/shift-%26-attendance': '/app/shift-%26-attendance',
        '/expense-claims': '/app/expense-claims',
        '/leaves': '/app/leaves',
        '/salary-payout': '/app/salary-payout',
        '/tax-%26-benefits': '/app/tax-%26-benefits',
        '/accounting': '/app/accounting',
        '/hr': '/app/hr',
        '/payroll': '/app/payroll',
        '/dashboard-view/Asset': '/app/dashboard-view/Asset',
        '/dashboard-view/Selling': '/app/dashboard-view/Selling',
        '/dashboard-view/Buying': '/app/dashboard-view/Buying',
        '/dashboard-view/Stock': '/app/dashboard-view/Stock',
        '/dashboard-view/Accounts': '/app/dashboard-view/Accounts',
        '/item': '/app/item',
        '/item/new-item': '/app/item/new-item',
        '/dashboard': '/app/dashboard-view/Accounts',
        '/quotation': '/app/quotation',
        '/supplier-quotation': '/app/supplier-quotation',
        '/alphax-support':'/app/alphax-support'
    };

    if (iframeRoutes[url]) {
        contentArea.innerHTML = `
        <div class="container">
            <iframe src="${iframeRoutes[url]}" style="width: 100%; height: 100vh; border: none; overflow-y: auto; max-height: 100%;"></iframe>
        </div>
    `;
    } else {
        console.error(`Route not found in iframeRoutes: ${url}. Available routes:`, Object.keys(iframeRoutes));
        contentArea.innerHTML = `
        <div class="container">
            <h2>Content Not Available</h2>
            <p>The requested page "${url}" is not available or has not been configured.</p>
        </div>
    `;
    }
}
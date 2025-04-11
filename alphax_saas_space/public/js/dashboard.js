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

    // Add logo click handler here
    const logoImage = document.querySelector('.brand-logo img');
    if (logoImage) {
        logoImage.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Logo clicked, loading /dashboard');
            loadContent('/dashboard');
        });
    }
}

// Sidebar toggle button
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Add click event for logo to load /dashboard
    // const logoImage = document.querySelector('.brand-logo img');
    // if (logoImage) {
    //     logoImage.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         console.log('Logo clicked, loading /dashboard');
    //         loadContent('/dashboard');
    //     });
    // } else {
    //     console.warn('Logo image not found in .brand-logo');
    // }

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

            const parentLi = this.parentElement;
            const subMenu = parentLi.querySelector('.sub-menu');
            const arrow = this.querySelector('.arrow');

            if (subMenu) {
                const isDisplayed = subMenu.style.display === 'block';

                // Close all other submenus
                document.querySelectorAll('.sub-menu').forEach(menu => {
                    if (menu !== subMenu) {
                        menu.style.display = 'none';
                        menu.parentElement.classList.remove('active');

                        const otherArrow = menu.parentElement.querySelector('.arrow');
                        if (otherArrow) {
                            otherArrow.classList.remove('active');
                        }
                    }
                });

                // Toggle current submenu
                subMenu.style.display = isDisplayed ? 'none' : 'block';
                parentLi.classList.toggle('active', !isDisplayed);

                // Rotate arrow
                if (arrow) {
                    arrow.classList.toggle('active', !isDisplayed);
                }
            } else {
                // If it has a route but no submenu, you can load content here
                const route = this.getAttribute('data-route');
                if (route) {
                    console.log('Loading route:', route);
                    loadContent(route);
                }
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

    // Set up profile dropdown
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

    // Map of URLs to iframe sources
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
        '/pos-profile/new-pos-profile': '/app/pos-profile/new-pos-profile',
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
        '/dashboard': '/app/dashboard-view/Accounts'
    };

    // Load appropriate iframe content
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
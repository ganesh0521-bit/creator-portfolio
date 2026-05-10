// Data state
let customers = [];
let recentActivity = [];
let accountInfo = {};
let services = [];
let notifications = [];

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;
const navItems = document.querySelectorAll('.nav-menu .nav-item');
const views = document.querySelectorAll('.view');
const customerTableBody = document.getElementById('customer-table-body');
const totalCustomersStat = document.getElementById('total-customers-stat');
const activityList = document.getElementById('activity-list');
const toastContainer = document.getElementById('toast-container');

// Modals
const customerModal = document.getElementById('customer-modal');
const addCustomerBtn = document.getElementById('add-customer-btn');
const closeModals = document.querySelectorAll('.close-modal');
const customerForm = document.getElementById('customer-form');

// Account Elements
const accountForm = document.getElementById('account-form');
const headerName = document.getElementById('header-name');

// Services & Notifications Elements
const servicesGridContainer = document.getElementById('services-grid-container');
const addServiceBtn = document.getElementById('add-service-btn');
const serviceModal = document.getElementById('service-modal');
const serviceForm = document.getElementById('service-form');

const notificationBell = document.getElementById('notification-bell');
const notificationsDropdown = document.getElementById('notifications-dropdown');
const notificationsList = document.getElementById('notifications-list');
const notificationBadge = document.getElementById('notification-badge');
const markAllReadBtn = document.getElementById('mark-all-read-btn');

let revenueChartInstance = null;

// Initialize Dashboard
async function init() {
    // Check saved theme
    const savedTheme = localStorage.getItem('nexus_theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    }
    
    await Promise.all([
        fetchAccount(),
        fetchCustomers(),
        fetchActivity(),
        fetchServices(),
        fetchNotifications()
    ]);
    
    renderCustomers();
    renderActivity();
    renderAccount();
    renderServices();
    renderNotifications();
    updateDashboardStats();
    
    await initChart();
}

// --- Fetch Data from Backend ---
async function fetchCustomers() {
    try {
        const response = await fetch('/api/customers');
        customers = await response.json();
    } catch (error) {
        showToast('Failed to load clients from server', 'error');
        console.error(error);
    }
}

async function fetchActivity() {
    try {
        const response = await fetch('/api/activity');
        recentActivity = await response.json();
    } catch (error) {
        console.error("Failed to load activity", error);
    }
}

async function fetchAccount() {
    try {
        const response = await fetch('/api/account');
        accountInfo = await response.json();
    } catch (error) {
        console.error("Failed to load account info", error);
    }
}

async function fetchServices() {
    try {
        const response = await fetch('/api/services');
        services = await response.json();
    } catch (error) {
        console.error("Failed to load services", error);
    }
}

async function fetchNotifications() {
    try {
        const response = await fetch('/api/notifications');
        notifications = await response.json();
    } catch (error) {
        console.error("Failed to load notifications", error);
    }
}


// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexus_theme', newTheme);
    
    // re-init chart to update colors
    if(revenueChartInstance) {
        revenueChartInstance.destroy();
        initChart();
    }
});

// --- Navigation ---
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        views.forEach(view => view.classList.remove('active-view'));
        
        item.classList.add('active');
        
        const targetId = item.getAttribute('data-target');
        if(targetId) {
            document.getElementById(targetId).classList.add('active-view');
        }
    });
});

// --- Render Customers Table ---
function renderCustomers(filterText = '', filterStatus = 'all') {
    customerTableBody.innerHTML = '';
    
    let filteredCustomers = customers.filter(c => {
        const matchesText = c.name.toLowerCase().includes(filterText.toLowerCase()) || 
                            c.company.toLowerCase().includes(filterText.toLowerCase());
        const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
        return matchesText && matchesStatus;
    });

    filteredCustomers.forEach(customer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${customer.name}</strong></td>
            <td>${customer.company}</td>
            <td>${customer.email}</td>
            <td><span class="status-badge status-${customer.status.toLowerCase()}">${customer.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editCustomer(${customer.id})"><i class='bx bx-edit-alt'></i></button>
                    <button class="action-btn delete" onclick="deleteCustomer(${customer.id})"><i class='bx bx-trash'></i></button>
                </div>
            </td>
        `;
        customerTableBody.appendChild(tr);
    });
}

document.getElementById('customer-search').addEventListener('input', (e) => {
    const status = document.getElementById('customer-status-filter').value;
    renderCustomers(e.target.value, status);
});

document.getElementById('customer-status-filter').addEventListener('change', (e) => {
    const text = document.getElementById('customer-search').value;
    renderCustomers(text, e.target.value);
});


// --- Modals Logic (Customers) ---
addCustomerBtn.addEventListener('click', () => {
    document.getElementById('modal-title').innerText = 'Add New Client';
    customerForm.reset();
    document.getElementById('cust-id').value = '';
    customerModal.classList.add('active');
});

closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
        customerModal.classList.remove('active');
        serviceModal.classList.remove('active');
    });
});

customerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('cust-id').value;
    const payload = {
        name: document.getElementById('cust-name').value,
        company: document.getElementById('cust-company').value,
        email: document.getElementById('cust-email').value,
        status: document.getElementById('cust-status').value
    };

    try {
        if (id) {
            await fetch(`/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            showToast('Client updated successfully', 'success');
        } else {
            await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            showToast('Client added successfully', 'success');
        }
        
        await Promise.all([fetchCustomers(), fetchActivity()]);
        
        customerModal.classList.remove('active');
        renderCustomers();
        renderActivity();
        updateDashboardStats();
    } catch (error) {
        showToast('Failed to save client', 'error');
        console.error(error);
    }
});

window.editCustomer = function(id) {
    const customer = customers.find(c => c.id == id);
    if(customer) {
        document.getElementById('modal-title').innerText = 'Edit Client';
        document.getElementById('cust-id').value = customer.id;
        document.getElementById('cust-name').value = customer.name;
        document.getElementById('cust-company').value = customer.company;
        document.getElementById('cust-email').value = customer.email;
        document.getElementById('cust-status').value = customer.status;
        customerModal.classList.add('active');
    }
}

window.deleteCustomer = async function(id) {
    if(confirm('Are you sure you want to delete this client?')) {
        try {
            await fetch(`/api/customers/${id}`, { method: 'DELETE' });
            showToast('Client deleted', 'success');
            
            await Promise.all([fetchCustomers(), fetchActivity()]);
            renderCustomers();
            renderActivity();
            updateDashboardStats();
        } catch (error) {
            showToast('Failed to delete client', 'error');
            console.error(error);
        }
    }
}

// --- Services Logic ---
function renderServices() {
    servicesGridContainer.innerHTML = '';
    services.forEach(service => {
        const div = document.createElement('div');
        div.className = 'service-card glass-card';
        div.innerHTML = `
            <i class='bx ${service.icon} service-icon'></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <span class="price">${service.price}</span>
            <div class="service-actions">
                <button class="action-btn edit" onclick="editService(${service.id})"><i class='bx bx-edit-alt'></i></button>
                <button class="action-btn delete" onclick="deleteService(${service.id})"><i class='bx bx-trash'></i></button>
            </div>
        `;
        servicesGridContainer.appendChild(div);
    });
}

addServiceBtn.addEventListener('click', () => {
    document.getElementById('service-modal-title').innerText = 'Add New Service';
    serviceForm.reset();
    document.getElementById('srv-id').value = '';
    serviceModal.classList.add('active');
});

serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('srv-id').value;
    const payload = {
        title: document.getElementById('srv-title').value,
        description: document.getElementById('srv-desc').value,
        price: document.getElementById('srv-price').value,
        icon: document.getElementById('srv-icon').value
    };

    try {
        if (id) {
            await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            showToast('Service updated successfully', 'success');
        } else {
            await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            showToast('Service added successfully', 'success');
        }
        
        await fetchServices();
        serviceModal.classList.remove('active');
        renderServices();
    } catch (error) {
        showToast('Failed to save service', 'error');
        console.error(error);
    }
});

window.editService = function(id) {
    const service = services.find(s => s.id == id);
    if(service) {
        document.getElementById('service-modal-title').innerText = 'Edit Service';
        document.getElementById('srv-id').value = service.id;
        document.getElementById('srv-title').value = service.title;
        document.getElementById('srv-desc').value = service.description;
        document.getElementById('srv-price').value = service.price;
        document.getElementById('srv-icon').value = service.icon;
        serviceModal.classList.add('active');
    }
}

window.deleteService = async function(id) {
    if(confirm('Are you sure you want to delete this service?')) {
        try {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            showToast('Service deleted', 'success');
            await fetchServices();
            renderServices();
        } catch (error) {
            showToast('Failed to delete service', 'error');
            console.error(error);
        }
    }
}


// --- Account Logic ---
function renderAccount() {
    if (accountInfo.name) {
        document.getElementById('acc-name').value = accountInfo.name;
        document.getElementById('acc-email').value = accountInfo.email;
        document.getElementById('acc-role').value = accountInfo.role;
        headerName.innerText = accountInfo.name;
    }
}

accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('acc-name').value,
        email: document.getElementById('acc-email').value,
        role: document.getElementById('acc-role').value
    };
    
    try {
        await fetch('/api/account', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        showToast('Account details updated', 'success');
        
        await Promise.all([fetchAccount(), fetchActivity()]);
        renderAccount();
        renderActivity();
    } catch (error) {
        showToast('Failed to update account', 'error');
    }
});


// --- Render Recent Activity ---
function renderActivity() {
    activityList.innerHTML = '';
    recentActivity.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
            <div class="activity-icon"><i class='bx ${activity.icon}'></i></div>
            <div class="activity-details">
                <p><strong>${activity.action}</strong>: ${activity.details}</p>
                <span><i class='bx bx-time-five'></i> ${activity.time}</span>
            </div>
        `;
        activityList.appendChild(li);
    });
}

function updateDashboardStats() {
    totalCustomersStat.innerText = customers.length;
}

// --- Notifications Logic ---
function renderNotifications() {
    notificationsList.innerHTML = '';
    const unreadCount = notifications.filter(n => n.is_read === 0).length;
    
    if (unreadCount > 0) {
        notificationBadge.innerText = unreadCount;
        notificationBadge.style.display = 'flex';
    } else {
        notificationBadge.style.display = 'none';
    }

    if (notifications.length === 0) {
        notificationsList.innerHTML = '<li style="text-align: center; color: var(--text-secondary);">No notifications</li>';
        return;
    }

    notifications.forEach(notif => {
        const li = document.createElement('li');
        if (notif.is_read === 0) li.className = 'unread';
        li.innerHTML = `
            <p>${notif.message}</p>
            <span>${notif.time}</span>
        `;
        notificationsList.appendChild(li);
    });
}

notificationBell.addEventListener('click', () => {
    notificationsDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!notificationBell.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.remove('active');
    }
});

markAllReadBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/notifications/read_all', { method: 'PUT' });
        await fetchNotifications();
        renderNotifications();
        notificationsDropdown.classList.remove('active');
    } catch (error) {
        console.error("Failed to mark notifications as read", error);
    }
});




// --- Chart.js Initialization ---
async function initChart() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        const ctx = document.getElementById('revenueChart').getContext('2d');
        const style = getComputedStyle(document.body);
        const accentColor = style.getPropertyValue('--accent-color').trim() || '#6366f1';
        
        revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stats.labels,
                datasets: [{
                    label: 'Revenue ($)',
                    data: stats.data,
                    borderColor: accentColor,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(150, 150, 150, 0.1)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Failed to load chart data", error);
    }
}

// --- Toast Notifications ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'bx-check-circle' : 'bx-error-circle';
    
    toast.innerHTML = `
        <i class='bx ${icon}' style="font-size: 1.5rem;"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Run init on load
window.addEventListener('DOMContentLoaded', init);

// تهيئة التنقل بين الأقسام
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item-bottom');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.getAttribute('data-section')) {
                const targetSection = this.getAttribute('data-section');
                
                // إزالة النشاط من جميع العناصر
                navItems.forEach(navItem => navItem.classList.remove('active'));
                document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
                
                // إضافة النشاط للعنصر الحالي
                this.classList.add('active');
                document.getElementById(targetSection).classList.add('active');
                
                // تحميل البيانات الخاصة بالقسم عند النقر عليه
                if (targetSection === 'dashboard-section') {
                    loadDashboardData();
                } else if (targetSection === 'products-section') {
                    loadProducts();
                } else if (targetSection === 'pos-section') {
                    loadAvailableProducts();
                } else if (targetSection === 'reports-section') {
                    loadReportsData();
                } else if (targetSection === 'suppliers-section') {
                    loadSuppliers();
                } else if (targetSection === 'credit-section') {
                    loadCreditSales();
                }
            }
        });
    });
}

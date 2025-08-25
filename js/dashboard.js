// تحميل بيانات لوحة التحكم
function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    
    // حساب الإحصائيات
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const today = new Date().toLocaleDateString('en-CA');
    const todaySales = sales
        .filter(sale => sale.date === today)
        .reduce((sum, sale) => sum + sale.total, 0);
    
    const lowStockCount = products.filter(product => product.quantity < 10).length;
    
    // حساب إجمالي المبيعات الآجلة
    const totalCredit = creditSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // تحديث واجهة المستخدم
    document.getElementById('total-sales').textContent = totalSales.toLocaleString() + ' ريال';
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('low-stock-count').textContent = lowStockCount;
    document.getElementById('credit-sales').textContent = totalCredit.toLocaleString() + ' ريال';
    
    // تحديث جدول المنتجات الأكثر مبيعاً
    updateTopProductsTable(sales);
    
    // تحديث جدول آخر المبيعات
    updateRecentSalesTable(sales);
    
    // تحديث قائمة المنتجات المنخفضة المخزون
    updateLowStockTable(products);
    
    // تحديث قائمة المنتجات التي أوشكت صلاحيتها على الانتهاء
    updateExpiringProducts(products);
}

// تحديث جدول المنتجات الأكثر مبيعاً
function updateTopProductsTable(sales) {
    // تجميع بيانات المبيعات حسب المنتج
    const productSales = {};
    
    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0
                };
            }
            
            productSales[item.productId].quantity += item.quantity;
            productSales[item.productId].revenue += item.price * item.quantity;
        });
    });
    
    // تحويل إلى مصفوفة وترتيب حسب الإيرادات
    const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    
    // تحديث الجدول
    const tableBody = document.querySelector('#top-products-table tbody');
    tableBody.innerHTML = '';
    
    topProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.revenue.toLocaleString()} ريال</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول آخر المبيعات
function updateRecentSalesTable(sales) {
    // أخذ آخر 5 مبيعات
    const recentSales = sales.slice(-5).reverse();
    
    // تحديث الجدول
    const tableBody = document.querySelector('#recent-sales-table tbody');
    tableBody.innerHTML = '';
    
    recentSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.invoiceNumber}</td>
            <td>${sale.date}</td>
            <td>${sale.total.toLocaleString()} ريال</td>
            <td>${sale.paymentMethod}</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول المنتجات المنخفضة المخزون
function updateLowStockTable(products) {
    const lowStockProducts = products.filter(product => product.quantity < 10);
    
    // تحديث الجدول
    const tableBody = document.querySelector('#low-stock-table tbody');
    tableBody.innerHTML = '';
    
    lowStockProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td class="low-stock">${product.quantity}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action edit-product-btn" data-id="${product.id}">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // إضافة معالجات الأحداث لأزرار التعديل
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
}

// تحديث قائمة المنتجات التي أوشكت صلاحيتها على الانتهاء
function updateExpiringProducts(products) {
    // في هذا المثال، نفترض أن بعض المنتجات لها تاريخ انتهاء صلاحية
    // يمكنك تعديل هذا المنطق وفقاً لبياناتك الفعلية
    const expiringProducts = products.filter(product => product.expiryDate).slice(0, 5);
    
    // تحديث القائمة
    const expiringList = document.getElementById('expiring-products-list');
    expiringList.innerHTML = '';
    
    if (expiringProducts.length === 0) {
        expiringList.innerHTML = '<p class="text-center text-muted">لا توجد منتجات قاربت صلاحيتها على الانتهاء</p>';
        return;
    }
    
    expiringProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${product.name}</span>
                <span class="expiring-soon">${product.expiryDate}</span>
            </div>
        `;
        expiringList.appendChild(productItem);
    });
}

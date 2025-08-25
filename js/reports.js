// تحميل بيانات التقارير
function loadReportsData() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    // تحديث جدول تقارير المخزون
    updateInventoryReportTable(products);
    
    // تحديث جدول تقارير انتهاء الصلاحية
    updateExpiryReportTable(products);
    
    // تحديث جدول المبيعات
    updateSalesReportTable(sales);
    
    // تحديث جدول التدفق النقدي
    updateCashflowTable(sales, expenses);
    
    // إنشاء الرسوم البيانية
    createSalesCharts(sales, products, employees);
    createFinancialCharts(sales, expenses);
}

// تحديث جدول تقارير المخزون
function updateInventoryReportTable(products) {
    const tableBody = document.querySelector('#inventory-report-table tbody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const stockValue = product.price * product.quantity;
        let status = 'جيد';
        let statusClass = 'text-success';
        
        if (product.quantity < 5) {
            status = 'منخفض';
            statusClass = 'text-danger';
        } else if (product.quantity < 15) {
            status = 'متوسط';
            statusClass = 'text-warning';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${stockValue.toLocaleString()} ريال</td>
            <td class="${statusClass}">${status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول تقارير انتهاء الصلاحية
function updateExpiryReportTable(products) {
    const tableBody = document.querySelector('#expiry-report-table tbody');
    tableBody.innerHTML = '';
    
    const today = new Date();
    const expiringProducts = products.filter(product => {
        if (!product.expiryDate) return false;
        const expiryDate = new Date(product.expiryDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0; // المنتجات التي تنتهي خلال 30 يوم
    });
    
    if (expiringProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد منتجات قاربت صلاحيتها على الانتهاء</td></tr>';
        return;
    }
    
    expiringProducts.forEach(product => {
        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.expiryDate}</td>
            <td class="${diffDays < 7 ? 'text-danger' : 'text-warning'}">${diffDays} أيام</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول المبيعات
function updateSalesReportTable(sales) {
    const tableBody = document.querySelector('#sales-report-table tbody');
    tableBody.innerHTML = '';
    
    if (sales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد مبيعات</td></tr>';
        return;
    }
    
    // عرض آخر 20 عملية بيع
    const recentSales = sales.slice(-20).reverse();
    
    recentSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.invoiceNumber}</td>
            <td>${sale.date}</td>
            <td>${sale.employee || 'مدير النظام'}</td>
            <td>${sale.total.toLocaleString()} ريال</td>
            <td>${sale.paymentMethod}</td>
            <td>
                <button class="btn btn-sm btn-info view-sale-btn" data-id="${sale.invoiceNumber}">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning edit-sale-btn" data-id="${sale.invoiceNumber}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-sale-btn" data-id="${sale.invoiceNumber}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // إضافة معالجات الأحداث لأزرار المبيعات
    document.querySelectorAll('.view-sale-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            viewSale(invoiceNumber);
        });
    });
    
    document.querySelectorAll('.edit-sale-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            editSale(invoiceNumber);
        });
    });
    
    document.querySelectorAll('.delete-sale-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            deleteSale(invoiceNumber);
        });
    });
}

// تحديث جدول التدفق النقدي
function updateCashflowTable(sales, expenses) {
    const tableBody = document.querySelector('#cashflow-table tbody');
    tableBody.innerHTML = '';
    
    // جمع جميع المعاملات (مبيعات ومصروفات)
    const transactions = [];
    
    // إضافة المبيعات
    sales.forEach(sale => {
        transactions.push({
            date: sale.date,
            description: `بيع - ${sale.invoiceNumber}`,
            income: sale.total,
            expense: 0,
            type: 'sale'
        });
    });
    
    // إضافة المصروفات
    expenses.forEach(expense => {
        transactions.push({
            date: expense.date,
            description: `مصروف - ${expense.category}`,
            income: 0,
            expense: expense.amount,
            type: 'expense'
        });
    });
    
    // ترتيب المعاملات حسب التاريخ
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // حساب الرصيد المتجمع
    let balance = 0;
    
    // عرض آخر 20 معاملة
    const recentTransactions = transactions.slice(0, 20);
    
    if (recentTransactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد معاملات</td></tr>';
        return;
    }
    
    recentTransactions.forEach(transaction => {
        balance += transaction.income - transaction.expense;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td class="text-success">${transaction.income > 0 ? transaction.income.toLocaleString() + ' ريال' : '-'}</td>
            <td class="text-danger">${transaction.expense > 0 ? transaction.expense.toLocaleString() + ' ريال' : '-'}</td>
            <td class="fw-bold ${balance >= 0 ? 'text-success' : 'text-danger'}">${balance.toLocaleString()} ريال</td>
        `;
        tableBody.appendChild(row);
    });
}

// إنشاء الرسوم البيانية للتقرير
function createSalesCharts(sales, products, employees) {
    // رسم بياني للمبيعات حسب الفئة
    const salesByCategory = {};
    products.forEach(product => {
        salesByCategory[product.category] = 0;
    });
    
    sales.forEach(sale => {
        sale.items.forEach(item => {
            const product = products.find(p => p.id == item.productId);
            if (product) {
                salesByCategory[product.category] += item.quantity * item.price;
            }
        });
    });
    
    const salesByCategoryCtx = document.getElementById('salesByCategoryChart').getContext('2d');
    if (salesByCategoryCtx) {
        new Chart(salesByCategoryCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(salesByCategory),
                datasets: [{
                    data: Object.values(salesByCategory),
                    backgroundColor: [
                        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#f8f9fc', '#5a5c69'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
    }
    
    // رسم بياني للمبيعات اليومية (آخر 7 أيام)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-CA'));
    }
    
    const dailySalesData = last7Days.map(date => {
        const daySales = sales.filter(sale => sale.date === date);
        return daySales.reduce((sum, sale) => sum + sale.total, 0);
    });
    
    const dailySalesCtx = document.getElementById('dailySalesChart').getContext('2d');
    if (dailySalesCtx) {
        new Chart(dailySalesCtx, {
            type: 'bar',
            data: {
                labels: last7Days.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('ar-YE');
                }),
                datasets: [{
                    label: 'المبيعات بالريال اليمني',
                    data: dailySalesData,
                    backgroundColor: '#4e73df'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // رسم بياني للمبيعات حسب الموظف
    const salesByEmployee = {};
    employees.forEach(employee => {
        salesByEmployee[employee.name] = 0;
    });
    
    sales.forEach(sale => {
        const employeeName = sale.employee || 'مدير النظام';
        if (!salesByEmployee[employeeName]) {
            salesByEmployee[employeeName] = 0;
        }
        salesByEmployee[employeeName] += sale.total;
    });
    
    const salesByEmployeeCtx = document.getElementById('salesByEmployeeChart').getContext('2d');
    if (salesByEmployeeCtx) {
        new Chart(salesByEmployeeCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(salesByEmployee),
                datasets: [{
                    data: Object.values(salesByEmployee),
                    backgroundColor: [
                        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
    }
}

// إنشاء الرسوم البيانية المالية
function createFinancialCharts(sales, expenses) {
    // رسم بياني للأرباح والمصروفات (آخر 6 أشهر)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        last6Months.push(date.toLocaleDateString('ar-YE', { year: 'numeric', month: 'long' }));
    }
    
    // تجميع المبيعات والمصروفات حسب الشهر
    const monthlySales = {};
    const monthlyExpenses = {};
    
    last6Months.forEach(month => {
        monthlySales[month] = 0;
        monthlyExpenses[month] = 0;
    });
    
    sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        const saleMonth = saleDate.toLocaleDateString('ar-YE', { year: 'numeric', month: 'long' });
        
        if (monthlySales[saleMonth] !== undefined) {
            monthlySales[saleMonth] += sale.total;
        }
    });
    
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.toLocaleDateString('ar-YE', { year: 'numeric', month: 'long' });
        
        if (monthlyExpenses[expenseMonth] !== undefined) {
            monthlyExpenses[expenseMonth] += expense.amount;
        }
    });
    
    const profitExpensesCtx = document.getElementById('profitExpensesChart').getContext('2d');
    if (profitExpensesCtx) {
        new Chart(profitExpensesCtx, {
            type: 'bar',
            data: {
                labels: last6Months,
                datasets: [
                    {
                        label: 'المبيعات',
                        data: Object.values(monthlySales),
                        backgroundColor: '#1cc88a'
                    },
                    {
                        label: 'المصروفات',
                        data: Object.values(monthlyExpenses),
                        backgroundColor: '#e74a3b'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // رسم بياني لتحليل الأرباح (صافي الربح)
    const monthlyProfit = {};
    last6Months.forEach(month => {
        monthlyProfit[month] = monthlySales[month] - monthlyExpenses[month];
    });
    
    const profitAnalysisCtx = document.getElementById('profitAnalysisChart').getContext('2d');
    if (profitAnalysisCtx) {
        new Chart(profitAnalysisCtx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'صافي الربح',
                    data: Object.values(monthlyProfit),
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: '#4e73df',
                    pointBackgroundColor: '#4e73df',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// تطبيق الفلتر على التقارير
function applyReportFilter() {
    const period = document.getElementById('report-period').value;
    let fromDate, toDate;
    
    const today = new Date();
    
    switch (period) {
        case 'today':
            fromDate = toDate = today.toLocaleDateString('en-CA');
            break;
        case 'week':
            fromDate = new Date(today);
            fromDate.setDate(today.getDate() - 7);
            fromDate = fromDate.toLocaleDateString('en-CA');
            toDate = today.toLocaleDateString('en-CA');
            break;
        case 'month':
            fromDate = new Date(today);
            fromDate.setMonth(today.getMonth() - 1);
            fromDate = fromDate.toLocaleDateString('en-CA');
            toDate = today.toLocaleDateString('en-CA');
            break;
        case 'year':
            fromDate = new Date(today);
            fromDate.setFullYear(today.getFullYear() - 1);
            fromDate = fromDate.toLocaleDateString('en-CA');
            toDate = today.toLocaleDateString('en-CA');
            break;
        case 'custom':
            fromDate = document.getElementById('report-from').value;
            toDate = document.getElementById('report-to').value;
            break;
    }
    
    // في التطبيق الحقيقي، سنقوم بتصفية البيانات حسب التاريخ المحدد
    // هنا سنقوم فقط بعرض فترة التقرير
    alert(`تم تطبيق الفلتر للفترة من ${fromDate} إلى ${toDate}`);
    
    // إعادة تحميل بيانات التقارير مع التصفية
    loadReportsData();
}

// توليد التقرير
function generateReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // إضافة عنوان التقرير بالعربية
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('تقرير المتجر', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-YE')}`, 105, 25, { align: 'center' });
    
    // إضافة إحصائيات سريعة
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const today = new Date().toLocaleDateString('en-CA');
    const todaySales = sales
        .filter(sale => sale.date === today)
        .reduce((sum, sale) => sum + sale.total, 0);
    
    const lowStockCount = products.filter(product => product.quantity < 10).length;
    const totalCredit = creditSales.reduce((sum, sale) => sum + sale.remainingAmount, 0);
    
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`إجمالي المبيعات: ${totalSales.toLocaleString()} ريال`, 20, 40);
    doc.text(`مبيعات اليوم: ${todaySales.toLocaleString()} ريال`, 20, 50);
    doc.text(`عدد المنتجات: ${products.length}`, 20, 60);
    doc.text(`المنتجات منخفضة المخزون: ${lowStockCount}`, 20, 70);
    doc.text(`المبيعات الآجلة: ${totalCredit.toLocaleString()} ريال`, 20, 80);
    
    // إضافة جدول بالمنتجات الأكثر مبيعاً
    let y = 100;
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    
    doc.setFontSize(14);
    doc.text('المنتجات الأكثر مبيعاً', 105, y, { align: 'center' });
    y += 10;
    
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
    
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('المنتج', 180, y, { align: 'right' });
    doc.text('الكمية', 140, y, { align: 'right' });
    doc.text('الإيرادات', 100, y, { align: 'right' });
    
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(10, y, 200, y);
    y += 10;
    
    topProducts.forEach(product => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.setTextColor(40, 40, 40);
        doc.text(product.name, 180, y, { align: 'right' });
        doc.text(product.quantity.toString(), 140, y, { align: 'right' });
        doc.text(product.revenue.toLocaleString() + ' ريال', 100, y, { align: 'right' });
        y += 10;
    });
    
    // حفظ PDF
    doc.save('تقرير-المتجر.pdf');
    
    alert('تم توليد التقرير بنجاح');
}

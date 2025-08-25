// تحميل المبيعات الآجلة
function loadCreditSales() {
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    const paidCreditSales = JSON.parse(localStorage.getItem('paidCreditSales') || '[]');
    
    // تحديث جدول الفواتير الآجلة غير المسددة
    const creditTableBody = document.querySelector('#credit-sales-table tbody');
    creditTableBody.innerHTML = '';
    
    if (creditSales.length === 0) {
        creditTableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد فواتير آجلة</td></tr>';
    } else {
        creditSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.invoiceNumber}</td>
                <td>${sale.date}</td>
                <td>${sale.customerName}</td>
                <td>${sale.total.toLocaleString()} ريال</td>
                <td>${sale.remainingAmount.toLocaleString()} ريال</td>
                <td>
                    <button class="btn btn-sm btn-success pay-credit-btn" data-id="${sale.invoiceNumber}">
                        <i class="bi bi-cash"></i> تسديد
                    </button>
                    <button class="btn btn-sm btn-info view-credit-btn" data-id="${sale.invoiceNumber}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            creditTableBody.appendChild(row);
        });
    }
    
    // تحديث جدول الفواتير المسددة
    const paidTableBody = document.querySelector('#paid-credit-table tbody');
    paidTableBody.innerHTML = '';
    
    if (paidCreditSales.length === 0) {
        paidTableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد فواتير مسددة</td></tr>';
    } else {
        paidCreditSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.invoiceNumber}</td>
                <td>${sale.date}</td>
                <td>${sale.customerName}</td>
                <td>${sale.total.toLocaleString()} ريال</td>
                <td>${sale.paymentDate}</td>
                <td>
                    <button class="btn btn-sm btn-info view-paid-credit-btn" data-id="${sale.invoiceNumber}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            paidTableBody.appendChild(row);
        });
    }
    
    // إضافة معالجات الأحداث لأزرار التسديد والعرض
    document.querySelectorAll('.pay-credit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            openPayCreditModal(invoiceNumber);
        });
    });
    
    document.querySelectorAll('.view-credit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            viewCreditSale(invoiceNumber);
        });
    });
    
    document.querySelectorAll('.view-paid-credit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            viewPaidCreditSale(invoiceNumber);
        });
    });
}

// فتح نموذج تسديد الدين
function openPayCreditModal(invoiceNumber) {
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    const sale = creditSales.find(s => s.invoiceNumber === invoiceNumber);
    
    if (!sale) {
        alert('لم يتم العثور على الفاتورة');
        return;
    }
    
    // تعبئة النموذج ببيانات الفاتورة
    document.getElementById('credit-invoice-id').value = sale.invoiceNumber;
    document.getElementById('credit-invoice-number').value = sale.invoiceNumber;
    document.getElementById('credit-customer-name').value = sale.customerName;
    document.getElementById('credit-total-amount').value = sale.total.toLocaleString() + ' ريال';
    document.getElementById('credit-remaining-amount').value = sale.remainingAmount.toLocaleString() + ' ريال';
    document.getElementById('credit-payment-amount').value = sale.remainingAmount;
    document.getElementById('credit-payment-amount').setAttribute('max', sale.remainingAmount);
    
    // فتح النموذج
    const payModal = new bootstrap.Modal(document.getElementById('payCreditModal'));
    payModal.show();
}

// تأكيد تسديد الدين
function confirmCreditPayment() {
    const invoiceNumber = document.getElementById('credit-invoice-id').value;
    const paymentAmount = parseFloat(document.getElementById('credit-payment-amount').value);
    const paymentMethod = document.getElementById('credit-payment-method').value;
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert('يرجى إدخال مبلغ صحيح');
        return;
    }
    
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    const saleIndex = creditSales.findIndex(s => s.invoiceNumber === invoiceNumber);
    
    if (saleIndex === -1) {
        alert('لم يتم العثور على الفاتورة');
        return;
    }
    
    const sale = creditSales[saleIndex];
    
    if (paymentAmount > sale.remainingAmount) {
        alert('المبلغ المسدد أكبر من المبلغ المتبقي');
        return;
    }
    
    // تحديث المبلغ المتبقي
    sale.remainingAmount -= paymentAmount;
    
    if (sale.remainingAmount <= 0) {
        // إذا تم سداد كامل المبلغ، نقل الفاتورة إلى الفواتير المسددة
        const paidCreditSales = JSON.parse(localStorage.getItem('paidCreditSales') || '[]');
        
        sale.paymentDate = new Date().toLocaleDateString('en-CA');
        sale.paymentMethod = paymentMethod;
        
        paidCreditSales.push(sale);
        localStorage.setItem('paidCreditSales', JSON.stringify(paidCreditSales));
        
        // إزالة الفاتورة من الفواتير الآجلة
        creditSales.splice(saleIndex, 1);
        
        alert('تم سداد الدين بالكامل بنجاح');
    } else {
        // إذا لم يتم سداد كامل المبلغ، تحديث الفاتورة فقط
        creditSales[saleIndex] = sale;
        alert('تم تسديد جزء من الدين بنجاح');
    }
    
    // حفظ البيانات المحدثة
    localStorage.setItem('creditSales', JSON.stringify(creditSales));
    
    // إغلاق النموذج
    bootstrap.Modal.getInstance(document.getElementById('payCreditModal')).hide();
    
    // إعادة تحميل البيانات
    loadCreditSales();
    loadDashboardData();
}

// عرض تفاصيل فاتورة آجلة
function viewCreditSale(invoiceNumber) {
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    const sale = creditSales.find(s => s.invoiceNumber === invoiceNumber);
    
    if (!sale) {
        alert('لم يتم العثور على الفاتورة');
        return;
    }
    
    let message = `رقم الفاتورة: ${sale.invoiceNumber}\n`;
    message += `التاريخ: ${sale.date}\n`;
    message += `اسم العميل: ${sale.customerName}\n`;
    message += `الإجمالي: ${sale.total.toLocaleString()} ريال\n`;
    message += `المبلغ المتبقي: ${sale.remainingAmount.toLocaleString()} ريال\n\n`;
    message += 'المنتجات:\n';
    
    sale.items.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ${item.price.toLocaleString()} ريال) = ${(item.quantity * item.price).toLocaleString()} ريال\n`;
    });
    
    alert(message);
}

// عرض تفاصيل فاتورة مسددة
function viewPaidCreditSale(invoiceNumber) {
    const paidCreditSales = JSON.parse(localStorage.getItem('paidCreditSales') || '[]');
    const sale = paidCreditSales.find(s => s.invoiceNumber === invoiceNumber);
    
    if (!sale) {
        alert('لم يتم العثور على الفاتورة');
        return;
    }
    
    let message = `رقم الفاتورة: ${sale.invoiceNumber}\n`;
    message += `تاريخ البيع: ${sale.date}\n`;
    message += `اسم العميل: ${sale.customerName}\n`;
    message += `الإجمالي: ${sale.total.toLocaleString()} ريال\n`;
    message += `تاريخ التسديد: ${sale.paymentDate}\n`;
    message += `طريقة الدفع: ${sale.paymentMethod}\n\n`;
    message += 'المنتجات:\n';
    
    sale.items.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ${item.price.toLocaleString()} ريال) = ${(item.quantity * item.price).toLocaleString()} ريال\n`;
    });
    
    alert(message);
}

// البحث في المبيعات الآجلة
function searchCreditSales() {
    const searchTerm = document.getElementById('credit-search').value.toLowerCase();
    const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
    const paidCreditSales = JSON.parse(localStorage.getItem('paidCreditSales') || '[]');
    
    // تصفية الفواتير غير المسددة
    const filteredCredit = creditSales.filter(sale => 
        sale.customerName.toLowerCase().includes(searchTerm) || 
        sale.invoiceNumber.includes(searchTerm)
    );
    
    // تصفية الفواتير المسددة
    const filteredPaid = paidCreditSales.filter(sale => 
        sale.customerName.toLowerCase().includes(searchTerm) || 
        sale.invoiceNumber.includes(searchTerm)
    );
    
    // تحديث الجداول
    updateCreditTable(filteredCredit, document.querySelector('#credit-sales-table tbody'));
    updateCreditTable(filteredPaid, document.querySelector('#paid-credit-table tbody'), true);
}

// تحديث جدول المبيعات الآجلة
function updateCreditTable(sales, tableBody, isPaid = false) {
    tableBody.innerHTML = '';
    
    if (sales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد فواتير</td></tr>';
        return;
    }
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        
        if (isPaid) {
            row.innerHTML = `
                <td>${sale.invoiceNumber}</td>
                <td>${sale.date}</td>
                <td>${sale.customerName}</td>
                <td>${sale.total.toLocaleString()} ريال</td>
                <td>${sale.paymentDate}</td>
                <td>
                    <button class="btn btn-sm btn-info view-paid-credit-btn" data-id="${sale.invoiceNumber}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${sale.invoiceNumber}</td>
                <td>${sale.date}</td>
                <td>${sale.customerName}</td>
                <td>${sale.total.toLocaleString()} ريال</td>
                <td>${sale.remainingAmount.toLocaleString()} ريال</td>
                <td>
                    <button class="btn btn-sm btn-success pay-credit-btn" data-id="${sale.invoiceNumber}">
                        <i class="bi bi-cash"></i> تسديد
                    </button>
                    <button class="btn btn-sm btn-info view-credit-btn" data-id="${sale.invoiceNumber}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
        }
        
        tableBody.appendChild(row);
    });
    
    // إعادة إضافة معالجات الأحداث
    if (!isPaid) {
        document.querySelectorAll('.pay-credit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceNumber = this.getAttribute('data-id');
                openPayCreditModal(invoiceNumber);
            });
        });
        
        document.querySelectorAll('.view-credit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceNumber = this.getAttribute('data-id');
                viewCreditSale(invoiceNumber);
            });
        });
    } else {
        document.querySelectorAll('.view-paid-credit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceNumber = this.getAttribute('data-id');
                viewPaidCreditSale(invoiceNumber);
            });
        }); 
    }
}

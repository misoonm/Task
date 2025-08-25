// تحميل بيانات الموردين
function loadSuppliers() {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    
    // تحديث جدول الموردين
    const suppliersTableBody = document.querySelector('#suppliers-table tbody');
    suppliersTableBody.innerHTML = '';
    
    if (suppliers.length === 0) {
        suppliersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد موردين</td></tr>';
    } else {
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.contact || '-'}</td>
                <td>${supplier.phone || '-'}</td>
                <td>${supplier.email || '-'}</td>
                <td>${supplier.products || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-supplier-btn" data-id="${supplier.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-supplier-btn" data-id="${supplier.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            suppliersTableBody.appendChild(row);
        });
    }
    
    // تحديث جدول المشتريات
    const purchasesTableBody = document.querySelector('#purchases-table tbody');
    purchasesTableBody.innerHTML = '';
    
    if (purchases.length === 0) {
        purchasesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد مشتريات</td></tr>';
    } else {
        // عرض آخر 20 عملية شراء
        const recentPurchases = purchases.slice(-20).reverse();
        
        recentPurchases.forEach(purchase => {
            const supplier = suppliers.find(s => s.id === purchase.supplierId);
            const supplierName = supplier ? supplier.name : 'مورد غير معروف';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${purchase.invoiceNumber}</td>
                <td>${purchase.date}</td>
                <td>${supplierName}</td>
                <td>${purchase.items.length} منتج</td>
                <td>${purchase.total.toLocaleString()} ريال</td>
                <td>
                    <button class="btn btn-sm btn-info view-purchase-btn" data-id="${purchase.invoiceNumber}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            purchasesTableBody.appendChild(row);
        });
    }
    
    // إضافة معالجات الأحداث لأزرار الموردين
    document.querySelectorAll('.edit-supplier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const supplierId = this.getAttribute('data-id');
            editSupplier(supplierId);
        });
    });
    
    document.querySelectorAll('.delete-supplier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const supplierId = this.getAttribute('data-id');
            deleteSupplier(supplierId);
        });
    });
    
    document.querySelectorAll('.view-purchase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceNumber = this.getAttribute('data-id');
            viewPurchase(invoiceNumber);
        });
    });
    
    // تحديث قائمة الموردين في النماذج
    updateSuppliersDropdown();
}

// حفظ مورد جديد
function saveSupplier() {
    const name = document.getElementById('supplierName').value;
    const contact = document.getElementById('supplierContact').value;
    const phone = document.getElementById('supplierPhone').value;
    const email = document.getElementById('supplierEmail').value;
    const address = document.getElementById('supplierAddress').value;
    const products = document.getElementById('supplierProducts').value;
    
    if (!name) {
        alert('يرجى إدخال اسم المورد');
        return;
    }
    
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const newSupplier = {
        id: Date.now().toString(),
        name,
        contact,
        phone,
        email,
        address,
        products
    };
    
    suppliers.push(newSupplier);
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    
    // إغلاق النموذج وإعادة التحميل
    bootstrap.Modal.getInstance(document.getElementById('addSupplierModal')).hide();
    document.getElementById('add-supplier-form').reset();
    
    // إعادة تحميل البيانات
    loadSuppliers();
    
    alert('تم حفظ المورد بنجاح');
}

// تحرير مورد
function editSupplier(supplierId) {
    // سيتم تنفيذ هذه الوظيفة في جزء لاحق
    alert('سيتم تنفيذ وظيفة تحرير المورد في جزء لاحق');
}

// حذف مورد
function deleteSupplier(supplierId) {
    if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) {
        return;
    }
    
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const filteredSuppliers = suppliers.filter(s => s.id !== supplierId);
    
    localStorage.setItem('suppliers', JSON.stringify(filteredSuppliers));
    
    // إعادة تحميل البيانات
    loadSuppliers();
    
    alert('تم حذف المورد بنجاح');
}

// عرض تفاصيل عملية الشراء
function viewPurchase(invoiceNumber) {
    // سيتم تنفيذ هذه الوظيفة في جزء لاحق
    alert(`عرض تفاصيل عملية الشراء رقم: ${invoiceNumber}`);
}

// تهيئة قاعدة البيانات
function initDatabase() {
    // إذا لم تكن البيانات موجودة، قم بتهيئتها
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('sales')) {
        localStorage.setItem('sales', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('creditSales')) {
        localStorage.setItem('creditSales', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('paidCreditSales')) {
        localStorage.setItem('paidCreditSales', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('suppliers')) {
        localStorage.setItem('suppliers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('employees')) {
        // إضافة موظف افتراضي
        localStorage.setItem('employees', JSON.stringify([
            { id: 1, name: 'مدير النظام', role: 'مدير' }
        ]));
    }
    
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('storeName')) {
        localStorage.setItem('storeName', 'متجري');
    }
    
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', JSON.stringify({
            enableBarcode: true,
            enableDiscounts: true,
            receiptFooter: 'شكراً لشرائكم من متجرنا'
        }));
    }
    
    // تعيين اسم المتجر
    document.getElementById('store-name').textContent = localStorage.getItem('storeName');
}

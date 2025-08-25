// عرض تفاصيل عملية البيع
function viewSale(invoiceNumber) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const sale = sales.find(s => s.invoiceNumber === invoiceNumber);
    
    if (!sale) {
        alert('لم يتم العثور على الفاتورة');
        return;
    }
    
    let message = `رقم الفاتورة: ${sale.invoiceNumber}\n`;
    message += `التاريخ: ${sale.date}\n`;
    message += `طريقة الدفع: ${sale.paymentMethod}\n`;
    message += `الإجمالي: ${sale.total.toLocaleString()} ريال\n\n`;
    message += 'المنتجات:\n';
    
    sale.items.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ${item.price.toLocaleString()} ريال) = ${(item.quantity * item.price).toLocaleString()} ريال\n`;
    });
    
    if (sale.discount > 0) {
        message += `\nالخصم: ${sale.discount.toLocaleString()} ريال`;
    }
    
    alert(message);
}

// تحرير عملية البيع
function editSale(invoiceNumber) {
    // سيتم تنفيذ هذه الوظيفة في جزء لاحق
    alert(`تحرير عملية البيع رقم: ${invoiceNumber} - هذه الميزة قيد التطوير`);
}

// حذف عملية البيع
function deleteSale(invoiceNumber) {
    if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟ سيتم استعادة المخزون.')) {
        return;
    }
    
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const saleIndex = sales.findIndex(s => s.invoiceNumber === invoiceNumber);
    
    if (saleIndex === -1) {
        alert('لم يتم العثور على الفاتورة');
        return;
    }
    
    const sale = sales[saleIndex];
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // استعادة المخزون
    sale.items.forEach(item => {
        const productIndex = products.findIndex(p => p.id == item.productId);
        if (productIndex !== -1) {
            products[productIndex].quantity += item.quantity;
        }
    });
    
    // حذف الفاتورة
    sales.splice(saleIndex, 1);
    
    // حفظ البيانات المحدثة
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('products', JSON.stringify(products));
    
    // إعادة تحميل البيانات
    loadReportsData();
    loadDashboardData();
    
    alert('تم حذف الفاتورة واستعادة المخزون بنجاح');
}

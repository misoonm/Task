// تحميل المنتجات المتاحة لنقطة البيع
function loadAvailableProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const availableProductsDiv = document.getElementById('available-products');
    availableProductsDiv.innerHTML = '';
    
    if (products.length === 0) {
        availableProductsDiv.innerHTML = '<p class="text-center text-muted">لا توجد منتجات متاحة</p>';
        return;
    }
    
    products.forEach(product => {
        if (product.quantity > 0) {
            const productCard = document.createElement('div');
            productCard.className = 'product-item cursor-pointer';
            productCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${product.image || 'https://via.placeholder.com/40'}" class="product-image me-2" alt="${product.name}">
                        <div>
                            <h6 class="mb-0">${product.name}</h6>
                            <small class="text-muted">${product.price.toLocaleString()} ريال</small>
                        </div>
                    </div>
                    <span class="badge bg-primary">${product.quantity} متوفر</span>
                </div>
            `;
            
            productCard.addEventListener('click', function() {
                addToCart(product);
            });
            
            availableProductsDiv.appendChild(productCard);
        }
    });
}

// البحث في نقطة البيع
function searchProductsPOS() {
    const searchTerm = document.getElementById('pos-product-search').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const availableProductsDiv = document.getElementById('available-products');
    availableProductsDiv.innerHTML = '';
    
    const filteredProducts = products.filter(product => 
        product.quantity > 0 && (
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm) ||
            (product.barcode && product.barcode.includes(searchTerm))
        )
    );
    
    if (filteredProducts.length === 0) {
        availableProductsDiv.innerHTML = '<p class="text-center text-muted">لا توجد منتجات تطابق البحث</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-item cursor-pointer';
        productCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${product.image || 'https://via.placeholder.com/40'}" class="product-image me-2" alt="${product.name}">
                    <div>
                        <h6 class="mb-0">${product.name}</h6>
                        <small class="text-muted">${product.price.toLocaleString()} ريال</small>
                    </div>
                </div>
                <span class="badge bg-primary">${product.quantity} متوفر</span>
            </div>
        `;
        
        productCard.addEventListener('click', function() {
            addToCart(product);
            // مسح شريط البحث بعد الإضافة
            document.getElementById('pos-product-search').value = '';
            // إعادة تحميل قائمة المنتجات المتاحة
            loadAvailableProducts();
        });
        
        availableProductsDiv.appendChild(productCard);
    });
}

// إضافة منتج إلى السلة
function addToCart(product) {
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    // إخفاء رسالة السلة الفارغة إذا كانت مرئية
    if (emptyCartMessage.style.display !== 'none') {
        emptyCartMessage.style.display = 'none';
    }
    
    // التحقق إذا كان المنتج موجوداً بالفعل في السلة
    const existingItem = document.querySelector(`.cart-item[data-id="${product.id}"]`);
    
    if (existingItem) {
        // زيادة الكمية إذا كان المنتج موجوداً
        const quantityElement = existingItem.querySelector('.item-quantity');
        let quantity = parseInt(quantityElement.textContent);
        
        if (quantity < product.quantity) {
            quantity++;
            quantityElement.textContent = quantity;
            
            // تحديث السعر الإجمالي لهذا المنتج
            const totalElement = existingItem.querySelector('.item-total');
            totalElement.textContent = (quantity * product.price).toLocaleString() + ' ريال';
        } else {
            alert('لا يمكن إضافة كمية أكثر من المتاحة في المخزون');
        }
    } else {
        // إضافة منتج جديد إلى السلة
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', product.id);
        cartItem.innerHTML = `
            <div>
                <h6 class="mb-0">${product.name}</h6>
                <small class="text-muted">${product.price.toLocaleString()} ريال للوحدة</small>
            </div>
            <div class="cart-quantity">
                <button class="btn btn-sm btn-outline-secondary decrease-btn">-</button>
                <span class="mx-2 item-quantity">1</span>
                <button class="btn btn-sm btn-outline-secondary increase-btn">+</button>
                <span class="mx-3 item-total">${product.price.toLocaleString()} ريال</span>
                <button class="btn btn-sm btn-danger remove-btn">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        // إضافة معالجات الأحداث للأزرار
        const decreaseBtn = cartItem.querySelector('.decrease-btn');
        const increaseBtn = cartItem.querySelector('.increase-btn');
        const removeBtn = cartItem.querySelector('.remove-btn');
        
        decreaseBtn.addEventListener('click', function() {
            const quantityElement = cartItem.querySelector('.item-quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                
                const totalElement = cartItem.querySelector('.item-total');
                totalElement.textContent = (quantity * product.price).toLocaleString() + ' ريال';
                
                updateCartTotal();
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const quantityElement = cartItem.querySelector('.item-quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity < product.quantity) {
                quantity++;
                quantityElement.textContent = quantity;
                
                const totalElement = cartItem.querySelector('.item-total');
                totalElement.textContent = (quantity * product.price).toLocaleString() + ' ريال';
                
                updateCartTotal();
            } else {
                alert('لا يمكن إضافة كمية أكثر من المتاحة في المخزون');
            }
        });
        
        removeBtn.addEventListener('click', function() {
            cartItem.remove();
            updateCartTotal();
            
            // إذا كانت السلة فارغة، عرض الرسالة
            if (document.querySelectorAll('.cart-item').length === 0) {
                emptyCartMessage.style.display = 'block';
                document.getElementById('discount-section').style.display = 'none';
            }
        });
        
        cartItems.appendChild(cartItem);
        
        // إظهار قسم الخصم إذا كان مفعل في الإعدادات
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        if (settings.enableDiscounts !== false) {
            document.getElementById('discount-section').style.display = 'block';
        }
    }
    
    updateCartTotal();
}

// تحديث الإجمالي في السلة
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const totalText = item.querySelector('.item-total').textContent;
        const itemTotal = parseFloat(totalText.replace(/[^\d.]/g, ''));
        total += itemTotal;
    });
    
    // تطبيق الخصم إذا كان موجوداً
    const discountAmount = parseFloat(document.getElementById('discount-amount').textContent.replace(/[^\d.]/g, '') || 0);
    const finalTotal = total - discountAmount;
    
    document.getElementById('cart-total').textContent = finalTotal.toLocaleString() + ' ريال';
}

// تطبيق الخصم على السلة
function applyDiscount() {
    const discountValue = parseFloat(document.getElementById('discount-value').value);
    const discountType = document.getElementById('discount-type').value;
    
    if (isNaN(discountValue) || discountValue < 0) {
        alert('يرجى إدخال قيمة خصم صحيحة');
        return;
    }
    
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const totalText = item.querySelector('.item-total').textContent;
        const itemTotal = parseFloat(totalText.replace(/[^\d.]/g, ''));
        total += itemTotal;
    });
    
    let discountAmount = 0;
    
    if (discountType === 'percent') {
        // خصم بنسبة مئوية
        discountAmount = total * (discountValue / 100);
    } else {
        // خصم بقيمة ثابتة
        discountAmount = discountValue;
    }
    
    // التأكد من أن الخصم لا يتجاوز الإجمالي
    if (discountAmount > total) {
        discountAmount = total;
    }
    
    document.getElementById('discount-amount').textContent = discountAmount.toLocaleString() + ' ريال';
    updateCartTotal();
}

// مسح السلة
function clearCart() {
    if (!confirm('هل أنت متأكد من مسح السلة؟')) {
        return;
    }
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    document.getElementById('empty-cart-message').style.display = 'block';
    document.getElementById('cart-total').textContent = '0 ريال';
    document.getElementById('discount-section').style.display = 'none';
    document.getElementById('discount-value').value = '0';
    document.getElementById('discount-amount').textContent = '0 ريال';
}

// إتمام عملية البيع
function completeSale() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length === 0) {
        alert('السلة فارغة، يرجى إضافة منتجات أولاً');
        return;
    }
    
    // الحصول على طريقة الدفع
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // الحصول على اسم العميل إذا كانت طريقة الدفع آجلة
    const customerName = paymentMethod === 'آجل' ? document.getElementById('customer-name').value : null;
    
    if (paymentMethod === 'آجل' && !customerName) {
        alert('يرجى إدخال اسم العميل للبيع الآجل');
        return;
    }
    
    // الحصول على قيمة الخصم
    const discountAmount = parseFloat(document.getElementById('discount-amount').textContent.replace(/[^\d.]/g, '') || 0);
    
    // تجهيز بيانات البيع
    const sale = {
        invoiceNumber: 'INV-' + Date.now(),
        date: new Date().toLocaleDateString('en-CA'),
        items: [],
        total: parseFloat(document.getElementById('cart-total').textContent.replace(/[^\d.]/g, '')),
        discount: discountAmount,
        paymentMethod,
        customerName,
        employee: 'مدير النظام' // يمكن تغيير هذا حسب المستخدم المسجل دخوله
    };
    
    // تحديث المخزون وإعداد عناصر البيع
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    let hasError = false;
    
    cartItems.forEach(item => {
        const productId = item.getAttribute('data-id');
        const quantity = parseInt(item.querySelector('.item-quantity').textContent);
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert(`المنتج غير موجود: ${productId}`);
            hasError = true;
            return;
        }
        
        if (product.quantity < quantity) {
            alert(`الكمية المطلوبة غير متوفرة للمنتج: ${product.name}`);
            hasError = true;
            return;
        }
        
        // تحديث المخزون
        product.quantity -= quantity;
        
        // إضافة إلى عناصر البيع
        sale.items.push({
            productId,
            name: product.name,
            price: product.price,
            quantity
        });
    });
    
    if (hasError) {
        alert('حدث خطأ أثناء معالجة البيع، يرجى المحاولة مرة أخرى');
        return;
    }
    
    // حفظ البيانات المحدثة
    localStorage.setItem('products', JSON.stringify(products));
    
    if (paymentMethod === 'آجل') {
        // حفظ كفاتورة آجلة
        const creditSales = JSON.parse(localStorage.getItem('creditSales') || '[]');
        sale.remainingAmount = sale.total; // المبلغ المتبقي يساوي الإجمالي في البداية
        creditSales.push(sale);
        localStorage.setItem('creditSales', JSON.stringify(creditSales));
        
        alert('تم إتمام البيع الآجل بنجاح');
    } else {
        // حفظ كفاتورة عادية
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        sales.push(sale);
        localStorage.setItem('sales', JSON.stringify(sales));
        
        // طباعة الفاتورة
        printInvoice(sale);
        
        alert('تم إتمام البيع بنجاح وتمت طباعة الفاتورة');
    }
    
    // مسح السلة وإعادة التحميل
    clearCart();
    loadAvailableProducts();
    loadDashboardData();
}

// طباعة الفاتورة
function printInvoice(sale) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // إضافة محتوى الفاتورة بالعربية
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(localStorage.getItem('storeName') || 'متجري', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`رقم الفاتورة: ${sale.invoiceNumber}`, 105, 25, { align: 'center' });
    doc.text(`التاريخ: ${sale.date}`, 105, 32, { align: 'center' });
    
    // خط لعناصر الفاتورة
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 40, 200, 40);
    
    // عناصر الفاتورة
    let y = 50;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('المنتج', 180, y, { align: 'right' });
    doc.text('الكمية', 140, y, { align: 'right' });
    doc.text('السعر', 100, y, { align: 'right' });
    doc.text('الإجمالي', 60, y, { align: 'right' });
    
    y += 10;
    doc.line(10, y, 200, y);
    y += 10;
    
    sale.items.forEach(item => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(item.name, 180, y, { align: 'right' });
        doc.text(item.quantity.toString(), 140, y, { align: 'right' });
        doc.text(item.price.toLocaleString() + ' ريال', 100, y, { align: 'right' });
        doc.text((item.quantity * item.price).toLocaleString() + ' ريال', 60, y, { align: 'right' });
        y += 10;
    });
    
    y += 5;
    doc.line(10, y, 200, y);
    y += 10;
    
    if (sale.discount > 0) {
        doc.text('الإجمالي:', 180, y, { align: 'right' });
        doc.text((sale.total + sale.discount).toLocaleString() + ' ريال', 140, y, { align: 'right' });
        y += 10;
        
        doc.text('الخصم:', 180, y, { align: 'right' });
        doc.text(sale.discount.toLocaleString() + ' ريال', 140, y, { align: 'right' });
        y += 10;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('المبلغ الإجمالي:', 180, y, { align: 'right' });
    doc.text(sale.total.toLocaleString() + ' ريال', 140, y, { align: 'right' });
    y += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`طريقة الدفع: ${sale.paymentMethod}`, 105, y, { align: 'center' });
    
    y += 20;
    doc.setFontSize(10);
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    doc.text(settings.receiptFooter || 'شكراً لشرائكم من متجرنا', 105, y, { align: 'center' });
    
    // حفظ PDF
    doc.save(`فاتورة-${sale.invoiceNumber}.pdf`);
}

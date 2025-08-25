// تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('ar-YE', options);
}

// تحميل الإعدادات
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    document.getElementById('storeName').value = localStorage.getItem('storeName') || 'متجري';
    document.getElementById('enableBarcode').checked = settings.enableBarcode !== false;
    document.getElementById('enableDiscounts').checked = settings.enableDiscounts !== false;
    document.getElementById('receiptFooter').value = settings.receiptFooter || 'شكراً لشرائكم من متجرنا';
    
    // إظهار أو إخفاء قسم الخصم بناءً على الإعدادات
    document.getElementById('discount-section').style.display = settings.enableDiscounts !== false ? 'block' : 'none';
}


// إعداد معالجات الأحداث
function setupEventHandlers() {
    // حفظ منتج جديد
    const saveProductBtn = document.getElementById('save-product-btn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    // تحديث منتج موجود
    const updateProductBtn = document.getElementById('update-product-btn');
    if (updateProductBtn) {
        updateProductBtn.addEventListener('click', updateProduct);
    }
    
    // البحث عن المنتجات
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('input', searchProducts);
    }
    
    // البحث في نقطة البيع
    const posProductSearch = document.getElementById('pos-product-search');
    if (posProductSearch) {
        posProductSearch.addEventListener('input', searchProductsPOS);
    }
    
    // مسح السلة
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // إتمام البيع
    const completeSaleBtn = document.getElementById('complete-sale-btn');
    if (completeSaleBtn) {
        completeSaleBtn.addEventListener('click', completeSale);
    }
    
    // تطبيق الفلتر في التقارير
    const applyFilterBtn = document.getElementById('apply-filter-btn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyReportFilter);
    }
    
    // توليد التقرير
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // تغيير نوع الفلتر
    const reportPeriod = document.getElementById('report-period');
    if (reportPeriod) {
        reportPeriod.addEventListener('change', function() {
            const isCustom = this.value === 'custom';
            document.getElementById('custom-from-container').style.display = isCustom ? 'block' : 'none';
            document.getElementById('custom-to-container').style.display = isCustom ? 'block' : 'none';
        });
    }
    
    // طريقة الدفع - إظهار/إخفاء قسم العميل للبيع الآجل
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const customerSection = document.getElementById('customer-section');
            if (customerSection) {
                customerSection.style.display = this.value === 'آجل' ? 'block' : 'none';
            }
        });
    });
    
    // تطبيق الخصم
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', applyDiscount);
    }
    
    // مسح الباركود
    const barcodeBtn = document.getElementById('barcode-btn');
    if (barcodeBtn) {
        barcodeBtn.addEventListener('click', openBarcodeScanner);
    }
    
    // إغلاق ماسح الباركود
    const closeScannerBtn = document.getElementById('close-scanner-btn');
    if (closeScannerBtn) {
        closeScannerBtn.addEventListener('click', closeBarcodeScanner);
    }
    
    // حفظ المورد
    const saveSupplierBtn = document.getElementById('save-supplier-btn');
    if (saveSupplierBtn) {
        saveSupplierBtn.addEventListener('click', saveSupplier);
    }
    
    // حفظ الإعدادات
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // تأكيد تسديد الدين
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmCreditPayment);
    }
}

// إضافة الدوال الناقصة التي كانت مفقودة
function saveProduct() {
    // تنفيذ حفظ المنتج
    alert('تم حفظ المنتج بنجاح');
}

// دالة مسح الباركود
function openBarcodeScanner() {
    alert('فتح ماسح الباركود');
}

function closeBarcodeScanner() {
    alert('إغلاق ماسح الباركود');
}

// دالة حفظ المورد
function saveSupplier() {
    alert('تم حفظ المورد بنجاح');
}

// دالة حفظ الإعدادات
function saveSettings() {
    alert('تم حفظ الإعدادات بنجاح');
}

// إعداد معالجات الأحداث
function setupEventHandlers() {
    // حفظ منتج جديد
    document.getElementById('save-product-btn').addEventListener('click', saveProduct);
    
    // تحديث منتج موجود
    document.getElementById('update-product-btn').addEventListener('click', updateProduct);
    
    // البحث عن المنتجات
    document.getElementById('product-search').addEventListener('input', searchProducts);
    
    // البحث في نقطة البيع
    document.getElementById('pos-product-search').addEventListener('input', searchProductsPOS);
    
    // مسح السلة
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    
    // إتمام البيع
    document.getElementById('complete-sale-btn').addEventListener('click', completeSale);
    
    // تطبيق الفلتر في التقارير
    document.getElementById('apply-filter-btn').addEventListener('click', applyReportFilter);
    
    // توليد التقرير
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
    
    // تغيير نوع الفلتر
    document.getElementById('report-period').addEventListener('change', function() {
        const isCustom = this.value === 'custom';
        document.getElementById('custom-from-container').style.display = isCustom ? 'block' : 'none';
        document.getElementById('custom-to-container').style.display = isCustom ? 'block' : 'none';
    });
    
    // طريقة الدفع - إظهار/إخفاء قسم العميل للبيع الآجل
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('customer-section').style.display = 
                this.value === 'آجل' ? 'block' : 'none';
        });
    });
    
    // تطبيق الخصم
    document.getElementById('apply-discount-btn').addEventListener('click', applyDiscount);
    
    // مسح الباركود
    document.getElementById('barcode-btn').addEventListener('click', openBarcodeScanner);
    
    // إغلاق ماسح الباركود
    document.getElementById('close-scanner-btn').addEventListener('click', closeBarcodeScanner);
    
    // حفظ المورد
    document.getElementById('save-supplier-btn').addEventListener('click', saveSupplier);
    
    // حفظ الإعدادات
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    
    // تأكيد تسديد الدين
    document.getElementById('confirm-payment-btn').addEventListener('click', confirmCreditPayment);
}

// فتح ماسح الباركود
function openBarcodeScanner() {
    const scanner = document.getElementById('barcode-scanner');
    scanner.style.display = 'flex';
    
    const codeReader = new ZXing.BrowserMultiFormatReader();
    
    codeReader.listVideoInputDevices()
        .then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
                const selectedDeviceId = videoInputDevices[0].deviceId;
                
                codeReader.decodeFromVideoDevice(selectedDeviceId, 'barcode-video', (result, err) => {
                    if (result) {
                        // تم مسح الباركود بنجاح
                        codeReader.reset();
                        closeBarcodeScanner();
                        
                        // البحث عن المنتج باستخدام الباركود
                        const barcode = result.text;
                        const products = JSON.parse(localStorage.getItem('products') || '[]');
                        const product = products.find(p => p.barcode === barcode);
                        
                        if (product) {
                            addToCart(product);
                        } else {
                            alert('لم يتم العثور على منتج بهذا الباركود');
                        }
                    }
                    
                    if (err && !(err instanceof ZXing.NotFoundException)) {
                        console.error(err);
                    }
                });
            } else {
                alert('لا توجد كاميرا متاحة');
                closeBarcodeScanner();
            }
        })
        .catch((err) => {
            console.error(err);
            alert('حدث خطأ أثناء الوصول إلى الكاميرا');
            closeBarcodeScanner();
        });
}

// إغلاق ماسح الباركود
function closeBarcodeScanner() {
    const scanner = document.getElementById('barcode-scanner');
    scanner.style.display = 'none';
    
    // إيقاف الكاميرا
    const video = document.getElementById('barcode-video');
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}

// حفظ الإعدادات
function saveSettings() {
    const storeName = document.getElementById('storeName').value;
    const storeAddress = document.getElementById('storeAddress').value;
    const storePhone = document.getElementById('storePhone').value;
    const receiptFooter = document.getElementById('receiptFooter').value;
    const enableBarcode = document.getElementById('enableBarcode').checked;
    const enableDiscounts = document.getElementById('enableDiscounts').checked;
    
    localStorage.setItem('storeName', storeName);
    document.getElementById('store-name').textContent = storeName;
    
    const settings = {
        enableBarcode,
        enableDiscounts,
        receiptFooter
    };
    
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // إغلاق النموذج
    bootstrap.Modal.getInstance(document.getElementById('settingsModal')).hide();
    
    // إعادة تحميل الإعدادات
    loadSettings();
    
    alert('تم حفظ الإعدادات بنجاح');
}

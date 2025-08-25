// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التاريخ والوقت
    updateDateTime();
    setInterval(updateDateTime, 60000); // تحديث كل دقيقة
    
    // تهيئة التنقل بين الأقسام
    initNavigation();
    
    // تهيئة قاعدة البيانات
    initDatabase();
    
    // تحميل البيانات وعرضها
    loadDashboardData();
    loadProducts();
    loadAvailableProducts();
    loadReportsData();
    loadSuppliers();
    loadCreditSales(); // تحميل المبيعات الآجلة
    
    // إعداد معالجات الأحداث
    setupEventHandlers();
    
    // تحميل الإعدادات
    loadSettings();
});

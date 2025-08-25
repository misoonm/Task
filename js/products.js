// تحميل المنتجات لعرضها في قسم إدارة المنتجات
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // تحديث الجدول
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image || 'https://via.placeholder.com/50'}" class="product-image" alt="${product.name}"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.supplyDate || 'غير محدد'}</td>
            <td>${product.price.toLocaleString()} ريال</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action edit-product-btn" data-id="${product.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action delete-product-btn" data-id="${product.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // إضافة معالجات الأحداث للأزرار
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
    
    // تحديث قائمة الموردين في النماذج
    updateSuppliersDropdown();
}

// تحديث قائمة الموردين في dropdown
function updateSuppliersDropdown() {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const supplierDropdowns = [
        document.getElementById('productSupplier'),
        document.getElementById('editProductSupplier')
    ];
    
    supplierDropdowns.forEach(dropdown => {
        if (dropdown) {
            // حفظ القيمة المحددة حالياً
            const currentValue = dropdown.value;
            
            // مسح الخيارات الحالية (مع الاحتفاظ على الخيار الأول)
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }
            
            // إضافة الموردين
            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                dropdown.appendChild(option);
            });
            
            // استعادة القيمة المحددة إن أمكن
            if (currentValue && dropdown.querySelector(`option[value="${currentValue}"]`)) {
                dropdown.value = currentValue;
            }
        }
    });
}

// تحرير منتج
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('المنتج غير موجود');
        return;
    }
    
    // تعبئة النموذج ببيانات المنتج
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductBarcode').value = product.barcode || '';
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCost').value = product.cost;
    document.getElementById('editProductQuantity').value = product.quantity;
    document.getElementById('editProductSupplier').value = product.supplierId || '';
    document.getElementById('editProductExpiry').value = product.expiryDate || '';
    document.getElementById('editProductDescription').value = product.description || '';
    
    // عرض الصورة الحالية إذا كانت موجودة
    const imageContainer = document.getElementById('current-image-container');
    imageContainer.innerHTML = '';
    
    if (product.image) {
        const img = document.createElement('img');
        img.src = product.image;
        img.className = 'product-image';
        imageContainer.appendChild(img);
    }
    
    // فتح النموذج
    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}


// تحديث المنتج
// حفظ منتج جديد
function saveProduct() {
    const name = document.getElementById('productName').value;
    const barcode = document.getElementById('productBarcode').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const cost = parseFloat(document.getElementById('productCost').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const supplierId = document.getElementById('productSupplier').value;
    const expiryDate = document.getElementById('productExpiry').value;
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    if (!name || !category || isNaN(price) || isNaN(quantity) || isNaN(cost)) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newProduct = {
        id: Date.now().toString(),
        name,
        barcode: barcode || null,
        category,
        price,
        cost,
        quantity,
        supplierId: supplierId || null,
        expiryDate: expiryDate || null,
        description,
        image: null
    };
    
    // معالجة صورة المنتج إذا تم تحميلها
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newProduct.image = e.target.result;
            completeSaveProduct(newProduct, products);
        };
        reader.readAsDataURL(imageFile);
    } else {
        completeSaveProduct(newProduct, products);
    }
}

function completeSaveProduct(newProduct, products) {
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // إغلاق النموذج
    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    document.getElementById('add-product-form').reset();
    
    // إعادة تحميل البيانات
    loadProducts();
    loadAvailableProducts();
    loadDashboardData();
    
    alert('تم حفظ المنتج بنجاح');
}

// حذف منتج
function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filteredProducts = products.filter(p => p.id !== productId);
    
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    
    // إعادة تحميل البيانات
    loadProducts();
    loadAvailableProducts();
    loadDashboardData();
    
    alert('تم حذف المنتج بنجاح');
}

// البحث عن المنتجات
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm) ||
        (product.barcode && product.barcode.includes(searchTerm))
    );
    
    // تحديث الجدول
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image || 'https://via.placeholder.com/50'}" class="product-image" alt="${product.name}"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.supplyDate || 'غير محدد'}</td>
            <td>${product.price.toLocaleString()} ريال</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action edit-product-btn" data-id="${product.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action delete-product-btn" data-id="${product.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // إعادة إضافة معالجات الأحداث
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

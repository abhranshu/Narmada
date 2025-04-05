document.addEventListener('DOMContentLoaded', () => {
    // Landing page elements
    const landingPage = document.getElementById('landingPage');
    const mainContent = document.getElementById('mainContent');
    const letsGoBtn = document.getElementById('letsGoBtn');
    
    // Main content elements
    const expenseForm = document.getElementById('expenseForm');
    const expenseTitle = document.getElementById('expenseTitle');
    const expenseAmount = document.getElementById('expenseAmount');
    const expenseCategory = document.getElementById('expenseCategory');
    const expenseDate = document.getElementById('expenseDate');
    const expenseNotes = document.getElementById('expenseNotes');
    const expensesList = document.getElementById('expensesList');
    const totalExpenses = document.getElementById('totalExpenses');
    
    // Custom category dialog elements
    const customCategoryDialog = document.getElementById('customCategoryDialog');
    const customCategoryInput = document.getElementById('customCategory');
    const cancelCustomCategory = document.getElementById('cancelCustomCategory');
    const saveCustomCategory = document.getElementById('saveCustomCategory');
    
    // Daily Chores elements
    const dailyChoresBtn = document.getElementById('dailyChoresBtn');
    const dailyChoresPanel = document.getElementById('dailyChoresPanel');
    const closeChoresBtn = document.getElementById('closeChoresBtn');
    
    // Upload elements
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadForm');
    const receiptImage = document.getElementById('receiptImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Reset button elements
    const resetBtn = document.getElementById('resetBtn');
    
    // Flag to track if expenses have been loaded
    let expensesLoaded = false;
    
    // Show landing page initially
    landingPage.style.display = 'flex';
    mainContent.style.display = 'none';
    
    // Handle Get Started button click
    letsGoBtn.addEventListener('click', () => {
        console.log('Get Started button clicked');
        
        // Add animation class to trigger the animation
        letsGoBtn.classList.add('animate');
        
        // Wait for animation to complete before hiding landing page
        setTimeout(() => {
            console.log('Animation complete, showing main content');
            
            // Hide landing page and show main content
            landingPage.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Load expenses only once when landing page is hidden
            if (!expensesLoaded) {
                loadExpenses();
                expensesLoaded = true;
            }
        }, 1500); // Match the animation duration
    });
    
    // Handle expense form submission
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = expenseTitle.value;
        const amount = parseFloat(expenseAmount.value);
        const category = expenseCategory.value;
        const date = expenseDate.value;
        const notes = expenseNotes.value;
        
        // Add expense to the list
        addExpense(title, amount, category, date, notes);
        
        // Reset form
        expenseForm.reset();
    });
    
    // Handle custom category selection
    expenseCategory.addEventListener('change', () => {
        if (expenseCategory.value === 'other') {
            customCategoryDialog.showModal();
        }
    });
    
    // Handle custom category dialog buttons
    cancelCustomCategory.addEventListener('click', () => {
        customCategoryDialog.close();
        expenseCategory.value = 'groceries'; // Reset to default
    });
    
    saveCustomCategory.addEventListener('click', () => {
        const customCategoryValue = customCategoryInput.value.trim();
        if (customCategoryValue) {
            // Add new option to select
            const newOption = document.createElement('option');
            newOption.value = customCategoryValue.toLowerCase();
            newOption.textContent = customCategoryValue;
            expenseCategory.appendChild(newOption);
            
            // Select the new option
            expenseCategory.value = customCategoryValue.toLowerCase();
            
            // Close dialog and reset input
            customCategoryDialog.close();
            customCategoryInput.value = '';
        }
    });
    
    // Handle Daily Chores button click
    dailyChoresBtn.addEventListener('click', () => {
        window.location.href = 'weekly-report.html';
    });
    
    // Handle close button for chores panel
    closeChoresBtn.addEventListener('click', () => {
        dailyChoresPanel.style.display = 'none';
    });
    
    // Close chores panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!dailyChoresPanel.contains(e.target) && e.target !== dailyChoresBtn) {
            dailyChoresPanel.style.display = 'none';
        }
    });
    
    // Handle upload button click
    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });
    
    // Image preview
    receiptImage.addEventListener('change', () => {
        const file = receiptImage.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Receipt preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('receiptTitle').value;
        const amount = document.getElementById('receiptAmount').value;
        const date = document.getElementById('receiptDate').value;
        const category = document.getElementById('receiptCategory').value;
        const notes = document.getElementById('receiptNotes').value;
        const imageFile = receiptImage.files[0];
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                
                // Save to localStorage
                saveReceipt({
                    title,
                    amount,
                    date,
                    category,
                    notes,
                    imageData
                });
                
                // Reset form and close modal
                uploadForm.reset();
                imagePreview.innerHTML = '';
                uploadModal.style.display = 'none';
                
                // Show success message
                alert('Receipt uploaded successfully!');
            };
            reader.readAsDataURL(imageFile);
        }
    });
    
    // Save receipt to localStorage
    function saveReceipt(receipt) {
        const receipts = JSON.parse(localStorage.getItem('receipts')) || [];
        receipts.push(receipt);
        localStorage.setItem('receipts', JSON.stringify(receipts));
    }
    
    // Function to add expense to the list
    function addExpense(title, amount, category, date, notes) {
        // Create expense item
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        
        // Format date
        const formattedDate = new Date(date).toLocaleDateString();
        
        // Create expense content
        expenseItem.innerHTML = `
            <div class="expense-info">
                <div class="expense-title">${title}</div>
                <div class="expense-category">${category}</div>
                <div class="expense-date">${formattedDate}</div>
            </div>
            <div class="expense-amount">$${amount.toFixed(2)}</div>
            <button class="delete-btn">Delete</button>
        `;
        
        // Add delete functionality
        const deleteBtn = expenseItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            expenseItem.remove();
            updateTotalExpenses();
        });
        
        // Add to expenses list
        expensesList.appendChild(expenseItem);
        
        // Update total expenses
        updateTotalExpenses();
        
        // Save to localStorage
        saveExpense(title, amount, category, date, notes);
    }
    
    // Function to update total expenses
    function updateTotalExpenses() {
        const expenseItems = document.querySelectorAll('.expense-item');
        let total = 0;
        
        expenseItems.forEach(item => {
            const amountText = item.querySelector('.expense-amount').textContent;
            const amount = parseFloat(amountText.replace('$', ''));
            total += amount;
        });
        
        totalExpenses.textContent = `$${total.toFixed(2)}`;
    }
    
    // Function to save expense to localStorage
    function saveExpense(title, amount, category, date, notes) {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push({ title, amount, category, date, notes });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    // Load expenses from localStorage
    function loadExpenses() {
        // Clear existing expenses list first to prevent duplicates
        expensesList.innerHTML = '';
        
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        
        expenses.forEach(expense => {
            addExpense(
                expense.title,
                expense.amount,
                expense.category,
                expense.date,
                expense.notes
            );
        });
        
        // Update total expenses
        updateTotalExpenses();
    }
    
    // Handle reset button click
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all expenses? This cannot be undone.')) {
            // Clear expenses list
            expensesList.innerHTML = '';
            
            // Reset total expenses
            totalExpenses.textContent = '₹0.00';
            
            // Clear expenses from localStorage
            localStorage.removeItem('expenses');
            
            // Show success message
            alert('All expenses have been reset successfully!');
        }
    });
}); 
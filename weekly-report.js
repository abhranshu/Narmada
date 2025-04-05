document.addEventListener('DOMContentLoaded', () => {
    // Calendar navigation
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const weekDisplay = document.getElementById('weekDisplay');
    
    // Task elements
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const completedTasksCount = document.getElementById('completedTasksCount');
    const completedTasksSummary = document.getElementById('completedTasks');
    const resetTasksBtn = document.getElementById('resetTasksBtn');
    
    // Receipt gallery
    const receiptGallery = document.getElementById('receiptGallery');
    
    let currentDate = new Date();
    
    function updateWeekDisplay() {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
        const startDay = startOfWeek.getDate();
        const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
        const endDay = endOfWeek.getDate();
        const year = startOfWeek.getFullYear();
        
        weekDisplay.textContent = `Week of ${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
        
        // Update calendar days
        updateCalendarDays(startOfWeek);
    }
    
    function updateCalendarDays(startDate) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        days.forEach((day, index) => {
            const dayElement = document.getElementById(day);
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + index);
            
            // Clear previous content
            dayElement.innerHTML = '';
            
            // Add date
            const dateElement = document.createElement('div');
            dateElement.className = 'date';
            dateElement.textContent = currentDay.getDate();
            dayElement.appendChild(dateElement);
            
            // Add placeholder for expenses and tasks
            const summaryElement = document.createElement('div');
            summaryElement.className = 'day-summary';
            summaryElement.innerHTML = `
                <div>Expenses: $0.00</div>
                <div>Tasks: 0/0</div>
            `;
            dayElement.appendChild(summaryElement);
        });
    }
    
    // Load task status from localStorage
    function loadTaskStatus() {
        const savedTasks = JSON.parse(localStorage.getItem('taskStatus')) || {};
        
        taskCheckboxes.forEach(checkbox => {
            const taskId = checkbox.id;
            if (savedTasks[taskId]) {
                checkbox.checked = savedTasks[taskId];
            }
        });
        
        updateTaskCount();
    }
    
    // Save task status to localStorage
    function saveTaskStatus() {
        const taskStatus = {};
        
        taskCheckboxes.forEach(checkbox => {
            taskStatus[checkbox.id] = checkbox.checked;
        });
        
        localStorage.setItem('taskStatus', JSON.stringify(taskStatus));
    }
    
    // Update task count
    function updateTaskCount() {
        const totalTasks = taskCheckboxes.length;
        const completedTasks = Array.from(taskCheckboxes).filter(checkbox => checkbox.checked).length;
        
        completedTasksCount.textContent = completedTasks;
        completedTasksSummary.textContent = `${completedTasks}/${totalTasks}`;
    }
    
    prevWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeekDisplay();
    });
    
    nextWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeekDisplay();
    });
    
    // Event listeners for task checkboxes
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveTaskStatus();
            updateTaskCount();
        });
    });
    
    // Event listener for reset button
    resetTasksBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all tasks?')) {
            taskCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            saveTaskStatus();
            updateTaskCount();
        }
    });
    
    // Initialize calendar
    updateWeekDisplay();
    
    // Load weekly data
    loadWeeklyData();
    
    // Upload functionality
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadForm');
    const receiptImage = document.getElementById('receiptImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Open modal
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
                
                // Create receipt card
                const receiptCard = document.createElement('div');
                receiptCard.className = 'receipt-card';
                receiptCard.innerHTML = `
                    <img src="${imageData}" alt="${title}" class="receipt-image">
                    <div class="receipt-details">
                        <div class="receipt-title">${title}</div>
                        <div class="receipt-amount">$${parseFloat(amount).toFixed(2)}</div>
                        <div class="receipt-date">${new Date(date).toLocaleDateString()}</div>
                        <div class="receipt-category">${category}</div>
                    </div>
                `;
                
                // Add to gallery
                if (receiptGallery.querySelector('.no-receipts')) {
                    receiptGallery.innerHTML = '';
                }
                receiptGallery.appendChild(receiptCard);
                
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
    
    // Load receipts from localStorage
    function loadReceipts() {
        const receipts = JSON.parse(localStorage.getItem('receipts')) || [];
        
        if (receipts.length === 0) {
            receiptGallery.innerHTML = '<p class="no-receipts">No receipts uploaded yet</p>';
            return;
        }
        
        receiptGallery.innerHTML = '';
        
        receipts.forEach(receipt => {
            const receiptCard = document.createElement('div');
            receiptCard.className = 'receipt-card';
            
            receiptCard.innerHTML = `
                <img src="${receipt.imageData}" alt="${receipt.title}" class="receipt-image">
                <div class="receipt-details">
                    <h4 class="receipt-title">${receipt.title}</h4>
                    <p class="receipt-amount">$${parseFloat(receipt.amount).toFixed(2)}</p>
                    <p class="receipt-date">${new Date(receipt.date).toLocaleDateString()}</p>
                    <span class="receipt-category">${receipt.category}</span>
                </div>
            `;
            
            receiptGallery.appendChild(receiptCard);
        });
    }
    
    // Save receipt to localStorage
    function saveReceipt(receipt) {
        const receipts = JSON.parse(localStorage.getItem('receipts')) || [];
        receipts.push(receipt);
        localStorage.setItem('receipts', JSON.stringify(receipts));
    }
    
    // Load receipts on page load
    loadReceipts();
});

async function loadWeeklyData() {
    try {
        // Fetch weekly expenses
        const response = await fetch('http://localhost:3000/api/expenses/weekly');
        const data = await response.json();
        
        // Update weekly summary
        document.getElementById('weeklyExpenses').textContent = `$${data.totalExpenses.toFixed(2)}`;
        document.getElementById('completedTasks').textContent = `${data.completedTasks}/16`;
        document.getElementById('weeklySavings').textContent = `$${data.savings.toFixed(2)}`;
        
        // Update calendar with actual data
        updateCalendarWithData(data.dailyData);
    } catch (error) {
        console.error('Error loading weekly data:', error);
    }
}

function updateCalendarWithData(dailyData) {
    // This function would update the calendar with actual expense and task data
    // Implementation depends on the data structure returned by the API
} 
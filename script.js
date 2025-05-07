// script.js
document.addEventListener('DOMContentLoaded', function() {
    const dataForm = document.getElementById('data-form');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');
    const itemIdInput = document.getElementById('item-id');
    let isEditMode = false;

    // Load data when page loads
    loadData();

    // Form submit handler
    dataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const item = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value || 0,
            id: isEditMode ? itemIdInput.value : Date.now().toString()
        };

        if (isEditMode) {
            updateItem(item);
        } else {
            addItem(item);
        }
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', resetForm);

    // Load all items from localStorage
    function loadData() {
        const items = getItems();
        const dataList = document.getElementById('data-list');
        dataList.innerHTML = '';
        
        if (items.length === 0) {
            dataList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No items found</td></tr>';
            return;
        }
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.age}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editItem('${item.id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </td>
            `;
            dataList.appendChild(row);
        });
    }

    // Add new item
    function addItem(item) {
        const items = getItems();
        items.push(item);
        localStorage.setItem('crudItems', JSON.stringify(items));
        resetForm();
        loadData();
    }

    // Edit item
    window.editItem = function(id) {
        const items = getItems();
        const item = items.find(item => item.id === id);
        
        if (item) {
            document.getElementById('name').value = item.name;
            document.getElementById('email').value = item.email;
            document.getElementById('age').value = item.age;
            itemIdInput.value = item.id;
            
            formTitle.textContent = 'Edit Item';
            submitBtn.textContent = 'Update';
            cancelBtn.style.display = 'inline-block';
            isEditMode = true;
        }
    }

    // Update item
    function updateItem(updatedItem) {
        const items = getItems();
        const index = items.findIndex(item => item.id === updatedItem.id);
        
        if (index !== -1) {
            items[index] = updatedItem;
            localStorage.setItem('crudItems', JSON.stringify(items));
            resetForm();
            loadData();
        }
    }

    // Delete item
    window.deleteItem = function(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            const items = getItems();
            const filteredItems = items.filter(item => item.id !== id);
            localStorage.setItem('crudItems', JSON.stringify(filteredItems));
            loadData();
        }
    }

    // Get all items from localStorage
    function getItems() {
        const itemsJson = localStorage.getItem('crudItems');
        return itemsJson ? JSON.parse(itemsJson) : [];
    }

    // Reset form to initial state
    function resetForm() {
        dataForm.reset();
        itemIdInput.value = '';
        formTitle.textContent = 'Add New Item';
        submitBtn.textContent = 'Submit';
        cancelBtn.style.display = 'none';
        isEditMode = false;
    }
});
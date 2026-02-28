let clothes = JSON.parse(localStorage.getItem('clothes')) || [
      { id: 1, name: 'T-Shirt', category: 'Shirt', size: 'M', price: 20, quantity: 50, imageUrl: '' },
      { id: 2, name: 'Jeans', category: 'Pants', size: 'L', price: 40, quantity: 30, imageUrl: '' }
    ];
    let nextId = clothes.length ? Math.max(...clothes.map(c => c.id)) + 1 : 1;

    function saveClothes() {
      localStorage.setItem('clothes', JSON.stringify(clothes));
    }

    function renderTable() {
      const filtered = typeof getFilteredClothes === 'function' ? getFilteredClothes() : clothes;
      const tbody = document.getElementById('clothes-tbody');
      tbody.innerHTML = filtered.map(c => `
        <tr data-id="${c.id}">
          <td>${c.id}</td>
          <td class="img-cell">${c.imageUrl ? `<img src="${c.imageUrl}" alt="${c.name}" class="clothes-thumb" onerror="this.parentNode.innerHTML='<span class=\\'no-img\\'>No image</span>'" />` : '<span class="no-img">No image</span>'}</td>
          <td>${c.name}</td>
          <td>${c.category}</td>
          <td>${c.size}</td>
          <td>$${c.price}</td>
          <td>${c.quantity}</td>
          <td>
            <button type="button" class="btn-edit">Edit</button>
            <button type="button" class="btn-delete">Delete</button>
          </td>
        </tr>
      `).join('');

      // Attach event listeners
      tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editClothes(parseInt(btn.closest('tr').dataset.id)));
      });
      tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteClothes(parseInt(btn.closest('tr').dataset.id)));
      });
    }

    document.getElementById('search-input').addEventListener('input', renderTable);

    function resetForm() {
      document.getElementById('edit-id').value = '';
      document.getElementById('clothes-name').value = '';
      document.getElementById('clothes-category').value = 'Shirt';
      document.getElementById('clothes-size').value = 'M';
      document.getElementById('clothes-price').value = '';
      document.getElementById('clothes-quantity').value = '1';
      document.getElementById('form-submit-btn').textContent = 'Add Clothes';
      document.getElementById('cancel-edit-btn').style.display = 'none';
    }

    function editClothes(id) {
      const item = clothes.find(c => c.id === id);
      if (!item) return;
      document.getElementById('edit-id').value = id;
      document.getElementById('clothes-name').value = item.name;
      document.getElementById('clothes-category').value = item.category;
      document.getElementById('clothes-size').value = item.size;
      document.getElementById('clothes-price').value = item.price;
      document.getElementById('clothes-quantity').value = item.quantity;
      document.getElementById('clothes-image').value = item.imageUrl || '';
      document.getElementById('form-submit-btn').textContent = 'Update Clothes';
      document.getElementById('cancel-edit-btn').style.display = 'block';
    }

    document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);

    function deleteClothes(id) {
      if (confirm('Are you sure you want to delete this item?')) {
        clothes = clothes.filter(c => c.id !== id);
        saveClothes();
        renderTable();
      }
    }

    document.getElementById('clothes-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const editId = document.getElementById('edit-id').value;
      const name = document.getElementById('clothes-name').value.trim();
      const category = document.getElementById('clothes-category').value;
      const size = document.getElementById('clothes-size').value;
      const price = parseFloat(document.getElementById('clothes-price').value) || 0;
      const quantity = parseInt(document.getElementById('clothes-quantity').value) || 1;

      if (editId) {
        const item = clothes.find(c => c.id === parseInt(editId));
        if (item) {
          item.name = name;
          item.category = category;
          item.size = size;
          item.price = price;
          item.quantity = quantity;
          item.imageUrl = imageUrl;
        }
      } else {
        clothes.push({ id: nextId++, name, category, size, price, quantity, imageUrl });
      }

      saveClothes();
      renderTable();
      resetForm();
    });

    renderTable();
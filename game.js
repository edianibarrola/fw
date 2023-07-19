document.addEventListener('DOMContentLoaded', function() {
    const inventoryItems = [
      { name: "Item A", quantity: 1, cost: 100, sellValue: 50 },
      { name: "Item B", quantity: 2, cost: 150, sellValue: 75 },
      { name: "Item C", quantity: 3, cost: 200, sellValue: 100 }
    ];
  
    let funds = 1000; // Initial funds
  
    const inventoryList = document.getElementById('inventory-list');
    updateInventory();
  
    const buyButton = document.getElementById('buy-button');
    buyButton.addEventListener('click', buyItem);
  
    const sellButton = document.getElementById('sell-button');
    sellButton.addEventListener('click', sellItem);
  
    function buyItem() {
      const feedback = document.getElementById('feedback');
      const selectItem = document.getElementById('buy-select');
      const selectedItem = selectItem.value;
      if (selectedItem) {
        const selectedItemObj = inventoryItems.find(item => item.name === selectedItem);
        if (selectedItemObj) {
          if (funds >= selectedItemObj.cost) {
            const existingItem = inventoryItems.find(item => item.name === selectedItem);
            if (existingItem) {
              existingItem.quantity++;
            } else {
              inventoryItems.push({ name: selectedItem, quantity: 1, cost: selectedItemObj.cost, sellValue: selectedItemObj.sellValue });
            }
            funds -= selectedItemObj.cost;
            feedback.textContent = `You successfully purchased ${selectedItem} for $${selectedItemObj.cost}.`;
            updateInventory();
            updatePlayerStats();
          } else {
            feedback.textContent = 'Insufficient funds.';
          }
        }
      } else {
        feedback.textContent = 'No item selected for purchase.';
      }
    }
  
    function sellItem() {
      const feedback = document.getElementById('feedback');
      const selectItem = document.getElementById('sell-select');
      const selectedItem = selectItem.value;
      if (selectedItem) {
        const existingItem = inventoryItems.find(item => item.name === selectedItem);
        if (existingItem && existingItem.quantity > 0) {
          existingItem.quantity--;
          funds += existingItem.sellValue;
          feedback.textContent = `You successfully sold ${selectedItem} for $${existingItem.sellValue}.`;
          updateInventory();
          updatePlayerStats();
        } else {
          feedback.textContent = 'Item not found in inventory or no quantity available to sell.';
        }
      } else {
        feedback.textContent = 'No item selected for sale.';
      }
    }
  
    function updateInventory() {
      inventoryList.innerHTML = '';
      inventoryItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.quantity}) - $${item.cost}`;
        inventoryList.appendChild(li);
      });
  
      const sellSelect = document.getElementById('sell-select');
      sellSelect.innerHTML = '<option value="">Select item to sell</option>';
      inventoryItems.forEach(item => {
        if (item.quantity > 0) {
          const option = document.createElement('option');
          option.value = item.name;
          option.textContent = `${item.name} - $${item.sellValue}`;
          sellSelect.appendChild(option);
        }
      });
    }
  
    function updatePlayerStats() {
      const playerStats = document.getElementById('player-stats');
      playerStats.textContent = `Funds: $${funds} | Reputation: 50 | Level: 5`; // Update with actual stats
    }
  });
  
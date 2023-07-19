document.addEventListener('DOMContentLoaded', function() {
    const inventoryItems = [
      { name: "Plasma Blaster", quantity: 1, cost: 100, sellValue: 50 },
      { name: "Cybernetic Implant", quantity: 2, cost: 150, sellValue: 75 },
      { name: "Nano Enhancer", quantity: 3, cost: 200, sellValue: 100 }
    ];
  
    const missions = [
      { name: "Infiltrate the Corporate Headquarters", successRate: 0.7, cost: 200, reward: 500, reputationGain: 50, reputationLoss: 10, levelGain: 1 },
      { name: "Retrieve Stolen Data", successRate: 0.8, cost: 150, reward: 300, reputationGain: 30, reputationLoss: 5, levelGain: 1 },
      { name: "Eliminate the Rival Gang", successRate: 0.5, cost: 300, reward: 700, reputationGain: 70, reputationLoss: 15, levelGain: 2 }
    ];
  
    let funds = 1000; // Initial funds
    let reputation = 50; // Initial reputation
    let level = 1; // Initial level
  
    const inventoryList = document.getElementById('inventory-list');
    const playerStats = document.getElementById('player-stats');
    const feedback = document.getElementById('feedback');
  
    const buyButton = document.getElementById('buy-button');
    buyButton.addEventListener('click', buyItem);
  
    const sellButton = document.getElementById('sell-button');
    sellButton.addEventListener('click', sellItem);
  
    const missionButton = document.getElementById('mission-button');
    missionButton.addEventListener('click', performMission);
  
    function buyItem() {
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
            updateInventory();
            updatePlayerStats();
            showMessage(`You successfully purchased ${selectedItem} for $${selectedItemObj.cost}.`);
          } else {
            showMessage('Insufficient funds.');
          }
        }
      } else {
        showMessage('No item selected for purchase.');
      }
    }
  
    function sellItem() {
      const selectItem = document.getElementById('sell-select');
      const selectedItem = selectItem.value;
      if (selectedItem) {
        const existingItem = inventoryItems.find(item => item.name === selectedItem);
        if (existingItem && existingItem.quantity > 0) {
          existingItem.quantity--;
          funds += existingItem.sellValue;
          updateInventory();
          updatePlayerStats();
          showMessage(`You successfully sold ${selectedItem} for $${existingItem.sellValue}.`);
        } else {
          showMessage('Item not found in inventory or no quantity available to sell.');
        }
      } else {
        showMessage('No item selected for sale.');
      }
    }
  
    function performMission() {
      const selectMission = document.getElementById('mission-select');
      const selectedMissionName = selectMission.value;
      if (selectedMissionName) {
        const selectedMission = missions.find(mission => mission.name === selectedMissionName);
        if (selectedMission) {
          if (funds >= selectedMission.cost) {
            funds -= selectedMission.cost;
            updatePlayerStats();
            showPreMessage('Mission in progress...');
            setTimeout(() => {
              const success = Math.random() <= selectedMission.successRate;
              if (success) {
                funds += selectedMission.reward;
                reputation += selectedMission.reputationGain;
                level += selectedMission.levelGain;
                showMessage(`Mission successful! You gained ${selectedMission.reputationGain} reputation, ${selectedMission.levelGain} level(s), and $${selectedMission.reward}.`);
              } else {
                reputation -= selectedMission.reputationLoss;
                showMessage(`Mission failed. You lost ${selectedMission.reputationLoss} reputation.`);
              }
            }, getRandomDelay(3000, 8000));
          } else {
            showMessage('Insufficient funds for this mission.');
          }
        }
      } else {
        showMessage('No mission selected.');
      }
    }
  
    function updateInventory() {
        inventoryList.innerHTML = '';
      
        const sellSelect = document.getElementById('sell-select');
        sellSelect.innerHTML = '<option value="">Select item to sell</option>';
        
        const buySelect = document.getElementById('buy-select');
        buySelect.innerHTML = '<option value="">Select item to buy</option>';
      
        inventoryItems.forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.name} (${item.quantity}) - $${item.cost}`;
          inventoryList.appendChild(li);
      
          const sellOption = document.createElement('option');
          sellOption.value = item.name;
          sellOption.textContent = `${item.name} - $${item.sellValue}`;
          if (item.quantity > 0) {
            sellSelect.appendChild(sellOption);
          }
      
          const buyOption = document.createElement('option');
          buyOption.value = item.name;
          buyOption.textContent = `${item.name} - $${item.cost}`;
          buySelect.appendChild(buyOption);
        });
      }
  
    function updatePlayerStats() {
      playerStats.textContent = `Funds: $${funds} | Reputation: ${reputation} | Level: ${level}`;
    }
  
    function getRandomDelay(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    function showPreMessage(message) {
      feedback.textContent = message;
    }
  
    function showMessage(message) {
      feedback.textContent = message;
    }
  
    updateInventory();
    updatePlayerStats();
  });
  
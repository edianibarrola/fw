document.addEventListener('DOMContentLoaded', function() {
  const inventoryItems = [
    { name: "Plasma Blaster", quantity: 1, cost: 100, sellValue: 50 },
    { name: "Cybernetic Implant", quantity: 2, cost: 150, sellValue: 75 },
    { name: "Nano Enhancer", quantity: 3, cost: 200, sellValue: 100 }
  ];

  const missions = [
    { name: "Infiltrate the Corporate Headquarters", successRate: 0.7, cost: 200, reputationGain: 50, reputationLoss: 10, levelGain: 1 },
    { name: "Retrieve Stolen Data", successRate: 0.8, cost: 150, reputationGain: 30, reputationLoss: 5, levelGain: 1 },
    { name: "Eliminate the Rival Gang", successRate: 0.5, cost: 300, reputationGain: 70, reputationLoss: 15, levelGain: 2 },
  ];

  let funds = 1000; // Initial funds
  let reputation = 50; // Initial reputation
  let level = 1; // Initial level

  const inventoryList = document.getElementById('inventory-list');
  updateInventory();

  const buyButton = document.getElementById('buy-button');
  buyButton.addEventListener('click', buyItem);

  const sellButton = document.getElementById('sell-button');
  sellButton.addEventListener('click', sellItem);

  const missionButton = document.getElementById('mission-button');
  missionButton.addEventListener('click', performMission);

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

  function performMission() {
    const feedback = document.getElementById('feedback');
    const selectMission = document.getElementById('mission-select');
    const selectedMissionName = selectMission.value;
    if (selectedMissionName) {
      const selectedMission = missions.find(mission => mission.name === selectedMissionName);
      if (selectedMission) {
        if (funds >= selectedMission.cost) {
          funds -= selectedMission.cost;
          const success = Math.random() <= selectedMission.successRate;
          if (success) {
            reputation += selectedMission.reputationGain;
            level += selectedMission.levelGain;
            feedback.textContent = `Mission successful! You gained ${selectedMission.reputationGain} reputation and ${selectedMission.levelGain} level(s).`;
          } else {
            reputation -= selectedMission.reputationLoss;
            feedback.textContent = `Mission failed. You lost ${selectedMission.reputationLoss} reputation.`;
          }
          updatePlayerStats();
        } else {
          feedback.textContent = 'Insufficient funds for this mission.';
        }
      }
    } else {
      feedback.textContent = 'No mission selected.';
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
    playerStats.textContent = `Funds: $${funds} | Reputation: ${reputation} | Level: ${level}`; 
  }
});

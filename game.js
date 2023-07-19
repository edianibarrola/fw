document.addEventListener('DOMContentLoaded', function() {
  const inventoryItems = [
    { name: "Plasma Blaster", quantity: 1, cost: 100, sellValue: 75, risk: 0.2 },
    { name: "Cybernetic Implant", quantity: 2, cost: 150, sellValue: 120, risk: 0.3 },
    { name: "Nano Enhancer", quantity: 3, cost: 200, sellValue: 160, risk: 0.4 },
    { name: "Quantum Capacitor", quantity: 0, cost: 500, sellValue: 400, risk: 0.6 },
    { name: "Fusion Core", quantity: 0, cost: 800, sellValue: 600, risk: 0.7 }
  ];

  const missions = [
    { name: "Infiltrate the Corporate Headquarters", successRate: 0.7, cost: 200, reward: 500, reputationGain: 50, reputationLoss: 10, levelGain: 1 },
    { name: "Retrieve Stolen Data", successRate: 0.8, cost: 150, reward: 300, reputationGain: 30, reputationLoss: 5, levelGain: 1 },
    { name: "Eliminate the Rival Gang", successRate: 0.5, cost: 300, reward: 700, reputationGain: 70, reputationLoss: 15, levelGain: 2 },
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

  startPriceFluctuations();
  updateInventory();
  updateMissions();
  updatePlayerStats();

  function startPriceFluctuations() {
    setInterval(() => {
      inventoryItems.forEach(item => {
        const fluctuation = item.cost * (Math.random() * 0.2 - 0.1);
        const newPrice = Math.max(10, item.cost + fluctuation); 
        item.cost = Math.round(newPrice);
        item.sellValue = Math.round(newPrice * 0.8); 

        // Market event
        if (Math.random() < 0.1) {  
          const eventTypes = ["Tech Advances", "Market Crash", "Resource Scarcity"];
          const selectedEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

          switch(selectedEvent) {
            case "Tech Advances":
              const techFluctuation = item.cost * (Math.random() * -0.2);
              item.cost = Math.round(Math.max(10, item.cost + techFluctuation));
              item.sellValue = Math.round(Math.max(5, item.sellValue + techFluctuation / 2));
              feedback.textContent = `Tech Advances! The cost of ${item.name} has decreased.`;
              break;
            case "Market Crash":
              const crashFluctuation = item.cost * (Math.random() * -0.3);
              item.cost = Math.round(Math.max(10, item.cost + crashFluctuation));
              item.sellValue = Math.round(Math.max(5, item.sellValue + crashFluctuation / 2));
              feedback.textContent = `Market Crash! The cost of ${item.name} has decreased.`;
              break;
            case "Resource Scarcity":
              const scarcityFluctuation = item.cost * (Math.random() * 0.3);
              item.cost = Math.round(Math.max(10, item.cost + scarcityFluctuation));
              item.sellValue = Math.round(Math.max(5, item.sellValue + scarcityFluctuation / 2));
              feedback.textContent = `Resource Scarcity! The cost of ${item.name} has increased.`;
              break;
          }
        }
      });
      updateInventory(); 
    }, 10000);
  }

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
            inventoryItems.push({ name: selectedItem, quantity: 1, cost: selectedItemObj.cost, sellValue: selectedItemObj.sellValue, risk: selectedItemObj.risk });
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
    const selectItem = document.getElementById('sell-select');
    const selectedItem = selectItem.value;
    if (selectedItem) {
      const existingItem = inventoryItems.find(item => item.name === selectedItem);
      if (existingItem && existingItem.quantity > 0) {
        const successRate = 0.6; // Selling success rate
        if (Math.random() <= successRate) {
          existingItem.quantity--;
          funds += existingItem.sellValue;
          feedback.textContent = `You successfully sold ${selectedItem} for $${existingItem.sellValue}.`;
        } else {
          feedback.textContent = `Failed to sell ${selectedItem}. Try again later.`;
        }
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
    const selectMission = document.getElementById('mission-select');
    const selectedMissionName = selectMission.value;
    if (selectedMissionName) {
      const selectedMission = missions.find(mission => mission.name === selectedMissionName);
      if (selectedMission) {
        if (funds >= selectedMission.cost) {
          funds -= selectedMission.cost;
          const success = Math.random() <= selectedMission.successRate;
          if (success) {
            funds += selectedMission.reward;
            reputation += selectedMission.reputationGain;
            level += selectedMission.levelGain;
            feedback.textContent = `Mission successful! You gained ${selectedMission.reputationGain} reputation, ${selectedMission.levelGain} level(s), and $${selectedMission.reward}.`;
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
        for (let i = 0; i < item.quantity; i++) {
          const option = document.createElement('option');
          option.value = item.name;
          option.textContent = `${item.name} - $${item.sellValue}`;
          sellSelect.appendChild(option);
        }
      }
    });
  
    const buySelect = document.getElementById('buy-select');
    buySelect.innerHTML = '<option value="">Select item to buy</option>';
    inventoryItems.forEach(item => {
      const option = document.createElement('option');
      option.value = item.name;
      option.textContent = `${item.name} - $${item.cost}`;
      buySelect.appendChild(option);
    });
  }

  function updatePlayerStats() {
    playerStats.textContent = `Funds: $${funds} | Reputation: ${reputation} | Level: ${level}`;
  }

  function updateMissions() {
    const missionSelect = document.getElementById('mission-select');
    missionSelect.innerHTML = '<option value="">Select a mission</option>';
    missions.forEach(mission => {
      const option = document.createElement('option');
      option.value = mission.name;
      option.textContent = `${mission.name} - Cost: $${mission.cost}, Reward: $${mission.reward}`;
      missionSelect.appendChild(option);
    });
  }
});

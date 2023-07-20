document.addEventListener('DOMContentLoaded', function() {
  const inventoryItems = [
    { name: "Plasma Blaster", quantity: 1, cost: 100, sellValue: 100, risk: 0.2 },
    { name: "Cybernetic Implant", quantity: 2, cost: 150, sellValue: 150, risk: 0.3 },
    { name: "Nano Enhancer", quantity: 3, cost: 200, sellValue: 200, risk: 0.4 },
    { name: "Quantum Capacitor", quantity: 0, cost: 500, sellValue: 500, risk: 0.6 },
    { name: "Fusion Core", quantity: 0, cost: 800, sellValue: 800, risk: 0.7 }
  ];

  const equipment = [
    { name: "Stealth Cloak", quantity: 1, successModifier: 0.2, durability: 3 },
    { name: "Hacking Device", quantity: 2, successModifier: 0.3, durability: 3 },
    { name: "Combat Stimulant", quantity: 0, successModifier: 0.0 }
  ];

  const missions = [
    { name: "Infiltrate the Corporate Headquarters", baseSuccessRate: 0.6, cost: 200, reward: 500, reputationGain: 50, reputationLoss: 10, levelGain: 1 },
    { name: "Retrieve Stolen Data", baseSuccessRate: 0.7, cost: 150, reward: 300, reputationGain: 30, reputationLoss: 5, levelGain: 1 },
    { name: "Eliminate the Rival Gang", baseSuccessRate: 0.4, cost: 300, reward: 700, reputationGain: 70, reputationLoss: 15, levelGain: 2 },
  ];

  let funds = 1000; // Initial funds
  let reputation = 50; // Initial reputation
  let level = 1; // Initial level
  let equippedItems = [];

  const inventoryList = document.getElementById('inventory-list');
  const equipmentList = document.getElementById('equipment-list');
  const playerStats = document.getElementById('player-stats');
  const missionFeedbackContainer = document.getElementById('mission-feedback');
  const buyActionFeedbackContainer = document.getElementById('action-feedback');
  const feedbackContainer = document.getElementById('market-feedback');

  const buyButton = document.getElementById('buy-button');
  buyButton.addEventListener('click', buyItem);

  const sellButton = document.getElementById('sell-button');
  sellButton.addEventListener('click', sellItem);

  const useItemButton = document.getElementById('use-item-button');
  useItemButton.addEventListener('click', useItem);

  const missionButton = document.getElementById('mission-button');
  missionButton.addEventListener('click', performMission);

  startPriceFluctuations();
  updateInventory();
  updateEquipment();
  updateMissions();
  updatePlayerStats();

  function startPriceFluctuations() {
    setInterval(() => {
      inventoryItems.forEach(item => {
        const fluctuation = item.cost * (Math.random() * 0.2 - 0.1);
        const newPrice = Math.max(10, item.cost + fluctuation);
        const sellValueFluctuation = item.sellValue * (Math.random() * 0.2 - 0.1);
        const newSellValue = Math.max(5, item.sellValue + sellValueFluctuation);
        item.cost = Math.round(newPrice);
        item.sellValue = Math.round(newSellValue);
      });

      // Market event
      if (Math.random() < 0.1) {
        const eventTypes = ["Tech Advances", "Market Crash", "Resource Scarcity"];
        const selectedEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        inventoryItems.forEach(item => {
          switch (selectedEvent) {
            case "Tech Advances":
              const techFluctuation = item.cost * (Math.random() * -0.2);
              item.cost = Math.round(Math.max(10, item.cost + techFluctuation));
              item.sellValue = Math.round(Math.max(5, item.sellValue + techFluctuation / 2));
              feedbackContainer.textContent = `Tech Advances! The cost of ${item.name} has decreased, and the sell value has increased.`;
              break;
            case "Market Crash":
              const crashFluctuation = item.cost * (Math.random() * -0.3);
              item.cost = Math.round(Math.max(10, item.cost + crashFluctuation));
              item.sellValue = Math.round(Math.max(5, item.sellValue + crashFluctuation / 2));
              feedbackContainer.textContent = `Market Crash! The cost of ${item.name} has decreased, and the sell value has decreased.`;
              break;
            case "Resource Scarcity":
              const scarcityFluctuation = item.cost * (Math.random() * 0.3);
              item.cost = Math.round(Math.max(10, item.cost + scarcityFluctuation));
              item.sellValue = Math.round(Math.max(5, item.sellValue + scarcityFluctuation / 2));
              feedbackContainer.textContent = `Resource Scarcity! The cost of ${item.name} has increased, and the sell value has increased.`;
              break;
          }
        });
      }

      updateInventory();
    }, 10555);
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
          const feedbackElement = document.createElement('div');
          feedbackElement.textContent = `You successfully purchased ${selectedItem} for $${selectedItemObj.cost}.`;
          buyActionFeedbackContainer.prepend(feedbackElement);
          updateInventory();
          updatePlayerStats();

          if (buyActionFeedbackContainer.children.length > 3) {
            buyActionFeedbackContainer.removeChild(buyActionFeedbackContainer.lastChild);
          }
        } else {
          feedback.textContent = 'Insufficient funds.';
        }
      }
    } else {
      feedback.textContent = 'No item selected for purchase.';
    }
  }

  function useItem() {
    const selectItem = document.getElementById('equipment-select');
    const selectedItem = selectItem.value;
    if (selectedItem) {
      const existingItem = equipment.find(item => item.name === selectedItem);
      if (existingItem && existingItem.quantity > 0) {
        if (existingItem.durability !== undefined && existingItem.durability === 0) {
          feedback.textContent = 'Item durability is depleted and cannot be used.';
          return;
        }

        // Check if item is already equipped
        const isAlreadyEquipped = equippedItems.some(item => item.name === selectedItem);
        if (isAlreadyEquipped) {
          feedback.textContent = 'Item is already equipped.';
          return;
        }

        // Use the equipment item
        existingItem.quantity--;
        equippedItems.push(existingItem);
        
        if (existingItem.durability !== undefined) {
          existingItem.durability--;
        }

        const feedbackElement = document.createElement('div');
        feedbackElement.textContent = `You used ${selectedItem}.`;
        buyActionFeedbackContainer.prepend(feedbackElement);
        updateEquipment();
        updatePlayerStats();
        updateMissions(); // Update mission success rates

        if (buyActionFeedbackContainer.children.length > 3) {
          buyActionFeedbackContainer.removeChild(buyActionFeedbackContainer.lastChild);
        }
      } else {
        feedback.textContent = 'Item not found in equipment or no quantity available to use.';
      }
    } else {
      feedback.textContent = 'No item selected to use.';
    }
  }
  
  function sellItem() {
    const selectItem = document.getElementById('sell-select');
    const selectedItem = selectItem.value;
    if (selectedItem) {
      const existingItem = inventoryItems.find(item => item.name === selectedItem);
      if (existingItem && existingItem.quantity > 0) {
        const successRate = 1 - existingItem.risk; // Adjusted success rate based on risk
        if (Math.random() <= successRate) {
          existingItem.quantity--;
          funds += existingItem.sellValue;
          reputation += existingItem.sellValue * 0.2; // Increase reputation upon successful sale
          const feedbackElement = document.createElement('div');
          feedbackElement.textContent = `You successfully sold ${selectedItem} for $${existingItem.sellValue}. You gained reputation.`;
          buyActionFeedbackContainer.prepend(feedbackElement);
        } else {
          reputation -= existingItem.sellValue * 0.1; // Decrease reputation when selling fails
          const feedbackElement = document.createElement('div');
          feedbackElement.textContent = `Failed to sell ${selectedItem}. You lost some reputation.`;
          buyActionFeedbackContainer.prepend(feedbackElement);
        }
        updateInventory();
        updatePlayerStats();
        updateMissions(); // Update mission success rates

        if (buyActionFeedbackContainer.children.length > 3) {
          buyActionFeedbackContainer.removeChild(buyActionFeedbackContainer.lastChild);
        }
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
          // Disable the mission button
          missionButton.disabled = true;

          const equipmentSuccessModifier = equippedItems.reduce((total, item) => total + item.successModifier, 0);
          const successRate = selectedMission.baseSuccessRate + equipmentSuccessModifier;
          const adjustedSuccessRate = Math.min(Math.max(successRate, 0), 1); // Clamp the success rate between 0 and 1

          funds -= selectedMission.cost;
          const missionInProgressMessage = `You are attempting to ${selectedMission.name}, everything looks clear.`;

          const feedbackElement = document.createElement('div');
          feedbackElement.textContent = missionInProgressMessage;
          missionFeedbackContainer.prepend(feedbackElement);

          setTimeout(() => {
            if (Math.random() <= adjustedSuccessRate) {
              funds += selectedMission.reward;
              reputation += selectedMission.reputationGain;
              level += selectedMission.levelGain;
              feedbackElement.textContent = `Mission successful! You gained ${selectedMission.reputationGain} reputation, ${selectedMission.levelGain} level(s), and $${selectedMission.reward}.`;
            } else {
              reputation -= selectedMission.reputationLoss;
              feedbackElement.textContent = `Mission failed. You lost ${selectedMission.reputationLoss} reputation.`;

              // Remove a random equipped item upon mission failure
              if (equippedItems.length > 0) {
                const randomIndex = Math.floor(Math.random() * equippedItems.length);
                equippedItems.splice(randomIndex, 1);
                feedbackElement.textContent += ` You lost one of your equipped items.`;
              }
            }
            updatePlayerStats();

            if (missionFeedbackContainer.children.length > 3) {
              missionFeedbackContainer.removeChild(missionFeedbackContainer.lastChild);
            }

            // Re-enable the mission button after the mission outcome is determined
            missionButton.disabled = false;
          }, getRandomDelay(5000, 15000)); // Random delay between 5 and 15 seconds
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
      li.textContent = `${item.name} (${item.quantity}) - $${item.sellValue}`;
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

  function updateEquipment() {
    equipmentList.innerHTML = '';
    equipment.forEach(item => {
      const li = document.createElement('li');
      const durability = item.durability !== undefined ? `Durability: ${item.durability}` : '';
      li.textContent = `${item.name} (${item.quantity}) ${durability}`;
      equipmentList.appendChild(li);
    });

    const useSelect = document.getElementById('equipment-select');
    useSelect.innerHTML = '<option value="">Select item to use</option>';
    equipment.forEach(item => {
      if (item.quantity > 0) {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name}`;
        useSelect.appendChild(option);
      }
    });
  }

  function updatePlayerStats() {
    const equippedItemsText = equippedItems.length > 0 ? equippedItems.map(item => {
      const durability = item.durability !== undefined ? `(${item.durability})` : '';
      return `${item.name}${durability}`;
    }).join(', ') : 'None';
    playerStats.innerHTML = `Funds: $${funds} | Reputation: ${reputation} | Level: ${level} | Equipped Items: ${equippedItemsText}`;
  }

  function updateMissions() {
    const missionSelect = document.getElementById('mission-select');
    const selectedMissionValue = missionSelect.value;

    missionSelect.innerHTML = '';

    missions.forEach(mission => {
      const equipmentSuccessModifier = equippedItems.reduce((total, item) => total + item.successModifier, 0);
      const successRate = mission.baseSuccessRate + equipmentSuccessModifier;
      const adjustedSuccessRate = Math.min(Math.max(successRate, 0), 1);

      const option = document.createElement('option');
      option.value = mission.name;
      option.textContent = `${mission.name} - Success Rate: ${(adjustedSuccessRate * 100).toFixed(2)}% - Cost: $${mission.cost}, Reward: $${mission.reward}`;
      missionSelect.appendChild(option);
    });

    missionSelect.value = selectedMissionValue;
  }

  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});

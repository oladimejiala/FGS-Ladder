document.addEventListener("DOMContentLoaded", function () {
  // Game state with FGS education elements
  const gameState = {
    players: {
      player1: { position: 1, isActive: true },
      player2: { position: 1, isActive: false }
    },
    gameOver: false,
    diceValue: 0,
    schistosomaPositions: {
      // Schistosoma worms (negative effects)
      25: 5,
      42: 20,
      55: 35,
      70: 50,
      85: 60,
      98: 40
    },
    ladderPositions: {
      // Health actions (positive effects)
      3: 22,
      11: 30,
      17: 45,
      28: 52,
      37: 65,
      47: 75,
      63: 80,
      73: 92
    },
    educationTips: {
      5: {
        title: "What is FGS?",
        content: `<img src="https://healthjade.com/wp-content/uploads/2018/10/Schistosoma-haematobium.jpg" alt="Schistosoma worm">
                          <p><strong>Female Genital Schistosomiasis (FGS)</strong> is caused by the parasite <em>Schistosoma haematobium</em>. It affects the female reproductive system, leading to pain, bleeding, and infertility.</p>`
      },
      22: {
        title: "Symptoms of FGS",
        content: `<img src="https://www.researchgate.net/profile/Svein-Gundersen/publication/262979410/figure/fig1/AS:296379743260674@1447673845620/Female-genital-schistosomiasis-lesions-Th-is-fi-gure-shows-an-image-from-a.png" alt="FGS symptoms">
                          <p><strong>Symptoms include:</strong><br>• Vaginal bleeding<br>• Pain during intercourse<br>• Infertility<br>• Genital ulcers</p>`
      },
      30: {
        title: "Seek Medical Help",
        content: `<img src="https://www.gha.gi/wp-content/uploads/2023/03/Asset-1visiting-patient-1536x1252.png" alt="Hospital visit">
                          <p>If you experience symptoms, visit a <strong>health clinic</strong> immediately. Early treatment prevents complications.</p>`
      },
      45: {
        title: "Diagnosis of FGS",
        content: `<img src="https://www.toplinemd.com/trogolo-obstetrics-and-gynecology/wp-content/uploads/sites/35/2021/12/Why-Is-Colposcopy-Done-.jpg" alt="Diagnosis">
                          <p><strong>Diagnosis methods:</strong><br>• Microscopic urine/stool tests<br>• Colposcopy (visual inspection)<br>• PCR testing</p>`
      },
      52: {
        title: "Treatment for FGS",
        content: `<img src="https://5.imimg.com/data5/SELLER/Default/2023/11/358370127/OH/OQ/KV/27213454/biltree-600-mg-tablet-praziquantal-tablets-1000x1000.jpg" alt="Medication">
                          <p><strong>Treatment:</strong><br>• <em>Praziquantel</em> (anti-parasitic drug)<br>• Surgery in severe cases<br>• Follow-up care is crucial</p>`
      },
      65: {
        title: "Prevention of FGS",
        content: `<img src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2147494187/settings_images/BfW3K5hvQpKpH3kKUlNZ_9789241509299_eng-1.jpg" alt="Prevention">
                          <p><strong>Prevent FGS by:</strong><br>• Avoiding contaminated water<br>• Using clean toilets<br>• Mass drug administration in high-risk areas</p>`
      },
      75: {
        title: "Community Awareness",
        content: `<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPtvGpMMGxgHD0gvLuBQ0KhzuS7znx9cIfBmnm9rSCEzIrZ-DMSx8Ww2KLyUF4hyphenhyphenR0d9V0NKtQjVbKUwMmIQqn4oOT3GYlL32U0j7qkanbJ05h-VWDUdK0JgqJUlmAx60STv3-ktQUN0Q5/s640-rw/community-building.jpg" alt="Community education">
                          <p><strong>Spread awareness!</strong><br>Educate women and girls about FGS symptoms and treatment.</p>`
      },
      92: {
        title: "FGS-Free Future",
        content: `<img src="https://unlimithealth.org/wp-content/uploads/2024/08/2023-09-05-CIV.jpg-scaled.webp" alt="Healthy women">
                          <p>With <strong>early diagnosis, treatment, and prevention</strong>, we can eliminate FGS!</p>`
      }
    }
  };

  // DOM elements
  const board = document.getElementById("board");
  const diceElement = document.getElementById("dice");
  const rollBtn = document.getElementById("rollBtn");
  const statusElement = document.getElementById("status");
  const winMessageElement = document.getElementById("winMessage");
  const player1Info = document.querySelector(".player1-info");
  const player2Info = document.querySelector(".player2-info");
  const educationModal = document.getElementById("educationModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  // Initialize the board with education tips
  function initializeBoard() {
    board.innerHTML = "";

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        let cellNumber;
        if (row % 2 === 0) {
          cellNumber = 100 - (row * 10 + col);
        } else {
          cellNumber = 100 - (row * 10 + (9 - col));
        }

        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.number = cellNumber;

        const cellNumberElement = document.createElement("div");
        cellNumberElement.className = "cell-number";
        cellNumberElement.textContent = cellNumber;
        cell.appendChild(cellNumberElement);

        // Add Schistosoma worm or ladder
        if (gameState.schistosomaPositions[cellNumber]) {
          cell.classList.add("schistosoma");
          const icon = document.createElement("div");
          icon.className = "schistosoma-icon";
          icon.innerHTML = "🪱";
          cell.appendChild(icon);
        } else if (gameState.ladderPositions[cellNumber]) {
          cell.classList.add("ladder");
          const icon = document.createElement("div");
          icon.className = "ladder-icon";
          icon.innerHTML = "🏥";
          cell.appendChild(icon);
        }

        // Add education tip markers
        if (gameState.educationTips[cellNumber]) {
          const tipMarker = document.createElement("div");
          tipMarker.className = "education-tip";
          tipMarker.textContent = "i";
          tipMarker.title = "FGS Education Tip";
          tipMarker.addEventListener("click", () =>
            showEducationTip(cellNumber)
          );
          cell.appendChild(tipMarker);
        }

        board.appendChild(cell);
      }
    }

    updatePlayerPositions();
  }

  // Update player positions on the board
  function updatePlayerPositions() {
    document.querySelectorAll(".player").forEach((el) => el.remove());

    for (const player in gameState.players) {
      const position = gameState.players[player].position;
      const cell = document.querySelector(`.cell[data-number="${position}"]`);

      if (cell) {
        const playerElement = document.createElement("div");
        playerElement.className = `player ${player}`;
        playerElement.textContent = player === "player1" ? "1" : "2";
        cell.appendChild(playerElement);
      }
    }
  }

  // Show education tip
  function showEducationTip(cellNumber) {
    const tip = gameState.educationTips[cellNumber];
    modalTitle.textContent = tip.title;
    modalBody.innerHTML = tip.content;
    educationModal.style.display = "flex";
  }

  // Close education modal
  modalClose.addEventListener("click", () => {
    educationModal.style.display = "none";
  });

  // Roll the dice
  function rollDice() {
    if (gameState.gameOver) return;

    rollBtn.disabled = true;
    diceElement.textContent = "...";

    // Animate dice roll
    let rolls = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      gameState.diceValue = Math.floor(Math.random() * 6) + 1;
      diceElement.textContent = gameState.diceValue;
      rolls++;

      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        setTimeout(movePlayer, 500);
      }
    }, 100);
  }

  // Move the active player
  function movePlayer() {
    const activePlayer = gameState.players.player1.isActive
      ? "player1"
      : "player2";
    let newPosition =
      gameState.players[activePlayer].position + gameState.diceValue;

    // Check for win
    if (newPosition >= 100) {
      newPosition = 100;
      gameState.gameOver = true;
      declareWinner(activePlayer);
    } else {
      // Check for Schistosoma worm or ladder
      if (gameState.schistosomaPositions[newPosition]) {
        newPosition = gameState.schistosomaPositions[newPosition];
        statusElement.textContent = `⚠️ ${activePlayer.replace(
          "player",
          "Player "
        )} got infected with Schistosoma!`;
      } else if (gameState.ladderPositions[newPosition]) {
        newPosition = gameState.ladderPositions[newPosition];
        statusElement.textContent = `✅ ${activePlayer.replace(
          "player",
          "Player "
        )} took a health action!`;
      }

      gameState.players[activePlayer].position = newPosition;
      updatePlayerPositions();

      // Show education tip if landing on one
      if (gameState.educationTips[newPosition]) {
        showEducationTip(newPosition);
      }

      if (gameState.diceValue !== 6) {
        switchTurn();
      } else {
        statusElement.textContent = `${activePlayer.replace(
          "player",
          "Player "
        )} rolled a 6 and gets another turn!`;
        rollBtn.disabled = false;
      }
    }

    if (!gameState.gameOver && gameState.diceValue !== 6) {
      rollBtn.disabled = false;
    }
  }

  // Switch turns between players
  function switchTurn() {
    gameState.players.player1.isActive = !gameState.players.player1.isActive;
    gameState.players.player2.isActive = !gameState.players.player2.isActive;

    if (gameState.players.player1.isActive) {
      statusElement.className = "status player1-turn";
      statusElement.textContent = "Player 1's Turn";
      player1Info.classList.add("active");
      player2Info.classList.remove("active");
    } else {
      statusElement.className = "status player2-turn";
      statusElement.textContent = "Player 2's Turn";
      player1Info.classList.remove("active");
      player2Info.classList.add("active");
    }
  }

  // Declare the winner
  function declareWinner(winner) {
    winMessageElement.textContent = `🎉 ${winner.replace(
      "player",
      "Player "
    )} wins! 🎉`;
    statusElement.textContent = "Game Over!";
    rollBtn.disabled = true;

    // Highlight winner
    if (winner === "player1") {
      winMessageElement.style.color = "var(--player1-color)";
    } else {
      winMessageElement.style.color = "var(--player2-color)";
    }
  }

  // Event listeners
  rollBtn.addEventListener("click", rollDice);
  diceElement.addEventListener("click", function () {
    if (!rollBtn.disabled) rollDice();
  });

  // Initialize the game
  initializeBoard();
  player1Info.classList.add("active");
});

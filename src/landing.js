export function initializeLanding() {

  // ==========================================
  // 1. Mobile Menu & Navigation
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('nav-links');
  const header = document.getElementById('header');

  hamburger.addEventListener('click', () => {
    header.classList.toggle('menu-open');
  });

  // Close menu on link click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
    });
  });

  // Sticky navbar logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. Interactive Phone Simulator Module Swapper
  // ==========================================
  const moduleItems = document.querySelectorAll('.module-item');
  const simulatorScreenImg = document.getElementById('simulator-screen-img');

  // Change screen view in simulated app
  function switchPhoneView(viewId) {
    // Sync sidebar list
    moduleItems.forEach(item => {
      if (item.getAttribute('data-module') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (simulatorScreenImg) {
      // Map module key to image source
      let targetSrc = 'assets/mockup1.jpg';
      if (viewId === 'modo-batalla' || viewId === 'ranking') {
        targetSrc = 'assets/mockup2.jpg';
      } else if (viewId === 'estadisticas') {
        targetSrc = 'assets/mockup3.jpg';
      }

      // Smooth transition
      simulatorScreenImg.style.opacity = 0.1;
      setTimeout(() => {
        simulatorScreenImg.src = targetSrc;
        simulatorScreenImg.onload = () => {
          simulatorScreenImg.style.opacity = 1;
        };
      }, 150);
    }
  }

  // Trigger from sidebar items
  moduleItems.forEach(item => {
    item.addEventListener('click', () => {
      const moduleName = item.getAttribute('data-module');
      switchPhoneView(moduleName);
    });
  });

  // ==========================================
  // 3. Battle Mode Simulation Mini-Game
  // ==========================================
  const questionsList = [
    {
      question: "Hombre de 45 años con dolor torácico opresivo de 2 horas. EKG muestra elevación del ST en DII, DIII y aVF. ¿Cuál es el diagnóstico más probable?",
      options: [
        "Infarto agudo de miocardio anterior",
        "Infarto agudo de miocardio inferior",
        "Angina inestable",
        "Pericarditis aguda"
      ],
      correctIndex: 1,
      explanation: "La elevación del ST en DII, DIII y aVF indica isquemia aguda con lesión subepicárdica en la cara inferior del ventrículo izquierdo, irrigada principalmente por la arteria coronaria derecha."
    },
    {
      question: "Paciente pediátrico de 3 años presenta tos perruna, estridor inspiratorio y disfonía. ¿Cuál es el diagnóstico más probable?",
      options: [
        "Epiglotitis aguda",
        "Laringotraqueitis (Crup)",
        "Cuerpo extraño en vía aérea",
        "Bronquiolitis"
      ],
      correctIndex: 1,
      explanation: "El Crup o laringotraqueítis es la causa más común de obstrucción de la vía aérea superior en niños de 6 meses a 3 años, típicamente viral y caracterizada por esta tríada clínica."
    },
    {
      question: "Gestante de 32 semanas acude por cefalea, visión borrosa y PA 150/100 mmHg. Proteinuria de 24h: 400 mg. ¿Cuál es el diagnóstico?",
      options: [
        "Hipertensión gestacional",
        "Hipertensión crónica",
        "Preeclampsia sin criterios de severidad",
        "Preeclampsia con criterios de severidad"
      ],
      correctIndex: 2,
      explanation: "La preeclampsia se define como hipertensión gestacional de nueva aparición después de las 20 semanas asociada a proteinuria. Al no presentar PA ≥ 160/110 o daño de órgano blanco severo, se clasifica sin criterios de severidad."
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;
  let opponentScore = 0;
  let gameTimer = null;
  let secondsRemaining = 15;
  let botDecisionTimeout = null;
  let hasUserAnswered = false;
  let botAnswerIndex = -1;

  const gameLobby = document.getElementById('game-lobby');
  const gameScreen = document.getElementById('game-screen');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnStartGameLobby = document.getElementById('btn-start-game-lobby');
  const userScoreEl = document.getElementById('user-score');
  const opponentScoreEl = document.getElementById('opponent-score');
  const timerSecEl = document.getElementById('timer-sec');
  const gameQuestionEl = document.getElementById('game-question');
  const gameOptionsEl = document.getElementById('game-options');
  const explanationPanel = document.getElementById('battle-explanation');
  const explanationTextEl = document.getElementById('explanation-text');

  // Trigger start game
  btnStartGame.addEventListener('click', startBattleSimulation);
  btnStartGameLobby.addEventListener('click', () => {
    document.getElementById('batalla').scrollIntoView({ behavior: 'smooth' });
    startBattleSimulation();
  });

  function startBattleSimulation() {
    gameLobby.style.display = 'none';
    gameScreen.style.display = 'flex';
    currentQuestionIndex = 0;
    userScore = 0;
    opponentScore = 0;
    updateScoresDisplay();
    loadQuestion(0);
  }

  function updateScoresDisplay() {
    userScoreEl.textContent = userScore;
    opponentScoreEl.textContent = opponentScore;
  }

  function loadQuestion(index) {
    if (index >= questionsList.length) {
      endBattleSimulation();
      return;
    }

    hasUserAnswered = false;
    currentQuestionIndex = index;
    secondsRemaining = 15;
    timerSecEl.textContent = secondsRemaining;
    explanationPanel.style.display = 'none';

    const currentQ = questionsList[index];
    gameQuestionEl.textContent = currentQ.question;
    gameOptionsEl.innerHTML = '';

    // Create option buttons
    currentQ.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => handleUserSelection(optIdx));
      gameOptionsEl.appendChild(btn);
    });

    // Start timer countdown
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
      secondsRemaining--;
      timerSecEl.textContent = secondsRemaining;
      if (secondsRemaining <= 0) {
        clearInterval(gameTimer);
        handleUserSelection(-1); // Timeout
      }
    }, 1000);

    // Simulate opponent (BOT) decision
    simulateOpponentDecision(currentQ);
  }

  function simulateOpponentDecision(currentQ) {
    botAnswerIndex = -1;
    // Clear previous timeout
    clearTimeout(botDecisionTimeout);
    
    // Opponent will decide in 2 to 4 seconds
    const decisionTime = 2000 + Math.random() * 2000;
    
    botDecisionTimeout = setTimeout(() => {
      // 75% accuracy rate for the bot
      const willAnswerCorrectly = Math.random() < 0.75;
      if (willAnswerCorrectly) {
        botAnswerIndex = currentQ.correctIndex;
      } else {
        // Pick any incorrect index
        const wrongIndices = [];
        currentQ.options.forEach((_, idx) => {
          if (idx !== currentQ.correctIndex) wrongIndices.push(idx);
        });
        botAnswerIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      }

      // If user hasn't answered yet, show indicator that bot answered
      if (!hasUserAnswered) {
        const botOptionBtn = gameOptionsEl.children[botAnswerIndex];
        if (botOptionBtn) {
          const indicator = document.createElement('span');
          indicator.className = 'opponent-indicator';
          indicator.textContent = 'listo...';
          botOptionBtn.appendChild(indicator);
        }
      }
    }, decisionTime);
  }

  function handleUserSelection(selectedIdx) {
    if (hasUserAnswered) return;
    hasUserAnswered = true;
    clearInterval(gameTimer);

    const currentQ = questionsList[currentQuestionIndex];
    const correctIdx = currentQ.correctIndex;

    // Show bot answer if it hadn't decided yet
    if (botAnswerIndex === -1) {
      // Quick decision for bot
      botAnswerIndex = Math.random() < 0.75 ? correctIdx : (correctIdx + 1) % 4;
    }

    // Evaluate user selection
    const optionBtns = gameOptionsEl.querySelectorAll('.option-btn');
    
    if (selectedIdx !== -1) {
      const userBtn = optionBtns[selectedIdx];
      userBtn.classList.add('selected-user');
      if (selectedIdx === correctIdx) {
        userBtn.classList.add('correct');
        userScore += 100;
      } else {
        userBtn.classList.add('incorrect');
        // also highlight correct one
        optionBtns[correctIdx].classList.add('correct');
      }
    } else {
      // User timeout - highlight correct one
      optionBtns[correctIdx].classList.add('correct');
    }

    // Evaluate bot selection & show feedback on options
    if (botAnswerIndex !== -1 && botAnswerIndex !== selectedIdx) {
      const botBtn = optionBtns[botAnswerIndex];
      // Create badge on option button indicating bot chose this
      const botBadge = document.createElement('span');
      botBadge.className = 'opponent-indicator';
      botBadge.textContent = 'eligió esto';
      botBtn.appendChild(botBadge);
    }

    if (botAnswerIndex === correctIdx) {
      opponentScore += 100;
    }

    // Update score display
    updateScoresDisplay();

    // Show Explanation
    explanationPanel.style.display = 'block';
    explanationTextEl.textContent = currentQ.explanation;

    // Wait 4.5 seconds and go to next question
    setTimeout(() => {
      loadQuestion(currentQuestionIndex + 1);
    }, 4500);
  }

  function endBattleSimulation() {
    clearInterval(gameTimer);
    clearTimeout(botDecisionTimeout);

    gameOptionsEl.innerHTML = '';
    explanationPanel.style.display = 'none';

    let resultTitle = '';
    let resultMessage = '';

    if (userScore > opponentScore) {
      resultTitle = '🎉 ¡Ganaste la Batalla!';
      resultMessage = `Lograste vencer a TM-Bot con un marcador de ${userScore} a ${opponentScore}. ¡Gran dominio de especialidades médicas!`;
    } else if (userScore < opponentScore) {
      resultTitle = '🩺 TM-Bot ganó esta vez';
      resultMessage = `El marcador fue de ${userScore} contra ${opponentScore}. Sigue practicando para perfeccionar tus respuestas.`;
    } else {
      resultTitle = '🤝 ¡Empate técnico!';
      resultMessage = `Ambos obtuvieron ${userScore} puntos. Tienes un nivel excelente, ¡reta a tus compañeros reales!`;
    }

    gameQuestionEl.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <h3 style="font-size: 22px; color: var(--blue-dark); margin-bottom: 12px;">${resultTitle}</h3>
        <p style="font-size: 15px; color: var(--text-gray); margin-bottom: 24px;">${resultMessage}</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="btn-replay-simulation">Volver a Intentar</button>
          <a href="#descargar" class="btn btn-primary">Crear Mi Banco Completo</a>
        </div>
      </div>
    `;

    document.getElementById('btn-replay-simulation').addEventListener('click', () => {
      startBattleSimulation();
    });
  }

  // ==========================================
  // 4. Scroll Animations for Stats & Progress Bars
  // ==========================================
  const progressFills = document.querySelectorAll('.prog-fill');
  const statsDashboard = document.querySelector('.stats-dashboard');

  if (statsDashboard && progressFills.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate progress bars
          progressFills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-width');
            fill.style.width = targetWidth;
          });
          // Unobserve after animating
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statsObserver.observe(statsDashboard);
  }

}

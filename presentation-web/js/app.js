/* ==========================================================================
   CAMIND EDITORIAL PRESENTATION CONTROLLER
   Manages Slide Render, Teleprompter, Timer, Keyboard Shortcuts & Sound FX
   ========================================================================== */

class PresentationController {
  constructor(data) {
    this.data = data;
    this.slides = [];
    this.flattenSlides();

    this.currentIndex = 0;
    this.isTeleprompterOpen = false;
    this.soundEnabled = true;
    
    // Timer state per speaker
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.remainingSeconds = this.slides[0].sectionAllocatedTime;
    
    // Web Audio context for sound effects
    this.audioCtx = null;
    
    this.initDOMElements();
    this.bindEvents();
    this.renderCurrentSlide();
    this.initTimerForSpeaker(this.slides[0].partId);
  }

  flattenSlides() {
    this.data.sections.forEach(sec => {
      sec.slides.forEach(slide => {
        this.slides.push({
          ...slide,
          sectionTitle: sec.label,
          sectionAllocatedTime: sec.allocatedTime
        });
      });
    });
  }

  initDOMElements() {
    this.dom = {
      slideStage: document.getElementById("slide-stage"),
      slideNumber: document.getElementById("slide-number-indicator"),
      progressBar: document.getElementById("progress-fill"),
      progressDots: document.getElementById("progress-dots"),
      
      btnPrev: document.getElementById("btn-prev"),
      btnNext: document.getElementById("btn-next"),
      
      speakerTabs: document.querySelectorAll(".speaker-tab-btn"),
      
      // Teleprompter
      btnScriptToggle: document.getElementById("btn-script-toggle"),
      teleprompterDrawer: document.getElementById("teleprompter-drawer"),
      teleprompterBody: document.getElementById("teleprompter-body"),
      btnPrompterClose: document.getElementById("btn-prompter-close"),
      
      // Timer
      btnTimer: document.getElementById("btn-timer"),
      timerDisplay: document.getElementById("timer-display"),
      
      // Controls
      btnSound: document.getElementById("btn-sound"),
      btnFullscreen: document.getElementById("btn-fullscreen"),
      btnOverview: document.getElementById("btn-overview"),
      btnHelp: document.getElementById("btn-help"),
      
      // Modals
      overviewModal: document.getElementById("overview-modal"),
      helpModal: document.getElementById("help-modal"),
      overviewGrid: document.getElementById("overview-grid")
    };
  }

  bindEvents() {
    // Navigation buttons
    this.dom.btnPrev.addEventListener("click", () => this.prevSlide());
    this.dom.btnNext.addEventListener("click", () => this.nextSlide());

    // Speaker Tabs
    this.dom.speakerTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetPart = tab.getAttribute("data-part");
        const targetIndex = this.slides.findIndex(s => s.partId === targetPart);
        if (targetIndex !== -1) {
          this.goToSlide(targetIndex);
        }
      });
    });

    // Teleprompter toggle
    this.dom.btnScriptToggle.addEventListener("click", () => this.toggleTeleprompter());
    this.dom.btnPrompterClose.addEventListener("click", () => this.toggleTeleprompter(false));

    // Timer controls
    this.dom.btnTimer.addEventListener("click", () => this.toggleTimer());

    // Sound toggle
    this.dom.btnSound.addEventListener("click", () => {
      this.soundEnabled = !this.soundEnabled;
      this.dom.btnSound.classList.toggle("active", this.soundEnabled);
      this.dom.btnSound.title = this.soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng";
    });

    // Fullscreen toggle
    this.dom.btnFullscreen.addEventListener("click", () => this.toggleFullscreen());

    // Overview modal
    this.dom.btnOverview.addEventListener("click", () => this.openOverviewModal());

    // Help modal
    this.dom.btnHelp.addEventListener("click", () => this.toggleModal(this.dom.helpModal, true));

    // Close modals on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains("btn-modal-close")) {
          this.toggleModal(modal, false);
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  handleKeyboard(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    switch (e.key) {
      case "ArrowRight":
      case " ":
      case "PageDown":
        e.preventDefault();
        this.nextSlide();
        break;
      case "ArrowLeft":
      case "Backspace":
      case "PageUp":
        e.preventDefault();
        this.prevSlide();
        break;
      case "f":
      case "F":
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case "s":
      case "S":
        e.preventDefault();
        this.toggleTeleprompter();
        break;
      case "t":
      case "T":
        e.preventDefault();
        this.toggleTimer();
        break;
      case "o":
      case "O":
        e.preventDefault();
        this.openOverviewModal();
        break;
      case "?":
        e.preventDefault();
        this.toggleModal(this.dom.helpModal, true);
        break;
      case "Escape":
        this.toggleTeleprompter(false);
        this.toggleModal(this.dom.overviewModal, false);
        this.toggleModal(this.dom.helpModal, false);
        break;
      default:
        break;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    const prevPart = this.slides[this.currentIndex].partId;
    this.currentIndex = index;
    const newPart = this.slides[this.currentIndex].partId;

    // Reset or switch timer if speaker changed
    if (prevPart !== newPart) {
      this.initTimerForSpeaker(newPart);
    }

    this.playSoundEffect();
    this.renderCurrentSlide();
  }

  renderCurrentSlide() {
    const slide = this.slides[this.currentIndex];

    // Update bottom metadata & nav state
    this.dom.slideNumber.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    this.dom.btnPrev.disabled = (this.currentIndex === 0);
    this.dom.btnNext.disabled = (this.currentIndex === this.slides.length - 1);

    // Update Progress bar
    const percent = ((this.currentIndex + 1) / this.slides.length) * 100;
    this.dom.progressBar.style.width = `${percent}%`;

    // Update Speaker Tabs in Header
    this.dom.speakerTabs.forEach(tab => {
      tab.classList.toggle("active", tab.getAttribute("data-part") === slide.partId);
    });

    // Update Teleprompter text
    this.dom.teleprompterBody.innerHTML = `
      <p style="margin-bottom: 8px; color: var(--primary-yellow); font-size: 14px; text-transform: uppercase; font-weight: 700;">
        🎙️ Kịch bản gợi ý cho diễn giả ${slide.speaker} (${slide.slideNum})
      </p>
      <p>${slide.script}</p>
    `;

    // Render Slide Template
    this.dom.slideStage.innerHTML = this.generateSlideHTML(slide);

    // Attach any interactive buttons in the newly rendered slide
    const qaBtn = document.getElementById("btn-trigger-qa");
    if (qaBtn) {
      qaBtn.addEventListener("click", () => {
        alert("✨ Diễn đàn thảo luận (Q&A) đã sẵn sàng! Mời quý Thầy/Cô và các bạn sinh viên đặt câu hỏi cho nhóm.");
      });
    }
  }

  generateSlideHTML(slide) {
    return `
      <div class="slide-canvas">
        <!-- Slide Top Meta -->
        <div class="slide-top-meta">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="meta-speaker-badge">
              Diễn giả: <span class="name">${slide.speaker}</span>
            </span>
            <span class="meta-tag-badge">
              🏷️ ${slide.tag}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="slide-hook-chip">📌 ${slide.hook}</span>
            <span class="slide-number-indicator">${slide.slideNum}</span>
          </div>
        </div>

        <!-- Slide Title Wrap -->
        <div class="slide-title-wrap">
          <h2 class="slide-title">${slide.title}</h2>
          <div class="slide-subtitle">${slide.subTitle}</div>
        </div>

        <!-- Dynamic Body Layout -->
        ${this.generateBodyByType(slide)}
      </div>
    `;
  }

  generateBodyByType(slide) {
    switch (slide.type) {
      case "hero-split":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="bullet-card-stack">
                ${slide.content.bulletPoints.map(bp => `
                  <div class="bullet-item-card">
                    <h4>✨ ${bp.title}</h4>
                    <p>${bp.desc}</p>
                  </div>
                `).join("")}
              </div>
              <div class="editorial-quote-box">
                ${slide.content.highlightBox}
              </div>
            </div>
            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Global Context</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "dual-concept":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="dual-concept-container">
                <!-- Left: Lợi ích dân tộc -->
                <div class="concept-card dark-theme">
                  <div class="concept-header">
                    <span class="concept-icon">${slide.content.leftCard.icon}</span>
                    <div>
                      <h4>${slide.content.leftCard.title}</h4>
                      <span class="concept-role">${slide.content.leftCard.role}</span>
                    </div>
                  </div>
                  <ul class="concept-points">
                    ${slide.content.leftCard.points.map(p => `<li>${p}</li>`).join("")}
                  </ul>
                </div>

                <!-- Right: Hợp tác quốc tế -->
                <div class="concept-card">
                  <div class="concept-header">
                    <span class="concept-icon">${slide.content.rightCard.icon}</span>
                    <div>
                      <h4>${slide.content.rightCard.title}</h4>
                      <span class="concept-role">${slide.content.rightCard.role}</span>
                    </div>
                  </div>
                  <ul class="concept-points">
                    ${slide.content.rightCard.points.map(p => `<li>${p}</li>`).join("")}
                  </ul>
                </div>
              </div>

              <!-- Equation Banner -->
              <div class="equation-banner">
                <div class="equation-text">⚖️ ${slide.content.equation.text}</div>
                <div class="equation-rule">${slide.content.equation.rule}</div>
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Biện chứng</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "grid-cards":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="bullet-item-card" style="border-left-color: var(--accent-vermilion); margin-bottom: 8px;">
                <h4>⚡ ${slide.content.whyTitle}</h4>
                <ul style="padding-left: 20px; font-size: 14px; line-height: 1.55; color: #4A443C;">
                  ${slide.content.whyPoints.map(p => `<li>${p}</li>`).join("")}
                </ul>
              </div>

              <h4 style="font-size: 15px; font-weight: 800; color: #1E1B18; margin-top: 6px;">
                🛡️ ${slide.content.forcesTitle}
              </h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${slide.content.forcesList.map(f => `
                  <div class="bullet-item-card" style="padding: 12px 14px;">
                    <h5 style="font-size: 13.5px; font-weight: 800; color: #2D251A;">${f.name}</h5>
                    <p style="font-size: 12px; color: #6B6358;">${f.detail}</p>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Đa phương</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "principles-triad":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="principles-grid" style="grid-template-columns: 1fr;">
                ${slide.content.principles.map(p => `
                  <div class="principle-card" style="flex-direction: row; align-items: center; gap: 16px; padding: 14px 18px;">
                    <div class="principle-num">${p.num}</div>
                    <div style="flex: 1;">
                      <div class="principle-badge">${p.badge}</div>
                      <h4 style="margin: 3px 0;">${p.title}</h4>
                      <p style="margin: 0;">${p.desc}</p>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Tư tưởng HCM</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "historical-quotes":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="historical-quotes-pane">
                ${slide.content.quotes.map(q => `
                  <div class="vintage-parchment-card">
                    <div class="quote-seal-badge">HỒ CHÍ MINH<br>DI SẢN</div>
                    <div class="quote-text">${q.quote}</div>
                    <div class="quote-source">📜 Nguồn: ${q.source}</div>
                    <div class="quote-analysis">💡 <strong>Ý nghĩa chiến lược:</strong> ${q.analysis}</div>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Văn kiện chuẩn</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "convergence-matrix":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="dual-concept-container">
                <!-- Nội lực -->
                <div class="concept-card dark-theme" style="border-top: 4px solid var(--accent-vermilion);">
                  <div class="concept-header">
                    <span class="concept-icon">🇻🇳</span>
                    <div>
                      <h4 style="font-size: 15px;">${slide.content.internal.label}</h4>
                      <span class="concept-role" style="color: #FF7675;">${slide.content.internal.status}</span>
                    </div>
                  </div>
                  <ul class="concept-points">
                    ${slide.content.internal.items.map(i => `<li>${i}</li>`).join("")}
                  </ul>
                </div>

                <!-- Ngoại lực -->
                <div class="concept-card" style="border-top: 4px solid var(--primary-gold);">
                  <div class="concept-header">
                    <span class="concept-icon">🚀</span>
                    <div>
                      <h4 style="font-size: 15px;">${slide.content.external.label}</h4>
                      <span class="concept-role" style="color: #D35400;">${slide.content.external.status}</span>
                    </div>
                  </div>
                  <ul class="concept-points">
                    ${slide.content.external.items.map(i => `<li>${i}</li>`).join("")}
                  </ul>
                </div>
              </div>

              <div class="editorial-quote-box" style="margin-top: 8px;">
                ${slide.content.conclusion}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Hội tụ năng lượng</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "bamboo-diplomacy":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <!-- Triết lý 3 phần -->
              <div class="bamboo-philosophy-grid">
                ${slide.content.philosophy.map(p => `
                  <div class="bamboo-pill-card">
                    <h5>🎍 ${p.part}</h5>
                    <p>${p.desc}</p>
                  </div>
                `).join("")}
              </div>

              <!-- Số liệu thống kê ấn tượng -->
              <div class="metrics-row">
                ${slide.content.metrics.map(m => `
                  <div class="metric-stat-box">
                    <div class="metric-value">${m.value}</div>
                    <div class="metric-unit">${m.unit}</div>
                    <div class="metric-desc">${m.label}</div>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Cục diện hội nhập</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "case-study-vaccine":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="vaccine-timeline-wrap">
                <div class="vaccine-context-box">
                  <strong>⚠️ Bối cảnh:</strong> ${slide.content.context}
                </div>

                <div class="vaccine-actions-list">
                  ${slide.content.actions.map(act => `
                    <div class="vaccine-action-item">${act}</div>
                  `).join("")}
                </div>

                <div style="background: #E8F8F5; border-left: 4px solid #1ABC9C; padding: 10px 14px; border-radius: 6px; font-size: 13.5px; color: #0E6655;">
                  <strong>🎯 Kết quả đạt được:</strong> ${slide.content.results}
                </div>

                <div class="vaccine-lessons-grid">
                  ${slide.content.lessons.map(l => `
                    <div class="vaccine-lesson-card">
                      <h6>${l.title}</h6>
                      <p>${l.detail}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Chiến dịch lịch sử</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "governance-lessons":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="bullet-card-stack">
                ${slide.content.cards.map(c => `
                  <div class="bullet-item-card" style="border-left-color: var(--primary-gold);">
                    <h4>${c.icon} ${c.title}</h4>
                    <p>${c.desc}</p>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Quản trị quốc gia</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "student-pillars":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="student-pillars-container">
                ${slide.content.pillars.map(sp => `
                  <div class="student-pillar-card">
                    <div class="pillar-icon-ring">${sp.num}</div>
                    <span class="principle-badge">${sp.badge}</span>
                    <h4>${sp.title}</h4>
                    <p>${sp.desc}</p>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Gen Z & AI</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case "grand-finale":
        return `
          <div class="slide-body-grid">
            <div class="slide-text-pane">
              <div class="finale-hero-box">
                <div class="finale-quote">${slide.content.mainQuote}</div>
                <div class="finale-author">${slide.content.author}</div>
                <div class="finale-cta">${slide.content.callToAction}</div>
                <button id="btn-trigger-qa" class="btn-qa-sparkle">
                  💬 ${slide.content.qaButtonText}
                </button>
              </div>
            </div>

            <div class="slide-visual-pane">
              <div class="visual-image-card">
                <span class="visual-badge">Tương lai rực rỡ</span>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <div class="visual-image-overlay">
                  <div class="visual-caption">${slide.imageCaption}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      default:
        return `<div class="slide-text-pane"><p>Nội dung đang được hiển thị.</p></div>`;
    }
  }

  // ==========================================================================
  // PRESENTER COUNTDOWN TIMER
  // ==========================================================================
  initTimerForSpeaker(partId) {
    const section = this.data.sections.find(s => s.id === partId);
    if (!section) return;

    this.pauseTimer();
    this.remainingSeconds = section.allocatedTime;
    this.updateTimerDisplay();
  }

  toggleTimer() {
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.dom.btnTimer.classList.add("running");

    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateTimerDisplay();
      } else {
        this.pauseTimer();
        this.dom.btnTimer.classList.add("warning");
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    this.dom.btnTimer.classList.remove("running");
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    this.dom.timerDisplay.textContent = formatted;

    this.dom.btnTimer.classList.toggle("warning", this.remainingSeconds <= 30 && this.remainingSeconds > 0);
  }

  // ==========================================================================
  // TELEPROMPTER & MODALS
  // ==========================================================================
  toggleTeleprompter(forceState) {
    this.isTeleprompterOpen = (forceState !== undefined) ? forceState : !this.isTeleprompterOpen;
    this.dom.teleprompterDrawer.classList.toggle("open", this.isTeleprompterOpen);
    this.dom.btnScriptToggle.classList.toggle("active", this.isTeleprompterOpen);
  }

  openOverviewModal() {
    // Generate overview cards
    this.dom.overviewGrid.innerHTML = this.slides.map((s, idx) => `
      <div class="slide-thumb-card ${idx === this.currentIndex ? 'active' : ''}" data-index="${idx}">
        <div class="thumb-header">
          <span>${s.slideNum}</span>
          <span>👤 ${s.speaker}</span>
        </div>
        <div class="thumb-title">${s.title}</div>
      </div>
    `).join("");

    this.dom.overviewGrid.querySelectorAll(".slide-thumb-card").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-index"), 10);
        this.goToSlide(idx);
        this.toggleModal(this.dom.overviewModal, false);
      });
    });

    this.toggleModal(this.dom.overviewModal, true);
  }

  toggleModal(modalEl, show) {
    modalEl.classList.toggle("open", show);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
      this.dom.btnFullscreen.classList.add("active");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.dom.btnFullscreen.classList.remove("active");
      }
    }
  }

  // Gentle Web Audio API slide flip sound (synthetic, zero external network dependency)
  playSoundEffect() {
    if (!this.soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.presentationApp = new PresentationController(PRESENTATION_DATA);
});

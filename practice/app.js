(function () {
  "use strict";

  var SET = window.QUESTION_SET;

  var el = {
    emptyScreen: document.getElementById("emptyScreen"),
    quizScreen: document.getElementById("quizScreen"),
    summaryScreen: document.getElementById("summaryScreen"),
    topbarRight: document.getElementById("topbarRight"),
    setTitle: document.getElementById("setTitle"),

    progressLabel: document.getElementById("progressLabel"),
    progressFill: document.getElementById("progressFill"),
    countMastered: document.getElementById("countMastered"),
    countShaky: document.getElementById("countShaky"),
    countMissed: document.getElementById("countMissed"),
    qList: document.getElementById("qList"),
    qTopic: document.getElementById("qTopic"),
    qDifficulty: document.getElementById("qDifficulty"),
    qText: document.getElementById("qText"),
    answerInput: document.getElementById("answerInput"),
    revealBtn: document.getElementById("revealBtn"),
    revealPanel: document.getElementById("revealPanel"),
    rateMissed: document.getElementById("rateMissed"),
    rateShaky: document.getElementById("rateShaky"),
    rateMastered: document.getElementById("rateMastered"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    finishBtn: document.getElementById("finishBtn"),

    ringArc: document.getElementById("ringArc"),
    ringPct: document.getElementById("ringPct"),
    sumMastered: document.getElementById("sumMastered"),
    sumShaky: document.getElementById("sumShaky"),
    sumMissed: document.getElementById("sumMissed"),
    reviewList: document.getElementById("reviewList"),
    retryWeakBtn: document.getElementById("retryWeakBtn"),
    backToQuizBtn: document.getElementById("backToQuizBtn"),
    restartBtn: document.getElementById("restartBtn")
  };

  if (!SET || !Array.isArray(SET.questions) || !SET.questions.length) {
    el.emptyScreen.hidden = false;
    return;
  }

  var STORAGE_KEY = "drillbench_" + (SET.id || "default");

  function defaultState() {
    var progress = {};
    SET.questions.forEach(function (q) {
      progress[q.id] = { status: "unrated", userAnswer: "", revealed: false };
    });
    return { activeQuestions: SET.questions.map(function (q) { return q.id; }), progress: progress, currentIndex: 0, screen: "quiz" };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.activeQuestions)) return null;
      SET.questions.forEach(function (q) {
        if (!parsed.progress[q.id]) parsed.progress[q.id] = { status: "unrated", userAnswer: "", revealed: false };
      });
      return parsed;
    } catch (e) { return null; }
  }

  var state = load() || defaultState();

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }, 300);
  }

  var byId = {};
  SET.questions.forEach(function (q) { byId[q.id] = q; });

  function activeList() { return state.activeQuestions.map(function (id) { return byId[id]; }); }
  function currentQuestion() { return activeList()[state.currentIndex]; }
  function progressFor(id) { return state.progress[id]; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderTopbar() {
    el.topbarRight.innerHTML = "";
    var restart = document.createElement("button");
    restart.className = "btn btn-sm btn-danger";
    restart.textContent = "Reset progress";
    restart.addEventListener("click", function () {
      if (confirm("Clear all progress on this question set and start over?")) {
        state = defaultState();
        save();
        renderAll();
      }
    });
    el.topbarRight.appendChild(restart);
  }

  function showScreen(name) {
    el.quizScreen.hidden = name !== "quiz";
    el.summaryScreen.hidden = name !== "summary";
  }

  function counts() {
    var c = { mastered: 0, shaky: 0, missed: 0, unrated: 0 };
    activeList().forEach(function (q) {
      var st = progressFor(q.id).status;
      c[st] = (c[st] || 0) + 1;
    });
    return c;
  }

  function renderQList() {
    el.qList.innerHTML = "";
    activeList().forEach(function (q, i) {
      var st = progressFor(q.id).status;
      var btn = document.createElement("button");
      btn.className = "qitem" + (i === state.currentIndex ? " active" : "");
      btn.innerHTML =
        '<span class="qi-num">' + (i + 1) + '</span>' +
        '<span class="dot ' + (st !== "unrated" ? st : "") + '"></span>' +
        '<span class="qi-label">' + escapeHtml(q.topic) + '</span>';
      btn.addEventListener("click", function () {
        state.currentIndex = i;
        save();
        renderQuiz();
      });
      el.qList.appendChild(btn);
    });
  }

  function renderProgressBlock() {
    var list = activeList();
    var total = list.length;
    var c = counts();
    var rated = c.mastered + c.shaky + c.missed;
    el.progressLabel.textContent = (state.currentIndex + 1) + " / " + total;
    el.progressFill.style.width = (total ? (rated / total) * 100 : 0) + "%";
    el.countMastered.textContent = c.mastered;
    el.countShaky.textContent = c.shaky;
    el.countMissed.textContent = c.missed;
  }

  function renderQuiz() {
    var q = currentQuestion();
    if (!q) { state.screen = "summary"; save(); renderAll(); return; }
    el.setTitle.textContent = SET.title || "";
    renderProgressBlock();
    renderQList();

    el.qTopic.textContent = q.topic;
    el.qDifficulty.textContent = q.difficulty;
    el.qDifficulty.className = "tag tag-" + q.difficulty;
    el.qText.textContent = q.question;

    var p = progressFor(q.id);
    el.answerInput.value = p.userAnswer || "";

    renderRevealPanel(q, p);

    el.prevBtn.disabled = state.currentIndex === 0;
    el.nextBtn.disabled = state.currentIndex === activeList().length - 1;
  }

  function renderRevealPanel(q, p) {
    if (!p.revealed) { el.revealPanel.hidden = true; el.revealBtn.textContent = "Reveal key points"; return; }
    el.revealBtn.textContent = "Hide key points";
    el.revealPanel.hidden = false;
    var html = "";
    if (q.keyPoints && q.keyPoints.length) {
      html += "<h4>Key points</h4><ul>" + q.keyPoints.map(function (k) { return "<li>" + escapeHtml(k) + "</li>"; }).join("") + "</ul>";
    }
    if (q.modelAnswer) {
      html += "<h4>Model answer</h4><p>" + escapeHtml(q.modelAnswer) + "</p>";
    }
    el.revealPanel.innerHTML = html;
  }

  function renderSummary() {
    var list = activeList();
    var c = counts();
    var total = list.length || 1;
    var pct = Math.round((c.mastered / total) * 100);
    var RING_CIRC = 2 * Math.PI * 54;
    el.ringArc.style.strokeDasharray = RING_CIRC.toFixed(1);
    el.ringPct.textContent = pct + "%";
    el.ringArc.style.strokeDashoffset = (RING_CIRC * (1 - c.mastered / total)).toFixed(1);

    el.sumMastered.textContent = c.mastered + " mastered";
    el.sumShaky.textContent = c.shaky + " shaky";
    el.sumMissed.textContent = c.missed + " missed";

    el.reviewList.innerHTML = "";
    var toReview = list.filter(function (q) {
      var st = progressFor(q.id).status;
      return st === "shaky" || st === "missed";
    });
    if (!toReview.length) {
      var note = document.createElement("p");
      note.className = "empty-note";
      note.textContent = "Nothing flagged for review - nice work.";
      el.reviewList.appendChild(note);
    } else {
      toReview.forEach(function (q) {
        var st = progressFor(q.id).status;
        var details = document.createElement("details");
        details.className = "review-item";
        details.innerHTML =
          '<summary><span class="dot ' + st + '"></span><span class="tag tag-' + q.difficulty + '">' + q.difficulty + '</span> ' + escapeHtml(q.topic) + '</summary>' +
          '<p class="rq">' + escapeHtml(q.question) + '</p>' +
          '<p class="rp"><strong>Key points:</strong> ' + escapeHtml((q.keyPoints || []).join("; ")) + '</p>';
        el.reviewList.appendChild(details);
      });
    }
    el.retryWeakBtn.disabled = !toReview.length;
  }

  function renderAll() {
    showScreen(state.screen);
    renderTopbar();
    if (state.screen === "quiz") renderQuiz();
    else if (state.screen === "summary") renderSummary();
  }

  var answerSaveTimer = null;
  el.answerInput.addEventListener("input", function () {
    var q = currentQuestion();
    if (!q) return;
    progressFor(q.id).userAnswer = el.answerInput.value;
    clearTimeout(answerSaveTimer);
    answerSaveTimer = setTimeout(save, 400);
  });

  el.revealBtn.addEventListener("click", function () {
    var q = currentQuestion();
    if (!q) return;
    var p = progressFor(q.id);
    p.revealed = !p.revealed;
    save();
    renderRevealPanel(q, p);
  });

  function goToIndex(i) {
    state.currentIndex = Math.max(0, Math.min(activeList().length - 1, i));
    save();
    renderQuiz();
  }
  el.prevBtn.addEventListener("click", function () { goToIndex(state.currentIndex - 1); });
  el.nextBtn.addEventListener("click", function () { goToIndex(state.currentIndex + 1); });
  el.finishBtn.addEventListener("click", function () {
    state.screen = "summary";
    save();
    renderAll();
  });

  function rate(status) {
    var q = currentQuestion();
    if (!q) return;
    progressFor(q.id).status = status;
    if (state.currentIndex < activeList().length - 1) {
      state.currentIndex += 1;
      save();
      renderQuiz();
    } else {
      state.screen = "summary";
      save();
      renderAll();
    }
  }
  el.rateMissed.addEventListener("click", function () { rate("missed"); });
  el.rateShaky.addEventListener("click", function () { rate("shaky"); });
  el.rateMastered.addEventListener("click", function () { rate("mastered"); });

  el.retryWeakBtn.addEventListener("click", function () {
    var weak = activeList().filter(function (q) {
      var st = progressFor(q.id).status;
      return st === "shaky" || st === "missed";
    });
    if (!weak.length) return;
    state.activeQuestions = weak.map(function (q) { return q.id; });
    weak.forEach(function (q) { state.progress[q.id] = { status: "unrated", userAnswer: "", revealed: false }; });
    state.currentIndex = 0;
    state.screen = "quiz";
    save();
    renderAll();
  });
  el.backToQuizBtn.addEventListener("click", function () {
    state.screen = "quiz";
    state.currentIndex = 0;
    save();
    renderAll();
  });
  el.restartBtn.addEventListener("click", function () {
    state = defaultState();
    save();
    renderAll();
  });

  renderAll();
})();

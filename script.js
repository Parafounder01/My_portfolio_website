/* Portfolio interactions — no eval, no remote calls */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EMAIL = "anantharengarajan98@zohomail.in";
  var PHONE = "+91 8754681172";
  var GITHUB = "https://github.com/Parafounder01";
  var CV_PATH = "resume/anantha-kumar-cv.pdf";

  document.getElementById("year").textContent = String(new Date().getFullYear());

  /* ---------- CV availability: hide download actions if PDF missing ---------- */
  var cvAvailable = false;
  function setCvVisibility(on) {
    cvAvailable = on;
    document.querySelectorAll("[data-cv-only]").forEach(function (el) {
      el.style.display = on ? "" : "none";
    });
  }
  setCvVisibility(false);
  fetch(CV_PATH, { method: "HEAD" }).then(function (r) {
    setCvVisibility(r.ok);
  }).catch(function () { setCvVisibility(false); });

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  function closeNav(focusToggle) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    if (focusToggle) toggle.focus();
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) closeNav(true);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeNav(false);
  });

  /* ---------- Active section ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("data-nav")] = a; });
  var sections = ["about", "skills", "experience", "projects", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && !reduceMotion) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          var l = map[en.target.id];
          if (l) l.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- Scroll reveal (content visible without JS by default) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Hero image fallback (no broken image) ---------- */
  var heroImg = document.getElementById("hero-img");
  var heroMedia = document.getElementById("hero-media");
  heroImg.addEventListener("error", function () { heroMedia.style.display = "none"; });

  /* ---------- Hero caret: steady after a few blinks ---------- */
  var caret = document.getElementById("hero-caret");
  if (reduceMotion && caret) caret.style.animation = "none";

  /* ---------- Project filters ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));
  function applyFilter(f) {
    filterBtns.forEach(function (b) {
      var on = b.getAttribute("data-filter") === f;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    projects.forEach(function (p) {
      var show = f === "all" || p.getAttribute("data-category") === f;
      p.classList.toggle("hidden", !show);
    });
  }
  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () { applyFilter(b.getAttribute("data-filter")); });
  });
  window.__applyProjectFilter = applyFilter;

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");
  var copyTimer = null;
  function setStatus(msg) {
    copyStatus.textContent = msg;
    if (copyTimer) clearTimeout(copyTimer);
    if (msg) copyTimer = setTimeout(function () { copyStatus.textContent = ""; }, 4000);
  }
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      copyBtn.disabled = true;
      function done(msg) { setStatus(msg); copyBtn.disabled = false; copyBtn.focus(); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(
          function () { copyBtn.textContent = "[ COPIED ]"; done("Copied " + EMAIL); setTimeout(function(){ copyBtn.textContent = "[ COPY EMAIL ]"; }, 4000); },
          function () { done("Copy failed — email is " + EMAIL + " (select and copy manually)."); }
        );
      } else {
        done("Clipboard unavailable — email is " + EMAIL + " (select and copy manually).");
      }
    });
  }

  /* ---------- Terminal explorer ---------- */
  var form = document.getElementById("term-form");
  var input = document.getElementById("term-input");
  var transcript = document.getElementById("term-transcript");
  var live = document.getElementById("term-live");
  var history = [];
  var hIndex = -1;
  var MAX_LINES = 120;

  function esc(s) { return s; } // we use textContent everywhere; links built via DOM
  function trimLines() {
    while (transcript.children.length > MAX_LINES) transcript.removeChild(transcript.firstChild);
  }
  function addInputLine(raw) {
    var div = document.createElement("div");
    div.className = "t-line t-in";
    var ps = document.createElement("span");
    ps.className = "ps";
    ps.textContent = "visitor@portfolio:~$ ";
    div.appendChild(ps);
    div.appendChild(document.createTextNode(raw));
    transcript.appendChild(div);
  }
  function addOut(text, cls) {
    var div = document.createElement("div");
    div.className = "t-line " + (cls || "t-out");
    div.textContent = text;
    transcript.appendChild(div);
    return div;
  }
  function addLinkLine(prefix, href, label, download) {
    var div = document.createElement("div");
    div.className = "t-line t-out";
    div.appendChild(document.createTextNode(prefix));
    var a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (download) a.setAttribute("download", download);
    else { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    div.appendChild(a);
    transcript.appendChild(div);
  }
  function announce(msg) { live.textContent = ""; setTimeout(function(){ live.textContent = msg; }, 30); }
  function scrollDown() { transcript.scrollTop = transcript.scrollHeight; }
  function goTo(id) {
    var el = document.getElementById(id);
    if (el) {
      if (reduceMotion) el.scrollIntoView();
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  var COMMANDS = {
    help: function () {
      addOut("Available commands:");
      ["help — list commands", "about — go to About", "skills — go to Skills + list groups",
       "experience — go to Experience", "projects — reset filter + go to Projects",
       "education — go to Education", "contact — show email + phone",
       "resume — CV download link", "github — GitHub profile link", "clear — clear transcript"
      ].forEach(function (c) { addOut("  " + c); });
      return "Help listed.";
    },
    about: function () { goTo("about"); addOut("Opening #about — Technical Assistant, Linux + EDA, Trichy."); return "Navigated to About."; },
    skills: function () {
      goTo("skills");
      addOut("Skill groups: Linux & Infrastructure · EDA Tools · Automation · Embedded & Hardware.");
      return "Navigated to Skills.";
    },
    experience: function () { goTo("experience"); addOut("Opening #experience — SRM TRP, Nivedita InfoTech, Indus Teqsite."); return "Navigated to Experience."; },
    projects: function () {
      applyFilter("all");
      goTo("projects");
      addOut("Filter reset to All. Opening #projects.");
      return "Navigated to Projects.";
    },
    education: function () { goTo("education"); addOut("Opening #education — B.E. ECE, Diploma ECE, Vector India training."); return "Navigated to Education."; },
    contact: function () {
      goTo("contact");
      addOut("Email: " + EMAIL + " · Phone: " + PHONE);
      return "Contact details shown.";
    },
    resume: function () {
      if (cvAvailable) { addLinkLine("CV: ", CV_PATH, "Anantha_Kumar_CV.pdf", "Anantha_Kumar_CV.pdf"); return "CV link ready."; }
      addOut("Resume file is not available here. Please contact me by email.");
      return "Resume unavailable.";
    },
    github: function () { addLinkLine("GitHub: ", GITHUB, "github.com/Parafounder01", null); return "GitHub link ready."; },
    clear: function () { transcript.innerHTML = ""; return "Transcript cleared."; }
  };

  function run(raw) {
    var cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    addInputLine(raw.trim());
    history.push(raw.trim());
    if (history.length > 50) history.shift();
    hIndex = history.length;
    if (COMMANDS[cmd]) {
      var msg = COMMANDS[cmd]();
      announce(msg);
    } else {
      addOut("Command not found. Type help for available commands.", "t-err");
      announce("Command not found.");
    }
    trimLines();
    scrollDown();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    run(input.value);
    input.value = "";
    input.focus();
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") { e.preventDefault(); if (history.length) { hIndex = Math.max(0, hIndex - 1); input.value = history[hIndex] || ""; } }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (history.length) { hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] || ""; } }
  });
  document.querySelectorAll(".term-suggest button").forEach(function (b) {
    b.addEventListener("click", function () { run(b.getAttribute("data-cmd")); input.focus(); });
  });
  // greeting (static, safe)
  addOut("Portfolio terminal — type help for available commands.");
})();

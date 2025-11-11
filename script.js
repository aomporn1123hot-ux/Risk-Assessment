// -----------------------------
// 🔥 Firebase เก่า
// -----------------------------
const firebaseConfigOld = {
  apiKey: "AIzaSyDf0D2GLLDHoAVX4zq-tLuVocSmsrFhs38",
  authDomain: "fera-2215e.firebaseapp.com",
  databaseURL: "https://fera-2215e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fera-2215e",
  storageBucket: "fera-2215e.appspot.com",
  messagingSenderId: "810225127285",
  appId: "1:810225127285:web:fa87166d4e3e4770670d3c"
};
const oldApp = firebase.initializeApp(firebaseConfigOld, "old");
const dbOld = oldApp.database();
const authOld = oldApp.auth();
authOld.signInAnonymously().catch(console.error);

// -----------------------------
// 🔥 Firebase ใหม่
// -----------------------------
const firebaseConfigNew = {
  apiKey: "AIzaSyAy88t3sZ_OEoQP0jRxVYKOLG1gucvRGsg",
  authDomain: "fera-ergonomics.firebaseapp.com",
  databaseURL: "https://fera-ergonomics-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fera-ergonomics",
  storageBucket: "fera-ergonomics.firebasestorage.app",
  messagingSenderId: "111595993339",
  appId: "1:111595993339:web:80119030f63a850447985e",
  measurementId: "G-2T11CCPNY7"
};
const newApp = firebase.initializeApp(firebaseConfigNew, "new");
const dbNew = newApp.database();
const authNew = newApp.auth();
authNew.signInAnonymously().catch(console.error);

// -----------------------------
// 🔁 ฟังก์ชันส่งข้อมูลไปทั้งสองที่
// -----------------------------
function sendToFirebaseBoth(data) {
  // ส่งไปโปรเจกต์เก่า
  dbOld.ref("assessments").push(data, error => {
    if (error) console.error("❌ Error saving to OLD:", error);
    else console.log("✅ Saved to OLD Firebase:", data);
  });

  // ส่งไปโปรเจกต์ใหม่
  dbNew.ref("assessments").push(data, error => {
    if (error) console.error("❌ Error saving to NEW:", error);
    else console.log("✅ Saved to NEW Firebase:", data);
  });
}

// -----------------------------
// ✅ ส่วนอื่นเหมือนเดิมทั้งหมด
// -----------------------------

const pages = document.querySelectorAll(".page");
let currentPageIndex = 0;
function showPage(index) { currentPageIndex = index; pages.forEach((p, i) => p.classList.toggle("active", i === index)); }
function prevPage() { if (currentPageIndex > 0) showPage(currentPageIndex - 1); }

function createImageOptions(containerId, name, count, prefix) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("div");
    label.className = "image-option";
    label.innerHTML = `
      <input type="radio" name="${name}" value="${i}">
      <img src="${prefix}${i}.png" alt="${prefix}${i}">
      <div class="checkmark">✔</div>`;
    label.addEventListener("click", () => {
      document.querySelectorAll(`#${containerId} .image-option`).forEach(opt => opt.classList.remove("selected"));
      label.classList.add("selected");
      label.querySelector("input").checked = true;
    });
    container.appendChild(label);
  }
}

function startAssessment() {
  createImageOptions("upperPostureOptions", "upperPosture", 10, "บน");
  createImageOptions("lowerPostureOptions", "lowerPosture", 8, "ล่าง");
  showPage(1);
}

function nextUpperTimePage() {
  const selected = document.querySelector('input[name="upperPosture"]:checked');
  if (!selected) return alert("Please select an upper posture");
  const val = parseInt(selected.value);
  const labels = {
    1: ["1-2 min", "3-7 min", "8-18 min", ">17 min"],
    2: ["1 min", "2-6 min", "7-13 min", "14 min"],
    3: ["1 min", "2-8 min", "9-12 min"],
    4: ["1 min", "2-7 min", "8-11 min"],
    5: ["1-4 min", "5-12 min"],
    6: ["1 min", "2-7 min"],
    7: ["1 min", "2-8 min"],
    8: ["1-2 min"],
    9: ["1-4 min"],
    10: ["1-3 min"]
  };
  const container = document.getElementById("page2");
  container.innerHTML = `<h2>Q2. Duration in this posture (upper body)</h2>`;
  labels[val].forEach((text, i) => { container.innerHTML += `<label><input type="radio" name="upperTime" value="${i}"> ${text}</label><br>`; });
  container.innerHTML += `<div class="nav-buttons"><button type="button" onclick="prevPage()">Back</button><button type="button" onclick="showPage(3)">Next</button></div>`;
  showPage(2);
}

function nextLowerTimePage() {
  const selected = document.querySelector('input[name="lowerPosture"]:checked');
  if (!selected) return alert("Please select a lower posture");
  const val = parseInt(selected.value);
  const labels = {
    1: ["1-10 min", "11-32 min", "33 min"],
    2: ["1-11 min", "12 min"],
    3: ["1 min"],
    4: ["1 min"],
    5: ["1 min"],
    6: ["1-8 min", "9 min"],
    7: ["1-2 min", "3 min"],
    8: ["1-3 min", "4 min"]
  };
  const container = document.getElementById("page4");
  container.innerHTML = `<h2>Q4. Duration in this posture (lower body)</h2>`;
  labels[val].forEach((text, i) => { container.innerHTML += `<label><input type="radio" name="lowerTime" value="${i}"> ${text}</label><br>`; });
  container.innerHTML += `<div class="nav-buttons"><button type="button" onclick="prevPage()">Back</button><button type="button" onclick="showPage(5)">Next</button></div>`;
  showPage(4);
}

function collectAnswersForFirebase() {
  const getVal = name => document.querySelector(`input[name="${name}"]:checked`)?.value || "";
  return {
    upperPosture: getVal("upperPosture"),
    upperTime: getVal("upperTime"),
    lowerPosture: getVal("lowerPosture"),
    lowerTime: getVal("lowerTime"),
    force: getVal("force"),
    repetition: getVal("repetition"),
    twist: getVal("twist"),
    timestamp: Date.now()
  };
}

function calculateResult() {
  const getVal = name => parseInt(document.querySelector(`input[name="${name}"]:checked`)?.value || 0);
  const upperMap = { 1: [0, 0, 1, 2], 2: [0, 0, 1, 2], 3: [1, 2, 3], 4: [1, 2, 3], 5: [2, 3], 6: [2, 3], 7: [2, 3], 8: [3], 9: [3], 10: [3] };
  const lowerMap = { 1: [1, 2, 3], 2: [2, 3], 3: [3], 4: [3], 5: [3], 6: [2, 3], 7: [2, 3], 8: [2, 3] };
  const upPosture = getVal("upperPosture"), ut = getVal("upperTime"),
        lowerPosture = getVal("lowerPosture"), lt = getVal("lowerTime"),
        f = getVal("force"), r = getVal("repetition"), t = getVal("twist");
  const utScore = upperMap[upPosture]?.[ut] ?? 0;
  const ltScore = lowerMap[lowerPosture]?.[lt] ?? 0;
  const total = (1 + utScore) * (1 + ltScore) + f + r + t;

  let level = "", image = "";
  if (total === 1) { level = "Acceptable"; image = "ได้.jpg"; }
  else if (total <= 3) { level = "Low"; image = "ต่ำ.jpg"; }
  else if (total <= 7) { level = "Medium"; image = "กลาง.jpg"; }
  else if (total <= 14) { level = "High"; image = "สูง.jpg"; }
  else { level = "Very High"; image = "สูงมาก.jpg"; }

  const answers = collectAnswersForFirebase();
  answers.totalScore = total;
  answers.level = level;

  // ✅ ส่งข้อมูลไปทั้งสอง Firebase
  sendToFirebaseBoth(answers);

  document.getElementById("resultText").textContent = `Total score: ${total} (${level})`;
  const resultImg = document.getElementById("resultImage");
  resultImg.src = image;
  document.getElementById("downloadLink").href = image;
  showPage(6);
}

function goToFeedback() {
  window.location.href = "https://aomporn1123hot-ux.github.io/Satisfaction-Level/";
}

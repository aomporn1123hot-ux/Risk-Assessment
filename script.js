// ==================== FIREBASE SETUP ====================

// โปรเจกต์เก่า
const firebaseConfig1 = {
  apiKey: "AIzaSyDf0D2GLLDHoAVX4zq-tLuVocSmsrFhs38",
  authDomain: "fera-2215e.firebaseapp.com",
  databaseURL: "https://fera-2215e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fera-2215e",
  storageBucket: "fera-2215e.appspot.com",
  messagingSenderId: "810225127285",
  appId: "1:810225127285:web:fa87166d4e3e4770670d3c"
};

// โปรเจกต์ใหม่
const firebaseConfig2 = {
  apiKey: "AIzaSyAy88t3sZ_OEoQP0jRxVYKOLG1gucvRGsg",
  authDomain: "fera-ergonomics.firebaseapp.com",
  databaseURL: "https://fera-ergonomics-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fera-ergonomics",
  storageBucket: "fera-ergonomics.firebasestorage.app",
  messagingSenderId: "111595993339",
  appId: "1:111595993339:web:80119030f63a850447985e",
  measurementId: "G-2T11CCPNY7"
};

// สร้าง instance แยกชื่อ
const app1 = firebase.initializeApp(firebaseConfig1, "app1");
const app2 = firebase.initializeApp(firebaseConfig2, "app2");

// ใช้ database ของแต่ละโปรเจกต์
const db1 = app1.database();
const db2 = app2.database();

// login 匿名 (จำเป็นเพื่ออนุญาตเขียน)
firebase.auth().signInAnonymously().catch(e => console.error("Auth error:", e));

// ฟังก์ชันส่งข้อมูลไปทั้งสองโปรเจกต์
function sendToFirebase(data) {
  try {
    db1.ref("assessments").push(data);
    db2.ref("assessments").push(data);
    console.log("✅ Data sent to both Firebase projects");
  } catch (err) {
    console.error("❌ Error saving data:", err);
  }
}

// ========================================================

// ========== ส่วนแสดงหน้าแบบประเมิน ==========

const pages = document.querySelectorAll(".page");
let currentPageIndex = 0;

function showPage(index) {
  currentPageIndex = index;
  pages.forEach((p, i) => p.classList.toggle("active", i === index));
}

function prevPage() {
  if (currentPageIndex > 0) showPage(currentPageIndex - 1);
}

// ฟังก์ชันสร้างตัวเลือกภาพ
function createImageOptions(containerId, name, count, prefix) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("div");
    label.className = "image-option";
    label.style.cursor = "pointer";
    label.innerHTML = `
      <input type="radio" name="${name}" value="${i}">
      <img src="./images/${prefix}${i}.png" alt="${prefix}${i}">
      <div class="checkmark">✔</div>
    `;
    label.addEventListener("click", () => {
      document.querySelectorAll(`#${containerId} .image-option`).forEach(opt => opt.classList.remove("selected"));
      label.classList.add("selected");
      label.querySelector("input").checked = true;
    });
    container.appendChild(label);
  }
}

// เริ่มต้นแบบประเมิน
function startAssessment() {
  createImageOptions("upperPostureOptions", "upperPosture", 10, "บน");
  createImageOptions("lowerPostureOptions", "lowerPosture", 8, "ล่าง");
  console.log("✅ Image options created");
  showPage(1);
}

// หน้าที่ 1 → 2
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
  labels[val].forEach((text, i) => {
    container.innerHTML += `<label><input type="radio" name="upperTime" value="${i}"> ${text}</label><br>`;
  });
  container.innerHTML += `<div class="nav-buttons"><button type="button" onclick="prevPage()">Back</button><button type="button" onclick="showPage(3)">Next</button></div>`;
  showPage(2);
}

// หน้าที่ 3 → 4
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
  labels[val].forEach((text, i) => {
    container.innerHTML += `<label><input type="radio" name="lowerTime" value="${i}"> ${text}</label><br>`;
  });
  container.innerHTML += `<div class="nav-buttons"><button type="button" onclick="prevPage()">Back</button><button type="button" onclick="showPage(5)">Next</button></div>`;
  showPage(4);
}

// เก็บคำตอบเพื่อส่ง Firebase
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

// คำนวณผลคะแนน
function calculateResult() {
  const getVal = name => parseInt(document.querySelector(`input[name="${name}"]:checked`)?.value || 0);
  const upperMap = {1:[0,0,1,2],2:[0,0,1,2],3:[1,2,3],4:[1,2,3],5:[2,3],6:[2,3],7:[2,3],8:[3],9:[3],10:[3]};
  const lowerMap = {1:[1,2,3],2:[2,3],3:[3],4:[3],5:[3],6:[2,3],7:[2,3],8:[2,3]};
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
  sendToFirebase(answers);

  document.getElementById("resultText").textContent = `Total score: ${total} (${level})`;
  const resultImg = document.getElementById("resultImage");
  resultImg.src = image;
  document.getElementById("downloadLink").href = image;
  showPage(6);
}

// ปุ่ม Feedback
function goToFeedback() {
  window.location.href = "https://aomporn1123hot-ux.github.io/Satisfaction-Level/";
}

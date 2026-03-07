import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const navLinksEl = document.getElementById("nav-links");

function renderLoggedOut() {
  navLinksEl.innerHTML = `
    <a href="Auth.html" class="nav-btn">Đăng ký</a>
    <a href="Auth.html" class="nav-btn nav-btn-primary">Đăng nhập</a>
  `;
}

function renderLoggedIn(email) {
  navLinksEl.innerHTML = `
    <div class="user-dropdown">
      <button class="user-email-btn" id="user-email-btn" type="button">${email}</button>
      <div class="user-dropdown-menu" id="user-dropdown" aria-hidden="true">
        <div class="dropdown-email">${email}</div>
        <button type="button" class="dropdown-item" id="change-account">Đổi tài khoản</button>
        <button type="button" class="dropdown-item" id="logout">Đăng xuất</button>
      </div>
    </div>
  `;

  const emailBtn = document.getElementById("user-email-btn");
  const dropdown = document.getElementById("user-dropdown");
  const changeAccountBtn = document.getElementById("change-account");
  const logoutBtn = document.getElementById("logout");

  emailBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.getAttribute("aria-hidden") === "false";
    dropdown.setAttribute("aria-hidden", isOpen ? "true" : "false");
  });

  document.addEventListener("click", () => {
    dropdown.setAttribute("aria-hidden", "true");
  });

  dropdown.addEventListener("click", (e) => e.stopPropagation());

  changeAccountBtn.addEventListener("click", () => {
    window.location.href = "Auth.html";
  });

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "Auth.html";
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    renderLoggedIn(user.email || user.uid);
  } else {
    renderLoggedOut();
  }
});

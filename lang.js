const translations = {
  uz: {
    welcome: "Assalomu alaykum,",
    recommendedBooks: "Tavsiya etilgan kitoblar",
    profile: "Profil",
    profileTitle: "Profilingiz",
    save: "💾 Saqlash",
    logout: "🚪 Chiqish",
    search: "🔍 Qidiruv",
    invite: "👥 Do‘stlarni taklif qilish",
  },
  en: {
    welcome: "Welcome,",
    recommendedBooks: "Recommended Books",
    profile: "Profile",
    profileTitle: "Your Profile",
    save: "💾 Save",
    logout: "🚪 Logout",
    search: "🔍 Search",
    invite: "👥 Invite Friends",
  }
};

function setLanguage(lang) {
  localStorage.setItem("onkit_lang", lang);
  document.getElementById("welcome").textContent = translations[lang].welcome;
  document.getElementById("books").textContent = translations[lang].recommendedBooks;
  document.getElementById("profileText").textContent = translations[lang].profile;
  document.getElementById("profileTitle").textContent = translations[lang].profileTitle;
  document.getElementById("saveBtn").textContent = translations[lang].save;
  document.getElementById("logoutBtn").textContent = translations[lang].logout;
  document.getElementById("searchBtn").textContent = translations[lang].search;
  document.getElementById("inviteBtn").textContent = translations[lang].invite;
}

window.onload = () => {
  const lang = localStorage.getItem("onkit_lang") || "uz";
  setLanguage(lang);
};

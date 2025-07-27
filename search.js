async function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    alert("Iltimos, kitob nomini kiriting.");
    return;
  }

  // ⏳ Ekranga yuklanmoqda deb yozamiz
  resultsDiv.innerHTML = "⏳ Qidirilmoqda...";

  // 🔸 Qidiruv tarixiga saqlash
  saveSearchHistory(query);

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      resultsDiv.innerHTML = "❌ Kitob topilmadi.";
      return;
    }

    resultsDiv.innerHTML = "";
    data.docs.slice(0, 10).forEach(book => {
      const title = book.title || "Nomsiz";
      const author = book.author_name ? book.author_name.join(", ") : "Muallif yo‘q";
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/200x250?text=No+Cover";

      const card = `
        <div class="book-card">
          <img src="${coverUrl}" alt="Kitob rasmi">
          <h4>${title}</h4>
          <p>${author}</p>
        </div>
      `;

      resultsDiv.innerHTML += card;
    });
  } catch (error) {
    resultsDiv.innerHTML = "⚠️ Xatolik yuz berdi. Internet aloqasini tekshiring.";
  }
}

// 📝 Tarixga yozish
function saveSearchHistory(query) {
  let history = JSON.parse(localStorage.getItem("search_history")) || [];
  history.unshift(query); // yangisini boshiga qo‘shamiz
  history = [...new Set(history)].slice(0, 5); // unikal va 5tadan oshmasin
  localStorage.setItem("search_history", JSON.stringify(history));
}

// 📋 Tarixni chiqarish
function showSearchHistory() {
  const history = JSON.parse(localStorage.getItem("search_history")) || [];
  const resultsDiv = document.getElementById("results");

  if (history.length === 0) {
    resultsDiv.innerHTML = "🔍 Hali qidiruvlar mavjud emas.";
    return;
  }

  resultsDiv.innerHTML = "<h3>🕓 Oxirgi qidiruvlar:</h3>";
  history.forEach(item => {
    const el = document.createElement("p");
    el.textContent = "🔸 " + item;
    el.style.cursor = "pointer";
    el.style.color = "#2980b9";
    el.onclick = () => {
      document.getElementById("searchInput").value = item;
      searchBooks();
    };
    resultsDiv.appendChild(el);
  });
}

// Sahifa yuklanganda ko‘rsatish
window.onload = () => {
  showSearchHistory();
};

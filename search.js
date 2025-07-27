function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!query) {
    alert("Iltimos, kitob nomini kiriting.");
    return;
  }

  resultsDiv.innerHTML = "⏳ Qidirilmoqda...";
  downloadBtn.style.display = "none"; // har safar qaytadan boshlanadi

  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.docs || data.docs.length === 0) {
        resultsDiv.innerHTML = "❌ Kitob topilmadi.";
        return;
      }

      resultsDiv.innerHTML = "";
      data.docs.slice(0, 10).forEach((book, index) => {
        const title = book.title || "Nomsiz";
        const author = book.author_name ? book.author_name.join(", ") : "Muallif yo‘q";
        const coverId = book.cover_i;
        const coverUrl = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : "https://via.placeholder.com/200x250?text=No+Cover";

        const card = document.createElement("div");
        card.className = "book-card";
        card.setAttribute("data-title", title);
        card.setAttribute("data-author", author);

        card.innerHTML = `
          <img src="${coverUrl}" alt="Kitob rasmi">
          <h4>${title}</h4>
          <p>${author}</p>
        `;

        // Tanlash uchun bosiladi
        card.onclick = function () {
          card.classList.toggle("selected");

          // Kamida 1 ta tanlov bo‘lsa, yuklash tugmasini ko‘rsat
          const selected = document.querySelectorAll(".book-card.selected");
          downloadBtn.style.display = selected.length > 0 ? "block" : "none";
        };

        resultsDiv.appendChild(card);
      });
    })
    .catch(() => {
      resultsDiv.innerHTML = "❌ Qidiruvda xatolik yuz berdi.";
    });
}

function downloadSelectedBooks() {
  const selectedCards = document.querySelectorAll(".book-card.selected");

  if (selectedCards.length === 0) {
    alert("Hech qanday kitob tanlanmagan.");
    return;
  }

  const content = document.createElement("div");

  selectedCards.forEach(card => {
    const title = card.getAttribute("data-title");
    const author = card.getAttribute("data-author");

    const block = document.createElement("div");
    block.style.marginBottom = "20px";
    block.innerHTML = `<strong>${title}</strong><br><em>${author}</em>`;
    content.appendChild(block);
  });

  const options = {
    margin: 0.5,
    filename: "tanlangan-kitoblar.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().set(options).from(content).save();
}

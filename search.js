function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  const downloadBtn = document.getElementById("downloadBtn");
  const closeResultsBtn = document.getElementById("closeResultsBtn");

  if (!query) {
    alert("Iltimos, kitob nomini kiriting.");
    return;
  }

  resultsDiv.innerHTML = "⏳ Qidirilmoqda...";
  downloadBtn.style.display = "none";
  closeResultsBtn.style.display = "none";
  document.getElementById("archiveSection").style.display = "none";

  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.docs || data.docs.length === 0) {
        resultsDiv.innerHTML = "❌ Kitob topilmadi.";
        return;
      }

      resultsDiv.innerHTML = "";
      closeResultsBtn.style.display = "block";

      data.docs.slice(0, 10).forEach((book) => {
        const title = book.title || "Nomsiz";
        const author = book.author_name ? book.author_name.join(", ") : "Muallif yo‘q";
        const year = book.first_publish_year || "";
        const olid = book.edition_key ? book.edition_key[0] : "";
        const coverId = book.cover_i;
        const coverUrl = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : "https://via.placeholder.com/200x250?text=No+Cover";

        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
          <img src="${coverUrl}" alt="Kitob rasmi">
          <h4>${title}</h4>
          <p>${author}</p>
        `;

        // Kitob sahifasiga o'tish
        card.onclick = function () {
          const url = `book.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&year=${encodeURIComponent(year)}&cover=${coverId}&olid=${olid}`;
          window.location.href = url;
        };

        resultsDiv.appendChild(card);
      });
    })
    .catch(() => {
      resultsDiv.innerHTML = "❌ Qidiruvda xatolik yuz berdi.";
    });
}

function closeOpenLibraryResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("downloadBtn").style.display = "none";
  document.getElementById("closeResultsBtn").style.display = "none";
}

function searchInArchive() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Iltimos, kitob nomini yozing.");
    return;
  }

  const archiveFrame = document.getElementById("archiveFrame");
  const archiveSection = document.getElementById("archiveSection");

  archiveFrame.src = `https://archive.org/details/texts?query=${encodeURIComponent(query)}`;
  archiveSection.style.display = "block";
  archiveFrame.scrollIntoView({ behavior: "smooth" });
}

function closeArchive() {
  document.getElementById("archiveFrame").src = "";
  document.getElementById("archiveSection").style.display = "none";
}

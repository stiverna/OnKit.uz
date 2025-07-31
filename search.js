// OpenLibrary orqali qidiruv
function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  const closeResultsBtn = document.getElementById("closeResultsBtn");

  if (!query) {
    alert("Iltimos, kitob nomini kiriting.");
    return;
  }

  resultsDiv.innerHTML = "⏳ OpenLibrary orqali qidirilmoqda...";
  closeResultsBtn.style.display = "none";

  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.docs || data.docs.length === 0) {
        resultsDiv.innerHTML = "❌ Kitob topilmadi.";
        return;
      }

      resultsDiv.innerHTML = "<h3>📚 OpenLibrary natijalari</h3>";
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
          <a class="download-link" href="https://openlibrary.org/books/${olid}" target="_blank">🡇 Yuklab olish</a>
        `;

        resultsDiv.appendChild(card);
      });
    })
    .catch(() => {
      resultsDiv.innerHTML = "❌ Qidiruvda xatolik yuz berdi.";
    });
}

// Archive.org orqali qidiruv
function searchArchiveBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const archiveDiv = document.getElementById("archiveResults");
  const closeArchiveBtn = document.getElementById("closeArchiveBtn");

  if (!query) {
    alert("Iltimos, kitob nomini yozing.");
    return;
  }

  archiveDiv.innerHTML = "⏳ Archive.org orqali qidirilmoqda...";
  closeArchiveBtn.style.display = "none";

  fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator&output=json`)
    .then(res => res.json())
    .then(async data => {
      const docs = data.response.docs;
      if (!docs || docs.length === 0) {
        archiveDiv.innerHTML = "❌ Hech qanday natija topilmadi.";
        return;
      }

      archiveDiv.innerHTML = "<h3>📚 Archive.org natijalari</h3>";
      closeArchiveBtn.style.display = "block";

      for (let doc of docs.slice(0, 10)) {
        const id = doc.identifier;
        const title = doc.title || "Nomsiz";
        const author = doc.creator || "Muallif yo‘q";
        const pdfUrl = `https://archive.org/download/${id}/${id}.pdf`;

        // PDF mavjudligini tekshiramiz
        const exists = await checkIfPDFExists(pdfUrl);
        if (!exists) continue;

        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
          <h4>${title}</h4>
          <p>${author}</p>
          <a class="download-link" href="${pdfUrl}" target="_blank">🡇 PDF Yuklab olish</a>
        `;
        archiveDiv.appendChild(card);
      }

      if (archiveDiv.innerHTML.trim() === "<h3>📚 Archive.org natijalari</h3>") {
        archiveDiv.innerHTML += "<p>❌ PDF faylli natijalar topilmadi.</p>";
      }
    })
    .catch(() => {
      archiveDiv.innerHTML = "❌ Archive qidiruvda xatolik yuz berdi.";
    });
}

// PDF mavjudligini HEAD orqali tekshirish
async function checkIfPDFExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// Yopish tugmalari
function closeOpenLibraryResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("closeResultsBtn").style.display = "none";
}

function closeArchiveResults() {
  document.getElementById("archiveResults").innerHTML = "";
  document.getElementById("closeArchiveBtn").style.display = "none";
}

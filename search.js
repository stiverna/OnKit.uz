async function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    alert("Iltimos, kitob nomini kiriting.");
    return;
  }

  resultsDiv.innerHTML = "⏳ Qidirilmoqda...";

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
    resultsDiv.innerHTML = "❌ Tarmoqda xatolik yuz berdi.";
  }
}

function downloadPDF() {
  const results = document.getElementById("results");
  if (results.innerHTML.trim() === "") {
    alert("Avval qidiruv amalga oshiring!");
    return;
  }

  const options = {
    margin: 0.5,
    filename: 'onkit-qidiruv-natijalari.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(options).from(results).save();
}

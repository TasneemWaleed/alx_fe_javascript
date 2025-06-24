// =====================
// QUOTES STORAGE SETUP
// =====================
let quotes = [];
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
  quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
  ];
  saveQuotes();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// =====================
// DISPLAY / FILTERING
// =====================
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  sessionStorage.setItem("lastQuoteIndex", randomIndex);
}

// =====================
// ADD QUOTE
// =====================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// =====================
// CREATE FORM (Task 0 Requirement)
// =====================
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// =====================
// CATEGORY DROPDOWN
// =====================
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";

  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  dropdown.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  dropdown.value = selected;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// =====================
// IMPORT / EXPORT JSON
// =====================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format");

      importedQuotes.forEach((q) => {
        if (q.text && q.category) quotes.push(q);
      });

      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// =====================
// SERVER SYNC SIMULATION (Required Name)
// =====================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const serverData = await response.json();

    const simulatedQuote = {
      text: serverData.title,
      category: "Server"
    };

    const exists = quotes.some(q => q.text === simulatedQuote.text && q.category === simulatedQuote.category);
    if (!exists) {
      quotes.push(simulatedQuote);
      saveQuotes();
      populateCategories();
      notifyUser("New quote synced from server.");
    }

  } catch (err) {
    console.error("Sync error:", err);
    notifyUser("Server sync failed.");
  }
}


function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#ffeeba";
  note.style.color = "#856404";
  note.style.border = "1px solid #ffeeba";
  note.style.padding = "8px";
  note.style.marginTop = "10px";
  note.style.borderRadius = "5px";

  document.body.appendChild(note);
  setTimeout(() => note.remove(), 5000);
}

// =====================
// INITIALIZATION
// =====================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

newQuoteBtn.addEventListener("click", showRandomQuote);

function loadLastViewedQuote() {
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = lastCategory;
  showRandomQuote();
}

createAddQuoteForm();
populateCategories();
loadLastViewedQuote();

// ✅ Periodic Server Sync (every 20 seconds)
setInterval(fetchQuotesFromServer, 20000);

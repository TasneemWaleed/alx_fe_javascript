// 🔸 Load quotes from localStorage or set default
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

// 🔸 Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 🔸 Show a random quote and store in sessionStorage
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;

  // 🔸 Save last shown quote index to sessionStorage
  sessionStorage.setItem("lastQuoteIndex", randomIndex);
}

// 🔸 Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// 🔸 Create add quote form (required by task 0)
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

// 🔸 Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty-print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 🔸 Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON structure.");
      }

      // Only add valid quotes
      importedQuotes.forEach((quote) => {
        if (quote.text && quote.category) {
          quotes.push(quote);
        }
      });

      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file. Please upload a valid quotes file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// 🔸 Load last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastIndex = sessionStorage.getItem("lastQuoteIndex");
  if (lastIndex !== null && quotes[lastIndex]) {
    const quote = quotes[lastIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  } else {
    showRandomQuote();
  }
}

// 🔸 DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// 🔸 Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// 🔸 On Load
createAddQuoteForm();
loadLastViewedQuote(); // Load session-stored quote if available

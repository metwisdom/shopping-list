let shoppingList = [];

try {
  const storedList = JSON.parse(localStorage.getItem("myShoppingList") ?? "[]");
  shoppingList = Array.isArray(storedList) ? storedList : [];
} catch {
  shoppingList = [];
}

const addForm = document.getElementById("add-form");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const shoppingListUl = document.getElementById("shopping-list");
const purchasedTotal = document.getElementById("purchased-total");
const listCountSpan = document.getElementById("list-count");
const clearListBtn = document.getElementById("clear-list");

function render() {
  let totalCost = 0;

  shoppingListUl.innerHTML = shoppingList
    .map((item, index) => {
      const price = Number(item.price) || 0;
      if (item.purchased) totalCost += price;

      return `
        <li style="${item.purchased ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
          <span>${item.name} - Ksh ${price.toFixed(2)}</span>
          <div>
            <button class="buy-btn" data-index="${index}" type="button">${item.purchased ? "Undo" : "Buy"}</button>
            <button class="edit-btn" data-index="${index}" type="button">Edit</button>
          </div>
        </li>
      `;
    })
    .join("");

  purchasedTotal.textContent = `Ksh ${totalCost.toFixed(2)}`;
  listCountSpan.textContent = `${shoppingList.length} item${shoppingList.length === 1 ? "" : "s"}`;
  clearListBtn.disabled = shoppingList.length === 0;

  localStorage.setItem("myShoppingList", JSON.stringify(shoppingList));
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = productNameInput.value.trim();
  const price = Number.parseFloat(productPriceInput.value);

  if (!name || Number.isNaN(price) || price < 0) {
    alert("Please enter a valid item name and price.");
    return;
  }

  shoppingList.push({
    name,
    price,
    purchased: false,
  });

  addForm.reset();
  productNameInput.focus();
  render();
});

clearListBtn.addEventListener("click", () => {
  shoppingList = [];
  render();
});

shoppingListUl.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const index = Number(button.dataset.index);
  if (Number.isNaN(index) || !shoppingList[index]) return;

  if (button.classList.contains("buy-btn")) {
    shoppingList[index].purchased = !shoppingList[index].purchased;
    render();
    return;
  }

  if (button.classList.contains("edit-btn")) {
    const item = shoppingList[index];
    const newName = prompt("Edit item name:", item.name)?.trim();
    const newPrice = Number.parseFloat(prompt("Edit price (KSh):", String(item.price)));

    if (newName && !Number.isNaN(newPrice) && newPrice >= 0) {
      item.name = newName;
      item.price = newPrice;
    }

    render();
  }
});

clearListBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear your whole list?")) {
    shoppingList = [];
    render();
  }
});

render();
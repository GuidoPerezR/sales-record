const $ = (element) => document.querySelector(element);

const saleAmount = $("#sale-amount");
const winAmount = $("#win-amount");
const inversionAmount = $("#inversion-amount");
const costAmount = $("#cost-amount");
const createSaleButton = $(".add-sale-button");
const createSaleModal = $("#create-sale-dialog");
const saleForm = $(".sale-form");
const saleListContent = $(".sales-list-content");
const saleFormTitle = $("#form-sale-title");
const saleFormSaleAmount = $("#form-sale-amount");
const saleFormBuyAmount = $("#form-buy-amount");
const resetButton = $("#reset-button");

const savedSaleData = JSON.parse(localStorage.getItem("saleData")) || {};
// Previniendo defaults por defecto
const saleData = {
  id: savedSaleData.id || 0,
  sales: savedSaleData.sales || [],
  saleAmount: savedSaleData.saleAmount || 0,
  winAmount: savedSaleData.winAmount || 0,
  inversionAmount: savedSaleData.inversionAmount || 0,
  costAmount: savedSaleData.costAmount || 0,
};

renderSale();

function parseDate(date) {
  // Crear objeto fecha la fecha que recibe porque al guardar en localStorage la fecha se hace string y no el objeto Date, por ende no puede acceder a sus metodos
  const saleDate = new Date(date);
  const day = String(saleDate.getDate()).padStart(2, "0");
  const month = String(saleDate.getMonth() + 1).padStart(2, "0");
  const year = String(saleDate.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function convertAmount(amount) {
  if (amount) {
    return `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return "$0.00";
  }
}

function saveData(data) {
  saleData.sales.unshift(data);
  saleData.id++;
  saleData.saleAmount += data.saleAmount;
  saleData.winAmount += data.winAmount;
  saleData.inversionAmount += data.inversionAmount;
  saleData.costAmount += data.costAmount;
  // Se setea un elemento en el LocalStorage, donde queremos que tenga el nombre de sales y el valor sera sales en formato JSON
  localStorage.setItem("saleData", JSON.stringify(saleData));
}

function deleteSale(id) {
  const index = saleData.sales.findIndex((sale) => sale.id === id);

  if (index !== -1) {
    const saleToDelete = saleData.sales[index];

    // Restar los montos del total acumulado
    saleData.saleAmount -= saleToDelete.saleAmount;
    saleData.winAmount -= saleToDelete.winAmount;
    saleData.inversionAmount -= saleToDelete.inversionAmount;
    saleData.costAmount -= saleToDelete.costAmount;

    // Eliminar del array
    saleData.sales.splice(index, 1);

    // Guardar los cambios
    localStorage.setItem("saleData", JSON.stringify(saleData));

    // Volver a renderizar
    renderSale();
  }
}

function resetData() {
  const confirmReset = confirm(
    "¿Estás seguro de que quieres borrar todos los registros y reiniciar los montos a $0.00?",
  );

  if (confirmReset) {
    saleData.id = 0;
    saleData.sales = [];
    saleData.saleAmount = 0;
    saleData.winAmount = 0;
    saleData.inversionAmount = 0;
    saleData.costAmount = 0;

    localStorage.removeItem("saleData");

    renderSale();
  }
}

if (resetButton) {
  resetButton.addEventListener("click", resetData);
}

function renderSale() {
  saleListContent.innerHTML = "";
  saleAmount.innerHTML = "";
  winAmount.innerHTML = "";
  inversionAmount.innerHTML = "";
  costAmount.innerHTML = "";

  saleAmount.insertAdjacentText(
    "afterbegin",
    convertAmount(saleData?.saleAmount),
  );
  winAmount.insertAdjacentText(
    "afterbegin",
    convertAmount(saleData?.winAmount),
  );
  inversionAmount.insertAdjacentText(
    "afterbegin",
    convertAmount(saleData?.inversionAmount),
  );
  costAmount.insertAdjacentText(
    "afterbegin",
    convertAmount(saleData?.costAmount),
  );

  const lastSales = saleData.sales;

  if (lastSales.length <= 0) {
    const emptyMessage = `<p class="empty-message">Sin ventas registradas</p>`;
    saleListContent.insertAdjacentHTML("afterbegin", emptyMessage);
  } else {
    lastSales.forEach((sale) => {
      const saleHTML = `<article class="sale-item">
                            <header class='sale-header'>
                                <p class="sale-date">${parseDate(sale.date)}</p>
                                <button class="delete-btn" data-id="${sale.id}">
                                    <svg viewBox="0 0 640 640" fill='currentColor' class='delete-icon'>
                                        <path
                                            d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z" />
                                    </svg>
                                </button>
                            </header>
                            <div class="sale-info">
                                <p class="sale-product">${sale.title}</p>
                                <p class="sale-amount">${convertAmount(sale.saleAmount)}</p>
                            </div>
                            <div class="sale-details">
                                <div class="details inversion">
                                    <p>Inversión</p>
                                    <p class="detail-text-amount">${convertAmount(sale.inversionAmount)}</p>
                                </div>
                                <div class="details win">
                                    <p>Ganancia</p>
                                    <p class="detail-text-amount">${convertAmount(sale.winAmount)}</p>
                                </div>
                                <div class="details cost">
                                    <p>Gastos</p>
                                    <p class="detail-text-amount">${convertAmount(sale.costAmount)}</p>
                                </div>
                            </div>
                        </article>`;
      saleListContent.insertAdjacentHTML("afterbegin", saleHTML);
    });
  }
}

function createSaleElement(title, buyAmount, saleAmount) {
  const winPorcentaje = 0.4;
  const costPorcentaje = 0.6;
  const differenceAmount = saleAmount - buyAmount;

  return {
    id: saleData.id,
    title,
    saleAmount,
    inversionAmount: buyAmount,
    costAmount: differenceAmount * costPorcentaje,
    winAmount: differenceAmount * winPorcentaje,
    date: new Date(),
  };
}

saleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = saleFormTitle.value.trim();
  const buyAmount = parseFloat(saleFormBuyAmount.value.trim());
  const saleAmount = parseFloat(saleFormSaleAmount.value.trim());

  if (title && buyAmount && saleAmount) {
    const saleElement = createSaleElement(title, buyAmount, saleAmount);

    saveData(saleElement);
    renderSale();
  }

  saleFormTitle.value = "";
  saleFormSaleAmount.value = "";
  saleFormBuyAmount.value = "";
  createSaleModal.close();
});

createSaleButton.addEventListener("click", () => {
  createSaleModal.showModal();
});

createSaleModal.addEventListener("click", (e) => {
  // Si al hacer click no se hace click en el modal, se cierra
  if (e.target === createSaleModal) {
    createSaleModal.close();
  }
});

saleListContent.addEventListener("click", (e) => {
  // Buscamos si el click fue dentro de un botón con clase 'delete-btn'
  // .closest() ayuda por si el usuario hizo click en el SVG o el PATH y no el botón directo
  const deleteBtn = e.target.closest(".delete-btn");

  if (deleteBtn) {
    const id = parseInt(deleteBtn.dataset.id);
    deleteSale(id);
  }
});

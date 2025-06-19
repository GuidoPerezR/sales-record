const $ = (element) => document.querySelector(element);

const saleAmount = $('#sale-amount')
const winAmount = $('#win-amount')
const inversionAmount = $('#inversion-amount')
const costAmount = $('#cost-amount')
const createSaleButton = $('.add-sale-button')
const createSaleModal = $('#create-sale-dialog')
const saleForm = $('.sale-form')
const saleListContent = $('.sales-list-content')
const saleFormTitle = $('#form-sale-title')
const saleFormSaleAmount = $('#form-sale-amount')
const saleFormBuyAmount = $('#form-buy-amount')

const saleData = JSON.parse(localStorage.getItem('saleData')) || {
    id: 0,
    sales: [],
    saleAmount: 0,
    winAmount: 0,
    inversionAmount: 0,
    costAmount: 0
}

renderSale()

function parseDate(date) {
    // Crear objeto fecha la fecha que recibe porque al guardar en localStorage la fecha se hace string y no el objeto Date, por ende no puede acceder a sus metodos 
    const saleDate = new Date(date);
    const day = String(saleDate.getDate()).padStart(2, '0');
    const month = String(saleDate.getMonth() + 1).padStart(2, '0');
    const year = String(saleDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`
}

function convertAmount(amount) {
    if (amount){
        return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else{
        return '$0.00'
    }
}

function saveData(data) {
    saleData.sales.unshift(data)
    saleData.id++
    saleData.saleAmount += data.saleAmount
    saleData.winAmount += data.winAmount
    saleData.inversionAmount += data.inversionAmount
    saleData.costAmount += data.costAmount
    // Se setea un elemento en el LocalStorage, donde queremos que tenga el nombre de sales y el valor sera sales en formato JSON
    localStorage.setItem('saleData', JSON.stringify(saleData))
}

function renderSale() {
    saleListContent.innerHTML = ''
    saleAmount.innerHTML = ''
    winAmount.innerHTML = ''
    inversionAmount.innerHTML = ''
    costAmount.innerHTML = ''

    saleAmount.insertAdjacentText('afterbegin', convertAmount(saleData?.saleAmount))
    winAmount.insertAdjacentText('afterbegin', convertAmount(saleData?.winAmount))
    inversionAmount.insertAdjacentText('afterbegin', convertAmount(saleData?.inversionAmount))
    costAmount.insertAdjacentText('afterbegin', convertAmount(saleData?.costAmount))

    // Ultimas 10 ventas
    const lastSales = saleData.sales.slice(0, 10);

    if (lastSales.length <= 0) {
        const emptyMessage = `<p class="empty-message">Sin ventas registradas</p>`
        saleListContent.insertAdjacentHTML('afterbegin', emptyMessage)
    } else {
        lastSales.forEach(sale => {
            const saleHTML = `<article class="sale-item">
                            <header>
                                <p class="sale-date">${parseDate(sale.date)}</p>
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
                                    <p>Gastos Fijos</p>
                                    <p class="detail-text-amount">${convertAmount(sale.costAmount)}</p>
                                </div>
                            </div>
                        </article>`
            saleListContent.insertAdjacentHTML('afterbegin', saleHTML)
        })
    }
}

function createSaleElement(title, buyAmount, saleAmount) {
    const winPorcentaje = 0.4
    const costPorcentaje = 0.6
    const differenceAmount = saleAmount - buyAmount

    return {
        id: saleData.id,
        title,
        saleAmount,
        inversionAmount: buyAmount,
        costAmount: differenceAmount * costPorcentaje,
        winAmount: differenceAmount * winPorcentaje,
        date: new Date()
    }
}

saleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = saleFormTitle.value.trim();
    const buyAmount = parseFloat(saleFormBuyAmount.value.trim());
    const saleAmount = parseFloat(saleFormSaleAmount.value.trim());

    if (title && buyAmount && saleAmount) {
        const saleElement = createSaleElement(title, buyAmount, saleAmount)

        saveData(saleElement)
        renderSale()
    }

    saleFormTitle.value = ''
    saleFormSaleAmount.value = ''
    saleFormBuyAmount.value = ''
    createSaleModal.close()
})

createSaleButton.addEventListener('click', () => {
    createSaleModal.showModal();
})

createSaleModal.addEventListener('click', (e) => {
    // Si al hacer click no se hace click en el modal, se cierra
    if (e.target === createSaleModal) {
        createSaleModal.close();
    }
});
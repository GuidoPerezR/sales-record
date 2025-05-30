const $ = (element) => document.querySelector(element);

const createSaleButton = $('#add-sale-button')
const saleForm = $('#create-sale-dialog')

createSaleButton.addEventListener('click', () => {
    saleForm.showModal();
})

const openPopupButton = document.getElementById('openPopup');
const closePopupButton = document.getElementById('closePopup');
const paymentPopup = document.getElementById('paymentPopup');


openPopupButton.addEventListener('click', () => {

    document.getElementById('energyConsumed').value = '50';
    document.getElementById('price').value = '15';

    paymentPopup.style.display = 'flex';
});


closePopupButton.addEventListener('click', () => {
    paymentPopup.style.display = 'none';
});

const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const energyConsumed = document.getElementById('energyConsumed').value;
    const price = document.getElementById('price').value;

    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    const cardExp = document.getElementById('cardExp').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();

    if (!cardNumber || !cardName || !cardExp || !cardCVV) {
        alert("Please fill out all payment details.");
        return;
    }

    alert("Processing Payment...");
    
    setTimeout(() => {
        alert(`Payment of $${price} for ${energyConsumed} kWh was successful!`);
        paymentPopup.style.display = 'none';
        paymentForm.reset();
        console.log("Payment processed successfully.");
    }, 1000);
});

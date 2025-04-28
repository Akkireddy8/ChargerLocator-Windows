
const openPopupButton = document.getElementById('openPopup');
const closePopupButton = document.getElementById('closePopup');
const paymentPopup = document.getElementById('paymentPopup');

let selectedRating = 0;
const reviewModal = document.getElementById('reviewModal');
const reviewTextInput = document.getElementById('reviewText');
const submitReviewBtn = document.getElementById('submitReviewBtn');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const starContainer = document.getElementById('starContainer');

var pycid, pysid;


starContainer.innerHTML = '';
for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.textContent = '★';
    star.dataset.value = i;
    star.classList.add('star');
    star.onclick = () => {
        selectedRating = i;
        updateStars(i);
    };
    starContainer.appendChild(star);
}

function updateStars(rating) {
    document.querySelectorAll('#starContainer .star').forEach(star => {
        star.classList.toggle('filled', parseInt(star.dataset.value) <= rating);
    });
}

function showReviewModal() {
    selectedRating = 0;
    updateStars(0);
    reviewTextInput.value = '';
    reviewModal.style.display = 'flex';
}

submitReviewBtn.onclick = async () => {
    const reviewText = reviewTextInput.value.trim();

    if (!selectedRating && !reviewText) {
        return alert("Please provide a rating or comment.");
    }

    submitReviewBtn.disabled = true;

    try {
        const reviewRes = await fetch('/station/api/add-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: localStorage.getItem('email'),
                stationId: pysid,
                chargerId: pycid,
                reviewText,
                rating: selectedRating
            })
        });

        const reviewResult = await reviewRes.json();
        if (reviewRes.ok) {
            alert("Thanks for your review!");
            reviewModal.style.display = 'none';
        } else {
            alert(reviewResult.message || "Failed to submit review.");
        }
        submitReviewBtn.disabled = false;
    } catch (err) {
        console.error("Review error:", err);
        alert("Error submitting review.");
    }
};

cancelReviewBtn.onclick = () => {
    reviewModal.style.display = 'none';
};



openPopupButton.addEventListener('click', () => {

    document.getElementById('energyConsumed').value = '50';
    document.getElementById('price').value = '15';

    paymentPopup.style.display = 'flex';
});


closePopupButton.addEventListener('click', () => {
    paymentPopup.style.display = 'none';
});

const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', async (event) => {
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

    try {
        const res = await fetch('/station/api/save-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: localStorage.getItem('email'),        
                stationId: pysid,
                chargerId: pycid,
                energyConsumed,
                price
            })
        });

        const result = await res.json();

        if (res.ok) {
            alert(`Payment of $${price} for ${energyConsumed} kWh was successful!`);
            paymentPopup.style.display = 'none';
            paymentForm.reset();
            showReviewModal();
        } else {
            alert(result.message || 'Failed to save payment.');
        }
    } catch (err) {
        console.error('Payment error:', err);
        alert("Server error while processing payment.");
    }
});



function showChargingModal(powerOutputKW, pricingPerKWh) {
    const modal = document.getElementById("chargingModal");
    const countdown = document.getElementById("countdown");
    let secondsLeft = 60;

    modal.style.display = "flex";
    countdown.textContent = secondsLeft;

    const timer = setInterval(() => {
        secondsLeft--;
        countdown.textContent = secondsLeft;
        if (secondsLeft <= 0) {
            clearInterval(timer);
            modal.style.display = "none";

            const energyConsumed = (powerOutputKW * 1).toFixed(2);
            const price = (energyConsumed * pricingPerKWh).toFixed(2);

            document.getElementById('energyConsumed').value = energyConsumed;
            document.getElementById('price').value = price;

            document.getElementById('paymentPopup').style.display = 'flex';
        }
    }, 1000);
}

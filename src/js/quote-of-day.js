import yourEnergy from './api/your-energy-api';
import toastManager from './api/toast-manager.js';

const today = new Date().toISOString().slice(0, 10);
const quote = document.querySelector(".blockquote-text");
const author = document.querySelector(".quote-author")

const quoteInStorage = JSON.parse(localStorage.getItem("quoteOfDay"));

if(quoteInStorage && quoteInStorage.date === today) {
    quote.innerHTML = quoteInStorage.quote;
    author.innerHTML = quoteInStorage.author; 
} else {
    yourEnergy.getQuote()
        .then((response) => {
            if(typeof response !== "string")  {
                localStorage.setItem('quoteOfDay', JSON.stringify({
                    quote: response.quote,
                    author: response.author,
                    date: today
                }))
                quote.innerHTML = response.quote;
                author.innerHTML = response.author;
            } else {
                toastManager.error('Error', response);
            }
        })
        .catch(() => {
            quote.innerHTML = "A lot of times I find that people who are blessed with the most talent don't ever develop that attitude, and the ones who aren't blessed in that way are the most competitive and have the biggest heart.";
            author.innerHTML = "Tom Brady";
        })
}

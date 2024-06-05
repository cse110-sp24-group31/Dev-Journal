const category = 'inspirational';
const apiKey = '0kYRIiEg1U21YoGtDo5eQQ==5UQuSZMfQwaOH6sT'; 
const url = `https://api.api-ninjas.com/v1/quotes?category=${category}`;
const cacheKey = 'quotesCache';
const cacheExpiryKey = 'quotesCacheExpiry';
const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

function fetchQuotes() {
    fetch(url, {
    method: 'GET',
    headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
    }
    })
    .then(response => {
        if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(result => {
        // Save the result to localStorage
        localStorage.setItem(cacheKey, JSON.stringify(result));
        // Save the current timestamp to localStorage
        localStorage.setItem(cacheExpiryKey, Date.now().toString());
        cachedData = localStorage.getItem(cacheKey);
        console.log('Using cached data:', JSON.parse(cachedData));
        document.getElementById('text').innerHTML = JSON.parse(cachedData)[0].quote;
        document.getElementById('author').innerHTML = JSON.parse(cachedData)[0].author;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}   


function getCachedQuotes() {
    let cachedData = localStorage.getItem(cacheKey);
    const cacheExpiry = localStorage.getItem(cacheExpiryKey);

    if (cachedData && cacheExpiry) {
        const expiryTime = parseInt(cacheExpiry, 10);
        if (Date.now() - expiryTime < oneDay) {
        // Cache is still valid
        console.log('Using cached data:', JSON.parse(cachedData));
        document.getElementById('text').innerHTML = JSON.parse(cachedData)[0].quote;
        document.getElementById('author').innerHTML = JSON.parse(cachedData)[0].author;
        return;
        }
    }

    // Cache is expired or doesn't exist, fetch new data
    fetchQuotes();
}

// Call the function to get quotes
getCachedQuotes();
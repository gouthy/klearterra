import './style.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const searchInput = document.getElementById('search');
const dropdown = document.getElementById('dropdown');

const url = 'https://1ffxw9qp7k.execute-api.us-east-1.amazonaws.com/api/v1/';

function fetchLatLngData(lat, lng) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${url}${lat}&${lng}`);
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.error('Error:', error);
      reject(error);
    }
  });
}

function getLatLng(callback) {
  let lat, lng;
  searchInput.addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length < 3) {
      dropdown.style.display = 'none';
      return;
    }

    const results = await provider.search({ query });

    // Clear the previous results
    dropdown.innerHTML = '';

    // Add the new results to the dropdown
    results.forEach((result) => {
      const resultElement = document.createElement('a');
      resultElement.textContent = result.label;
      resultElement.href = '#';
      resultElement.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = result.label;

        // Get the latitude and longitude of the selected address
        lat = result.y;
        lng = result.x;

        callback(lat, lng);

        dropdown.style.display = 'none';
      });
      dropdown.appendChild(resultElement);
    });

    // Show the dropdown
    dropdown.style.display = 'block';
  });

  // Hide the dropdown when the user clicks outside of it
  document.addEventListener('click', (event) => {
    if (event.target !== searchInput) {
      dropdown.style.display = 'none';
    }
  });
}

getLatLng((lat, lng) => {
  fetchLatLngData(lat, lng)
    .then((data) => {
      let circularProgress = document.querySelector(".circular-progress");
      let progressValue = document.querySelector(".progress-value");

      let progressStartValue = 0;
      let progressEndValue = Math.round(data.Score);
      let speed = 10;
      console.log(progressEndValue);
      let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}`;
        if (progressStartValue === progressEndValue) {
       
          clearInterval(progress);
        }
        circularProgress.style.background = `conic-gradient(#2EB62C ${progressStartValue * 3.6}deg,#e3e3e3 0deg)`;
      }, speed);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});





// fetch(`https://1ffxw9qp7k.execute-api.us-east-1.amazonaws.com/api/v1/${lat}&${lng}`)
// .then(response => {
//   if (!response.ok) {
//     throw new Error('Network response was not OK');
//   }
//   return response.json();
// })
// .then(data => {
//   console.log(data.Score);
// })
// .catch(error => {
//   console.error('Error:', error);
// });




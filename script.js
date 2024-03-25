// Display Countries
const urlCountry = 'https://covid-193.p.rapidapi.com/countries';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'cde8958a76mshf39865d680f2f73p1a7ea8jsn2c5550be4c25',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    }
};

try {
    fetch(urlCountry, options)
        .then(response => response.json())
        .then(result => {
            // console.log(result);
            result.response.forEach(country => {
                const markup = `<option>${country}</option>`;
                document.querySelector('#countrySelection').insertAdjacentHTML('beforeend', markup);
            });
        })
        .catch(error => {
            console.error(error);
        });

} catch (error) {
    console.error(error);
}

// Function to fetch data
async function fetchData() {
    // Hide container
    document.getElementById('placeholderContainer').style.display = 'none';

    // Get the selected country from the dropdown
    const selectedCountry = document.getElementById('countrySelection').value;

    // Call for fetchHistoryDates()
    fetchHistoryDates();

    // Set URL
    const urlData = `https://covid-193.p.rapidapi.com/statistics?country=${selectedCountry}`;
    const optData = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'cde8958a76mshf39865d680f2f73p1a7ea8jsn2c5550be4c25',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    // Ref the HTML element to display data
    const showDate = document.getElementById('showDate');
    const totalTests = document.getElementById('totalTests');
    const showCountry = document.getElementById('showCountry');
    const newCases = document.getElementById('newCases');
    const activeCases = document.getElementById('activeCases');
    const critCases = document.getElementById('critCases');
    const totalCases = document.getElementById('totalCases');
    const recoveredCases = document.getElementById('recoveredCases');
    const totalDeaths = document.getElementById('totalDeaths');
    
    try {
        const response = await fetch(urlData, optData);
        const result = await response.json();
        // console.log(result);

        if (result.response.length > 0) {
            const data = result.response[0];

            // Update the content of HTML element
            showCountry.textContent = `Real-time statistics for ${data.country}, including active cases, total cases, recoveries, and deaths.`;
            showDate.textContent = `Current data as of ${data.day}`;
            totalCases.innerHTML = `
                <h3 class="display-1" editable="inline">${data.tests.total.toLocaleString()}</h3>
                <div><b>Total Cases</b></div>
            `;
            newCases.innerHTML = `
            <div class="lc-block"><span class="display-4" editable="inline"><b>${data?.cases?.new != null ? data.cases.new.toLocaleString() : 'N/A'}</b></span>
				<div editable="rich">New Cases</div>
			</div>
            `;
            activeCases.innerHTML = `
            <span class="display-4" editable="inline"><b>${data?.cases?.active != null ? data.cases.active.toLocaleString() : 'N/A'}</b></span>
				<div editable="rich">
					<p>Active Cases </p>
				</div>
            `;
            critCases.innerHTML = `
            <span class="display-4" editable="inline"><b>${data?.cases?.critical != null ? data.cases.critical.toLocaleString() : 'N/A'}</b></span>
				<div editable="rich">Critical Cases</div>
            `;
            totalTests.innerHTML = `
            <span class="display-4" editable="inline"><b>${data?.cases?.total != null ? data.cases.total.toLocaleString() : 'N/A'}</b></span>
				<div editable="rich">
					<p>Total Tests</p>
				</div>
            `;
            recoveredCases.innerHTML = `
            <span class="display-4" editable="inline"><b>${data?.cases?.recovered != null ? data.cases.recovered.toLocaleString() : 'N/A'}</b></span>
			<div editable="rich">Recovered Cases</div>
            `;
            totalDeaths.innerHTML =
            `<div class="lc-block"><span class="display-4" editable="inline"><b>${data?.deaths?.total != null ? data.deaths.total.toLocaleString() : 'N/A'}</b></span>
				<div editable="rich">Total Deaths</div>
			</div>`
        } else {
            document.getElementById('ifNA').innerHTML = `<p>Data not available for ${selectedCountry}</p>`;
        }
    } catch (error) {
        console.error(error);
    }

}

// Function for dataTables
window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});

// Function to fetch history
async function fetchHistoryDates() {

    // Get the selected country from the dropdown
    const selectedCountry = document.getElementById('countrySelection').value;

    // Set URL Data
    const urlHistory = `https://covid-193.p.rapidapi.com/history?country=${selectedCountry}`;
    const optHistory = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'cde8958a76mshf39865d680f2f73p1a7ea8jsn2c5550be4c25',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    // Ref the HTML data to show elements
    const exData = document.getElementById('exData');

    try {
        const response = await fetch(urlHistory, optHistory);
        const result = await response.json();
        console.log('outer result', result);

        exData.innerHTML = `
        <div class="container-fluid px-4">
        <h1 class="mt-4">History Data</h1>
        <div class="card mb-4">
            <div class="card-body">
                The history data provides a chronological record of COVID-19 statistics, including confirmed cases, deaths, recoveries, and testing data, for a specific country over time.
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-table me-1"></i>
                History data for ${selectedCountry}
            </div>
            <div class="card-body table-resoponsive table-dark table-striped mx-auto d-block">
                <table id="datatablesSimple" class="table align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Total Cases</th>
                            <th>New Cases</th>
                            <th>Active Cases</th>
                            <th>Critical Cases</th>
                            <th>Total Tests</th>
                            <th class="recCases">Recovered Cases</th>
                            <th class="totalDeaths">Total Deaths</th>
                        </tr>
                    </thead>
                    <tbody id="historyData" class="table-group-divider">
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;

        console.log('length', result.response.length);

        result.response.forEach(index => {
            const markup = `
            <tr>
                <th scope="row">${index.day}</th>
                <td>${index.cases.total.toLocaleString()}</td>
                <td>${index?.cases?.new?.toLocaleString() ?? 'N/A'}</td>
                <td>${index?.cases?.active?.toLocaleString() ?? 'N/A'}</td>
                <td>${index?.cases?.critical?.toLocaleString() ?? 'N/A'}</td>
                <td>${index?.tests?.total?.toLocaleString() ?? 'N/A'}</td>
                <td class="recCases">${index?.cases?.recovered?.toLocaleString() ?? 'N/A'}</td>
                <td class="totalDeaths">${index.deaths.total.toLocaleString()}</td>
            </tr>
            `;
            document.querySelector('#historyData').insertAdjacentHTML('beforeend', markup);
        });
    } catch (error) {
        console.error(error)
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputForm").onsubmit = () => {
        SearchAlerts();
        return false;
    };
});

function SearchAlerts() {
    // User input
    let state = document.getElementById("state").value.toUpperCase();

    // Fetches alerts then builds the information into cards
    FetchAlerts(state)
        .then((events) => {
            document.getElementById("errors").innerHTML = "";

            BuildAlertCards(events);
        })
        .catch((error) => {
            document.getElementById("errors").innerHTML = error.message;
        });
}

// Gets Alert informaiton
async function FetchAlerts(state) {
    state = state.toUpperCase();
    // Test length of input
    if (state.length != 2) {
        throw new Error("Please Enter a 2 Letter State Abbreviation");
    }
    // Test if input is valid
    if (validStates.includes(state)) {
        var events;
        await fetch(`https://api.weather.gov/alerts/active?area=${state}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something went wrong");
                }
            })
            .then((aletsObject) => {
                events = aletsObject;
            });
    } else {
        throw new Error("That is not a valid state");
    }

    return events;
}

function BuildAlertCards(alerts) {
    let events = alerts.features;
    eventsHtml = "";

    for (let i = 0; i < events.length; i++) {
        let event = events[i].properties;

        eventLocations = event["areaDesc"]
            .split(";")
            .map((location) => location.trim())
            .toSorted();
        eventDescription = event["description"].split(/\*.+?\.{3}/g);

        locationsHtml = "";
        // Makes a line for every area the event effects
        eventLocations.forEach((location) => {
            locationsHtml += `<span>${location.trim()}</span>`;
        });

        let splitDescription = `<div class="hideable">
                                    <h3 class="descriptionLabel">What is Happening:</h3>
                                    <p>${eventDescription[1]}</p>
                                    <h3 class="descriptionLabel">Time in Effect:</h3>
                                    <p>${eventDescription[3]}</p>
                                    </div>`;

        let unifiedDescription = `<p class="descriptionLabel">${eventDescription[0]}</p>`;

        // Puts all the html together
        eventsHtml += `
                <div class="alertCard">
                    <div class="alertHeader row">
                        <h2 class="alertEvent">${event["event"]}</h2>
                        <h2 class="alertSeverity ${event["severity"].toLowerCase()}">
                            ${event["severity"]}
                        </h2>
                    </div>
                    <div class = "alertBody">
                        <div>
                            <h2>Affected Areas:</h2>
                            <div class="alertLocations">
                                ${locationsHtml}
                            </div>
                        </div>
                        <div class="alertDescription">
                            <h2>Description:</h2>
                            ${
                                eventDescription.length > 1 ?
                                    splitDescription
                                :   unifiedDescription
                            }
                        </div>
                    </div>
                </div>`;
    }
    if (events.length == 0) {
        eventsHtml = "No events were found";
    }

    eventsHtml = `<header><h2>${alerts.title}</h2></header>` + eventsHtml;

    document.getElementById("alerts").innerHTML = eventsHtml;
}

const validStates = [
    "AL",
    "AK",
    "AS",
    "AR",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "GU",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VI",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "MP",
    "PW",
    "FM",
    "MH",
];

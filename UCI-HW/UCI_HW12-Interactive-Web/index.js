// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $dateInput = document.querySelector("#dates");
var $cityInput = document.querySelector("#cities");
var $stateInput = document.querySelector("#states");
var $countryInput = document.querySelector("#countries");
var $shapeInput = document.querySelector("#shapes");
var $searchBtn = document.querySelector("#search");
var $loadMoreBtn = document.querySelector("#load-btn");

// Set a startingIndex and resultsPerPage variable
var startingIndex = 0;
var resultsPerPage = 50;
var ufoSearched = null

// Get a section of the dataSet array to render
var endingIndex = startingIndex + resultsPerPage;
var ufoSubset = dataSet.slice(startingIndex, endingIndex);

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// renderTable renders the ufoSubset to the tbody
function renderTableSection() {
  var $row;
  var field;
  var $cell;
  var ufo;
  var dataFields;
  for (var i = 0; i < ufoSubset.length; i++) {
    // Get get the current ufo object and its dataFields
    ufo = ufoSubset[i];
    dataFields = Object.keys(ufo);
    // Create a new row in the tbody, set the index to be i + startingIndex
    $row = $tbody.insertRow(i+startingIndex);
    for (var j = 0; j < dataFields.length; j++) {
      // For every field in the ufo object, create a new cell at set its inner text to be the current value at the current ufo's field
      field = dataFields[j];
      $cell = $row.insertCell(j);
      $cell.innerText = ufo[field];
    }
  }
}

function handleSearchButtonClick() {
  //reset the table to repopulate with searches
  $tbody.innerHTML = "";

  //reset start of array whenever searched
  startingIndex = 0;
  endingIndex = startingIndex + resultsPerPage;

  // Format the user's search by removing leading and trailing whitespace, lowercase the string
  var filterDate = $dateInput.value.trim();
  var filterCity = $cityInput.value.trim().toLowerCase();
  var filterState = $stateInput.value.trim().toLowerCase();
  var filterCountry = $countryInput.value.trim().toLowerCase();
  var filterShape = $shapeInput.value.trim().toLowerCase();

  // Set ufoSubset to an array of all ufoes whose "state" matches the filter
    ufoSearched = dataSet.filter(function(ufo) {
    var ufoDate = ufo.datetime.substring(0, filterDate.length).toLowerCase();
    var ufoCity = ufo.city.substring(0, filterCity.length).toLowerCase();
    var ufoState = ufo.state.substring(0, filterState.length).toLowerCase();
    var ufoCountry = ufo.country.substring(0, filterCountry.length).toLowerCase();
    var ufoShape = ufo.shape.substring(0, filterShape.length).toLowerCase();


    // If true, add the ufo to the ufoSubset, otherwise don't add it to ufoSubset
    if ((ufoDate === filterDate) && (ufoCity === filterCity) && (ufoState === filterState) 
    && (ufoCountry === filterCountry) && (ufoShape === filterShape)) {
      return true;
    }
    return false;
  });

  ufoSubset = ufoSearched.slice(startingIndex, endingIndex);
  renderTableSection();
}

// Add an event listener to the button, call handleButtonClick when clicked
$loadMoreBtn.addEventListener("click", handleButtonClick);

function handleButtonClick() {
  // // Increase startingIndex by 100 and render the next section of the table
  startingIndex += resultsPerPage;

  // Get a section of the dataSet array to render
  endingIndex = startingIndex + resultsPerPage;

  // Check to see if there are any more results to render
  if (ufoSearched === undefined || ufoSearched === null || ufoSearched.length <= 0) {
    ufoSubset = dataSet.slice(startingIndex, endingIndex);
    renderTableSection();

    if ((startingIndex + resultsPerPage) >= dataSet.length) {
      $loadMoreBtn.classList.add("disabled");
      $loadMoreBtn.innerText = "All AddressesLoaded";
      $loadMoreBtn.removeEventListener("click", handleButtonClick);
    }
  }
  else if (ufoSearched !== undefined || ufoSearched !== null || ufoSearched.length > 0) {
    ufoSubset = ufoSearched.slice(startingIndex, endingIndex);
    renderTableSection();

    if ((startingIndex + resultsPerPage) >= ufoSearched.length) {
      $loadMoreBtn.classList.add("disabled");
      $loadMoreBtn.innerText = "All Addresses Loaded";
      $loadMoreBtn.removeEventListener("click", handleButtonClick);
    }
  }
}

// Render the table for the first time on page load
renderTableSection();
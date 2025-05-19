// Loading the data
let table;

function renderTableRows(data) {
  const tableBody = $("#dataTable");
  tableBody.empty();

  data.forEach((row, index) => {
    const tr = $("<tr>").css("cursor", "pointer");

    tr.append(`<td>${row.Event_Type}</td>`);
    tr.append(`<td>${row.Week}</td>`);
    tr.append(`<td>${row.Date}</td>`);
    tr.append(`<td>${row.Governorate}</td>`);
    tr.append(`<td>${row.Event}</td>`);
    tr.append(`<td>${row.Source}</td>`);

    // On row click, show modal
    tr.on("click", function () {
      showRowDetails(row);
    });

    tableBody.append(tr);
  });
}

const mapFrame = document.getElementById("mapFrame");
$(document).ready(function () {
  // Show only the first 10 rows initially
  const initialData = database.slice(0, 100);
  renderTableRows(initialData);

  // Initialize DataTable
  table = $('#excelTable').DataTable({
    paging: true,
    searching: false,
    info: false
  });
  
  // Filter button handler
  $("#filter").on("change","select, input", function () {
    const filterGov = $("#filterGovernorate").val().toLowerCase();
    filteredData = database.filter(row => {
      if (filterGov === "all") return true;
      const govMatch = !filterGov || row.Governorate.toString().toLowerCase().includes(filterGov);
      return govMatch;
    });

    table.clear().draw();            // Clear DataTable
    renderTableRows(filteredData);   // Re-render
    table.rows.add($('#dataTable tr')).draw(); // Re-add filtered rows

    mapFrame.contentWindow.postMessage({ type: "updateMap", data: filteredData }, "*")
  });
});


document.getElementById('showMapBtn').addEventListener('click', () => {
  document.getElementById('tableContainer').style.display = 'none';
  document.getElementById('mapContainer').style.display = 'block';
});

document.getElementById('showTableBtn').addEventListener('click', () => {
  document.getElementById('tableContainer').style.display = 'block';
  document.getElementById('mapContainer').style.display = 'none';
});


function scrollToElementWithOffset(id, offset) {
  const element = document.getElementById(id);
  const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
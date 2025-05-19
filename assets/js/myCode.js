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
$("#filter").on("change", function () {
    const filterGov = $("#filterGovernorate").val().toLowerCase();
    const filterType = $("#filterType").val().toLowerCase();
    const startDate = $("#startDate").val(); // Assuming this is in YYYY-MM-DD format
    const endDate = $("#endDate").val();     // Assuming this is in YYYY-MM-DD format
    
    filteredData = database.filter(row => {
        // Governorate filter
        const govMatch = filterGov === "all" || 
                         !filterGov || 
                         row.Governorate.toString().toLowerCase().includes(filterGov);
        
        // Type filter
        const typeMatch = filterType === "all" || 
                          !filterType || 
                          (row.Event_Type && row.Event_Type.toString().toLowerCase().includes(filterType));
        
        // Date range filter
        let dateMatch = true;
        if (startDate && endDate && row.Date) {
            const rowDate = new Date(row.Date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            dateMatch = rowDate >= start && rowDate <= end;
        }
        
        return govMatch && typeMatch && dateMatch;
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
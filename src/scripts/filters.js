document.addEventListener('DOMContentLoaded', function() {
    const semesterSelect = document.getElementById('semester');
    const branchSelect = document.getElementById('branch');
    const filterBtn = document.getElementById('filter-btn');

    semesterSelect.addEventListener('change', function() {
        if (semesterSelect.value === '1' || semesterSelect.value === '2') {
            branchSelect.value = 'common';
            branchSelect.disabled = true;
        } else {
            branchSelect.disabled = false;
        }
    });

    filterBtn.addEventListener('click', function() {
        const year = document.getElementById('year').value;
        const semester = semesterSelect.value;
        const branch = branchSelect.value;
        const exam = document.getElementById('exam').value;
        const subject = document.getElementById('subject').value;

        // Call the function to render the PDF based on the selected filters
        renderPDF(year, semester, branch, exam, subject);
    });
});
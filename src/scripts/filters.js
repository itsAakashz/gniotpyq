document.addEventListener('DOMContentLoaded', function() {
    const semesterSelect = document.getElementById('semester');
    const branchSelect = document.getElementById('branch');
    const filterBtn = document.getElementById('filter-btn');

    semesterSelect.addEventListener('change', function() {
        if (semesterSelect.value === '1' || semesterSelect.value === '2' || semesterSelect.value === '3') {
            branchSelect.value = 'common';
            branchSelect.disabled = true;
        } else {
            branchSelect.disabled = false;
        }
    });

    filterBtn.addEventListener('click', function() {
        const year = document.getElementById('year').value;
        const yearOfStudy = semesterSelect.value;
        const branch = branchSelect.value;
        const subject = document.getElementById('subject').value;
        const exam = document.getElementById('exam').value;

        console.log('FILTERS.JS - Values being sent:', { year, yearOfStudy, branch, subject, exam });

        // Call the function to render the PDF based on the selected filters
        renderPDF(year, yearOfStudy, branch, subject, exam);
    });
});
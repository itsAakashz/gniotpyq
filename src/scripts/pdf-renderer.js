function renderPDF(year, yearOfStudy, branch, subject, exam) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfContainer.innerHTML = ''; // Clear previous content

    // Construct the URL to the PDF based on the selected filters
    let pdfUrl;

    // Convert yearOfStudy to actual folder names in your structure
    let yearPath;
    if (yearOfStudy === '1') {
        yearPath = 'year1'; // Year 1 folder
    } else if (yearOfStudy === '2') {
        yearPath = 'year3'; // Year 2 maps to year3 folder
    } else if (yearOfStudy === '3') {
        yearPath = 'year5'; // Year 3 maps to year5 folder (if exists)
    } else if (yearOfStudy === '4') {
        yearPath = 'year7'; // Year 4 maps to year7 folder (if exists)
    }

    // Handle special cases based on actual folder structure
    if (year === '2025' && yearOfStudy === '2') {
        // For 2025 Year 2 (year3 folder), PDFs are in common/subject folders
        const actualFileName = subject === 'Ds' ? 'DS.pdf' : `${subject}.pdf`;
        pdfUrl = `pdf/${year}/${yearPath}/common/${subject}/${actualFileName}`;
    } else if (branch === 'common' || yearOfStudy === '1' || yearOfStudy === '2' || yearOfStudy === '3') {
        // For common branch or Years 1,2,3 - use common structure with exam folder
        // Check if exam is properly set, if not use a default
        const examType = exam || 'Sessional_1';
        pdfUrl = `pdf/${year}/${yearPath}/common/${subject}/${examType}/${year}_${examType}_${subject}.pdf`;
    } else {
        // For specific branches in Year 4
        const examType = exam || 'Sessional_1';
        pdfUrl = `pdf/${year}/${yearPath}/${branch}/${subject}/${examType}/${year}_${examType}_${subject}.pdf`;
    }

    console.log('=== PDF RENDERER DEBUG ===');
    console.log('Input parameters:', { year, yearOfStudy, branch, subject, exam });
    console.log('Year path:', yearPath);
    console.log('Constructed PDF URL:', pdfUrl);
    console.log('========================');

    // Validation: Check if subject is actually an exam type (common mistake)
    if (['Sessional_1', 'Sessional_2', 'PUT', 'AKTU'].includes(subject)) {
        console.error('ERROR: You selected an EXAM TYPE as SUBJECT!');
        console.error('Please select a proper subject like: EVS, COA, Python, Mathematics, etc.');
        pdfContainer.innerHTML = '<div style="color: red; text-align: center; padding: 20px;"><h3>Selection Error!</h3><p>You selected an EXAM TYPE as SUBJECT.<br>Please select a proper subject like: EVS, COA, Python, Mathematics, etc.</p></div>';
        return;
    }

    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(pdf => {
        console.log('PDF loaded');

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                const viewport = page.getViewport({ scale: 1 });
                const containerWidth = pdfContainer.clientWidth;
                // Use a smaller scale - max 500px width or container width, whichever is smaller
                const maxWidth = Math.min(500, containerWidth - 40); // Reduced from 800px to 500px
                const scale = Math.min(1.2, maxWidth / viewport.width); // Reduced max scale from 1.5 to 1.2
                const scaledViewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-page-canvas';
                const context = canvas.getContext('2d');
                canvas.height = scaledViewport.height * window.devicePixelRatio;
                canvas.width = scaledViewport.width * window.devicePixelRatio;
                context.scale(window.devicePixelRatio, window.devicePixelRatio);

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext).promise.then(() => {
                    console.log('Page rendered');
                });

                // Append canvas to the PDF container to download the PDF
                pdfContainer.appendChild(canvas);
                // Add download button after all pages are rendered
                if (pageNum === pdf.numPages) {
                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download';
                    downloadButton.className = 'download-btn';
                    downloadButton.onclick = () => {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = `${year}_${exam}_${subject}.pdf`;
                    link.click();
                    };
                    pdfContainer.appendChild(downloadButton);

                    // Apply CSS to the download button
                    const style = document.createElement('style');
                    style.innerHTML = `
                    .download-btn {
                        margin-top: 10px;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    .download-btn:hover {
                        background-color: #0056b3;
                    }
                    `;
                    document.head.appendChild(style);
                }
            });
        }
    }, reason => {
        console.error(reason);
        pdfContainer.innerHTML = '<img src="../assets/searchNotFound.png"  height="300px" width="400px" alt="Search Not Found" class="not-found-image"/>';

        // Apply CSS media query
        const style = document.createElement('style');
        style.innerHTML = `
            @media (max-width: 600px) {
            .not-found-image {
                height: 300px;
                width: 250px;
            }
            }
        `;
        document.head.appendChild(style);
    });

    // Disable right-click context menu to prevent downloading
    // document.addEventListener('contextmenu', function(e) {
    //     e.preventDefault();
    // });
}

function renderPDF(year, semester, branch, exam, subject) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfContainer.innerHTML = ''; // Clear previous content

    // Construct the URL to the PDF based on the selected filters
    const pdfUrl = `../../pdf/${year}/semester${semester}/${branch}/${subject}/${exam}/${year}_${exam}_${subject}.pdf`;

    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(pdf => {
        console.log('PDF loaded');

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                const viewport = page.getViewport({ scale: 1 });
                const containerWidth = pdfContainer.clientWidth;
                const scale = containerWidth / viewport.width;
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

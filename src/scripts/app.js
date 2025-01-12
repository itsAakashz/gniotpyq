// This file contains JavaScript code to display a PDF in the web application without allowing downloads.

document.addEventListener("DOMContentLoaded", function() {
    const url = '../pdf/skills_CyberSculptor.pdf';

    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(pdf => {
        console.log('PDF loaded');

        const container = document.querySelector('.pdf-viewer');

        function renderPage(pageNum) {
            pdf.getPage(pageNum).then(page => {
                console.log('Page loaded');

                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                // Prepare canvas using PDF page dimensions
                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-page-canvas';
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext).promise.then(() => {
                    console.log('Page rendered');
                    container.appendChild(canvas);

                    // Render the next page
                    if (pageNum < pdf.numPages) {
                        renderPage(pageNum + 1);
                    }
                });
            });
        }

        // Start rendering from the first page
        renderPage(1);
    }, reason => {
        console.error(reason);
    });

    // Disable right-click context menu to prevent downloading
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});
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
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext).promise.then(() => {
                    console.log('Page rendered');
                });

                pdfContainer.appendChild(canvas);
            });
        }
    }, reason => {
        console.error(reason);
    });

    // Disable right-click context menu to prevent downloading
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

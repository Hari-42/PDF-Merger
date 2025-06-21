const fileInput = document.getElementById("pdfInput");
const dropZone = document.getElementById("dropZone");
const fileList = document.getElementById("fileList");
const mergeBtn = document.getElementById("mergeBtn");

let pdfFiles = [];

function updateList() {
    fileList.innerHTML = "";

    pdfFiles.forEach((file, index) => {
        const listItem = document.createElement("li");
        listItem.className = "bg-white p-3 mt-2 rounded-lg shadow text-gray-700 flex justify-between items-center cursor-move transition-all";
        listItem.setAttribute("draggable", "true");
        listItem.dataset.index = index;

        listItem.innerHTML = `
      <span class="flex items-center gap-2"><span class="text-gray-400">☰</span> ${file.name}</span>
      <button class="text-red-500 hover:text-red-700" onclick="removeFile(${index})">✖</button>
    `;

        listItem.addEventListener("dragstart", (e) => {
            listItem.classList.add("dragging");
            e.dataTransfer.setData("text/plain", index);
        });

        listItem.addEventListener("dragover", (e) => {
            e.preventDefault();
            listItem.classList.add("drag-over-item");
        });

        listItem.addEventListener("dragleave", () => {
            listItem.classList.remove("drag-over-item");
        });

        listItem.addEventListener("drop", (e) => {
            e.preventDefault();
            listItem.classList.remove("drag-over-item");

            const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
            const targetIndex = parseInt(listItem.dataset.index);

            if (draggedIndex !== targetIndex) {
                const moved = pdfFiles.splice(draggedIndex, 1)[0];
                pdfFiles.splice(targetIndex, 0, moved);

                // Re-render after a short delay to allow UI update
                setTimeout(updateList, 0);
            }
        });

        listItem.addEventListener("dragend", () => {
            listItem.classList.remove("dragging");
        });

        fileList.appendChild(listItem);
    });

    mergeBtn.classList.toggle("hidden", pdfFiles.length === 0);
}

function addFiles(files) {
    for (let file of files) {
        if (file.type === "application/pdf") {
            pdfFiles.push(file);
        }
    }
    updateList();
}

function removeFile(index) {
    pdfFiles.splice(index, 1);
    updateList();
}

fileInput.addEventListener("change", (e) => {
    addFiles(e.target.files);
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    addFiles(e.dataTransfer.files);
});

mergeBtn.addEventListener("click", async () => {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    for (let file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

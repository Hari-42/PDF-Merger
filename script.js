const fileInput = document.getElementById("pdfInput");
const dropZone = document.getElementById("dropZone");
const fileList = document.getElementById("fileList");

let pdfFiles = [];

function updateList(files) {
    fileList.innerHTML = [...files].map(file => `<li class="bg-white p-2 mt-2 rounded-lg shadow text-gray-700">${file.name}</li>`).join("");
    pdfFiles = [...files];
}


fileInput.onchange = (e) => updateList(e.target.files);

dropZone.ondragover = (e) => e.preventDefault();
dropZone.ondrop = (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    updateList(e.dataTransfer.files)
};

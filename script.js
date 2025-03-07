const fileInput = document.getElementById("pdfInput");
const dropZone = document.getElementById("dropZone");
const fileList = document.getElementById("fileList");

let pdfFiles = [];

function updateList() {
    fileList.innerHTML = "";
    pdfFiles.forEach((file, index) => {
        const listItem = document.createElement("li");
        listItem.className = "bg-white p-2 mt-2 rounded-lg shadow text-gray-700 flex justify-between items-center";

        listItem.innerHTML = `
            <span>${file.name}</span>
            <button class="text-red-500" onclick="removeFile(${index})">✖</button>
        `;

        fileList.appendChild(listItem);
    });
}

function addFiles(files) {
    for (let file of files) {
        pdfFiles.push(file);
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

dropZone.addEventListener("dragover", (e) => e.preventDefault());

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
});

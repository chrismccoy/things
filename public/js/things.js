import { genUploader } from "uploadthing/client";

const { uploadFiles } = genUploader({
    url: "http://localhost:3000/api/uploadthing",
    package: "@uploadthing/cli",
});

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const fileLabel = document.getElementById("file-label");
const fileSubLabel = document.getElementById("file-sublabel");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const successView = document.getElementById("success-view");
const uploadForm = document.getElementById("upload-form");
const resetBtn = document.getElementById("reset-btn");
const resultUrl = document.getElementById("result-url");

let selectedFile = null;

const handleFileSelect = (file) => {
    if (!file) return;
    selectedFile = file;
    fileLabel.innerText = file.name;
    fileSubLabel.innerText = (file.size / 1024).toFixed(1) + " KB";
    dropzone.classList.add("border-brand-500", "bg-brand-50");
    uploadBtn.disabled = false;
    uploadBtn.classList.remove("bg-slate-300", "text-slate-500");
    uploadBtn.classList.add("bg-brand-600", "text-white");
};

fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
});

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("border-brand-500", "bg-brand-50");
});

dropzone.addEventListener("dragleave", (e) => {
    if (!selectedFile) dropzone.classList.remove("border-brand-500", "bg-brand-50");
});

uploadBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    uploadBtn.disabled = true;
    uploadBtn.innerText = "Uploading...";
    progressContainer.classList.remove("hidden");

    try {
        const res = await uploadFiles("imageUploader", {
            files: [selectedFile],
            onUploadProgress: ({ progress }) => {
                progressBar.style.width = `${progress}%`;
                progressText.innerText = `${progress}%`;
            },
        });

        console.log("Upload Success:", JSON.stringify(res, null, 2));
        uploadForm.classList.add("hidden");
        successView.classList.remove("hidden");
        successView.classList.add("flex");
        resultUrl.innerText = res[0].url;
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Error: " + error.message);
        uploadBtn.disabled = false;
        uploadBtn.innerText = "Confirm Upload";
        progressContainer.classList.add("hidden");
    }
});

resetBtn.addEventListener("click", () => {
    successView.classList.add("hidden");
    successView.classList.remove("flex");
    uploadForm.classList.remove("hidden");
    selectedFile = null;
    fileInput.value = "";
    fileLabel.innerText = "Click to upload or drag & drop";
    fileSubLabel.innerText = "SVG, PNG, JPG or GIF";
    dropzone.classList.remove("border-brand-500", "bg-brand-50");
    uploadBtn.disabled = true;
    uploadBtn.innerText = "Confirm Upload";
    uploadBtn.classList.add("bg-slate-300", "text-slate-500");
    uploadBtn.classList.remove("bg-brand-600", "text-white");
    progressBar.style.width = "0%";
    progressContainer.classList.add("hidden");
});


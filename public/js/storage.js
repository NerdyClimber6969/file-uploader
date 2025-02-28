const newFolderDialog = document.querySelector("#new-folder-dialog");
const mainContent = document.querySelector("main");

function openDialog() {   
    newFolderDialog.showModal();
    mainContent.setAttribute('aria-hidden', 'true');
    newFolderDialog.querySelector("#folderName").focus();
    return;
};

function closeDialog() {
    newFolderDialog.close();
    mainContent.removeAttribute('aria-hidden');
    return;
};

function handleClickOutSideDialog(event) {
    const dialogDimensions = newFolderDialog.getBoundingClientRect();
    if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
    ) {
        closeDialog();
    };
    return;
};

document.querySelector("#add-new-folder").addEventListener("click", openDialog);
newFolderDialog.querySelector(".close-btn").addEventListener("click", closeDialog);
newFolderDialog.addEventListener("click", (event) => handleClickOutSideDialog(event));
// newFolderDialog.action = location.pathname;
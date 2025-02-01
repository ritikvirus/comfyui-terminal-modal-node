// TerminalModalNode.js
// This client-side script adds a button to the node’s UI. When clicked, it opens a modal dialog
// (sized to 50% of the screen) that functions like a terminal. Commands typed into the modal are
// sent to the backend (the Python run_command function) via the node’s call interface.

class TerminalModalNodeUI {
    constructor(node) {
        this.node = node;
        this.createButton();
    }
    
    createButton() {
        // Create a button element and append it to the node's container.
        this.button = document.createElement("button");
        this.button.innerText = "Open Terminal";
        this.button.style.padding = "8px";
        this.button.style.margin = "4px";
        this.button.onclick = () => { this.openModal(); };
        
        if(this.node && this.node.container) {
            this.node.container.appendChild(this.button);
        }
    }
    
    openModal() {
        // Create an overlay for the modal dialog.
        this.modalOverlay = document.createElement("div");
        this.modalOverlay.style.position = "fixed";
        this.modalOverlay.style.top = "0";
        this.modalOverlay.style.left = "0";
        this.modalOverlay.style.width = "100%";
        this.modalOverlay.style.height = "100%";
        this.modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
        this.modalOverlay.style.display = "flex";
        this.modalOverlay.style.justifyContent = "center";
        this.modalOverlay.style.alignItems = "center";
        this.modalOverlay.style.zIndex = "1000";
        
        // Create the modal container (50% of the screen).
        this.modalContainer = document.createElement("div");
        this.modalContainer.style.backgroundColor = "#fff";
        this.modalContainer.style.width = "50%";
        this.modalContainer.style.height = "50%";
        this.modalContainer.style.padding = "16px";
        this.modalContainer.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
        this.modalContainer.style.display = "flex";
        this.modalContainer.style.flexDirection = "column";
        
        // Header with title and close button.
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        const title = document.createElement("span");
        title.innerText = "Terminal";
        const closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.onclick = () => { this.closeModal(); };
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Output area to display command results.
        this.outputArea = document.createElement("div");
        this.outputArea.style.flex = "1";
        this.outputArea.style.marginTop = "8px";
        this.outputArea.style.padding = "8px";
        this.outputArea.style.backgroundColor = "#f0f0f0";
        this.outputArea.style.overflowY = "auto";
        this.outputArea.style.fontFamily = "monospace";
        this.outputArea.style.fontSize = "14px";
        
        // Input field and button container.
        const inputContainer = document.createElement("div");
        inputContainer.style.display = "flex";
        inputContainer.style.marginTop = "8px";
        
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.flex = "1";
        this.inputField.style.padding = "8px";
        this.inputField.placeholder = "Enter command...";
        
        const submitButton = document.createElement("button");
        submitButton.innerText = "Run";
        submitButton.style.marginLeft = "8px";
        submitButton.onclick = () => { this.runCommand(); };
        
        inputContainer.appendChild(this.inputField);
        inputContainer.appendChild(submitButton);
        
        // Append all elements to the modal container.
        this.modalContainer.appendChild(header);
        this.modalContainer.appendChild(this.outputArea);
        this.modalContainer.appendChild(inputContainer);
        this.modalOverlay.appendChild(this.modalContainer);
        document.body.appendChild(this.modalOverlay);
    }
    
    closeModal() {
        if(this.modalOverlay) {
            document.body.removeChild(this.modalOverlay);
            this.modalOverlay = null;
        }
    }
    
    runCommand() {
        const command = this.inputField.value;
        if(command.trim() === "") return;
        
        // Append the command to the output area.
        this.appendOutput("> " + command);
        
        // Call the Python backend via the node's interface.
        // (Assuming the node object has a method callPython that takes the function name and arguments.)
        if(this.node && typeof this.node.callPython === "function") {
            this.node.callPython("run_command", [command]).then((result) => {
                this.appendOutput(result);
            }).catch((err) => {
                this.appendOutput("Error: " + err);
            });
        } else {
            this.appendOutput("Backend call not available.");
        }
        
        this.inputField.value = "";
    }
    
    appendOutput(text) {
        const p = document.createElement("pre");
        p.style.margin = "0";
        p.innerText = text;
        this.outputArea.appendChild(p);
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }
}

// This registration function is assumed to be provided by ComfyUI's custom node client-side framework.
if (typeof registerCustomNodeUI === "function") {
    registerCustomNodeUI("terminal_modal_node", TerminalModalNodeUI);
}

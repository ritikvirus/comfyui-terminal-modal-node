// TerminalModalNode.js
// This client-side script creates a button on the node that opens a modal dialog
// with fixed dimensions. The modal contains a sizable output area and an input field
// where you can type and run terminal commands interactively.
class TerminalModalNodeUI {
    constructor(node) {
        this.node = node;
        this.createButton();
    }
    
    createButton() {
        // Create a button element for opening the terminal modal.
        this.button = document.createElement("button");
        this.button.innerText = "Open Terminal";
        this.button.style.padding = "10px 20px";
        this.button.style.margin = "8px";
        this.button.style.fontSize = "16px";
        this.button.onclick = () => { this.openModal(); };
        
        // Append the button to the node's container if available.
        if (this.node && this.node.container) {
            this.node.container.appendChild(this.button);
        }
    }
    
    openModal() {
        // Create an overlay that covers the full screen.
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
        
        // Create the modal container with fixed dimensions.
        this.modalContainer = document.createElement("div");
        this.modalContainer.style.backgroundColor = "#fff";
        this.modalContainer.style.width = "500px";   // Fixed width
        this.modalContainer.style.height = "500px";  // Fixed height
        this.modalContainer.style.padding = "16px";
        this.modalContainer.style.boxShadow = "0px 0px 15px rgba(0,0,0,0.5)";
        this.modalContainer.style.display = "flex";
        this.modalContainer.style.flexDirection = "column";
        
        // Header with title and close button.
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        const title = document.createElement("span");
        title.innerText = "Terminal";
        title.style.fontSize = "20px";
        title.style.fontWeight = "bold";
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.padding = "6px 12px";
        closeButton.onclick = () => { this.closeModal(); };
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Output area with fixed dimensions.
        this.outputArea = document.createElement("div");
        this.outputArea.style.width = "400px";          // Fixed width for output area
        this.outputArea.style.height = "300px";         // Fixed height for output area
        this.outputArea.style.marginTop = "12px";
        this.outputArea.style.padding = "12px";
        this.outputArea.style.backgroundColor = "#f7f7f7";
        this.outputArea.style.overflowY = "auto";
        this.outputArea.style.fontFamily = "monospace";
        this.outputArea.style.fontSize = "16px";
        this.outputArea.style.border = "1px solid #ddd";
        
        // Input container with a fixed-size input field.
        const inputContainer = document.createElement("div");
        inputContainer.style.display = "flex";
        inputContainer.style.marginTop = "12px";
        
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.width = "400px";         // Fixed width for input field
        this.inputField.style.height = "50px";         // Fixed height for input field
        this.inputField.style.padding = "12px";
        this.inputField.style.fontSize = "16px";
        this.inputField.style.border = "1px solid #ddd";
        this.inputField.placeholder = "Enter command...";
        
        const submitButton = document.createElement("button");
        submitButton.innerText = "Run";
        submitButton.style.marginLeft = "8px";
        submitButton.style.padding = "12px 20px";
        submitButton.style.fontSize = "16px";
        submitButton.onclick = () => { this.runCommand(); };
        
        inputContainer.appendChild(this.inputField);
        inputContainer.appendChild(submitButton);
        
        // Assemble modal container.
        this.modalContainer.appendChild(header);
        this.modalContainer.appendChild(this.outputArea);
        this.modalContainer.appendChild(inputContainer);
        this.modalOverlay.appendChild(this.modalContainer);
        document.body.appendChild(this.modalOverlay);
    }
    
    closeModal() {
        if (this.modalOverlay) {
            document.body.removeChild(this.modalOverlay);
            this.modalOverlay = null;
        }
    }
    
    runCommand() {
        const command = this.inputField.value;
        if (command.trim() === "") return;
        
        // Append the command to the output area.
        this.appendOutput("> " + command);
        
        // Call the Python backend via the node's interface.
        if (this.node && typeof this.node.callPython === "function") {
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
        const pre = document.createElement("pre");
        pre.style.margin = "0";
        pre.style.fontSize = "16px";
        pre.style.whiteSpace = "pre-wrap";
        pre.innerText = text;
        this.outputArea.appendChild(pre);
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }
}

// Register the custom node UI with ComfyUI's framework.
if (typeof registerCustomNodeUI === "function") {
    registerCustomNodeUI("terminal_modal_node", TerminalModalNodeUI);
}

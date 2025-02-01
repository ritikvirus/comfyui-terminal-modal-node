# Terminal Modal Node for ComfyUI

This repository provides a custom node that adds a button to open an interactive modal terminal dialog. The modal appears at 50% of your screen size and lets you type and run shell commands in a persistent Bash session. The output is displayed in the dialog, much like an Ubuntu terminal.

## Features

- **Modal Interface:** A button in the node UI opens a modal terminal.
- **Persistent Shell:** The backend starts an interactive Bash session that persists between commands.
- **Interactive Execution:** Type commands, hit “Run,” and see output dynamically.
- **Easy Installation:** Install via ComfyUI Manager using this repository’s Git URL.

## Installation

1. In ComfyUI Manager, go to **Custom Nodes Manager**.
2. Paste the Git URL of this repository:  
   `https://github.com/ritikvirus/comfyui-persistent-terminal.git`
3. Install and restart ComfyUI.

## Usage

- Find the node under **Utilities/Terminal** as “Terminal Modal Node.”
- Click the **Open Terminal** button that appears.
- In the modal dialog, type your command (e.g., `ls -la`) and press **Run**.
- The terminal output will be shown in the modal. Commands can be run continuously within the same session.

## Security Notice

**Warning:** Executing arbitrary shell commands can be dangerous. Use this node only in a secure, trusted environment.

## License

This project is licensed under the MIT License.

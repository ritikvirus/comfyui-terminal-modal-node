# ComfyUI Terminal Command Node

This repository provides a custom ComfyUI node that lets you execute arbitrary terminal commands directly from the ComfyUI interface.

## Features

- **Dynamic Command Execution:** Enter any shell command in the node input.
- **Output Capture:** Returns the command output (or error) as a string.
- **Easy Integration:** Install via ComfyUI Manager using the repository's Git URL.

## Installation

1. Open the ComfyUI Manager.
2. Select the **Custom Nodes Manager**.
3. Paste this repository’s Git URL into the installation field.
4. Install the node and restart ComfyUI (refresh your browser cache if necessary).

## Usage

- Locate the node under the category **Utilities/Terminal**.
- Drag the **Terminal Command** node into your workflow.
- Enter any terminal command (e.g., `ls -la`, `df -h`) into the node’s input.
- Execute your workflow to see the output of the command.

## Security Notice

**Warning:** This node executes arbitrary shell commands on your host machine. Use it only in a secure, trusted environment.

## License

This project is licensed under the MIT License.

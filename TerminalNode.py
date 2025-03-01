import subprocess
import threading
import queue
import time

# Global variables to manage the persistent shell
_shell_process = None
_shell_lock = threading.Lock()
_output_queue = queue.Queue()

def start_shell():
    global _shell_process
    # Start an interactive bash shell, merging stderr into stdout.
    _shell_process = subprocess.Popen(
        ["bash", "-i"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=False,  # Handle binary data
        bufsize=1  # Line-buffered
    )
    # Start a daemon thread that continuously reads from the shell's stdout.
    threading.Thread(target=_read_stdout, daemon=True).start()

def _read_stdout():
    global _shell_process, _output_queue
    while True:
        line_bytes = _shell_process.stdout.readline()
        if not line_bytes:
            break
        # Decode the line with UTF-8, replacing invalid characters
        line = line_bytes.decode('utf-8', errors='replace')
        _output_queue.put(line)

class TerminalNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "command": ("STRING", {"default": ""})
            }
        }
    # This node returns a string containing the output of the executed command.
    RETURN_TYPES = ("STRING",)
    FUNCTION = "run_command"
    CATEGORY = "Utilities/Terminal"

    def run_command(self, command):
        global _shell_process, _shell_lock, _output_queue

        # Start the persistent shell if it's not already running.
        if _shell_process is None:
            start_shell()

        with _shell_lock:
            # Clear any stale output from previous commands.
            while not _output_queue.empty():
                try:
                    _output_queue.get_nowait()
                except queue.Empty:
                    break

            # Define a unique marker that signals the end of the command output.
            marker = "###CMD_END###"
            # Append the marker along with the exit code ($?) to the command.
            full_command = command.strip() + f"\necho {marker} $?\n"
            try:
                # Write the command to the shell's stdin as bytes
                _shell_process.stdin.write(full_command.encode('utf-8'))
                _shell_process.stdin.flush()
            except Exception as ex:
                return (f"Error writing to shell: {str(ex)}",)

            output_lines = []
            exit_code = None

            # Wait indefinitely until the marker line is encountered.
            while True:
                line = _output_queue.get()  # blocking read
                if marker in line:
                    # Expect a marker line like: "###CMD_END### 0"
                    parts = line.strip().split()
                    if len(parts) >= 2:
                        exit_code = parts[1]
                    else:
                        exit_code = "unknown"
                    break
                output_lines.append(line)
            output = "".join(output_lines).strip()

            # If the exit code is not zero, append an error message.
            if exit_code is not None and exit_code != "0":
                output += f"\n[Error: Command exited with code {exit_code}]"
        return (output,)

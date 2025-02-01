import subprocess
import threading
import queue
import time

# Global variables to manage a persistent bash shell.
_shell_process = None
_shell_lock = threading.Lock()
_output_queue = queue.Queue()

def start_shell():
    global _shell_process
    _shell_process = subprocess.Popen(
        ["bash", "-i"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True,
        bufsize=1  # Line-buffered
    )
    # Start a background thread to continuously read the shell output.
    threading.Thread(target=_read_stdout, daemon=True).start()

def _read_stdout():
    global _shell_process, _output_queue
    while True:
        line = _shell_process.stdout.readline()
        if not line:
            break
        _output_queue.put(line)

class TerminalModalNode:
    @classmethod
    def INPUT_TYPES(cls):
        # No direct input fields – interaction is handled via the modal UI.
        return {}
    # Although not used directly in the workflow, we define a return type.
    RETURN_TYPES = ("STRING",)
    # This is the function that is called by the client-side code.
    FUNCTION = "run_command"
    CATEGORY = "Utilities/Terminal"

    def run_command(self, command: str):
        global _shell_process, _shell_lock, _output_queue
        if _shell_process is None:
            start_shell()
        with _shell_lock:
            marker = "__CMD_END__"
            # Append a marker so we know when output is finished.
            full_command = command.strip() + f"\necho {marker}\n"
            try:
                _shell_process.stdin.write(full_command)
                _shell_process.stdin.flush()
            except Exception as ex:
                return f"Error writing to shell: {str(ex)}"
            output_lines = []
            start_time = time.time()
            # Collect output until the marker is encountered.
            while True:
                try:
                    line = _output_queue.get(timeout=1)
                except queue.Empty:
                    if time.time() - start_time > 10:
                        output_lines.append("[Timeout waiting for command output]")
                        break
                    continue
                if marker in line:
                    break
                output_lines.append(line)
            output = "".join(output_lines).strip()
        return output

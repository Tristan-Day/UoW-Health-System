import os

def is_javascript(file) -> bool:
    return file.endswith(".js") or file.endswith(".jsx")

def scan(path) -> int:
    lines = 0

    for obj in os.scandir(path):
        if obj.is_file() and is_javascript(obj.name):
            with open(obj.path, 'r') as file:
                lines += len(file.readlines())
        
        elif obj.is_dir():
            lines += scan(obj.path)

    return lines

if __name__ == "__main__":
    print(f"Total Lines: {scan('./')}")

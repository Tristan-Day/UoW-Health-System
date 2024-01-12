import os
import threading
import subprocess

OUTPUT_FOLDER = "docs"


def process(path: str, output: str):
    if "swagger.js" not in os.listdir(path):
        print(f"Directory {path} has no swagger.js file, skipping")
        return

    if subprocess.call("npm install", cwd=path, shell=True):
        print(f"Failed to install npm pages in '{path}'")
        return

    if subprocess.call("npm run swagger", cwd=path, shell=True):
        print(f"Error running 'npm swagger' in '{path}'")
        return

    service = path.split("\\")[-2]

    if subprocess.call(
        f'swagger-markdown -i swagger-output.json -o "{output}\\{service}.md"',
        cwd=path,
        shell=True,
    ):
        print(f"Error running 'swagger-markdown' in '{path}'")
        return


def index():
    threads = []

    for obj in os.scandir(".\\amplify\\backend\\function"):
        if obj.is_dir() and "Function" in obj.name:
            threads.append(
                threading.Thread(
                    target=lambda path, output: process(path, output),
                    args=[obj.path + "\\src", os.getcwd() + f"\\{OUTPUT_FOLDER}"],
                )
            )

    [thread.start() for thread in threads]
    [thread.join() for thread in threads]


def main():
    if "amplify" not in os.listdir("./"):
        print("This script must be run from the project root")
        quit(-1)

    if subprocess.call("swagger-markdown -v", shell=True) != 0:
        os.system("npm -g install swagger-markdown")

    if "docs" not in os.listdir("./"):
        os.mkdir(f"./{OUTPUT_FOLDER}")
    else:
        print("Removing existing files")
        for obj in os.scandir(f"./{OUTPUT_FOLDER}"):
            if obj.is_file() and ".md" in obj.name:
                os.remove(obj.path)

    index()


if __name__ == "__main__":
    main()

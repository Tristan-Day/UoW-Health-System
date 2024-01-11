import os
import subprocess

OUTPUT_FOLDER = "docs"


def process(path: str, output: str):
    if "swagger.js" not in os.listdir(path):
        print(f"Directory {path} has no swagger.js file, skipping")
        return
    
    if subprocess.call("npm install", cwd=path, shell=True):
        print(f"Failed to install npm pages in '{path}'")
        return

    try:
        subprocess.call("npm run swagger", cwd=path, shell=True)
    except:
        print(f"Error running 'npm swagger' in '{path}'")
        return

    service = path.split("\\")[-2]

    try:
        subprocess.call(
            f'swagger-markdown -i swagger-output.json -o "{output}\\{service}.md"',
            cwd=path,
            shell=True,
        )
    except:
        print(f"Error running 'swagger-markdown' in '{path}'")
        return


def index():
    for obj in os.scandir(".\\amplify\\backend\\function"):
        if obj.is_dir() and "Function" in obj.name:
            process(obj.path + "\\src", os.getcwd() + f"\\{OUTPUT_FOLDER}")

def main():
    if "amplify" not in os.listdir("./"):
        print("This script must be run from the project root")
        quit(-1)

    if subprocess.call("swagger-markdown -v", shell=True) != 0:
        os.system("npm -g install swagger-markdown")

    if "docs" not in os.listdir("./"):
        os.mkdir(f"./{OUTPUT_FOLDER}")

    index()


if __name__ == "__main__":
    main()

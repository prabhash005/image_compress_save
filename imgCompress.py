import os
from PIL import Image

def is_image_file(filename):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
    return any(filename.lower().endswith(ext) for ext in image_extensions)

def resize_and_save_image(source_path, destination_path, max_width=1024, max_height=1024):
    try:
        img = Image.open(source_path)

        img.thumbnail((max_width, max_height))

        img.save(destination_path, format=img.format)

        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def copy_and_resize_images(source_folder, destination_folder, max_width=1024, max_height=1024):
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    for root, dirs, files in os.walk(source_folder):
        for file in files:
            source_path = os.path.join(root, file)
            if is_image_file(file):
                relative_path = os.path.relpath(source_path, source_folder)
                destination_path = os.path.join(destination_folder, relative_path)

                os.makedirs(os.path.dirname(destination_path), exist_ok=True)

                if resize_and_save_image(source_path, destination_path, max_width, max_height):
                    print(f"Resized and saved: {destination_path}")

if __name__ == "__main__":
    source_folder = "folder1"
    destination_folder = "Destination"
    max_width = 1024  
    max_height = 1024 
    copy_and_resize_images(source_folder, destination_folder, max_width, max_height)

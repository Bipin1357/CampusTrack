import re
import os

def main():
    try:
        with open('backup-campustrack-landing.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print("Error reading file:", e)
        return

    # Extract CSS
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if style_match:
        os.makedirs('src', exist_ok=True)
        with open('src/index.css', 'w', encoding='utf-8') as f:
            f.write(style_match.group(1).strip())
        print("Successfully extracted index.css")
    else:
        print("No style block found")

if __name__ == '__main__':
    main()

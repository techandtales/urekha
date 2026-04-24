import base64
import re

with open('e:/PROJECTS/urekhaoldnewback/urekhafrontend/public/logo.svg', 'r') as f:
    content = f.read()

match = re.search(r'xlink:href="data:image/png;base64,([^"]+)"', content)
if match:
    img_data = base64.b64decode(match.group(1))
    with open('e:/PROJECTS/urekhaoldnewback/urekhafrontend/public/logo_from_svg.png', 'wb') as f:
        f.write(img_data)
    print("Success: logo_from_svg.png created")
else:
    print("Error: Could not find base64 image in SVG")

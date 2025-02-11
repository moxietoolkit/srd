import os
import re
import argparse

# WHAT IS THIS FILE?
#
#   It generates the content of "content/*/srd.md" files, 
#   based on a template placed inside the pre-created file.
#   
#   This template should contain ONE top level header.
#   Each sub-header, Pascal Cased, should match a file in its directory, kebab-cased.
#
#   Example: srd.md    Matches:
#       # Header           /content  
#       ## Sub Header          /header
#                                  /srd.md
#                                  /sub-header.md
#
#   Each sub-header in the template is then replaced with the contents of the directory that matches.
#   Pass --ignore-top-level to generate an srd.md file with multiple top level headers (template must match).
#   
#       signed, Pedro Gaya.


root_dir = os.path.dirname(os.path.abspath(__file__))
content_dir = os.path.join(root_dir, "content")

def to_kebab_case(s):
    s = re.sub(r"[\s_]+", "-", s.lower())
    s = re.sub(r"[^a-z0-9-]", "", s)
    return s

def remove_html_comments(content):
    return re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)

def update_headers(content, level_increase=1):
    if level_increase == 0:
        return content

    def replace_header(match):
        header_level = len(match.group(1))
        new_header_level = min(header_level + level_increase, 6)
        return f"{'#' * new_header_level} {match.group(2)}"

    return re.sub(r"^(#{1,6})\s+(.*)", replace_header, content, flags=re.MULTILINE)

parser = argparse.ArgumentParser()
parser.add_argument(
    "--ignore-top-level",
    action="store_true",
    help="Ignore the top-level header rule, allowing multiple top-level headers.",
)
args = parser.parse_args()

level_increase = 0 if args.ignore_top_level else 1

def process_directory(directory_path, level_increase):
    srd_file = os.path.join(directory_path, "srd.md")
    if not os.path.exists(srd_file):
        print(f"No srd.md found in {directory_path}. Skipping.")
        return

    with open(srd_file, "r", encoding="utf-8") as file:
        srd_content = file.read()

    def process_srd(content, level_increase):
        lines = content.splitlines()
        processed_lines = []

        for line in lines:
            if line.startswith("## "):
                section_name = line[3:].strip()
                kebab_case_name = to_kebab_case(section_name)
                section_file = os.path.join(directory_path, f"{kebab_case_name}.md")

                if os.path.exists(section_file):
                    with open(section_file, "r", encoding="utf-8") as file:
                        file_content = file.read()
                    file_content = remove_html_comments(file_content)
                    processed_lines.append(update_headers(file_content, level_increase))
                else:
                    processed_lines.append(line)
            else:
                processed_lines.append(line)

        return "\n".join(processed_lines)

    new_srd_content = process_srd(srd_content, level_increase)
    with open(srd_file, "w", encoding="utf-8") as file:
        file.write(new_srd_content)
    print(f"SRD file updated for {directory_path}.")

for dir_name in os.listdir(content_dir):
    dir_path = os.path.join(content_dir, dir_name)
    if os.path.isdir(dir_path):
        process_directory(dir_path, level_increase)
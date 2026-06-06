import os

file_path = r"c:\Users\MOHAM\Project\Jobito\Web\Jobito\src\Subject to\Home\JobCard\JobCard.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the mess up from multi_replace
content = content.replace('t("عمل حر")', 't("تقدم الآن")') # Fix the wrong replace for Apply
content = content.replace('t("General")', 't("عام")')
content = content.replace('t("Freelance")', 't("عمل حر")')
content = content.replace('t("Show all jobs")} →', 't("عرض جميع الوظائف")} ←')
content = content.replace('t("عرض جميع الوظائف")} →', 't("عرض جميع الوظائف")} ←')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("JobCard Translation fixed successfully!")

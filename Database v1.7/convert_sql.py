import re

with open('d:/azumaa/Database v1.7/hungrygrocerydelivery.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Clean MySQL syntax
sql = re.sub(r'SET SQL_MODE[^;]*;', '', sql, flags=re.IGNORECASE)
sql = re.sub(r'SET time_zone[^;]*;', '', sql, flags=re.IGNORECASE)
sql = re.sub(r'/\*!40101[^\*]*\*/;', '', sql)
sql = re.sub(r'ENGINE=InnoDB[^;]*;', ';', sql, flags=re.IGNORECASE)
sql = re.sub(r'DEFAULT CHARSET=\w+', '', sql, flags=re.IGNORECASE)
sql = re.sub(r'COLLATE\s*=\s*\w+', '', sql, flags=re.IGNORECASE)
sql = re.sub(r'COLLATE\s+\w+', '', sql, flags=re.IGNORECASE)
sql = re.sub(r'CHARACTER SET\s+\w+', '', sql, flags=re.IGNORECASE)

sql = re.sub(r'`id` int\(\d+\) NOT NULL AUTO_INCREMENT', '`id` SERIAL PRIMARY KEY', sql, flags=re.IGNORECASE)
sql = re.sub(r'int\(\d+\)', 'INTEGER', sql, flags=re.IGNORECASE)
sql = re.sub(r'longtext', 'TEXT', sql, flags=re.IGNORECASE)
sql = re.sub(r'float', 'DOUBLE PRECISION', sql, flags=re.IGNORECASE)
sql = re.sub(r'datetime', 'TIMESTAMP', sql, flags=re.IGNORECASE)
sql = re.sub(r'ALTER TABLE `[^`]+`[\s\n]+MODIFY `id` [^;]+;', '', sql, flags=re.IGNORECASE)

# Replace backticks
sql_pg = re.sub(r'`([^`]+)`', r'"\1"', sql)

# Add DROP TABLE IF EXISTS before CREATE TABLE
def add_drop_table(match):
    tbl_name = match.group(1)
    return f'DROP TABLE IF EXISTS "{tbl_name}" CASCADE;\nCREATE TABLE "{tbl_name}"'

sql_pg = re.sub(r'CREATE TABLE "([^"]+)"', add_drop_table, sql_pg)

# Replace "id" INTEGER NOT NULL with "id" SERIAL PRIMARY KEY
sql_pg = re.sub(r'"id" INTEGER NOT NULL', '"id" SERIAL PRIMARY KEY', sql_pg)

# Fix main_setting insert using dollar quoting
# The main_setting insert in MySQL dump looks like:
# INSERT INTO `main_setting` (`id`, `data`) VALUES
# (1, '...');
def fix_main_setting_insert(match):
    val_content = match.group(1)
    # val_content is the text inside single quotes
    # Unescape MySQL escapes
    clean = val_content.replace(r"\'", "'").replace(r'\"', '"').replace(r'\\', '\\')
    return f'INSERT INTO "main_setting" ("id", "data") VALUES (1, $main_setting_data${clean}$main_setting_data$);'

# Match INSERT INTO "main_setting" ... VALUES \n (1, '...');
sql_pg = re.sub(r'INSERT INTO "main_setting"\s*\("id",\s*"data"\)\s*VALUES\s*\(\s*1,\s*\'(.*)\'\s*\);', fix_main_setting_insert, sql_pg, flags=re.DOTALL)

with open('d:/azumaa/Database v1.7/supabase_schema.sql', 'w', encoding='utf-8') as f:
    f.write("-- Supabase PostgreSQL Migration File\n")
    f.write("-- Converted from MySQL hungrygrocerydelivery.sql\n\n")
    f.write(sql_pg)

print("Updated supabase_schema.sql successfully.")

import re

def convert_mysql_to_postgres(mysql_sql_path, postgres_sql_path):
    with open(mysql_sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        sql = f.read()

    # Clean MySQL directives
    sql = re.sub(r'SET SQL_MODE[^;]*;', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'SET time_zone[^;]*;', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'/\*!40101[^\*]*\*/;', '', sql)
    sql = re.sub(r'ENGINE=InnoDB[^;]*;', ';', sql, flags=re.IGNORECASE)
    sql = re.sub(r'DEFAULT CHARSET=\w+', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'COLLATE\s*=\s*\w+', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'COLLATE\s+\w+', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'CHARACTER SET\s+\w+', '', sql, flags=re.IGNORECASE)

    # Convert data types
    sql = re.sub(r'`id` int\(\d+\) NOT NULL AUTO_INCREMENT', '`id` SERIAL PRIMARY KEY', sql, flags=re.IGNORECASE)
    sql = re.sub(r'int\(\d+\)', 'INTEGER', sql, flags=re.IGNORECASE)
    sql = re.sub(r'longtext', 'TEXT', sql, flags=re.IGNORECASE)
    sql = re.sub(r'float', 'DOUBLE PRECISION', sql, flags=re.IGNORECASE)
    sql = re.sub(r'datetime', 'TIMESTAMP', sql, flags=re.IGNORECASE)
    
    # Remove ALL ALTER TABLE statements (since PRIMARY KEY & SERIAL are already set in CREATE TABLE)
    sql = re.sub(r'ALTER TABLE\s+`[^`]+`[\s\S]*?;', '', sql, flags=re.IGNORECASE)

    # Replace backticks with double quotes for table & column names
    sql_pg = re.sub(r'`([^`]+)`', r'"\1"', sql)

    # Add DROP TABLE IF EXISTS before CREATE TABLE
    def add_drop_table(match):
        tbl_name = match.group(1)
        return f'DROP TABLE IF EXISTS "{tbl_name}" CASCADE;\nCREATE TABLE "{tbl_name}"'

    sql_pg = re.sub(r'CREATE TABLE "([^"]+)"', add_drop_table, sql_pg)

    # Replace "id" INTEGER NOT NULL with "id" SERIAL PRIMARY KEY
    sql_pg = re.sub(r'"id" INTEGER NOT NULL', '"id" SERIAL PRIMARY KEY', sql_pg)

    # Fix main_setting insert using dollar quoting
    def fix_main_setting_insert(match):
        val_content = match.group(1)
        # Unescape MySQL escapes
        clean = val_content.replace(r"\'", "'").replace(r'\"', '"').replace(r'\\', '\\')
        return f'INSERT INTO "main_setting" ("id", "data") VALUES (1, $main_setting_data${clean}$main_setting_data$);'

    sql_pg = re.sub(r'INSERT INTO "main_setting"\s*\("id",\s*"data"\)\s*VALUES\s*\(\s*1,\s*\'(.*)\'\s*\);', fix_main_setting_insert, sql_pg, flags=re.DOTALL)

    # Clean up empty lines and trailing comment headers
    lines = sql_pg.split('\n')
    filtered_lines = []
    for line in lines:
        if line.strip().startswith('-- Indexes for') or line.strip().startswith('-- AUTO_INCREMENT for'):
            continue
        filtered_lines.append(line)
        
    final_sql = "\n".join(filtered_lines)

    with open(postgres_sql_path, 'w', encoding='utf-8') as f:
        f.write("-- Supabase PostgreSQL Migration File\n")
        f.write("-- Converted from MySQL hungrygrocerydelivery.sql\n\n")
        f.write(final_sql)

    print("Updated supabase_schema.sql successfully.")

if __name__ == '__main__':
    convert_mysql_to_postgres('d:/azumaa/Database v1.7/hungrygrocerydelivery.sql', 'd:/azumaa/Database v1.7/supabase_schema.sql')

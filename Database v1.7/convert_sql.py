import re

def convert_mysql_to_postgres(mysql_sql_path, postgres_sql_path):
    with open(mysql_sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        sql_content = f.read()

    # Clean MySQL specific directives
    sql = re.sub(r'SET SQL_MODE[^;]*;', '', sql_content, flags=re.IGNORECASE)
    sql = re.sub(r'SET time_zone[^;]*;', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'/\*!40101[^\*]*\*/;', '', sql)
    sql = re.sub(r'ENGINE=InnoDB[^;]*;', ';', sql, flags=re.IGNORECASE)
    sql = re.sub(r'DEFAULT CHARSET=\w+', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'COLLATE\s*=\s*\w+', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'COLLATE\s+\w+', '', sql, flags=re.IGNORECASE)
    sql = re.sub(r'CHARACTER SET\s+\w+', '', sql, flags=re.IGNORECASE)
    
    # Types conversion
    sql = re.sub(r'`id` int\(\d+\) NOT NULL AUTO_INCREMENT', '`id` SERIAL PRIMARY KEY', sql, flags=re.IGNORECASE)
    sql = re.sub(r'int\(\d+\)', 'INTEGER', sql, flags=re.IGNORECASE)
    sql = re.sub(r'longtext', 'TEXT', sql, flags=re.IGNORECASE)
    sql = re.sub(r'float', 'DOUBLE PRECISION', sql, flags=re.IGNORECASE)
    sql = re.sub(r'datetime', 'TIMESTAMP', sql, flags=re.IGNORECASE)
    
    # Remove ALTER TABLE MODIFY AUTO_INCREMENT statements
    sql = re.sub(r'ALTER TABLE `[^`]+`[\s\n]+MODIFY `id` [^;]+;', '', sql, flags=re.IGNORECASE)
    # Remove ALTER TABLE ADD PRIMARY KEY if we make id SERIAL PRIMARY KEY
    
    # Convert backticks to double quotes for identifiers
    def replace_backticks(match):
        return f'"{match.group(1)}"'

    # Replace backticks in table and column names
    sql_pg = re.sub(r'`([^`]+)`', r'"\1"', sql)
    
    # Adjust PRIMARY KEY definitions inside CREATE TABLE
    lines = sql_pg.split('\n')
    out_lines = []
    
    in_create = False
    current_table = ""
    
    for line in lines:
        trimmed = line.strip()
        
        # Check CREATE TABLE
        match_table = re.search(r'CREATE TABLE "([^"]+)"', trimmed, re.IGNORECASE)
        if match_table:
            current_table = match_table.group(1)
            out_lines.append(f'DROP TABLE IF EXISTS "{current_table}" CASCADE;')
            out_lines.append(line)
            continue
            
        # If line contains "id" INTEGER NOT NULL, and no SERIAL yet, replace with SERIAL PRIMARY KEY
        if '"id" INTEGER NOT NULL' in line:
            line = line.replace('"id" INTEGER NOT NULL', '"id" SERIAL PRIMARY KEY')
            
        out_lines.append(line)
        
    final_pg = "\n".join(out_lines)
    
    # Clean up empty lines
    with open(postgres_sql_path, 'w', encoding='utf-8') as f:
        f.write("-- Supabase PostgreSQL Migration File\n")
        f.write("-- Converted from MySQL hungrygrocerydelivery.sql\n\n")
        f.write(final_pg)

    print("PostgreSQL migration script generated successfully.")

if __name__ == '__main__':
    convert_mysql_to_postgres('d:/azumaa/Database v1.7/hungrygrocerydelivery.sql', 'd:/azumaa/Database v1.7/supabase_schema.sql')

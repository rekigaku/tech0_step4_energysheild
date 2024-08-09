import sqlite3

# データベースに接続
conn = sqlite3.connect('../database/clinic_device.db')
cursor = conn.cursor()

# # テーブルの存在を確認
# cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
# tables = cursor.fetchall()

# print(tables)

# conn.close()


# PRAGMAコマンドを実行
cursor.execute("PRAGMA table_info(symptoms);")
result = cursor.fetchall()

# 結果を出力
for row in result:
    print(row)

# 接続を閉じる
conn.close()
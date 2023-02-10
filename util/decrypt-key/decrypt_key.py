# Used https://github.com/ohyicong/decrypt-chrome-passwords/blob/02b196242a631a4875ce8952f919a4be221c30f5/decrypt_chrome_password.py
import base64
import sys
from win32 import win32crypt
from Cryptodome.Cipher import AES
import json
import sqlite3
import os
import csv
import re
import argparse

parser = argparse.ArgumentParser()

parser.add_argument('--path')
parser.add_argument('--db-file')
parser.add_argument('--sql')
parser.add_argument('--csv-file')
parser.add_argument('--rows')
parser.add_argument('--decrypt-row')

args = parser.parse_args()

def get_secret_key():
    try:
        with open(args.path + "\\Local State", "r", encoding='utf-8') as f:
            local_state = f.read()
            local_state = json.loads(local_state)
        secret_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
        secret_key = secret_key[5:]
        secret_key = win32crypt.CryptUnprotectData(secret_key, None, None, None, 0)[1]
        return secret_key
    except Exception:
        return None

def decrypt_payload(cipher, payload):
    return cipher.decrypt(payload)

def generate_cipher(aes_key, iv):
    return AES.new(aes_key, AES.MODE_GCM, iv)

def decrypt_password(ciphertext, secret_key):
    try:
        initialisation_vector = ciphertext[3:15]
        encrypted_password = ciphertext[15:-16]
        cipher = generate_cipher(secret_key, initialisation_vector)
        decrypted_pass = decrypt_payload(cipher, encrypted_password)
        decrypted_pass = decrypted_pass.decode()
        return decrypted_pass
    except Exception:
        return ""


if __name__ == '__main__':
    try:
        with open(args.csv_file, mode='w', newline='', encoding='utf-8') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter=',', quoting=csv.QUOTE_ALL)
            rows = args.rows.split(',')
            csv_writer.writerow(rows)
            secret_key = get_secret_key()
            folders = [element for element in os.listdir(args.path) if re.search("^Profile*|^Default$", element) != None]
            for folder in folders:
                conn = sqlite3.connect(args.db_file)
                if (secret_key and conn):
                    cursor = conn.cursor()
                    cursor.execute(args.sql)
                    for index, row in enumerate(cursor.fetchall()):
                        if (row[0] != ""):
                            r = list(row)
                            if (args.decrypt_row):
                                decrypted_password = decrypt_password(r[int(args.decrypt_row)], secret_key)
                                r[int(args.decrypt_row)] = decrypted_password
                            csv_writer.writerow(r)
                    cursor.close()
                    conn.close()
                    os.remove(args.db_file)

    except Exception as e:
        print("Error: %s" % str(e))

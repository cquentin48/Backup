#!/usr/bin/env python
import math
import uuid

print("Environment variables generator")
print("This script will set the database name, database user name and generate a password")

# Username and database name inputs
username = input("Please set the username : ")
db_name = input("Please set the database name: ")

while True:
    try:
        password_char_count = input("Generating password. How many characters? ")
        password_char_count = int(password_char_count)
        if password_char_count < 1 :
            print("Incorrect password characters count. Must be strictly positive!")
        else:
            break
    except ValueError as _:
        print("Incorrect password chars count. Must be a number!")

# Password generated
# How many uuid.uuid4 function will be called
uuid_to_generate_count = math.ceil(password_char_count/len(str(uuid.uuid4())))
raw_password = ''.join([str(uuid.uuid4())*uuid_to_generate_count]) # Uuid string generated used for the password
password = raw_password[:password_char_count] # Generated password

# Ouput result to the file
with open('.env','w') as file:
    file.write(f'POSTGRES_USER={username}\n')
    file.write(f'POSTGRES_PASSWORD={password}\n')
    file.write(f'POSTGRES_DB={db_name}\n')
    file.write('CHANNEL_URL=channels')

# Displaying output
print("Environment variable file done! You can now launch the web service!")
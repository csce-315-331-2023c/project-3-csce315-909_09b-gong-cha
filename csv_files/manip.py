import pandas as pd
import secrets
#read in Order
import random

#create a new csv called users containing username, password, and is_manager

alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789!#$%^&*-_'
emails = ["gmail", "hotmail", "yahoo", "outlook", "tamu", "youtube", "mojang", "amongus", "team9b", "gongcha", "microsoft", "amazon"]
#randomly use the letters and numbers above, scramble them, and generate usernames and emails
only_letters = 'abcdefghijklmnopqrstuvwxyz'
only_numbers = '0123456789'

def generate_username(): #8 letter users
    username = ''
    for i in range(0, 8): 
        username += random.choice(only_letters)
    return username

def generate_num_user():
    user = ''
    for i in range(0, 8): 
        user += random.choice(only_numbers)
    return user

def generate_nums(): #4 numbers
    nums = ''
    for i in range(0, 4): 
        nums += random.choice(only_numbers)
    return nums

def generate_email():
    email = generate_username()
    email += generate_nums()
    email += '@'
    
    email_id = random.randint(0,len(emails)-1)
    email += emails[email_id]
    email += '.com'
    return email


def generate_password():
    password = ''.join(secrets.choice(alphabet) for i in range(6))  # for a 20-character password
    return password

#create a df with columns username, password, and is Manager
df = pd.DataFrame(columns = ['Username', 'Password_', 'Is_Manager'])

#generate users
for i in range(0, 60):
    df.loc[i] = [generate_email(), generate_password(), 0]
for i in range(60, 90):
    df.loc[i] = [generate_num_user(), generate_password(), 0]
for i in range(90, 100):
    df.loc[i] = [generate_num_user(), generate_password(), 1]
    
#write to csv
df.to_csv('users.csv', index=False)
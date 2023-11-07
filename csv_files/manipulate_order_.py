import pandas as pd
import random
df = pd.read_csv('Order.csv')
users = pd.read_csv('users.csv')

#create a users column, and fill it with random users based on the users.csv

size = users.shape[0]
all_orders = df.shape[0]

for i in range(0, all_orders):
    user_id = random.randint(0, size-1)
    df.loc[i, 'User'] = users.loc[user_id, 'Username']

df.to_csv('Order_NEW.csv', index=False)
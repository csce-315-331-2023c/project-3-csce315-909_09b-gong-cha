--Rollback, transaction, updates, cascade delete:
--this one is for the new database that consolidates ingredient and toppings
-- enum types
CREATE TYPE ice_type AS ENUM ('light', 'regular', 'none');
CREATE TYPE sugar_type AS ENUM ('100%', '70%', '50%', '30%', '0%');

--Clear out all old tables 
Drop TABLE IF EXISTS public.Recipe_Toppings;
DROP TABLE IF EXISTS public.Order_Item_Toppings;
DROP TABLE IF EXISTS public.Order_Item;
DROP TABLE IF EXISTS public.Recipe_Ingredient;
DROP TABLE IF EXISTS public.Order_;
DROP TABLE IF EXISTS public.Ingredient;
-- DROP TABLE IF EXISTS public.Toppings; 
DROP TABLE IF EXISTS public.Recipe;

--NEW!!! the user table
DROP TABLE IF EXISTS public.Users;

CREATE TABLE IF NOT EXISTS public.Users(
	Username varchar(128) NOT NULL,
	Password varchar(128) NOT NULL,
	Is_Manager BOOLEAN NOT NULL,
	PRIMARY KEY(Username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Users
	OWNER to postgres;


--Table: Order REQUIRES UNDERSCORE because of naming conventions in SQL
CREATE TABLE IF NOT EXISTS public.Order_(
	--new, user 
	Username varchar(128) NOT NULL REFERENCES Users(Username),
	Order_Id serial NOT NULL,
	Date_ date NOT NULL,
	Subtotal Decimal(5,2) NOT NULL,
	Tip Decimal(5,2), -- can be null
	Coupon_Code varchar(128),
	Time_ TIME NOT NULL, --added time so we can do hourly queries
	PRIMARY KEY(Order_Id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Order_
    OWNER to postgres;
	
	
--Table: Recipe
CREATE TABLE IF NOT EXISTS public.Recipe(
	Recipe_ID serial NOT NULL,
	Recipe_Name varchar(128) NOT NULL,
	Is_Slush BOOLEAN NOT NULL,
	Med_Price Decimal(5,2) NOT NULL,
	Large_Price Decimal(5,2) NOT NULL, -- this is the price for the large drink
	Recipe_Price Decimal(5,2) NOT NULL, -- this is how much it costs for us to make the drink
	PRIMARY KEY(Recipe_ID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Recipe
    OWNER to postgres;
	

--Table: Ingredient
CREATE TABLE IF NOT EXISTS public.Ingredient(
	Ingredient_ID serial NOT NULL,
	Ingredient_Name varchar(128) NOT NULL,
	Unit_Price Decimal(5,2) NOT NULL,
	Stock numeric NOT NULL,
	Minimum_Quantity numeric NOT NULL,
	isTopping boolean NOT NULL,
	PRIMARY KEY(Ingredient_ID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Ingredient
    OWNER to postgres;
	
--Table: Toppings
CREATE TABLE IF NOT EXISTS public.Toppings(
	Topping_ID serial NOT NULL,
	Topping_Name varchar(128) NOT NULL,
	Unit_Price Decimal(5,2) NOT NULL,
	Stock numeric NOT NULL,
	Minimum_Quantity numeric NOT NULL,
	PRIMARY KEY(Topping_ID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Toppings
    OWNER to postgres;

--Table: Recipe_Ingredient
CREATE TABLE IF NOT EXISTS public.Recipe_Ingredient(
	Recipe_ID serial NOT NULL REFERENCES Recipe(Recipe_ID),
	Ingredient_ID serial NOT NULL REFERENCES Ingredient(Ingredient_ID),
	Quantity_Used numeric NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Recipe_Ingredient
    OWNER to postgres;


--Table: Order_Item
CREATE TABLE IF NOT EXISTS public.Order_Item(
	--insert items
	Order_Item_Id serial NOT NULL,
	Recipe_ID serial NOT NULL REFERENCES Recipe(Recipe_ID), -- this is a link to the recipes Table
	Order_Id serial NOT NULL REFERENCES Order_(Order_ID),
	Notes varchar(128), -- this will store the toppings and other notes
	Is_Medium BOOLEAN NOT NULL,
	Ice ice_type DEFAULT 'regular',
	Sugar sugar_type DEFAULT '100%',
	Item_Price Decimal(5,2) NOT NULL,
	PRIMARY KEY(Order_Item_Id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Order_Item
    OWNER to postgres;
	
-- Alter the table to change the data type of the "Ice" column to text
ALTER TABLE public.Order_Item
ALTER COLUMN Ice TYPE TEXT;

-- Alter the table to change the data type of the "Sugar" column to text
ALTER TABLE public.Order_Item
ALTER COLUMN Sugar TYPE TEXT;


--create junction table between order item and toppings.
CREATE TABLE IF NOT EXISTS public.Order_Item_Toppings(
	Order_Item_Id serial NOT NULL REFERENCES Order_Item(Order_Item_Id),
	Ingredient_ID serial NOT NULL REFERENCES Ingredient(Ingredient_ID),
	Quantity_Used numeric NOT NULL
	-- PRIMARY KEY(Order_Item_Id, Topping_ID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Order_Item_Toppings
    OWNER to postgres;

--create junction table between recipe and toppings
CREATE TABLE IF NOT EXISTS public.Recipe_Toppings(
	Recipe_ID serial NOT NULL REFERENCES Recipe(Recipe_ID),
	Topping_ID serial NOT NULL REFERENCES Toppings(Topping_ID),
	Quantity_Used numeric NOT NULL
	-- PRIMARY KEY(Recipe_ID, Topping_ID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.Recipe_Toppings
	OWNER to postgres;

--GRANT PERMISSIONS
GRANT ALL PRIVILEGES ON Order_Item_Toppings 
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Order_Item_Toppings 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Order_Item_Toppings 
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Order_Item
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Order_Item
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Order_Item
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Recipe_Ingredient
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Recipe_Ingredient 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Recipe_Ingredient 
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Order_ 
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Order_ 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Order_ 
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Recipe 
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Recipe 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Recipe 
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Ingredient 
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Ingredient 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Ingredient 
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Toppings 
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Toppings 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Toppings 
TO csce315_909_reid_jenkins;

GRANT ALL PRIVILEGES ON Recipe_Toppings 
TO csce315_909_brenndancroteau;

GRANT ALL PRIVILEGES ON Recipe_Toppings 
TO csce315_909_antonhugo1;

GRANT ALL PRIVILEGES ON Recipe_Toppings 
TO csce315_909_reid_jenkins;
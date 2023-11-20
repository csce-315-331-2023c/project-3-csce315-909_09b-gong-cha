const url = 'http://localhost:5000';

document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isEmployee = localStorage.getItem('isEmployee');
    const isManager = localStorage.getItem('isManager');
  
    if (isLoggedIn == null) {
      localStorage.setItem('isLoggedIn', 'false');
    }
    if (isEmployee == null) {
      localStorage.setItem('isEmployee', 'false');
    }
    if (isManager == null) {
      localStorage.setItem('isManager', 'false');
    }

    insertinfo();
});

function createItem(drinkname, json) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('row', 'bg-light', 'h5');
    mainDiv.id = 'content';

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('col-1', 'pe-3');

    const image = document.createElement('img');
    image.src = 'images/teas/' + json.recipe_id + '.png';

    imageDiv.appendChild(image);

    const teaTypesDiv = document.createElement('div');
    teaTypesDiv.classList.add('col-5', 'p-4');
    teaTypesDiv.textContent = drinkname;

    const price1Div = document.createElement('div');
    price1Div.classList.add('col', 'p-4');
    price1Div.textContent = json.med_price;

    const price2Div = document.createElement('div');
    price2Div.classList.add('col', 'p-4');
    price2Div.textContent = json.large_price;

    mainDiv.appendChild(imageDiv);
    mainDiv.appendChild(teaTypesDiv);
    mainDiv.appendChild(price1Div);
    mainDiv.appendChild(price2Div);

    return mainDiv;
}

function toppingItem(name, json)
{
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('row', 'bg-light', 'h5');
    mainDiv.id = 'content';

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('col-2', 'pe-3');

    const image = document.createElement('img');
    image.src = 'images/toppings/' + json.ingredient_id + '.png';

    imageDiv.appendChild(image);

    const teaTypesDiv = document.createElement('div');
    teaTypesDiv.classList.add('col-5', 'p-4');
    teaTypesDiv.textContent = name;

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('col', 'p-4');
    priceDiv.textContent = json.unit_price;

    mainDiv.appendChild(imageDiv);
    mainDiv.appendChild(teaTypesDiv);
    mainDiv.appendChild(priceDiv);

    return mainDiv;
}

function createHeaders(name)
{
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('row', 'justify-content-evenly', 'bg-light', 'h4', 'p-1');

    const milkTeaDiv = document.createElement('div');
    milkTeaDiv.classList.add('col-6');
    milkTeaDiv.textContent = name;

    const mediumPriceDiv = document.createElement('div');
    mediumPriceDiv.classList.add('col');
    mediumPriceDiv.textContent = 'Medium Price';

    const largePriceDiv = document.createElement('div');
    largePriceDiv.classList.add('col');
    largePriceDiv.textContent = 'Large Price';

    mainDiv.appendChild(milkTeaDiv);
    mainDiv.appendChild(mediumPriceDiv);
    mainDiv.appendChild(largePriceDiv);

    return mainDiv;
}

function toppingHeader()
{
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('row', 'justify-content-evenly', 'bg-light', 'h4', 'p-1');

    const milkTeaDiv = document.createElement('div');
    milkTeaDiv.classList.add('col-7');
    milkTeaDiv.textContent = 'Toppings';

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('col');
    priceDiv.textContent = 'Price';

    mainDiv.appendChild(milkTeaDiv);
    mainDiv.appendChild(priceDiv);

    return mainDiv;
}


async function insertinfo(){
    var drinkRequest = await fetch(url + "/recipe").then((res) => res.json());
    var toppingRequest = await fetch(url + "/toppings").then((res) => res.json());

    var milkTea = document.getElementById("milk_container");
    var slushie = document.getElementById("slushie_container");
    var coffee = document.getElementById("coffee_container");
    var tea = document.getElementById("tea_container");
    var other = document.getElementById("other_container");
    var toppings = document.getElementById("toppings_container");

    //clear all the divs
    milkTea.innerHTML = "";
    slushie.innerHTML = "";
    coffee.innerHTML = "";
    tea.innerHTML = "";
    other.innerHTML = "";
    toppings.innerHTML = "";

    milkTea.appendChild(createHeaders('Milk Tea Series'));
    slushie.appendChild(createHeaders('Slush Series'));
    coffee.appendChild(createHeaders('Coffee Series'));
    tea.appendChild(createHeaders('Tea Series'));
    other.appendChild(createHeaders('Specialty Series'));
    toppings.appendChild(toppingHeader());

    //insert the json into the div
    for (var i = 0; i < drinkRequest.length; i++){
        item = createItem(drinkRequest[i].recipe_name, drinkRequest[i]);
        let name = drinkRequest[i].recipe_name;
        if(drinkRequest[i].is_slush){
            slushie.appendChild(item);
        }
        else if(name.includes("Coffee")){
            coffee.appendChild(item);
        }
        else if(name.includes("Milk")){
            milkTea.appendChild(item);
        }
        else if(name.includes("Tea")){
            tea.appendChild(item);
        }
        else{
            other.appendChild(item);
        }
    }

    for(var i = 0; i < toppingRequest.length; i++)
    {
        item = toppingItem(toppingRequest[i].ingredient_name, toppingRequest[i]);
        toppings.appendChild(item);
    }
}
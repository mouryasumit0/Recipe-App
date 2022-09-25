const mealsEl = document.getElementById('meals');
const form = document.getElementById('form');
const textEl = document.getElementById('text');
const favEl = document.getElementById('fav-meal');
const homeBtnEl = document.getElementById('home');
const popup = document.getElementById('meal-popup');
const closePopup = document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info');

var storedArray = [];
let text = '';

homeBtnEl.addEventListener("click",() => window.location.reload());

getRandomMeal();
updateFavMeal();

function handleSubmit(event) {
	mealsEl.innerHTML = "";

	if(document.getElementById('mealsList')) {
		do {
			mealsEl.removeChild(mealsList)
		} while(document.getElementById("mealsList"))
	}

	text = textEl.value;
	if(text!==''){
		getMealsBySearch(text)
	 	.then(meals => meals.forEach(meal => addMeal(meal,false)))
	} else {
		textEl.classList.add('warning');
	}

	
	 	
	event.preventDefault();
}

async function getRandomMeal() {
	const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
	const responseData = await response.json();
	const randomMeal = responseData.meals[0];

	addMeal(randomMeal,true);

}

async function getMealById(id) {
	const meal = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
	const responseData = await meal.json();
	const MealById = responseData.meals[0];

	return MealById;
}

async function getMealsBySearch(term) {
	const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
	const responseData = await response.json();
	let mealByName = responseData.meals;
	if(mealByName===null){
		console.log(mealByName);
		meals.innerHTML = `<div style="text-align: center"><h3>${text} recipe not availble.</h3></div>`

	} else{
		return mealByName;
	}	
	
}

function addMeal(mealData,random = false) {
	
	const meal = document.createElement('div');
	meal.classList.add('meal');
	meal.id='meal';

	meal.innerHTML = `<div class="meal-header">
	${random ? `<span class="random">Random Recipe</span>`:``}
		<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
					</div>
					<div class="meal-body">
						<h4>${mealData.strMeal}</h4>
						<button class="fav-btn" id="${mealData.idMeal}"><i class="fas fa-heart"></i></button>
					</div>
				</div>
			</div>
		`;
			const favBtn = meal.querySelector(".meal-body .fav-btn");
			favBtn.addEventListener("click",()=>{
						toggleFavMeal(mealData.idMeal,favBtn);
			})


		const btn = meal.querySelectorAll('.meal-header, .meal-body h4'); 
			btn.forEach(i => i.addEventListener("click", () => {
				updateMealInfo(mealData);
			}));
			
		
		mealsEl.appendChild(meal);
		getFavMeal();
		
}

function getFavMeal() {
	storedArray = JSON.parse(localStorage.getItem("ID") || "[]");

	if(storedArray !== null) {
		storedArray.forEach((favorite)=> {
			if(document.getElementById(favorite)!==null)
			document.getElementById(favorite).classList.add("active")
	});
	}
}

async function updateFavMeal() {
	storedArray = JSON.parse(localStorage.getItem("ID") || "[]");

	 storedArray.forEach((element) => {(getMealById(element)
	 	.then(id => {favMealsList(id)})
	 	.catch(error => {

	 	}) )});
}

function toggleFavMeal(mealId,favBtn){

		let id = mealId,
	    index = storedArray.indexOf(id);

	    if (!id) return;

	    if (index == -1) {
	    	storedArray.push(id);
    		favBtn.classList.add("active");
	    } else {
	    	storedArray.splice(index,1);
    		favBtn.classList.remove("active");
	    }
	    	localStorage.setItem("ID",JSON.stringify(storedArray));
	    	favEl.innerHTML="";
		updateFavMeal();	

}

function favMealsList(mealData, random = false) {
	const fav = document.createElement('li');
	fav.innerHTML =`
				<div class="favList">
				<img 
					src="${mealData.strMealThumb}" 
					alt="${mealData.strMeal}"
					/><span>${mealData.strMeal}</span>
				</div>
					<button class="clear"><i class="fas fa-window-close"></i></button>
					
				`; 

	const closeBtn = fav.querySelector('.clear');
	closeBtn.addEventListener('click', () => {
		let id = mealData.idMeal,
	    index = storedArray.indexOf(id);
		document.getElementById(id).classList.remove("active")

	    storedArray.splice(index,1);
	    localStorage.setItem("ID",JSON.stringify(storedArray));
	    favEl.innerHTML='';
	    updateFavMeal();

	})
	const favBtns = fav.querySelector('.favList')
	favBtns.addEventListener("click", () => {
				updateMealInfo(mealData);
	});
	favEl.appendChild(fav);
}

function updateMealInfo(mealData) {
	mealInfoEl.innerHTML = '';

	const mealInfo = document.createElement('div');

	const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(
                `${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`
            );
        } else {
            break;
        }
    }

	mealInfo.innerHTML = `<h1>${mealData.strMeal}</h1>
				<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
				<h3>Ingredients:</h3>
		        <ul>
		            ${ingredients
		                .map(
		                    (ing) => `
		            <li>${ing}</li>
		            `
		                )
		                .join("")}
		        </ul>
				<p>${mealData.strInstructions}</p>
        `;

	mealInfoEl.appendChild(mealInfo);

	popup.classList.remove('hidden');
	closePopup.addEventListener("click", () => {
		popup.classList.add('hidden');
	});
	
}
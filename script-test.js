const mealsdiv = document.getElementById('meals');
let favMeal = [];

fetchRandomMeal();

async function fetchRandomMeal(){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const responseData = await response.json();
    const randomMeal = responseData.meals[0];
    console.log(randomMeal)
    addMeal(randomMeal, true);
}

async function fetchMealById(id){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php?i="+id);
    const responseData = await response.json();
    return responseData.meals[0];

}

function addMeal(meal, random=true) {
    const mealEl = document.createElement('div');
    mealEl.classList.add('meal');
    mealEl.id='mealId';
    
    mealEl.innerHTML = `<div class="meal-header">
	${random ? `<span class="random">Random Recipe</span>`:``}
		<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
					</div>
					<div class="meal-body">
						<h4>${meal.strMeal}</h4>
						<button class="fav-btn" id="${meal.idMeal}"><i class="fas fa-heart"></i></button>
					</div>
				</div>
			</div>
		`;
    mealsdiv.appendChild(mealEl);

    const favBtn = mealEl.querySelector(".fav-btn");
    favBtn.addEventListener('click',()=>{
        if(!favBtn.className.includes("active")){
            favMeal.push(meal.idMeal)
        }else{
            favMeal = favMeal.filter((id)=>{
                id!==meal.idMeal
            })
        }
        favBtn.classList.toggle("active")
        addFavMealsList();
        console.log(favMeal)
    })
}

function addFavMealsList(){
    let favMealsList = [];
    favMeal.forEach((id)=>{
        fetchMealById(id)
        .then((meal)=>{
            favMealsList.push(meal)
            
        })
        .catch((error)=>{
            console.log(error)
        })
        .finally(()=>{
            console.log(favMealsList)
        })
    })

    // const fav = document.createElement('li');
    // fav.innerHTML = `
    // <div class="favList">
    // <img 
    //     src="${meal.strMealThumb}" 
    //     alt="${mealstrMeal}"
    //     /><span>${meal.strMeal}</span>
    // </div>
    //     <button class="clear"><i class="fas fa-window-close"></i></button>
        
    // `; 
    

}

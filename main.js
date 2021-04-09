// DOM selection
// TODO put every thing inside IFFe
const [rowOne , rowTwo , rowTree] = document.querySelectorAll(".seat") 
const seatElementContainer = document.querySelector("#seat")
const cinemaImages = document.querySelectorAll(".cinema img")
const cinemaContainer = document.querySelector(".cinema");
const calcBtnSubmitter = document.querySelector('button');
const calcPara = document.querySelector('#calcSum');
const calculateContainer = document.querySelector(".calculate");

// global variable
// this data should come from backend and have different component for handling functionality
const movieCast = [
    {name : "joker" , price : 200},
    { name : "toy story" , price : 165 },
    { name : "avengers", price : 69 }
]
const newSeat = [];

let activeMovie = "";
const seatsList = Array.from({ length : 48 } , (_ , index ) => ++index );


(function currentMovieHandler() {
    cinemaImages.forEach(el => {
        el.addEventListener("click" , ({ target : { dataset : { moviename } , classList } }) => {
            activeMovie = moviename;
            classList.add("img--active");
            cinemaImages.forEach(element => element.dataset.moviename !== moviename && element.classList.remove("img--active"))
            resultCalculator()
        })
    })
})();


const insertSeatToRow = (rowName , initial) => {
    seatsList.slice(0 , initial).forEach(el => {
        rowName.innerHTML += `<div style="margin:1rem 0;"><div class="seat__item--unreserved">${el}</div></div>`
    })

    let currentNumber = initial;
    return (newRow,newStep , powByTwo) => {

        seatsList.slice(currentNumber , newStep).forEach(el => {
            newRow.innerHTML += `<div style="margin:1rem 0;"><div class="seat__item--unreserved">${el}</div></div>`
        })
        currentNumber = newStep;
    }
}
const resultCalculator = () => {
    if(!newSeat.length) calculateContainer.classList.remove("calculate__active")
    else calculateContainer.classList.add("calculate__active")
    const sum = newSeat.length * movieCast.find(el => el.name === activeMovie).price;
    calcPara.textContent = `You have selected ${newSeat.length} seats for a price of $${sum}`
}

const movieSelectedChecker = () => {
    if(!activeMovie) {
        window.scrollTo({
            top : 0,
            behavior : "smooth"
        })
        cinemaContainer.classList.add("cinema__alert")
        let timer = setTimeout(() => {
            cinemaContainer.classList.remove('cinema__alert')
            clearTimeout(timer)
        } , 2000)
    }
    else return true
}

(function takeSeatHandler() {
    seatElementContainer.addEventListener('click' , ({ target : { classList , textContent} }) => {
        if(classList.contains("seat__item--unreserved") && movieSelectedChecker()) {
            classList.replace("seat__item--unreserved" , "seat__item--active")
            newSeat.push({ index :  +textContent})
            resultCalculator()
        }else if(classList.contains("seat__item--active")) {
            classList.replace("seat__item--active" , "seat__item--unreserved")
            let index = newSeat.findIndex(el => el.index === +textContent)
            newSeat.splice(index ,++index)
            resultCalculator()
        }
    })
})()
const firstStep = insertSeatToRow(rowOne , 12)
firstStep(rowTwo , 24 , true)
firstStep(rowTree , 48)


calcBtnSubmitter.addEventListener("click" , function submitHandler() {
    const result= {
        movieTitle : activeMovie,
        newReservedSeat : newSeat
    }
    alert(`this is the end result : 
            new reserved seat
    ${JSON.stringify(result)}
    `)
})
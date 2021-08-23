const timer = document.querySelector(".timer")

let minutes = 29;
let seconds = 59;


let timerid = setInterval(() => {
    timer.textContent = `${minutes} : ${seconds}`
    console.log(`${minutes} : ${seconds}`);
    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
    }
    if (minutes < 0) {
        clearInterval(timerid)
    }
}, 1000)

document.querySelector('._phone').addEventListener('input',
    function(e) {
        this.value = this.value.replace(/[^\d.]/g, '');
    }
)
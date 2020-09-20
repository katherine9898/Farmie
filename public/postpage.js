// const submitButton = document.querySelector('#postSelling');

// submitButton.addEventListener('click', _ => {
//     fetch('/marketplace', {
//         method: 'post',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({

//         })
//     })
// })

var fruits = [];

function selectFruits() {

    if (document.getElementById("mango").checked) {
        console.log(document.getElementById("mango").value);
        fruits.push(document.getElementById("mango").value);
    }

    if (document.getElementById("pomelo").checked) {
        console.log(document.getElementById("pomelo").value);
        fruits.push(document.getElementById("pomelo").value);
    }

    if (document.getElementById("coconut").checked) {
        console.log(document.getElementById("coconut").value);
        fruits.push(document.getElementById("coconut").value);
    }

    if (document.getElementById("papaya").checked) {
        console.log(document.getElementById("papaya").value);

        fruits.push(document.getElementById("papaya").value);
    }

    if (document.getElementById("longan").checked) {
        console.log(document.getElementById("longan").value);

        fruits.push(document.getElementById("longan").value);
    }

    if (document.getElementById("durian").checked) {
        console.log(document.getElementById("durian").value);
        fruits.push(document.getElementById("durian").value);
    }

    localStorage.setItem(0, fruits);
}

document.getElementById("postSelling").onclick = selectFruits;
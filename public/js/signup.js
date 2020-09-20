/**
 * This function will redirect to the home page after user sign up.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} name 
 * @param {*} email 
 * @param {*} city 
 * @param {*} country 
 * @param {*} password 
 * @param {*} passwordConfirm 
 */
const signUp = async (name, email, city, country, password, passwordConfirm) => {
    console.log(name, email, city, country, password, passwordConfirm);
    try {
        const res = await axios({
            method: 'POST',
            url: '/signup',
            data: {
                name,
                email,
                city,
                country,
                password,
                passwordConfirm
            }
        });
        if (res.data.status === 'success') {
            location.assign('/home');
        }
        console.log(res);
    } catch (err) {
        console.log(err.response.data.message);
        alert("Something wrong happens, please try again!");
    }

};

/**
 * This will invoke the the sign up function when the button is hit.
 * I was follow the tutorial on Udemy to write this code.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 */
document.querySelector('.theForm').addEventListener('submit', e => {
    //Stop the action 
    e.preventDefault();
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const city = document.getElementById("userCity").value;
    const country = document.getElementById("userCountry").value;
    const password = document.getElementById("userPassword").value;
    const passwordConfirm = document.getElementById("userPasswordConfirm").value;

    console.log(passwordConfirm);

    if (name && email && city && country && password && passwordConfirm) {
        signUp(name, email, city, country, password, passwordConfirm);
    } else {
        alert("All the fields must be filled");
    }

});
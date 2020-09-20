/**
 * This function will redirect to the home page after user sign in.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} email 
 * @param {*} password 
 */
const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: '/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            location.assign('/home');
        }
        console.log(res);
    } catch (err) {
        alert("Your email or password is not correct. Please try again!");
    }
};

/**
 * This will invoke the the log in function when the button is hit.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 */
document.getElementById("theForm2").addEventListener('submit', e => {
    //Stop the action 
    e.preventDefault();
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;

    login(email, password);
});
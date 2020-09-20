/**
 * It will redirect to the about-us page after logging out.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 */
const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/logout'
        });
        if (res.data.status == 'success') {
            location.assign('/');
        }
    } catch (error) {
        console.log(error);
        // alert("Logging out is not successful, please try again!");
    }
}

// Add event listener to the log out button.
if (document.querySelector('.nav-logout1')) {
    document.querySelector('.nav-logout1').addEventListener('click', () => {
        logout();
    });
}

// Add event listener to the log out button on medium devices and tablets.
if (document.querySelector('.nav-logout2')) {
    document.querySelector('.nav-logout2').addEventListener('click', () => {
        logout();
    });
}
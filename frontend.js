// Uncomment to log in
// async function login() {
//     const data = await axios.post('http://localhost:8000/login', {
//             username: 'ksu',
//             password:'sha'
//     });
//     localStorage.setItem('authKey', data.data.hash);
// }
// login();

//Use after log in
async function home() {
    const token = localStorage.getItem('authKey');
    const data = await axios.get('http://localhost:8000/', {
        headers: {
            authorization: `Token ${token}`
        }
    });

}
home();

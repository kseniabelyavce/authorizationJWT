const http = require("http");
const jwt = require("jsonwebtoken");

http.createServer(async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, x-requested-with, authorization");

    if (request.method === 'OPTIONS') {
        return sendResponse(response)
    }

    const body = await readFullBody(request);


    switch (request.url) {
        case "/login":
            let hash;
            let login = body.username;
            let password = body.password;
            if (login === 'ksu' && password === 'sha') {
                hash = jwt.sign({user_id: 123}, `${login}:${password}`, {expiresIn: '1m'});
                return sendResponse(response, {hash});
            } else {
                return sendResponse(response,{status: 'Error', message: 'Login or password is invalid.'}, 401 );
            }
        case "/":
            if (request.headers.authorization) {
                let token = request.headers.authorization.split(' ')[1];
                try {
                    jwt.verify(token, 'ksu:sha');
                } catch (err) {
                    return sendResponse(response,{status: 'Error', message: 'Session token is invalid'}, 401 );
                }
            } else {
                return sendResponse(response,{status: 'Error', message: 'Token is not provided'}, 401 );
            }
            return sendResponse(response, 'You\'re winner');
    }
}).listen(8000, 'localhost', () => {
    console.log(`Server is running on http://localhost:8000`);
});


function sendResponse(response, body={}, code=200) {
    response.writeHead(code);
    response.write(JSON.stringify(body));
    return response.end();
}

//Body is reading in chunks
function readFullBody(request) {

    return new Promise((resolve, reject) => {
        let body = [];

        request
            .on('data', chunk => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();
                if (body.length) {
                    resolve(JSON.parse(body));
                } else {
                    resolve({})
                }

            });
    });

}
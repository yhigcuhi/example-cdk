const app = (event) => {
    return {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true,},
        body: JSON.stringify(event)
    };
};

exports.handler = app;

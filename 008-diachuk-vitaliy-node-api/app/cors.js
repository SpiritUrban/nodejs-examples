import 'dotenv/config'

export default function (req, res, next) {
    // const allowedOrigins = [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3, process.env.ORIGIN4, "http://localhost:3000"];
    const allowedOrigins = ["http://localhost:3000"];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
};
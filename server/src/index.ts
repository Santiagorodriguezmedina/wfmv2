import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboardRoute";
import productRoutes from "./routes/productRoute"



// ROUTE IMPORTS




//CONFIGURATIONS

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors({
    origin: [
        'http://localhost:3000',  // Allow requests from localhost
        'http://13.59.6.107',
        'https://main.d15l57c0clyog.amplifyapp.com/products',
        'https://g019hmf68h.execute-api.us-east-2.amazonaws.com/prod',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],  // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
    credentials: true  // Allow cookies or other credentials
}));



//ROUTES  
app.use("/dashboard", dashboardRoutes) // http://localhost:8000/dashboard
app.use("/products", productRoutes) // http://localhost:8000/products

//SERVER
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
})
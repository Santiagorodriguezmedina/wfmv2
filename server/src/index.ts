import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboardRoute";
import productRoutes from "./routes/productRoute"
import salesRoute from "./routes/salesRoute"
import expensesRoute from "./routes/expensesRoute"



// ROUTE IMPORTS


//CONFIGURATIONS

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());




//ROUTES  
app.use("/dashboard", dashboardRoutes) // http://localhost:8000/dashboard
app.use("/products", productRoutes) // http://localhost:8000/products
app.use("/sales", salesRoute) // http://localhost:8000/sales
app.use("/expenses", expensesRoute) // http://localhost:8000/sales


//SERVER
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
})
import express from "express";
import cors from "cors";
import actorsRoute from "./routes/actors.route.js";
import structuresRoute from "./routes/structures.route.js";
import { PORT } from "./config/config.js";

const app = express();
app.use(cors({origin: "*",}));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/actors", actorsRoute);
app.use("/structures", structuresRoute);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port: ${httpServer.address().port}`);
});
httpServer.on("error", (error) => console.log(error));

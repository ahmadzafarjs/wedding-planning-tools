import app from "./app.js";
import dbConnect from "./db/dbConnect.js";

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server starts on PORT --3000");
  });
});

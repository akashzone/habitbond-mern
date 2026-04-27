
// express
const express = require("express");
const app = express();
const PORT = 5000;

// test route
app.get("/",(req,res)=>{
    res.send("Yes, root route is working.");
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static('public'));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const cors = require("cors");  // Cross-Origin Resource Sharing
app.use(cors());               

const mysql = require("mysql"); 
// import mysql from "mysql";
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // mysql username here
    password: 'bharath', // mysql password here
    database: 'carddb'
});


try {
    connection.connect()
}
catch(err) {
    console.log("error in connecting");
}

const path = require('path');
// print
app.get("/", (req, res) => {
    // res.set("Content-Type", "application/json")
    // res.json({message: "This is the main page"});
    res.sendFile(path.join(__dirname, "index.html"));
});



// insert
app.post("/cards", (req, res) => {
    if(!req.body) {
        res.status(400).send({ message: "Content empty"});
    }

    const query = "insert into cards set card_number = ?, cardholder_name = ?, card_type = ?, expiration_date = ?, cvv = ?, bank_name = ?, issuing_country = ? "; // where id = ?
    const { card_number, cardholder_name, card_type, expiration_date, cvv, bank_name, issuing_country} = req.body;

    connection.query(query, [card_number, cardholder_name, card_type, expiration_date, cvv, bank_name, issuing_country], (err, result) => {
        if(err)
            res.status(500).send({message:"Error adding cards", error: err.message});
        else
        {
            res.status(201).send({message: "Book added successfully",
                        card: {id: result.insertId, card_number, cardholder_name, card_type, expiration_date, cvv, bank_name, issuing_country} });
        }
    });
});


// getAll
app.get("/cards", (req, res) => {
    const query = "select * from cards";
    
    connection.query(query, (err, result) => {
        if(err)
            res.send({message:"Error retrieving cards", error: err.message});
        else
            res.send(result);
    });
});



// get
app.get("/cards/:id", (req, res) => {
    
    connection.query(`select * from cards where id = ${req.params.id}`, (err, result) => {
        if(err)
            res.status(500).send({message:"Error retrieving the card", error: err.message});
        else if(res.affectedRows === 0)
            res.status(404).send({message:`No card with id ${req.params.id}`});
        else
            res.status(200).send(result[0]);
    });
});


// update
app.put("/cards/:id", (req, res) => {
    if(!req.body) {
        res.status(400).send({ message: "Content empty"});
    }

    const query = "update cards set card_number = ?, cardholder_name = ?, card_type = ?, expiration_date = ?, cvv = ?, bank_name = ?, issuing_country = ? where id = ?";
    const { card_number, cardholder_name, card_type, expiration_date, cvv, bank_name, issuing_country} = req.body;

    connection.query(query, [card_number, cardholder_name, card_type, expiration_date, cvv, bank_name, issuing_country, req.params.id], (err, result) => {
        // console.log("res",result);

        if(err)
        {
            console.error('Error executing query:', err);
            res.status(500).send({message:"Error updating the card", error: err.message});
        }
        else if(res.affectedRows === 0)
            res.status(404).send({message:`No card with id ${req.params.id}`});
        else
            res.status(200).send({message: "Book updated successfully"});
    });
});


// delete
app.delete("/cards/:id", (req, res) => {

    const query = "delete from cards where id = ?";

    connection.query(query, [req.params.id], (err, result) => {
        if(err)
            res.status(500).send({message:"Error deleting the card", error: err.message});
        else if(res.affectedRows === 0)
            res.status(404).send({message:`No card with id ${req.params.id}`});
        else
            res.status(200).send({message: "Book deleted successfully"
        
        });
    });
});




const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
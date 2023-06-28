"use-strict";

require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '10mb'}));

app.post('/rezeptart', async(request, response)=>{
    console.log(`I got ${request.body.value}`);
    const fetch_response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=${request.body.value}`);
    const alle_rezepte = await fetch_response.json();
    response.json(alle_rezepte);
});

app.post('/api/rezept_instuction', async(request, response)=>{
    console.log(`I got ${request.body.value}`);
    const fetch_response = await fetch(`https://api.spoonacular.com/recipes/${request.body.value}/information?apiKey=${process.env.API_KEY}`);
    const alle_rezepte = await fetch_response.json();
    response.json(alle_rezepte);
});

app.post('/api/rezept_tabelle', async(request, response)=>{
    console.log(`I got ${request.body.value}`);
    const fetch_response = await fetch(`https://api.spoonacular.com/recipes/${request.body.value}/priceBreakdownWidget.json?apiKey=${process.env.API_KEY}`);
    const alle_rezepte = await fetch_response.json();
    response.json(alle_rezepte);
});

app.listen(3000,'localhost', ()=>{console.log("listen to Port 3000")});
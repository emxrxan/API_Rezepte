"use-strict";

class Rezept{

    option(data_value){
        return{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value: data_value})
        }
    }

    /**
     * 
     * @param {instruction aus einem Rezept} instruction 
     * erstellt und gibt alle Schritte an, wie man das Rezept kochen kann
     */
    instruction = function(instruction){
        document.querySelectorAll(".section > .instuction > .instuction_element").forEach((element)=>{element.remove()});
        document.querySelectorAll(".section:nth-child(5) > h1").forEach(element => {element.remove()});

        if(instruction.length > 0){
            document.querySelector(".section:nth-child(5)").insertAdjacentHTML("afterbegin",`<h1>Instructions</h1>`);

            instruction[0].steps.forEach(element=>{
                document.querySelector(".section > .instuction").insertAdjacentHTML("beforeend",
                    `
                    <div class="instuction_element">
                        <span class="number">${element.number}</span>
                        <p>${element.step}</p>
                    </div>
                    `
                );
            });
        } else {
            alert("We are sorry! We are currently working on expanding the recipe.");
        }
    }

    //Erste Reihe aus der Tabelle
    first_row=function(){
        document.querySelector(".section > #table > tbody").insertAdjacentHTML("afterbegin",
            `
            <tr>
                <td>Image:</td>
                <td>Amount:</td>
                <td>Name:</td>
                <td>Price:</td>
            </tr>
            `
        );
    }

    /**
     * 
     * @param {Alle Lebensmitteln aus einem Rezept} data 
     * gibt eine Tablle mit alle Lebensmitteln und ihren Mengen aus
     */
    body_row=function(data){
        data.ingredients.forEach(element=>{
            const image = `https://spoonacular.com/cdn/ingredients_100x100/${element.image}`;
            document.querySelector(".section > #table > tbody").insertAdjacentHTML("beforeend",
                `
                <tr>
                    <td><img src="${image}" alt=""></td>
                    <td>${element.amount.metric.value} ${element.amount.metric.unit}</td>
                    <td>${element.name}</td>
                    <td>$ ${((element.price)/100).toFixed(2).replace(".", ",")}</td>
                </tr>
                `
            );
        });
    }

    //Erzeigt eine letzte Reihe mit den Gesamt Kosten für das jeweilige Rezept
    last_row=function(data){
        document.querySelector(".section > #table > tbody").insertAdjacentHTML("beforeend",
            `
            <tr>
                <td></td>
                <td></td>
                <td>TotalCost:</td>
                <td>$ ${((data.totalCost)/100).toFixed(2).replace(".",",")}</td>
            </tr>
            `
        );
    }

    html_tabelle_generieren = function(data){
        document.querySelectorAll("#table tr").forEach(element=>{element.remove()});
        this.first_row(data);
        this.body_row(data);
        this.last_row(data);       
    }

    /**
     * 
     * @param {Rezept_id aus der API} id 
     * Zeigt die Tablle für das jewilige Rezept an
     */
    zeig_tabelle = async function(id){
        const response = await fetch('/api/rezept_tabelle', this.option(id));
        const data = await response.json();
        this.html_tabelle_generieren(data);
    }

    /**
     * 
     * @param {Rezept_id aus der API} rezept_id 
     * Zeigt die Tablle und instruction für das jewilige Rezept an
     */
    zeig_rezept_auswahl = async function(rezept_id){
        try{
            const response = await fetch('/api/rezept_instuction', this.option(rezept_id));
            const data = await response.json();
            this.instruction(data.analyzedInstructions);
            this.zeig_tabelle(data.id);
        } catch(error) {
            alert("I am Sorry. Server connection failed.");
        }
    }

    rezept_auswahl = function(){
        document.querySelectorAll("#auswahl_innercontainer > .recept_container").forEach(elment =>{
            elment.addEventListener("click", ()=>{
                this.zeig_rezept_auswahl(elment.querySelector("span").getAttribute("recipes_id"));
            });
        });
    }

    /**
     * 
     * @param {alle Rezpete aus der API} alle_rezepte 
     * zeigt alle Rezepte an, nach der ausgewählt wird
     */
    html_generieren = function(alle_rezepte){
        document.querySelectorAll("#auswahl_innercontainer > .recept_container").forEach((element)=>element.remove());
        alle_rezepte.results.forEach(element=>{
            document.querySelector("#auswahl_innercontainer").insertAdjacentHTML("beforeend",
                `
                <div class="recept_container">
                    <img src="${element.image}" alt="Bild von ${element.title} title="Hmm. Lecker :)">
                    <span class="recipes_name" recipes_id="${element.id}">${element.title}</span>
                </div>
                `
            );
        });
    }

    zeig_rezepte = async function(data){
        try{
            const response = await fetch('/rezeptart', this.option(data));
            const alle_rezepte = await response.json();
            this.html_generieren(alle_rezepte);
            this.rezept_auswahl(alle_rezepte);
        } catch(error){
            alert("I am sorry. Please try later again!");
        }
    }

    //Holt API Daten
    rezept_holen = function(){

        document.querySelectorAll(".section:nth-child(3) > .recept_container").forEach(elment =>{
            elment.addEventListener("click", (data)=>{
                this.zeig_rezepte((data.target.parentElement.innerText).toLowerCase());
            });
        });
    }
}
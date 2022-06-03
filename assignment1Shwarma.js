const express = require("express");
const Order = require("./assignment1Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    CHOICE : Symbol("choice"),
    SIZE:   Symbol("size"),
    TOPPINGS:   Symbol("toppings"),
    DRINKS:  Symbol("drinks"),
    DESSERT: Symbol("dessert"),
});

module.exports = class ShwarmaOrder extends Order{
    constructor(){
        super();
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sItem = "";
        this.sDessert = "";
        this.sPrice = 0;
        this.sChoice = "";
        this.sTotalBill = 0;
        this.sRequiredTime = 0;
        this.Order = [];
        this.OrderEntry = [];
        this.TotalOrder = [];
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.CHOICE;
                aReturn.push("Welcome to Maha's Kitchen .");
                aReturn.push("What you would like to have 'Idly' Or 'Dosa'");
                break;
            case OrderState.CHOICE:
                if(sInput.toLowerCase() != "idly" && sInput.toLowerCase() != "dosa"){
                    this.stateCur = OrderState.CHOICE;
                    aReturn.push("We do not sell " + sInput);
                    aReturn.push("Do you want 'Idly' or 'Dosa'?");
                    return aReturn;
                }
                this.stateCur = OrderState.SIZE;
                this.sChoice = sInput;
                if(this.sChoice.toLowerCase() == 'idly'){
                    aReturn.push("Idly comes in regular only. ($6)");
                    this.sSize = "Regular Size";
                    this.sRequiredTime = this.sRequiredTime + 7;
                    this.sPrice = 6;
                    this.sTotalBill = this.sTotalBill + 6;
                    this.stateCur = OrderState.TOPPINGS;
                    aReturn.push("What type Idly would you like to have? 'Plan' or 'Masala'");
                }else{
                    aReturn.push("1. Small :- $4");
                    aReturn.push("2. Regular :- $5");
                    aReturn.push("3. Large :- $6");
                    aReturn.push(`What  ${this.sChoice} would you like?`);
                    this.sRequiredTime = this.sRequiredTime + 10;
                }
                break;
            case OrderState.SIZE:
                if(sInput.toLowerCase() != "1" && sInput.toLowerCase() != "2" && sInput.toLowerCase() != "3" && 
                sInput.toLowerCase() != "regular" && sInput.toLowerCase() != "small" && sInput.toLowerCase() != "large" &&
                sInput.toLowerCase() != "regular" && sInput.toLowerCase() != "small " && sInput.toLowerCase() != "large "){
                    aReturn.push("Please Select Valid Size!");
                    aReturn.push("1. Small Size :- $4");
                    aReturn.push("2. Regular Size :- $5");
                    aReturn.push("3. Large Size :- $6");
                    aReturn.push(`What  ${this.sChoice} would you like?`);
                    this.stateCur = OrderState.SIZE;
                }
                else{
                    this.stateCur = OrderState.TOPPINGS;
                    this.sSize = sInput;
                    if(this.sSize == "1" || this.sSize == "small" || this.sSize == "small "){
                        this.sSize = "Small";
                        this.sTotalBill = this.sTotalBill + 4;
                        this.sPrice = 4;
                    }else if(this.sSize == "2" || this.sSize == "regular" || this.sSize == "regular "){
                        this.sSize = "Regular";
                        this.sPrice = 5;
                        this.sTotalBill = this.sTotalBill + 5;
                    }else if(this.sSize == "3" || this.sSize == "large" || this.sSize == "large "){
                        this.sSize = "Large";
                        this.sTotalBill = this.sTotalBill + 6;
                        this.sPrice = 6;
                    }
                    this.sRequiredTime = this.sRequiredTime + 10;
                    aReturn.push(`What flavour Would You Like With Your ${this.sChoice}?`);
                }
                break;
            case OrderState.TOPPINGS:
                this.stateCur = OrderState.DRINKS;
                this.sToppings = sInput;
                aReturn.push("Would you like any drinks with that?");
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.DESSERT;
                if(sInput.toLowerCase() != "no"){
                    this.sDrinks = sInput;
                    this.sTotalBill = this.sTotalBill + 3;
                }else{
                    this.sDrinks = "-";
                }
                aReturn.push("Would you like Dessert with that?");
                break;
            case OrderState.DESSERT:
                if(sInput.toLowerCase() != "no"){
                    this.sDessert = sInput;
                    this.sTotalBill = this.sTotalBill + 2;
                }else{
                    this.sDessert = "-"; 
                }
                this.Order.push(this.sChoice);
                this.Order.push(this.sSize);
                this.Order.push(this.sToppings);
                this.Order.push(this.sDrinks);
                this.Order.push(this.sDessert);
                this.Order.push(this.sPrice);
                this.TotalOrder.push(this.Order);
                this.Order = [];
                this.sChoice = "";
                this.sSize = "";
                this.sToppings = "";
                this.sDrinks = "";
                this.sItem = "";
                this.sDessert = "";
                this.isDone(true);
                aReturn.push("Your Order Summary");
                for(var i =0; i<this.TotalOrder.length; i++){
                    aReturn.push("-----------------");
                    aReturn.push("Order Item :- " + (i+1));
                    aReturn.push("Item :- " + this.TotalOrder[i][0]);
                    aReturn.push("Size :- " + this.TotalOrder[i][1]);
                    aReturn.push("Sauce :- " + this.TotalOrder[i][2]);
                    aReturn.push("Drinks :- " + this.TotalOrder[i][3]);
                    aReturn.push("Dessert :- " + this.TotalOrder[i][4]);
                    aReturn.push("Price :- " + this.TotalOrder[i][5]);
                }
                this.TotalOrder = [];
                aReturn.push("-----------------");
                aReturn.push("Thank-you for your order");
                aReturn.push(`Your Order total is : ${this.sTotalBill} .`);
                let d = new Date(); 
                d.setMinutes(d.getMinutes() + this.sRequiredTime);
                aReturn.push(`Please pick it up at ${d.toTimeString()}`);
                this.sRequiredTime = 0;
                this.sTotalBill = 0;
                break;
        }
        return aReturn;
    }
}
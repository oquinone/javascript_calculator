import React, { Component } from 'react';
import '../App.css'

class Buttons extends Component {
    constructor(props){
        super(props);
        this.state ={
            input: "0",
            expression: [],
            currentExpression: "",
            results: "",

            decimal: false,
            negative: false,
            concatention: false,
            zero: false   
        }
    }

    // --------------------------------- USER INPUT FUNCTIONS ---------------------------------

    /*  Takes care of creating algebraic expression by user input*/
    numInput = (val) => {
        if(val !== "." || (val === "." && !(this.state.decimal)) ){
            if(this.state.input === "0" && !this.state.zero){
                this.inputingFirstValue(val);
            }
            else if(this.acceptedOperators(this.state.input)){
                this.clickedOperationKey(val);
            }
            else if(this.state.concatention){
                this.concatenateAfterOperationKey(val);
            }
            else{
                this.concatBeforeOperationKey(val);
            }
            
        if(val === "."){
            this.setState({
                decimal: true
            })
        }
    }
}
    /*  Takes care inputing first value into expression array*/
    inputingFirstValue = (val) => {
        if(val === "0"){
            this.setState({
                zero: true
            })
        }
        
        this.setState({
            input: val,
            expression: [val],
            currentExpression: val
        })
    }

    /*Adds operation pressed by user into expression array*/
    clickedOperationKey = (val) => {
        if(this.state.negative){
            this.isNegative(val)
        }
        else{
            this.setState({
                input: val,
                expression: [...this.state.expression, val],
                currentExpression: val,
                zero: false
            })
            
            if(val === "0"){
                this.setState({
                    zero: true
                })
            }
        }
    }

    /*Concatenates single pressed digits together AFTER clicking an operation key*/
    concatenateAfterOperationKey = (val) => {
        if(val !== "0" || (val === "0" && !this.state.zero)){
            let temp = this.state.currentExpression.concat(val);
            let hold = [...this.state.expression];
            hold.splice(hold.length - 1, 1, temp);
            this.setState({
                input: temp,
                expression: hold,
                currentExpression: temp
            })
        }
    }

    /*Concatenates single pressed digits together BEFORE clicking an operation key*/
    concatBeforeOperationKey = (val) => {
        if(val !== "0" || (val === "0" && !this.state.zero)){
            let temp = this.state.currentExpression.concat(val);
            this.setState({
                input: temp,
                expression: [temp],
                currentExpression: temp
            })

            if(this.state.results !== "" && (this.state.input === this.state.expression[0])){
                this.setState({
                    results: ""
                })
            }   
        }
    }

    /* Convert into negative number */
    isNegative = (val) =>{
        let holdExpr = [...this.state.expression];
        let makeNegative = "-" + val;
        holdExpr.splice(holdExpr.length - 1, 1, makeNegative);

        this.setState({
            expression: holdExpr,
            currentExpression: makeNegative,
            negative: false
        })
    }

    // --------------------------------- OPERATION FUNCTIONS ---------------------------------

    /* Add operation to the state */
    operation = (op) => {
        if(this.state.results === ""){
            let expr = [...this.state.expression]
            if(this.acceptedOperators(expr[expr.length - 1])){
                if(!this.state.negative){
                    if(op === "-"){
                        expr.splice(expr.length , 0, op)
                        this.setState({
                            expression: expr,
                            negative: true
                        })
                    }
                    else{
                        expr.splice(expr.length - 1, 1, op);
                        this.setState({
                            input: op, 
                            expression: expr,
                        })
                    }
                }
                else if(this.state.negative){
                    if(op !== "-"){
                        let temp = [...this.state.expression];
                        temp.splice(temp.length - 2, 2, op);
                        this.setState({
                            input: op,
                            expression: temp,
                            negative: false
                        })
                    }
                }
            }
            else{
                if(this.state.input === "0" && op === "-"){
                    this.setState({
                        input: op,
                        expression: [op],
                        currentExpression: op,
                        negative: true
                    })
                }
                else{
                    this.setState({
                        input: op,
                        expression: [...this.state.expression, op],
                        concatention: true,
                    })
                }
            }
        }
        else{
            this.setState({
                input: op,
                expression: [this.state.results, op],
                currentExpression: "",
                results: "",
                concatention: true
            })
        }

        this.isDouble();
    }

    isDouble = () => {
        if(this.state.decimal){
            this.setState({
                decimal: false
            })
        }
    }

    // --------------------------------- RESULTS FUNCTIONS ---------------------------------

    /* Finds Result Of Expression Created by User*/
    results(){
        let expressionArray = [...this.state.expression];
        this.removeExtraOperations(expressionArray);

        if(expressionArray.length === 1){
            this.setState({
                input: expressionArray[0],
                expression: [expressionArray[0], "=", expressionArray[0]],
                currentExpression: "",
                results: expressionArray[0],

                decimal: false,
                negative: false,
                concatention: false
            })
        }
        else{
            let len = expressionArray.length;
            let calc = parseFloat(expressionArray[0]);

            for(let i = 1; i < len; i += 2){
                calc = this.performCalculation(calc, parseFloat(expressionArray[i+1]), expressionArray[i]);
            }

            this.setState({
                input: calc.toString(),
                expression: [...expressionArray, "=", calc.toString()],
                currentExpression: "",
                results: calc.toString(),

                decimal: false,
                negative: false,
                concatention: false
            })
        }
    }

    performCalculation(v1, v2, op){
        switch(op){
            case "+":
                return v1 + v2;
            case "-": 
                return  v1 - v2;
            case "*":
                return  v1 * v2;
            case "/":
                return  v1 / v2;
            default:
                return  v2;
        }
    }

    removeExtraOperations = (arr) => {
        let len = arr.length;

        while(this.acceptedOperators(arr[len - 1])){
            arr.splice(len - 1, 1);
            len = arr.length;
        }
    }

    // --------------------------------- HELPER FUNCTIONS ---------------------------------
     /* Resets State*/
     clear(){
        this.setState({
            input: "0",
            expression: [],
            currentExpression: "",
            results: "",

            decimal: false,
            negative: false,
            concatention: false,
            zero: false 
        })
    }

    acceptedOperators(op){
        switch(op){
            case "-":
                return true;
            case "+":
                return true;
            case "*":
                return true;
            case "/":
                return true;
            default:
                return false;
        }
    }

    render() { 
        return (
        <div id="calc">
            {/*    Display entire algebraic expression    */}
            <div id="expression"> 
                {this.state.expression}
            </div>

            {/*   Display user input   */}
            <div id="display">
                <h1>{this.state.input}</h1>
            </div>

            {/*  Buttons */}
            <div id="buttons">
                <button id="clear" onClick={() => this.clear()}>
                    AC
                </button>
                <button id="divide" onClick={() => this.operation("/")}>
                    /
                </button>
                <button id="multiply" onClick={() => this.operation("*")}>
                    x
                </button>
                <br/>
                <button id="seven" onClick={() => this.numInput("7")}>
                    7
                </button>
                <button id="eight" onClick={() => this.numInput("8")}>
                    8
                </button>
                <button id="nine" onClick={() => this.numInput("9")}>
                    9
                </button>
                <button id="subtract" onClick={() => this.operation("-")}>
                    -
                </button>
                <br/>
                <button id="four" onClick={() => this.numInput("4")}>
                    4
                </button>
                <button id="five" onClick={() => this.numInput("5")}>
                    5
                </button>
                <button id="six" onClick={() => this.numInput("6")}>
                    6
                </button>
                <button id="add" onClick={() => this.operation("+")}>
                    +
                </button>
                <button id="one" onClick={() => this.numInput("1")}>
                    1
                </button>
                <button id="two" onClick={() => this.numInput("2")}>
                    2
                </button>
                <button id="three" onClick={() => this.numInput("3")}>
                    3
                </button>
                
                <button id="equals" onClick={() => this.results()}>
                    =
                </button>
                <button id="zero" onClick={() => this.numInput("0")}>
                    0
                </button>
                <button id="decimal" onClick={() => this.numInput(".")}>
                    .
                </button>
            </div>
        </div> );
    }
}
export default Buttons;
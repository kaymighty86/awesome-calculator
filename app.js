// console.log("Script Loaded.");

var calc_display = document.getElementById("calc_display");
var number_keys = document.querySelectorAll(".num_keys");
var operator_keys = document.querySelectorAll(".operator_keys");
var cancel_key = document.getElementById("key_cancel");
var cancel_curr_num_key = document.getElementById("key_cancel_curr_num");
var result_key = document.getElementById("key_result");


//-------------------------------------------------
//------------subscribe to the events-------------
result_key.addEventListener("click", equal_sign_pressed);
cancel_curr_num_key.addEventListener("click", clearCurrentNumber_Pressed);
cancel_key.addEventListener("click", clearCalc_pressed);

//subscribe the number_creation keys event function to all number keys
for(c = 0; c < number_keys.length; c++){
    number_keys.item(c).addEventListener("click", function(e){
        appendToNumber(e.target.innerHTML);//get the number character that each key represents from inside the HTML element and append it to the existing number being created
    });
}

//subscribe the operator event function to all operator keys
for(c = 0; c < operator_keys.length; c++){
    operator_keys.item(c).addEventListener("click", function(e){
        setOperator(e.target.innerHTML);//get the operator character that each key represents from inside the HTML element and set it as the operator
    });
}

//setup physical keyboard press event too ;-)
document.body.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
        clearCalc_pressed();
    }
    else if(e.key === "Enter"){
        equal_sign_pressed();
    }
    else if(e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4" || e.key === "5" || e.key === "6" || e.key === "7" || e.key === "8" || e.key === "9" || e.key === "0" || e.key === "."){
        appendToNumber(e.key)
    }
    else if(e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/"){
        setOperator(e.key);
    }
    else{
        console.log("The key pressed is not valid.");
    }
});
//-------------------------------------------------
//-------------------------------------------------


var num1 = "";//this variable will hold the number that will be inputed by user
var num2 = 0;//this will hold integer number in num1 after the user clicks an operator key
var operator = "";//this will hold the operator

function appendToNumber(char){
    //check if its a dot (.)
    if(char === "." && num1.includes(".")){//if the number being created already has a dot, ignore the action
        return;
    }
    
    final_calc_result = null;//reset since we're creating new number. We don't need this again

    num1 = num1 != "0"? num1 + char : char;//append the number character inputed to the created number or if the character in num1 is "0" just replace it to avoid having a number like 0987 instead of 987

    updateDisplay(num1);//show it in the display
}

var current_operator_object = null;
function setOperator(new_operator){
    if(operator === ""){//if this is the first operator call of a new calculation
        if(final_calc_result !== null){//check the result from previous calculation, if its has not been cleared then the result is needed for the new calculation
            num1 = final_calc_result;
            final_calc_result = null;//now reset this
        }
        else{//this is a fresh calculation
            if(num1 === ""){//If for some reason the user has not inputed any number. Set the value of num1 as 0
                num1 = "0";
            }
        }

        num2 = parseFloat(num1);//move the value in num1 to num2 becasue num1 value will be changed
        num1 = "";//clear this for now
        operator = new_operator;

        //show visual
        highlightOperatorKey(new_operator);
    }
    else if(operator !== "" && num1 == ""){//if the user clicked any operator key again after clicking it the first time before inputing a new value, update the operator only
        operator = new_operator;
        
        //show visual
        highlightOperatorKey(new_operator);
    }
    else{//the user clicked an operator key afer inputing second value that means this is a continous calculation. Calculate and update operator so that the user can input the next value
        num1 = calculate();
        updateDisplay(num1);//display the new result in num1 in the calculator screen

        num2 = parseFloat(num1);//move the value in num1 to num2 becasue num1 value will be changed
        num1 = "";//clear this for now
        operator = new_operator;
        
        //show visual
        highlightOperatorKey(new_operator);
    }
}

function highlightOperatorKey(key_character){//used to physically highlight a virtual operator key on the calculator when the corresponding physical keyboard key is pressed
    //reset first
    if(current_operator_object !== null){
        current_operator_object.classList.remove("operator_key_clicked");
    }
    //find the equivalent operator virtual key and highlight
    for(c = 0; c < operator_keys.length; c++){
        var char = key_character === "*"? "x":key_character;//first check if the character is "*", if it is then use "x" character instead since thats what is in the innerHMTL of the multiplication element

        if(operator_keys.item(c).innerHTML === char){//once the corresponding key element is found assign it to "current_operator_object"
            current_operator_object = operator_keys.item(c);
            current_operator_object.classList.add("operator_key_clicked");
        }
    }
}

//---------------------------------------------------
function calculate(){
    num1 = num1 === ""? num2 : num1;//if for some reason, num1 has not been inputed but this function was called, use the value of num2 for num1

    var result = 0.0;
    switch(operator){
        case "+": result = parseFloat(num2 + parseFloat(num1));
        break;
        case "-" : result = parseFloat(num2 - parseFloat(num1));
        break;
        case "x" : result = parseFloat(num2 * parseFloat(num1));//multiplication type 1
        break;
        case "*" : result = parseFloat(num2 * parseFloat(num1));//multiplication type 2
        break;
        case "/" : result = parseFloat(num2 / parseFloat(num1));
        break;
        default: console.log("The operator is invalid");
        break;
    }

    // console.log(result);

    return result;
}
//---------------------------------------------------
var final_calc_result = null;

function equal_sign_pressed(){
    if(operator !== ""){//as long as an operator has been clicked, execute the following
        final_calc_result = calculate();
        updateDisplay(final_calc_result);//display the result in the viewer

        operator = "";//reset the oprator value
        
        if(current_operator_object !== null){
            current_operator_object.classList.remove("operator_key_clicked");//reset
        }
        num1 = "";
        num2 = "";
    }
}

function clearCalc_pressed(){//triggered by the "C" key
    operator = "";
    if(current_operator_object !== null){
        current_operator_object.classList.remove("operator_key_clicked");//reset
    }
    num1 = "";
    num2 = "";
    final_calc_result = null;
    updateDisplay("0");//show it in the display
}

function clearCurrentNumber_Pressed(){//triggered by the "CE" key
    if(final_calc_result != null){//if this has not been cleared before the user presses this key, then clear everything
        clearCalc_pressed();
    }
    else{
        num1 = "";
        updateDisplay("0");//show it in the display
    }
}

function updateDisplay(value){
    //to enable us add comma to the number being displayed
    calc_display.value = commalise(value);
}

var commalise = (value) => {
    var val = value.toString();

    var pattern = /(?=.+\.)/g;//patter for checking if dot "." exists in the given value
    var first_part = pattern.test(val)? val.slice(0, val.indexOf(".")) : val;//if its a decimal number, seperate the characters before the dot "." and after the dot, else just pass the value straight up
    var last_part = pattern.test(val)? val.slice(val.indexOf("."), val.length) : "";//if its not a decimal number, pass an empty string for this one since we are only working on the first part

    var split_first_part_chars = first_part.split("");

    //assign the values of the "split_first_part_chars" array in the "commalised_char_array" by starting from the last cell "split_first_part_chars" array. On every 3 iterations, add comma before the value
    for(var c = 1; c <= split_first_part_chars.length; c++){
        if(c < split_first_part_chars.length && c %3 === 0 && split_first_part_chars[split_first_part_chars.length - c - 1] !== "-"){//if this is not the last iteration and this value of c is a multiple of 3 and the character before this is not the "-" sign
            var char_at_c_from_back = split_first_part_chars[split_first_part_chars.length - c];//get the character from the back of the array in the index given
            split_first_part_chars.splice(split_first_part_chars.length - c, 1, "," + char_at_c_from_back);//replace the value of the cell at the back (in the index given) with the same value but has "," attached before it
        }
    }

    //combine all the values of the "commalised_char_array" array into one variable
    var combined_first_part = split_first_part_chars.reduce((accumulator, item)=>{
        return accumulator += item;
    }, "");

    return combined_first_part + last_part;
}
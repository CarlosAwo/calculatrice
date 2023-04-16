/***************************************

/**
 *Test si la chaine fournie ne contient que les caracteres autorisess
 *@param operation {string}-Loperation a faire tester
 *@return {booleen} un boollen representant le resultat du test
 *
 */
function checkValidContent(operation){
  let pattern = /[^0-9+\-*/]/  
  r = operation.match(pattern)
  if (r !== null) {
      throw new Error("Invalid Symbole "+r[0])
      return false
  }
  else{
    
    return true
  }
}
/**
 *Verifie si l'ordre de succession des caracteres autorise est correcte
 *@param operation {string}-Loperation a faire tester
 *@return {booleen} un boollen representant le resultat du test
 *
 */
function checkCoherence(operation){


    for(let i = 0;i<=operation.length-1;i++){
        let element = operation[i]
        let next = operation[i+1]
        let prev = operation[i-1]
        
        if( (element =="*")||(element=="/")||(element==".")){
            if( !(isNaN(prev)==false && (next=="+"||next=="-"||isNaN(next)==false)) ) {
               
                throw new Error("Sequency Error after: "+element)
                return false
            }
        }

        if(element ==="+"||element==="-"){
            if(!( (next=="+"||next=="-"||isNaN(next)==false||prev==undefined) && (next=="+"||next=="-"||isNaN(next)==false) ) ){
                throw new Error("Sequency Error after: "+element)
                return false
            }
        }
    }
    return true
}
/****************************************
 *  MATHS CALCUL 
 *****************************************/
/**
 *Effectue un simple calcul Mathematiques 
 *incluant un operateur et 1 ou deux operandes
 *@param {array} operation -L'operation 
 *@return {Number} Le resultat de l'operation
 */
function simpleCalcul(operation){
   let operator = ""
   let operand1 = null
   let operand2 = null
   let result = null
   //Return Statement Here
   if (operation.length==1) {
        result = operation.join("")
        return Number(result)
   }
   else if(operation.length==3){

	   operand1 = Number(operation[0])
	   operator = operation[1]
	   operand2 = Number(operation[2])

   }
   switch (operator) {
        case "*":
            result = operand1 * operand2
            break;
        case "+":
            result = operand1 + operand2
            break;
        case "-":
            result = operand1 - operand2
            break;
        case "/":
             if (operand2===0) {
                 throw new Error("Division By Zero Impossible")
                 return "MathError"
             }
            result = operand1 / operand2
            break;

        default:
           
            break;
   }
   return result
}
/**
 *Prend en entre un tableau contenant des operation a effectuer
 *Recherche tous les operateurs d'action de Multiplication ou de 
 *Division et les execute 
 * @return un tableau contenant les resulat des operation de multiplication ou
 *de division
 */
function MultiplicationOrDivision(operation){

    let resObj = {}
    let resOpe = null
    for(let i = 0 ; i < operation.length ; i++){
        element = operation[i]
        if ( element == "*" || element == "/" ) {
            resObj = extractSimpleOperation( operation , element )
            resOpe = JSON.stringify(simpleCalcul(resObj.result))
            operation = resObj.newContainer
            operation = addElementToArray(operation , resOpe , resObj.start)
            i=0
        }
        else{
            //Operator not found
        }
    }

    return operation
}
/**
 *Prend en entre un tableau contenant des operation a effectuer
 *Recherche tous les operateurs d'action d'addition ou de 
 *Soustraction et les execute 
 * @return un tableau contenant les resulat des operation d'addition ou
 *de Soustraction
 */
function AdditionOrSoustraction(operation){
   let resObj = {}
    let resOpe = null
    for(let i = 0; i < operation.length; i++){
        element = operation[i]
        if (element == "+" || element == "-") {
            resObj = extractSimpleOperation(operation,element)
            resOpe = JSON.stringify(simpleCalcul(resObj.result))
            operation = resObj.newContainer
            operation = addElementToArray(operation , resOpe , resObj.start)
            i=0
        }
        else{
           //operator Not found
        }
    }
    return operation
}
/**
 *Extrait une operation mathematique en se basant sur la pemiere
 * occurence de l'operateur d'action fournit en argument d'un tableau 
 *@param {array} container - le tableau contenant l'expression mathemeatiques a extraire
 *@param {string} operator - L'operateur d'action sur lequel se basé pour extraire les operandes
 *@return {litteral Object} un object contenant les information  
 * 
 */
function extractSimpleOperation(container , operator){
    let result = ""
    let find = false
    let start = false
    let end = false
    let newContainer = []
    container.forEach((element, index) => { 
        if (element === operator && find==false) {
            find = true
            start = index-1
            end = index+2
            if(start<0){start = index}
            if(end>container.length-1){end = container.length}
            result = container.slice( start , end )
         } 
    })
    if (find==true) {
        container.forEach((element, index) => { 
            if (index<start ||index>=end) {
                newContainer.push(element)
             } 
        })
    }
    return {
        result:result,
        newContainer,
        start, 
        end 
    }
}

/****************************************
 *  TRAITEMENT DES SIGNES 
 *****************************************/

/**
 *Permet d'obtenir le signe resultant de plusieurs operateurs de signes
 *NB Cette fonction est privee et apprtient a ala fonction (recognizeSignedNumber) 
 */
function SimplifySigneToOne(arr){

	let result = 1
	arr.forEach((element)=>{
		if ( element  == "-" ) {
			result *= -1
		}
		else if ( element  == "+" ) {
			result *= 1
		}
	})
	if ( result > 0 ) {
		return "+"
	}
	else if ( result < 0 ) {
		return "-"	
	}
}
/**
 *Permet associer les operateurs de signes aux nombres respectis
 *NB Cette fonction est privee et apprtient a ala fonction (recognizeSignedNumber) 
 */
function concateSigneToNumber(arr){

	let signe = ""
	let res = []
	for (i=0 ; i<arr.length ; i++){
		let element = arr[i]
		let prev = arr[i-1]
		let next = arr[i+1]

		if ( isNaN(element)==true &&prev == undefined && (next=="+"||next=="-"||isNaN(next)==false)) {
			
			signe = element 
		}
		else if( isNaN(element)==true && (prev=='+'||prev=='-'||prev=='*'||prev=="/") && (isNaN(next)==false ||next=='+'||next=='-')){
			
			signe = element
		}
		else{
			if (isNaN(element)==true) {
				res.push(element)
			}
			else{
				if (signe!="") {
					let a  = signe + element
					res.push(a)
					signe = ""
				}
				else{
					res.push(element)
				}
			}

		}

	}
	
	return res
}
/**
 *Permet d'identifier un caractere comme etant un operateur de signe
 *
 */
function recognizeSignedNumber(arr){

	let Tab = []
	let res = []
	for (i=0 ; i<arr.length ; i++){
		let element = arr[i]
		let prev = arr[i-1]
		let next = arr[i+1]

		if ( isNaN(element)==true &&prev == undefined && (next=="+"||next=="-"||isNaN(next)==false)) {
			Tab.push(element)
		}
		else if( isNaN(element)==true && (prev=='+'||prev=='-'||prev=='*'||prev=="/") && (isNaN(next)==false ||next=='+'||next=='-')){
			Tab.push(element)
		}
		else{
			if (Tab.length > 0) {
				res.push(SimplifySigneToOne(Tab))
				Tab = []
			}
			res.push(element)

		}

	}
	res = concateSigneToNumber(res)
    return res
}

/****************************************
 * 				AUTRES
 *****************************************/
/**
 *Permet de verifier et d"ecrire dans un format correct les nombres a virgules
 *
 */
function recognizeFloatedNumber(operation){
   let resObj = {}
    let resOpe = null
    for(let i = 0; i < operation.length; i++){
        element = operation[i]
        if (element == ".") {
            resObj = extractSimpleOperation(operation,element)
            
            resOpe = resObj.result.join("")
            
            operation = resObj.newContainer
            operation = addElementToArray(operation , resOpe , resObj.start)
            i=0
        }
        else{
           //operator Not found do nothing
        }
    }
    return operation
}
/**
 *Regroupe une suite d'entiers formant un nombre
 *@param {string} operation -L'operation sous frome de chaines de caracteres
 *@return {array} un tableau contenant l'operation dispacthe 
 * avec une maeilleur visiblite sur les nombres
 */
function concatenateIntegerSuccession(operation){

	let operationSplit = operation
	let result = []
	let num = ""
    for(let i = 0 ; i < operationSplit.length ; i++ ){
        let item = operationSplit[ i ]
        if ( isNaN( item ) == true ) { result.push( item ) }
        else if ( isNaN( item ) == false ) {
            num = num + item
            if ( i == operationSplit.length-1 || isNaN(operationSplit[ i + 1 ]) ) {
                result.push( num )
                num = ""
            }           
        }
    };
    return result              
}

/**
 *Add an element to an array at a specified index without modifiying the initial array
 *@param {array} arra --the array in which new element will be injected
 *@param {ANY} elementToAdd --element to injecte 
 *@param {Number-integer} position --the position at which element will be placed
 *@return {array} the result
 */
function addElementToArray(arra ,elementToAdd , position){

    let newArra = []
    if (position>=arra.length) {
        arra.push(elementToAdd)
        newArra = arra
        return newArra
    }
 
    arra.forEach((element, index) => { 
        if (index === position) {
             newArra.push(elementToAdd)
         } 
         newArra.push(element)
    })
    return newArra
}
/****************************************
 * 				MAIN FUNCTION
 *****************************************/
/**
 * Permet d'effectuer un ensemble doperation Mathemetiques
 *@param {string} l'operation 
 *@return {Number} le resultat de l'operation Mathematiques 
 */
function root(operation){
    
    operation = operation.split("")
    /*-------VERIFICATION-----------*/
    try {

         checkValidContent(operation.join(""))

         checkCoherence(operation)
    } 
    catch(e) {
      info.textContent = e
      return e
    }
    info.textContent = ""

    /*--------------NETTOYAGE-----------*/

    operation = concatenateIntegerSuccession(operation)
    operation = recognizeSignedNumber(operation)
    operation = recognizeFloatedNumber(operation)

    /*---------------Calcul-------------*/
    //Rechercher de l'operateur de Multilplication ou de Division et Appeller la fonction Calclul 
  
    try{
         operation = MultiplicationOrDivision(operation)    
    }
    catch(e) {
      info.textContent = e
      return e
    }

    operation = AdditionOrSoustraction(operation)
    return operation



    //Rechercher de l'operateur d'addition ou de Soustracttion et Appeller la fonction Calclul 
}

let input = document.getElementById("userInput")
let resp = document.querySelector(".outputAnswer")
let info = document.querySelector(".info")
let hasUserType = false



let buttons = Array.from(document.querySelectorAll(".button"))
 buttons.forEach((btn)=>{
	btn.addEventListener("click",function(){
	   let element = this
	   
	   let value = this.textContent
	   let type = element.dataset.type
	   if(type === "operationElement"){
        if (hasUserType === false) {
            input.value = ""
            hasUserType = true
        }
	   	   input.value += value
	   }
	   else if(type === "action"){
			switch (value) {
			  case "=":
    let a = input.value

    resp.textContent = root(a)[0]
			    break;
			  case "C":
			  	
			  	input.value = ""
			    break;
              case "‹":
              
                let t = input.value.split("")
                t.pop()
               
                input.value = t.join("")
              break;

			  default:
			    break;
			}

	   }
    })
})

input.addEventListener("keydown",(e)=>{

  switch(e.key){
    case "Enter":
    let a = input.value

    resp.textContent = root(a)[0]

    break;
  }
})






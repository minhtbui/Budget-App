/* What did i learn in this project
- using more closures
- using IIFE(Immediately Invoked Function Express) to protect privacy data
- complex data structure
- DOM manipulate
- create html text in js and parse it into html file
-
*/
// create 3 modules

//--------------Budget Controller Module------------//
var BudgetController = (function () {
	var Incomes = function (id, desc, value) {
		this.id = id,
			this.desc = desc,
			this.value = value
	};

	var Expenses = function (id, desc, value) {
		this.id = id,
			this.desc = desc,
			this.value = value
	};

	//total inc and exp function
	var totalType = function (type) {
		var sum = 0;
		//run loop for each element of items'type array
		data.items[type].forEach(function (item) {
			sum += item.value;
		});
		//put sum of items'type into totals'type data structure
		data.totals[type] = sum;
	};

	//data structure
	var data = {
		items: {
			inc: [],
			exp: []
		},
		totals: {
			inc: 0,
			exp: 0
		},
		budget: 0,
		percentage: -1
	}

	return {
		newItem: function (type, desc, value) {
			var ID, newItem;

			//create new ID
			if (data.items[type].length > 0) {
				//calculate length of items'type in data structure
				ID = data.items[type][data.items[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			//create newItem
			if (type === 'inc') {
				newItem = new Incomes(ID, desc, value);
			} else if (type === 'exp') {
				newItem = new Expenses(ID, desc, value);
			}
			//push newItem into data structure
			data.items[type].push(newItem);
			//return the new ele
			return newItem;
		},
		//calc the budget and percentage of exp in inc
		calculateBudget: function () {
			//calculate total inc and exp
			totalType('inc');
			totalType('exp');

			//calculate total budget
			data.budget = data.totals.inc - data.totals.exp;

			//calculate % of exp in inc
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
		},

		//get budget data into public env
		getBudget: function () {
			return {
				budget: data.budget,
				percentage: data.percentage,
				totalInc: data.items.inc,
				totalExp: data.items.exp
			}
		},

		testing: function () {
			console.log(data);
		}
	}
})();

//-------------------UI Controller Module---------------//
var UIController = (function () {
	//creating DOMstrings to avoid DRY
	var DOMstrings = {
		typeDOM: '.add__type',
		descDOM: '.add__description',
		valueDOM: '.add__value',
		btnDOM: '.add__btn',
		incomeDOM: '.incomes__list',
		expenseDOM: '.expenses__list'
	}
	return {
		//get input to public env
		getInput: function () {
			return {
				//get select type
				type: document.querySelector(DOMstrings.typeDOM).value,
				//get text input
				description: document.querySelector(DOMstrings.descDOM).value,
				//get value input and turn it to NUMBER
				value: parseFloat(document.querySelector(DOMstrings.valueDOM).value)
			}
		},

		//add items into UI
		addItems: function (obj, type) {
			var html, newHTML, element;

			//create html with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeDOM;
				html = '<div class="item clearfix" id="incomes-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseDOM;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//replace the placeholder text with input data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%desc%', obj.desc);
			newHTML = newHTML.replace('%value%', obj.value);

			//parse HTML text into HTML file by insertAdjacentHTML ('position', ) text
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		//clear input field after enter the item
		clearField: function () {
			var field, fieldArr;

			field = document.querySelectorAll(DOMstrings.descDOM + ' ,' + DOMstrings.valueDOM);

			//use array prototype to slice(return) with call method input field =>> fieldArr[] ------ more in array-like objects
			fieldArr = Array.prototype.slice.call(field);

			//forEach(callback fnc( fnc's parameter = fieldArr's properties){})
			fieldArr.forEach(function (current, index, array) {
				current.value = ""; //set array's current EMPTY
			});
			//return focus to the first field
			fieldArr[0].focus();
		},

		//get DOM fnc to public env
		getDOM: function () {
			return DOMstrings;
		}
	}
})();


//-------------------App ConTroller Module-------------------//
var AppController = (function (BudgetCtrl, UICtrl) {
	//place all event listerner in 1 function
	var setUpEventListener = () => {
		var DOM = UICtrl.getDOM();
		//When add value btn is clicked
		document.querySelector(DOM.btnDOM).addEventListener('click', addItemCtrl);

		//When Enter is pressed
		document.addEventListener('keypress', function (e) {
			if (event.keyCode === 13 || event.which === 13) {
				addItemCtrl();
			}
		})

	}
	//calculate and update budget in controllers
	var updateBudget = () => {
		//calculate budget
		BudgetCtrl.calculateBudget();
		//get budget data
		var budger = BudgetCtrl.getBudget();
		//display budget on UI
	}

	var addItemCtrl = () => {
		var getInput, newItem;
		//get input values
		getInput = UICtrl.getInput();
		//in condition, desc is not empty, value is a number and greater than 0
		if (getInput.description !== '' && !isNaN(getInput.value) && getInput.value > 0) {
			//add item into budget controller
			newItem = BudgetCtrl.newItem(getInput.type, getInput.description, getInput.value);
			//add item into UI controler
			UICtrl.addItems(newItem, getInput.type);
			//clear input fields
			UICtrl.clearField();
			//run updateBUdget function
			updateBudget();
		}
	};

	return {
		init: () => {
			console.log('The application running ...');
			setUpEventListener();
		}
	}

})(BudgetController, UIController);

AppController.init();

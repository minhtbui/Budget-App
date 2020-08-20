/* What did i learn in this project
- using more closures
- using IIFE(Immediately Invoked Function Express) to protect privacy data
- complex data structure
- DOM manipulate
- create html text in js and parse it into html file
- How to use event delegation
- loop map function to loop over an array and return new array
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
			this.value = value,
			this.percentage = -1;
	};

	//create calculate percentage prototype method for EXP
	Expenses.prototype.calcPercentage = function (totalInc) {
		if (totalInc > 0) {
			this.percentage = Math.round((this.value / totalInc) * 100);
		} else {
			this.percentage = -1;
		}
	};

	//create get percentage prototype method for Exp
	//create percentage arr in exp
	/*Expenses.prototype.getPercentage = function () {
			return this.percentage;
	};*/

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
		percentage: -1 //-1 means nonexistent
	}

	return {
		newItem: function (type, desc, value) {
			var ID, newItem;

			//create new ID
			if (data.items[type].length > 0) {
				// length of items'type in data structure - 1 == the last index
				//the last index.id + 1 == the next item's ID
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

		//delete item function in budgetCtrl
		deleteItem: function (type, ID) {
			var ids, index;
			//loop data structure's type and return id only
			ids = data.items[type].map(function (current) {
				return current.id;
			});

			//find the index of ID input (clicked deleted item)
			index = ids.indexOf(ID);

			//-1 == index is not found => turn false
			if (index !== -1) {
				//splice(current index, 1 value) --- if not put 1, it will remove the rest from current
				data.items[type].splice(index, 1);
			}
		},

		//calc the budget and percentage of exp in inc
		calculateBudget: function () {
			//calculate total inc and exp
			totalType('inc');
			totalType('exp');

			//calculate total budget
			data.budget = data.totals.inc - data.totals.exp;

			//calculate % of exp in inc
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			};
		},

		//calculate percentage fnc by using obj prototype method
		calculatePercentage: function () {
			data.items.exp.forEach(function (current) {
				current.calcPercentage(data.totals.inc);
			})
		},

		//get percentage arr into public envi
		getPercentage: function () {
			var allPerc = data.items.exp.map(function (current) {
				return current.percentage;
			});
			return allPerc;
		},

		//get budget data into public env
		getBudget: function () {
			return {
				budget: data.budget,
				percentage: data.percentage,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp
			}
		},

		//test updated data structure
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
		expenseDOM: '.expenses__list',
		budgetDOM: '.budget__value',
		incTotalDOM: '.budget__incomes--value',
		expTotalDOM: '.budget__expenses--value',
		expPerDOM: '.budget__expenses--percentage',
		containerDOM: '.container',
		itemPercDOM: '.item__percentage',
		dateDOM: '.budget__title--month'
	};

	var formatNun = function (target, type) {
		var num, dec;

		//return absolute number > 0
		num = Math.abs(target)
		//toFixed is prototype of Number methods to return decimal number
		num = target.toFixed(2);

		//substr will get decimal number to dec variable
		dec = num.substr(-3, 3);

		//remove decimal number
		num = Math.floor(num);

		//add comma in every 3 number => 100,000,000
		num = num.toLocaleString();

		//num = num.toLocaleString();
		return (type === 'inc' ? '+' : '-') + ' ' + num + dec;
	};

	//create nodeList with custom forEach method
	//nodes = nodeElement in HTML, callback fnc = function(current, index)
	var nodeListForEach = function (nodes, callback) {
		for (i = 0; i < nodes.length; i++) {
			//call the callback fnc to pass counters in paramter
			callback(nodes[i], i);
		}
	};
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

		//add items on UI
		addItemsUI: function (obj, type) {
			var html, newHTML, element;

			//create html with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeDOM;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseDOM;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//replace the placeholder text with input data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%desc%', obj.desc);
			newHTML = newHTML.replace('%value%', formatNun(obj.value, type));

			//parse HTML text into HTML file by insertAdjacentHTML ('position', ) text
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		//delete items on UI
		deleteItemsUI: function (htmlID) {
			var item = document.getElementById(htmlID);
			item.parentNode.removeChild(item);

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

		//display budget on UI
		displayBudget: function (obj) {
			var type;
			obj.budget >= 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetDOM).textContent = formatNun(obj.budget, type);
			document.querySelector(DOMstrings.incTotalDOM).textContent = formatNun(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expTotalDOM).textContent = formatNun(obj.totalExp, 'exp');


			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.expPerDOM).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.expPerDOM).textContent = '---'
			}
		},

		//display percentage of each item
		displayPercentage: function (percentage) {

			//item nodes in html file selected by item percentage ID
			var itemPerc = document.querySelectorAll(DOMstrings.itemPercDOM);

			//using custom forEach method for nodeList
			//if percentage value > 0 => exp item exist => write its value to itemPercID on html
			nodeListForEach(itemPerc, function (current, index) {
				if (percentage[index] > 0) {
					current.textContent = percentage[index] + '%';
				} else
					current.textContent = '---';
			});
		},

		displayDate: function () {
			var date;

			date = new Date();

			//month = date.getMonth();
			//year = date.getFullYear();
			date = date.toLocaleString('default', {
				month: 'long'
			}) + ' ' + date.getFullYear();

			return document.querySelector(DOMstrings.dateDOM).textContent = date;
		},

		changeInputField: function () {

			var nodeFields = document.querySelectorAll(
				DOMstrings.typeDOM + ',' +
				DOMstrings.descDOM + ',' +
				DOMstrings.valueDOM);

			nodeListForEach(nodeFields, function(current){
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.btnDOM).classList.toggle('red');

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

		//When deteled btn is clicked, using event delegation to bubble the parent element and callback the function delete
		document.querySelector(DOM.containerDOM).addEventListener('click', deleteItemCtrl);

		document.querySelector(DOM.typeDOM).addEventListener('change', UICtrl.changeInputField);

	}

	//calculate and update budget function
	var updateBudget = () => {
		//calculate budget
		BudgetCtrl.calculateBudget();
		//get budget data
		var budget = BudgetCtrl.getBudget();
		//display budget on UI
		UICtrl.displayBudget(budget);
	}

	var updatePercentage = () => {
		//calculate percentage
		BudgetCtrl.calculatePercentage();
		//get percentage from data structure
		var percentage = BudgetCtrl.getPercentage();
		//display percentage on UI
		UICtrl.displayPercentage(percentage);
	}

	//add item function
	var addItemCtrl = () => {
		var getInput, newItem;
		//get input values
		getInput = UICtrl.getInput();
		//in condition, desc is not empty, value is a number and greater than 0
		if (getInput.description !== '' && !isNaN(getInput.value) && getInput.value > 0) {

			//add item into budget controller
			newItem = BudgetCtrl.newItem(getInput.type, getInput.description, getInput.value);
			//add item into UI controler
			UICtrl.addItemsUI(newItem, getInput.type);
			//clear input fields
			UICtrl.clearField();
			//calculate and update budget after added item
			updateBudget();
			//calculate and update percentage
			updatePercentage();
		}
	};

	//delete item function
	var deleteItemCtrl = (e) => {
		var itemID, itemSplit, ID, type;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		//if itemID is caught => true
		if (itemID) {
			itemSplit = itemID.split('-');
			type = itemSplit[0];
			ID = parseInt(itemSplit[1]);

			//delete item in data structure
			BudgetCtrl.deleteItem(type, ID);
			//delete item in UI
			UICtrl.deleteItemsUI(itemID);
			//calculate budget after deleted
			updateBudget();
			//calculate and update percentage
			updatePercentage();
		}
	}

	return {
		init: () => {
			console.log('The application running ...');
			UICtrl.displayDate();
			UICtrl.displayBudget({
				budget: 0,
				percentage: 0,
				totalInc: 0,
				totalExp: 0
			});
			setUpEventListener();
		}
	}

})(BudgetController, UIController);

AppController.init();

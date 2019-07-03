var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "bamazon_db"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected with id: ", connection.threadId, "\n-----------------\n");
    start();
});


function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            choices: ["View products for sale", "View Low Inventory (less than or 10)", "Add to current Inventory", "Add new product to Inventory", "Quit"],
            message: "Available Actions:"
        }
    ]).then(function (input) {
        switch (input.options) {
            case "View products for sale":
                return displayProducts();
            case "View Low Inventory (less than or 10)":
                return lowInventory();
            case "Add to current Inventory":
                return addToInv();
            case "Add new product to Inventory":
                return addNewProduct();
            default: return connection.end();
        }
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=10", function (err, result) {
        if (err) throw err;

        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                console.log(`====================\nItem ID: ${result[i].item_id} || Product: ${result[i].product_name} || In stock: ${result[i].stock_quantity}\n====================\n`);
            }
        } else {
            console.log("No low inventory items");
        }
        start();
    });

}

function addToInv() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Item to be updated:",
            validate: function (value) {
                if (!isNaN(value) === true) {
                    return true;
                }
                return "Please type a quantity";
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Quantity to be added",
            validate: function (value) {
                if (!isNaN(value) === true) {
                    return true;
                }
                return "Please type a quantity";
            }
        }
    ]).then(function (input) {
        var quant = parseInt(input.quantity);

        var query = connection.query("SELECT * FROM products WHERE ?", [{ item_id: input.item }], function (err, result) {
            if (err) throw err;
            var res = result[0];
            console.log("------------------------\nItem id: ", res.item_id, " || Product Name: ", res.product_name, " || Price: ", res.price, " || In Stock: ", res.stock_quantity, "\n------------------------\n");

            var updatedStock = res.stock_quantity + quant;
            console.log(`\n=======\nUpdated Stock: ${updatedStock}\n=======\n`);
            updateStock(input.item, updatedStock);
        });
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Product Name:"
        },
        {
            type: "input",
            name: "department",
            message: "Department Name:"
        },
        {
            type: "input",
            name: "price",
            message: "Product Price:",
            validate: function (value) {
                if (!isNaN(value) === true) {
                    return true;
                }
                return "Please type a quantity";
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many?",
            validate: function (value) {
                if (!isNaN(value) === true) {
                    return true;
                }
                return "Please type a quantity";
            }
        }
    ]).then(function(input){
        connection.query("INSERT INTO products SET ?",{
            product_name: input.name,
            department_name: input.department,
            price: input.price,
            stock_quantity: input.quantity
        }, function(err, response){
            if(err) throw err;
            console.log(response.affectedRows + " Item has been added\n");
            displayProducts();
        });
    });
}


function updateStock(item, quantity) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                item_id: item
            }
        ]
    );
    displayProducts();
}


function displayProducts() {
    var itemsNum = 0;
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response, "-------------------------------\n");
        start();
    });
}
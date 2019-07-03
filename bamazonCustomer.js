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
    displayProducts();
});


function start() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "ID of desired product: ",
            validate: function (value) {
                if (!isNaN(value) === true) {
                    return true;
                }
                return "Please type a valid item ID.";
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Quantity to be bought",
            validate: function (value) {
                if (!isNaN(value) === true) {
                    return true;
                }
                return "Please type a quantity";
            }
        }
    ]).then(function (input) {
        var quant = parseInt(input.quantity);
        var total = 0;

        var query = connection.query("SELECT * FROM products WHERE ?", [{item_id: input.item}], function(err, result){
            if(err) throw err;
            var res = result[0];
            console.log("------------------------\nItem id: ", res.item_id, " || Product Name: ", res.product_name, " || Price: ", res.price, " || In Stock: ", res.stock_quantity, "\n------------------------\n");
            
            if(res.stock_quantity >= quant){
                total = quant * res.price;
                console.log("Total: $" + total);

                var updatedStock = res.stock_quantity - quant;
                console.log(`\n=======\nUpdated Stock: ${updatedStock}\n=======\n`);
                updateStock(input.item, updatedStock);
            }else{
                console.log("Insufficient quantity. Please make another order with a smaller quantity.\n");
                displayProducts();
            }
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
    console.log("update");
    displayProducts();
}


function displayProducts() {
    var itemsNum = 0;
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response, "-------------------------------\n");
        start();
    });
    // return itemsNum;
}
var express = require('express')
var app = express()
var mysql = require('mysql')

var async = require('async')

//Connecting to the DB
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database:'zaitoon'
})


//Set CORS
// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });


//Test API
app.get('/test', function (req, res) {
	connection.query('SELECT * from zaitoon_admins', function (err, rows, fields) {
    if (!err){
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).json({'name':rows[0].name})
    }
    else
      res.status(500).send('Error ')     
	})
})

app.get('/menutype', function (req, res) {
  connection.query('SELECT * from zaitoon_menutypes', function (err, rows, fields) {
    var output = [];
    var i=0;
    var main= rows[0].mainType;
    var submenu=[];

    while( i < rows.length ){
      
      if (main == rows[i].mainType){
        submenu.push(
        //"type":rows[i].type,
        //"name":rows[i].name,
        {
          "subType" : rows[i].subType,
          "subName" : rows[i].subName
        }
      );
        if ( i ==(rows.length-1) ){
        output.push(
        {
          "mainType":rows[i-1].mainType,
          "mainName":rows[i-1].mainName,
          "submenu": submenu
        }
        );
      }
      }
   
      else {
        main = rows[i].mainType;
        output.push(
        {
          "mainType":rows[i-1].mainType,
          "mainName":rows[i-1].mainName,
          "submenu": submenu
        }
        );
        var submenu=[]; 

      }

      i++;
    }

    if (!err){
      res.setHeader('Content-Type', 'application/json');
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(JSON.stringify(output))
    }
    else
      res.status(500).send('Error ')     
  })
})

app.get('/getmenu', function (req, res) {
  connection.query('SELECT * from zaitoon_menutypes', function (err, rows, fields) {
    var output = [];
    var i=0;
    var j;
    var main= rows[0].mainType;
    var submenu=[];
    var items=[];

    //Iterate through complete menu types
    while( i < rows.length ){
      
      //Do NOT MENU TYPE switch case
      if (main == rows[i].mainType){


        //Make items in the sub-types
        console.log(rows[i].subType);
        console.log("SELECT * from zaitoon_menu WHERE type='"+rows[i].subType+"'");
        connection.query("SELECT * from zaitoon_menu WHERE type='{rows[i].subType}'" , function (err2, rows2, fields2){
        console.log('*************************'+rows2.length);
        items = [];
        j=0;
        while(j < rows2.length){
          console.log(rows2[j].name);
          items.push(
            {
            "itemCode":rows2[j].code,
            "itemName":rows2[j].name,
            "itemPrice":rows2[j].price
            }
          );
          j++;
        }
        console.log(items);

      }); //End Connection

        //Create Sub-menu
        submenu.push(
          {
            "subType" : rows[i].subType,
            "subName" : rows[i].subName,
            "items" : items
          }
        );

        if ( i ==(rows.length-1) ){
        output.push(
        {
          "mainType":rows[i-1].mainType,
          "mainName":rows[i-1].mainName,
          "submenu": submenu
        }
        );
      }
      }
   
      //SWITCH NEXT TYPE
      else {
        main = rows[i].mainType;
        output.push(
        {
          "mainType":rows[i-1].mainType,
          "mainName":rows[i-1].mainName,
          "submenu": submenu
        }
        );
        var submenu=[]; 

      }

      i++;
    }

    if (!err){
      res.setHeader('Content-Type', 'application/json');
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(JSON.stringify(output))
    }
    else
      res.status(500).send('Error ')     
  })
})
 

app.listen(3001, function () {
  console.log('App Listening on Port 3001')
})

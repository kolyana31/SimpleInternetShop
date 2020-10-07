const express       = require("express");
const fs            = require("fs");
const bodyParser    = require("body-parser");
const { response, query }  = require("express");
const { json }      = require("body-parser");
const mysql         = require("mysql2")
const DBconnect     = require("./database/localdb.json");
const isEmpty       = require("is-empty");
const crypto           = require("crypto-js");

const pool = mysql.createPool(DBconnect).promise();

const urlencodedPaser = bodyParser.urlencoded({extended:false});

const jsonParser = express.json();

function FillList(Destination, objects) {
    for (const itr of objects) {
        Destination.push(itr);
    }
}

function ProdReq(query,res) {
    pool.query(query)
    .then(([results,fields])=>{
        res.json(JSON.stringify(results));
    })
    .catch(err=>{
        console.log(err);
        res.sendStatus(500);
    })
}

const app = express();

app.use(express.static(__dirname));

app.get("/",(req,res)=>{
    res.sendFile("/index.html");
});

app.get("/login", (req,res)=>{
    res.sendFile(__dirname + "/pages/login.html")
})
app.post("/login", jsonParser, (req,res)=>{
    data = [req.body.Login, req.body.PASS];
    pool.query("Select userid, login, pass, role, UserHash from users where login = ? and pass = ?",
                data)
                .then(([results,fields])=>{
                    if (!isEmpty(results)) {
                        res.json({
                            "status": "Found",
                            "Id": results[0].userid,
                            "Login": results[0].login, 
                            "role": results[0].role,
                            "Hash": results[0].UserHash
                        });
                    }
                    else{
                        res.json({
                            "status": null
                        });
                    }
                })
                .catch(()=>{
                    console.log(err)
                });
});
app.post("/login/:Hash", (req,res)=>{
    pool.query("Select userid, UserFIO, login, pass, role from users where UserHash = ?",req.params.Hash)
                .then(([results,fields])=>{
                    res.json({
                        "status": "Found",
                        "Id": results[0].userid,
                        "Login": results[0].login, 
                        "role": results[0].role,
                        "FIO": results[0].UserFIO,
                        "Hash": results[0].UserHash
                    });
                })
                .catch(err=>{
                    console.log(err);
                    res.end();
                })
})
app.post("/register", jsonParser,async (req,res)=>{
    let regin = req.body;
    let role;
    let Hash = await crypto.HmacMD5(regin.userEmail+regin.userFIO,regin.userLogin).toString();
    
    if (regin.isSeller) {
        role = "seller";
    }
    else{
        role = "user"
    }
    pool.query(`insert into users (
        Email,
        UserFIO,
        Login,
        Pass,
        Phone,
        Organization,
        Role,
        UserHash) values (
            "${regin.userEmail}",
            "${regin.userFIO}",
            "${regin.userLogin}",
            "${regin.userPass}",
            "${regin.userPhone}",
            "${regin.Organisation}",
            "${role}",
            "${Hash}"
        );`).then(()=>{
            res.json({
                "status": "added",
                "added": true,
                "err": undefined
            });
        }).catch((err)=>{
            if (err) { 
                if (err.errno == 1062) {
                    res.json({
                        "status":"Registered",
                        "added": false,
                        "err": 1062
                    })
                    return;
                }
                console.log(err);
            };
        });
});



app.get("/catalog", (req,res)=>{
    res.sendFile(__dirname + "/pages/catalog.html")
})
app.post("/catalog",jsonParser,async (req,res)=>{
    let catalogFilterList = { manufacturs:[],
                    decoretypes:[],
                    materials:[],
                    transformmecanism:[],
                    types:[]};
    for (let key in catalogFilterList) {
        await pool.query(`Select * from ${key};`,)
        .then(([results, fields])=>{
            FillList(catalogFilterList[key],results);
            if (key === Object.keys(catalogFilterList)[Object.keys(catalogFilterList).length-1]) {
                res.json(JSON.stringify(catalogFilterList));
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
})


app.post("/products/",jsonParser, function(req,res) {
    let query = "select productid, name, price,avaragestar, photoPath from products";
    if (!isEmpty(req.body)) {
        query += ` where `;
        for (const itr of req.body) {
             if (itr.id && itr.param) {
                query+= ` ${itr.param}=${itr.id} `
             }
             else{
                query+=` Price >= ${itr.minPrice} and Price <= ${itr.maxPrice}`
             }
             if (!(itr == req.body[req.body.length-1])) {
                 query += " and ";
             } else {
                 query += ";"
             }
        }
    }
    ProdReq(query,res);
})
app.post("/products/:namePar",jsonParser, function(req,res) {
    let query = `select productid, name, price,avaragestar, photoPath from products where Name like "%${req.params["namePar"]}%"`;
    if (!isEmpty(req.body)) {
        query += ` and `;
        for (const itr of req.body) {
             if (itr.id && itr.param) {
                query+= ` ${itr.param}=${itr.id} `
             }
             else{
                query+=` Price >= ${itr.minPrice} and Price <= ${itr.maxPrice}`
             }
             if (!(itr == req.body[req.body.length-1])) {
                 query += " and ";
             } else {
                 query += ";"
             }
        }
    }
    ProdReq(query,res);
})

app.set("view engine", "hbs");

app.get("/products/:id", (req,res)=>{
    if(req.params.id != "favicon.ico"){
        pool.query(`
        select products.Productid,products.Name,products.price, products.storageamount,products.BoughtAmount,products.description,products.photopath,
               products.avaragestar,products.width,products.color,
               manufacturs.Name as "ManuName", types.Type as "TypeName",
               decoretypes.decoretype as "DecoreName", transformmecanism.Mechanism as "MechanisName",
               materials.Material as "MaterName", users.Organization as "Seller"        from products 
                left join manufacturs on products.manufactur=manufacturs.id   
                left join types on products.types=types.id 
                left join decoretypes on products.decoretypes=decoretypes.id 
                left join transformmecanism on products.transformmecanism=transformmecanism.id 
                left join materials on products.materials=materials.id 
                left join users on products.SellerId=users.UserId
                where ProductId = ${req.params.id};`)
        .then(([results,fields])=>{
            results = results[0];
            res.render(__dirname +"/pages/product.hbs", {
                prodName: results.Name,
                photo: "../"+results.photopath,
                storageamount: results.storageamount,
                Bought: results.BoughtAmount,
                seller: results.Seller,
                price: results.price,
                prodId: results.Productid,
                width: results.width,
                color: results.color,
                Manuf: results.ManuName,
                Type: results.TypeName,
                Decore: results.DecoreName,
                Mechanism: results.MechanisName,
                Material: results.MaterName,
                description: results.description
            });
        })
        .catch(err=>console.log(err));
    }  
})
app.post("/getcoments/:ProdId",(req,res)=>{
    pool.query(`SELECT coments.Stars,coments.Badpart,coments.GoodPart,Users.UserFIO as "FIO" 
                FROM coments
                left join users on coments.UserLeftId=users.UserId where coments.ProductId =${req.params.ProdId};`)
                .then(([results,fields])=>{
                    res.json(results);
                })
                .catch(err=>{
                    console.log(err);
                    res.end();
                })
})
app.post("/popularproducts", (req,res)=>{
    let query = "select productid, name, price,avaragestar, photoPath from products order by  (avaragestar+boughtamount) desc limit 5;";
    ProdReq(query, res);
})

app.get("/user/", (req,res)=>{
    res.sendFile(__dirname + "\\pages\\user.html");
})
app.post("/getuserinfo",jsonParser, (req,res)=>{
    pool.query(`select UserFIO,EMAIL,Login,Pass,Phone,Role from users where UserHash = "${req.body.hash}"`)
                .then(([results,fields])=>{
                    res.send(results[0]);
                })
                .catch(err=>{
                    console.log(err);
                })
})
app.post("/getbascket",jsonParser,(req,res)=>{
    if (!isEmpty(req.body)) {
        let query = `select ProductId,Name,Price,AvarageStar, PhotoPath,users.organization as Organization from products 
        left join users on products.SellerID=users.UserId where  `;
        for (let i = 0; i < req.body.length; i++) {
            if (req.body[i]) {
                query +=` ProductID="${req.body[i]}" `
                if (i<req.body.length-1) {
                    query += " or ";
                }
            }
        }
        pool.query(query)
            .then(([results,fields])=>{
                res.json(results);
            })
            .catch(err=>{
                console.log(query);
                console.log(err);
                res.end();
            })
    }
    else{
        res.end();
    }

})
app.post("/changeinfo" , jsonParser,(req,res)=>{
    if (!isEmpty(req.body)) {
        let query = `update users 
                set`;
            for (const key in req.body) {
                if (key != "hash" && !isEmpty(req.body[key])) {
                    query += ` ${key} = "${req.body[key]}" ,`
                }
            }
            query = query.substring(0, query.length - 1);
            query += ` where UserHash = "${req.body.hash}"`;
        pool.query(query)
            .then(([results,fields])=>{
                res.json({
                    "status":"Changed",
                    "added": true,
                    "err": null
                })
            })
            .catch(err=>{
                if (err) { 
                    if (err.errno == 1062) {
                        res.json({
                            "status":"Found",
                            "added": false,
                            "err": 1062
                        })
                        return;
                    }
                    console.log(err);
                };
            })
    }
})
app.post("/addcoment", jsonParser, (req,res)=>{
    let query = `INSERT INTO coments (Stars, BadPart, GoodPart, UserLeftID, ProductId)
    VALUES ("${req.body.rate}","${req.body.bad}","${req.body.good}",(select userid from users where UserHash="${req.body.hash}"),"${req.body.prodId}");`
    pool.query(query)
                .then(([results,fields])=>{
                    res.json({
                        err: null,
                        status: "added"
                    })
                })
                .catch(err=>{
                    console.log(err);
                    console.log(query);
                })
    console.log(req.body);
})

app.listen(3000);
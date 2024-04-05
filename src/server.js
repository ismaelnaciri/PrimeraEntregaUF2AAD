const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

port = 3080;

app.listen(port, () => {
  console.log(`Server listening to port : ${port}`);
});

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "isma",
  password: "IsmaElPro2002",
  database: "dam_ismael_naciri_fernandez",
  port: 3308
});

connection.connect((err) => {
  if (err) console.log(`Error | ${err.message}`);
  else console.log("Connected to MySQL!");
});
app.get("/operaris", (req, res) => {
  connection.query('SELECT * FROM operaris', (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

app.get("/seccions", (req, res) => {

  connection.query('SELECT * FROM seccions', (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

app.post("/createTable", (req, res) => {
  if (req.body) {
    let object = req.body;
    let tableName = object.tableName;

    let sql = `CREATE TABLE ${tableName}
               (
                 id      INT PRIMARY KEY AUTO_INCREMENT,
                 name    VARCHAR(45) NOT NULL,
                 embalat BOOLEAN DEFAULT false
               )`;

    connection.query(sql, (err, result) => {
      if (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log("Error: Possiblement la taula que vols crear ja existeix!");
        }
        console.error('Error creating table: ' + err.message);
        console.log(sql);
        res.status(500).send({
          message: 'Error: Possiblement la taula que vols crear ja existeix!'
        });
        return;
      }
      console.log('Table created successfully');
      res.status(200).send({
        message: 'Table created successfully'
      });
    });
  } else {
    res.status(400).send({
      message: 'Bad request'
    });
  }
});

app.post("/insertIntoAllTables", async (req, res) => {
  if (req.body) {
    let dataArray = req.body;

    await dataArray.forEach((element) => {
      let sql = `INSERT INTO ${element.tableName}
                 VALUES (?, ?, ?)`
      connection.query(sql,
        [element.value1, element.value2, element.value3],
        (err, rows) => {
          if (err) throw err;
          console.log("Informació de les dades: \n", rows);
        })
    });

    res.status(200).send({
      message: "Inserted correctly, check IDE"
    });

  } else {
    res.status(400).send({
      message: "Bad request, check if you're sending any data."
    });
  }
});

app.post("/updateValuesAllTables", async (req, res) => {
  if (req.body) {
    let dataArray = req.body;

    await dataArray.forEach((element) => {
      let sql = `UPDATE ${element.tableName}
                 SET ${element.column1} = ?
                 WHERE ${element.identifierCol} = ?`;
      connection.query(sql,
        [element.value1, element.identifierValue],
        (err, rows) => {
          if (err) {
            throw err;
          }
          console.log("Informació: \n", rows);
        });
    });

    res.status(200).send({
      message: "Updated Correctly, check IDE"
    });
  } else {
    res.status(400).send({
      message: "Bad request, please check the parameters"
    });
  }
});

app.get("/getTableValues", async (req, res) => {
  if (req) {
    let dataToShow = [];
    let id = req.query.id;
    let tables = ["isma_taula_ex5", "operaris", "seccions"];

    let promises = tables.map((element) => {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM ${element} WHERE id > ?`;
        connection.query(sql, [id], (err, rows) => {
          if (err) reject(err);
          else {
            dataToShow.push({
              table: element,
              data: rows,
            });
            console.log(`Data in ${element}:`, rows);
            resolve();
          }
        });
      });
    });

    await Promise.all(promises);

    console.log("Data to show:", dataToShow);

    res.status(200).send({
      message: "Query executed correctly",
      data: dataToShow,
    });
  } else {
    res.status(400).send({
      message: "Bad request. Skill issue"
    })
  }
});


app.delete("/deleteTableValue", async (req, res) => {
  if (req) {
    let id = req.query.id;
    let table = req.query.table;

    let sql = `DELETE FROM ${table} WHERE id < ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("Data: ", result);
      console.log("DELETED SUCCESSFULLY")
    });
  }

  res.status(200).send({
    message: "Deleted successfully"
  });
});


app.delete("/deleteTableValueWithError", async (req, res) => {
  if (req) {
    let id = req.query.id;
    let table = req.query.table;

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).send({ message: 'Error starting transaction' });
      }

      let sql = `DELETE FROM ${table} WHERE id < ${id}`;
      connection.query(sql, async (err, result) => {
        if (err) {
          console.error('Error executing delete query:', err);
          connection.rollback(() => {
            console.log('Transaction rolled back');
            res.status(500).send({ message: 'Error executing delete query' });
          });
        } else {
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              res.status(500).send({ message: 'Error committing transaction' });
            } else {
              console.log('Transaction committed successfully');
              res.status(200).send({ message: 'Deleted successfully' });
            }
          });
        }
      });
    });
  }
});

connection.end();

let pool = mysql.createPool({
  host: "127.0.0.1",
  user: "isma",
  password: "IsmaElPro2002",
  database: "dam_ismael_naciri_fernandez",
  port: 3308,
  connectionLimit: 5
});

pool.getConnection((err,connection)=> {
  if(err)
    throw err;
  console.log('Database connected successfully');
  connection.release();
});

app.get("/ex8Pool", async (req, res) => {
  if (req) {
    let id = req.query.id;
    let tables = ["isma_taula_ex5", "operaris", "seccions"];

    let promises = tables.map((element) => {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM ${element} WHERE id > ?`;
        pool.query(sql, [id], (err, rows) => {
          if (err) reject(err);
          else {
            console.log(`Data in ${element}:`, rows);
            resolve({ table: element, data: rows });
          }
        });
      });
    });

    try {
      let dataToShow = await Promise.all(promises);
      console.log("Data to show:", dataToShow);

      res.status(200).send({
        message: "Query executed correctly",
        data: dataToShow,
      });
    } catch (error) {
      console.error("Error fetching table values:", error);
      res.status(500).send({ message: "Error fetching table values" });
    }
  } else {
    res.status(400).send({
      message: "Bad request. Skill issue"
    });
  }
});

const express = require("express");
const app = express();
const port = 3001;
const mariadb = require("mariadb");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Swagger API Demo Week-07",
    version: "1.0.0",
  },
  
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});

// to get a single agent by id
/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     description: Returns agent details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns agent details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 AGENT_CODE:
 *                   type: string
 *                   description: The ID of the agent
 *                   example: A007
 *                 AGENT_NAME:
 *                   type: string
 *                   description: The name of the agent
 *                   example: Alfreds Futterkiste
 *                 WORKING_AREA:
 *                   type: string
 * */
app.get("/agents/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM agents WHERE AGENT_CODE = ?";
  pool
    .query(sql, [id])
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(404).send("Agent not found");
      console.log(err);
    });
});

// to get company details by id
/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     description: Returns company details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 COMPANY_ID:
 *                   type: string
 *                   description: The ID of the company
 *                   example: 18
 *                 COMPANY_NAME:
 *                   type: string
 *                   description: The name of the company
 *                   example: Order All
 *                 COMPANY_CITY:
 *                   type: string
 *                   description: The city where the company is located
 *                   example: Boston
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 */
app.get("/companies/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM company WHERE COMPANY_ID = ?";
  pool
    .query(sql, [id])
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(404).send("Company not found");
      console.log(err);
    });
});

// to get customer details by id
/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     description: Returns customer details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns customer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CUST_CODE:
 *                   type: string
 *                   description: The ID of the customer
 *                   example: C00013
 *                 CUST_NAME:
 *                   type: string
 *                   description: The name of the customer
 *                   example: Customer 3
 *                 CUST_CITY:
 *                   type: string
 *                   description: The city where the customer is located
 *                   example: London
 * */
app.get("/customers/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM customer WHERE CUST_CODE = ?";
  pool
    .query(sql, [id])
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(404).send("Customer not found");

      console.log(err);
    });
});


//create new swagger tag companies
/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: API for managing companies
 */

// get all companies
/**
 * @swagger
 * /companies:
 *   get:
 *     description: Get all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: Get all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the company
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the company
 *                     example: Order All
 *                   city:
 *                     type: string
 *                     description: The city where the company is located
 *                     example: Boston
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 * */
app.get("/companies", (req, res) => {
    const sql = "SELECT * FROM company ";
    pool
      .query(sql)
      .then((val) => {
        res.json(val);
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal server error" });
        console.log(err);
      });
  })
  
//post api to add new company details companyid, companyname, companycity
/**
 * @swagger
 * /companies:
 *   post:
 *     description: Add new company
 *     tags:
 *       - Companies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               COMPANY_ID:
 *                 type: string
 *                 description: The ID of the company
 *                 example: 18
 *               COMPANY_NAME:
 *                 type: string
 *                 description: The name of the company
 *                 example: Order All
 *               COMPANY_CITY:
 *                 type: string
 *                 description: The city where the company is located
 *                 example: Boston
 *     responses:
 *       201:
 *         description: Company added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company added successfully"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       409:
 *         description: Company already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company already exists"
 * */
app.post("/companies", (req, res) => {
  //   console.log(req.body);
  let { COMPANY_ID, COMPANY_NAME, COMPANY_CITY } = req.body;
  // sanitize input
  if (!COMPANY_ID || !COMPANY_NAME || !COMPANY_CITY) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  COMPANY_CITY = COMPANY_CITY.trim();
  COMPANY_ID = COMPANY_ID.trim();
  COMPANY_NAME = COMPANY_NAME.trim();

  // validate input
  if (
    typeof COMPANY_ID !== "string" ||
    typeof COMPANY_NAME !== "string" ||
    typeof COMPANY_CITY !== "string"
  )
    res.status(400).json({ message: "Invalid request" });

  // check if company already exists
  let sql = "SELECT * FROM company WHERE COMPANY_ID = ?";
  pool
    .query(sql, [COMPANY_ID])
    .then(([rows, fields]) => {
      if (rows) {
        res.status(409).json({ message: "Company already exists" });
        return;
      } else {
        sql =
          "INSERT INTO company (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) VALUES (?, ?, ?)";
        pool
          .query(sql, [COMPANY_ID, COMPANY_NAME, COMPANY_CITY])
          .then(() => {
            // send status code 201
            res.status(201).json({ message: "Company added successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
      console.log(err);
    });
});

// put api to update company details
/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     description: Update all company details
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the company to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               COMPANY_NAME:
 *                 type: string
 *                 description: The name of the company
 *                 example: Order All
 *               COMPANY_CITY:
 *                 type: string
 *                 description: The city where the company is located
 *                 example: Boston
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company updated successfully"
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 * */
app.put("/companies/:id", (req, res) => {
  let id = req.params.id;
  let { COMPANY_NAME, COMPANY_CITY } = req.body;


  // validate input
  if (!id) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (!COMPANY_NAME || !COMPANY_CITY) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }


  // sanitize input
  id = id.trim();
  COMPANY_CITY = COMPANY_CITY.trim();
  COMPANY_NAME = COMPANY_NAME.trim();

  // check if company already exists
  let sql = "SELECT * FROM company WHERE COMPANY_ID = ?";
  pool
    .query(sql, [id])
    .then(([rows, fields]) => {
      if (!rows) {
        res.status(404).json({ message: "Company not found" });
        return;
      } else {
        const sql =
          "UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? WHERE COMPANY_ID = ?";
        pool
          .query(sql, [COMPANY_NAME, COMPANY_CITY, id])
          .then(() => {
            res.json({ message: "Company updated successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
      console.log(err);
    });
});


// patch api update company details
/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     description: Update partial company details
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the company to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               COMPANY_NAME:
 *                 type: string
 *                 description: The name of the company
 *                 example: Order All
 *               COMPANY_CITY:
 *                 type: string
 *                 description: The city where the company is located
 *                 example: Boston
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company updated successfully"
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 * */
app.patch("/companies/:id", (req, res) => {
  let id = req.params.id;
  let { COMPANY_NAME, COMPANY_CITY } = req.body;

  // validate input
  if (!id ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  //both are empty
  if (!COMPANY_NAME && !COMPANY_CITY) {
    res.status(400).json({ message: "Missing required fields, atleast one field is required" });
    return;
  }

  // sanitize input
  id = id.trim();
  COMPANY_CITY = COMPANY_CITY ? COMPANY_CITY.trim(): null;
  COMPANY_NAME = COMPANY_NAME ? COMPANY_NAME.trim(): null;

  // check if company already exists
  let sql = "SELECT * FROM company WHERE COMPANY_ID = ?";
  pool.query(sql, [id])
    .then(([rows, fields]) => {
      if (!rows) {
        res.status(404).json({ message: "Company not found" });
        return;
      } else {
        console.log(rows);
        if(COMPANY_CITY ===null){
            COMPANY_CITY = rows.COMPANY_CITY;
        }
        if(COMPANY_NAME ===null){
            COMPANY_NAME = rows.COMPANY_NAME;
        }

        const sql = "UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? WHERE COMPANY_ID = ?";
        pool.query(sql, [COMPANY_NAME, COMPANY_CITY, id])
          .then(() => {
            res.json({ message: "Company updated successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
      console.log(err);
    });
});


// delete api to delete company details
/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     description: Delete company
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the company to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company deleted successfully"
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 * */
app.delete("/companies/:id", (req, res) => {
  let id = req.params.id;

  // validate input
  if (!id) {
    res.status(400).json({ message: "Missing required field" });
    return;
  }
  // sanitize input
  id = id.trim();

  // check if company already exists
  let sql = "SELECT * FROM company WHERE COMPANY_ID = ?";
  pool.query(sql, [id])
    .then(([rows, fields]) => {
        
      if (!rows) {
        res.status(404).json({ message: "Company not found" });
        return;
      } else {
        sql = "DELETE FROM company WHERE COMPANY_ID = ?";
        pool.query(sql, [id])
          .then(() => {
            res.json({ message: "Company deleted successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
      console.log(err);
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://64.225.20.25:${port}/agents`);
  });


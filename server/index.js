const express = require("express");
const next = require("next");
const routes = require("../routes");
const bodyParser = require("body-parser");
const moment = require("moment");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = routes.getRequestHandler(app);

const NodeCouchDb = require("node-couchdb");

require("dotenv").config({ path: "variables.env" });

const couch = new NodeCouchDb({
  host: process.env.DBHOST,
  auth: {
    user: process.env.DBUSER,
    pass: process.env.DBPASS
  }
});
couch.Promise = global.Promise;

const dbName = process.env.DBNAME;

moment.locale("pt-br");

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    /* Get all active diapers */
    server.get("/api/diapers", (req, res) => {
      const viewUrl = "_design/diapers/_view/active?descending=true";

      couch
        .get(dbName, viewUrl)
        .then(
          ({ data, headers, status }) => res.json(data.rows),
          err => res.json(err)
        );
    });

    /* Get diaper by id */
    server.get("/api/diaper/:id", (req, res) => {
      const _id = req.params.id;

      couch
        .get(dbName, _id)
        .then(
          ({ data, headers, status }) => res.json(data),
          err => res.json(err)
        );
    });

    /* Add a new model */
    server.post("/api/diaper/add", (req, res) => {
      couch.uniqid().then(ids => {
        const _id = ids[0];

        couch
          .insert(dbName, {
            _id,
            type: "diaper",
            description: "",
            purchasedQty: 0,
            purchasedTimes: [],
            ...req.body,
            deleted: false
          })
          .then(
            ({ data, headers, status }) => res.json(data),
            err => res.send(err)
          );
      });
    });

    /* Edit an existent diaper */
    server.post("/api/diaper/add/:id", (req, res) => {
      const _id = req.params.id;

      couch.get(dbName, _id).then(
        ({ data, headers, status }) => {
          couch
            .update(dbName, {
              ...data,
              ...req.body
            })
            .then(
              ({ data, headers, status }) => res.json(data),
              err => res.json(err)
            );
        },
        err => res.json(err)
      );
    });

    /* Delete(hide from user) a diaper */
    server.post("/api/diaper/delete", (req, res) => {
      const _id = req.body.id;

      couch.get(dbName, _id).then(
        ({ data, headers, status }) => {
          couch
            .update(dbName, {
              ...data,
              deleted: true
            })
            .then(
              ({ data, headers, status }) => res.json(data),
              err => res.json(err)
            );
        },
        err => res.json(err)
      );
    });

    /* Buy a diaper */
    server.post("/api/diaper/buy/:id", (req, res) => {
      const _id = req.params.id;

      console.log(`${moment().format("YYYY-MM-DD HH:mm:ss")}`);

      couch.get(dbName, _id).then(
        ({ data, headers, status }) => {
          data.purchasedTimes.push(`${moment().format("YYYY-MM-DD HH:mm:ss")}`);
          couch
            .update(dbName, {
              ...data
              // availableQty: data.availableQty - 1,
              // purchasedQty: data.purchasedQty + 1,
            })
            .then(
              ({ data, headers, status }) => res.json(data),
              err => res.json(err)
            );
        },
        err => res.json(err)
      );
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.use(function(err, req, res, next) {
      if (err.name === "UnauthorizedError") {
        res.status(401).send({
          title: "Unauthorized",
          detail: "Unauthorized Access"
        });
      }
    });

    server.use(handle).listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

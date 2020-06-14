import express from "express";
export class ServerRun {
  constructor() {
    const app = express();
    const port = 3000;

    app.get("/payment/success", (req, res) => res.send("successful payment"));
    app.get("/payment/cancel", (req, res) => res.send("canceled payment"));

    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  }
}

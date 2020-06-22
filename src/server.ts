import express from "express";
import newrelic from "newrelic";
import exphbs from "express-handlebars";
import { Stripe } from "stripe";
import { SubscriptionMD } from "./Models/subscriptionState";
import path from "path"
const stripe = new Stripe(process.env.STRIPE_STOKEN, {
  apiVersion: "2020-03-02"
});

export class ServerRun {
  constructor() {
    const app = express();
    const port = process.env.PORT || 3000;
    const domain = (process.env.PRODUCTION == "True") ? "https://hacker-io-discord.herokuapp.com/" : `http://localhost:${port}`

    app.set('views', "src/views")


    app.engine('hbs', exphbs({ extname: ".hbs" }));
    app.set('view engine', 'hbs');
    
    (process.env.PRODUCTION == "True") ? 
    app.use(express.static(path.join(__dirname, '../src/public'))) :
    app.use(express.static(path.join(__dirname, '/public')))

    app.get("/", (req, res) => {
     res.render("home")
    });


    app.get("/subscription/cancel/:subscriptionID", (req, res) => {
      const subscriptionID = (req.params.subscriptionID as string)
      stripe.subscriptions.del(subscriptionID).then(
        updated => {
          // Cancel subscription
          SubscriptionMD.findOneAndDelete({
            subscriptionID
          }).exec().then(
            () => res.send("Subscription canceled")
          )
        }
      )
    });
    app.get("/payment", (req, res) => {
      try {
        const sessionId = req.query.checkout_session_id
        const STRIPE_PK = process.env.STRIPE_PTOKEN
        res.render('payment', {
          sessionId,
          STRIPE_PK
        })
      } catch {
        res.redirect("/payment/cancel?error=checkoutSessionID")
      }
    });

    app.get("/payment/success", (req, res) => {
      const session_id = (req.query.session_id as string)
      stripe.checkout.sessions.retrieve(session_id).then(sessionRes => {
        stripe.subscriptions.retrieve((sessionRes.subscription as string)).then(subRes => {
          if (subRes.status == "active") {
            SubscriptionMD.findOneAndUpdate({
              custumerID: (sessionRes.customer as string)
            }, {
              sessionID: sessionRes.id,
              subscriptionID: subRes.id
            }).then(() => res.render('paymentSuccess', {discordID: sessionRes.metadata.discordID})).catch(e => console.warn("SAVE Payment ERROR",subRes.id ))

          } else {
            res.redirect("/payment/cancel?error=subscriptionNotActive")
          }
        })

      }).catch(err => {
        res.redirect("/payment/cancel?error=checkoutSessionID")
      })
    });
    app.get("/payment/cancel", (req, res) => {
      const errorCode = (req.params.error as string)
      res.render('paymentFailed', {errorCode, 
        helpers: {
          eq: function (a: string, b: string, options: any) { return (a == b) ? options.fn(this) : options.inverse(this); }
      }})
    });
  
    app.listen(port, () =>
      console.log(`API app listening at ${domain}`)
    );
  }
}

// require('dotenv').config()
import { Database } from "./Database";


new Database();
new ServerRun();

// ©Isaac Diaby 2019
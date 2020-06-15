import { Schema, model, Document, Model } from "mongoose";

const SubscriptionSchema = new Schema({
    custumerID: { type: String, required: true, index: true },
    sessionID: { type: String, unique: true  },
    subscriptionID: { type: String, unique: true},
    createdDate: { type: Date, default: Date.now },
})
export interface ISubscriptionData {
    custumerID:string;
    sessionID: string;
    subscriptionID: string;
    createdDate: Date;
}
    
interface ISubscriptionDataDoc extends Document, ISubscriptionData {}


export const SubscriptionMD: Model<ISubscriptionDataDoc> = model("Subscription", SubscriptionSchema, "Subscriptions");
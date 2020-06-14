import { Schema, model, Model, Document } from "mongoose";

const logSchema = new Schema(
  {
    type: { type: String, required: true },
    time: { type: Date, required: true },
    cashDif: { type: Number },
    des: { type: String, lowercase: true }
  },
  { _id: false }
);
const userSchema = new Schema({
  userID: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  log: {
    type: [logSchema],
    default: []
  },
  ip: {
    type: String,
    unique: true,
    required: true,
    index: true,
    default: uuidv4()
  },
  online: { type: Boolean, default: true },
  playerStat: {
    elite: { type: Boolean, default: false },
    eliteExpireDate: { type: Date, default: null },
    outcast: { type: Boolean, default: false },
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    opt_in: { type: Boolean, default: false }
  },
  crypto: { type: Number, default: 1500 },
  level: {
    current: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }
  },
  inHack: {
    hackID: { type: Schema.Types.ObjectId, ref: "CurrentHacks", default: null },
    isInHack: { type: Boolean, default: false },
    lastHack: { type: Date, default: null }
  },
  ingame: {
    gameID: { type: Schema.Types.ObjectId, ref: "Game", default: null },
    isInGame: { type: Boolean, default: false },
    lastGame: { type: Date, default: null }
  }
});

export interface Ilog {
  type: "HACKED" | "SCAN" | "GAVE" | "ERROR" | "TOOK" | "LOST" | "DEFENDED";
  time: Date | number;
  cashDif: number;
  des: string;
}

export interface IUserState {
  userID: string;
  ip: string;
  online: Boolean;
  log: Ilog[];
  inHack: {
    hackID: string;
    isInHack: boolean;
    lastHack: Date;
  };
  ingame: {
    gameID: string;
    isInGame: boolean;
    lastGame: Date;
  };
  level: {
    current: number;
    xp: number;
  };
  crypto: number;
  playerStat: {
    elite: Boolean;
    opt_in: Boolean;
    eliteExpireDate: Date;
    outcast: Boolean;
    wins: number;
    loses: number;
    streak: number;
    joinedDate: Date;
  };
}
export interface IUserStateDoc extends IUserState, Document {}

// all instances will have acces to this when doing UserMD.findOne().byUserID('usersID')
userSchema.statics.byUserID = function(userID: string, cb: void) {
  return this.findOne({ userID }, cb);
};

export const UserMD: Model<IUserStateDoc> = model("User", userSchema, "Users");

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

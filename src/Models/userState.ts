import { Schema, model, Model, Document } from "mongoose";

const logSchema = new Schema<Ilog>(
  {
    type: { type: String, required: true },
    time: { type: Date, required: true },
    cashDif: { type: Number },
    des: { type: String, lowercase: true }
  }
  // ,{ _id: false }
);
const inHackSchema = new Schema ({
  hackID: { type: Schema.Types.ObjectId, ref: "CurrentHacks", default: null },
  isInHack: { type: Boolean, default: false },
  lastHack: { type: Date, default: null }
})
const ingameScheme = new Schema ({
  gameID: { type: Schema.Types.ObjectId, ref: "Game", default: null },
  isInGame: { type: Boolean, default: false },
  lastGame: { type: Date, default: null }
})
const playerStatisticsScheme= new Schema ({
  elite: { type: Boolean, default: false },
  eliteExpireDate: { type: Date, default: null },
  outcast: { type: Boolean, default: false },
  wins: { type: Number, default: 0 },
  loses: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  opt_in: { type: Boolean, default: false }
})
const levelScheme = new Schema ({
  current: { type: Number, default: 1 },
  xp: { type: Number, default: 0 }
})

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const userSchema = new Schema<IUserState>({
  userID: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  custumerID: {
    type: String,
    unique: true,
    index: true,
    default: null
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
  playerStat: {type: playerStatisticsScheme, default: {}},
  crypto: { type: Number, default: 1500 },
  level: {type: levelScheme, default: {}},
  inHack: {type: inHackSchema, default: {}},
  ingame: {type: ingameScheme, default: {}}
});

export interface Ilog {
  type: "HACKED" | "SCAN" | "GAVE" | "ERROR" | "TOOK" | "LOST" | "DEFENDED";
  time: Date | number;
  cashDif: number;
  des: string;
}

export interface IUserState {
  userID: string;
  custumerID: string;
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
// export interface IUserStateDoc extends Document<IUserState> {}

// all instances will have acces to this when doing UserMD.findOne().byUserID('usersID')
userSchema.static('byUserID', function(userID: string, cb: void) {
  //@ts-ignore
  return this.findOne({ userID }, cb);
})

export const UserMD: Model<IUserState> = model("User", userSchema, "Users");

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique:true
  },
  username: {
    type: String,
    trim: true,
    unique: [true, "username must be unique"],
    default: `user${Date.now()}`,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [6, "min length is 6 charcters"],
  },
  avatar: {
    type: String,
    default:
      "https://www.esadealumni.net/sites/default/files/styles/detail_modal_autoheight/public/equipo/2023-02/AvatarNotFound_30_7_1.png?itok=1_XIAV4e",
  },

}
  , {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const { password } = this.getUpdate();
  if (!password) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    this.getUpdate().password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});



module.exports = mongoose.model('User', userSchema);
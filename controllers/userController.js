const userDataDb = require("../models/userSchema");
const accessTokenDb = require("../models/accessToken");
const addressDataDb = require("../models/addresses");
const forgotDB = require("../models/passwordResetToken");
const jwt = require("jsonwebtoken");
const path = require("path");
const secret = require("../config");
const bcrypt = require("bcrypt");
const transporter = require("../emailTransporter/emailTransporter");
const cloudinary = require("cloudinary").v2;
const cloudinaries = require("../onlineStorageCloudinary/cloudinary");
const userData = require("../models/userSchema");

//create main model
const userdatas = userDataDb;
const accessdata = accessTokenDb;
const Addressess = addressDataDb;
const forgotPassDB = forgotDB;


//main work

//---------------------API for creating a User---------------------------------

const registerUser = async (req, res) => {
  const { firstName, lastName, userName, email_id, password, confirmPassword } =
    req.body;
  try {
    if (password == confirmPassword) {
      let usersEmail = await userdatas.findOne({
        where: { email_id: email_id },
      });
      console.log(usersEmail)
      if (usersEmail == null) {
        let userNsame = await userdatas.findOne({
          where: { userName: userName },
        });
        if (userNsame == null) {
          //generate hash password
          const salt = await bcrypt.genSalt(10);
          const passwords = await bcrypt.hash(password, salt);
          console.log(passwords);
          let users = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email_id: email_id,
            password: passwords,
            confirmPassword: passwords,
          };
          const data = await userdatas.create(users);
          res.status(200).send({
            msg: "user has been registered successfully",
            data: data,
          });
          var mailOptions = {
            from: "vikashverma209200@gmail.com",
            to: "vikashverma209200@gmail.com",
            subject: "sending email using node.js",
            text: "New user is registered in our database",
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent:" + info.response);
            }
          });
        } else {
          res.send("This user name is already present");
        }
      } else {
        res.send("This email_id already exist");
      }
    } else {
      res.send("password does not match with confirm password");
    }
  } catch (error) {
    console.log(error);
  }
};

//-------------------------------API for login a user----------------------------------

const userLogin = async (req, res) => {
  const name = req.body.userName;
  const pass = req.body.password;
  try {
    let userdata = await userdatas.findOne({where:{ userName: name }});

    const isMatch = await bcrypt.compare(pass, userdata.password);
    if (isMatch) {
      const date1 = await userdatas.findOne({
        where: { userName: name }, // Your filters here
      });
      console.log(date1.id);
      let date = new Date();
      const token = jwt.sign(
        { user_id: userdatas.id, email_id: userdatas.email_id },
        secret.jwtSecret,
        { expiresIn: "1hr" }
      );
      let access = {
        user_id: date1.id,
        access_token: token,
      };
      const info = await accessdata.create(access);
      res.status(200).json({
        message: "User found",
        accessInfo: info,
        data:date1,
      });
    } else {
      res.status(500).send("login unsuccessfull");
    }
  } catch (error) {
    console.log(error);
  }
};


//---------------------------delete user Information----------------------------

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await userdatas.destroy({ where: { id: id } });
    res.send("user data has been deleted");
  } catch (error) {
    res.send("user data has not been deleted");
  }
};

//---------------------------API for pagination--------------------------------------

const userPagination = async (req, res) => {
  try {
    const { page } = req.params;
    let limits = 10;

    const data = await userdatas.findAll({
      offset: page * limits - limits,
      limit: limits,
    });
    res.json({ data });
  } catch (error) {
    res.json({ message: error });
  }
};

//------------------------Api for giving addressess-----------------------------------
//----------------------------one-to-many----------------------------------------------

const addAddress = async (req, res) => {
  try{
    const tokens = await accessdata.findOne({
      where: { access_token: req.body.access_token },
    });
    if (tokens) {
      let addresses = {
        user_id: req.body.user_id,
        user_city: req.body.user_city,
        user_state: req.body.user_state,
        user_pincode: req.body.user_pincode,
        user_phoneNo: req.body.user_phoneNo,
      };
      const address = await Addressess.create(addresses);
      res.status(200).send(address);
    } else {
      res.status(400).send({ success: false, msg: "Invalid access_token" });
    }
  }catch(error){
    console.log(error);
  }
};

//------------------------getUserInformation with Address------------------------------

const getUserAddress=async(req,res)=>{
  let userdata = await userdatas.findAll({
    include:[{
      model:Addressess,
      as:'address'
    }],
    where:{id:1}
  });
res.status(200).send(userdata);
}


//--------------------------------delete userAddress------------------------------------------

const deleteAddress = async (req, res) => {
  try {
    const id = req.body.user_id;
    console.log(id);
    await Addressess.destroy({ where: { user_id: id } });
    res.send("Address has been deleted");
  } catch (error) {
    res.send("Address has not been deleted");
  }
};

//-----------forgot verify the user and generate a password reset token-------------------------

const generateToken = async (req, res) => {
  const username = req.body.userName;
  try {
    const userVerify = await userdatas.findAll({
      where: { userName: username },
    });
    if (userVerify) {
      let date = new Date();
      const token = jwt.sign(
        { email_id: userVerify.email_id },
        secret.jwtSecret,
        { expiresIn: "10m" }
      );
      let Tokens = {
        password_Access_Token: token,
      };
      const data1 = await forgotPassDB.create(Tokens);
      res.status(200).json({ Access_Token: data1 });
      var mailOptions = {
        from: "vikashverma209200@gmail.com",
        to: "vikashverma209200@gmail.com",
        subject: "sending email using node.js",
        text: "New user is registered in our database",
        html: `<p>Click <a href="http://localhost:3000/verify-reset-password/' + ${token} + '">here</a> to reset your password</p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent:" + info.response);
        }
      });
    } else {
      res.status(400).json({ success: false, msg: "userName not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

//-------------verify the password reset token and reset the password--------------------

const resetPassword = async (req, res) => {
  const { Password_Access_Token } = req.params;
  const userName = req.body.userName;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const isMatch = await forgotPassDB.findOne({
    where: {
      password_Access_Token: Password_Access_Token,
    },
  });
  console.log(isMatch);
  if (password == confirmPassword) {
    if (isMatch != null) {
      const salt = await bcrypt.genSalt(10);
      const passwords = await bcrypt.hash(password, salt);
      const updateData = await userdatas.update(
        { password: passwords, confirmPassword: passwords },
        { where: { userName: userName } }
      );
      console.log(updateData);
      await forgotPassDB.destroy({
        where: {
          password_Access_Token: Password_Access_Token,
        },
      });
      res.status(200).json({ success: true, msg: "Password has been changed" });
      var mailOptions = {
        from: "vikashverma209200@gmail.com",
        to: "vikashverma209200@gmail.com",
        subject: "sending email using node.js",
        text: "Your password has been changed successfully",
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent:" + info.response);
        }
      });
    } else {
      res
        .status(400)
        .json({ success: false, msg: "Password_Reset_Token is not verified" });
    }
  } else {
    res.status(400).json({ success: false, msg: "Password_Does not match" });
  }
};

//----------------------------upload image API---------------------------------------

const uploadImage = async (req, res) => {
  let fileName = Date.now() + "_" + req.files.profile.name;
  let newPath = path.join(process.cwd(), "uploads", fileName);
  req.files.profile.mv(newPath);
  console.log(req.files);
  res.status(200).json(req.files);
};

//------------------------upload image in online storage--------------------------------

const uploadImageOnline = async (req, res) => {
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log(result);
  });
};

module.exports = {
  registerUser,
  userLogin,
  deleteUser,
  userPagination,
  getUserAddress,
  addAddress,
  deleteAddress,
  generateToken,
  resetPassword,
  uploadImage,
  uploadImageOnline,
};

const userController=require('../controllers/userController')
const multer=require('multer')

//set storage of image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix=Date.now()+'_'+Math.round(Math.random()*1E9)
      cb(null, file.originalname+'_'+uniqueSuffix)
    }
  })
  var upload = multer({ storage: storage })





const router=require('express').Router()

//---------route for creating a user---------

router.post('/register',userController.registerUser)

//----------route for login a user-------------

router.post('/login',userController.userLogin)

//-----------route for deleting the user by id------------

router.delete("/delete/:id", userController.deleteUser);

//-------------route for pagination-----------------

router.get("/list/:page", userController.userPagination);

//---------route for add address of users--------------

router.post("/addAddress", userController.addAddress);

//------route for get userInformation with Address--------

router.get("/getAddress", userController.getUserAddress);

//---------route for deleting user Address----------------

router.delete("/deleteaddress", userController.deleteAddress);

//-------route for generate a token for reset a password--------

router.post("/forgotPassword",userController.generateToken);

//---------route for create a new password for user---------------

router.post('/verify-reset-password/:Password_Access_Token',userController.resetPassword);

//-------------route for upload a image in folder---------------------

router.post('/profile-upload-single', upload.single('profile-file'),userController.uploadImage);


module.exports=router
const cloudinary=require('cloudinary').v2

var cloudinaries=cloudinary.config({ 
    cloud_name: 'excellences-technology', 
    api_key: '955885373825121', 
    api_secret: 'zPJL3O4tvucxKPXrhgO2_DN5eBg',
    secure: true
  });

  module.exports={cloudinaries};
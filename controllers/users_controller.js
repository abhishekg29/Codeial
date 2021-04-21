const User=require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(req,user){
        return res.render('user_profile',{
            title:"User Profile",
            profile_user:user
        });
    });
}

module.exports.update=  function(req,res){
    if(req.user.id==req.params.id)
    {
       // try{

            let user = User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('--Multer Error--',err);}

                user.name= req.body.name;
                user.email= req.body.email;

                if(req.file)
                {
                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //This is saving the path of the uploaded file into the avatar field in the user
                    user.avatar= User.avatarPath + '/' + req.file.filename ;
                }
                user.save();
                return res.redirect('back');
            });
            
       // } 
       // catch(err) 
        {
        //    req.flash('error',err);
        //    return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}


//Render the sign up page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}

//Render the sign in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}

//Get the signup data 
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            console.log("Error in finding user during Signing Up");
            return;
        }
        
        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err)
                {
                    console.log("Error in creating user during Signing Up");
                    return;
                }
                return res.redirect('/users/sign-in');   
            });
        }

        else{
            return res.redirect('back');
        }

    });
}

//Sign in and create the session for the user 
module.exports.createSession=function(req,res){
    req.flash('success','logged in successfully');
    return res.redirect('/');
}

//sign-out
module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','You have logged Out');

    return res.redirect('/');
}

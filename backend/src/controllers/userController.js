const jwt = require('jsonwebtoken');
const {User,Token,DoctorSpecialty} = require('./../database/models')
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const dotenv = require('dotenv');
const { Op, where } = require('sequelize');
const { mail } = require('../utils/email');
dotenv.config();

// Generate JWT
const generateToken = (id) => {
  return  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
// register user public
const registerUser = async (req, res) => {
 try {
  const { name, email, password, gender, role, specialties } = req.body;

  // Validation
  if (!name || !email || !password || !gender || !role ) {
    return res.status(400).json({
      message:"Please add all fields"
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      message:'Please Enter a valid email address.'
    })
    }
  if (password.length < 8) {
    return res.status(400).json({
      message:"Password must be up to 8 characters long"
    });
  }
  if (role === "doctor" && (!specialties || specialties.length === 0)) {
    return res.status(400).json({
      message: "Please select at least one specialty",
    });
  }

  // Check if user email already exists
  const userExists = await User.findOne({ where:{email:email} });

  if (userExists) {
    return res.status(400).json({
      message:"Email already taken",
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    gender,
    role,
  });

  if (role === "doctor" && specialties) {  
    const specialtiesPromises = await specialties.map(specialty => 
      DoctorSpecialty.create({ userId: user.id, specialty })
    );
    await Promise.all(specialtiesPromises);
  }
  //   Generate Token
  const token =  generateToken(user.id); 
  if (user) {  
    const data = {
      id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        zipcode: user.zipcode || '',
        street: user.street || '',
        gender: user.gender,
        dob: user.dob || '',
        token,
        role: user.role,
    }
    return  res.status(201).json({
      "user":data,
      message: "User Registered successfully",
    });
  } else {
    return res.status(400).json({
      message:"Invalid user data"
    });
  }
 } catch (error) {  
   return res.status(400).json({
    message:"Internal Server Error"
  });
 }
};
// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    return res.status(400).json({
    message:"Please add email and password",
  });
  }

  // Check if user exists
  const user = await User.findOne({
    where: {
    email:email
  } });

  if (!user) {
    return res.status(400).json({
     message:"User not found, please signup",
   });
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token =  generateToken(user.id);
  if (user && passwordIsCorrect) {
    const {
      id,
      name,
      email,
      phone,
      city,
      state,
      zipcode,
      street,
      gender,
      dob,
      role,
    } = user;
  return  res.status(200).json(
    {
      id,
      name,
      email,
      phone,
      city,
      state,
      zipcode,
      street,
      gender,
      dob,
      token,
      role,
    }
  );
  } else {
   return res.status(400).json({
    message:"Invalid email or password"
   });
  }
  } catch (error) {
    return res.status(400).json({
      message:"Invalid email or password"
    });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const { name, phone, city, state, zipcode, street, gender, dob } = req.body;

    // Find user by ID
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (user) {
      // Update user fields
      const updatedUser = await user.update({
        name: name || user.name,
        phone: phone || user.phone,
        city: city || user.city,
        state: state || user.state,
        zipcode: zipcode || user.zipcode,
        street: street || user.street,
        gender: gender || user.gender,
        dob: dob || user.dob,
      });

      const data = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        state: updatedUser.state,
        zipcode: updatedUser.zipcode,
        street: updatedUser.street,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        token: generateToken(updatedUser.id),
        role: updatedUser.role,
              }
      return res.status(200).json({
        message:"User updated successfully",
       "user":data
      });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Internal server error" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { name, phone, city, state, zipcode, street, gender, dob, email,newPassword, confirmPassword } = req.body;
    
    const { id } = req.params;

    // Find user by ID
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
   
    // Check if the new email is unique (if email is being updated)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use by another user." });
      }
    }


   // Create an object with fields to be updated
   const updateFields = {
    name: name || user.name,
    phone: phone || user.phone,
    city: city || user.city,
    state: state || user.state,
    zipcode: zipcode || user.zipcode,
    street: street || user.street,
    gender: gender || user.gender,
    dob: dob || user.dob,
    email: email || user.email,
  };
  
  // Handle password update logic
  if (newPassword) {
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Set the new password
    updateFields.password = newPassword; // Password will be hashed in the model
  }

  // Update user fields
  const updatedUser = await user.update(updateFields);

    const data = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      city: updatedUser.city,
      state: updatedUser.state,
      zipcode: updatedUser.zipcode,
      street: updatedUser.street,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      role: updatedUser.role,
    };

    return res.status(200).json({
      message: "User updated successfully",
      user: data
    });
  } catch (error) {    
    return res.status(400).json({ message: "Internal server error" });
  }
};


// change password public
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findOne({
          where: {
            id: req.user.id
          }
      });  

  if (!user) {
    return res.status(400).json({
    message:"User Not Found Please signup",
  })
  }
  //Validate
  if (!current_password) {
    return res.status(400).json({
     message:"Please add current  password",
   });
    }
    
    if (!new_password) {
      return res.status(400).json({
       message:"Please add current  password",
     });
    }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(current_password, user.password);

  // Save new password
  if (passwordIsCorrect) {   
    await user.update({
      password:new_password
    });
   return  res.status(200).json({     
      message: "Password changed successfully"
    });
  } else {
    return res.status(400).json({
     message:"Old password is incorrect",
   });
  }
  } catch (error) {
    return res.status(400).json({
      message:'Something went wrong'
    })
  
 }
};
// forgot password public
const forgotPassword = async (req, res) => {  
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message:'Please provide email address'})
    }
  const user = await User.findOne({
    where: {
      email: email,
    }
  });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist please signup!⚠️"
    });
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({
    where: {
      userId: user.id
    }
  });

    if (token === null) { } else {      
      await token.destroy();
    }
    

  // Create Reste Token
  let resetToken =  crypto.randomBytes(32).toString("hex") + user.id; 

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await Token.create({
    userId: user.id,
    token: hashedToken,
    createdAt: Date.now(),
    expiryDate: Date.now() + 30 * (60 * 1000), // 30 mins
  });

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Reset Email
  const message = `
      <h2>Hello ${user.name}</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30 minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards</p>
      <p>${process.env.APP_NAME} Team</p>
    `;
  const subject = "Password Reset Request"; 
    // await sendEmail(subject, message, send_to, sent_from);
   await mail(user.email, subject, message);
    return res.status(200).json({ message: "Check your email address to reset your password" });
  
  } catch (error) {   
    return res.status(400).json({
      message:"Something went wrong, please try again" 
    });
  }
};
// reset password public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({message: 'Please Provide Your New Password'})
    }
    const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiryDate: {[Op.gt]: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({
   message: "Invalid or Expired Token"  
   })
   
  }

  // Find user
    const user = await User.findOne({
    where:{id:userToken.userId}
  });
  if (!user) {
    return res.status(400).json({
      message:"User not found"
    })    
  }
  
    // save user password
  user.password = password;
  await user.save();

  // Delete the token from the database after successful password reset
  await userToken.destroy();
  return res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
  } catch (error) {
    return res.status(400).json({
     message:"Something went wrong in resetting password"
   }) 
  }
}
// get users private
const getUsers = async (req, res) => {
  try {
    let users = await User.findAll();
    if(users){
      const formattedUsers = users.map(user => {        
        return {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
          phone: user.phone || '',
          gender: user.gender || '',
          dob: user.dob || '',
          street: user.street || '',
          city: user.city || '',
          zipcode: user.zipcode || '',
          state: user.state || '',
          createdAt: user.createdAt || null,
          updatedAt:user.updatedAt || null,
        };
      });
    users = formattedUsers
      return res.status(200).json(users);
    } else {
      return res.status(200).json({
        users:[],
      })
    }
  } catch (error) {    
    return res.status(400).json({
      message:'Error in fetching users',
    })
  }
}
// add user private by admin
const addUser = async (req, res) => {
  try {  
  const { name, email, password, role, phone, dob, gender, street, city, state, zipcode,specialties } = req.body;
  console.log(specialties)
  if (!name) {
    return res.status(400).json({
      message:'name field is required'
    });
   }
   
   if (!email) {
    return res.status(400).json({
      message:'email field is required'
    });
   }
   if (!password) {
    return res.status(400).json({
      message:'password field is required'
    });
   }
   
   if (!gender) {
    return res.status(400).json({
      message:'gender field is required'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      message:'Please Enter a valid email address.',
    })
    }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be up to 8 characters",
    });
   }
   
   if (!role) {
    return res.status(400).json({
      message:'role field is required'
    });
   }   
   if (role === 'doctor' && (!specialties || !Array.isArray(specialties) || specialties.length === 0)) {
    return res.status(400).json({
      message: 'Please select at least one specialty'
    });
  }



  // Check if user email already exists
  const userExists = await User.findOne({ where:{email:email} });

  if (userExists) {
    return res.status(400).json({
      message:"Email already taken",
    });
   }   

  // Create new user
  const _user = await User.create({
    name,
    email,
    password,
    role,
    phone, 
    gender,
    dob,
    street,
    city,
    zipcode,
    state,    
  });

// Handle specialties if role is doctor
if (role === 'doctor' && specialties) {
  const specialtiesPromises = specialties.map(specialty =>
    DoctorSpecialty.create({ userId: _user.id, specialty })
  );
  await Promise.all(specialtiesPromises);
}

    const data = {
    id:_user.id,
    name:_user.name,
    email:_user.email,  
    role:_user.role,
    phone:_user.phone || "", 
    gender:_user.gender || "",
    dob:_user.dob || '',
    street:_user.street || "",
    city:_user.city || "", 
    zipcode:_user.zipcode || "",
    state: _user.state || "", 
    createdAt: _user.createdAt || null,
    updatedAt:_user.updatedAt || null,
  }
    return res.status(201).json({
      user: data,
      message:'User created successfully'
    });

   
  } catch (error) {
    // console.log(error)
   return res.status(400).json({
     message:"Error in creating user"
   })
 }
}



// delete user by admin private
const deleteUser = async(req, res) => {
  try {
    const { id } = req.params; 
    if (String(req.user.id) === String(id)) {
      return res.status(403).json({ message: 'Unauthorized action: You cannot delete your own account.' });
    }
    const user =   await User.findOne({
      where:{id}
    });   
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully', id:id });
    
  } catch (error) {
    return res.status(400).json({
      message:'Error in deleting user',
    })
  }
}
const getUser = async(req,res) => {
  try {
    const _user = await User.findOne({
      where: { id: req.params.id, }
    });

    if (!_user) {
      return res.status(400).json({
        message:"user not found",
      })
    }
    let data = {
      id:_user.id,
      name:_user.name,
      email:_user.email,  
      role:_user.role,
      phone:_user.phone || "", 
      gender:_user.gender || "",
      dob:_user.dob || '',
      street:_user.street || "",
      city:_user.city || "", 
      zipcode:_user.zipcode || "",
      state: _user.state || "", 
      createdAt: _user.createdAt || null,
      updatedAt:_user.updatedAt || null,
    }
    return res.status(200).json({
      user:data,
    });
  } catch (error) {
    return res.status(400).json({
      message:"Error in getting user",
    })
    
  }
}


module.exports = {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  addUser,
  deleteUser,
  getUser,
  updateUserByAdmin
};
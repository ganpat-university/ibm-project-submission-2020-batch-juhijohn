require('dotenv').config()
const User = require("../Models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ error: error, message: 'Internal Server Error' });
    console.log(error);
  }
}

const registerUsers = async (req, res) => {
  const { fname, lname, enrollment, role, email, password, sem, branch } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fname, lname, enrollment, role, email, password: hashedPassword, sem, branch });

    await user.save();


    return res.status(200).json({ user, success: true, message: 'User created successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err, success: false, message: 'User failed to create!' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ success: false, message: "Please Enter Correct Credentials" });
    }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      return res.status(500).json({ success: false, message: "Please Enter Correct Credentials" });
    }
    else {
      const data = {
        user: {
          email: user.email,
          role: user.role,
          id: user._id
        }
      }
    
      if(user.role === 'instructor' || user.role === 'admin') {
        const token = jwt.sign(data, process.env.SECRET, { expiresIn: '4h' });
        return res.status(200).json({user, success: true, token, message: "Admin/Instructor Login successful!" });
      }
      else {
        const token = jwt.sign(data, process.env.SECRET, { expiresIn: '4h' });
        return res.status(200).json({user, success: true, token, message: "Student Login successful!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error, success: false, message: 'User failed to login!' });
  }
}

const checkRole = async (req,res)=>{
  try {
    const { token } = req.params;
    const decodedToken = jwt.decode(token);
    
    const role = decodedToken.user.role; 
    return res.status(200).json({role, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
}

const checkUser = async (req,res)=>{
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const data = {
      user: {
        email: user.email,
        role: user.role,
        id: user._id
      }
    }
    const role = user.role;
    const token = jwt.sign(data, process.env.SECRET, { expiresIn: '4h' });
    
    return res.status(200).json({token, role ,success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
}
const updateUser = async (req, res) => {
  const { userId } = req.params; 
  const updatedUser = req.body; 

  try {
      const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

const countUsers = async (req, res) => {
  try {
    const instructorsCount = await User.countDocuments({ role: 'instructor' });
    const studentsCount = await User.countDocuments({ role: 'student' });
    const totalCount = await User.countDocuments() - 1 ;
 
    return res.json({ instructorsCount, studentsCount, totalCount});
} catch (error) {
    console.error( error);
    return res.status(500).json({ message: "Internal server error" });

}F
}


module.exports = { getUsers, registerUsers, loginUser,checkRole, checkUser,deleteUser,updateUser,countUsers }
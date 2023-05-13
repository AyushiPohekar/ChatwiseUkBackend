import mongoose, {model, Schema} from 'mongoose';

const userSchema=new Schema({
  firstname:{
    type:String,
    required:true,
    trim:true
  },
  lastname:{
    type:String,
    required:true,
    trim:true
  },
  username:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
    minLength:6,
  },
  gender:{
    type:String,
    required:true,
  
  },
  bdate: {
    type: Date,
    required: true,
  },
  
  picture:{
   type:String,
   default:"https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'requestSent', 'requestReceived'],
    default: 'active'
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts:[{type:mongoose.Types.ObjectId,ref:'Post'}]
})

export default model('User',userSchema);
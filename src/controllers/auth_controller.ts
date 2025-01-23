import {NextFunction, Request, Response} from "express";
import userModel, { iUser } from "../models/user_model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async(req: Request, res: Response) => {

    
const email = req.body.email;
const password = req.body.password;

if (!email || !password){
 res.status(400).send("Missing email or password");
 return;
}
try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
const user = await userModel.create({
email: email,
password: hashedPassword
});
 res.status(200).send(user);
 return;


}catch(error){
     res.status(400).send(error);
     return;

}

};


const generateTokens = (user: iUser): { refreshToken: string; accessToken: string } => {
  const rand = Math.random();
  const accessToken = jwt.sign(
    { _id: user._id, rand },
    process.env.TOKEN_SECRET!,
    { expiresIn: process.env.TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { _id: user._id, rand },
    process.env.TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  return { refreshToken, accessToken };
};

const login = async(req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password){
         res.status(400).send("Missing email or password");
         return;

        }
        try{
            const user = await userModel.findOne({email: email});
            if (!user){
                 res.status(400).send("Worng email or password");
                 return;

            }
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword){
                 res.status(400).send("Worng email or password");
                 return;

            }
            if(!process.env.TOKEN_SECRET){
                 res.status(400).send("Missing auth configuration");
                 return;

            }
  


            const tokens = generateTokens(user);
            if (!tokens) {
              res.status(400).send("error");
              return;
            }
            if (user.refreshTokens == undefined) {
              user.refreshTokens = [];
            }
            user.refreshTokens.push(tokens.refreshToken);
            user.save();
            res.status(200).send(
              {
                ...tokens,
                _id: user._id
              });
          } catch (err) {
            res.status(400).send(err);
          }
        };

        const validateRefreshToken = (refreshToken: string | undefined): Promise<iUser> => {
          return new Promise( (resolve, reject) => {
            if (!refreshToken) {
              reject("Missing refresh token");
              return;
            }
        
            if (!process.env.TOKEN_SECRET) {
              reject("Missing auth configuration");
              return;
            }
        
            jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err, payload) => {
              if (err) {
                reject(err);
                return;
              }
        
              const userId = (payload as Payload)._id;
              try {
                const user = await userModel.findById(userId);
        
                if (!user || !user.refreshTokens?.includes(refreshToken)) {
                  reject("Invalid refresh token");
                  return;
                }
        
                resolve(user);
              } catch (error) {
                reject(error);
              }
            });
          });
        };
          


          const logout = async (req: Request, res: Response) => {
            try {
              const user = await validateRefreshToken(req.body.refreshToken);
          
              user.refreshTokens = user.refreshTokens!.filter((token) => token !== req.body.refreshToken);
              await user.save(); 
          
              res.status(200).send("Logged out successfully");
            } catch (err) {
              res.status(400).send(err);
            }
          };
          
          const refresh = async (req: Request, res: Response) => {
            try {
              const user = await validateRefreshToken(req.body.refreshToken);
          
              const tokens = generateTokens(user);
              if (!tokens) {
                res.status(400).send("error");
                return;
              }
              user.refreshTokens = user.refreshTokens!.filter((token: string) => token !== req.body.refreshToken);
              user.refreshTokens.push(tokens.refreshToken);
              await user.save();
              res.status(200).send({
                ...tokens,
                _id: user._id
              });
            } catch (err) {
              res.status(400).send(err);
            }
          };
          

type Payload = {
    _id: string;
  }

export const authMiddleware = (req: Request, res: Response, next: NextFunction)=>{
const authHeader = req.headers['authorization'];
if (!authHeader || !authHeader.startsWith("Bearer ")) {
    
    res.status(400).send("Missing or malformed Authorization header");
    return;
}
const token = authHeader && authHeader.split(' ')[1];
if(!token){
    res.status(400).send("Bad request");
    return;
}
if(!process.env.TOKEN_SECRET){
   res.status(400).send("Missing auth configuration");
   return;
}
jwt.verify(token, process.env.TOKEN_SECRET, (error, payload) => {
    if(error){
        res.status(400).send("Bad request");
        return;
    }
    const userId = (payload as Payload)._id;
req.params.userId = userId;
    next();
});
};

    export default {register, login, logout, refresh}
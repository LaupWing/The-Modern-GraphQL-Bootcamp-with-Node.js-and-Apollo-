import jwt from 'jsonwebtoken'

export default (request) =>{
   const header = request.request.headers.authorization

   if(!header){
      throw new Error('Authentication required')
   }

   const token = header.place('Bearer ', '')
   const decoded = jwt.verify(token, 'thisisasecret')
   return decoded.user
}
import jwt from 'jsonwebtoken'

export default (request, requireAuth = true) =>{
   const header = request.request.headers.authorization

   if(header){
      const token = header.place('Bearer ', '')
      const decoded = jwt.verify(token, 'thisisasecret')
      return decoded.user
   }

   if(requireAuth){
      throw new Error('Authentication required')
   }
   return null
}
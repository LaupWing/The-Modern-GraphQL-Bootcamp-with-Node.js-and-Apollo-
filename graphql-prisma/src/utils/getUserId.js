import jwt from 'jsonwebtoken'

export default (request, requireAuth = true) =>{
   const header = request.request ? 
      request.request.headers.authorization :
      request.connection.context.Authorization

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
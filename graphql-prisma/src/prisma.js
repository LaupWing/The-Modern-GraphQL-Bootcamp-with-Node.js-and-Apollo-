import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
   typeDefs: 'src/generated/prisma.graphql',
   endpoint: 'http://localhost:4466'
})

const createPostForUse = async (authorId, data)=>{
   const userExists = await prisma.exists.User({id: authorId})
   if(!userExists){
      throw new Error('User not found')
   }

   await prisma.mutation.createPost({
      data:{
         ...data,
         author:{
            connect:{
               id: authorId
            }
         }
      }
   }, '{id}')

   const user = await prisma.query.user({
      where:{
         id: authorId
      }
   }, '{id name email posts {id title published}}')
   return user
}

const updatePostForUser = async (id, update)=>{
   const post = await prisma.mutation.updatePost({
      where:{
         id
      },
      data:{...update}
   }, '{author {id}}')

   const user = await prisma.query.user({
      where:{
         id: post.author.id
      }
   }, '{id name email posts {id title published}}')
}

// createPostForUse('cknyl0dlk001b0a95fzum8td3', {
//    body: 'test',
//    title: 'test',
//    published: true
// }).then(user=>console.log(JSON.stringify(user, undefined, 2)))

// prisma.query.users(null, '{ id name}')
//    .then(user=>console.log(user))

// prisma.mutation.createPost({
//    data:{
//       title: 'My new post',
//       body: 'New course',
//       published: true,
//       author: {
//          connect:{
//             id:"cknyl0dlk001b0a95fzum8td3"
//          }
//       }
//    }
// }, '{ id title body published }').then((data)=>{
//    console.log(data)
// })
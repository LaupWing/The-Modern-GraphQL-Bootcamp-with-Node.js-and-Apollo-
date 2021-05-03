import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
   typeDefs: 'src/generated/prisma.graphql',
   endpoint: 'http://localhost:4466'
})

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
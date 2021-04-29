const users = [
   {
      id: '1',
      name: 'Laup',
      email: 'laup@example.com',
      age: 26,
   },
   {
      id: '2',
      name: 'Hau',
      email: 'hau@example.com',
   },
]

const posts = [
   {
      id: '10',
      title: 'Laup',
      body: 'laup@example.com',
      published: true,
      author: '1'
   },
   {
      id: '11',
      title: 'Laup2',
      body: 'laup2@example.com',
      published: false,
      author: '1'
   },
]

const comments = [
   {
      id: '100',
      text: 'test1',
      post: '10',
      author: '1'
   },
   {
      id: '200',
      text: 'test12',
      post: '10',
      author: '2'
   },
   {
      id: '300',
      text: 'test123',
      post: '11',
      author: '2'
   },
   {
      id: '400',
      text: 'test1234',
      post: '11',
      author: '2'
   },
]


export default {
   users,
   posts,
   comments
}
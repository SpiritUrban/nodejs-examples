

import { PrismaClient } from '@prisma/client';
import  { createYoga } from 'graphql-yoga';
import  { makeExecutableSchema } from 'graphql-tools';


const prisma = new PrismaClient();

async function doIt(){
    await prisma.user.create({
        data: {
            username: 'sdfsd',
            email: 'sdfsdfg',
        },
    });
}
//doIt()

app.get('/test', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


// Определение схемы GraphQL
const typeDefs = `
  type Query {
    info: String!
    users(username: String, email: String): [User!]!
  }

  type Mutation {
    createUser(username: String!, email: String!): User!
  }
  
  type User {
    id: ID!
    email: String!
    username: String
  }
`



// Реализация схемы GraphQL
const resolvers = {
    Query: {
        info: () => `This is a GraphQL API.`,
        users: async (parent, args, context) => {
            console.log('********', args)
            const { username, email } = args;
            const where = {};
            if (username) {
              where.username = { contains: username,  mode: 'insensitive' }
            }
            if (email) {
              where.email = { contains: email } 
            }
            return context.prisma.user.findMany({ where });
        },
    },

    Mutation: {
      createUser: async (parent, args, context) => {
        const { username, email } = args;
        return context.prisma.user.create({
          data: {
            username,
            email,
          },
        });
      },
    },
}



const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

function main() {
    const yoga = createYoga({ 
        schema,
        context: () => ({ prisma }),
    })
    const server = http.createServer(yoga)
    server.listen(4000, () => {
        console.info('Server is running on http://localhost:4000/graphql')
    })
}

main();



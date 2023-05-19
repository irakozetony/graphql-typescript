import {ApolloServer} from "apollo-server";
import {context} from "./context";

import {schema} from "./schema";

export const server: ApolloServer = new ApolloServer(
    {
        schema,
        context: context,
    }
);
const port: number = 3000;

server.listen({port}).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
})

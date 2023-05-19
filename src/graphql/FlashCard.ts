import {objectType, extendType, nonNull, stringArg, inputObjectType, enumType, arg } from "nexus";

export const FlashCard = objectType({
    name: "FlashCard",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("front");
        t.nonNull.string("back");
        t.nonNull.string("owner", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.flashCard.findUnique({where: {id: parent.id}}).owner();
            }
        })
    },
});

export const FlashCardOrderByInput = inputObjectType({
    name: "FlashCardOrderByInput",
    definition(t){
        t.field("front", {type: Sort});
        t.field("back", {type: Sort});
        t.field("createdAt", {type: Sort});
    },
});

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"],
});

export const FlashCardQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("cards", {
            type: "FlashCard",
            resolve(parent, args, context) {
                return context.prisma.flashCard.findMany();
            }
        })
    }
});

export const FlashCardMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("create", {
            type: "FlashCard",
            args: {
                front: nonNull(stringArg()),
                back: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const {front, back} = args;
                const {userId} = context;
                if(!userId){
                    throw new Error("Cannot post without logging in.");
                }
                return context.prisma.flashCard.create({
                    data: {
                        front: args.front,
                        back: args.back,
                        owner: { connect: {id: userId}}
                    }
                });
            }
        })
    }
})

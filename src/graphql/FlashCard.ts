import {
    objectType,
    extendType,
    nonNull,
    stringArg,
    inputObjectType,
    enumType,
    arg,
    list,
    intArg
} from "nexus";
import {Prisma} from "@prisma/client";
import {Context} from "../context";

export const FlashCard = objectType({
    name: "FlashCard",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("front");
        t.nonNull.string("back");
        t.nonNull.boolean("isDone");
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
    definition(t) {
        t.field("front", {type: Sort});
        t.field("back", {type: Sort});
        t.field("createdAt", {type: Sort});
        t.field("isDone", {type: Sort});
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
            args: {
                orderBy: arg({type: list(nonNull(FlashCardOrderByInput))})
            },
            resolve(parent, args, context) {
                return context.prisma.flashCard.findMany({
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.FlashCardOrderByWithRelationInput> | undefined
                });
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
                if (!userId) {
                    throw new Error("Cannot post without logging in.");
                }
                return context.prisma.flashCard.create({
                    data: {
                        front: args.front,
                        back: args.back,
                        owner: {connect: {id: userId}},
                        isDone: false,
                    }
                });
            }
        })
        t.nonNull.field("markAsRead", {
            type: "FlashCard",
            args: {
                id: nonNull(intArg()),
            },
            async resolve(parent, args, context: Context) {
                const {id} = args;
                const {userId} = context;

                if (!userId)
                    throw new Error("Can not mark as done without logging in.");

                const flashcard: FlashCard | null = await context.prisma.flashCard.findUnique({where: {id: id}});

                if (!flashcard)
                    throw new Error("No flashcard with that Id was found");

                if (userId !== flashcard.ownerId) {
                    throw new Error("Can not mark a card you don't own");
                }

                return context.prisma.flashCard.update({
                    where: {
                        id: id
                    },
                    data: {
                        isDone: true
                    }
                })
            }
        })
    }
})

import prisma from "../db.server"

export const createCustomer = async ({email , name })=>{
    return await prisma.customer.create({
        data:{
            id: "12345667",
            email: email,
            name: name
        }
    })
}



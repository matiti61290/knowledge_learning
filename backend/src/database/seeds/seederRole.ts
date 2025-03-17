import { Role } from "../../entities/role.entity";
import dataSource from "../ormconfig";

async function seedRole(){
    try{
        // Connexion to the database
        await dataSource.initialize();
        console.log("connexion etablished")

        // add roles in Role table
        const roleRepository = dataSource.getRepository(Role);

        const roles = [
            {name: "student"},
            {name: "admin"},
            {name: "other"}
        ];

        try{
            for (const role of roles) {
                const exists = await roleRepository.findOne({ where: {name: role.name} });
                if (!exists) {
                    await roleRepository.save(role);
                } else {
                    console.log(`${role.name} already exists`)
                }
            }
        } catch(error){
            console.log(`An error happened: ${error}`)
        }

        console.log('Seeding completed. Check the database.')
    } catch(error) {
        console.log('Connexion failed:', error)
    } finally{
        await dataSource.destroy()
    }
}

seedRole()
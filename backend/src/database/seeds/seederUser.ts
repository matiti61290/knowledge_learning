import { User } from "../../entities/user.entity";
import { Role } from "../../entities/role.entity";
import dataSource from "../ormconfig";
import * as bcrypt from 'bcrypt'

async function seedUser() {
    try{
        // connexion to the database
        await dataSource.initialize()
        console.log('connexion etablished')

        const roleRepository = dataSource.getRepository(Role)
        const userRepository = dataSource.getRepository(User)

        const adminRole = await roleRepository.findOne({ where: { name:'admin'} })

        if (!adminRole){
            console.error("This role doesn't exist")
            return;
        }

        const password = "Knowledge_admin@61"
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const users = [
            {firstname:'Knowledge', lastname:'Learning', mail:'admin@knowledgelearning.com', password: hashedPassword, is_verified: true, roles: adminRole ? [adminRole]: []}
        ]

        try{
            for( const user of users){
                const exists = await userRepository.findOne({ where: {mail: user.mail}, relations:["roles"]})
                if (!exists) {
                    await userRepository.save(user)
                } else {
                    console.log(`${user.mail} already exists`)
                }
            }
        } catch(error){
            console.log(`An error happenend: ${error}`)
        }
        console.log('Seeding terminated. Check the database')
    } catch(error){
        console.error(`connexion failed: ${error}`)
    } finally{
        await dataSource.destroy()
    }
}

seedUser()
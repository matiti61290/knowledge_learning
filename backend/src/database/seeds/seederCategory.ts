import { Category } from "../../entities/category.entity";
import dataSource from "../ormconfig";

async function seedCategory() {
    try{
        // connexion to the database
        await dataSource.initialize();
        console.log('connexion etablished')

        const categoryRepository = dataSource.getRepository(Category);

        const categories = [
            { name:"Musique" },
            { name: "Informatique" },
            { name: "Jardinage" },
            { name: "Cuisine"}
        ]

        try{
            for (const category of categories) {
                const exists = await categoryRepository.findOne({ where: {name: category.name} })
                if (!exists){
                    await categoryRepository.save(category)
                } else {
                    console.log(`${category.name} already exists`)
                }
            }
        } catch(e){
            console.log(`An error happened: ${e}`)
        }

        console.log('Seeding completed. Check the database.')
    } catch(e) {
        console.error(`connexion failed: ${e}`)
    } finally {
        await dataSource.destroy()
    }
}

seedCategory()
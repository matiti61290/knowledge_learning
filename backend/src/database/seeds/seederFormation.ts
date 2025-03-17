import { Formation } from "../../entities/formation.entity";
import { Category } from "../../entities/category.entity";
import dataSource from "../ormconfig";

async function seederFormation() {
    try{
        // connexion to the database
        await dataSource.initialize()
        console.log('connexion etablished')

        const formationRepository = dataSource.getRepository(Formation)
        const categoryRepository = dataSource.getRepository(Category)

        const musiqueCategory = await categoryRepository.findOne({ where: {name: "Musique"}})
        const informatiqueCategory = await categoryRepository.findOne({ where: {name: "Informatique"}})
        const jardinageCategory =  await categoryRepository.findOne({ where: {name: "Jardinage"}})
        const cuisineCategory =  await categoryRepository.findOne({where: {name:'Cuisine'}})

        if(!musiqueCategory || !informatiqueCategory || !jardinageCategory || !cuisineCategory){
            console.error("One of these category doesn't exist.")
            return
        }

        const formations = [
            { name: "Cursus d'initiation à la guitare", price: 50, category: musiqueCategory},
            { name: "Cursus d'initiation au piano", price: 50, category: musiqueCategory},
            { name: "Cursus d'initiation au développement web", price: 60, category: informatiqueCategory},
            { name: "Cursus d'initiation au jardinage", price: 30, category: jardinageCategory},
            { name: "Cursus d'initiation à la cuisine", price: 44, category: cuisineCategory},
            { name: "Cursus d'initiation à l'art du dressage culinaire", price: 48, category: cuisineCategory}
        ]

        try{
            for (const formation of formations) {
                const exists = await formationRepository.findOne({ where: {name: formation.name} })
                if (!exists){
                    await formationRepository.save(formation)
                } else {
                    console.log(`${formation.name} already exists`)
                }
            }
        } catch(e){
            console.log(`An error happened: ${e}`)
        }
        console.log('Seeding completed. Check the database')
    } catch(e) {
        console.error(`Connexion failed: ${e}`)
    } finally {
        await dataSource.destroy()
    }
}

seederFormation()
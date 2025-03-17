import { Lesson } from "../../entities/lesson.entity";
import { Formation } from "../../entities/formation.entity";
import dataSource from "../ormconfig";

async function seederLesson(){
    try{
        // connexion to the database
        await dataSource.initialize()
        console.log("connexion etablished")

        const lessonRepository = dataSource.getRepository(Lesson)
        const formationRepository = dataSource.getRepository(Formation)

        const guitareFormation = (await formationRepository.findOne({ where: {name: "Cursus d'initiation à la guitare"}})) as Formation
        const pianoFormation = (await formationRepository.findOne({ where: {name: "Cursus d'initiation au piano"}})) as Formation
        const webdevFormation = (await formationRepository.findOne({ where: {name: "Cursus d'initiation au développement web"}})) as Formation
        const jardinageFormation = (await formationRepository.findOne({ where: {name: "Cursus d'initiation au jardinage"}})) as Formation
        const cuisineFormation = (await formationRepository.findOne({ where: {name: "Cursus d'initiation à la cuisine"}})) as Formation
        const dressageFormation = (await formationRepository.findOne({ where: {name:"Cursus d'initiation à l'art du dressage culinaire"}})) as Formation

        const lessons = [
            {title:"Leçon n°1 : Découverte de l'instrument", price: 26, index_order: 1, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: guitareFormation},
            {title:"Leçon n°2 : Les accords et les gammes", price: 26, index_order: 2, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: guitareFormation},
            {title:"Leçon n°1 : Découverte de l'instrument", price: 26, index_order: 1, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: pianoFormation},
            {title:"Leçon n°2 : Les accords et les gammes", price: 26, index_order: 2, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: pianoFormation},
            {title:"Leçon n°1 : Les langages Html et CSS", price: 32, index_order: 1, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: webdevFormation},
            {title:"Leçon n°2 : Dynamiser votre site avec Javascript", price: 32, index_order: 2, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: webdevFormation},
            {title:"Leçon n°1 : Les outils du jardinier", price: 16, index_order: 1, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: jardinageFormation},
            {title:"Leçon n°2 : Jardiner avec la lune", price: 16, index_order: 2, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: jardinageFormation},
            {title:"Leçon n°1 : Les modes de cuisson", price: 23, index_order: 1, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: cuisineFormation},
            {title:"Leçon n°2 : Les saveurs", price: 23, index_order: 2, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: cuisineFormation},
            {title:"Leçon n°1 : Mettre en œuvre le style dans l'assiette", price: 26, index_order: 1, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: dressageFormation},
            {title:"Leçon n°2 : Harmoniser un repas à quatre plats", price: 26, index_order: 2, url_video:"undefined", content:`
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend mauris augue, id varius felis facilisis sed. Phasellus consectetur nisl tincidunt lorem cursus, quis finibus diam ultricies. Quisque non velit et metus mollis eleifend. Pellentesque non rhoncus lorem. Suspendisse potenti. Integer consectetur dignissim ante non lacinia. Etiam condimentum lacinia pellentesque. Vivamus ullamcorper, arcu et dapibus scelerisque, purus elit sollicitudin arcu, lacinia eleifend magna lectus et elit. Nunc non mattis arcu, a luctus neque. Aliquam ut porttitor est. Nam nec ornare diam. Vestibulum nec ante pharetra, pulvinar ex in, scelerisque ligula. Cras id bibendum nunc. Vivamus quis venenatis ex.
            `, formation: dressageFormation},
        ]

        try{
            for (const lesson of lessons) {
                await lessonRepository.findOne({ where: {title: lesson.title}})
                await lessonRepository.save(lesson)
            }
        } catch(e){
            console.log(`An error happened: ${e}`)
        }

        console.log('Seeding terminated. Check the database')
    } catch(e) {
        console.error('Connexion failed', e)
    } finally{
        await dataSource.destroy()
    }
}

seederLesson()
import { MigrationInterface, QueryRunner } from "typeorm";

export class Database1742215572408 implements MigrationInterface {
    name = 'Database1742215572408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`purchase\` (\`id\` int NOT NULL AUTO_INCREMENT, \`purchase_date\` datetime NOT NULL, \`completion_date\` datetime NOT NULL, \`userId\` int NULL, \`formationId\` int NULL, \`lessonId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lesson\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`price\` float NOT NULL, \`index_order\` int NOT NULL, \`url_video\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`formationId\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`user_certification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_completed\` tinyint NOT NULL DEFAULT 1, \`certificate_url\` varchar(255) NOT NULL, \`userId\` int NULL, \`formationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`formation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` float NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`categoryId\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstname\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`mail\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdById\` int NULL, \`updatedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`user_progress\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_completed\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, \`lessonId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            CREATE TABLE \`user_roles_role\` (\`userId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_5f9286e6c25594c6b88c108db7\` (\`userId\`), INDEX \`IDX_4be2f7adf862634f5f803d246b\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB
            `);
        await queryRunner.query(`
            ALTER TABLE \`role\` ADD CONSTRAINT \`FK_04a09925beea59e864e921db4a1\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`role\` ADD CONSTRAINT \`FK_858c871a036f61e56e2740c7cda\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_33520b6c46e1b3971c0a649d38b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_9a5bae8f576120ff3e4d531aa28\` FOREIGN KEY (\`formationId\`) REFERENCES \`formation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_298e7999e6e03957b30697dae76\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lesson\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`lesson\` ADD CONSTRAINT \`FK_15ab1b3a2fbaa485923df35a7b1\` FOREIGN KEY (\`formationId\`) REFERENCES \`formation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`lesson\` ADD CONSTRAINT \`FK_6153bfb571d62e9d5a5c68593ca\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`lesson\` ADD CONSTRAINT \`FK_9ae0ff7396c836d0fbe3ff7a91c\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_certification\` ADD CONSTRAINT \`FK_4e90ed5064cf1d34505e47ddd8d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`ALTER TABLE \`user_certification\` ADD CONSTRAINT \`FK_92da6574ddc3f88ad34de3fe91a\` FOREIGN KEY (\`formationId\`) REFERENCES \`formation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`formation\` ADD CONSTRAINT \`FK_7c64dc9981c8aadaaf435ba37b2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`formation\` ADD CONSTRAINT \`FK_711c1d49bf01f7a9b2a14ef45e5\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`formation\` ADD CONSTRAINT \`FK_cec44ea648c52bd111dd44e8838\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`category\` ADD CONSTRAINT \`FK_68c078584a67703b28a510583de\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`category\` ADD CONSTRAINT \`FK_997af3ae726489a7e5f20087f63\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45c0d39d1f9ceeb56942db93cc5\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`user\` ADD CONSTRAINT \`FK_db5173f7d27aa8a98a9fe6113df\` FOREIGN KEY (\`updatedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_progress\` ADD CONSTRAINT \`FK_b5d0e1b57bc6c761fb49e79bf89\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_progress\` ADD CONSTRAINT \`FK_b68ae6c7bbd71b00257277c42f8\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lesson\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_5f9286e6c25594c6b88c108db77\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_4be2f7adf862634f5f803d246b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_4be2f7adf862634f5f803d246b8\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_5f9286e6c25594c6b88c108db77\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_progress\` DROP FOREIGN KEY \`FK_b68ae6c7bbd71b00257277c42f8\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_progress\` DROP FOREIGN KEY \`FK_b5d0e1b57bc6c761fb49e79bf89\`
            `);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_db5173f7d27aa8a98a9fe6113df\``);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45c0d39d1f9ceeb56942db93cc5\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_997af3ae726489a7e5f20087f63\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_68c078584a67703b28a510583de\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`formation\` DROP FOREIGN KEY \`FK_cec44ea648c52bd111dd44e8838\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`formation\` DROP FOREIGN KEY \`FK_711c1d49bf01f7a9b2a14ef45e5\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`formation\` DROP FOREIGN KEY \`FK_7c64dc9981c8aadaaf435ba37b2\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_certification\` DROP FOREIGN KEY \`FK_92da6574ddc3f88ad34de3fe91a\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`user_certification\` DROP FOREIGN KEY \`FK_4e90ed5064cf1d34505e47ddd8d\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`lesson\` DROP FOREIGN KEY \`FK_9ae0ff7396c836d0fbe3ff7a91c\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`lesson\` DROP FOREIGN KEY \`FK_6153bfb571d62e9d5a5c68593ca\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`lesson\` DROP FOREIGN KEY \`FK_15ab1b3a2fbaa485923df35a7b1\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_298e7999e6e03957b30697dae76\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_9a5bae8f576120ff3e4d531aa28\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_33520b6c46e1b3971c0a649d38b\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_858c871a036f61e56e2740c7cda\`
            `);
        await queryRunner.query(`
            ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_04a09925beea59e864e921db4a1\`
            `);
        await queryRunner.query(`
            DROP INDEX \`IDX_4be2f7adf862634f5f803d246b\` ON \`user_roles_role\`
            `);
        await queryRunner.query(`
            DROP INDEX \`IDX_5f9286e6c25594c6b88c108db7\` ON \`user_roles_role\`
            `);
        await queryRunner.query(`
            DROP TABLE \`user_roles_role\``);
        await queryRunner.query(`DROP TABLE \`user_progress\`
            `);
        await queryRunner.query(`
            DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`category\`
            `);
        await queryRunner.query(`
            DROP TABLE \`formation\`
            `);
        await queryRunner.query(`
            DROP TABLE \`user_certification\`
            `);
        await queryRunner.query(`
            DROP TABLE \`lesson\``);
        await queryRunner.query(`DROP TABLE \`purchase\`
            `);
        await queryRunner.query(`
            DROP TABLE \`role\`
            `);
    }

}

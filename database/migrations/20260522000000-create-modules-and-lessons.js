'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure course_modules table exists
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('course_modules')) {
      await queryInterface.createTable('course_modules', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        course_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'courses',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        order_index: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
    }

    // Ensure lessons table exists and has all columns
    if (!tables.includes('lessons')) {
      await queryInterface.createTable('lessons', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        module_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'course_modules',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        content_type: {
          type: Sequelize.ENUM('video', 'text'),
          allowNull: false,
        },
        video_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        duration_seconds: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        order_index: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
    } else {
      // If table exists, check for missing columns
      const tableInfo = await queryInterface.describeTable('lessons');
      
      if (!tableInfo.description) {
        await queryInterface.addColumn('lessons', 'description', {
          type: Sequelize.TEXT,
          allowNull: true,
        });
      }
      
      if (!tableInfo.video_url) {
        await queryInterface.addColumn('lessons', 'video_url', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }
      
      if (!tableInfo.duration_seconds) {
        await queryInterface.addColumn('lessons', 'duration_seconds', {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lessons');
    await queryInterface.dropTable('course_modules');
  },
};

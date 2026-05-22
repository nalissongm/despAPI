'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('courses');
    if (!tableInfo.image_course_url) {
      await queryInterface.addColumn('courses', 'image_course_url', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('courses', 'image_course_url');
  },
};

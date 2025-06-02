const bcrypt = require('bcryptjs');
const { sequelize, User, Role, Training } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Sync models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Create roles
    const roles = await Role.bulkCreate([
      { name: 'admin', description: 'System Administrator with full access' },
      { name: 'esd_admin', description: 'ESD Administrator' },
      { name: 'vendor', description: 'Vendor Representative' },
      { name: 'facilitator', description: 'Training Facilitator' },
      { name: 'participant', description: 'Training Participant' }
    ]);
    console.log('Roles created:', roles.map(role => role.name).join(', '));
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@sasol.com',
      password: hashedPassword,
      RoleId: roles[0].id // admin role
    });
    console.log('Admin user created:', adminUser.email);
    
    // Create ESD admin user
    const esdAdminUser = await User.create({
      firstName: 'ESD',
      lastName: 'Admin',
      email: 'esd@sasol.com',
      password: hashedPassword,
      RoleId: roles[1].id // esd_admin role
    });
    console.log('ESD Admin user created:', esdAdminUser.email);
    
    // Create sample training sessions
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    
    const trainingSessions = await Training.bulkCreate([
      {
        title: 'Health and Safety Induction',
        description: 'Mandatory safety training for all new vendors',
        startDate: new Date(now.getTime() + (2 * oneDay)),
        endDate: new Date(now.getTime() + (2 * oneDay) + (3 * oneHour)),
        location: 'Sasol Training Center, Room 101',
        isVirtual: false,
        isMandatory: true,
        status: 'scheduled',
        facilitatorName: 'John Facilitator',
        facilitatorContact: 'john@sasol.com'
      },
      {
        title: 'ESD Project Management',
        description: 'Project management best practices for ESD vendors',
        startDate: new Date(now.getTime() + (5 * oneDay)),
        endDate: new Date(now.getTime() + (5 * oneDay) + (4 * oneHour)),
        location: 'Online',
        isVirtual: true,
        meetingLink: 'https://zoom.us/j/123456789',
        isMandatory: false,
        status: 'scheduled',
        facilitatorName: 'Sarah Trainer',
        facilitatorContact: 'sarah@sasol.com'
      },
      {
        title: 'Compliance Reporting Workshop',
        description: 'Hands-on workshop for compliance reporting requirements',
        startDate: new Date(now.getTime() + (10 * oneDay)),
        endDate: new Date(now.getTime() + (10 * oneDay) + (6 * oneHour)),
        location: 'Sasol Development Center',
        isVirtual: false,
        isMandatory: true,
        status: 'scheduled',
        facilitatorName: 'Maria Compliance',
        facilitatorContact: 'maria@sasol.com'
      }
    ]);
    console.log('Sample training sessions created:', trainingSessions.length);
    
    console.log('Database seeding completed successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
};

// Run seeder if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

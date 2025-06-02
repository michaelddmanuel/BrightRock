module.exports = (sequelize, DataTypes) => {
  const Training = sequelize.define('Training', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVirtual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prerequisite: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isMandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    facilitatorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facilitatorContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });
  
  return Training;
};

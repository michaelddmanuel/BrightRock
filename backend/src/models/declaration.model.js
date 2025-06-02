module.exports = (sequelize, DataTypes) => {
  const Declaration = sequelize.define('Declaration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Content of the declaration form submitted by the participant',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Digital signature or confirmation by the participant',
    },
    isCompliant: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    complianceNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });
  
  return Declaration;
};

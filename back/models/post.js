module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { // automatically table names as posts
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4', // can add emoji
        collate: 'utf8mb4_general_ci'
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // User Id auto-generated
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag'});
    };

    return Post;
};
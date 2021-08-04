const { posts } = require('../models');

const postsData = [
  {
    id: 1,
    date_created: 'April 20, 2021',
    title: 'BBQ At My House!!',
    description: 'Hey gang! Im having a BBQ at my house! I hope all can attend!!',
    upvotes: 0,
    location: "2113 Main St. Austin, TX.",
    time_occuring: "August 11, 2021 13:00:00",
    user_id: 1,
    edited: false
  },
  {
    id: 2,
    date_created: 'April 21, 2021',
    title: 'Meet Up At The Brewery!!',
    description: 'Hey guys! Lets meet up at the brewery!!',
    upvotes: 0,
    location: "700 Duvall St. Austin, TX.",
    time_occuring: "August 12, 2021 16:00:00",
    user_id: 2,
    edited: false
  },
  {
    id: 3,
    date_created: 'April 22, 2021',
    title: 'Frisbee In The Park!!',
    description: 'Lets toss around the frisbee!!',
    upvotes: 0,
    location: "2336 Douglas St. Austin, TX.",
    time_occuring: "August 13, 2021 12:00:00",
    user_id: 3,
    edited: false
  },
  {
    id: 4,
    date_created: 'April 23, 2021',
    title: 'Softball Game!',
    description: 'Hey gang! Lets meet up at the ballpark for a softball game!!',
    upvotes: 0,
    location: "420 Green St. Austin, TX.",
    time_occuring: "August 14, 2021 13:00:00",
    user_id: 3,
    edited: false
  },
],

const seedposts = () => posts.bulkCreate(postsData);

module.exports = seedposts;
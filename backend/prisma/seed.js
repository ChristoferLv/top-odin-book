import { prisma } from '../lib/prisma.js';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { postsPictures, userPicutres } from './pictureBuffers.js';

async function main() {
  const password = "pass";
  const hashedPassword = await bcrypt.hash(password, 10);

  const clearDB = [
    prisma.trending.deleteMany(),
    prisma.notifications.deleteMany(),
    prisma.midias.deleteMany(),
    prisma.bookmarks.deleteMany(),
    prisma.likes.deleteMany(),
    prisma.posts.deleteMany(),
    prisma.follows.deleteMany(),
    prisma.users.deleteMany()
  ];

  await Promise.all(clearDB);

  const transaction = await prisma.$transaction(async (tx) => {

    const users = await tx.users.createManyAndReturn({
      data: [
        { name: "Late Night Thoughts", username: "latenightvoid", bio: "thoughts that make more sense at 2am", password: hashedPassword, picture: Buffer.from(userPicutres.latenightvoid, "base64"), mime: "image/png" },
        { name: "Pixel Wanderer", username: "pixelwanderer", bio: "somewhere between the screen and reality", password: hashedPassword, picture: Buffer.from(userPicutres.pixelwanderer, "base64"), mime: "image/png" },
        { name: "Quiet Observer", username: "quietobserver", bio: "watching things unfold", password: hashedPassword, picture: Buffer.from(userPicutres.quietobserver, "base64"), mime: "image/png" },
        { name: "Coffee & Code", username: "coffeeandcode", bio: "fixing bugs and drinking coffee", password: hashedPassword, picture: Buffer.from(userPicutres.coffeeandcode, "base64"), mime: "image/png" },
        { name: "The Daily Scroll", username: "thedailyscroll", bio: "probably scrolling right now", password: hashedPassword },
        { name: "Lost Signal", username: "lostsignal", bio: "connection unstable", password: hashedPassword },
        { name: "Midnight Archive", username: "midnightarchive", bio: "collecting things worth remembering", password: hashedPassword, picture: Buffer.from(userPicutres.midnightarchive, "base64"), mime: "image/png" },
        { name: "Offline Mode", username: "offline_mode", bio: "temporarily unavailable", password: hashedPassword },
        { name: "Random Access", username: "randomaccess", bio: "thoughts, links and occasional nonsense", password: hashedPassword, picture: Buffer.from(userPicutres.randomaccess, "base64"), mime: "image/png" },
        { name: "Background Noise", username: "backgroundnoise", bio: "just another voice on the internet", password: hashedPassword, picture: Buffer.from(userPicutres.backgroundnoise, "base64"), mime: "image/png" },
        { name: "Daily Brief", username: "dailybriefing", bio: "News, updates and information from around the web.", password: hashedPassword, picture: Buffer.from(userPicutres.dailybriefing, "base64"), mime: "image/png" },
        { name: "Info Desk", username: "infodesk_daily", bio: "Breaking updates, facts and stories worth knowing.", password: hashedPassword, picture: Buffer.from(userPicutres.infodesk_daily, "base64"), mime: "image/png" },
      ]
    });

    const followage = await tx.follows.createManyAndReturn({
      data: [
        { followedById: users[0].id, followingId: users[4].id },
        { followedById: users[7].id, followingId: users[2].id },
        { followedById: users[3].id, followingId: users[9].id },
        { followedById: users[5].id, followingId: users[1].id },
        { followedById: users[8].id, followingId: users[6].id },
        { followedById: users[1].id, followingId: users[7].id },
        { followedById: users[4].id, followingId: users[3].id },
        { followedById: users[9].id, followingId: users[0].id },
        { followedById: users[2].id, followingId: users[5].id },
        { followedById: users[6].id, followingId: users[8].id },
        { followedById: users[0].id, followingId: users[6].id },
        { followedById: users[5].id, followingId: users[9].id },
        { followedById: users[3].id, followingId: users[1].id },
        { followedById: users[8].id, followingId: users[4].id },
        { followedById: users[7].id, followingId: users[0].id },
        { followedById: users[2].id, followingId: users[8].id },
        { followedById: users[9].id, followingId: users[5].id },
        { followedById: users[1].id, followingId: users[3].id },
        { followedById: users[6].id, followingId: users[2].id },
        { followedById: users[4].id, followingId: users[7].id },
        { followedById: users[0].id, followingId: users[9].id },
        { followedById: users[5].id, followingId: users[3].id },
        { followedById: users[8].id, followingId: users[0].id },
        { followedById: users[2].id, followingId: users[4].id },
        { followedById: users[7].id, followingId: users[6].id },
        { followedById: users[3].id, followingId: users[8].id },
        { followedById: users[9].id, followingId: users[2].id },
        { followedById: users[1].id, followingId: users[5].id },
        { followedById: users[6].id, followingId: users[0].id },
        { followedById: users[4].id, followingId: users[9].id },
      ]
    });

    const posts = [
      {
        key: 'post1',
        authorId: users[0].id,
        content:
          'A small update was published earlier today with some additional information about what has been happening recently.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post2',
        authorId: users[3].id,
        content:
          'I think there is still some important context missing from the original post, especially regarding what happened before this update.',
        postType: 'REPLY',
        originalPostKey: 'post1',
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post3',
        authorId: users[7].id,
        content: null,
        postType: 'SHARE',
        originalPostKey: null,
        sharedPostKey: 'post1',
        hasMidia: false
      },

      {
        key: 'post4',
        authorId: users[2].id,
        content:
          'Several new details have appeared today, and some of them seem to clarify what was previously being reported.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post5',
        authorId: users[5].id,
        content:
          'Not everyone seems to have noticed this particular detail, but it could be relevant when looking at the situation as a whole.',
        postType: 'REPLY',
        originalPostKey: 'post4',
        sharedPostKey: null,
        hasMidia: true,
        dimensions: "400x300"
      },

      {
        key: 'post6',
        authorId: users[9].id,
        content: null,
        postType: 'SHARE',
        originalPostKey: null,
        sharedPostKey: 'post4',
        hasMidia: false
      },

      {
        key: 'post7',
        authorId: users[1].id,
        content:
          'New information was released earlier today, providing a little more detail about the situation and what may happen next.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: true,
        dimensions: "128x128"
      },

      {
        key: 'post8',
        authorId: users[6].id,
        content:
          'That does change the situation somewhat. The additional information makes the previous update easier to understand.',
        postType: 'REPLY',
        originalPostKey: 'post7',
        sharedPostKey: null,
        hasMidia: true,
        dimensions: "236x236"
      },

      {
        key: 'post9',
        authorId: users[4].id,
        content: null,
        postType: 'SHARE',
        originalPostKey: null,
        sharedPostKey: 'post5',
        hasMidia: false
      },

      {
        key: 'post10',
        authorId: users[8].id,
        content:
          'There seems to be another side to this story that has not received much attention so far, so it is worth looking into further.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post11',
        authorId: users[0].id,
        content:
          'Good point. I had not considered that part of the situation, and it definitely adds some useful context to the discussion.',
        postType: 'REPLY',
        originalPostKey: 'post10',
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post12',
        authorId: users[5].id,
        content: null,
        postType: 'SHARE',
        originalPostKey: null,
        sharedPostKey: 'post10',
        hasMidia: false
      },

      {
        key: 'post13',
        authorId: users[3].id,
        content:
          'Here is a quick update on the situation. A few new details have emerged since the previous information was published.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post14',
        authorId: users[7].id,
        content:
          'Adding some context here because the original update does not mention what happened earlier in the day.',
        postType: 'REPLY',
        originalPostKey: 'post13',
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post15',
        authorId: users[2].id,
        content:
          'Sharing this with some additional context. The information in the original post helps explain why this update is relevant.',
        postType: 'SHARE_REPLY',
        originalPostKey: null,
        sharedPostKey: 'post13',
        hasMidia: false
      },

      {
        key: 'post16',
        authorId: users[9].id,
        content:
          'This has been developing throughout the day, with several updates being published as more information becomes available.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post17',
        authorId: users[4].id,
        content:
          'I wonder how this will develop over the next few days. There are still several details that have not been confirmed.',
        postType: 'REPLY',
        originalPostKey: 'post16',
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post18',
        authorId: users[1].id,
        content: null,
        postType: 'SHARE',
        originalPostKey: null,
        sharedPostKey: 'post16',
        hasMidia: false
      },

      {
        key: 'post19',
        authorId: users[6].id,
        content:
          'Another interesting detail appeared in the latest update, although it is still unclear what the broader implications might be.',
        postType: 'POST',
        originalPostKey: null,
        sharedPostKey: null,
        hasMidia: false
      },

      {
        key: 'post20',
        authorId: users[8].id,
        content:
          'Adding this to the discussion because the information shared here provides some useful background that may have been overlooked.',
        postType: 'SHARE_REPLY',
        originalPostKey: null,
        sharedPostKey: 'post19',
        hasMidia: true,
        dimensions: "486x195"
      },
    ];

    const postIds = {};

    for (const post of posts) {
      const createdPost = await tx.posts.create({
        data: {
          authorId: post.authorId,
          content: post.content,
          postType: post.postType,
          hasMidia: post.hasMidia,
          dimensions: post.dimensions ?? null,
          originalPostId: post.originalPostKey
            ? postIds[post.originalPostKey]
            : null,
          sharedPostId: post.sharedPostKey
            ? postIds[post.sharedPostKey]
            : null,
        },
      });

      postIds[post.key] = createdPost.id;
    }

    const midias = await tx.midias.createManyAndReturn({
      data: [
        {
          mime: postsPictures.pic1[0],
          content: Buffer.from(postsPictures.pic1[1], "base64"),
          ownerId: users[5].id,
          postId: postIds.post5
        },
        {
          mime: postsPictures.pic2[0],
          content: Buffer.from(postsPictures.pic2[1], "base64"),
          ownerId: users[1].id,
          postId: postIds.post7
        },
        {
          mime: postsPictures.pic3[0],
          content: Buffer.from(postsPictures.pic3[1], "base64"),
          ownerId: users[6].id,
          postId: postIds.post8
        },
        {
          mime: postsPictures.pic4[0],
          content: Buffer.from(postsPictures.pic4[1], "base64"),
          ownerId: users[8].id,
          postId: postIds.post20
        },
      ]
    });

    const likes = await tx.likes.createManyAndReturn({
      data: [
        { postId: postIds.post1, whoLikedId: users[0].id },
        { postId: postIds.post1, whoLikedId: users[3].id },
        { postId: postIds.post1, whoLikedId: users[7].id },
        { postId: postIds.post1, whoLikedId: users[9].id },
        { postId: postIds.post2, whoLikedId: users[1].id },
        { postId: postIds.post2, whoLikedId: users[4].id },
        { postId: postIds.post2, whoLikedId: users[6].id },
        { postId: postIds.post2, whoLikedId: users[8].id },
        { postId: postIds.post2, whoLikedId: users[0].id },
        { postId: postIds.post2, whoLikedId: users[2].id },
        { postId: postIds.post4, whoLikedId: users[5].id },
        { postId: postIds.post4, whoLikedId: users[9].id },
        { postId: postIds.post4, whoLikedId: users[1].id },
        { postId: postIds.post4, whoLikedId: users[3].id },
        { postId: postIds.post4, whoLikedId: users[4].id },
        { postId: postIds.post4, whoLikedId: users[7].id },
        { postId: postIds.post5, whoLikedId: users[0].id },
        { postId: postIds.post5, whoLikedId: users[4].id },
        { postId: postIds.post5, whoLikedId: users[8].id },
        { postId: postIds.post5, whoLikedId: users[2].id },
        { postId: postIds.post5, whoLikedId: users[3].id },
        { postId: postIds.post7, whoLikedId: users[6].id },
        { postId: postIds.post7, whoLikedId: users[9].id },
        { postId: postIds.post7, whoLikedId: users[0].id },
        { postId: postIds.post7, whoLikedId: users[2].id },
        { postId: postIds.post7, whoLikedId: users[5].id },
        { postId: postIds.post7, whoLikedId: users[8].id },
        { postId: postIds.post8, whoLikedId: users[1].id },
        { postId: postIds.post8, whoLikedId: users[4].id },
        { postId: postIds.post8, whoLikedId: users[7].id },
        { postId: postIds.post8, whoLikedId: users[0].id },
        { postId: postIds.post8, whoLikedId: users[3].id },
        { postId: postIds.post10, whoLikedId: users[6].id },
        { postId: postIds.post10, whoLikedId: users[8].id },
        { postId: postIds.post10, whoLikedId: users[2].id },
        { postId: postIds.post10, whoLikedId: users[4].id },
        { postId: postIds.post10, whoLikedId: users[5].id },
        { postId: postIds.post10, whoLikedId: users[9].id },
        { postId: postIds.post11, whoLikedId: users[1].id },
        { postId: postIds.post11, whoLikedId: users[3].id },
        { postId: postIds.post11, whoLikedId: users[7].id },
        { postId: postIds.post11, whoLikedId: users[0].id },
        { postId: postIds.post11, whoLikedId: users[4].id },
        { postId: postIds.post13, whoLikedId: users[6].id },
        { postId: postIds.post13, whoLikedId: users[8].id },
        { postId: postIds.post13, whoLikedId: users[2].id },
        { postId: postIds.post13, whoLikedId: users[5].id },
        { postId: postIds.post13, whoLikedId: users[7].id },
        { postId: postIds.post14, whoLikedId: users[1].id },
        { postId: postIds.post14, whoLikedId: users[3].id },
        { postId: postIds.post14, whoLikedId: users[6].id },
        { postId: postIds.post14, whoLikedId: users[9].id },
        { postId: postIds.post15, whoLikedId: users[0].id },
        { postId: postIds.post15, whoLikedId: users[2].id },
        { postId: postIds.post15, whoLikedId: users[4].id },
        { postId: postIds.post15, whoLikedId: users[8].id },
        { postId: postIds.post16, whoLikedId: users[1].id },
        { postId: postIds.post16, whoLikedId: users[5].id },
        { postId: postIds.post16, whoLikedId: users[7].id },
        { postId: postIds.post17, whoLikedId: users[0].id },
        { postId: postIds.post17, whoLikedId: users[3].id },
        { postId: postIds.post17, whoLikedId: users[6].id },
        { postId: postIds.post17, whoLikedId: users[9].id },
        { postId: postIds.post17, whoLikedId: users[2].id },
        { postId: postIds.post17, whoLikedId: users[4].id },
        { postId: postIds.post19, whoLikedId: users[7].id },
        { postId: postIds.post19, whoLikedId: users[1].id },
        { postId: postIds.post19, whoLikedId: users[3].id },
        { postId: postIds.post19, whoLikedId: users[5].id },
        { postId: postIds.post19, whoLikedId: users[8].id },
        { postId: postIds.post20, whoLikedId: users[0].id },
        { postId: postIds.post20, whoLikedId: users[2].id },
        { postId: postIds.post20, whoLikedId: users[6].id },
        { postId: postIds.post20, whoLikedId: users[9].id },
        { postId: postIds.post4, whoLikedId: users[0].id },
        { postId: postIds.post11, whoLikedId: users[2].id },
        { postId: postIds.post1, whoLikedId: users[1].id },
        { postId: postIds.post1, whoLikedId: users[5].id },
        { postId: postIds.post14, whoLikedId: users[4].id },
        { postId: postIds.post8, whoLikedId: users[8].id },
        { postId: postIds.post15, whoLikedId: users[6].id },
        { postId: postIds.post19, whoLikedId: users[4].id },
        { postId: postIds.post15, whoLikedId: users[9].id },
        { postId: postIds.post20, whoLikedId: users[5].id },
        { postId: postIds.post4, whoLikedId: users[8].id },
        { postId: postIds.post15, whoLikedId: users[1].id },
        { postId: postIds.post2, whoLikedId: users[9].id },
        { postId: postIds.post10, whoLikedId: users[0].id },
        { postId: postIds.post7, whoLikedId: users[3].id },
        { postId: postIds.post14, whoLikedId: users[5].id },
        { postId: postIds.post16, whoLikedId: users[2].id },
        { postId: postIds.post8, whoLikedId: users[6].id },
        { postId: postIds.post19, whoLikedId: users[0].id },
        { postId: postIds.post20, whoLikedId: users[7].id },
      ],
    });


    const bookmarks = await tx.bookmarks.createManyAndReturn({
      data: [
        { postId: postIds.post1, whoBookmarkedId: users[2].id },
        { postId: postIds.post1, whoBookmarkedId: users[7].id },
        { postId: postIds.post2, whoBookmarkedId: users[0].id },
        { postId: postIds.post2, whoBookmarkedId: users[5].id },
        { postId: postIds.post2, whoBookmarkedId: users[3].id },
        { postId: postIds.post4, whoBookmarkedId: users[8].id },
        { postId: postIds.post4, whoBookmarkedId: users[1].id },
        { postId: postIds.post4, whoBookmarkedId: users[6].id },
        { postId: postIds.post5, whoBookmarkedId: users[4].id },
        { postId: postIds.post5, whoBookmarkedId: users[9].id },
        { postId: postIds.post5, whoBookmarkedId: users[0].id },
        { postId: postIds.post7, whoBookmarkedId: users[7].id },
        { postId: postIds.post7, whoBookmarkedId: users[2].id },
        { postId: postIds.post7, whoBookmarkedId: users[5].id },
        { postId: postIds.post8, whoBookmarkedId: users[3].id },
        { postId: postIds.post8, whoBookmarkedId: users[9].id },
        { postId: postIds.post8, whoBookmarkedId: users[1].id },
        { postId: postIds.post10, whoBookmarkedId: users[6].id },
        { postId: postIds.post10, whoBookmarkedId: users[4].id },
        { postId: postIds.post10, whoBookmarkedId: users[8].id },
        { postId: postIds.post11, whoBookmarkedId: users[0].id },
        { postId: postIds.post11, whoBookmarkedId: users[3].id },
        { postId: postIds.post11, whoBookmarkedId: users[5].id },
        { postId: postIds.post13, whoBookmarkedId: users[9].id },
        { postId: postIds.post13, whoBookmarkedId: users[2].id },
        { postId: postIds.post13, whoBookmarkedId: users[7].id },
        { postId: postIds.post14, whoBookmarkedId: users[1].id },
        { postId: postIds.post14, whoBookmarkedId: users[4].id },
        { postId: postIds.post15, whoBookmarkedId: users[6].id },
        { postId: postIds.post15, whoBookmarkedId: users[8].id },
        { postId: postIds.post16, whoBookmarkedId: users[0].id },
        { postId: postIds.post16, whoBookmarkedId: users[5].id },
        { postId: postIds.post17, whoBookmarkedId: users[3].id },
        { postId: postIds.post17, whoBookmarkedId: users[9].id },
        { postId: postIds.post17, whoBookmarkedId: users[2].id },
        { postId: postIds.post19, whoBookmarkedId: users[6].id },
        { postId: postIds.post19, whoBookmarkedId: users[1].id },
        { postId: postIds.post19, whoBookmarkedId: users[7].id },
        { postId: postIds.post20, whoBookmarkedId: users[4].id },
        { postId: postIds.post20, whoBookmarkedId: users[8].id },
        { postId: postIds.post7, whoBookmarkedId: users[0].id },
        { postId: postIds.post11, whoBookmarkedId: users[4].id },
        { postId: postIds.post19, whoBookmarkedId: users[2].id },
        { postId: postIds.post2, whoBookmarkedId: users[7].id },
        { postId: postIds.post15, whoBookmarkedId: users[3].id },
        { postId: postIds.post8, whoBookmarkedId: users[5].id },
        { postId: postIds.post2, whoBookmarkedId: users[9].id },
        { postId: postIds.post7, whoBookmarkedId: users[8].id },
        { postId: postIds.post13, whoBookmarkedId: users[4].id },
        { postId: postIds.post16, whoBookmarkedId: users[9].id },
      ],
    });

    console.log("\n*====Seeding complete====*");
    console.log("Users:");
    console.log(users.map((user) => user.username).join("\n"));
    console.log("\nPassword: pass")
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

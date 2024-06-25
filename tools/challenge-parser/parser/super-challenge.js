const parsedId = '657b106ced8c653be6b3218f';

const parsedTitle = 'Task 2';

const parsedChallengeType = 22;

const parsedDashedName = 'task-2';

const parsedVideoId = 'nVAaxZ34khk';

const parsedBilibiliIds = {
  aid: 590571151,
  bvid: 'BV1sq4y1f7gr',
  cid: 409002372
};

const parsedVideoLocaleIds = {
  espanol: '3muQV-Im3Z0',
  italian: '3muQV-Im3Z0',
  portuguese: '3muQV-Im3Z0'
};

const parsedForumTopicId = 16628;

const parsedHelpCategory = 'Python';

const parsedMsTrophyId = 'learn.wwl.get-started-c-sharp-part-3.trophy';

const parsedPrerequisites = [
  {
    id: '647f85d407d29547b3bee1bb',
    title: 'Trophy - Write Your First Code Using C#'
  },
  {
    id: '647f87dc07d29547b3bee1bf',
    title: 'Trophy - Create and Run Simple C# Console Applications'
  },
  {
    id: '647f882207d29547b3bee1c0',
    title: 'Trophy - Add Logic to C# Console Applications'
  },
  {
    id: '647f867a07d29547b3bee1bc',
    title: 'Trophy - Work with Variable Data in C# Console Applications'
  },
  {
    id: '647f877f07d29547b3bee1be',
    title: 'Trophy - Create Methods in C# Console Applications'
  },
  {
    id: '647f86ff07d29547b3bee1bd',
    title: 'Trophy - Debug C# Console Applications'
  }
];

const parsedVideoUrl = 'https://scrimba.com/c/cPp7VfD';

const parsedUrl = 'freeCodeCamp/learn-celestial-bodies-database';

const parsedDescription = `You've likely seen an \`alt\` attribute on an \`img\` tag in other challenges. \`alt\` text describes the image's content and provides a text-alternative for it. An \`alt\` attribute helps in cases where the image fails to load or can't be seen by a user. Search engines also use it to understand what an image contains to include it in search results. Here's an example:

\`\`\`html
<img src="importantLogo.jpeg" alt="Company logo">
\`\`\`

| n | Gaussian integer divisors with positive real part | Sum s(n) of these divisors |
|---|---------------------------------------------------|----------------------------|
| 1 | 1                                                 | 1                          |
| 2 | 1, 1 + i, 1 - i, 2                                | 5                          |
| 3 | 1, 3                                              | 4                          |
| 4 | 1, 1 + i, 1 - i, 2, 2 + 2i, 2 - 2i, 4             | 13                         |
| 5 | 1, 1 + 2i, 1 - 2i, 2 + i, 2 - i, 5                | 12                         |

More resources:

*   <a href="https://github.com/ine-rmotr-curriculum/FreeCodeCamp-Pandas-Real-Life-Example" target="_blank" rel="noopener noreferrer nofollow">Notebooks on GitHub</a>
*   <a href="https://colab.research.google.com/github/googlecolab/colabtools/blob/master/notebooks/colab-github-demo.ipynb" target="_blank" rel="noopener noreferrer nofollow">How to open Notebooks from GitHub using Google Colab.</a>`;

const parsedInstructions = `Time to take a break from Camper Cat and meet fellow camper Zersiax (@zersiax), a champion of accessibility and a screen reader user. To hear a clip of his screen reader in action, add an \`audio\` element after the \`p\` element. Include the \`controls\` attribute. Then place a \`source\` element inside the \`audio\` tags with the \`src\` attribute set to \`https://s3.amazonaws.com/freecodecamp/screen-reader.mp3\` and \`type\` attribute set to \`"audio/mpeg"\`.

**Note:** The audio clip may sound fast and be difficult to understand, but that is a normal speed for screen reader users.`;

const parsedNotes = `Required files: \`worldcup.sql\`, \`insert_data.sh\`, \`queries.sh\``;

const parsedHints = [
  {
    text: 'You should use `document.getElementById()` to get the `#author-container` element.',
    testString:
      'assert.match(code, /document\\.getElementById\\(\\s*(\'|"|`)author\\-container\\1\\s*\\)/);'
  },
  {
    text: "You should assign the `#author-container` element to the variable `authorContainer`. Don't forget to use `const` to declare the variable.",
    testString:
      'assert.match(code, /const\\s+authorContainer\\s*\\=\\s*document\\.getElementById\\(\\s*(\'|"|`)author\\-container\\1\\s*\\)/);'
  }
];

const parsedAssignment = [
  'Build some muscle memory by deleting the contents of the `index.html` file and trying to write out all the boilerplate again from memory.',
  'Run your boilerplate through this [HTML validator](https://www.freeformatter.com/html-validator.html).'
];

const parsedQuestion = {
  text: 'Does Tom want to hear Sophie play the guitar?',
  answers: [
    { answer: '`Yes, he wants to.`', feedback: null },
    {
      answer: "`No, he doesn't want to.`",
      feedback:
        'The dialogue suggests Tom expresses a desire to hear Sophie play.'
    },
    {
      answer: "`No, he don't want to.`",
      feedback: "`Don't` is not correct with `he`; it should be `doesn't.`"
    },
    {
      answer: '`Yes, he wanted to.`',
      feedback:
        "`Wanted` is past tense, but Tom's desire to hear Sophie play is in the present."
    }
  ],
  solution: 1
};

const parsedFillInTheBlank = {
  sentence:
    'Those are great traits for _ in her position, I think. What _ she _ as the team lead?',
  blanks: [
    { answer: 'someone', feedback: null },
    {
      answer: 'does',
      feedback:
        "You're looking for the correct auxiliary verb that goes with `she` when asking a question. Remember, `she` requires a different form of `do` than `I` or `you.`"
    },
    {
      answer: 'do',
      feedback:
        "You're looking for the main verb `do` to inquire about her job activities"
    }
  ]
};

const parsedScene = {
  setup: {
    background: 'company1-reception.png',
    characters: [
      {
        character: 'Sarah',
        position: { x: -25, y: 0, z: 1 }
      },
      {
        character: 'Tom',
        position: { x: 125, y: 0, z: 1 }
      }
    ],
    audio: {
      filename: '1.3-1.mp3',
      startTime: 1
    },
    alwaysShowDialogue: true
  },
  commands: [
    {
      character: 'Sarah',
      position: { x: 25, y: 0, z: 1 },
      startTime: 0
    },
    {
      character: 'Tom',
      position: { x: 70, y: 0, z: 1 },
      startTime: 0.5
    },
    {
      character: 'Sarah',
      startTime: 1.0,
      finishTime: 3.7,
      dialogue: {
        text: 'Hi, Tom! Are you happy with the workplace so far?',
        align: 'left'
      }
    },
    {
      character: 'Tom',
      startTime: 4.2,
      finishTime: 5.2,
      dialogue: {
        text: "Yes, it's great!",
        align: 'right'
      }
    },
    {
      character: 'Tom',
      startTime: 5.4,
      finishTime: 6.7,
      dialogue: {
        text: 'Everyone is friendly.',
        align: 'right'
      }
    },
    {
      character: 'Tom',
      startTime: 6.9,
      finishTime: 10.4,
      dialogue: {
        text: 'Listen, how about the team-building activities here? Are they cool?',
        align: 'right'
      }
    },
    {
      character: 'Sarah',
      startTime: 10.6,
      finishTime: 13.0,
      dialogue: {
        text: 'Yes, we go out with the team sometimes.',
        align: 'left'
      }
    },
    {
      character: 'Sarah',
      startTime: 13.2,
      finishTime: 14.5,
      dialogue: {
        text: 'Are you into these activities?',
        align: 'left'
      }
    },
    {
      character: 'Tom',
      startTime: 14.7,
      finishTime: 16.7,
      dialogue: {
        text: "Absolutely! They're really fun.",
        align: 'right'
      }
    },
    {
      character: 'Tom',
      startTime: 16.9,
      finishTime: 18.1,
      dialogue: {
        text: "What's the team's favorite?",
        align: 'right'
      }
    },
    {
      character: 'Sarah',
      startTime: 18.6,
      finishTime: 20.6,
      dialogue: {
        text: 'Many of us enjoy the monthly game night.',
        align: 'left'
      }
    },
    {
      character: 'Sarah',
      startTime: 20.8,
      finishTime: 22.1,
      dialogue: {
        text: 'Are you into board games?',
        align: 'left'
      }
    },
    {
      character: 'Tom',
      startTime: 22.3,
      finishTime: 23.8,
      dialogue: {
        text: 'Yes, I love board games!',
        align: 'right'
      }
    },
    {
      character: 'Sarah',
      startTime: 24.0,
      finishTime: 27.0,
      dialogue: {
        text: "'Monopoly' and 'Ticket To Ride' are popular choices.",
        align: 'left'
      }
    },
    {
      character: 'Sarah',
      startTime: 27.2,
      finishTime: 28.2,
      dialogue: {
        text: 'Are you familiar with them?',
        align: 'left'
      }
    },
    {
      character: 'Tom',
      startTime: 28.4,
      finishTime: 30.9,
      dialogue: {
        text: "Yes, I've played both before. Great choices.",
        align: 'right'
      }
    },
    {
      character: 'Tom',
      startTime: 31.1,
      finishTime: 35.1,
      dialogue: {
        text: "Is the team into playing games on computers as well, like 'Gartic'?",
        align: 'right'
      }
    },
    {
      character: 'Sarah',
      startTime: 35.3,
      finishTime: 38.3,
      dialogue: {
        text: "Oh, yeah! 'Gartic' is another favorite.",
        align: 'left'
      }
    },
    {
      character: 'Sarah',
      startTime: 38.5,
      finishTime: 40.5,
      dialogue: {
        text: "Maybe we can play 'Gartic' on the next game night?",
        align: 'left'
      }
    },
    {
      character: 'Tom',
      startTime: 40.7,
      finishTime: 42.7,
      dialogue: {
        text: 'That sounds like a plan, Sarah!',
        align: 'right'
      }
    },
    {
      character: 'Tom',
      startTime: 42.9,
      finishTime: 44.1,
      dialogue: {
        text: 'Thanks for the suggestions.',
        align: 'right'
      }
    },
    {
      character: 'Tom',
      position: { x: 125, y: 0, z: 1 },
      startTime: 44.1
    },
    {
      character: 'Sarah',
      position: { x: -25, y: 0, z: 1 },
      startTime: 44.6
    }
  ]
};

// The commented out properties are added to graphql post parser - see /shared/utils/polyvinyl.js
const parsedChallengeFiles = [
  {
    contents:
      '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>freeCodeCamp News Author Page</title>\n    <link rel="stylesheet" href="./styles.css" />\n  </head>\n  <body>\n    <h1 class="title">freeCodeCamp News Author Page</h1>\n\n    <main>\n      <div id="author-container"></div>\n      <button class="btn" id="load-more-btn">Load More Authors</button>\n    </main>\n\n    <script src="./script.js"></script>\n  </body>\n</html>',
    editableRegionBoundaries: [],
    // "fileKey": "indexhtml",
    ext: 'html',
    head: '',
    // "history": [
    //   "index.html"
    // ],
    id: '',
    name: 'index',
    // "path": "index.html",
    // "seed": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>freeCodeCamp News Author Page</title>\n    <link rel=\"stylesheet\" href=\"./styles.css\" />\n  </head>\n  <body>\n    <h1 class=\"title\">freeCodeCamp News Author Page</h1>\n\n    <main>\n      <div id=\"author-container\"></div>\n      <button class=\"btn\" id=\"load-more-btn\">Load More Authors</button>\n    </main>\n\n    <script src=\"./script.js\"></script>\n  </body>\n</html>",
    tail: ''
  },
  {
    contents:
      '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n:root {\n  --main-bg-color: #1b1b32;\n  --light-grey: #f5f6f7;\n  --dark-purple: #5a01a7;\n  --golden-yellow: #feac32;\n}\n\nbody {\n  background-color: var(--main-bg-color);\n  text-align: center;\n}\n\n.title {\n  color: var(--light-grey);\n  margin: 20px 0;\n}\n\n#author-container {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n.user-card {\n  border-radius: 15px;\n  width: 300px;\n  height: 350px;\n  background-color: var(--light-grey);\n  margin: 20px;\n}\n\n.user-img {\n  width: 150px;\n  height: 150px;\n  object-fit: cover;\n}\n\n.purple-divider {\n  background-color: var(--dark-purple);\n  width: 100%;\n  height: 15px;\n}\n\n.author-name {\n  margin: 10px;\n}\n\n.bio {\n  margin: 20px;\n}\n\n.error-msg {\n  color: var(--light-grey);\n}\n\n.btn {\n  cursor: pointer;\n  width: 200px;\n  margin: 10px;\n  color: var(--main-bg-color);\n  font-size: 14px;\n  background-color: var(--golden-yellow);\n  background-image: linear-gradient(#fecc4c, #ffac33);\n  border-color: var(--golden-yellow);\n  border-width: 3px;\n}',
    editableRegionBoundaries: [],
    // "fileKey": "stylescss",
    ext: 'css',
    head: '',
    // "history": [
    //   "styles.css"
    // ],
    id: '',
    name: 'styles',
    // "path": "styles.css",
    // "seed": "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n:root {\n  --main-bg-color: #1b1b32;\n  --light-grey: #f5f6f7;\n  --dark-purple: #5a01a7;\n  --golden-yellow: #feac32;\n}\n\nbody {\n  background-color: var(--main-bg-color);\n  text-align: center;\n}\n\n.title {\n  color: var(--light-grey);\n  margin: 20px 0;\n}\n\n#author-container {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n.user-card {\n  border-radius: 15px;\n  width: 300px;\n  height: 350px;\n  background-color: var(--light-grey);\n  margin: 20px;\n}\n\n.user-img {\n  width: 150px;\n  height: 150px;\n  object-fit: cover;\n}\n\n.purple-divider {\n  background-color: var(--dark-purple);\n  width: 100%;\n  height: 15px;\n}\n\n.author-name {\n  margin: 10px;\n}\n\n.bio {\n  margin: 20px;\n}\n\n.error-msg {\n  color: var(--light-grey);\n}\n\n.btn {\n  cursor: pointer;\n  width: 200px;\n  margin: 10px;\n  color: var(--main-bg-color);\n  font-size: 14px;\n  background-color: var(--golden-yellow);\n  background-image: linear-gradient(#fecc4c, #ffac33);\n  border-color: var(--golden-yellow);\n  border-width: 3px;\n}",
    tail: ''
  },
  {
    contents:
      'const authorContainer = document.getElementById(\'author-container\');\nconst loadMoreBtn = document.getElementById(\'load-more-btn\');\n\nlet startingIndex = 0;\nlet endingIndex = 8;\nlet authorDataArr = [];\n\nfetch(\'https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json\')\n  .then((res) => res.json())\n  .then((data) => {\n    authorDataArr = data;\n    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));  \n  })\n  .catch((err) => {\n   authorContainer.innerHTML = \'<p class="error-msg">There was an error loading the authors</p>\';\n  });\n\nconst fetchMoreAuthors = () => {\n  startingIndex += 8;\n  endingIndex += 8;\n\n  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));\n  if (authorDataArr.length <= endingIndex) {\n    loadMoreBtn.disabled = true;\n\n    loadMoreBtn.textContent = \'No more data to load\';\n  }\n};\n\nconst displayAuthors = (authors) => {\n  authors.forEach(({ author, image, url, bio }, index) => {\n    authorContainer.innerHTML += `\n    <div id="${index}" class="user-card">\n      <h2 class="author-name">${author}</h2>\n      <img class="user-img" src="${image}" alt="${author} avatar">\n      <div class="purple-divider"></div>\n      <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + \'...\' : bio}</p>\n      <a class="author-link" href="${url}" target="_blank">${author} author page</a>\n    </div>\n  `;\n  });\n};\n\nloadMoreBtn.addEventListener(\'click\', fetchMoreAuthors);',
    editableRegionBoundaries: [24, 26],
    // "fileKey": "scriptjs",
    ext: 'js',
    head: '',
    // "history": [
    //   "script.js"
    // ],
    id: '',
    name: 'script',
    // "path": "script.js",
    // "seed": "const authorContainer = document.getElementById('author-container');\nconst loadMoreBtn = document.getElementById('load-more-btn');\n\nlet startingIndex = 0;\nlet endingIndex = 8;\nlet authorDataArr = [];\n\nfetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')\n  .then((res) => res.json())\n  .then((data) => {\n    authorDataArr = data;\n    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));  \n  })\n  .catch((err) => {\n   authorContainer.innerHTML = '<p class=\"error-msg\">There was an error loading the authors</p>';\n  });\n\nconst fetchMoreAuthors = () => {\n  startingIndex += 8;\n  endingIndex += 8;\n\n  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));\n  if (authorDataArr.length <= endingIndex) {\n    loadMoreBtn.disabled = true;\n\n    loadMoreBtn.textContent = 'No more data to load';\n  }\n};\n\nconst displayAuthors = (authors) => {\n  authors.forEach(({ author, image, url, bio }, index) => {\n    authorContainer.innerHTML += `\n    <div id=\"${index}\" class=\"user-card\">\n      <h2 class=\"author-name\">${author}</h2>\n      <img class=\"user-img\" src=\"${image}\" alt=\"${author} avatar\">\n      <div class=\"purple-divider\"></div>\n      <p class=\"bio\">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>\n      <a class=\"author-link\" href=\"${url}\" target=\"_blank\">${author} author page</a>\n    </div>\n  `;\n  });\n};\n\nloadMoreBtn.addEventListener('click', fetchMoreAuthors);",
    tail: ''
  }
];

const parsedSolutions = [
  [
    {
      contents:
        '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>freeCodeCamp News Author Page</title>\n    <link rel="stylesheet" href="./styles.css" />\n  </head>\n  <body>\n    <h1 class="title">freeCodeCamp News Author Page</h1>\n\n    <main>\n      <div id="author-container"></div>\n      <button class="btn" id="load-more-btn">Load More Authors</button>\n    </main>\n\n    <script src="./script.js"></script>\n  </body>\n</html>',
      ext: 'html',
      // "fileKey": "indexhtml",
      head: '',
      // "history": [
      //   "index.html"
      // ],
      id: '',
      name: 'index',
      // "path": "index.html",
      // "seed": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>freeCodeCamp News Author Page</title>\n    <link rel=\"stylesheet\" href=\"./styles.css\" />\n  </head>\n  <body>\n    <h1 class=\"title\">freeCodeCamp News Author Page</h1>\n\n    <main>\n      <div id=\"author-container\"></div>\n      <button class=\"btn\" id=\"load-more-btn\">Load More Authors</button>\n    </main>\n\n    <script src=\"./script.js\"></script>\n  </body>\n</html>",
      tail: ''
    },
    {
      contents:
        '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n:root {\n  --main-bg-color: #1b1b32;\n  --light-grey: #f5f6f7;\n  --dark-purple: #5a01a7;\n  --golden-yellow: #feac32;\n}\n\nbody {\n  background-color: var(--main-bg-color);\n  text-align: center;\n}\n\n.title {\n  color: var(--light-grey);\n  margin: 20px 0;\n}\n\n#author-container {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n.user-card {\n  border-radius: 15px;\n  width: 300px;\n  height: 350px;\n  background-color: var(--light-grey);\n  margin: 20px;\n}\n\n.user-img {\n  width: 150px;\n  height: 150px;\n  object-fit: cover;\n}\n\n.purple-divider {\n  background-color: var(--dark-purple);\n  width: 100%;\n  height: 15px;\n}\n\n.author-name {\n  margin: 10px;\n}\n\n.bio {\n  margin: 20px;\n}\n\n.error-msg {\n  color: var(--light-grey);\n}\n\n.btn {\n  cursor: pointer;\n  width: 200px;\n  margin: 10px;\n  color: var(--main-bg-color);\n  font-size: 14px;\n  background-color: var(--golden-yellow);\n  background-image: linear-gradient(#fecc4c, #ffac33);\n  border-color: var(--golden-yellow);\n  border-width: 3px;\n}',
      ext: 'css',
      // "fileKey": "stylescss",
      head: '',
      // "history": [
      //   "styles.css"
      // ],
      id: '',
      name: 'styles',
      // "path": "styles.css",
      // "seed": "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n:root {\n  --main-bg-color: #1b1b32;\n  --light-grey: #f5f6f7;\n  --dark-purple: #5a01a7;\n  --golden-yellow: #feac32;\n}\n\nbody {\n  background-color: var(--main-bg-color);\n  text-align: center;\n}\n\n.title {\n  color: var(--light-grey);\n  margin: 20px 0;\n}\n\n#author-container {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n.user-card {\n  border-radius: 15px;\n  width: 300px;\n  height: 350px;\n  background-color: var(--light-grey);\n  margin: 20px;\n}\n\n.user-img {\n  width: 150px;\n  height: 150px;\n  object-fit: cover;\n}\n\n.purple-divider {\n  background-color: var(--dark-purple);\n  width: 100%;\n  height: 15px;\n}\n\n.author-name {\n  margin: 10px;\n}\n\n.bio {\n  margin: 20px;\n}\n\n.error-msg {\n  color: var(--light-grey);\n}\n\n.btn {\n  cursor: pointer;\n  width: 200px;\n  margin: 10px;\n  color: var(--main-bg-color);\n  font-size: 14px;\n  background-color: var(--golden-yellow);\n  background-image: linear-gradient(#fecc4c, #ffac33);\n  border-color: var(--golden-yellow);\n  border-width: 3px;\n}",
      tail: ''
    },
    {
      contents:
        'const authorContainer = document.getElementById(\'author-container\');\nconst loadMoreBtn = document.getElementById(\'load-more-btn\');\n\nlet startingIndex = 0;\nlet endingIndex = 8;\nlet authorDataArr = [];\n\nfetch(\'https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json\')\n  .then((res) => res.json())\n  .then((data) => {\n    authorDataArr = data;\n    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));  \n  })\n  .catch((err) => {\n   authorContainer.innerHTML = \'<p class="error-msg">There was an error loading the authors</p>\';\n  });\n\nconst fetchMoreAuthors = () => {\n  startingIndex += 8;\n  endingIndex += 8;\n\n  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));\n  if (authorDataArr.length <= endingIndex) {\n    loadMoreBtn.disabled = true;\n    loadMoreBtn.style.cursor = "not-allowed"\n    loadMoreBtn.textContent = \'No more data to load\';\n  }\n};\n\nconst displayAuthors = (authors) => {\n  authors.forEach(({ author, image, url, bio }, index) => {\n    authorContainer.innerHTML += `\n    <div id="${index}" class="user-card">\n      <h2 class="author-name">${author}</h2>\n      <img class="user-img" src="${image}" alt="${author} avatar" />\n      <div class="purple-divider"></div>\n      <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + \'...\' : bio}</p>\n      <a class="author-link" href="${url}" target="_blank">${author} author page</a>\n    </div>\n  `;\n  });\n};\n\nloadMoreBtn.addEventListener(\'click\', fetchMoreAuthors);',
      ext: 'js',
      // "fileKey": "scriptjs",
      head: '',
      // "history": [
      //   "script.js"
      // ],
      id: '',
      name: 'script',
      // "path": "script.js",
      // "seed": "const authorContainer = document.getElementById('author-container');\nconst loadMoreBtn = document.getElementById('load-more-btn');\n\nlet startingIndex = 0;\nlet endingIndex = 8;\nlet authorDataArr = [];\n\nfetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')\n  .then((res) => res.json())\n  .then((data) => {\n    authorDataArr = data;\n    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));  \n  })\n  .catch((err) => {\n   authorContainer.innerHTML = '<p class=\"error-msg\">There was an error loading the authors</p>';\n  });\n\nconst fetchMoreAuthors = () => {\n  startingIndex += 8;\n  endingIndex += 8;\n\n  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));\n  if (authorDataArr.length <= endingIndex) {\n    loadMoreBtn.disabled = true;\n    loadMoreBtn.style.cursor = \"not-allowed\"\n    loadMoreBtn.textContent = 'No more data to load';\n  }\n};\n\nconst displayAuthors = (authors) => {\n  authors.forEach(({ author, image, url, bio }, index) => {\n    authorContainer.innerHTML += `\n    <div id=\"${index}\" class=\"user-card\">\n      <h2 class=\"author-name\">${author}</h2>\n      <img class=\"user-img\" src=\"${image}\" alt=\"${author} avatar\" />\n      <div class=\"purple-divider\"></div>\n      <p class=\"bio\">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>\n      <a class=\"author-link\" href=\"${url}\" target=\"_blank\">${author} author page</a>\n    </div>\n  `;\n  });\n};\n\nloadMoreBtn.addEventListener('click', fetchMoreAuthors);",
      tail: ''
    }
  ]
];

module.exports = {
  parsedId,
  parsedTitle,
  parsedChallengeType,
  parsedDashedName,
  parsedVideoId,
  parsedBilibiliIds,
  parsedVideoLocaleIds,
  parsedForumTopicId,
  parsedHelpCategory,
  parsedMsTrophyId,
  parsedPrerequisites,
  parsedVideoUrl,
  parsedUrl,
  parsedDescription,
  parsedInstructions,
  parsedNotes,
  parsedHints,
  parsedAssignment,
  parsedQuestion,
  parsedFillInTheBlank,
  parsedScene,
  parsedChallengeFiles,
  parsedSolutions
};

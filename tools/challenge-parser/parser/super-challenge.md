---
id: 657b106ced8c653be6b3218f
title: Task 2
challengeType: 22
dashedName: task-2
videoId: nVAaxZ34khk
bilibiliIds:
  aid: 590571151
  bvid: BV1sq4y1f7gr
  cid: 409002372
videoLocaleIds:
  espanol: 3muQV-Im3Z0
  italian: 3muQV-Im3Z0
  portuguese: 3muQV-Im3Z0
forumTopicId: 16628
helpCategory: Python
msTrophyId: learn.wwl.get-started-c-sharp-part-3.trophy
prerequisites:
  - id: 647f85d407d29547b3bee1bb
    title: Trophy - Write Your First Code Using C#
  - id: 647f87dc07d29547b3bee1bf
    title: Trophy - Create and Run Simple C# Console Applications
  - id: 647f882207d29547b3bee1c0
    title: Trophy - Add Logic to C# Console Applications
  - id: 647f867a07d29547b3bee1bc
    title: Trophy - Work with Variable Data in C# Console Applications
  - id: 647f877f07d29547b3bee1be
    title: Trophy - Create Methods in C# Console Applications
  - id: 647f86ff07d29547b3bee1bd
    title: Trophy - Debug C# Console Applications
videoUrl: https://scrimba.com/c/cPp7VfD
url: freeCodeCamp/learn-celestial-bodies-database
---

# --description--

You've likely seen an `alt` attribute on an `img` tag in other challenges. `alt` text describes the image's content and provides a text-alternative for it. An `alt` attribute helps in cases where the image fails to load or can't be seen by a user. Search engines also use it to understand what an image contains to include it in search results. Here's an example:

```html
<img src="importantLogo.jpeg" alt="Company logo">
```

| n | Gaussian integer divisors with positive real part | Sum s(n) of these divisors |
|---|---------------------------------------------------|----------------------------|
| 1 | 1                                                 | 1                          |
| 2 | 1, 1 + i, 1 - i, 2                                | 5                          |
| 3 | 1, 3                                              | 4                          |
| 4 | 1, 1 + i, 1 - i, 2, 2 + 2i, 2 - 2i, 4             | 13                         |
| 5 | 1, 1 + 2i, 1 - 2i, 2 + i, 2 - i, 5                | 12                         |

More resources:

- <a href="https://github.com/ine-rmotr-curriculum/FreeCodeCamp-Pandas-Real-Life-Example" target="_blank" rel="noopener noreferrer nofollow">Notebooks on GitHub</a>
- <a href="https://colab.research.google.com/github/googlecolab/colabtools/blob/master/notebooks/colab-github-demo.ipynb" target="_blank" rel="noopener noreferrer nofollow">How to open Notebooks from GitHub using Google Colab.</a>

# --instructions--

Time to take a break from Camper Cat and meet fellow camper Zersiax (@zersiax), a champion of accessibility and a screen reader user. To hear a clip of his screen reader in action, add an `audio` element after the `p` element. Include the `controls` attribute. Then place a `source` element inside the `audio` tags with the `src` attribute set to `https://s3.amazonaws.com/freecodecamp/screen-reader.mp3` and `type` attribute set to `"audio/mpeg"`.

**Note:** The audio clip may sound fast and be difficult to understand, but that is a normal speed for screen reader users.

# --notes--

Required files: `worldcup.sql`, `insert_data.sh`, `queries.sh`

# --hints--

You should use `document.getElementById()` to get the `#author-container` element.

```js
assert.match(code, /document\.getElementById\(\s*('|"|`)author\-container\1\s*\)/);
```

You should assign the `#author-container` element to the variable `authorContainer`. Don't forget to use `const` to declare the variable.

```js
assert.match(code, /const\s+authorContainer\s*\=\s*document\.getElementById\(\s*('|"|`)author\-container\1\s*\)/);
```

# --assignment--

Build some muscle memory by deleting the contents of the `index.html` file and trying to write out all the boilerplate again from memory.

---

Run your boilerplate through this [HTML validator](https://www.freeformatter.com/html-validator.html).

# --question--

## --text--

Does Tom want to hear Sophie play the guitar?

## --answers--

`Yes, he wants to.`

---

`No, he doesn't want to.`

### --feedback--

The dialogue suggests Tom expresses a desire to hear Sophie play.

---

`No, he don't want to.`

### --feedback--

`Don't` is not correct with `he`; it should be `doesn't.`

---

`Yes, he wanted to.`

### --feedback--

`Wanted` is past tense, but Tom's desire to hear Sophie play is in the present.

## --video-solution--

1

# --fillInTheBlank--

## --sentence--

`Those are great traits for _ in her position, I think. What _ she _ as the team lead?`

## --blanks--

`someone`

---

`does`

### --feedback--

You're looking for the correct auxiliary verb that goes with `she` when asking a question. Remember, `she` requires a different form of `do` than `I` or `you.`

---

`do`

### --feedback--

You're looking for the main verb `do` to inquire about her job activities

# --scene--

```json
{
  "setup": {
    "background": "company1-reception.png",
    "characters": [
      {
        "character": "Sarah",
        "position": { "x": -25, "y": 0, "z": 1 }
      },
      {
        "character": "Tom",
        "position": { "x": 125, "y": 0, "z": 1 }
      }
    ],
    "audio": {
      "filename": "1.3-1.mp3",
      "startTime": 1
    },
    "alwaysShowDialogue": true
  },
  "commands": [
    {
      "character": "Sarah",
      "position": { "x": 25, "y": 0, "z": 1 },
      "startTime": 0
    },
    {
      "character": "Tom",
      "position": { "x": 70, "y": 0, "z": 1 },
      "startTime": 0.5
    },
    {
      "character": "Sarah",
      "startTime": 1.0,
      "finishTime": 3.7,
      "dialogue": {
        "text": "Hi, Tom! Are you happy with the workplace so far?",
        "align": "left"
      }
    },
    {
      "character": "Tom",
      "startTime": 4.2,
      "finishTime": 5.2,
      "dialogue": {
        "text": "Yes, it's great!",
        "align": "right"
      }
    },
    {
      "character": "Tom",
      "startTime": 5.4,
      "finishTime": 6.7,
      "dialogue": {
        "text": "Everyone is friendly.",
        "align": "right"
      }
    },
    {
      "character": "Tom",
      "startTime": 6.9,
      "finishTime": 10.4,
      "dialogue": {
        "text": "Listen, how about the team-building activities here? Are they cool?",
        "align": "right"
      }
    },
    {
      "character": "Sarah",
      "startTime": 10.6,
      "finishTime": 13.0,
      "dialogue": {
        "text": "Yes, we go out with the team sometimes.",
        "align": "left"
      }
    },
    {
      "character": "Sarah",
      "startTime": 13.2,
      "finishTime": 14.5,
      "dialogue": {
        "text": "Are you into these activities?",
        "align": "left"
      }
    },
    {
      "character": "Tom",
      "startTime": 14.7,
      "finishTime": 16.7,
      "dialogue": {
        "text": "Absolutely! They're really fun.",
        "align": "right"
      }
    },
    {
      "character": "Tom",
      "startTime": 16.9,
      "finishTime": 18.1,
      "dialogue": {
        "text": "What's the team's favorite?",
        "align": "right"
      }
    },
    {
      "character": "Sarah",
      "startTime": 18.6,
      "finishTime": 20.6,
      "dialogue": {
        "text": "Many of us enjoy the monthly game night.",
        "align": "left"
      }
    },
    {
      "character": "Sarah",
      "startTime": 20.8,
      "finishTime": 22.1,
      "dialogue": {
        "text": "Are you into board games?",
        "align": "left"
      }
    },
    {
      "character": "Tom",
      "startTime": 22.3,
      "finishTime": 23.8,
      "dialogue": {
        "text": "Yes, I love board games!",
        "align": "right"
      }
    },
    {
      "character": "Sarah",
      "startTime": 24.0,
      "finishTime": 27.0,
      "dialogue": {
        "text": "'Monopoly' and 'Ticket To Ride' are popular choices.",
        "align": "left"
      }
    },
    {
      "character": "Sarah",
      "startTime": 27.2,
      "finishTime": 28.2,
      "dialogue": {
        "text": "Are you familiar with them?",
        "align": "left"
      }
    },
    {
      "character": "Tom",
      "startTime": 28.4,
      "finishTime": 30.9,
      "dialogue": {
        "text": "Yes, I've played both before. Great choices.",
        "align": "right"
      }
    },
    {
      "character": "Tom",
      "startTime": 31.1,
      "finishTime": 35.1,
      "dialogue": {
        "text": "Is the team into playing games on computers as well, like 'Gartic'?",
        "align": "right"
      }
    },
    {
      "character": "Sarah",
      "startTime": 35.3,
      "finishTime": 38.3,
      "dialogue": {
        "text": "Oh, yeah! 'Gartic' is another favorite.",
        "align": "left"
      }
    },
    {
      "character": "Sarah",
      "startTime": 38.5,
      "finishTime": 40.5,
      "dialogue": {
        "text": "Maybe we can play 'Gartic' on the next game night?",
        "align": "left"
      }
    },
    {
      "character": "Tom",
      "startTime": 40.7,
      "finishTime": 42.7,
      "dialogue": {
        "text": "That sounds like a plan, Sarah!",
        "align": "right"
      }
    },
    {
      "character": "Tom",
      "startTime": 42.9,
      "finishTime": 44.1,
      "dialogue": {
        "text": "Thanks for the suggestions.",
        "align": "right"
      }
    },
    {
      "character": "Tom",
      "position": { "x": 125, "y": 0, "z": 1 },
      "startTime": 44.1
    },
    {
      "character": "Sarah",
      "position": { "x": -25, "y": 0, "z": 1 },
      "startTime": 44.6
    }
  ]
}
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>freeCodeCamp News Author Page</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1 class="title">freeCodeCamp News Author Page</h1>

    <main>
      <div id="author-container"></div>
      <button class="btn" id="load-more-btn">Load More Authors</button>
    </main>

    <script src="./script.js"></script>
  </body>
</html>
```

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --main-bg-color: #1b1b32;
  --light-grey: #f5f6f7;
  --dark-purple: #5a01a7;
  --golden-yellow: #feac32;
}

body {
  background-color: var(--main-bg-color);
  text-align: center;
}

.title {
  color: var(--light-grey);
  margin: 20px 0;
}

#author-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.user-card {
  border-radius: 15px;
  width: 300px;
  height: 350px;
  background-color: var(--light-grey);
  margin: 20px;
}

.user-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.purple-divider {
  background-color: var(--dark-purple);
  width: 100%;
  height: 15px;
}

.author-name {
  margin: 10px;
}

.bio {
  margin: 20px;
}

.error-msg {
  color: var(--light-grey);
}

.btn {
  cursor: pointer;
  width: 200px;
  margin: 10px;
  color: var(--main-bg-color);
  font-size: 14px;
  background-color: var(--golden-yellow);
  background-image: linear-gradient(#fecc4c, #ffac33);
  border-color: var(--golden-yellow);
  border-width: 3px;
}
```

```js
const authorContainer = document.getElementById('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let startingIndex = 0;
let endingIndex = 8;
let authorDataArr = [];

fetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')
  .then((res) => res.json())
  .then((data) => {
    authorDataArr = data;
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));  
  })
  .catch((err) => {
   authorContainer.innerHTML = '<p class="error-msg">There was an error loading the authors</p>';
  });

const fetchMoreAuthors = () => {
  startingIndex += 8;
  endingIndex += 8;

  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
  if (authorDataArr.length <= endingIndex) {
    loadMoreBtn.disabled = true;
    --fcc-editable-region--

    --fcc-editable-region--
    loadMoreBtn.textContent = 'No more data to load';
  }
};

const displayAuthors = (authors) => {
  authors.forEach(({ author, image, url, bio }, index) => {
    authorContainer.innerHTML += `
    <div id="${index}" class="user-card">
      <h2 class="author-name">${author}</h2>
      <img class="user-img" src="${image}" alt="${author} avatar">
      <div class="purple-divider"></div>
      <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>
      <a class="author-link" href="${url}" target="_blank">${author} author page</a>
    </div>
  `;
  });
};

loadMoreBtn.addEventListener('click', fetchMoreAuthors);
```

# --solutions--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>freeCodeCamp News Author Page</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1 class="title">freeCodeCamp News Author Page</h1>

    <main>
      <div id="author-container"></div>
      <button class="btn" id="load-more-btn">Load More Authors</button>
    </main>

    <script src="./script.js"></script>
  </body>
</html>
```

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --main-bg-color: #1b1b32;
  --light-grey: #f5f6f7;
  --dark-purple: #5a01a7;
  --golden-yellow: #feac32;
}

body {
  background-color: var(--main-bg-color);
  text-align: center;
}

.title {
  color: var(--light-grey);
  margin: 20px 0;
}

#author-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.user-card {
  border-radius: 15px;
  width: 300px;
  height: 350px;
  background-color: var(--light-grey);
  margin: 20px;
}

.user-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.purple-divider {
  background-color: var(--dark-purple);
  width: 100%;
  height: 15px;
}

.author-name {
  margin: 10px;
}

.bio {
  margin: 20px;
}

.error-msg {
  color: var(--light-grey);
}

.btn {
  cursor: pointer;
  width: 200px;
  margin: 10px;
  color: var(--main-bg-color);
  font-size: 14px;
  background-color: var(--golden-yellow);
  background-image: linear-gradient(#fecc4c, #ffac33);
  border-color: var(--golden-yellow);
  border-width: 3px;
}
```

```js
const authorContainer = document.getElementById('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let startingIndex = 0;
let endingIndex = 8;
let authorDataArr = [];

fetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')
  .then((res) => res.json())
  .then((data) => {
    authorDataArr = data;
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));  
  })
  .catch((err) => {
   authorContainer.innerHTML = '<p class="error-msg">There was an error loading the authors</p>';
  });

const fetchMoreAuthors = () => {
  startingIndex += 8;
  endingIndex += 8;

  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
  if (authorDataArr.length <= endingIndex) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.cursor = "not-allowed"
    loadMoreBtn.textContent = 'No more data to load';
  }
};

const displayAuthors = (authors) => {
  authors.forEach(({ author, image, url, bio }, index) => {
    authorContainer.innerHTML += `
    <div id="${index}" class="user-card">
      <h2 class="author-name">${author}</h2>
      <img class="user-img" src="${image}" alt="${author} avatar" />
      <div class="purple-divider"></div>
      <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>
      <a class="author-link" href="${url}" target="_blank">${author} author page</a>
    </div>
  `;
  });
};

loadMoreBtn.addEventListener('click', fetchMoreAuthors);
```

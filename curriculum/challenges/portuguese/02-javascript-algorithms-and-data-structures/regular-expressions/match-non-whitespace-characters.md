---
id: 587d7db9367417b2b2512ba4
title: Capture Caracteres Não-Espaço
challengeType: 1
forumTopicId: 18210
dashedName: match-non-whitespace-characters
---

# --description--

Você aprendeu a procurar por espaço em branco usando `\s` com um `s` minúsculo. Você também pode buscar tudo exceto espaços em branco.

Busque não-espaços em branco usando `\S` com um `s` maiúsculo. Este atalho não captura espaços em branco, retorno de carro, tabulações, feeds de formulário ou quebras de linha. O atalho é equivalente à classe de caracteres `[^ \r\t\f\n\v]`.

```js
let whiteSpace = "Whitespace. Whitespace everywhere!"
let nonSpaceRegex = /\S/g;
whiteSpace.match(nonSpaceRegex).length;
```

O valor retornado pelo método `.length` aqui é `32`.

# --instructions--

Modifique a regex `countNonWhiteSpace` para que encontre tudo exceto espaços em branco em uma string.

# --hints--

Sua regex deve usar a flag global.

```js
assert(countNonWhiteSpace.global);
```

Sua regex deve usar o atalho `\S` para capturar tudo menos espaços em branco.

```js
assert(/\\S/.test(countNonWhiteSpace.source));
```

Sua regex deve encontrar 35 não-espaços na string `Men are from Mars and women are from Venus.`

```js
assert(
  'Men are from Mars and women are from Venus.'.match(countNonWhiteSpace)
    .length == 35
);
```

Sua regex deve encontrar 23 não-espaços na string `Space: the final frontier.`

```js
assert('Space: the final frontier.'.match(countNonWhiteSpace).length == 23);
```

Sua regex deve encontrar 21 não-espaços na string `MindYourPersonalSpace`

```js
assert('MindYourPersonalSpace'.match(countNonWhiteSpace).length == 21);
```

# --seed--

## --seed-contents--

```js
let sample = "Whitespace is important in separating words";
let countNonWhiteSpace = /change/; // Change this line
let result = sample.match(countNonWhiteSpace);
```

# --solutions--

```js
let sample = "Whitespace is important in separating words";
let countNonWhiteSpace = /\S/g; // Change this line
let result = sample.match(countNonWhiteSpace);
```

---
id: 5900f4861000cf542c50ff98
title: 'Problema 281: topping per pizza'
challengeType: 1
forumTopicId: 301932
dashedName: problem-281-pizza-toppings
---

# --description--

Ti viene data una pizza (cerchio perfetto) che è stata tagliata in $m·n$ pezzi uguali e vuoi avere esattamente un condimento su ogni pezzo.

Sia $f(m, n)$ il numero di modi in cui puoi avere condimenti sulla pizza con $m$ condimenti diversi ($m ≥ 2$), usando ogni condimento su esattamente $n$ pezzi($n ≥ 1$). Le riflessioni sono considerate distinte, le rotazioni non lo sono.

Così, per esempio, $f(2,1) = 1$, $f(2,2) = f(3,1) = 2$ e $f(3,2) = 16$. $f(3,2)$ è mostrato sotto:

<img alt="animazione con 16 modi per avere 3 condimenti diversi, ciascuno su 2 pezzi" src="https://cdn.freecodecamp.org/curriculum/project-euler/pizza-toppings.gif" style="background-color: white; padding: 10px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 1.2rem;" />

Trova la somma di tutte le $f(m,n)$ in modo tale che $f(m,n) ≤ {10}^{15}$.

# --hints--

`pizzaToppings()` dovrebbe restituire `1485776387445623`.

```js
assert.strictEqual(pizzaToppings(), 1485776387445623);
```

# --seed--

## --seed-contents--

```js
function pizzaToppings() {

  return true;
}

pizzaToppings();
```

# --solutions--

```js
// solution required
```

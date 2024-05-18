document.addEventListener("DOMContentLoaded", () => {
  new e().qweu9rhtgi();
});
class t {
  constructor() {
    (this.qaeiurthg = []), (this.qeiruyght = []);
  }
  async loadLists() {
    await this.o9uibg9uiasr(
      "https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw/d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-La.txt",
      this.qaeiurthg
    ),
      await this.o9uibg9uiasr(
        "https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw/d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-Ta.txt",
        this.qeiruyght
      );
  }
  async o9uibg9uiasr(t, e) {
    const s = await fetch(t),
      r = await s.text();
    e.push(
      ...r
        .split("\n")
        .filter((t) => 5 === t.length)
        .map((t) => t.trim().toUpperCase())
    );
  }
}
class e {
  constructor() {
    (this.grid = document.querySelector(".grid")),
      (this.totalScorePointsSpan = document.getElementById("total")),
      (this.buttons = document.querySelectorAll(".keyboard button")),
      (this.wordListLoader = new t()),
      (this.PD = {
        A: 5,
        E: 5,
        L: 5,
        N: 5,
        R: 5,
        S: 5,
        T: 5,
        H: 4,
        I: 4,
        O: 4,
        C: 3,
        D: 3,
        P: 3,
        U: 3,
        Y: 3,
        B: 2,
        W: 2,
        F: 2,
        G: 2,
        J: 2,
        K: 2,
        M: 2,
        Q: 1,
        V: 1,
        X: 1,
        Z: 1,
      }),
      (this.RD = 10),
      (this.wordLength = 5),
      (this.maxGuesses = 6),
      (this.currentYear = new Date().getFullYear()),
      (this.wordOfTheDay = ""),
      (this.currentGuess = ""),
      (this.round = 0),
      (this.total = 0),
      (this.firstWordPoints = 0),
      (this.acceptableWords = new Set());
  }
  async qweu9rhtgi() {
    await this.wordListLoader.loadLists(),
      this.qwu9erhgt(),
      this.qeujri9hgtg(),
      this.uyq8gew0rt(),
      this.oiyhwert();
  }
  qwu9erhgt() {
    const t = new Date(),
      e = Math.floor(
        (t - new Date(t.getFullYear(), 0, 0)) / 1e3 / 60 / 60 / 24
      ),
      s = this.qiweorgt(
        this.currentYear,
        this.wordListLoader.qaeiurthg.length,
        365
      );
    (this.wordOfTheDay = this.wordListLoader.qaeiurthg[s[e]].toUpperCase()),
      this.wordListLoader.qaeiurthg.forEach((t) => this.acceptableWords.add(t)),
      this.wordListLoader.qeiruyght.forEach((t) => this.acceptableWords.add(t));
  }
  qiweorgt(t, e, s) {
    const r = new Set();
    let o = 0;
    for (; r.size < s; ) {
      const s = Math.floor(
        (1e5 * Math.abs(Math.sin(t + o) + Math.cos(t + o))) % e
      );
      r.add(s), o++;
    }
    return Array.from(r);
  }
  qeujri9hgtg() {
    for (let t = 0; t < this.wordLength * this.maxGuesses; t++) {
      const t = document.createElement("div");
      t.classList.add("cell"), this.grid.appendChild(t);
    }
  }
  uyq8gew0rt() {
    this.grid.querySelectorAll(".cell").forEach((t, e) => {
      const s = Math.floor(e / this.wordLength),
        r = e % this.wordLength;
      this.currentGuess.length > r && this.round === s
        ? (t.textContent = this.currentGuess[r])
        : s < this.round || (t.textContent = "");
    });
  }
  oiyhwert() {
    this.buttons.forEach((t) => {
      t.addEventListener("click", () => this.bvadsf(t.textContent));
    });
  }
  bvadsf(t) {
    if ("<<<" === t) this.currentGuess = this.currentGuess.slice(0, -1);
    else if ("Enter" === t) {
      if (this.currentGuess.length === this.wordLength)
        if (this.acceptableWords.has(this.currentGuess.toUpperCase())) {
          if (
            (this.w98iuhbet(),
            0 === this.round &&
              (this.firstWordPoints = this.calculateScore(this.currentGuess)),
            this.currentGuess.toUpperCase() === this.wordOfTheDay)
          )
            return (
              (this.total = this.firstWordPoints + this.round * this.RD),
              alert(
                `Congratulations! You guessed the word: ${this.wordOfTheDay}. Your total score is: ${this.total}`
              ),
              void (this.totalScorePointsSpan.textContent = this.total
                .toString()
                .padStart(1, "0"))
            );
          if (!(this.round < 5))
            return (
              (this.total = this.firstWordPoints + 60),
              void alert(
                `Game Over! The correct word was: ${this.wordOfTheDay}. Your total score is: ${this.total}`
              )
            );
          (this.total = this.firstWordPoints + this.round * this.RD),
            this.round++,
            (this.currentGuess = "");
        } else alert("Not a valid word");
    } else
      this.currentGuess.length < this.wordLength && (this.currentGuess += t);
    this.uyq8gew0rt(),
      (this.totalScorePointsSpan.textContent = this.total
        .toString()
        .padStart(1, "0"));
  }
  calculateScore(t) {
    return t.split("").reduce((t, e) => t + (this.PD[e.toUpperCase()] || 0), 0);
  }
  w98iuhbet() {
    const t = this.grid.querySelectorAll(".cell"),
      e = this.currentGuess.split(""),
      s = this.wordOfTheDay.split(""),
      r = {};
    e.forEach((e, o) => {
      const i = this.round * this.wordLength + o,
        a = t[i];
      e === s[o] &&
        ((a.style.backgroundColor = "green"),
        (s[o] = null),
        (r[e.toUpperCase()] = "green"));
    }),
      e.forEach((e, o) => {
        const i = this.round * this.wordLength + o,
          a = t[i];
        s.includes(e) && "green" !== a.style.backgroundColor
          ? ((a.style.backgroundColor = "#dac316"),
            (s[s.indexOf(e)] = null),
            r[e.toUpperCase()] || (r[e.toUpperCase()] = "#dac316"))
          : "green" !== a.style.backgroundColor &&
            "#dac316" !== a.style.backgroundColor &&
            ((a.style.backgroundColor = "#636363"),
            r[e.toUpperCase()] || (r[e.toUpperCase()] = "#636363"));
      }),
      this.tcpx(r);
  }
  tcpx(t) {
    this.buttons.forEach((e) => {
      const s = e.textContent.toUpperCase();
      t[s] && (e.style.backgroundColor = t[s]);
    });
  }
}

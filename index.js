const list = document.querySelector(".list");
const title = document.querySelector(".body__title");
const button = document.querySelector(".button");
const arrayTitle = [
  "space",
  "turtle",
  "expiremental",
  "stick",
  "window",
  "beer",
];
const notification = document.querySelector(".notification__block");
const notificationArea = document.querySelector(".notification");

//Titles
const elements = arrayTitle.map((element, id) => {
  return `<div id='500${id}' class='target'>${element}</div>`;
});

const renderList = elements.toString().replace(/[,]/g, "");
list.innerHTML = renderList;

const targerValue = document.querySelectorAll(".target");
let products = 0;

targerValue.forEach((targetBlock) => {
  targetBlock.addEventListener("click", (element) => {
    if (element.target.getAttribute("attribute") === "active") {
      element.target.removeAttribute("attribute");
      products--;
    } else {
      element.target.setAttribute("attribute", "active");
      products++;
    }
    title.innerHTML = `Выбрано: ${products}`;
  });
});

class Notification {
  constructor(params) {
    this.maxCount = params.maxCount;
    this.stack = params.stack;
    this.autoHide = params.autoHide;
    this.timeout = params.timeout;

    const objectColor = {
      secondary: "rgb(45, 197, 45)",
      primary: "rgb(16, 77, 189)",
      error: "red",
    };
    const overStack = 0;
    const color = "";
    const text = "";
    this.objectColor = objectColor;
    this.overStack = overStack;
    this.text = text;
    this.color = color;
  }

  alert(text, color) {
    if (this.stack < this.maxCount) {
      const notificationBlock = document.createElement("div");
      const title = document.createElement("h3");
      const cross = document.createElement("div");

      //add class
      notificationBlock.classList.add("notification__block");
      cross.classList.add("notification__cross");

      notificationBlock.style.backgroundColor = this.objectColor[color];
      title.innerText = text;

      //add child
      notificationBlock.append(title, cross);
      notificationArea.appendChild(notificationBlock);

      this.stack++;

      //logic for cross
      let timeoutID = 0;
      cross.addEventListener("click", () => {
        clearTimeout(timeoutID);
        this.transform(notificationBlock, -200);
        setTimeout(() => {
          notificationArea.removeChild(notificationBlock);
          this.stack--;
          this.check();
        }, 100);
      });

      this.transform(notificationBlock, -200);
      setTimeout(() => {
        notificationBlock.style.transition = "all ease .3s";
        this.transform(notificationBlock, 0);
      }, 200);

      if (this.autoHide) {
        setTimeout(() => {
          this.transform(notificationBlock, -200);
        }, this.timeout);
        timeoutID = setTimeout(() => {
          notificationArea.removeChild(notificationBlock);
          this.stack--;
          this.check();
        }, this.timeout + 250);
      }
    } else {
      this.overStack++;
      this.color = color;
      this.text = text;
    }
  }

  check() {
    if (this.overStack) {
      this.alert(this.text, this.color);
      this.overStack--;
    }
  }

  transform(node, percent) {
    node.style.transform = `translateX(${percent}%)`;
  }
}

const pushNotification = new Notification({
  timeout: 3000,
  autoHide: true,
  stack: notificationArea.childElementCount,
  maxCount: 3,
});

button.addEventListener("click", () => {
  if (!products) {
    pushNotification.alert("You didn't choose anything product", "error");
    return;
  }
  pushNotification.alert("Your item(s) was successfully add", "secondary");
});

//Progress Bar
const stageContainer = document.querySelector(".stage__container");
const successfull = document.querySelector(".stage__title");

class StageLine {
  constructor(params) {
    const successfullPercent = 0;
    this.countCircle = params.countCircle;
    this.activeColor = params.activeColor;
    this.successfullPercent = successfullPercent;
  }

  create() {
    const activeBtnID = 0;
    for (let i = 0; i <= this.countCircle; i++) {
      const circle = document.createElement("button");
      const p = document.createElement("p");
      const lineContainer = document.createElement("div");
      const lineTarget = document.createElement("div");

      circle.classList.add("circle");
      lineContainer.classList.add("line");
      lineTarget.classList.add("line__target");

      circle.id = i;
      p.innerText = i + 1;
      if (+circle.id !== activeBtnID) {
        circle.disabled = true;
      }

      circle.appendChild(p);
      lineContainer.appendChild(lineTarget);
      stageContainer.append(lineContainer, circle);

      circle.addEventListener("click", (e) => {
        if (this.successfullPercent == 100) {
          return;
        }
        circle.setAttribute("attr", "enable");
        lineTarget.setAttribute("attr", "enable");
        pushNotification.alert("Stage completed", "secondary");
        let buttons = Array.from(stageContainer.children).filter(
          (element) => element.className == "circle"
        );
        buttons[
          +e.currentTarget.id == buttons.length - 1
            ? +e.currentTarget.id
            : +e.currentTarget.id + 1
        ].disabled = false;
        this.successfullPercent = Math.floor(
          (100 / buttons.length) * (+e.currentTarget.id + 1)
        );
        successfull.innerHTML = `Завершено на: ${this.successfullPercent}%`;
      });
    }
  }
}
const stageLine = new StageLine({
  countCircle: 3,
  activeColor: "primary",
});
stageLine.create();

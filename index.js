const AddBttn = document.querySelector(".add_btn");
const RemoveBttn = document.querySelector(".remove_btn");
const ModalCont = document.querySelector(".modal_cont");
const mainCont = document.querySelector(".main_cont");

const ColorSelection = document.querySelectorAll(
  ".priority_color_cont > .color"
);
const NavbarColors = document.querySelectorAll(
  ".toolbox_priority_cont > .color"
);
const TextArea = document.querySelector(".text_area_cont  ");
const lockActive = document.querySelectorAll(".fa-lock");
const ticketTask = document.querySelector(".ticket_task");

let colors = ["lightpink", "lightgreen", "lightblue", "lightblack"];

const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

let ismodal = false;
let isRemove = false;
let modalTaskColor = "lightpink";
let islockactive = true;

function init() {
  if (tickets) {
    tickets.forEach((ticket) => {
      const { taskid, taskValue, taskColor } = ticket;
      createTask(taskid, taskValue, taskColor);
    });
  }
}

init();

ColorSelection.forEach((ele) => {
  ele.addEventListener("click", () => {
    ColorSelection.forEach((element) => {
      element.classList.remove("active");
    });
    ele.classList.add("active");
    modalTaskColor = ele.classList[0];
  });
});

NavbarColors.forEach((ele) => {
  ele.addEventListener("dblclick", () => {
    const ticket_cont = document.querySelectorAll(".ticket_cont");
    ticket_cont.forEach((child) => {
      child.style.display = "block";
    });
  });

  ele.addEventListener("click", () => {
    const activeNavColor = ele.classList[0];
    // Loop through all children and filter based on class match
    const ticket_cont = document.querySelectorAll(".ticket_cont");

    ticket_cont.forEach((child) => {
      if (child.children[0].classList.contains(activeNavColor)) {
        child.style.display = "block"; // Or any other styling logic to show the ticket
      } else {
        child.style.display = "none"; // Hides the non-matching items
      }
    });
  });
});

function createTask(taskid, taskValue, modalTaskColor) {
  const ColorActive = document.querySelector(".priority_color_cont > .active");
  // let colorEle = ColorActive.getAttribute("class").split(" ")[0];

  let TicketCont = document.createElement("div");

  TicketCont.setAttribute("class", "ticket_cont");

  TicketCont.innerHTML = `
  <div class='ticket_color ${modalTaskColor}'></div>
  <div class="ticket_id">${taskid}</div>
  <div class="ticket_task">
  ${taskValue}
  </div>
  <div class="ticket_lock">
  <i class="fa-solid fa-lock" aria-hidden="true"></i>
  </div>
  `;
  mainCont.appendChild(TicketCont);
  lockSelection(TicketCont);
  colorSelect(TicketCont);
}

function updateLocalStorage() {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function lockSelection(TicketCont) {
  const lockBox = TicketCont.querySelector(".ticket_lock");
  // const lockIcon = lockBox.children[0];
  lockBox.addEventListener("click", () => {
    islockactive = !islockactive;
    const ticketTask = TicketCont.querySelector(".ticket_task");
    const ticketId = TicketCont.children[1].innerText;
    const updateIndex = editIndex(ticketId);
    console.log(updateIndex, "==============updateindes");

    if (!islockactive) {
      lockBox.innerHTML = `  <i class="fa-solid fa-unlock" aria-hidden="true"></i>`;
      ticketTask.setAttribute("contenteditable", true);
    } else {
      lockBox.innerHTML = `  <i class="fa-solid fa-lock" aria-hidden="true"></i>`;
      ticketTask.setAttribute("contenteditable", false);
    }
    tickets[updateIndex].taskValue = ticketTask.innerText;
    updateLocalStorage();
  });
  // islockactive = !islockactive;
}

function colorSelect(TicketCont) {
  const colorElem = TicketCont.querySelector(".ticket_color");
  colorElem.addEventListener("click", () => {
    let activeColor = colorElem.classList[1];
    // let indexColor = 0;
    // switch (activeColor) {
    //   case "lightpink":
    //     indexColor = 0;
    //     break;
    //   case "lightgreen":
    //     indexColor = 1;
    //     break;
    //   case "lightblue":
    //     indexColor = 2;
    //     break;
    //   case "lightblack":
    //     indexColor = 3;
    //     break;
    //   default:
    //     indexColor = 0;
    //     break;
    // }

    let indexColor = colors.findIndex((color) => {
      return activeColor == color;
    });

    let newIndex = (indexColor + 1) % colors.length;
    // if (newIndex % colors.length) {
    // let newColor = colors[indexColor + 1];
    let newColor = colors[newIndex];
    colorElem.classList.remove(activeColor);
    colorElem.classList.add(newColor);

    const ColorIndex = tickets.findIndex((ticket) => {
      return ticket.taskColor == activeColor;
    });
    tickets[ColorIndex].taskColor = newColor;
    updateLocalStorage();

    // }
  });
}

function editIndex(id) {
  return tickets.findIndex((ticket) => {
    return ticket.taskid == id;
  });
}

AddBttn.addEventListener("click", () => {
  ismodal = !ismodal;
  if (ismodal) {
    ModalCont.style.display = "flex";
  } else {
    ModalCont.style.display = "none";
  }
});

RemoveBttn.addEventListener("click", () => {
  isRemove = !isRemove;
  if (isRemove) {
    alert("Remove Button is Activated");
    RemoveBttn.style.color = "red";
    const ticket_cont = document.querySelectorAll(".ticket_cont");
    ticket_cont.forEach((ele) => {
      ele.addEventListener("click", () => {
        const removeticketId = ele.children[1].innerText;
        if (isRemove) {
          const removeIndex = editIndex(removeticketId);
          tickets.splice(removeIndex, 1);
          ele.remove(); // This will remove the element from the DOM
          updateLocalStorage();
        }
      });
    });
  } else {
    RemoveBttn.style.color = "white";
  }
});

TextArea.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    const taskValue = TextArea.value;
    // const taskid = Date.now() % 1000000;
    const taskid = Math.random().toString(36).substring(2, 12);

    createTask(taskid, taskValue, modalTaskColor);
    tickets.push({ taskid, taskValue, taskColor: modalTaskColor });
    updateLocalStorage();
    ModalCont.style.display = "none";
    TextArea.value = "";
    ismodal = !ismodal;
  }
});

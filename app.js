//-------------------------------------- Data Controller ------------------------------------

const testModule1 = (function () {
  return {
    dataStructure: {
      allData: {
        names: [],
      },
    },
  };
})();

//-------------------------------------- UI Controller ---------------------------------------

const testModule2 = (function () {
  let data = testModule1.dataStructure.allData.names;
  let lineThrough;
  let obj;

  return {
    getInput: function () {
      let input = document.querySelector(".inputText").value;
      return input;
    },

    displayInput: function (entry) {
      if (entry && typeof entry === "string") {

        let id = uuid.v4()
        id = id.split("-")
        id = id.slice(0, 1)
        id = id[0].split("")
        id = id.filter(num => {
          return parseInt(num) == num
        })
        id = id.join("")

        const html = `<div class="items" id="${id}">
                        <div class="duo">
                          <div class="name"><img src="finger.png" class="finger">${entry.toUpperCase()}</div>
                        </div>
                          <ion-icon name="trash"></ion-icon>
                      </div>`;
        document
          .querySelector(".showInput")
          .insertAdjacentHTML("beforeend", html);

        obj = {
          name: entry,
          id: id,
          done: false,
        };

        data.push(obj);
        console.log(obj)
      } else if (entry && typeof entry === "object") {

        lineThrough = entry.done === false ? "" : "crossout";

        const html2 = `<div class="items" id="${entry.id}">
                         <div class="duo">
                           <div class="name ${lineThrough}"><img src="finger.png" class="finger">${entry.name.toUpperCase()}</div>
                         </div>
                         <ion-icon name="trash"></ion-icon>
                       </div>`;
        document
          .querySelector(".showInput")
          .insertAdjacentHTML("beforeend", html2);
        obj = entry
        data.push(obj);
        console.log(obj)
      } else {
        alert("No data!")
        return
      }

      localStorage.setItem("DATA", JSON.stringify(data));
    },

    lineThrough: function (item) {
      let elementID = item.parentNode.parentNode.id
      let itemID;

      for (let el of data) {
        itemID = el.id
        if (!item.classList.contains('crossout') && itemID == elementID) {
          item.classList.add('crossout')
          el.done = true
        } else if (item.classList.contains('crossout') && itemID == elementID) {
          item.classList.remove('crossout')
          el.done = false
        }

        localStorage.setItem("DATA", JSON.stringify(data));
      }
    },

    deleteItem: function (ID) {
      if (ID) {
        let element = document.getElementById(ID);
        element.parentNode.removeChild(element);

        data = data.filter((el) => {
          return el.id !== ID;
        });
      } else {
        return
      }
      localStorage.setItem("DATA", JSON.stringify(data));
    },

    clearInput: function () {
      document.querySelector(".inputText").value = "";
    },

    clearData: function () {
      const items = [...document.querySelectorAll(".items")];
      items.forEach((name) => {
        name.remove();
      });

      data = [];
      localStorage.setItem("DATA", JSON.stringify(data));
    },
  };
})();

//------------------------------------- App controller ---------------------------------------

const testModule3 = (function (testMod1, testMod2) {

  const getData = function (name) {
    name = testMod2.getInput();
    testMod2.displayInput(name);
    testMod2.clearInput();
    document.querySelector(".inputText").focus();
  };

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      getData();
    }
  });

  const crossOut = function (e) {
    const element = e.target
    testMod2.lineThrough(element)
  }

  const removeItem = function (e) {
    let itemID = e.target.parentNode.id;
    testMod2.deleteItem(itemID);
  };

  const deleteData = function () {
    testMod2.clearData();
  };

  return {
    init: function () {
      document.querySelector('.showInput').addEventListener('click', crossOut)
      document.querySelector(".btn").addEventListener("click", getData);
      document.querySelector(".clear").addEventListener("click", deleteData);
      document
        .querySelector(".showInput")
        .addEventListener("click", removeItem);
      let persons = JSON.parse(localStorage.getItem("DATA"));
      for (let el of persons) {
        if (persons.length > 0) {
          testMod2.displayInput(el);
        } else {
          getData(el.name)
        }
      }

    },
  };
})(testModule1, testModule2);

testModule3.init();

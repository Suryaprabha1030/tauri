const preventInspectElement = () => {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "production"
  ) {
    document.onkeydown = function (e) {
      //Windows
      if (e.keyCode === 123) {
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === "I".charCodeAt(0)) {
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === "C".charCodeAt(0)) {
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === "J".charCodeAt(0)) {
        return false;
      }

      // Mac
      if (e.metaKey && e.altKey && e.keyCode === "I".charCodeAt(0)) {
        return false;
      }
      if (e.metaKey && e.altKey && e.keyCode === "C".charCodeAt(0)) {
        return false;
      }
      if (e.metaKey && e.altKey && e.keyCode === "J".charCodeAt(0)) {
        return false;
      }
    };

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }
};

export const printConsole = () => {
  console.log("%cGreetings from Zoonest!", "color: green; font-size: 50px");
  console.log(
    "%cPlease do not steal code. Do the right thing and collaborate with us! We would love to support your idea!",
    "color: white; font-size: 25px"
  );

  // get node env and prevent inspect element only on prod
  process.env.NODE_ENV === "production" && preventInspectElement();
};

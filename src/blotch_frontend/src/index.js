//import { blotch_frontend } from "../../declarations/blotch_frontend";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  //const name = document.getElementById("name").value.toString();
  const name = "Test";

  button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  //const greeting = await blotch_frontend.greet(name);

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greeting;

  return false;
});
